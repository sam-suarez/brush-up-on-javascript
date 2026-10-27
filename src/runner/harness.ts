// Builds the script that runs user code followed by the challenge tests, and executes it in the current realm.
// The sandbox iframe and tests/content.test.ts both call `execute`, so what users run is what the suite validates.
import type { TestCase } from "../content/types";
import { DEFAULT_TIMEOUT_MS } from "../content/types";
import { inspect } from "./inspect";
import { createRuntime, type Runtime } from "./runtime";
import type { RunError, RunResult, TestResult } from "./types";

const SOURCE_URL = "challenge.js";
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
  ...args: string[]
) => (runtime: Runtime) => Promise<void>;

export interface BuiltScript {
  source: string;
  /** 1-based script line on which the user's first line sits. */
  userStartLine: number;
  userLineCount: number;
}

const PRELUDE = [
  `"use strict";`,
  `const { assert, AssertionError, console, logs, clearLogs, tick, wait } = __brush.api;`,
  `await (async () => {`,
];

export function buildScript(userCode: string, tests: TestCase[]): BuiltScript {
  const testBlocks = tests.map((test) => `[${JSON.stringify(test.name)}, async () => {\n${test.code}\n}],`);
  const source = [
    ...PRELUDE,
    userCode,
    `;__brush.userDone();`,
    `await __brush.runTests([`,
    ...testBlocks,
    `]);`,
    `})();`,
    `//# sourceURL=${SOURCE_URL}`,
  ].join("\n");
  return { source, userStartLine: PRELUDE.length + 1, userLineCount: userCode.split("\n").length };
}

/** Lines the engine's Function wrapper adds before the body. 2 in V8, measured once per realm. */
let headerLines: number | undefined;
function functionHeaderLines(): number {
  if (headerLines === undefined) {
    try {
      new Function(`throw new Error("calibrate");\n//# sourceURL=__calibrate.js`)();
    } catch (error) {
      const match = /__calibrate\.js:(\d+)/.exec((error as Error).stack ?? "");
      headerLines = match ? Number(match[1]) - 1 : 2;
    }
  }
  return headerLines ?? 2;
}

function userLineFromStack(stack: string | undefined, built: BuiltScript): number | undefined {
  if (!stack) return undefined;
  for (const match of stack.matchAll(/challenge\.js:(\d+):\d+/g)) {
    const line = Number(match[1]) - functionHeaderLines() - built.userStartLine + 1;
    if (line >= 1 && line <= built.userLineCount) return line;
  }
  return undefined;
}

export function serializeError(error: unknown, built?: BuiltScript): RunError {
  if (error instanceof Error) {
    return {
      kind: "runtime",
      message: `${error.name}: ${error.message}`,
      stack: error.stack,
      line: built ? userLineFromStack(error.stack, built) : undefined,
    };
  }
  return { kind: "runtime", message: `Uncaught ${inspect(error)}` };
}

/** Locates a syntax error in user code. Acorn is loaded only when a syntax error actually happens. */
async function locateSyntaxError(userCode: string, fallback: string): Promise<RunError> {
  try {
    const { parse } = await import("acorn");
    parse(`"use strict";\n(async () => {\n${userCode}\n})`, { ecmaVersion: "latest", sourceType: "script" });
  } catch (error) {
    const err = error as SyntaxError & { loc?: { line: number; column: number } };
    if (err.loc) {
      const line = err.loc.line - 2;
      return { kind: "syntax", message: `SyntaxError: ${err.message.replace(/\s*\(\d+:\d+\)$/, "")}`, line };
    }
  }
  return { kind: "syntax", message: `SyntaxError: ${fallback}` };
}

export interface ExecuteOptions {
  timeoutMs?: number;
  /** Lets the caller observe the runtime, for example to route uncaught async errors into its console. */
  onRuntime?: (runtime: Runtime) => void;
}

const skip = (tests: TestCase[], from: number): TestResult[] =>
  tests.slice(from).map((t) => ({ name: t.name, status: "skipped" }));

export async function execute(
  code: string,
  tests: TestCase[],
  options: ExecuteOptions = {},
): Promise<RunResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const started = performance.now();
  const runtime = createRuntime(timeoutMs);
  options.onRuntime?.(runtime);
  const built = buildScript(code, tests);
  const done = (result: Omit<RunResult, "durationMs" | "logs">): RunResult => ({
    ...result,
    logs: runtime.lines,
    durationMs: Math.round(performance.now() - started),
  });

  let fn: (runtime: Runtime) => Promise<void>;
  try {
    fn = new AsyncFunction("__brush", built.source);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return done({ status: "error", tests: skip(tests, 0), error: await locateSyntaxError(code, message) });
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  const outcome = await Promise.race([
    fn(runtime).then(
      () => ({ kind: "done" as const }),
      (error: unknown) => ({ kind: "error" as const, error }),
    ),
    new Promise<{ kind: "timeout" }>((resolve) => {
      timer = setTimeout(() => resolve({ kind: "timeout" }), timeoutMs);
    }),
  ]);
  clearTimeout(timer);

  const results = [...runtime.results];

  if (outcome.kind === "timeout") {
    const current = runtime.currentTest();
    if (current) results.push({ name: current, status: "fail", message: `Timed out after ${timeoutMs} ms` });
    return done({
      status: "timeout",
      tests: [...results, ...skip(tests, results.length)],
      error: runtime.isUserDone()
        ? undefined
        : { kind: "runtime", message: `Timed out after ${timeoutMs} ms before the tests started` },
    });
  }

  if (outcome.kind === "error") {
    return done({
      status: "error",
      tests: [...results, ...skip(tests, results.length)],
      error: serializeError(outcome.error, built),
    });
  }

  const all = [...results, ...skip(tests, results.length)];
  return done({ status: all.every((t) => t.status === "pass") ? "pass" : "fail", tests: all });
}

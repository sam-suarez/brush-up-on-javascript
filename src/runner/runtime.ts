// The per-run runtime handed to the harness script as `__brush`: console shim, assert, logs, tick, wait.
import { AssertionError, assert } from "./assert";
import { formatArgs, inspect } from "./inspect";
import type { ConsoleLevel, ConsoleLine, TestResult } from "./types";

// Captured at load so user code that overrides timers cannot break the harness.
const realSetTimeout = globalThis.setTimeout.bind(globalThis);

export type TestFn = () => Promise<void>;

export interface Runtime {
  /** Values destructured into the harness script's scope. */
  api: {
    assert: typeof assert;
    AssertionError: typeof AssertionError;
    console: Record<string, (...args: unknown[]) => void>;
    logs: string[];
    clearLogs: () => void;
    tick: () => Promise<void>;
    wait: (ms: number) => Promise<void>;
  };
  userDone: () => void;
  runTests: (tests: [string, TestFn][]) => Promise<void>;

  lines: ConsoleLine[];
  results: TestResult[];
  isUserDone: () => boolean;
  currentTest: () => string | undefined;
  /** Called for every console line; the sandbox uses it to stream logs that arrive after a run. */
  onLine?: (line: ConsoleLine) => void;
  record: (level: ConsoleLevel, text: string) => void;
}

export function createRuntime(timeoutMs: number): Runtime {
  const lines: ConsoleLine[] = [];
  const logs: string[] = [];
  const results: TestResult[] = [];
  let userFinished = false;
  let current: string | undefined;
  let indent = "";
  const counts = new Map<string, number>();
  const timers = new Map<string, number>();

  const runtime: Runtime = {
    lines,
    results,
    isUserDone: () => userFinished,
    currentTest: () => current,
    record(level, text) {
      const line = { level, text: indent ? text.replace(/^/gm, indent) : text };
      lines.push(line);
      logs.push(text);
      runtime.onLine?.(line);
    },
    userDone() {
      userFinished = true;
    },
    async runTests(tests) {
      for (const [name, fn] of tests) {
        current = name;
        try {
          await fn();
          results.push({ name, status: "pass" });
        } catch (error) {
          results.push(toFailure(name, error));
        }
      }
      current = undefined;
    },
    api: {
      assert,
      AssertionError,
      logs,
      clearLogs: () => {
        logs.length = 0;
      },
      tick: () => new Promise((resolve) => realSetTimeout(resolve, 0)),
      wait: (ms) => new Promise((resolve) => realSetTimeout(resolve, Math.min(Math.max(ms, 0), timeoutMs))),
      console: {},
    },
  };

  const write =
    (level: ConsoleLevel) =>
    (...args: unknown[]) =>
      runtime.record(level, formatArgs(args));

  runtime.api.console = {
    log: write("log"),
    info: write("info"),
    debug: write("log"),
    trace: write("log"),
    warn: write("warn"),
    error: write("error"),
    dir: (value: unknown) => runtime.record("log", inspect(value)),
    table: (value: unknown) => runtime.record("log", inspect(value)),
    assert: (condition: unknown, ...args: unknown[]) => {
      if (!condition)
        runtime.record("error", `Assertion failed${args.length ? `: ${formatArgs(args)}` : ""}`);
    },
    count: (label = "default") => {
      const n = (counts.get(String(label)) ?? 0) + 1;
      counts.set(String(label), n);
      runtime.record("log", `${label}: ${n}`);
    },
    countReset: (label = "default") => {
      counts.delete(String(label));
    },
    group: (...args: unknown[]) => {
      if (args.length) runtime.record("log", formatArgs(args));
      indent += "  ";
    },
    groupCollapsed: (...args: unknown[]) => runtime.api.console.group!(...args),
    groupEnd: () => {
      indent = indent.slice(2);
    },
    time: (label = "default") => {
      timers.set(String(label), performance.now());
    },
    timeEnd: (label = "default") => {
      const start = timers.get(String(label));
      if (start === undefined) return;
      timers.delete(String(label));
      runtime.record("log", `${label}: ${(performance.now() - start).toFixed(3)}ms`);
    },
    clear: () => {},
  };

  return runtime;
}

function toFailure(name: string, error: unknown): TestResult {
  if (error instanceof AssertionError) {
    return { name, status: "fail", message: error.message, actual: error.actual, expected: error.expected };
  }
  const message = error instanceof Error ? `${error.name}: ${error.message}` : `Uncaught ${inspect(error)}`;
  return { name, status: "fail", message };
}

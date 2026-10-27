// App-side sandbox management: one iframe per host element, recreated for every run.
import type { ConsoleLine, RunRequest, RunResult, SandboxMessage, SandboxRunMessage } from "./types";
import { DEFAULT_TIMEOUT_MS } from "../content/types";

/** Extra time on top of the challenge timeout before the iframe is killed (covers sync infinite loops). */
const KILL_GRACE_MS = 1500;
const READY_TIMEOUT_MS = 5000;

let nextId = 1;
const frames = new WeakMap<HTMLElement, { iframe: HTMLIFrameElement; cleanup: () => void }>();

export interface RunOptions {
  /** Called for console lines produced after the result arrived (timers, preview interactions). */
  onLateLog?: (line: ConsoleLine) => void;
  /** Accessible title for a visible preview frame. */
  title?: string;
}

function createFrame(host: HTMLElement, title: string): HTMLIFrameElement {
  disposeSandbox(host);
  const iframe = document.createElement("iframe");
  iframe.setAttribute("sandbox", "allow-scripts");
  iframe.title = title;
  iframe.src = "/sandbox.html";
  iframe.className = "block h-full w-full border-0 bg-transparent";
  host.replaceChildren(iframe);
  return iframe;
}

export function disposeSandbox(host: HTMLElement) {
  const frame = frames.get(host);
  if (!frame) return;
  frame.cleanup();
  frame.iframe.remove();
  frames.delete(host);
}

function timeoutResult(request: RunRequest, timeoutMs: number, started: number): RunResult {
  return {
    status: "timeout",
    logs: [],
    tests: request.tests.map((t) => ({ name: t.name, status: "skipped" })),
    error: {
      kind: "runtime",
      message: `Timed out after ${timeoutMs} ms. Is there an infinite loop?`,
    },
    durationMs: Math.round(performance.now() - started),
  };
}

export function runInSandbox(
  request: RunRequest,
  host: HTMLElement,
  options: RunOptions = {},
): Promise<RunResult> {
  const id = nextId++;
  const timeoutMs = request.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const started = performance.now();
  const iframe = createFrame(host, options.title ?? "Code sandbox");

  return new Promise((resolve) => {
    let settled = false;
    let timer = setTimeout(() => finish(timeoutResult(request, READY_TIMEOUT_MS, started)), READY_TIMEOUT_MS);

    const finish = (result: RunResult, kill = false) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (kill) disposeSandbox(host);
      resolve(result);
    };

    const onMessage = (event: MessageEvent<SandboxMessage>) => {
      if (event.source !== iframe.contentWindow) return;
      const data = event.data;
      if (data.type === "ready") {
        clearTimeout(timer);
        timer = setTimeout(
          () => finish(timeoutResult(request, timeoutMs, started), true),
          timeoutMs + KILL_GRACE_MS,
        );
        const message: SandboxRunMessage = { type: "run", id, request };
        iframe.contentWindow?.postMessage(message, "*");
      } else if (data.id === id && data.type === "result") {
        finish(data.result);
      } else if (data.id === id && data.type === "log") {
        options.onLateLog?.(data.line);
      }
    };

    window.addEventListener("message", onMessage);
    frames.set(host, {
      iframe,
      cleanup: () => {
        window.removeEventListener("message", onMessage);
        finish(timeoutResult(request, timeoutMs, started));
      },
    });
  });
}

// Runs inside the sandboxed iframe (opaque origin). Bundled as a classic inline script by vite.config.ts.
import { execute } from "./harness";
import { inspect } from "./inspect";
import type { Runtime } from "./runtime";
import type { SandboxMessage, SandboxRunMessage } from "./types";

let active: { id: number; runtime: Runtime; finished: boolean } | undefined;

const post = (message: SandboxMessage) => parent.postMessage(message, "*");

window.addEventListener("error", (event) => {
  const message =
    event.error instanceof Error ? `${event.error.name}: ${event.error.message}` : event.message;
  active?.runtime.record("error", `Uncaught ${message}`);
});

window.addEventListener("unhandledrejection", (event) => {
  const reason =
    event.reason instanceof Error ? `${event.reason.name}: ${event.reason.message}` : inspect(event.reason);
  active?.runtime.record("error", `Uncaught (in promise) ${reason}`);
});

window.addEventListener("message", async (event: MessageEvent<SandboxRunMessage>) => {
  if (event.source !== parent || event.data?.type !== "run") return;
  const { id, request } = event.data;
  document.body.innerHTML = request.html ?? "";
  const result = await execute(request.code, request.tests, {
    timeoutMs: request.timeoutMs,
    onRuntime: (runtime) => {
      const run = { id, runtime, finished: false };
      active = run;
      // Logs produced after the result is posted (timers, event handlers in the preview) are streamed.
      runtime.onLine = (line) => {
        if (run.finished) post({ type: "log", id, line });
      };
    },
  });
  if (active?.id === id) active.finished = true;
  post({ type: "result", id, result });
});

post({ type: "ready" });

# 06 — Runner

User code must never run in the app's window: it would be able to touch `localStorage`, the DOM of the app, and the React tree. It runs in a sandboxed iframe instead.

## Sandbox document (`public/sandbox.html`)

A static page loaded into `<iframe sandbox="allow-scripts" src="/sandbox.html">`. Without `allow-same-origin` the iframe has an opaque origin: it cannot read the app's storage or DOM. It contains only a script that:

1. Listens for a `run` message `{ id, script, html }`.
2. Sets `document.body.innerHTML = html ?? ""`.
3. Installs a console shim that records every call (`log`, `info`, `warn`, `error`, `table`, `dir`) as `{ level, text }` with Node-like formatting of arguments (objects via a safe inspect, not `JSON.stringify`).
4. Installs `window.onerror` and `unhandledrejection` handlers to capture uncaught errors.
5. Evaluates `script` with `new Function` inside a try/catch, awaits the returned promise.
6. Posts `{ id, type: "result", ... }` back to the parent.

The sandbox is recreated for every run (remove the iframe, append a new one). That is the only reliable way to stop an infinite loop: the parent starts a 3 s timer (or `challenge.timeoutMs`) and if no result arrives it kills the iframe and reports a timeout. Creating the iframe takes a few milliseconds, which is fine.

## Script built by the harness (`src/runner/harness.ts`)

```js
"use strict";
const __brush = { logs: [], results: [] };
/* assert.ts source is inlined here, defining `assert`, `AssertionError`, `logs` getter, `clearLogs`, `tick`, `wait` */
let __userError = null;
try {
  await (async () => {
    /* USER CODE */
    ;
    /* for each test: */
    __brush.results.push(await __brush.runTest("name", async () => {
      /* TEST CODE */
    }));
  })();
} catch (e) {
  __userError = __brush.serializeError(e);
}
return { logs: __brush.logs, results: __brush.results, userError: __userError };
```

Points worth noting:

- User code and tests live in the same async function so tests can reference the user's `const`/`let`/`function` declarations.
- A syntax error in user code makes the whole `new Function` throw before anything runs. The sandbox reports it as `{ kind: "syntax", message, line }` with the line number adjusted for the harness prefix.
- A runtime error at the top level of user code (for example a `fix` challenge that throws) aborts before any test runs. It is reported as `{ kind: "runtime" }` and all tests are shown as "not run".
- Each test runs in its own try/catch so later tests still run after a failure.
- Tests run in order and may `await`.
- `strict mode` is on so accidental globals (used in the `global-leak` challenge) throw as intended.

## Result shape (`src/runner/types.ts`)

```ts
interface RunResult {
  status: "pass" | "fail" | "error" | "timeout";
  logs: ConsoleLine[];                    // { level, text }
  tests: TestResult[];                    // { name, status: "pass" | "fail" | "skipped", message?, actual?, expected? }
  error?: { kind: "syntax" | "runtime"; message: string; stack?: string; line?: number };
  durationMs: number;
}
```

`status` is `pass` only when there is no error and every test passed.

## Assertion library (`src/runner/assert.ts`)

Written once as a plain JS source string (so it can be inlined into the sandbox script) plus a `.d.ts`-style type for editor autocompletion in content files. `deepEqual` handles arrays, plain objects, `Map`, `Set`, `Date`, `RegExp`, `NaN`, `-0`, and typed arrays, with cycle detection. Error messages are short and include a compact `actual`/`expected` rendering.

## Using the same harness in Node (`tests/content.test.ts`)

The validation suite imports `buildScript` from the harness, wraps it in `new AsyncFunction`, and runs it inside Vitest's `happy-dom` environment with `document.body.innerHTML = challenge.html`. The console shim is the same source as the sandbox's. This means the exact script a user runs is the script that is validated.

## Security notes

- `allow-scripts` without `allow-same-origin`: the sandbox cannot access the parent, cookies, or storage.
- No `allow-top-navigation`, no `allow-forms`, no `allow-popups`.
- `postMessage` target origin is `"*"` from the sandbox (its origin is opaque); the parent validates `event.source === iframe.contentWindow` and the run id before accepting a message.
- The app never evaluates content strings in its own window.

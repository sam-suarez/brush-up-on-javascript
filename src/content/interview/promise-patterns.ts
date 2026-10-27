import type { Topic } from "../types";

/** Test helper: resolves (or rejects with an Error) after `ms`. */
const LATER = `const later = (ms, value, fail = false) =>\n  new Promise((resolve, reject) => setTimeout(() => (fail ? reject(new Error(value)) : resolve(value)), ms));\n`;

/** Wraps a test body with a spy on the named built-in (delegating, so nothing else breaks) and asserts it went unused. */
const without = (name: string, body: string) =>
  `const original = Promise.${name};\nlet usedBuiltin = false;\nPromise.${name} = function (...args) { usedBuiltin = true; return original.apply(this, args); };\ntry {\n${body}\n} finally {\n  Promise.${name} = original;\n}\nassert.ok(!usedBuiltin, "don't call Promise.${name}");`;

const topic: Topic = {
  course: "interview",
  slug: "promise-patterns",
  title: "Promise Patterns",
  description: "Implement the combinators, retries, timeouts, pools and queues.",
  tags: ["promises", "async"],
  count: 10,
  challenges: [
    {
      slug: "sleep",
      title: "Implement sleep",
      kind: "implement",
      difficulty: 1,
      tags: ["async"],
      description: `Write \`sleep(ms)\` that returns a promise which resolves with \`undefined\` after \`ms\` milliseconds.

Example: \`await sleep(20)\` → \`undefined\`, roughly 20 ms later`,
      starter: `function sleep(ms) {\n  \n}`,
      solution: `function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
      tests: [
        { name: "returns a promise", code: `assert.ok(sleep(1) instanceof Promise);` },
        {
          name: "resolves after the delay, not before",
          code: `let done = false;\nconst p = sleep(30).then(() => { done = true; });\nawait tick();\nassert.equal(done, false);\nawait p;\nassert.equal(done, true);`,
        },
        { name: "resolves with undefined", code: `assert.equal(await sleep(1), undefined);` },
      ],
    },
    {
      slug: "implement-all",
      title: "Implement Promise.all",
      kind: "implement",
      difficulty: 3,
      tags: ["async"],
      description: `Write \`promiseAll(iterable)\` that behaves like \`Promise.all\`, without calling \`Promise.all\` (\`Promise.resolve\` and \`new Promise\` are fine). It resolves with the values in input order (not settle order), rejects with the reason of the first item to reject, and treats non-promise values as already resolved.

Accept any iterable. An empty iterable resolves to \`[]\`.

Example: \`await promiseAll([later(20, "a"), later(5, "b"), 3])\` → \`["a", "b", 3]\`

In the examples, \`later(ms, value)\` resolves with \`value\` after \`ms\` ms (the tests define it).`,
      starter: `function promiseAll(iterable) {\n  \n}`,
      solution: `function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = [...iterable];
    const results = new Array(items.length);
    let remaining = items.length;
    if (remaining === 0) return resolve(results);
    items.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;
        remaining -= 1;
        if (remaining === 0) resolve(results);
      }, reject);
    });
  });
}`,
      tests: [
        {
          name: "resolves values in input order",
          code: without("all", `${LATER}assert.deepEqual(await promiseAll([later(20, "a"), later(5, "b"), 3]), ["a", "b", 3]);`),
        },
        {
          name: "rejects with the first rejection",
          code: without("all", `${LATER}await assert.rejects(promiseAll([later(30, "slow"), later(5, "boom", true), later(15, "late", true)]), "boom");`),
        },
        {
          name: "resolves an empty iterable to []",
          code: without("all", `assert.deepEqual(await promiseAll([]), []);`),
        },
        {
          name: "accepts any iterable",
          code: without("all", `assert.deepEqual(await promiseAll(new Set([1, Promise.resolve(2)])), [1, 2]);`),
        },
      ],
      hints: ["Count how many are still pending instead of checking `results.length` (sparse arrays lie)."],
    },
    {
      slug: "implement-all-settled",
      title: "Implement Promise.allSettled",
      kind: "implement",
      difficulty: 2,
      tags: ["async"],
      description: `Write \`allSettled(iterable)\` that behaves like \`Promise.allSettled\`, without calling \`Promise.allSettled\` (\`Promise.all\` is fine). It never rejects; it resolves, in input order, with \`{ status: "fulfilled", value }\` or \`{ status: "rejected", reason }\` for each item. Non-promise values count as fulfilled; an empty iterable resolves to \`[]\`.

Example: \`await allSettled([1, Promise.reject("x")])\` → \`[{ status: "fulfilled", value: 1 }, { status: "rejected", reason: "x" }]\``,
      starter: `function allSettled(iterable) {\n  \n}`,
      solution: `function allSettled(iterable) {
  return Promise.all(
    [...iterable].map((item) =>
      Promise.resolve(item).then(
        (value) => ({ status: "fulfilled", value }),
        (reason) => ({ status: "rejected", reason }),
      ),
    ),
  );
}`,
      tests: [
        {
          name: "reports every outcome in input order",
          code: without("allSettled", `${LATER}const results = await allSettled([later(20, "a"), later(5, "b", true), 3]);\nassert.equal(results[1].reason.message, "b");\nresults[1].reason = "b";\nassert.deepEqual(results, [\n  { status: "fulfilled", value: "a" },\n  { status: "rejected", reason: "b" },\n  { status: "fulfilled", value: 3 },\n]);`),
        },
        {
          name: "never rejects",
          code: without("allSettled", `const results = await allSettled([Promise.reject("x"), Promise.reject("y")]);\nassert.deepEqual(results, [{ status: "rejected", reason: "x" }, { status: "rejected", reason: "y" }]);`),
        },
        {
          name: "resolves an empty iterable to []",
          code: without("allSettled", `assert.deepEqual(await allSettled([]), []);`),
        },
      ],
    },
    {
      slug: "implement-race",
      title: "Implement Promise.race",
      kind: "implement",
      difficulty: 2,
      tags: ["async"],
      description: `Write \`race(iterable)\` that behaves like \`Promise.race\`, without calling \`Promise.race\`: it settles the same way as the first item to settle, fulfilled or rejected. Non-promise values count as already resolved. An empty iterable returns a promise that stays pending forever.

Example: \`await race([later(20, "slow"), later(5, "fast")])\` → \`"fast"\`

In the examples, \`later(ms, value)\` resolves with \`value\` after \`ms\` ms (the tests define it).`,
      starter: `function race(iterable) {\n  \n}`,
      solution: `function race(iterable) {
  return new Promise((resolve, reject) => {
    for (const item of iterable) {
      Promise.resolve(item).then(resolve, reject);
    }
  });
}`,
      tests: [
        {
          name: "fulfils with the first value to settle",
          code: without("race", `${LATER}assert.equal(await race([later(20, "slow"), later(5, "fast")]), "fast");`),
        },
        {
          name: "rejects when the first to settle rejects",
          code: without("race", `${LATER}await assert.rejects(race([later(20, "slow"), later(5, "boom", true)]), "boom");`),
        },
        {
          name: "a plain value wins over pending promises",
          code: without("race", `${LATER}assert.equal(await race([later(10, "promise"), "value"]), "value");`),
        },
        {
          name: "stays pending for an empty iterable",
          code: `let settled = false;\nconst p = race([]);\nassert.ok(p instanceof Promise);\np.then(() => { settled = true; }, () => { settled = true; });\nawait tick();\nawait tick();\nassert.equal(settled, false);`,
        },
      ],
    },
    {
      slug: "retry",
      title: "Retry with attempts",
      kind: "implement",
      difficulty: 2,
      tags: ["async"],
      description: `Write \`retry(fn, attempts, delayMs = 0)\`. It calls the async function \`fn\` until it fulfils, at most \`attempts\` times, waiting \`delayMs\` between attempts. It resolves with the first successful value, or rejects with the error from the last attempt.

A synchronous throw from \`fn\` counts as a failed attempt. Don't call \`fn\` again after it succeeds.

Example: with \`flaky\` failing twice then returning \`"ok"\`, \`await retry(flaky, 3)\` → \`"ok"\` after 3 calls`,
      starter: `async function retry(fn, attempts, delayMs = 0) {\n  \n}`,
      solution: `async function retry(fn, attempts, delayMs = 0) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastError;
}`,
      tests: [
        {
          name: "resolves once an attempt succeeds",
          code: `let calls = 0;\nconst flaky = async () => {\n  calls++;\n  if (calls < 3) throw new Error("fail " + calls);\n  return "ok";\n};\nassert.equal(await retry(flaky, 5), "ok");\nassert.equal(calls, 3);`,
        },
        {
          name: "rejects with the last error after all attempts",
          code: `let calls = 0;\nconst failing = async () => { calls++; throw new Error("fail " + calls); };\nawait assert.rejects(retry(failing, 3), "fail 3");\nassert.equal(calls, 3);`,
        },
        {
          name: "treats a synchronous throw as a failed attempt",
          code: `let calls = 0;\nconst f = () => { calls++; if (calls === 1) throw new Error("sync"); return Promise.resolve("second"); };\nassert.equal(await retry(f, 2), "second");`,
        },
        {
          name: "waits delayMs between attempts",
          code: `const times = [];\nconst failing = async () => { times.push(performance.now()); throw new Error("no"); };\nawait assert.rejects(retry(failing, 2, 20));\nassert.equal(times.length, 2);\nassert.ok(times[1] - times[0] >= 15, "gap was " + (times[1] - times[0]) + " ms");`,
        },
      ],
    },
    {
      slug: "with-timeout",
      title: "Timeout wrapper",
      kind: "implement",
      difficulty: 2,
      tags: ["async"],
      description: `Write \`withTimeout(promise, ms)\` that settles like \`promise\` if it settles within \`ms\` milliseconds. Otherwise it rejects with an \`Error\` whose message is \`"Timed out after <ms> ms"\`.

Clean up after yourself: once \`promise\` settles, the timer should be cleared.

Example: \`await withTimeout(later(50, "x"), 10)\` → rejects with \`Error: Timed out after 10 ms\`

In the examples, \`later(ms, value)\` resolves with \`value\` after \`ms\` ms (the tests define it).`,
      starter: `function withTimeout(promise, ms) {\n  \n}`,
      solution: `function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Timed out after " + ms + " ms")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}`,
      tests: [
        {
          name: "resolves when the promise is fast enough",
          code: `${LATER}assert.equal(await withTimeout(later(5, "fast"), 40), "fast");`,
        },
        {
          name: "rejects with a timeout error when too slow",
          code: `${LATER}const slow = later(40, "slow");\nawait assert.rejects(withTimeout(slow, 10), /^Timed out after 10 ms$/);\nawait slow;`,
        },
        {
          name: "passes through a rejection",
          code: `${LATER}await assert.rejects(withTimeout(later(5, "nope", true), 40), "nope");`,
        },
      ],
      hints: ["`Promise.race` against a promise that rejects on a timer."],
    },
    {
      slug: "sequential",
      title: "Run async tasks sequentially",
      kind: "implement",
      difficulty: 2,
      tags: ["async"],
      description: `Write \`runSequentially(tasks)\`, where each task is a function returning a promise. Start each task only after the previous one has fulfilled, and resolve with all results in order.

If a task rejects, reject with its error and don't start the remaining tasks. An empty list resolves to \`[]\`.

Example: \`await runSequentially([() => later(10, "a"), () => later(5, "b")])\` → \`["a", "b"]\`

In the examples, \`later(ms, value)\` resolves with \`value\` after \`ms\` ms (the tests define it).`,
      starter: `async function runSequentially(tasks) {\n  \n}`,
      solution: `async function runSequentially(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}`,
      tests: [
        {
          name: "resolves results in order",
          code: `${LATER}assert.deepEqual(await runSequentially([() => later(15, "a"), () => later(5, "b"), () => later(1, "c")]), ["a", "b", "c"]);`,
        },
        {
          name: "never runs two tasks at once",
          code: `${LATER}let active = 0;\nlet maxActive = 0;\nconst task = (ms) => async () => {\n  active++;\n  maxActive = Math.max(maxActive, active);\n  await later(ms);\n  active--;\n};\nawait runSequentially([task(10), task(5), task(1)]);\nassert.equal(maxActive, 1);`,
        },
        {
          name: "stops at the first rejection",
          code: `${LATER}const started = [];\nconst tasks = ["a", "b", "c"].map((name) => () => {\n  started.push(name);\n  return later(2, name, name === "b");\n});\nawait assert.rejects(runSequentially(tasks), "b");\nawait wait(10);\nassert.deepEqual(started, ["a", "b"]);`,
        },
        { name: "resolves [] for no tasks", code: `assert.deepEqual(await runSequentially([]), []);` },
      ],
    },
    {
      slug: "concurrency-limit",
      title: "Concurrency limit (pool)",
      kind: "implement",
      difficulty: 3,
      tags: ["async"],
      description: `Write \`runWithLimit(tasks, limit)\`, where each task is a function returning a promise. Run at most \`limit\` tasks at a time, starting the next task as soon as any running one finishes (not in fixed batches). Resolve with all results in input order.

If a task rejects, reject with its error. An empty list resolves to \`[]\`; a \`limit\` larger than the list is fine.

Example: \`await runWithLimit([() => later(30, "a"), () => later(5, "b"), () => later(5, "c")], 2)\` → \`["a", "b", "c"]\` ("c" starts when "b" finishes)

In the examples, \`later(ms, value)\` resolves with \`value\` after \`ms\` ms (the tests define it).`,
      starter: `async function runWithLimit(tasks, limit) {\n  \n}`,
      solution: `async function runWithLimit(tasks, limit) {
  const results = new Array(tasks.length);
  let next = 0;

  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);
  await Promise.all(workers);
  return results;
}`,
      tests: [
        {
          name: "resolves results in input order",
          code: `${LATER}const tasks = [20, 5, 10, 1].map((ms, i) => () => later(ms, i));\nassert.deepEqual(await runWithLimit(tasks, 2), [0, 1, 2, 3]);`,
        },
        {
          name: "never exceeds the limit, and reaches it",
          code: `${LATER}let active = 0;\nlet maxActive = 0;\nconst tasks = [10, 5, 5, 10, 5].map((ms) => async () => {\n  active++;\n  maxActive = Math.max(maxActive, active);\n  await later(ms);\n  active--;\n});\nawait runWithLimit(tasks, 2);\nassert.equal(maxActive, 2);`,
        },
        {
          name: "starts the next task as soon as a slot frees up",
          code: `${LATER}const finished = [];\nconst tasks = [40, 5, 5, 5].map((ms, i) => async () => {\n  await later(ms);\n  finished.push(i);\n});\nawait runWithLimit(tasks, 2);\nassert.deepEqual(finished, [1, 2, 3, 0]);`,
        },
        {
          name: "handles a limit larger than the list and an empty list",
          code: `${LATER}assert.deepEqual(await runWithLimit([() => later(1, "x")], 10), ["x"]);\nassert.deepEqual(await runWithLimit([], 3), []);`,
        },
        {
          name: "rejects when a task rejects",
          code: `${LATER}await assert.rejects(runWithLimit([() => later(5, "ok"), () => later(1, "bad", true)], 2), "bad");\nawait wait(10);`,
        },
      ],
      hints: [
        "Start `limit` workers; each one keeps pulling the next unstarted task until none are left.",
      ],
    },
    {
      slug: "promisify",
      title: "promisify",
      kind: "implement",
      difficulty: 2,
      tags: ["async", "higher-order"],
      description: `Write \`promisify(fn)\` for Node-style functions whose last parameter is a callback \`(err, value) => {}\`. The returned function takes the other arguments and returns a promise that rejects with \`err\` when it is truthy, and resolves with \`value\` otherwise. Preserve \`this\`.

Example: \`await promisify((a, b, cb) => cb(null, a + b))(2, 3)\` → \`5\``,
      starter: `function promisify(fn) {\n  \n}`,
      solution: `function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, value) => {
        if (err) reject(err);
        else resolve(value);
      });
    });
  };
}`,
      tests: [
        {
          name: "resolves with the callback value",
          code: `const add = (a, b, cb) => setTimeout(() => cb(null, a + b), 1);\nassert.equal(await promisify(add)(2, 3), 5);`,
        },
        {
          name: "rejects with the callback error",
          code: `const fail = (cb) => setTimeout(() => cb(new Error("nope")), 1);\nawait assert.rejects(promisify(fail)(), "nope");`,
        },
        {
          name: "works when the callback is called synchronously",
          code: `const now = (x, cb) => cb(null, x * 2);\nassert.equal(await promisify(now)(21), 42);`,
        },
        {
          name: "preserves this",
          code: `const obj = {\n  factor: 3,\n  scale(n, cb) { cb(null, n * this.factor); },\n};\nobj.scaleAsync = promisify(obj.scale);\nassert.equal(await obj.scaleAsync(5), 15);`,
        },
      ],
    },
    {
      slug: "async-queue",
      title: "Async queue that preserves order",
      kind: "implement",
      difficulty: 3,
      tags: ["async"],
      description: `Write \`createQueue()\` returning \`{ enqueue(task) }\`. \`task\` is a function returning a promise. Tasks run one at a time in the order they were enqueued, even when enqueued while others are running. \`enqueue\` returns a promise for that task's result.

A rejected task rejects only its own promise; the queue keeps going with the next task.

Example: \`const q = createQueue(); q.enqueue(() => later(20, "a")); await q.enqueue(() => later(1, "b"))\` → \`"b"\`, after "a" has finished

In the examples, \`later(ms, value)\` resolves with \`value\` after \`ms\` ms (the tests define it).`,
      starter: `function createQueue() {\n  \n}`,
      solution: `function createQueue() {
  let tail = Promise.resolve();
  return {
    enqueue(task) {
      const result = tail.then(() => task());
      tail = result.catch(() => {});
      return result;
    },
  };
}`,
      tests: [
        {
          name: "resolves each task's result",
          code: `${LATER}const q = createQueue();\nconst results = await Promise.all([q.enqueue(() => later(10, "a")), q.enqueue(() => later(1, "b"))]);\nassert.deepEqual(results, ["a", "b"]);`,
        },
        {
          name: "runs tasks one at a time in enqueue order",
          code: `${LATER}const q = createQueue();\nconst events = [];\nconst task = (name, ms) => async () => {\n  events.push("start " + name);\n  await later(ms);\n  events.push("end " + name);\n};\nconst p1 = q.enqueue(task("a", 15));\nconst p2 = q.enqueue(task("b", 1));\nawait p1;\nconst p3 = q.enqueue(task("c", 1));\nawait Promise.all([p2, p3]);\nassert.deepEqual(events, ["start a", "end a", "start b", "end b", "start c", "end c"]);`,
        },
        {
          name: "a failing task does not stop the queue",
          code: `${LATER}const q = createQueue();\nconst bad = q.enqueue(() => later(5, "bad", true));\nconst good = q.enqueue(() => later(1, "good"));\nawait assert.rejects(bad, "bad");\nassert.equal(await good, "good");`,
        },
        {
          name: "does not start a task before the previous one finishes",
          code: `${LATER}const q = createQueue();\nlet secondStarted = false;\nq.enqueue(() => later(10));\nconst p = q.enqueue(async () => { secondStarted = true; });\nawait tick();\nassert.equal(secondStarted, false);\nawait p;\nassert.equal(secondStarted, true);`,
        },
      ],
      hints: ["Keep a promise for the tail of the queue and chain each new task onto it."],
    },
  ],
};

export default topic;

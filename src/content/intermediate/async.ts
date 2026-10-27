import type { Topic } from "../types";

const topic: Topic = {
  course: "intermediate",
  slug: "async",
  title: "Asynchronous JavaScript",
  description: "Timers, promises, async/await and the Promise combinators.",
  tags: ["promises", "async/await", "event loop"],
  count: 13,
  challenges: [
    {
      slug: "settimeout",
      title: "setTimeout: run after a delay",
      kind: "implement",
      difficulty: 1,
      tags: ["async", "event-loop"],
      description: `Write \`runAfter(ms, fn)\` that calls \`fn\` once after \`ms\` milliseconds and returns a function that cancels the call if it hasn't happened yet.

Example: \`const cancel = runAfter(10, fn); cancel();\` → \`fn\` is never called`,
      starter: `function runAfter(ms, fn) {\n  \n}`,
      solution: `function runAfter(ms, fn) {
  const id = setTimeout(fn, ms);
  return () => clearTimeout(id);
}`,
      tests: [
        {
          name: "does not call fn synchronously",
          code: `let called = false;\nrunAfter(0, () => { called = true; });\nassert.equal(called, false);`,
        },
        {
          name: "calls fn after the delay",
          code: `let calls = 0;\nrunAfter(10, () => { calls += 1; });\nawait wait(30);\nassert.equal(calls, 1);`,
        },
        { name: "returns a cancel function", code: `const cancel = runAfter(1000, () => {});\nassert.isFunction(cancel);\ncancel();` },
        {
          name: "cancel prevents the call",
          code: `let called = false;\nconst cancel = runAfter(10, () => { called = true; });\ncancel();\nawait wait(30);\nassert.equal(called, false);`,
        },
      ],
    },
    {
      slug: "create-promise",
      title: "Create and resolve a promise",
      kind: "implement",
      difficulty: 1,
      tags: ["async"],
      description: `Write \`delayedValue(value, ms)\` that returns a \`Promise\` resolving with \`value\` after \`ms\` milliseconds.

Example: \`await delayedValue("ok", 20)\` → \`"ok"\``,
      starter: `function delayedValue(value, ms) {\n  \n}`,
      solution: `function delayedValue(value, ms) {
  return new Promise((resolve) => setTimeout(resolve, ms, value));
}`,
      tests: [
        { name: "returns a Promise", code: `assert.ok(delayedValue(1, 0) instanceof Promise);` },
        { name: "resolves with the value", code: `assert.equal(await delayedValue("ok", 5), "ok");` },
        {
          name: "waits for the delay",
          code: `let settled = false;\ndelayedValue(1, 30).then(() => { settled = true; });\nawait wait(5);\nassert.equal(settled, false, "resolved too early");\nawait wait(40);\nassert.equal(settled, true);`,
        },
      ],
    },
    {
      slug: "reject-and-catch",
      title: "Reject and catch",
      kind: "implement",
      difficulty: 1,
      tags: ["async"],
      description: `Write \`checkAge(age)\` that returns a promise resolving with \`age\` when \`age >= 18\` and rejecting with a \`RangeError("too young")\` otherwise.

Then write \`describeAge(age)\` that uses \`checkAge\` with \`.then\` / \`.catch\` and resolves with \`"ok: <age>"\` or \`"error: <message>"\`. It never rejects.

Example: \`await describeAge(12)\` → \`"error: too young"\``,
      starter: `function checkAge(age) {\n  \n}\n\nfunction describeAge(age) {\n  \n}`,
      solution: `function checkAge(age) {
  return age >= 18 ? Promise.resolve(age) : Promise.reject(new RangeError("too young"));
}

function describeAge(age) {
  return checkAge(age)
    .then((value) => \`ok: \${value}\`)
    .catch((error) => \`error: \${error.message}\`);
}`,
      tests: [
        { name: "checkAge resolves for adults", code: `assert.equal(await checkAge(18), 18);` },
        { name: "checkAge rejects with RangeError", code: `await assert.rejects(checkAge(17), RangeError);\nawait assert.rejects(checkAge(17), "too young");` },
        { name: "describeAge for an adult", code: `assert.equal(await describeAge(30), "ok: 30");` },
        { name: "describeAge for a minor", code: `assert.equal(await describeAge(12), "error: too young");` },
      ],
    },
    {
      slug: "then-chain",
      title: "then chaining transforms",
      kind: "complete",
      difficulty: 1,
      tags: ["async"],
      description: `Complete \`getDisplayName(id)\` using a \`.then\` chain (no \`async\`/\`await\`): fetch the user with \`fetchUser\`, take its \`name\`, trim it and upper-case it. If \`fetchUser\` rejects, the returned promise must reject with the same error.

Example: \`await getDisplayName(1)\` → \`"ADA LOVELACE"\``,
      starter: `const users = { 1: { name: "  Ada Lovelace " }, 2: { name: "linus" } };

function fetchUser(id) {
  return id in users ? Promise.resolve(users[id]) : Promise.reject(new Error("not found"));
}

function getDisplayName(id) {
  // your code here
}`,
      solution: `const users = { 1: { name: "  Ada Lovelace " }, 2: { name: "linus" } };

function fetchUser(id) {
  return id in users ? Promise.resolve(users[id]) : Promise.reject(new Error("not found"));
}

function getDisplayName(id) {
  return fetchUser(id)
    .then((user) => user.name)
    .then((name) => name.trim())
    .then((name) => name.toUpperCase());
}`,
      tests: [
        { name: "returns a promise", code: `assert.ok(getDisplayName(2) instanceof Promise);` },
        { name: "trims and upper-cases", code: `assert.equal(await getDisplayName(1), "ADA LOVELACE");\nassert.equal(await getDisplayName(2), "LINUS");` },
        { name: "propagates rejection", code: `await assert.rejects(getDisplayName(99), "not found");` },
      ],
    },
    {
      slug: "async-await",
      title: "async/await basics",
      kind: "complete",
      difficulty: 1,
      tags: ["async"],
      description: `Complete \`postTitles(userId)\` as an \`async\` function: await \`getUser(userId)\`, then await \`getPosts(user)\`, and return the post titles.

Example: \`await postTitles(1)\` → \`["Hello", "Notes"]\``,
      starter: `const getUser = async (id) => ({ id, name: "Ada" });
const getPosts = async (user) =>
  user.id === 1 ? [{ title: "Hello" }, { title: "Notes" }] : [];

function postTitles(userId) {
  // your code here
}`,
      solution: `const getUser = async (id) => ({ id, name: "Ada" });
const getPosts = async (user) =>
  user.id === 1 ? [{ title: "Hello" }, { title: "Notes" }] : [];

async function postTitles(userId) {
  const user = await getUser(userId);
  const posts = await getPosts(user);
  return posts.map((post) => post.title);
}`,
      tests: [
        { name: "is an async function", code: `assert.equal(postTitles.constructor.name, "AsyncFunction");` },
        { name: "returns the titles", code: `assert.deepEqual(await postTitles(1), ["Hello", "Notes"]);` },
        { name: "returns [] when there are no posts", code: `assert.deepEqual(await postTitles(2), []);` },
      ],
    },
    {
      slug: "try-catch-await",
      title: "try/catch with await",
      kind: "implement",
      difficulty: 2,
      tags: ["async"],
      description: `Write \`async function loadOrDefault(loader, fallback)\` that calls \`loader()\` and resolves with its (awaited) result. If \`loader\` rejects, or throws synchronously, resolve with \`fallback\` instead.

Example: \`await loadOrDefault(() => Promise.reject(new Error("x")), 0)\` → \`0\``,
      starter: `async function loadOrDefault(loader, fallback) {\n  \n}`,
      solution: `async function loadOrDefault(loader, fallback) {
  try {
    return await loader();
  } catch {
    return fallback;
  }
}`,
      tests: [
        { name: "resolves with the loaded value", code: `assert.equal(await loadOrDefault(async () => 42, 0), 42);` },
        { name: "falls back on rejection", code: `assert.equal(await loadOrDefault(() => Promise.reject(new Error("x")), "default"), "default");` },
        {
          name: "falls back on a delayed rejection",
          code: `const loader = () => new Promise((_, reject) => setTimeout(() => reject(new Error("late")), 5));\nassert.equal(await loadOrDefault(loader, -1), -1);`,
        },
        { name: "falls back on a synchronous throw", code: `assert.equal(await loadOrDefault(() => { throw new Error("sync"); }, null), null);` },
      ],
      hints: ["`return promise` inside `try` does not catch that promise's rejection. `return await promise` does."],
    },
    {
      slug: "promise-all",
      title: "Promise.all",
      kind: "implement",
      difficulty: 1,
      tags: ["async"],
      description: `Write \`fetchAll(ids, fetchOne)\` that calls the async \`fetchOne(id)\` for every id in parallel and resolves with the results in the same order as \`ids\`. If any call rejects, the returned promise rejects.

Example: \`await fetchAll([1, 2], async (id) => id * 10)\` → \`[10, 20]\``,
      starter: `async function fetchAll(ids, fetchOne) {\n  \n}`,
      solution: `function fetchAll(ids, fetchOne) {
  return Promise.all(ids.map((id) => fetchOne(id)));
}`,
      tests: [
        { name: "resolves with results", code: `assert.deepEqual(await fetchAll([1, 2, 3], async (id) => id * 10), [10, 20, 30]);` },
        {
          name: "keeps input order regardless of timing",
          code: `const slowFirst = (id) => new Promise((r) => setTimeout(r, id === 1 ? 20 : 1, id));\nassert.deepEqual(await fetchAll([1, 2, 3], slowFirst), [1, 2, 3]);`,
        },
        {
          name: "runs calls in parallel",
          code: `let active = 0;\nlet peak = 0;\nconst fetchOne = async (id) => { active++; peak = Math.max(peak, active); await wait(5); active--; return id; };\nawait fetchAll([1, 2, 3], fetchOne);\nassert.equal(peak, 3);`,
        },
        { name: "rejects if any call rejects", code: `await assert.rejects(fetchAll([1, 2], async (id) => { if (id === 2) throw new Error("boom"); return id; }), "boom");` },
      ],
    },
    {
      slug: "all-settled",
      title: "Promise.allSettled",
      kind: "implement",
      difficulty: 2,
      tags: ["async"],
      description: `Write \`summarize(promises)\` that waits for every promise to settle and resolves with \`{ fulfilled, rejected }\`: \`fulfilled\` holds the values and \`rejected\` the rejection reasons' \`message\`s, each in input order. It never rejects.

Example: \`await summarize([Promise.resolve(1), Promise.reject(new Error("x"))])\` → \`{ fulfilled: [1], rejected: ["x"] }\``,
      starter: `async function summarize(promises) {\n  \n}`,
      solution: `async function summarize(promises) {
  const results = await Promise.allSettled(promises);
  return {
    fulfilled: results.filter((r) => r.status === "fulfilled").map((r) => r.value),
    rejected: results.filter((r) => r.status === "rejected").map((r) => r.reason.message),
  };
}`,
      tests: [
        {
          name: "splits fulfilled and rejected",
          code: `const result = await summarize([Promise.resolve(1), Promise.reject(new Error("x")), Promise.resolve(3), Promise.reject(new Error("y"))]);\nassert.deepEqual(result, { fulfilled: [1, 3], rejected: ["x", "y"] });`,
        },
        { name: "all fulfilled", code: `assert.deepEqual(await summarize([Promise.resolve("a")]), { fulfilled: ["a"], rejected: [] });` },
        { name: "empty input", code: `assert.deepEqual(await summarize([]), { fulfilled: [], rejected: [] });` },
      ],
    },
    {
      slug: "race",
      title: "Promise.race",
      kind: "implement",
      difficulty: 2,
      tags: ["async"],
      description: `Write \`withTimeout(promise, ms)\` that settles like \`promise\` if it settles within \`ms\` milliseconds, and otherwise rejects with \`new Error("Timeout")\`.

Example: \`await withTimeout(new Promise(() => {}), 10)\` → rejects with \`Error: Timeout\``,
      starter: `function withTimeout(promise, ms) {\n  return promise;\n}`,
      solution: `function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Timeout")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}`,
      tests: [
        { name: "resolves when the promise is fast", code: `const fast = new Promise((r) => setTimeout(r, 5, "done"));\nassert.equal(await withTimeout(fast, 50), "done");` },
        { name: "rejects with Timeout when the promise is slow", code: `const slow = new Promise((r) => setTimeout(r, 60, "late"));\nawait assert.rejects(withTimeout(slow, 10), /^Timeout$/);` },
        { name: "passes through a fast rejection", code: `await assert.rejects(withTimeout(Promise.reject(new Error("nope")), 50), "nope");` },
      ],
    },
    {
      slug: "any",
      title: "Promise.any",
      kind: "implement",
      difficulty: 2,
      tags: ["async"],
      description: `Write \`firstSuccess(promises)\` that resolves with the first promise to fulfil, ignoring rejections. If every promise rejects, it rejects with an \`AggregateError\`.

Example: \`await firstSuccess([Promise.reject(new Error("a")), Promise.resolve("b")])\` → \`"b"\``,
      starter: `function firstSuccess(promises) {\n  return Promise.race(promises);\n}`,
      solution: `function firstSuccess(promises) {
  return Promise.any(promises);
}`,
      tests: [
        {
          name: "ignores an earlier rejection",
          code: `const fails = Promise.reject(new Error("a"));\nconst ok = new Promise((r) => setTimeout(r, 5, "b"));\nassert.equal(await firstSuccess([fails, ok]), "b");`,
        },
        {
          name: "resolves with the fastest fulfilment",
          code: `const slow = new Promise((r) => setTimeout(r, 20, "slow"));\nconst fast = new Promise((r) => setTimeout(r, 2, "fast"));\nassert.equal(await firstSuccess([slow, fast]), "fast");`,
        },
        {
          name: "rejects with AggregateError when all reject",
          code: `await assert.rejects(firstSuccess([Promise.reject(new Error("a")), Promise.reject(new Error("b"))]), AggregateError);`,
        },
      ],
    },
    {
      slug: "sequential-vs-parallel",
      title: "Sequential vs parallel awaits",
      kind: "fix",
      difficulty: 2,
      tags: ["async"],
      description: `\`loadDashboard(api)\` makes three independent requests and returns their results. It works, but it's three times slower than it needs to be. Fix it so the total time is roughly that of the slowest request.

Example: \`await loadDashboard(api)\` → \`{ user, stats, alerts }\``,
      starter: `async function loadDashboard(api) {
  const user = await api.user();
  const stats = await api.stats();
  const alerts = await api.alerts();
  return { user, stats, alerts };
}`,
      solution: `async function loadDashboard(api) {
  const [user, stats, alerts] = await Promise.all([api.user(), api.stats(), api.alerts()]);
  return { user, stats, alerts };
}`,
      tests: [
        {
          name: "returns all three results",
          code: `const api = { user: async () => "ada", stats: async () => 3, alerts: async () => [] };\nassert.deepEqual(await loadDashboard(api), { user: "ada", stats: 3, alerts: [] });`,
        },
        {
          name: "starts all requests before awaiting any",
          code: `let active = 0;\nlet peak = 0;\nconst slow = (value) => async () => { active++; peak = Math.max(peak, active); await wait(15); active--; return value; };\nconst api = { user: slow("ada"), stats: slow(3), alerts: slow([]) };\nawait loadDashboard(api);\nassert.equal(peak, 3, "requests ran one after another");`,
        },
      ],
    },
    {
      slug: "callback-to-promise",
      title: "Convert a callback API to a promise",
      kind: "implement",
      difficulty: 2,
      tags: ["async", "higher-order"],
      description: `Write \`promisify(fn)\` for Node-style callback APIs. \`fn\` takes its normal arguments followed by a callback \`(error, value)\`. \`promisify\` returns a function that takes the normal arguments and returns a promise that resolves with \`value\`, or rejects with \`error\` when it is truthy.

Example: \`await promisify(readConfig)("app")\` → \`{ name: "app" }\``,
      starter: `function promisify(fn) {\n  \n}`,
      solution: `function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (error, value) => {
        if (error) reject(error);
        else resolve(value);
      });
    });
}`,
      tests: [
        {
          name: "resolves with the callback value",
          code: `const readConfig = (name, cb) => setTimeout(() => cb(null, { name }), 1);\nassert.deepEqual(await promisify(readConfig)("app"), { name: "app" });`,
        },
        { name: "passes every argument", code: `const add = (a, b, cb) => cb(null, a + b);\nassert.equal(await promisify(add)(2, 3), 5);` },
        {
          name: "rejects with the callback error",
          code: `const fail = (cb) => setTimeout(() => cb(new Error("disk full")), 1);\nawait assert.rejects(promisify(fail)(), "disk full");`,
        },
        { name: "returns a promise", code: `const noop = (cb) => cb(null);\nassert.ok(promisify(noop)() instanceof Promise);` },
      ],
    },
    {
      slug: "microtask-order",
      title: "Microtask vs macrotask order",
      kind: "predict",
      difficulty: 3,
      tags: ["event-loop", "async"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order.

\`\`\`js
console.log("1"); // → first line is "1"
\`\`\``,
      starter: `console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve()
  .then(() => console.log("3"))
  .then(() => console.log("4"));
queueMicrotask(() => console.log("5"));
(async () => {
  console.log("6");
  await null;
  console.log("7");
})();
console.log("8");

const expected = [];`,
      solution: `console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve()
  .then(() => console.log("3"))
  .then(() => console.log("4"));
queueMicrotask(() => console.log("5"));
(async () => {
  console.log("6");
  await null;
  console.log("7");
})();
console.log("8");

const expected = ["1", "6", "8", "3", "5", "7", "4", "2"];`,
      tests: [{ name: "expected matches the real output", code: `await tick(); await tick(); assert.deepEqual(expected, logs);` }],
    },
  ],
};

export default topic;

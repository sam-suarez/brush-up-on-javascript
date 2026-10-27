import type { Topic } from "../types";

const topic: Topic = {
  course: "interview",
  slug: "closures",
  title: "Closures",
  description: "Private state, factories, once, memoize and partial application.",
  tags: ["closures"],
  count: 8,
  challenges: [
    {
      slug: "counter-factory",
      title: "Counter factory with independent instances",
      kind: "implement",
      difficulty: 1,
      tags: ["closures"],
      description: `Write \`makeCounter(start = 0)\` that returns a function. Each call of the returned function increments a private count and returns it.

Counters created by separate \`makeCounter\` calls must not share state.

Example: \`const next = makeCounter(); next(); next()\` → \`2\``,
      starter: `function makeCounter(start = 0) {\n  \n}`,
      solution: `function makeCounter(start = 0) {
  let count = start;
  return () => {
    count += 1;
    return count;
  };
}`,
      tests: [
        {
          name: "counts up from 1 by default",
          code: `const next = makeCounter();\nassert.deepEqual([next(), next(), next()], [1, 2, 3]);`,
        },
        {
          name: "starts from the given value",
          code: `const next = makeCounter(10);\nassert.equal(next(), 11);`,
        },
        {
          name: "instances are independent",
          code: `const a = makeCounter();\nconst b = makeCounter();\na(); a();\nassert.equal(b(), 1);\nassert.equal(a(), 3);`,
        },
      ],
    },
    {
      slug: "once",
      title: "once()",
      kind: "implement",
      difficulty: 2,
      tags: ["closures", "higher-order"],
      description: `Write \`once(fn)\` that returns a wrapper which calls \`fn\` on its first invocation only. Every later call returns the first call's result without calling \`fn\` again.

Forward arguments and \`this\`. A first result of \`undefined\` still counts as "already called".

Example: \`const init = once(() => 42); init(); init()\` → \`42\` (fn ran once)`,
      starter: `function once(fn) {\n  \n}`,
      solution: `function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}`,
      tests: [
        {
          name: "calls fn only once",
          code: `let calls = 0;\nconst f = once(() => ++calls);\nf(); f(); f();\nassert.equal(calls, 1);`,
        },
        {
          name: "returns the first result on every call",
          code: `const f = once((x) => x * 2);\nassert.equal(f(5), 10);\nassert.equal(f(100), 10);`,
        },
        {
          name: "does not call fn again when the first result is undefined",
          code: `let calls = 0;\nconst f = once(() => { calls++; });\nf(); f();\nassert.equal(calls, 1);`,
        },
        {
          name: "forwards this",
          code: `const obj = { n: 7, get: once(function () { return this.n; }) };\nassert.equal(obj.get(), 7);`,
        },
      ],
    },
    {
      slug: "memoize-single",
      title: "Memoize a single-argument function",
      kind: "implement",
      difficulty: 2,
      tags: ["closures", "higher-order"],
      description: `Write \`memoize(fn)\` for single-argument functions. The wrapper caches results per argument and calls \`fn\` at most once per distinct argument.

Arguments are distinct by identity: \`1\` and \`"1"\` are different keys, and falsy results like \`0\` or \`undefined\` are cached too.

Example: \`const sq = memoize((n) => n * n); sq(4); sq(4)\` → \`16\` (fn ran once)`,
      starter: `function memoize(fn) {\n  \n}`,
      solution: `function memoize(fn) {
  const cache = new Map();
  return (arg) => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
}`,
      tests: [
        {
          name: "returns fn's result",
          code: `const sq = memoize((n) => n * n);\nassert.equal(sq(4), 16);\nassert.equal(sq(5), 25);`,
        },
        {
          name: "calls fn once per distinct argument",
          code: `let calls = 0;\nconst f = memoize((n) => { calls++; return n + 1; });\nf(1); f(1); f(2); f(1);\nassert.equal(calls, 2);`,
        },
        {
          name: "treats 1 and \"1\" as different arguments",
          code: `const f = memoize((x) => typeof x);\nassert.equal(f(1), "number");\nassert.equal(f("1"), "string");`,
        },
        {
          name: "caches falsy results",
          code: `let calls = 0;\nconst f = memoize(() => { calls++; return 0; });\nf("a"); f("a");\nconst g = memoize(() => { calls++; });\ng("b"); g("b");\nassert.equal(calls, 2);`,
        },
      ],
    },
    {
      slug: "revealing-module",
      title: "Private state with a revealing module",
      kind: "complete",
      difficulty: 2,
      tags: ["closures"],
      description: `Complete the IIFE so \`todoList\` exposes exactly three functions: \`add(text)\`, \`remove(text)\` and \`list()\`. The underlying array must stay private.

\`list()\` returns a copy, so mutating its result does not change the module's state. \`remove\` deletes the first matching item and does nothing if there is none.

Example: \`todoList.add("a"); todoList.add("b"); todoList.remove("a"); todoList.list()\` → \`["b"]\``,
      starter: `const todoList = (() => {\n  // your code here\n})();`,
      solution: `const todoList = (() => {
  const items = [];

  function add(text) {
    items.push(text);
  }

  function remove(text) {
    const index = items.indexOf(text);
    if (index !== -1) items.splice(index, 1);
  }

  function list() {
    return [...items];
  }

  return { add, remove, list };
})();`,
      tests: [
        {
          name: "exposes only add, remove and list",
          code: `assert.deepEqual(Object.keys(todoList).sort(), ["add", "list", "remove"]);`,
        },
        {
          name: "adds and removes items",
          code: `for (const item of todoList.list()) todoList.remove(item);\ntodoList.add("a"); todoList.add("b"); todoList.add("a");\ntodoList.remove("a");\nassert.deepEqual(todoList.list(), ["b", "a"]);\ntodoList.remove("missing");\nassert.deepEqual(todoList.list(), ["b", "a"]);`,
        },
        {
          name: "list() returns a copy",
          code: `todoList.add("x");\nconst before = todoList.list();\nbefore.length = 0;\nassert.ok(todoList.list().includes("x"));\nassert.notEqual(todoList.list(), todoList.list());`,
        },
      ],
    },
    {
      slug: "loop-closure-fix",
      title: "Closure in a loop: produce 0, 1, 2",
      kind: "fix",
      difficulty: 2,
      tags: ["closures"],
      description: `\`makeGetters()\` should return three functions where the function at index \`i\` returns \`i\`. Every getter currently returns the same number. Fix it.

Example: \`makeGetters().map((get) => get())\` → \`[0, 1, 2]\``,
      starter: `function makeGetters() {
  const getters = [];
  for (var i = 0; i < 3; i++) {
    getters.push(() => i);
  }
  return getters;
}`,
      solution: `function makeGetters() {
  const getters = [];
  for (let i = 0; i < 3; i++) {
    getters.push(() => i);
  }
  return getters;
}`,
      tests: [
        { name: "returns three functions", code: `assert.equal(makeGetters().length, 3);` },
        {
          name: "each getter returns its own index",
          code: `assert.deepEqual(makeGetters().map((get) => get()), [0, 1, 2]);`,
        },
      ],
      hints: ["How many `i` bindings does a `var` loop create? How many does a `let` loop create?"],
    },
    {
      slug: "call-counter",
      title: "A function that remembers how many times it was called",
      kind: "implement",
      difficulty: 1,
      tags: ["closures", "higher-order"],
      description: `Write \`trackCalls(fn)\` that returns a wrapper which forwards its arguments to \`fn\` and returns \`fn\`'s result. The wrapper also has two methods: \`count()\` returns how many times it has been called, and \`reset()\` sets that back to 0.

Example: \`const t = trackCalls(Math.max); t(1, 2); t(3); t.count()\` → \`2\``,
      starter: `function trackCalls(fn) {\n  \n}`,
      solution: `function trackCalls(fn) {
  let calls = 0;
  const wrapper = (...args) => {
    calls += 1;
    return fn(...args);
  };
  wrapper.count = () => calls;
  wrapper.reset = () => {
    calls = 0;
  };
  return wrapper;
}`,
      tests: [
        {
          name: "forwards arguments and returns the result",
          code: `const add = trackCalls((a, b) => a + b);\nassert.equal(add(2, 3), 5);`,
        },
        {
          name: "count() reports the number of calls",
          code: `const t = trackCalls(() => {});\nassert.equal(t.count(), 0);\nt(); t(); t();\nassert.equal(t.count(), 3);`,
        },
        {
          name: "reset() starts the count over",
          code: `const t = trackCalls(() => {});\nt(); t();\nt.reset();\nt();\nassert.equal(t.count(), 1);`,
        },
        {
          name: "separate wrappers keep separate counts",
          code: `const a = trackCalls(() => {});\nconst b = trackCalls(() => {});\na(); a();\nassert.equal(b.count(), 0);`,
        },
      ],
    },
    {
      slug: "partial",
      title: "Partial application",
      kind: "implement",
      difficulty: 2,
      tags: ["closures", "higher-order"],
      description: `Write \`partial(fn, ...preset)\` that returns a function which calls \`fn\` with the preset arguments followed by whatever arguments it receives.

The returned function is reusable: each call starts again from the preset arguments.

Example: \`partial((a, b, c) => a + b + c, 1, 2)(3)\` → \`6\``,
      starter: `function partial(fn, ...preset) {\n  \n}`,
      solution: `function partial(fn, ...preset) {
  return (...later) => fn(...preset, ...later);
}`,
      tests: [
        {
          name: "prepends the preset arguments",
          code: `const greet = (greeting, name) => greeting + ", " + name;\nassert.equal(partial(greet, "Hello")("Ada"), "Hello, Ada");`,
        },
        {
          name: "works with several presets and later arguments",
          code: `const collect = (...args) => args;\nassert.deepEqual(partial(collect, 1, 2)(3, 4), [1, 2, 3, 4]);`,
        },
        {
          name: "works with no presets",
          code: `assert.equal(partial(Math.max)(3, 9, 4), 9);`,
        },
        {
          name: "is reusable without accumulating arguments",
          code: `const collect = (...args) => args;\nconst p = partial(collect, "x");\np(1);\nassert.deepEqual(p(2), ["x", 2]);`,
        },
      ],
    },
    {
      slug: "bank-account",
      title: "createBankAccount with a closure-protected balance",
      kind: "implement",
      difficulty: 2,
      tags: ["closures"],
      description: `Write \`createBankAccount(initial = 0)\` returning an object with exactly three methods: \`deposit(amount)\`, \`withdraw(amount)\` and \`getBalance()\`. The balance is not reachable as a property.

\`deposit\` and \`withdraw\` return the new balance. Both throw a \`RangeError\` when \`amount\` is not a positive number. \`withdraw\` throws an \`Error\` with the message \`"Insufficient funds"\` when \`amount\` exceeds the balance, leaving the balance unchanged.

Example: \`const acc = createBankAccount(100); acc.withdraw(30)\` → \`70\``,
      starter: `function createBankAccount(initial = 0) {\n  \n}`,
      solution: `function createBankAccount(initial = 0) {
  let balance = initial;

  const checkAmount = (amount) => {
    if (typeof amount !== "number" || !(amount > 0)) {
      throw new RangeError("Amount must be a positive number");
    }
  };

  return {
    deposit(amount) {
      checkAmount(amount);
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      checkAmount(amount);
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}`,
      tests: [
        {
          name: "deposits and withdraws",
          code: `const acc = createBankAccount(100);\nassert.equal(acc.deposit(50), 150);\nassert.equal(acc.withdraw(30), 120);\nassert.equal(acc.getBalance(), 120);`,
        },
        {
          name: "defaults to a zero balance",
          code: `assert.equal(createBankAccount().getBalance(), 0);`,
        },
        {
          name: "rejects non-positive amounts with RangeError",
          code: `const acc = createBankAccount(10);\nassert.throws(() => acc.deposit(0), RangeError);\nassert.throws(() => acc.deposit(-5), RangeError);\nassert.throws(() => acc.withdraw(-1), RangeError);\nassert.throws(() => acc.deposit("5"), RangeError);`,
        },
        {
          name: "refuses to overdraw and keeps the balance",
          code: `const acc = createBankAccount(20);\nassert.throws(() => acc.withdraw(21), "Insufficient funds");\nassert.equal(acc.getBalance(), 20);`,
        },
        {
          name: "exposes only the three methods",
          code: `const acc = createBankAccount(5);\nassert.deepEqual(Object.keys(acc).sort(), ["deposit", "getBalance", "withdraw"]);`,
        },
      ],
    },
  ],
};

export default topic;

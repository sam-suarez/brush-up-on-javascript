import type { Topic } from "../types";

const topic: Topic = {
  course: "interview",
  slug: "implement-the-built-ins",
  title: "Implement the Built-ins",
  description: "debounce, throttle, curry, bind, map, reduce, an EventEmitter, an LRU cache and more.",
  tags: ["polyfills", "higher-order"],
  count: 14,
  challenges: [
    {
      slug: "debounce",
      title: "debounce",
      kind: "implement",
      difficulty: 3,
      tags: ["closures", "higher-order", "async"],
      description: `Write \`debounce(fn, ms)\`. The returned function delays calling \`fn\` until \`ms\` milliseconds have passed since the **last** call (trailing edge). Each call restarts the timer. When \`fn\` finally runs, it gets the arguments and \`this\` of the most recent call.

Example: calling \`save(1); save(2); save(3)\` in quick succession → \`fn\` runs once, \`ms\` later, with \`3\``,
      starter: `function debounce(fn, ms) {

}`,
      solution: `function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}`,
      tests: [
        {
          name: "does not call fn synchronously",
          code: `const calls = [];\nconst d = debounce((x) => calls.push(x), 20);\nd(1);\nassert.deepEqual(calls, []);\nawait wait(60);\nassert.deepEqual(calls, [1]);`,
        },
        {
          name: "collapses a burst into one call with the latest args",
          code: `const calls = [];\nconst d = debounce((...args) => calls.push(args), 20);\nd(1); d(2); d(3, "x");\nawait wait(60);\nassert.deepEqual(calls, [[3, "x"]]);`,
        },
        {
          name: "each call restarts the timer",
          code: `const calls = [];\nconst d = debounce((x) => calls.push(x), 50);\nd(1);\nawait wait(30);\nd(2);\nawait wait(30);\nassert.deepEqual(calls, [], "fired before 50 ms had passed since the last call");\nawait wait(60);\nassert.deepEqual(calls, [2]);`,
        },
        {
          name: "preserves this",
          code: `let seen;\nconst obj = { name: "obj", save: debounce(function () { seen = this; }, 20) };\nobj.save();\nawait wait(60);\nassert.equal(seen, obj);`,
        },
      ],
      hints: ["Keep the timer id in the closure and clearTimeout it on every call.", "Use a regular function for the wrapper so you can capture this."],
    },
    {
      slug: "throttle",
      title: "throttle",
      kind: "implement",
      difficulty: 2,
      tags: ["closures", "higher-order", "async"],
      description: `Write \`throttle(fn, ms)\` (leading edge only). The first call runs \`fn\` immediately with its arguments and \`this\`. Calls during the next \`ms\` milliseconds are ignored. The first call after the window runs immediately and opens a new window.

Example: \`t(1); t(2); t(3)\` → \`fn\` called once, with \`1\``,
      starter: `function throttle(fn, ms) {
  return fn;
}`,
      solution: `function throttle(fn, ms) {
  let last = -Infinity;
  return function (...args) {
    const now = Date.now();
    if (now - last < ms) return;
    last = now;
    fn.apply(this, args);
  };
}`,
      tests: [
        {
          name: "the first call runs synchronously",
          code: `const calls = [];\nconst t = throttle((x) => calls.push(x), 30);\nt(1);\nassert.deepEqual(calls, [1]);`,
        },
        {
          name: "ignores calls inside the window",
          code: `const calls = [];\nconst t = throttle((x) => calls.push(x), 50);\nt(1); t(2); t(3);\nawait wait(10);\nt(4);\nassert.deepEqual(calls, [1]);`,
        },
        {
          name: "runs again after the window",
          code: `const calls = [];\nconst t = throttle((x) => calls.push(x), 20);\nt(1);\nawait wait(60);\nt(2); t(3);\nassert.deepEqual(calls, [1, 2]);`,
        },
        {
          name: "preserves this",
          code: `let seen;\nconst obj = { go: throttle(function () { seen = this; }, 20) };\nobj.go();\nassert.equal(seen, obj);`,
        },
      ],
    },
    {
      slug: "memoize",
      title: "memoize with multiple arguments",
      kind: "implement",
      difficulty: 2,
      tags: ["closures", "higher-order"],
      description: `Write \`memoize(fn)\` that caches results keyed by **all** arguments. Repeated calls with the same arguments return the cached result without calling \`fn\`.

\`f(1)\` and \`f("1")\` are different keys, and so are \`f(1, 2)\` and \`f(12)\`. Results of \`undefined\` are cached too. Object arguments may be compared by reference.

Example: \`m(2, 3); m(2, 3)\` → \`fn\` called once`,
      starter: `function memoize(fn) {
  const cache = {};
  return (arg) => {
    if (!(arg in cache)) cache[arg] = fn(arg);
    return cache[arg];
  };
}`,
      solution: `function memoize(fn) {
  const root = new Map();
  const RESULT = Symbol("result");
  return function (...args) {
    let node = root;
    for (const arg of args) {
      if (!node.has(arg)) node.set(arg, new Map());
      node = node.get(arg);
    }
    if (!node.has(RESULT)) node.set(RESULT, fn.apply(this, args));
    return node.get(RESULT);
  };
}`,
      tests: [
        {
          name: "caches by all arguments",
          code: `let calls = 0;\nconst add = memoize((a, b) => { calls++; return a + b; });\nassert.equal(add(2, 3), 5);\nassert.equal(add(2, 3), 5);\nassert.equal(calls, 1);\nassert.equal(add(2, 4), 6);\nassert.equal(calls, 2);`,
        },
        {
          name: "distinguishes 1 from \"1\"",
          code: `const m = memoize((x) => typeof x);\nassert.equal(m(1), "number");\nassert.equal(m("1"), "string");`,
        },
        {
          name: "distinguishes (1, 2) from (12)",
          code: `const m = memoize((...args) => args.length);\nassert.equal(m(1, 2), 2);\nassert.equal(m(12), 1);`,
        },
        {
          name: "caches undefined results",
          code: `let calls = 0;\nconst m = memoize(() => { calls++; });\nm(); m();\nassert.equal(calls, 1);`,
        },
      ],
      hints: ["A string key built by joining arguments loses type information. A nested Map per argument doesn't."],
    },
    {
      slug: "curry",
      title: "curry",
      kind: "implement",
      difficulty: 3,
      tags: ["closures", "higher-order"],
      description: `Write \`curry(fn)\`. The curried function collects arguments across calls, in any grouping, and calls \`fn\` once it has at least \`fn.length\` of them. Partial applications must be reusable.

Example: \`curry((a, b, c) => a + b + c)(1)(2, 3)\` → \`6\``,
      starter: `function curry(fn) {
  return (a) => (b) => (c) => fn(a, b, c);
}`,
      solution: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}`,
      tests: [
        {
          name: "supports one argument at a time",
          code: `const add = curry((a, b, c) => a + b + c);\nassert.equal(add(1)(2)(3), 6);`,
        },
        {
          name: "supports any grouping",
          code: `const add = curry((a, b, c) => a + b + c);\nassert.equal(add(1, 2)(3), 6);\nassert.equal(add(1)(2, 3), 6);\nassert.equal(add(1, 2, 3), 6);`,
        },
        {
          name: "partials are reusable",
          code: `const add = curry((a, b, c) => a + b + c);\nconst add1 = add(1);\nassert.equal(add1(2)(3), 6);\nassert.equal(add1(10)(10), 21);`,
        },
        {
          name: "works for other arities",
          code: `const pair = curry((a, b) => [a, b]);\nassert.deepEqual(pair("x")("y"), ["x", "y"]);\nconst four = curry((a, b, c, d) => a * b * c * d);\nassert.equal(four(1)(2)(3)(4), 24);`,
        },
      ],
    },
    {
      slug: "compose-pipe",
      title: "compose and pipe",
      kind: "implement",
      difficulty: 2,
      tags: ["higher-order"],
      description: `Write \`pipe(...fns)\` (applies left to right) and \`compose(...fns)\` (right to left). The first function applied may take several arguments; the rest take one. With no functions, both return their first argument unchanged.

Example: \`pipe((a, b) => a + b, (n) => n * 10)(1, 2)\` → \`30\``,
      starter: `function pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}

function compose(...fns) {
  return pipe(...fns);
}`,
      solution: `function pipe(...fns) {
  return (...args) => {
    if (fns.length === 0) return args[0];
    const [first, ...rest] = fns;
    return rest.reduce((acc, fn) => fn(acc), first(...args));
  };
}

function compose(...fns) {
  return pipe(...fns.toReversed());
}`,
      tests: [
        {
          name: "pipe applies left to right",
          code: `const f = pipe((s) => s + "a", (s) => s + "b");\nassert.equal(f(""), "ab");`,
        },
        {
          name: "compose applies right to left",
          code: `const f = compose((s) => s + "a", (s) => s + "b");\nassert.equal(f(""), "ba");`,
        },
        {
          name: "the first function applied receives every argument",
          code: `assert.equal(pipe((a, b) => a + b, (n) => n * 10)(1, 2), 30);\nassert.equal(compose((n) => n * 10, (a, b) => a + b)(1, 2), 30);`,
        },
        { name: "no functions means identity", code: `assert.equal(pipe()(5), 5);\nassert.equal(compose()("x"), "x");` },
      ],
    },
    {
      slug: "deep-clone",
      title: "deepClone",
      kind: "implement",
      difficulty: 2,
      tags: ["recursion", "immutability"],
      description: `Write \`deepClone(value)\` without \`structuredClone\` or JSON. Recursively copy plain objects, arrays, \`Date\`s, \`Map\`s and \`Set\`s (Map keys may be kept as-is; values are cloned). Primitives and \`null\` are returned unchanged. Cycles are not required.

Example: \`deepClone({ a: [1, { b: 2 }] })\` → \`{ a: [1, { b: 2 }] }\`, sharing no nested references with the input`,
      starter: `function deepClone(value) {
  return { ...value };
}`,
      solution: `function deepClone(value) {
  if (typeof value !== "object" || value === null) return value;
  if (value instanceof Date) return new Date(value);
  if (value instanceof Map) return new Map([...value].map(([k, v]) => [k, deepClone(v)]));
  if (value instanceof Set) return new Set([...value].map(deepClone));
  if (Array.isArray(value)) return value.map(deepClone);
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepClone(v)]));
}`,
      tests: [
        {
          name: "copies nested objects and arrays",
          code: `const src = { a: [1, { b: 2 }], c: { d: "x" } };\nconst copy = deepClone(src);\nassert.deepEqual(copy, src);\nassert.notEqual(copy.a, src.a);\nassert.notEqual(copy.a[1], src.a[1]);\nassert.notEqual(copy.c, src.c);\nassert.ok(Array.isArray(copy.a));`,
        },
        {
          name: "clones Dates",
          code: `const src = { when: new Date(0) };\nconst copy = deepClone(src);\nassert.ok(copy.when instanceof Date);\nassert.notEqual(copy.when, src.when);\nassert.equal(copy.when.getTime(), 0);`,
        },
        {
          name: "clones Maps and Sets deeply",
          code: `const inner = { n: 1 };\nconst src = { m: new Map([["k", inner]]), s: new Set([inner]) };\nconst copy = deepClone(src);\nassert.deepEqual(copy, src);\nassert.notEqual(copy.m.get("k"), inner);\nassert.notEqual([...copy.s][0], inner);`,
        },
        {
          name: "returns primitives and null unchanged",
          code: `assert.equal(deepClone(5), 5);\nassert.equal(deepClone("s"), "s");\nassert.equal(deepClone(null), null);\nassert.equal(deepClone(undefined), undefined);`,
        },
        {
          name: "does not use structuredClone",
          code: `const original = globalThis.structuredClone;\nlet copy;\nglobalThis.structuredClone = () => { throw new Error("structuredClone is off limits"); };\ntry {\n  copy = deepClone({ a: [1] });\n} finally {\n  globalThis.structuredClone = original;\n}\nassert.deepEqual(copy, { a: [1] });`,
        },
      ],
    },
    {
      slug: "flatten-depth",
      title: "flatten with depth",
      kind: "implement",
      difficulty: 2,
      tags: ["recursion"],
      description: `Write \`flatten(array, depth = 1)\` that behaves like \`array.flat(depth)\` without using \`flat\` or \`flatMap\`. \`depth\` may be \`0\` (shallow copy) or \`Infinity\`. Return a new array.

Example: \`flatten([1, [2, [3, [4]]]], 2)\` → \`[1, 2, 3, [4]]\``,
      starter: `function flatten(array, depth = 1) {
  return [].concat(...array);
}`,
      solution: `function flatten(array, depth = 1) {
  const result = [];
  for (const item of array) {
    if (Array.isArray(item) && depth > 0) result.push(...flatten(item, depth - 1));
    else result.push(item);
  }
  return result;
}`,
      tests: [
        { name: "defaults to depth 1", code: `assert.deepEqual(flatten([1, [2, [3]]]), [1, 2, [3]]);` },
        { name: "respects depth 2", code: `assert.deepEqual(flatten([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]]);` },
        { name: "flattens fully with Infinity", code: `assert.deepEqual(flatten([[[[1]]], [2, [3]]], Infinity), [1, 2, 3]);` },
        {
          name: "depth 0 returns a shallow copy",
          code: `const input = [1, [2]];\nconst out = flatten(input, 0);\nassert.deepEqual(out, [1, [2]]);\nassert.notEqual(out, input);`,
        },
        {
          name: "does not use flat or flatMap",
          code: `const { flat, flatMap } = Array.prototype;\nlet out;\nArray.prototype.flat = Array.prototype.flatMap = () => { throw new Error("flat is off limits"); };\ntry {\n  out = flatten([1, [2, [3]]], Infinity);\n} finally {\n  Array.prototype.flat = flat;\n  Array.prototype.flatMap = flatMap;\n}\nassert.deepEqual(out, [1, 2, 3]);`,
        },
      ],
    },
    {
      slug: "group-by",
      title: "groupBy",
      kind: "implement",
      difficulty: 2,
      tags: ["higher-order"],
      description: `Write \`groupBy(items, keyFn)\` without \`Object.groupBy\`. Return an object mapping each key returned by \`keyFn(item, index)\` to the array of items with that key, in input order.

Keys like \`"constructor"\` or \`"toString"\` must work like any other key.

Example: \`groupBy([1, 2, 3], (n) => (n % 2 ? "odd" : "even"))\` → \`{ odd: [1, 3], even: [2] }\``,
      starter: `function groupBy(items, keyFn) {
  const groups = {};
  for (const item of items) {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}`,
      solution: `function groupBy(items, keyFn) {
  const groups = Object.create(null);
  items.forEach((item, index) => {
    const key = keyFn(item, index);
    (groups[key] ??= []).push(item);
  });
  return groups;
}`,
      tests: [
        {
          name: "groups by key in input order",
          code: `assert.deepEqual(groupBy([1, 2, 3, 4], (n) => (n % 2 ? "odd" : "even")), { odd: [1, 3], even: [2, 4] });`,
        },
        {
          name: "passes the index to keyFn",
          code: `assert.deepEqual(groupBy(["a", "b", "c"], (_, i) => (i < 2 ? "first" : "rest")), { first: ["a", "b"], rest: ["c"] });`,
        },
        { name: "returns an empty object for no items", code: `assert.deepEqual(groupBy([], (x) => x), {});` },
        {
          name: "handles keys named like Object.prototype members",
          code: `const out = groupBy(["constructor", "toString", "constructor"], (w) => w);\nassert.deepEqual(out.constructor, ["constructor", "constructor"]);\nassert.deepEqual(out.toString, ["toString"]);`,
        },
        {
          name: "does not use Object.groupBy",
          code: `const original = Object.groupBy;\nlet out;\nObject.groupBy = () => { throw new Error("Object.groupBy is off limits"); };\ntry {\n  out = groupBy([1, 2], (n) => n);\n} finally {\n  Object.groupBy = original;\n}\nassert.deepEqual(out, { 1: [1], 2: [2] });`,
        },
      ],
      hints: ["What does ({}).constructor evaluate to?"],
    },
    {
      slug: "bind-polyfill",
      title: "Function.prototype.bind polyfill",
      kind: "implement",
      difficulty: 3,
      tags: ["this", "prototype", "closures"],
      description: `Implement \`Function.prototype.myBind(thisArg, ...boundArgs)\` without using \`bind\`. It returns a function that calls the original with \`thisArg\` as \`this\` and \`boundArgs\` prepended to its own arguments.

When the bound function is called with \`new\`, \`thisArg\` is ignored and a new instance of the original function is constructed with the combined arguments. Calling \`myBind\` on a non-function throws a \`TypeError\`.

Example: \`greet.myBind({ name: "Ada" }, "Hi")("!")\` → \`"Hi Ada!"\``,
      starter: `Function.prototype.myBind = function (thisArg, ...boundArgs) {
  // your code here
};`,
      solution: `Function.prototype.myBind = function (thisArg, ...boundArgs) {
  const target = this;
  if (typeof target !== "function") throw new TypeError("myBind must be called on a function");
  return function bound(...args) {
    return new.target
      ? new target(...boundArgs, ...args)
      : target.apply(thisArg, [...boundArgs, ...args]);
  };
};`,
      tests: [
        {
          name: "binds this",
          code: `function getName() { return this.name; }\nassert.equal(getName.myBind({ name: "Ada" })(), "Ada");`,
        },
        {
          name: "prepends bound arguments",
          code: `function greet(greeting, punct) { return greeting + " " + this.name + punct; }\nconst hi = greet.myBind({ name: "Ada" }, "Hi");\nassert.equal(hi("!"), "Hi Ada!");\nassert.equal(hi("?"), "Hi Ada?");`,
        },
        {
          name: "new ignores thisArg and constructs the original",
          code: `function Point(x, y) { this.x = x; this.y = y; }\nconst BoundPoint = Point.myBind({ ignored: true }, 1);\nconst p = new BoundPoint(2);\nassert.ok(p instanceof Point);\nassert.equal(p.x, 1);\nassert.equal(p.y, 2);\nassert.equal(p.ignored, undefined);`,
        },
        {
          name: "throws TypeError on non-functions",
          code: `assert.throws(() => Function.prototype.myBind.call({}, null), TypeError);`,
        },
        {
          name: "does not use the native bind",
          code: `const original = Function.prototype.bind;\nlet result;\nFunction.prototype.bind = () => { throw new Error("bind is off limits"); };\ntry {\n  result = function (a) { return this.v + a; }.myBind({ v: 1 }, 2)();\n} finally {\n  Function.prototype.bind = original;\n}\nassert.equal(result, 3);`,
        },
      ],
      hints: ["Inside a regular function, new.target is undefined unless it was called with new."],
    },
    {
      slug: "map-polyfill",
      title: "Array.prototype.map polyfill",
      kind: "implement",
      difficulty: 2,
      tags: ["prototype", "higher-order"],
      description: `Fill in \`Array.prototype.myMap(callback, thisArg)\` without using \`map\`. It's defined with \`Object.defineProperty\` so it stays non-enumerable, as real polyfills are.

Match the spec on the details tests check: \`callback\` gets \`(value, index, array)\` and \`thisArg\` as \`this\`; holes in sparse arrays are skipped and stay holes in the result; elements pushed during iteration are not visited; a non-function \`callback\` throws a \`TypeError\`.

Example: \`[1, , 3].myMap((n) => n * 2)\` → \`[2, <hole>, 6]\``,
      starter: `Object.defineProperty(Array.prototype, "myMap", {
  configurable: true,
  writable: true,
  value: function myMap(callback, thisArg) {
    // your code here
  },
});`,
      solution: `Object.defineProperty(Array.prototype, "myMap", {
  configurable: true,
  writable: true,
  value: function myMap(callback, thisArg) {
    if (typeof callback !== "function") throw new TypeError("callback must be a function");
    const length = this.length;
    const result = new Array(length);
    for (let i = 0; i < length; i++) {
      if (i in this) result[i] = callback.call(thisArg, this[i], i, this);
    }
    return result;
  },
});`,
      tests: [
        { name: "maps values", code: `assert.deepEqual([1, 2, 3].myMap((n) => n * 2), [2, 4, 6]);` },
        {
          name: "passes value, index, array and thisArg",
          code: `const arr = ["a"];\nconst ctx = {};\nlet seen;\narr.myMap(function (...args) { seen = [this, ...args]; }, ctx);\nassert.equal(seen[0], ctx);\nassert.equal(seen[1], "a");\nassert.equal(seen[2], 0);\nassert.equal(seen[3], arr);`,
        },
        {
          name: "skips holes and preserves them",
          code: `let calls = 0;\nconst out = [1, , 3].myMap((n) => { calls++; return n * 2; });\nassert.equal(calls, 2);\nassert.equal(out.length, 3);\nassert.ok(!(1 in out));\nassert.equal(out[2], 6);`,
        },
        {
          name: "does not visit elements added during iteration",
          code: `const arr = [1, 2];\nconst out = arr.myMap((n) => { arr.push(n); return n; });\nassert.deepEqual(out, [1, 2]);`,
        },
        { name: "throws TypeError for a non-function callback", code: `assert.throws(() => [1].myMap(null), TypeError);` },
        {
          name: "does not use the native map",
          code: `const original = Array.prototype.map;\nlet out;\nArray.prototype.map = () => { throw new Error("map is off limits"); };\ntry {\n  out = [1, 2].myMap((n) => n + 1);\n} finally {\n  Array.prototype.map = original;\n}\nassert.deepEqual(out, [2, 3]);`,
        },
      ],
      hints: ["The in operator tells a hole apart from an element whose value is undefined."],
    },
    {
      slug: "reduce-polyfill",
      title: "Array.prototype.reduce polyfill",
      kind: "implement",
      difficulty: 3,
      tags: ["prototype", "higher-order"],
      description: `Fill in \`Array.prototype.myReduce(callback, initialValue)\` without using \`reduce\`. \`callback\` gets \`(accumulator, value, index, array)\`.

Spec details the tests check: without an initial value, the first present element is the accumulator and iteration starts after it; an explicitly passed \`undefined\` **is** an initial value; holes are skipped; an empty array (or one with only holes) with no initial value throws a \`TypeError\`.

Example: \`[1, 2, 3].myReduce((a, b) => a + b)\` → \`6\``,
      starter: `Object.defineProperty(Array.prototype, "myReduce", {
  configurable: true,
  writable: true,
  value: function myReduce(callback, initialValue) {
    let acc = initialValue;
    for (let i = 0; i < this.length; i++) acc = callback(acc, this[i], i, this);
    return acc;
  },
});`,
      solution: `Object.defineProperty(Array.prototype, "myReduce", {
  configurable: true,
  writable: true,
  value: function myReduce(callback, initialValue) {
    if (typeof callback !== "function") throw new TypeError("callback must be a function");
    const length = this.length;
    let i = 0;
    let acc;
    if (arguments.length >= 2) {
      acc = initialValue;
    } else {
      while (i < length && !(i in this)) i++;
      if (i >= length) throw new TypeError("Reduce of empty array with no initial value");
      acc = this[i++];
    }
    for (; i < length; i++) {
      if (i in this) acc = callback(acc, this[i], i, this);
    }
    return acc;
  },
});`,
      tests: [
        { name: "sums with an initial value", code: `assert.equal([1, 2, 3].myReduce((a, b) => a + b, 10), 16);` },
        {
          name: "uses the first element when no initial value is given",
          code: `const indexes = [];\nconst sum = [1, 2, 3].myReduce((a, b, i) => { indexes.push(i); return a + b; });\nassert.equal(sum, 6);\nassert.deepEqual(indexes, [1, 2]);`,
        },
        {
          name: "treats an explicit undefined as an initial value",
          code: `assert.deepEqual([1, 2].myReduce((acc, x) => [acc, x], undefined), [[undefined, 1], 2]);`,
        },
        {
          name: "throws TypeError on an empty array with no initial value",
          code: `assert.throws(() => [].myReduce((a, b) => a + b), TypeError);\nassert.throws(() => [, ,].myReduce((a, b) => a + b), TypeError);`,
        },
        { name: "returns the initial value for an empty array", code: `assert.equal([].myReduce((a, b) => a + b, "init"), "init");` },
        {
          name: "skips holes",
          code: `let calls = 0;\nconst sum = [, 1, , 2].myReduce((a, b) => { calls++; return a + b; });\nassert.equal(sum, 3);\nassert.equal(calls, 1);`,
        },
      ],
      hints: ["The parameter list can't distinguish a missing argument from undefined. arguments.length can."],
    },
    {
      slug: "event-emitter",
      title: "EventEmitter",
      kind: "implement",
      difficulty: 2,
      tags: ["closures"],
      description: `Write a class \`EventEmitter\` with:

- \`on(event, listener)\`: registers a listener and returns a function that unsubscribes it.
- \`off(event, listener)\`: removes a listener.
- \`once(event, listener)\`: like \`on\`, but the listener runs at most once.
- \`emit(event, ...args)\`: calls the event's listeners in registration order with \`args\`; returns \`true\` if there were any, \`false\` otherwise.

A listener that unsubscribes itself (or another) during \`emit\` must not cause the remaining listeners of that emit to be skipped.

Example: \`emitter.on("x", log); emitter.emit("x", 1)\` → \`log(1)\` and returns \`true\``,
      starter: `class EventEmitter {
  on(event, listener) {}
  off(event, listener) {}
  once(event, listener) {}
  emit(event, ...args) {}
}`,
      solution: `class EventEmitter {
  #listeners = new Map();

  on(event, listener) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    const list = this.#listeners.get(event);
    const index = list ? list.indexOf(listener) : -1;
    if (index !== -1) list.splice(index, 1);
  }

  once(event, listener) {
    const off = this.on(event, (...args) => {
      off();
      listener(...args);
    });
    return off;
  }

  emit(event, ...args) {
    const list = this.#listeners.get(event);
    if (!list?.length) return false;
    for (const listener of [...list]) listener(...args);
    return true;
  }
}`,
      tests: [
        {
          name: "emit calls listeners in order with args",
          code: `const e = new EventEmitter();\nconst calls = [];\ne.on("x", (...a) => calls.push(["first", ...a]));\ne.on("x", (...a) => calls.push(["second", ...a]));\nassert.equal(e.emit("x", 1, 2), true);\nassert.deepEqual(calls, [["first", 1, 2], ["second", 1, 2]]);`,
        },
        { name: "emit returns false with no listeners", code: `assert.equal(new EventEmitter().emit("nope"), false);` },
        {
          name: "off and the returned unsubscribe remove listeners",
          code: `const e = new EventEmitter();\nconst calls = [];\nconst a = () => calls.push("a");\nconst b = () => calls.push("b");\ne.on("x", a);\nconst offB = e.on("x", b);\ne.off("x", a);\noffB();\nassert.equal(e.emit("x"), false);\nassert.deepEqual(calls, []);`,
        },
        {
          name: "once fires only once",
          code: `const e = new EventEmitter();\nlet count = 0;\ne.once("x", () => count++);\ne.emit("x");\ne.emit("x");\nassert.equal(count, 1);`,
        },
        {
          name: "unsubscribing during emit doesn't skip other listeners",
          code: `const e = new EventEmitter();\nconst calls = [];\ne.once("x", () => calls.push("a"));\ne.on("x", () => calls.push("b"));\ne.emit("x");\nassert.deepEqual(calls, ["a", "b"]);`,
        },
        {
          name: "events are independent",
          code: `const e = new EventEmitter();\nlet count = 0;\ne.on("a", () => count++);\ne.emit("b");\nassert.equal(count, 0);`,
        },
      ],
      hints: ["Iterate over a copy of the listener array in emit."],
    },
    {
      slug: "lru-cache",
      title: "LRU cache",
      kind: "implement",
      difficulty: 3,
      tags: ["data structures"],
      description: `Write a class \`LRUCache\` constructed with a \`capacity\`. \`get(key)\` returns the value (or \`undefined\`) and marks the key as most recently used. \`put(key, value)\` inserts or updates (also marking it most recently used) and, when over capacity, evicts the least recently used key. A \`size\` getter returns the number of entries. Both operations should be O(1).

Example: capacity 2, \`put("a", 1); put("b", 2); get("a"); put("c", 3)\` → \`"b"\` is evicted`,
      starter: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
  }

  get size() {
    return 0;
  }

  get(key) {}

  put(key, value) {}
}`,
      solution: `class LRUCache {
  #capacity;
  #map = new Map();

  constructor(capacity) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#map.size;
  }

  get(key) {
    if (!this.#map.has(key)) return undefined;
    const value = this.#map.get(key);
    this.#map.delete(key);
    this.#map.set(key, value);
    return value;
  }

  put(key, value) {
    this.#map.delete(key);
    this.#map.set(key, value);
    if (this.#map.size > this.#capacity) this.#map.delete(this.#map.keys().next().value);
  }
}`,
      tests: [
        {
          name: "stores and returns values",
          code: `const c = new LRUCache(2);\nc.put("a", 1);\nassert.equal(c.get("a"), 1);\nassert.equal(c.get("missing"), undefined);\nassert.equal(c.size, 1);`,
        },
        {
          name: "evicts the least recently put key",
          code: `const c = new LRUCache(2);\nc.put("a", 1); c.put("b", 2); c.put("c", 3);\nassert.equal(c.get("a"), undefined);\nassert.equal(c.get("b"), 2);\nassert.equal(c.size, 2);`,
        },
        {
          name: "get refreshes recency",
          code: `const c = new LRUCache(2);\nc.put("a", 1); c.put("b", 2);\nc.get("a");\nc.put("c", 3);\nassert.equal(c.get("b"), undefined);\nassert.equal(c.get("a"), 1);`,
        },
        {
          name: "put on an existing key updates and refreshes it",
          code: `const c = new LRUCache(2);\nc.put("a", 1); c.put("b", 2);\nc.put("a", 10);\nc.put("c", 3);\nassert.equal(c.get("a"), 10);\nassert.equal(c.get("b"), undefined);\nassert.equal(c.size, 2);`,
        },
      ],
      hints: ["A Map iterates keys in insertion order. Delete and re-set a key to move it to the end."],
    },
    {
      slug: "stringify-lite",
      title: "JSON.stringify lite",
      kind: "implement",
      difficulty: 3,
      tags: ["recursion"],
      description: `Write \`stringify(value)\` that matches \`JSON.stringify(value)\` (no spacing) without calling it, for: \`null\`, booleans, numbers (\`NaN\`/\`Infinity\` become \`null\`), strings, arrays and plain objects, nested.

Strings only need \`"\`, \`\\\` and newline escaped. In arrays, \`undefined\` and functions become \`null\`; in objects, those properties are omitted. At the top level they return \`undefined\`. No \`toJSON\`, Dates or cycles.

Example: \`stringify({ a: [1, "x", null], b: undefined })\` → \`'{"a":[1,"x",null]}'\``,
      starter: `function stringify(value) {
  return String(value);
}`,
      solution: String.raw`const quote = (s) => '"' + s.replace(/[\\"]/g, "\\$&").replace(/\n/g, "\\n") + '"';

function stringify(value) {
  if (value === null) return "null";
  switch (typeof value) {
    case "number":
      return Number.isFinite(value) ? String(value) : "null";
    case "boolean":
      return String(value);
    case "string":
      return quote(value);
    case "object":
      break;
    default:
      return undefined;
  }
  if (Array.isArray(value)) {
    return "[" + value.map((item) => stringify(item) ?? "null").join(",") + "]";
  }
  const members = Object.entries(value)
    .map(([key, item]) => [key, stringify(item)])
    .filter(([, json]) => json !== undefined)
    .map(([key, json]) => quote(key) + ":" + json);
  return "{" + members.join(",") + "}";
}`,
      tests: [
        {
          name: "handles primitives",
          code: `for (const v of [null, true, false, 0, -1.5, NaN, Infinity, "hi"]) assert.equal(stringify(v), JSON.stringify(v), String(v));`,
        },
        {
          name: "escapes quotes, backslashes and newlines",
          code: String.raw`const s = 'say "hi"\n\\ done';
assert.equal(stringify(s), JSON.stringify(s));`,
        },
        {
          name: "handles nested arrays and objects",
          code: `const v = { a: [1, [2, { b: "c" }]], d: { e: null, f: false }, g: [] , h: {} };\nassert.equal(stringify(v), JSON.stringify(v));`,
        },
        {
          name: "undefined and functions: null in arrays, omitted in objects",
          code: `const v = { a: undefined, b: () => 1, c: [undefined, () => 1, 2] };\nassert.equal(stringify(v), '{"c":[null,null,2]}');`,
        },
        {
          name: "returns undefined for top-level undefined and functions",
          code: `assert.equal(stringify(undefined), undefined);\nassert.equal(stringify(() => 1), undefined);`,
        },
        {
          name: "does not call JSON.stringify",
          code: `const original = JSON.stringify;\nlet out;\nJSON.stringify = () => { throw new Error("JSON.stringify is off limits"); };\ntry {\n  out = stringify({ a: [1, "x"] });\n} finally {\n  JSON.stringify = original;\n}\nassert.equal(out, '{"a":[1,"x"]}');`,
        },
      ],
    },
  ],
};

export default topic;

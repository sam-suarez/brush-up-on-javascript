import type { Topic } from "../types";

const topic: Topic = {
  course: "interview",
  slug: "iterators-and-generators",
  title: "Iterators and Generators",
  description: "The iteration protocol, generators, delegation, laziness and async generators.",
  tags: ["iteration", "generators"],
  count: 8,
  challenges: [
    {
      slug: "make-iterable",
      title: "Make an object iterable",
      kind: "implement",
      difficulty: 2,
      tags: ["iteration"],
      description: `Write \`makeRange(from, to)\` that returns a plain object usable with \`for...of\` and spread, producing the integers from \`from\` to \`to\` inclusive. Implement \`[Symbol.iterator]\` yourself; don't return an array.

The range must be iterable more than once, and is empty when \`from > to\`.

Example: \`[...makeRange(1, 4)]\` → \`[1, 2, 3, 4]\``,
      starter: `function makeRange(from, to) {
  return { from, to };
}`,
      solution: `function makeRange(from, to) {
  return {
    *[Symbol.iterator]() {
      for (let n = from; n <= to; n++) yield n;
    },
  };
}`,
      tests: [
        { name: "spreads to the inclusive range", code: `assert.deepEqual([...makeRange(1, 4)], [1, 2, 3, 4]);` },
        {
          name: "works with for...of",
          code: `const seen = [];\nfor (const n of makeRange(3, 5)) seen.push(n);\nassert.deepEqual(seen, [3, 4, 5]);`,
        },
        { name: "is not an array", code: `assert.ok(!Array.isArray(makeRange(1, 2)));` },
        {
          name: "can be iterated twice",
          code: `const range = makeRange(1, 3);\nassert.deepEqual([...range], [1, 2, 3]);\nassert.deepEqual([...range], [1, 2, 3]);`,
        },
        { name: "is empty when from > to", code: `assert.deepEqual([...makeRange(5, 1)], []);` },
      ],
    },
    {
      slug: "manual-iterator",
      title: "A manual iterator with next()",
      kind: "implement",
      difficulty: 2,
      tags: ["iteration"],
      description: `Write \`createIterator(array)\` that returns an iterator object by hand (no generators, no \`array[Symbol.iterator]\`). Its \`next()\` returns \`{ value, done: false }\` for each element, then \`{ value: undefined, done: true }\` on every call after the end.

Example: \`createIterator(["a"]).next()\` → \`{ value: "a", done: false }\``,
      starter: `function createIterator(array) {
  return {
    next() {},
  };
}`,
      solution: `function createIterator(array) {
  let index = 0;
  return {
    next() {
      return index < array.length
        ? { value: array[index++], done: false }
        : { value: undefined, done: true };
    },
  };
}`,
      tests: [
        {
          name: "yields each element in order",
          code: `const it = createIterator([1, 2]);\nassert.deepEqual(it.next(), { value: 1, done: false });\nassert.deepEqual(it.next(), { value: 2, done: false });`,
        },
        {
          name: "reports done after the last element",
          code: `const it = createIterator([1]);\nit.next();\nassert.deepEqual(it.next(), { value: undefined, done: true });`,
        },
        {
          name: "stays done on further calls",
          code: `const it = createIterator([]);\nit.next();\nassert.deepEqual(it.next(), { value: undefined, done: true });\nassert.deepEqual(it.next(), { value: undefined, done: true });`,
        },
        {
          name: "iterators are independent",
          code: `const a = createIterator([1, 2]);\nconst b = createIterator([1, 2]);\na.next();\nassert.equal(b.next().value, 1);`,
        },
      ],
    },
    {
      slug: "generator-basics",
      title: "Generator basics",
      kind: "implement",
      difficulty: 1,
      tags: ["generators"],
      description: `Write a generator function \`countdown(n)\` that yields \`n\`, \`n - 1\`, ... down to \`1\`. \`countdown(0)\` yields nothing.

Example: \`[...countdown(3)]\` → \`[3, 2, 1]\``,
      starter: `function countdown(n) {

}`,
      solution: `function* countdown(n) {
  for (let i = n; i >= 1; i--) yield i;
}`,
      tests: [
        { name: "counts down from 3", code: `assert.deepEqual([...countdown(3)], [3, 2, 1]);` },
        { name: "yields nothing for 0", code: `assert.deepEqual([...countdown(0)], []);` },
        {
          name: "returns a generator object",
          code: `const it = countdown(2);\nassert.isFunction(it.next);\nassert.deepEqual(it.next(), { value: 2, done: false });`,
        },
      ],
    },
    {
      slug: "infinite-take",
      title: "Infinite generator with take",
      kind: "implement",
      difficulty: 2,
      tags: ["generators", "iteration"],
      description: `Write two generators:

- \`naturals()\` yields \`1, 2, 3, ...\` forever.
- \`take(iterable, n)\` yields the first \`n\` values of any iterable, then stops. It must pull no more than \`n\` values from the source (so it's safe on infinite iterables), and \`take(x, 0)\` pulls none.

Example: \`[...take(naturals(), 3)]\` → \`[1, 2, 3]\``,
      starter: `function* naturals() {

}

function* take(iterable, n) {

}`,
      solution: `function* naturals() {
  for (let n = 1; ; n++) yield n;
}

function* take(iterable, n) {
  if (n <= 0) return;
  for (const value of iterable) {
    yield value;
    if (--n === 0) return;
  }
}`,
      tests: [
        {
          name: "naturals starts at 1 and keeps going",
          code: `const it = naturals();\nconst first = [it.next().value, it.next().value, it.next().value];\nassert.deepEqual(first, [1, 2, 3]);\nfor (let i = 0; i < 100; i++) it.next();\nassert.deepEqual(it.next(), { value: 104, done: false });`,
        },
        { name: "take returns the first n values", code: `assert.deepEqual([...take(["a", "b", "c", "d"], 2)], ["a", "b"]);` },
        {
          name: "take pulls exactly n values from the source",
          code: `let pulled = 0;\nfunction* source() { for (let i = 0; i < 1000; i++) { pulled++; yield i; } }\nassert.deepEqual([...take(source(), 3)], [0, 1, 2]);\nassert.equal(pulled, 3);`,
        },
        {
          name: "take(x, 0) pulls nothing",
          code: `let pulled = 0;\nfunction* source() { for (let i = 0; i < 1000; i++) { pulled++; yield i; } }\nassert.deepEqual([...take(source(), 0)], []);\nassert.equal(pulled, 0);`,
        },
        { name: "take stops early on short sources", code: `assert.deepEqual([...take([1], 5)], [1]);` },
      ],
      hints: ["Return from inside the loop as soon as you have yielded the n-th value, before the loop asks for another."],
    },
    {
      slug: "yield-delegation",
      title: "Generator delegation with yield*",
      kind: "implement",
      difficulty: 2,
      tags: ["generators", "recursion"],
      description: `Write a generator \`flatten(nested)\` that yields every non-array leaf of an arbitrarily nested array, depth first. Use \`yield*\` to delegate to the recursive call. Strings are leaves, not iterated character by character.

Example: \`[...flatten([1, [2, [3, ["ab"]]], 4])]\` → \`[1, 2, 3, "ab", 4]\``,
      starter: `function* flatten(nested) {
  for (const item of nested) {
    yield item;
  }
}`,
      solution: `function* flatten(nested) {
  for (const item of nested) {
    if (Array.isArray(item)) yield* flatten(item);
    else yield item;
  }
}`,
      tests: [
        { name: "flattens deep nesting", code: `assert.deepEqual([...flatten([1, [2, [3, [4]]], 5])], [1, 2, 3, 4, 5]);` },
        { name: "keeps strings whole", code: `assert.deepEqual([...flatten(["ab", ["cd"]])], ["ab", "cd"]);` },
        { name: "handles empty arrays", code: `assert.deepEqual([...flatten([[], [[]], 1])], [1]);` },
        {
          name: "is lazy",
          code: `const it = flatten([1, [2, 3]]);\nassert.equal(it.next().value, 1);\nassert.equal(it.next().value, 2);`,
        },
      ],
    },
    {
      slug: "lazy-map-filter",
      title: "Lazy map and filter with generators",
      kind: "implement",
      difficulty: 2,
      tags: ["generators", "higher-order"],
      description: `Write generators \`lazyMap(iterable, fn)\` and \`lazyFilter(iterable, predicate)\` that work on any iterable, including infinite ones. They must be lazy: \`fn\`/\`predicate\` runs only when a value is pulled, never ahead of time. Both callbacks receive just the value.

Example: \`[...lazyMap(lazyFilter([1, 2, 3, 4], (n) => n % 2 === 0), (n) => n * 10)]\` → \`[20, 40]\``,
      starter: `function* lazyMap(iterable, fn) {
  yield* [...iterable].map((value) => fn(value));
}

function* lazyFilter(iterable, predicate) {
  yield* [...iterable].filter((value) => predicate(value));
}`,
      solution: `function* lazyMap(iterable, fn) {
  for (const value of iterable) yield fn(value);
}

function* lazyFilter(iterable, predicate) {
  for (const value of iterable) {
    if (predicate(value)) yield value;
  }
}`,
      tests: [
        { name: "lazyMap maps values", code: `assert.deepEqual([...lazyMap([1, 2, 3], (n) => n * 2)], [2, 4, 6]);` },
        { name: "lazyFilter filters values", code: `assert.deepEqual([...lazyFilter([1, 2, 3, 4], (n) => n > 2)], [3, 4]);` },
        {
          name: "lazyMap does not call fn before values are pulled",
          code: `const calls = [];\nconst it = lazyMap([1, 2, 3], (n) => { calls.push(n); return n; });\nassert.deepEqual(calls, []);\nit.next();\nassert.deepEqual(calls, [1]);`,
        },
        {
          name: "lazyFilter does not run ahead of the consumer",
          code: `const calls = [];\nconst it = lazyFilter([1, 2, 3, 4], (n) => { calls.push(n); return n % 2 === 0; });\nassert.equal(it.next().value, 2);\nassert.deepEqual(calls, [1, 2]);`,
        },
        {
          name: "composes over a long source without consuming it all",
          code: `let pulled = 0;\nfunction* source() { for (let i = 1; i <= 1000; i++) { pulled++; yield i; } }\nconst it = lazyMap(lazyFilter(source(), (n) => n % 3 === 0), (n) => n * 2);\nassert.deepEqual([it.next().value, it.next().value], [6, 12]);\nassert.equal(pulled, 6);`,
        },
      ],
    },
    {
      slug: "async-generator",
      title: "Async generator",
      kind: "implement",
      difficulty: 2,
      tags: ["generators", "async"],
      description: `Write an async generator \`paginate(fetchPage)\`. \`fetchPage(page)\` returns a promise of \`{ items, nextPage }\`. Start at page \`1\`, yield each item one at a time, and follow \`nextPage\` until it is \`null\`.

Fetch lazily: don't request the next page until the consumer has pulled every item of the current one. Pages may have no items.

Example: \`for await (const item of paginate(fetchPage))\` → \`"a", "b", "c"\``,
      starter: `async function* paginate(fetchPage) {
  const { items } = await fetchPage(1);
  yield items;
}`,
      solution: `async function* paginate(fetchPage) {
  let page = 1;
  while (page !== null) {
    const { items, nextPage } = await fetchPage(page);
    yield* items;
    page = nextPage;
  }
}`,
      tests: [
        {
          name: "yields every item across pages",
          code: `const pages = { 1: { items: ["a", "b"], nextPage: 2 }, 2: { items: ["c"], nextPage: null } };\nconst out = [];\nfor await (const item of paginate(async (n) => pages[n])) out.push(item);\nassert.deepEqual(out, ["a", "b", "c"]);`,
        },
        {
          name: "fetches pages lazily",
          code: `const requested = [];\nconst pages = { 1: { items: ["a", "b"], nextPage: 2 }, 2: { items: ["c"], nextPage: null } };\nconst it = paginate(async (n) => { requested.push(n); return pages[n]; });\nassert.equal((await it.next()).value, "a");\nawait it.next();\nassert.deepEqual(requested, [1]);\nassert.equal((await it.next()).value, "c");\nassert.deepEqual(requested, [1, 2]);`,
        },
        {
          name: "skips over empty pages",
          code: `const pages = { 1: { items: [], nextPage: 2 }, 2: { items: [1], nextPage: 3 }, 3: { items: [], nextPage: null } };\nconst out = [];\nfor await (const item of paginate(async (n) => pages[n])) out.push(item);\nassert.deepEqual(out, [1]);`,
        },
      ],
    },
    {
      slug: "spread-destructure",
      title: "Spread and destructure iterables",
      kind: "fix",
      difficulty: 1,
      tags: ["iteration", "destructuring"],
      description: `\`firstAndRest(iterable)\` should return \`{ first, rest }\` where \`rest\` is an array of the remaining values. It works for arrays but breaks for Sets, Maps and generators. Fix it so it works for any iterable.

Example: \`firstAndRest(new Set([1, 2, 3]))\` → \`{ first: 1, rest: [2, 3] }\``,
      starter: `function firstAndRest(iterable) {
  return { first: iterable[0], rest: Array.prototype.slice.call(iterable, 1) };
}`,
      solution: `function firstAndRest(iterable) {
  const [first, ...rest] = iterable;
  return { first, rest };
}`,
      tests: [
        { name: "works for arrays", code: `assert.deepEqual(firstAndRest([1, 2, 3]), { first: 1, rest: [2, 3] });` },
        { name: "works for Sets", code: `assert.deepEqual(firstAndRest(new Set([1, 2, 3])), { first: 1, rest: [2, 3] });` },
        {
          name: "works for Maps",
          code: `assert.deepEqual(firstAndRest(new Map([["a", 1], ["b", 2]])), { first: ["a", 1], rest: [["b", 2]] });`,
        },
        {
          name: "works for generators",
          code: `function* gen() { yield "x"; yield "y"; }\nassert.deepEqual(firstAndRest(gen()), { first: "x", rest: ["y"] });`,
        },
        { name: "handles an empty iterable", code: `assert.deepEqual(firstAndRest(new Set()), { first: undefined, rest: [] });` },
      ],
    },
  ],
};

export default topic;

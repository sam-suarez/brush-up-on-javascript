import type { Topic } from "../types";

const topic: Topic = {
  course: "practice",
  slug: "objects-practice",
  title: "JavaScript Objects",
  description: "Deep get, set, clone, equal and merge, plus everyday object transforms.",
  tags: ["objects", "recursion", "maps"],
  count: 19,
  challenges: [
    {
      slug: "deep-get",
      title: "Deep get by path string",
      kind: "implement",
      difficulty: 2,
      tags: ["objects"],
      description: `Write \`get(obj, path, defaultValue)\` that reads a nested value by a path string. Paths use dots and may use brackets for array indexes: \`"a.b.0.c"\` and \`"a.b[0].c"\` are equivalent.

Return \`defaultValue\` when any step is missing or the result is \`undefined\`. A stored \`null\` is returned as \`null\`.

Example: \`get({ a: { b: [{ c: 3 }] } }, "a.b[0].c")\` → \`3\``,
      starter: `function get(obj, path, defaultValue) {\n  \n}\n`,
      solution: `function get(obj, path, defaultValue) {
  const keys = path.replace(/\\[(\\w+)\\]/g, ".$1").split(".").filter(Boolean);
  let current = obj;
  for (const key of keys) {
    if (current == null) return defaultValue;
    current = current[key];
  }
  return current === undefined ? defaultValue : current;
}`,
      tests: [
        { name: "reads a dotted path", code: `assert.equal(get({ a: { b: { c: 1 } } }, "a.b.c"), 1);` },
        { name: "supports bracket indexes", code: `assert.equal(get({ a: { b: [{ c: 3 }] } }, "a.b[0].c"), 3);` },
        { name: "supports numeric dot segments", code: `assert.equal(get({ list: ["x", "y"] }, "list.1"), "y");` },
        { name: "returns the default for a missing path", code: `assert.equal(get({ a: {} }, "a.b.c", "none"), "none");` },
        { name: "returns null when null is stored", code: `assert.equal(get({ a: { b: null } }, "a.b", "none"), null);` },
        { name: "keeps falsy values", code: `assert.equal(get({ a: { count: 0 } }, "a.count", 5), 0);` },
      ],
    },
    {
      slug: "deep-set",
      title: "Deep set by path",
      kind: "implement",
      difficulty: 2,
      tags: ["objects"],
      description: `Write \`set(obj, path, value)\` that writes \`value\` at a dotted path, mutating and returning \`obj\`. Create missing intermediate containers: an array when the next segment is a non-negative integer, otherwise a plain object.

Example: \`set({}, "a.items.0.name", "x")\` → \`{ a: { items: [{ name: "x" }] } }\``,
      starter: `function set(obj, path, value) {\n  \n}\n`,
      solution: `function set(obj, path, value) {
  const keys = path.split(".");
  let current = obj;
  keys.slice(0, -1).forEach((key, i) => {
    if (current[key] == null || typeof current[key] !== "object") {
      current[key] = /^\\d+$/.test(keys[i + 1]) ? [] : {};
    }
    current = current[key];
  });
  current[keys.at(-1)] = value;
  return obj;
}`,
      tests: [
        { name: "sets a top-level key", code: `assert.deepEqual(set({}, "a", 1), { a: 1 });` },
        { name: "creates nested objects", code: `assert.deepEqual(set({}, "a.b.c", 1), { a: { b: { c: 1 } } });` },
        { name: "creates arrays for numeric segments", code: `assert.deepEqual(set({}, "a.items.0.name", "x"), { a: { items: [{ name: "x" }] } });` },
        { name: "keeps existing siblings", code: `assert.deepEqual(set({ a: { keep: true } }, "a.b", 2), { a: { keep: true, b: 2 } });` },
        { name: "mutates and returns the same object", code: `const obj = {}; assert.equal(set(obj, "x.y", 1), obj); assert.equal(obj.x.y, 1);` },
      ],
    },
    {
      slug: "deep-clone",
      title: "Deep clone",
      kind: "implement",
      difficulty: 3,
      tags: ["objects", "recursion"],
      description: `Write \`deepClone(value)\` without \`structuredClone\` or JSON. It must copy plain objects, arrays, \`Date\`, \`Map\` and \`Set\` (keys and values cloned too), return primitives and functions as is, and preserve circular references.

Example: \`deepClone({ d: new Date(0), list: [1, { x: 2 }] })\` → \`an equal structure that shares no objects with the input\``,
      starter: `function deepClone(value) {\n  return { ...value };\n}\n`,
      solution: `function deepClone(value, seen = new Map()) {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) return new Date(value.getTime());

  if (value instanceof Map) {
    const copy = new Map();
    seen.set(value, copy);
    for (const [k, v] of value) copy.set(deepClone(k, seen), deepClone(v, seen));
    return copy;
  }
  if (value instanceof Set) {
    const copy = new Set();
    seen.set(value, copy);
    for (const v of value) copy.add(deepClone(v, seen));
    return copy;
  }

  const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, copy);
  for (const key of Object.keys(value)) copy[key] = deepClone(value[key], seen);
  return copy;
}`,
      hints: ["Keep a `Map` from original to copy and register the copy before recursing."],
      tests: [
        {
          name: "copies nested objects and arrays",
          code: `const src = { a: { b: [1, { c: 2 }] } };
const copy = deepClone(src);
assert.deepEqual(copy, src);
assert.notEqual(copy.a, src.a);
assert.notEqual(copy.a.b[1], src.a.b[1]);`,
        },
        {
          name: "copies dates",
          code: `const src = { when: new Date(1000) };
const copy = deepClone(src);
assert.ok(copy.when instanceof Date);
assert.notEqual(copy.when, src.when);
assert.equal(copy.when.getTime(), 1000);`,
        },
        {
          name: "copies maps and sets",
          code: `const inner = { n: 1 };
const src = { m: new Map([["k", inner]]), s: new Set([inner]) };
const copy = deepClone(src);
assert.deepEqual(copy, src);
assert.notEqual(copy.m.get("k"), inner);
assert.ok(!copy.s.has(inner));`,
        },
        {
          name: "preserves circular references",
          code: `const src = { name: "root" };
src.self = src;
const copy = deepClone(src);
assert.equal(copy.self, copy);
assert.notEqual(copy, src);`,
        },
        { name: "returns primitives unchanged", code: `assert.equal(deepClone(5), 5); assert.equal(deepClone(null), null);` },
      ],
    },
    {
      slug: "deep-equal",
      title: "Deep equal",
      kind: "implement",
      difficulty: 3,
      tags: ["objects", "recursion"],
      description: `Write \`isDeepEqual(a, b)\` for primitives, arrays and plain objects. Primitives compare with \`Object.is\` except that \`0\` and \`-0\` are equal (\`NaN\` equals \`NaN\`). Arrays and objects are equal when they have the same keys with deeply equal values; an array never equals a plain object.

Example: \`isDeepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })\` → \`true\``,
      starter: `function isDeepEqual(a, b) {\n  return JSON.stringify(a) === JSON.stringify(b);\n}\n`,
      solution: `function isDeepEqual(a, b) {
  if (a === b || (Number.isNaN(a) && Number.isNaN(b))) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => Object.hasOwn(b, key) && isDeepEqual(a[key], b[key]));
}`,
      tests: [
        { name: "compares nested structures", code: `assert.equal(isDeepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }), true);` },
        { name: "ignores key order", code: `assert.equal(isDeepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), true);` },
        { name: "detects different values", code: `assert.equal(isDeepEqual({ a: { b: 1 } }, { a: { b: 2 } }), false);` },
        { name: "treats NaN as equal to NaN", code: `assert.equal(isDeepEqual([NaN], [NaN]), true);` },
        { name: "distinguishes undefined from a missing key", code: `assert.equal(isDeepEqual({ a: undefined }, { b: undefined }), false);` },
        { name: "an array is not an object", code: `assert.equal(isDeepEqual([], {}), false);` },
      ],
    },
    {
      slug: "deep-merge",
      title: "Deep merge",
      kind: "implement",
      difficulty: 2,
      tags: ["objects", "recursion", "immutability"],
      description: `Write \`deepMerge(target, source)\` that returns a new object: keys from \`source\` override \`target\`, except that when both sides hold plain objects they are merged recursively. Arrays and other values from \`source\` replace. Neither input may be mutated.

Example: \`deepMerge({ a: { x: 1, y: 1 } }, { a: { y: 2 } })\` → \`{ a: { x: 1, y: 2 } }\``,
      starter: `function deepMerge(target, source) {\n  return { ...target, ...source };\n}\n`,
      solution: `const isPlainObject = (v) => v !== null && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype;

function deepMerge(target, source) {
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    result[key] = isPlainObject(value) && isPlainObject(result[key]) ? deepMerge(result[key], value) : value;
  }
  return result;
}`,
      tests: [
        { name: "merges nested objects", code: `assert.deepEqual(deepMerge({ a: { x: 1, y: 1 } }, { a: { y: 2 } }), { a: { x: 1, y: 2 } });` },
        { name: "adds new keys", code: `assert.deepEqual(deepMerge({ a: 1 }, { b: { c: 2 } }), { a: 1, b: { c: 2 } });` },
        { name: "replaces arrays", code: `assert.deepEqual(deepMerge({ list: [1, 2, 3] }, { list: [9] }), { list: [9] });` },
        {
          name: "does not mutate the inputs",
          code: `const target = { a: { x: 1 } };
const source = { a: { y: 2 } };
deepMerge(target, source);
assert.deepEqual(target, { a: { x: 1 } });
assert.deepEqual(source, { a: { y: 2 } });`,
        },
      ],
    },
    {
      slug: "flatten-keys",
      title: "Flatten a nested object to dot keys",
      kind: "implement",
      difficulty: 2,
      tags: ["objects", "recursion"],
      description: `Write \`flattenKeys(obj)\` that turns nested plain objects into a single-level object with dotted keys. Arrays, \`null\`, empty objects and other non-plain values are leaves and are kept as they are.

Example: \`flattenKeys({ a: { b: 1, c: { d: 2 } }, e: [1] })\` → \`{ "a.b": 1, "a.c.d": 2, e: [1] }\``,
      starter: `function flattenKeys(obj) {\n  \n}\n`,
      solution: `const isNonEmptyPlainObject = (v) =>
  v !== null && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype && Object.keys(v).length > 0;

function flattenKeys(obj, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? prefix + "." + key : key;
    if (isNonEmptyPlainObject(value)) flattenKeys(value, path, out);
    else out[path] = value;
  }
  return out;
}`,
      tests: [
        { name: "flattens nested objects", code: `assert.deepEqual(flattenKeys({ a: { b: 1, c: { d: 2 } } }), { "a.b": 1, "a.c.d": 2 });` },
        { name: "keeps arrays as values", code: `assert.deepEqual(flattenKeys({ e: [1, { x: 1 }] }), { e: [1, { x: 1 }] });` },
        { name: "keeps null and empty objects", code: `assert.deepEqual(flattenKeys({ a: null, b: {} }), { a: null, b: {} });` },
        { name: "leaves flat objects alone", code: `assert.deepEqual(flattenKeys({ x: 1, y: "z" }), { x: 1, y: "z" });` },
      ],
    },
    {
      slug: "unflatten-keys",
      title: "Unflatten dot keys",
      kind: "implement",
      difficulty: 2,
      tags: ["objects"],
      description: `Write \`unflattenKeys(flat)\`, the inverse of flattening: split each key on dots and build nested plain objects. Only plain objects are created (numeric segments become object keys, not arrays).

Example: \`unflattenKeys({ "a.b": 1, "a.c": 2, d: 3 })\` → \`{ a: { b: 1, c: 2 }, d: 3 }\``,
      starter: `function unflattenKeys(flat) {\n  \n}\n`,
      solution: `function unflattenKeys(flat) {
  const result = {};
  for (const [path, value] of Object.entries(flat)) {
    const keys = path.split(".");
    let current = result;
    for (const key of keys.slice(0, -1)) {
      current[key] ??= {};
      current = current[key];
    }
    current[keys.at(-1)] = value;
  }
  return result;
}`,
      tests: [
        { name: "nests dotted keys", code: `assert.deepEqual(unflattenKeys({ "a.b": 1, "a.c": 2, d: 3 }), { a: { b: 1, c: 2 }, d: 3 });` },
        { name: "handles deep paths", code: `assert.deepEqual(unflattenKeys({ "x.y.z": true }), { x: { y: { z: true } } });` },
        { name: "numeric segments become object keys", code: `assert.deepEqual(unflattenKeys({ "list.0": "a" }), { list: { 0: "a" } });` },
        { name: "handles an empty object", code: `assert.deepEqual(unflattenKeys({}), {});` },
      ],
    },
    {
      slug: "map-values",
      title: "Map object values",
      kind: "implement",
      difficulty: 1,
      tags: ["objects", "higher-order"],
      description: `Write \`mapValues(obj, fn)\` that returns a new object with the same keys and each value replaced by \`fn(value, key)\`.

Example: \`mapValues({ a: 1, b: 2 }, (n) => n * 10)\` → \`{ a: 10, b: 20 }\``,
      starter: `function mapValues(obj, fn) {\n  \n}\n`,
      solution: `function mapValues(obj, fn) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value, key)]));
}`,
      tests: [
        { name: "maps each value", code: `assert.deepEqual(mapValues({ a: 1, b: 2 }, (n) => n * 10), { a: 10, b: 20 });` },
        { name: "passes the key", code: `assert.deepEqual(mapValues({ a: 1 }, (v, k) => k + v), { a: "a1" });` },
        { name: "returns a new object", code: `const obj = { a: 1 }; assert.notEqual(mapValues(obj, (v) => v), obj); assert.deepEqual(obj, { a: 1 });` },
      ],
    },
    {
      slug: "filter-object",
      title: "Filter an object by predicate",
      kind: "implement",
      difficulty: 1,
      tags: ["objects", "higher-order"],
      description: `Write \`filterObject(obj, predicate)\` that returns a new object with only the entries for which \`predicate(value, key)\` is truthy.

Example: \`filterObject({ a: 1, b: 2, c: 3 }, (n) => n % 2)\` → \`{ a: 1, c: 3 }\``,
      starter: `function filterObject(obj, predicate) {\n  \n}\n`,
      solution: `function filterObject(obj, predicate) {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => predicate(value, key)));
}`,
      tests: [
        { name: "keeps matching values", code: `assert.deepEqual(filterObject({ a: 1, b: 2, c: 3 }, (n) => n % 2), { a: 1, c: 3 });` },
        { name: "passes the key", code: `assert.deepEqual(filterObject({ id: 1, _secret: 2 }, (v, k) => !k.startsWith("_")), { id: 1 });` },
        { name: "can return an empty object", code: `assert.deepEqual(filterObject({ a: 1 }, () => false), {});` },
      ],
    },
    {
      slug: "count-by",
      title: "Count by property",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`countBy(items, key)\` that returns an object counting items per group. \`key\` is either a property name or a function returning the group.

Example: \`countBy([{ t: "a" }, { t: "b" }, { t: "a" }], "t")\` → \`{ a: 2, b: 1 }\``,
      starter: `function countBy(items, key) {\n  \n}\n`,
      solution: `function countBy(items, key) {
  const groupOf = typeof key === "function" ? key : (item) => item[key];
  const counts = {};
  for (const item of items) {
    const group = groupOf(item);
    counts[group] = (counts[group] ?? 0) + 1;
  }
  return counts;
}`,
      tests: [
        { name: "counts by property name", code: `assert.deepEqual(countBy([{ t: "a" }, { t: "b" }, { t: "a" }], "t"), { a: 2, b: 1 });` },
        { name: "counts by function", code: `assert.deepEqual(countBy([1.2, 1.8, 2.5], Math.floor), { 1: 2, 2: 1 });` },
        { name: "returns {} for an empty array", code: `assert.deepEqual(countBy([], "t"), {});` },
      ],
    },
    {
      slug: "index-by",
      title: "Index by key",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`indexBy(items, key)\` that returns an object mapping each item's \`key\` property to the item. If two items share a key, the later one wins.

Example: \`indexBy([{ id: "a", n: 1 }], "id")\` → \`{ a: { id: "a", n: 1 } }\``,
      starter: `function indexBy(items, key) {\n  \n}\n`,
      solution: `function indexBy(items, key) {
  return Object.fromEntries(items.map((item) => [item[key], item]));
}`,
      tests: [
        {
          name: "indexes by the key",
          code: `const a = { id: "a" }, b = { id: "b" };
const index = indexBy([a, b], "id");
assert.equal(index.a, a);
assert.equal(index.b, b);`,
        },
        { name: "later items win", code: `assert.deepEqual(indexBy([{ id: 1, v: "old" }, { id: 1, v: "new" }], "id"), { 1: { id: 1, v: "new" } });` },
        { name: "returns {} for an empty array", code: `assert.deepEqual(indexBy([], "id"), {});` },
      ],
    },
    {
      slug: "rename-keys",
      title: "Rename keys",
      kind: "implement",
      difficulty: 1,
      tags: ["objects", "immutability"],
      description: `Write \`renameKeys(obj, mapping)\` that returns a new object where each key found in \`mapping\` is renamed to \`mapping[key]\`. Other keys are copied unchanged. Don't mutate \`obj\`.

Example: \`renameKeys({ first_name: "Ada", age: 36 }, { first_name: "firstName" })\` → \`{ firstName: "Ada", age: 36 }\``,
      starter: `function renameKeys(obj, mapping) {\n  \n}\n`,
      solution: `function renameKeys(obj, mapping) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [Object.hasOwn(mapping, key) ? mapping[key] : key, value]),
  );
}`,
      tests: [
        { name: "renames mapped keys", code: `assert.deepEqual(renameKeys({ first_name: "Ada", age: 36 }, { first_name: "firstName" }), { firstName: "Ada", age: 36 });` },
        { name: "ignores mapping entries for missing keys", code: `assert.deepEqual(renameKeys({ a: 1 }, { b: "c" }), { a: 1 });` },
        { name: "does not mutate the input", code: `const obj = { a: 1 }; renameKeys(obj, { a: "b" }); assert.deepEqual(obj, { a: 1 });` },
        { name: "ignores inherited mapping keys", code: `assert.deepEqual(renameKeys({ toString: 1 }, {}), { toString: 1 });` },
      ],
    },
    {
      slug: "remove-nullish",
      title: "Remove undefined and null values",
      kind: "fix",
      difficulty: 1,
      tags: ["objects", "coercion"],
      description: `\`compact(obj)\` should return a new object without the keys whose value is \`null\` or \`undefined\`. Every other value, including \`0\`, \`""\`, \`false\` and \`NaN\`, must be kept. Fix it.

Example: \`compact({ a: 0, b: null, c: "", d: undefined })\` → \`{ a: 0, c: "" }\``,
      starter: `function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value));
}
`,
      solution: `function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value != null));
}`,
      tests: [
        { name: "removes null and undefined", code: `assert.deepEqual(compact({ a: 1, b: null, c: undefined }), { a: 1 });` },
        { name: "keeps falsy values", code: `assert.deepEqual(compact({ a: 0, b: "", c: false, d: NaN }), { a: 0, b: "", c: false, d: NaN });` },
      ],
    },
    {
      slug: "pairs-round-trip",
      title: "Pairs to object and back",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`toPairs(obj)\` that returns the object's own enumerable \`[key, value]\` pairs, and \`fromPairs(pairs)\` that builds an object from pairs (later duplicates win). Any iterable of pairs, such as a \`Map\`, must work.

Example: \`fromPairs(toPairs({ a: 1 }))\` → \`{ a: 1 }\``,
      starter: `function toPairs(obj) {\n  \n}\n\nfunction fromPairs(pairs) {\n  \n}\n`,
      solution: `function toPairs(obj) {
  return Object.entries(obj);
}

function fromPairs(pairs) {
  return Object.fromEntries(pairs);
}`,
      tests: [
        { name: "toPairs returns entries", code: `assert.deepEqual(toPairs({ a: 1, b: 2 }), [["a", 1], ["b", 2]]);` },
        { name: "fromPairs builds an object", code: `assert.deepEqual(fromPairs([["a", 1], ["a", 2], ["b", 3]]), { a: 2, b: 3 });` },
        { name: "fromPairs accepts a Map", code: `assert.deepEqual(fromPairs(new Map([["x", true]])), { x: true });` },
        { name: "round-trips", code: `const obj = { a: 1, b: [2] }; assert.deepEqual(fromPairs(toPairs(obj)), obj);` },
      ],
    },
    {
      slug: "is-empty",
      title: "Is empty object",
      kind: "implement",
      difficulty: 2,
      tags: ["objects"],
      description: `Write \`isEmptyObject(value)\` that returns \`true\` only for a plain object (prototype \`Object.prototype\` or \`null\`) with no own keys at all, including symbol keys. Arrays, dates, \`null\` and primitives return \`false\`.

Example: \`isEmptyObject({ a: undefined })\` → \`false\``,
      starter: `function isEmptyObject(value) {\n  return Object.keys(value).length === 0;\n}\n`,
      solution: `function isEmptyObject(value) {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) return false;
  return Reflect.ownKeys(value).length === 0;
}`,
      tests: [
        { name: "true for {}", code: `assert.equal(isEmptyObject({}), true);` },
        { name: "true for a null-prototype object", code: `assert.equal(isEmptyObject(Object.create(null)), true);` },
        { name: "false when a key holds undefined", code: `assert.equal(isEmptyObject({ a: undefined }), false);` },
        { name: "false with only a symbol key", code: `assert.equal(isEmptyObject({ [Symbol("s")]: 1 }), false);` },
        { name: "false for arrays and dates", code: `assert.equal(isEmptyObject([]), false); assert.equal(isEmptyObject(new Date()), false);` },
        { name: "false for null and primitives", code: `assert.equal(isEmptyObject(null), false); assert.equal(isEmptyObject(""), false);` },
      ],
    },
    {
      slug: "same-shape",
      title: "Same keys",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`sameKeys(a, b)\` that returns \`true\` when both objects have exactly the same own enumerable keys, in any order. Values don't matter.

Example: \`sameKeys({ a: 1, b: 2 }, { b: 0, a: 0 })\` → \`true\``,
      starter: `function sameKeys(a, b) {\n  return Object.keys(a).every((key) => key in b);\n}\n`,
      solution: `function sameKeys(a, b) {
  const keysA = Object.keys(a);
  const keysB = new Set(Object.keys(b));
  return keysA.length === keysB.size && keysA.every((key) => keysB.has(key));
}`,
      tests: [
        { name: "true for the same keys in any order", code: `assert.equal(sameKeys({ a: 1, b: 2 }, { b: 0, a: 0 }), true);` },
        { name: "false when b has an extra key", code: `assert.equal(sameKeys({ a: 1 }, { a: 1, b: 2 }), false);` },
        { name: "false when a has an extra key", code: `assert.equal(sameKeys({ a: 1, c: 3 }, { a: 1 }), false);` },
        { name: "ignores inherited keys", code: `assert.equal(sameKeys({ toString: 1 }, {}), false);` },
        { name: "true for two empty objects", code: `assert.equal(sameKeys({}, {}), true);` },
      ],
    },
    {
      slug: "safe-json-parse",
      title: "Safe JSON parse",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`safeParse(text, fallback = null)\` that returns the parsed JSON, or \`fallback\` when \`text\` is not valid JSON or not a string. It must never throw. Valid JSON that parses to \`null\` or \`false\` is returned as is.

Example: \`safeParse("{oops", {})\` → \`{}\``,
      starter: `function safeParse(text, fallback = null) {\n  return JSON.parse(text);\n}\n`,
      solution: `function safeParse(text, fallback = null) {
  if (typeof text !== "string") return fallback;
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}`,
      tests: [
        { name: "parses valid JSON", code: `assert.deepEqual(safeParse('{"a":[1,2]}'), { a: [1, 2] });` },
        { name: "returns the fallback for invalid JSON", code: `assert.deepEqual(safeParse("{oops", {}), {});` },
        { name: "defaults the fallback to null", code: `assert.equal(safeParse(""), null);` },
        { name: "keeps valid falsy results", code: `assert.equal(safeParse("false", "fb"), false); assert.equal(safeParse("null", "fb"), null);` },
        { name: "returns the fallback for non-strings", code: `assert.equal(safeParse(undefined, "fb"), "fb");` },
      ],
    },
    {
      slug: "stable-stringify",
      title: "Serialize with sorted keys",
      kind: "implement",
      difficulty: 2,
      tags: ["objects", "recursion"],
      description: `Write \`stableStringify(value)\` that works like \`JSON.stringify(value)\` but sorts object keys alphabetically at every depth, so equal objects always serialize to the same string. Array order is preserved.

Example: \`stableStringify({ b: 1, a: { d: 2, c: 3 } })\` → \`'{"a":{"c":3,"d":2},"b":1}'\``,
      starter: `function stableStringify(value) {\n  return JSON.stringify(value);\n}\n`,
      solution: `function stableStringify(value) {
  return JSON.stringify(value, (key, val) =>
    val !== null && typeof val === "object" && !Array.isArray(val)
      ? Object.fromEntries(Object.entries(val).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
      : val,
  );
}`,
      hints: ["`JSON.stringify` accepts a replacer function that runs at every level."],
      tests: [
        { name: "sorts top-level keys", code: `assert.equal(stableStringify({ b: 1, a: 2 }), '{"a":2,"b":1}');` },
        { name: "sorts nested keys", code: `assert.equal(stableStringify({ b: 1, a: { d: 2, c: 3 } }), '{"a":{"c":3,"d":2},"b":1}');` },
        { name: "keeps array order", code: `assert.equal(stableStringify({ list: [3, 1, { y: 1, x: 2 }] }), '{"list":[3,1,{"x":2,"y":1}]}');` },
        { name: "equal objects serialize equally", code: `assert.equal(stableStringify({ x: 1, y: { p: 1, q: 2 } }), stableStringify({ y: { q: 2, p: 1 }, x: 1 }));` },
      ],
    },
    {
      slug: "map-vs-object",
      title: "Word counts with Map",
      kind: "fix",
      difficulty: 3,
      tags: ["objects", "prototype"],
      description: `\`wordCounts(text)\` should return a \`Map\` from each lowercase word (split on whitespace) to how often it appears. It works for ordinary text, but some perfectly normal words break it. Fix it.

Example: \`wordCounts("the cat the constructor")\` → \`Map(3) { 'the' => 2, 'cat' => 1, 'constructor' => 1 }\``,
      starter: `function wordCounts(text) {
  const counts = {};
  for (const word of text.toLowerCase().split(/\\s+/).filter(Boolean)) {
    counts[word] = (counts[word] || 0) + 1;
  }
  return new Map(Object.entries(counts));
}
`,
      solution: `function wordCounts(text) {
  const counts = new Map();
  for (const word of text.toLowerCase().split(/\\s+/).filter(Boolean)) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return counts;
}`,
      hints: ["What does `({}).constructor` evaluate to?"],
      tests: [
        { name: "counts ordinary words", code: `assert.deepEqual(wordCounts("The cat saw the dog"), new Map([["the", 2], ["cat", 1], ["saw", 1], ["dog", 1]]));` },
        { name: "handles words that exist on Object.prototype", code: `assert.deepEqual(wordCounts("constructor valueOf constructor"), new Map([["constructor", 2], ["valueof", 1]]));` },
        { name: "handles __proto__", code: `assert.deepEqual(wordCounts("__proto__ __proto__ a"), new Map([["__proto__", 2], ["a", 1]]));` },
        { name: "returns an empty Map for blank text", code: `assert.deepEqual(wordCounts("   "), new Map());` },
      ],
    },
  ],
};

export default topic;

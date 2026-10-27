import type { Topic } from "../types";

const LOOSE_CODE = `console.log(0 == "");
console.log(0 == "0");
console.log("" == "0");
console.log(null == undefined);
console.log(null == 0);
console.log(null === undefined);
console.log([1] == 1);
console.log(NaN == NaN);
console.log(false == "false");
`;

const ARRAY_CODE = `console.log(String([1, 2, 3]));
console.log(String([]));
console.log(String([null]));
console.log(String([undefined, 1]));
console.log(String([1, [2, [3]]]));
console.log([] + {});
console.log([1] + 1);
console.log([1, 2] + 1);
console.log([2] * [3]);
`;

const TYPEOF_CODE = `console.log(typeof null);
console.log(typeof []);
console.log(typeof function () {});
console.log(typeof class {});
console.log(typeof NaN);
console.log(typeof undeclaredVariable);
console.log(typeof Symbol());
console.log(typeof 10n);
console.log(typeof new Number(1));
`;

const predictTest = [{ name: "expected matches the real output", code: `await tick(); assert.deepEqual(expected, logs);` }];

const topic: Topic = {
  course: "interview",
  slug: "coercion-and-equality",
  title: "Coercion and Equality",
  description: "==, ===, Object.is, truthiness, typeof and the conversions behind them.",
  tags: ["coercion", "equality"],
  count: 8,
  challenges: [
    {
      slug: "loose-vs-strict",
      title: "== vs ===",
      kind: "predict",
      difficulty: 2,
      tags: ["coercion"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order. Booleans are logged as \`"true"\` / \`"false"\`.

\`\`\`js
console.log(1 == "1"); // → "true"
\`\`\``,
      starter: `${LOOSE_CODE}\nconst expected = [];`,
      solution: `${LOOSE_CODE}\nconst expected = ["true", "true", "false", "true", "false", "false", "true", "false", "false"];`,
      tests: predictTest,
      hints: [
        "With ==, a string compared to a number is converted to a number; a boolean is converted to a number first.",
        "null only loosely equals undefined (and itself), nothing else.",
      ],
    },
    {
      slug: "truthy-falsy",
      title: "Truthy and falsy",
      kind: "implement",
      difficulty: 1,
      tags: ["coercion"],
      description: `Write \`splitByTruthiness(values)\` that returns \`{ truthy, falsy }\`, two arrays partitioning \`values\` by truthiness, preserving order.

Tests include every falsy primitive (\`0\`, \`-0\`, \`0n\`, \`NaN\`, \`""\`, \`null\`, \`undefined\`, \`false\`) and look-alikes that are truthy (\`"0"\`, \`"false"\`, \`[]\`, \`{}\`).

Example: \`splitByTruthiness([0, "a", ""])\` → \`{ truthy: ["a"], falsy: [0, ""] }\``,
      starter: `function splitByTruthiness(values) {
  return {
    truthy: values.filter((v) => v !== null && v !== undefined),
    falsy: values.filter((v) => v === null || v === undefined),
  };
}`,
      solution: `function splitByTruthiness(values) {
  const truthy = [];
  const falsy = [];
  for (const value of values) (value ? truthy : falsy).push(value);
  return { truthy, falsy };
}`,
      tests: [
        {
          name: "every falsy primitive lands in falsy",
          code: `const { truthy, falsy } = splitByTruthiness([0, -0, 0n, NaN, "", null, undefined, false]);\nassert.deepEqual(truthy, []);\nassert.equal(falsy.length, 8);`,
        },
        {
          name: "look-alikes are truthy",
          code: `const values = ["0", "false", " ", [], {}, -1, Infinity];\nconst { truthy, falsy } = splitByTruthiness(values);\nassert.deepEqual(truthy, values);\nassert.deepEqual(falsy, []);`,
        },
        {
          name: "preserves order",
          code: `assert.deepEqual(splitByTruthiness([0, "a", "", 1]), { truthy: ["a", 1], falsy: [0, ""] });`,
        },
      ],
    },
    {
      slug: "string-to-number",
      title: "Number coercion of strings",
      kind: "implement",
      difficulty: 2,
      tags: ["coercion"],
      description: `Write \`toNumber(str)\` that converts a string to a finite number, or returns \`null\` if it isn't one. Follow \`Number()\` semantics (surrounding whitespace allowed, \`"1e3"\` and \`"0x10"\` are fine, \`"12px"\` is not), with two fixes: empty or whitespace-only strings return \`null\` (not \`0\`), and \`"Infinity"\` returns \`null\`.

Example: \`toNumber(" 3.5 ")\` → \`3.5\`, \`toNumber("")\` → \`null\``,
      starter: `function toNumber(str) {
  return parseFloat(str);
}`,
      solution: `function toNumber(str) {
  if (str.trim() === "") return null;
  const n = Number(str);
  return Number.isFinite(n) ? n : null;
}`,
      tests: [
        {
          name: "parses plain numbers",
          code: `assert.equal(toNumber("42"), 42);\nassert.equal(toNumber(" 3.5 "), 3.5);\nassert.equal(toNumber("-7"), -7);`,
        },
        { name: "supports exponent and hex", code: `assert.equal(toNumber("1e3"), 1000);\nassert.equal(toNumber("0x10"), 16);` },
        { name: "rejects trailing garbage", code: `assert.equal(toNumber("12px"), null);\nassert.equal(toNumber("1.2.3"), null);` },
        { name: "empty and whitespace strings are null", code: `assert.equal(toNumber(""), null);\nassert.equal(toNumber("   "), null);` },
        { name: "Infinity is null", code: `assert.equal(toNumber("Infinity"), null);\nassert.equal(toNumber("-Infinity"), null);` },
      ],
    },
    {
      slug: "object-is",
      title: "Object.is vs ===",
      kind: "implement",
      difficulty: 2,
      tags: ["equality"],
      description: `Implement \`sameValue(a, b)\` with the semantics of \`Object.is\`, without calling \`Object.is\`.

Refresher: \`Object.is\` behaves like \`===\` except \`NaN\` equals \`NaN\`, and \`0\` does not equal \`-0\`.

Example: \`sameValue(NaN, NaN)\` → \`true\`, \`sameValue(0, -0)\` → \`false\``,
      starter: `function sameValue(a, b) {
  return a === b;
}`,
      solution: `function sameValue(a, b) {
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  return a !== a && b !== b;
}`,
      tests: [
        { name: "NaN equals NaN", code: `assert.ok(sameValue(NaN, NaN));` },
        { name: "0 and -0 differ", code: `assert.ok(!sameValue(0, -0));\nassert.ok(!sameValue(-0, 0));` },
        { name: "-0 equals -0 and 0 equals 0", code: `assert.ok(sameValue(-0, -0));\nassert.ok(sameValue(0, 0));` },
        {
          name: "otherwise behaves like ===",
          code: `const obj = {};\nassert.ok(sameValue("a", "a"));\nassert.ok(sameValue(obj, obj));\nassert.ok(!sameValue({}, {}));\nassert.ok(!sameValue(1, "1"));\nassert.ok(!sameValue(NaN, 0));`,
        },
        {
          name: "does not call Object.is",
          code: `const original = Object.is;\nlet results;\nObject.is = () => { throw new Error("Object.is is off limits"); };\ntry {\n  results = [sameValue(NaN, NaN), sameValue(0, -0)];\n} finally {\n  Object.is = original;\n}\nassert.deepEqual(results, [true, false]);`,
        },
      ],
    },
    {
      slug: "array-to-string",
      title: "Array to string coercion",
      kind: "predict",
      difficulty: 2,
      tags: ["coercion"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order. A line that logs an empty string is \`""\` in \`expected\`.

\`\`\`js
console.log(String([1, 2])); // → "1,2"
\`\`\``,
      starter: `${ARRAY_CODE}\nconst expected = [];`,
      solution: `${ARRAY_CODE}\nconst expected = ["1,2,3", "", "", ",1", "1,2,3", "[object Object]", "11", "1,21", "6"];`,
      tests: predictTest,
      hints: ["Arrays convert to primitives via join(\",\"), and join turns null and undefined into empty strings."],
    },
    {
      slug: "typeof-quirks",
      title: "typeof quirks",
      kind: "predict",
      difficulty: 1,
      tags: ["coercion"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order.

\`\`\`js
console.log(typeof "hi"); // → "string"
\`\`\``,
      starter: `${TYPEOF_CODE}\nconst expected = [];`,
      solution: `${TYPEOF_CODE}\nconst expected = ["object", "object", "function", "function", "number", "undefined", "symbol", "bigint", "object"];`,
      tests: predictTest,
    },
    {
      slug: "comparing-objects",
      title: "Comparing objects",
      kind: "implement",
      difficulty: 2,
      tags: ["equality"],
      description: `Write \`shallowEqual(a, b)\` (the React-style check). Return \`true\` if \`a\` and \`b\` are the same value by \`Object.is\`, or if both are non-null objects with the same set of own enumerable keys whose values are equal by \`Object.is\`. Nested objects are compared by reference only.

\`{ a: undefined }\` and \`{ b: undefined }\` are not equal.

Example: \`shallowEqual({ a: 1, b: 2 }, { b: 2, a: 1 })\` → \`true\``,
      starter: `function shallowEqual(a, b) {
  return a === b;
}`,
      solution: `function shallowEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  return (
    keysA.length === keysB.length &&
    keysA.every((key) => Object.hasOwn(b, key) && Object.is(a[key], b[key]))
  );
}`,
      tests: [
        { name: "equal regardless of key order", code: `assert.ok(shallowEqual({ a: 1, b: 2 }, { b: 2, a: 1 }));` },
        { name: "different values are not equal", code: `assert.ok(!shallowEqual({ a: 1 }, { a: 2 }));` },
        { name: "different key counts are not equal", code: `assert.ok(!shallowEqual({ a: 1 }, { a: 1, b: 2 }));\nassert.ok(!shallowEqual({ a: 1, b: 2 }, { a: 1 }));` },
        { name: "undefined values still need matching keys", code: `assert.ok(!shallowEqual({ a: undefined }, { b: undefined }));` },
        {
          name: "nested objects compare by reference",
          code: `const inner = { x: 1 };\nassert.ok(shallowEqual({ inner }, { inner }));\nassert.ok(!shallowEqual({ inner: { x: 1 } }, { inner: { x: 1 } }));`,
        },
        {
          name: "values use Object.is",
          code: `assert.ok(shallowEqual({ n: NaN }, { n: NaN }));\nassert.ok(!shallowEqual({ z: 0 }, { z: -0 }));`,
        },
        { name: "handles primitives and null", code: `assert.ok(shallowEqual(1, 1));\nassert.ok(!shallowEqual(null, {}));\nassert.ok(!shallowEqual({}, null));` },
      ],
    },
    {
      slug: "nan-detection",
      title: "NaN detection",
      kind: "fix",
      difficulty: 2,
      tags: ["coercion"],
      description: `\`countNaN(values)\` should count how many entries are the actual number \`NaN\`. It overcounts. Fix it.

Strings like \`"abc"\`, \`undefined\` and objects are not \`NaN\`, even though they convert to it.

Example: \`countNaN([NaN, "abc", 1, NaN])\` → \`2\``,
      starter: `function countNaN(values) {
  return values.filter((value) => isNaN(value)).length;
}`,
      solution: `function countNaN(values) {
  return values.filter((value) => Number.isNaN(value)).length;
}`,
      tests: [
        { name: "counts real NaN values", code: `assert.equal(countNaN([NaN, 1, NaN]), 2);` },
        { name: "ignores values that merely convert to NaN", code: `assert.equal(countNaN(["abc", undefined, {}, [1, 2]]), 0);` },
        { name: "handles mixed input", code: `assert.equal(countNaN([NaN, "abc", 1, NaN, "1"]), 2);` },
        { name: "returns 0 for an empty array", code: `assert.equal(countNaN([]), 0);` },
      ],
    },
  ],
};

export default topic;

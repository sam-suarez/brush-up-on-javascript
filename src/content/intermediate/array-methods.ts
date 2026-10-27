import type { Topic } from "../types";

const topic: Topic = {
  course: "intermediate",
  slug: "array-methods",
  title: "Array Methods",
  description:
    "map, filter, reduce, sort and the rest of the Array.prototype toolbox, including the ES2023 non-mutating methods.",
  tags: ["map", "filter", "reduce", "sort"],
  count: 33,
  challenges: [
    {
      slug: "foreach-log",
      title: "forEach: log each item",
      kind: "implement",
      difficulty: 1,
      tags: ["iteration", "higher-order"],
      description: `Write \`logEach(items)\` that logs one line per item in the form \`"<index>: <item>"\` using \`forEach\`. It returns nothing and logs nothing for an empty array.

Example: \`logEach(["a", "b"])\` → logs \`"0: a"\` then \`"1: b"\``,
      starter: `function logEach(items) {

}`,
      solution: `function logEach(items) {
  items.forEach((item, index) => console.log(\`\${index}: \${item}\`));
}`,
      tests: [
        {
          name: "logs index and item for each element",
          code: `clearLogs();
logEach(["a", "b"]);
assert.deepEqual(logs, ["0: a", "1: b"]);`,
        },
        { name: "returns undefined", code: `clearLogs(); assert.equal(logEach(["x"]), undefined);` },
        { name: "logs nothing for an empty array", code: `clearLogs(); logEach([]); assert.deepEqual(logs, []);` },
      ],
    },
    {
      slug: "map-double",
      title: "map: double every number",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order"],
      description: `Write \`doubleAll(numbers)\` that returns a new array with every number doubled. Do not mutate the input.

Example: \`doubleAll([1, 2, 3])\` → \`[2, 4, 6]\``,
      starter: `function doubleAll(numbers) {

}`,
      solution: `function doubleAll(numbers) {
  return numbers.map((n) => n * 2);
}`,
      tests: [
        { name: "doubles each number", code: `assert.deepEqual(doubleAll([1, 2, 3]), [2, 4, 6]);` },
        {
          name: "returns a new array and leaves the input alone",
          code: `const input = [1, 2];
const out = doubleAll(input);
assert.notEqual(out, input);
assert.deepEqual(input, [1, 2]);`,
        },
        { name: "handles an empty array", code: `assert.deepEqual(doubleAll([]), []);` },
      ],
    },
    {
      slug: "map-pluck",
      title: "map: extract a property from objects",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order"],
      description: `Write \`pluck(objects, key)\` that returns an array of each object's value for \`key\`. Objects missing the key contribute \`undefined\`.

Example: \`pluck([{ id: 1 }, { id: 2 }], "id")\` → \`[1, 2]\``,
      starter: `function pluck(objects, key) {

}`,
      solution: `function pluck(objects, key) {
  return objects.map((obj) => obj[key]);
}`,
      tests: [
        { name: "extracts the given key", code: `assert.deepEqual(pluck([{ id: 1 }, { id: 2 }], "id"), [1, 2]);` },
        {
          name: "works with any key name",
          code: `assert.deepEqual(pluck([{ name: "Ada", age: 36 }, { name: "Linus", age: 28 }], "name"), ["Ada", "Linus"]);`,
        },
        { name: "missing keys become undefined", code: `assert.deepEqual(pluck([{ a: 1 }, {}], "a"), [1, undefined]);` },
      ],
    },
    {
      slug: "map-with-index",
      title: "map with index",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order"],
      description: `Write \`numbered(items)\` that returns a new array of strings prefixed with their 1-based position.

Example: \`numbered(["eggs", "milk"])\` → \`["1. eggs", "2. milk"]\``,
      starter: `function numbered(items) {

}`,
      solution: `function numbered(items) {
  return items.map((item, i) => \`\${i + 1}. \${item}\`);
}`,
      tests: [
        { name: "numbers items starting at 1", code: `assert.deepEqual(numbered(["eggs", "milk"]), ["1. eggs", "2. milk"]);` },
        { name: "handles a single item", code: `assert.deepEqual(numbered(["x"]), ["1. x"]);` },
        { name: "handles an empty array", code: `assert.deepEqual(numbered([]), []);` },
      ],
    },
    {
      slug: "filter-even",
      title: "filter: even numbers",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order"],
      description: `Write \`evens(numbers)\` that returns only the even numbers, in their original order. Zero and negative even numbers count.

Example: \`evens([-4, -3, 0, 1, 2])\` → \`[-4, 0, 2]\``,
      starter: `function evens(numbers) {

}`,
      solution: `function evens(numbers) {
  return numbers.filter((n) => n % 2 === 0);
}`,
      tests: [
        { name: "keeps even numbers in order", code: `assert.deepEqual(evens([1, 2, 3, 4, 6]), [2, 4, 6]);` },
        { name: "handles zero and negatives", code: `assert.deepEqual(evens([-4, -3, 0, 1, 2]), [-4, 0, 2]);` },
        { name: "returns [] when nothing matches", code: `assert.deepEqual(evens([1, 3, -5]), []);` },
      ],
    },
    {
      slug: "filter-by-property",
      title: "filter: objects by property",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order"],
      description: `Write \`filterBy(items, key, value)\` that returns the items whose \`key\` property is strictly equal (\`===\`) to \`value\`.

Example: \`filterBy([{ role: "admin" }, { role: "user" }], "role", "admin")\` → \`[{ role: "admin" }]\``,
      starter: `function filterBy(items, key, value) {

}`,
      solution: `function filterBy(items, key, value) {
  return items.filter((item) => item[key] === value);
}`,
      tests: [
        {
          name: "keeps matching items",
          code: `const users = [{ name: "a", role: "admin" }, { name: "b", role: "user" }, { name: "c", role: "admin" }];
assert.deepEqual(filterBy(users, "role", "admin").map((u) => u.name), ["a", "c"]);`,
        },
        {
          name: "uses strict equality",
          code: `assert.deepEqual(filterBy([{ n: 1 }, { n: "1" }], "n", 1), [{ n: 1 }]);`,
        },
        {
          name: "returns the original objects, not copies",
          code: `const item = { ok: true };
assert.equal(filterBy([item, { ok: false }], "ok", true)[0], item);`,
        },
      ],
    },
    {
      slug: "filter-falsy",
      title: "Filter out falsy values",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order", "coercion"],
      description: `Write \`compact(values)\` that removes every falsy value (\`false\`, \`0\`, \`-0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`). Truthy values like \`"0"\`, \`[]\` and \`{}\` stay.

Example: \`compact([0, 1, "", "a", null, NaN])\` → \`[1, "a"]\``,
      starter: `function compact(values) {

}`,
      solution: `function compact(values) {
  return values.filter(Boolean);
}`,
      tests: [
        { name: "removes falsy values", code: `assert.deepEqual(compact([0, 1, "", "a", null, NaN, undefined, false, -0]), [1, "a"]);` },
        { name: "keeps truthy look-alikes", code: `assert.deepEqual(compact(["0", "false", [], {}]), ["0", "false", [], {}]);` },
        { name: "handles an empty array", code: `assert.deepEqual(compact([]), []);` },
      ],
    },
    {
      slug: "find-first",
      title: "find: the first match",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order"],
      description: `Write \`firstOver(numbers, limit)\` that returns the first number strictly greater than \`limit\`, or \`undefined\` if there is none. Zero is a valid result.

Example: \`firstOver([1, 5, 8], 4)\` → \`5\``,
      starter: `function firstOver(numbers, limit) {

}`,
      solution: `function firstOver(numbers, limit) {
  return numbers.find((n) => n > limit);
}`,
      tests: [
        { name: "returns the first match", code: `assert.equal(firstOver([1, 5, 8], 4), 5);` },
        { name: "can return 0", code: `assert.equal(firstOver([-3, 0, 5], -1), 0);` },
        { name: "returns undefined when nothing matches", code: `assert.equal(firstOver([1, 2], 10), undefined);` },
      ],
    },
    {
      slug: "find-index",
      title: "findIndex",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order"],
      description: `Write \`indexOfId(items, id)\` that returns the index of the first item whose \`id\` equals \`id\`, or \`-1\` if there is none.

Example: \`indexOfId([{ id: 7 }, { id: 9 }], 9)\` → \`1\``,
      starter: `function indexOfId(items, id) {

}`,
      solution: `function indexOfId(items, id) {
  return items.findIndex((item) => item.id === id);
}`,
      tests: [
        { name: "finds the index", code: `assert.equal(indexOfId([{ id: 7 }, { id: 9 }], 9), 1);` },
        { name: "returns 0 for the first item", code: `assert.equal(indexOfId([{ id: 7 }, { id: 9 }], 7), 0);` },
        { name: "returns -1 when missing", code: `assert.equal(indexOfId([{ id: 7 }], 3), -1);` },
        { name: "returns the first of duplicates", code: `assert.equal(indexOfId([{ id: 1 }, { id: 2 }, { id: 2 }], 2), 1);` },
      ],
    },
    {
      slug: "find-last",
      title: "findLast",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order", "immutability"],
      description: `Write \`lastError(entries)\` that returns the last entry whose \`level\` is \`"error"\`, or \`undefined\`. Do not mutate or reorder the input.

Example: \`lastError([{ level: "error", msg: "a" }, { level: "info", msg: "b" }, { level: "error", msg: "c" }])\` → \`{ level: "error", msg: "c" }\``,
      starter: `function lastError(entries) {

}`,
      solution: `function lastError(entries) {
  return entries.findLast((entry) => entry.level === "error");
}`,
      tests: [
        {
          name: "returns the last error",
          code: `const log = [{ level: "error", msg: "a" }, { level: "info", msg: "b" }, { level: "error", msg: "c" }];
assert.deepEqual(lastError(log), { level: "error", msg: "c" });`,
        },
        { name: "returns undefined when there are no errors", code: `assert.equal(lastError([{ level: "info", msg: "x" }]), undefined);` },
        {
          name: "leaves the input order alone",
          code: `const log = [{ level: "error", msg: "a" }, { level: "info", msg: "b" }];
lastError(log);
assert.deepEqual(log.map((e) => e.msg), ["a", "b"]);`,
        },
      ],
    },
    {
      slug: "some-negative",
      title: "some: any negative number",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order"],
      description: `Write \`hasNegative(numbers)\` that returns \`true\` if at least one number is below zero. An empty array has none.

Example: \`hasNegative([3, -1, 4])\` → \`true\``,
      starter: `function hasNegative(numbers) {

}`,
      solution: `function hasNegative(numbers) {
  return numbers.some((n) => n < 0);
}`,
      tests: [
        { name: "detects a negative number", code: `assert.equal(hasNegative([3, -1, 4]), true);` },
        { name: "returns false when all are non-negative", code: `assert.equal(hasNegative([0, 1, 2]), false);` },
        { name: "returns false for an empty array", code: `assert.equal(hasNegative([]), false);` },
      ],
    },
    {
      slug: "every-string",
      title: "every: all strings",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order"],
      description: `Write \`allStrings(values)\` that returns \`true\` when every value is a primitive string. An empty array returns \`true\` (vacuous truth).

Example: \`allStrings(["a", "b", 1])\` → \`false\``,
      starter: `function allStrings(values) {

}`,
      solution: `function allStrings(values) {
  return values.every((v) => typeof v === "string");
}`,
      tests: [
        { name: "returns true for all strings", code: `assert.equal(allStrings(["a", "", "c"]), true);` },
        { name: "returns false when one is not a string", code: `assert.equal(allStrings(["a", "b", 1]), false);` },
        { name: "returns true for an empty array", code: `assert.equal(allStrings([]), true);` },
      ],
    },
    {
      slug: "includes-vs-indexof",
      title: "includes vs indexOf (NaN)",
      kind: "fix",
      difficulty: 2,
      tags: ["equality"],
      description: `\`contains(values, target)\` should report whether \`target\` is in the array, and it must work for every value including \`NaN\`. It currently gets one case wrong. Fix it.

Example: \`contains([1, NaN], NaN)\` → \`true\``,
      starter: `function contains(values, target) {
  return values.indexOf(target) !== -1;
}`,
      solution: `function contains(values, target) {
  return values.includes(target);
}`,
      tests: [
        { name: "finds a regular value", code: `assert.equal(contains([1, 2, 3], 2), true);` },
        { name: "returns false for a missing value", code: `assert.equal(contains([1, 2, 3], 4), false);` },
        { name: "finds NaN", code: `assert.equal(contains([1, NaN], NaN), true);` },
      ],
      hints: ["`indexOf` uses `===`, and `NaN !== NaN`."],
    },
    {
      slug: "reduce-sum",
      title: "reduce: sum",
      kind: "implement",
      difficulty: 1,
      tags: ["reduce", "higher-order"],
      description: `Write \`sum(numbers)\` using \`reduce\`. An empty array sums to \`0\`.

Example: \`sum([1, 2, 3])\` → \`6\``,
      starter: `function sum(numbers) {

}`,
      solution: `function sum(numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}`,
      tests: [
        { name: "sums the numbers", code: `assert.equal(sum([1, 2, 3]), 6);` },
        { name: "handles negatives", code: `assert.equal(sum([5, -7]), -2);` },
        { name: "returns 0 for an empty array", code: `assert.equal(sum([]), 0);` },
      ],
    },
    {
      slug: "reduce-max",
      title: "reduce: max",
      kind: "implement",
      difficulty: 2,
      tags: ["reduce", "higher-order"],
      description: `Write \`max(numbers)\` using \`reduce\` (not \`Math.max\`). It must work when every number is negative, and return \`undefined\` for an empty array.

Example: \`max([-5, -2, -9])\` → \`-2\``,
      starter: `function max(numbers) {

}`,
      solution: `function max(numbers) {
  if (numbers.length === 0) return undefined;
  return numbers.reduce((best, n) => (n > best ? n : best));
}`,
      tests: [
        { name: "finds the largest number", code: `assert.equal(max([3, 9, 4]), 9);` },
        { name: "works with all negatives", code: `assert.equal(max([-5, -2, -9]), -2);` },
        { name: "returns undefined for an empty array", code: `assert.equal(max([]), undefined);` },
      ],
      hints: ["Seeding the accumulator with `0` breaks the all-negative case. Omit the seed instead."],
    },
    {
      slug: "reduce-count",
      title: "reduce: count occurrences",
      kind: "implement",
      difficulty: 2,
      tags: ["reduce", "objects"],
      description: `Write \`countOccurrences(items)\` that returns an object mapping each string to how many times it appears. It must work for any string, including names that exist on \`Object.prototype\` such as \`"constructor"\`.

Example: \`countOccurrences(["a", "b", "a"])\` → \`{ a: 2, b: 1 }\``,
      starter: `function countOccurrences(items) {

}`,
      solution: `function countOccurrences(items) {
  return items.reduce((counts, item) => {
    counts[item] = (counts[item] ?? 0) + 1;
    return counts;
  }, Object.create(null));
}`,
      tests: [
        { name: "counts each string", code: `assert.deepEqual(countOccurrences(["a", "b", "a"]), { a: 2, b: 1 });` },
        { name: "returns {} for an empty array", code: `assert.deepEqual(countOccurrences([]), {});` },
        {
          name: "handles keys like constructor and toString",
          code: `assert.deepEqual(countOccurrences(["constructor", "toString", "constructor"]), { constructor: 2, toString: 1 });`,
        },
      ],
      hints: ["`{}` inherits `constructor` from `Object.prototype`. Start from `Object.create(null)` or check `Object.hasOwn`."],
    },
    {
      slug: "reduce-group-by",
      title: "reduce: group by",
      kind: "implement",
      difficulty: 2,
      tags: ["reduce", "higher-order"],
      description: `Write \`groupBy(items, keyFn)\` using \`reduce\`. It returns an object whose keys are the results of \`keyFn(item)\` and whose values are arrays of items, in input order.

Example: \`groupBy([1, 2, 3, 4], (n) => (n % 2 ? "odd" : "even"))\` → \`{ odd: [1, 3], even: [2, 4] }\``,
      starter: `function groupBy(items, keyFn) {

}`,
      solution: `function groupBy(items, keyFn) {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    (groups[key] ??= []).push(item);
    return groups;
  }, {});
}`,
      tests: [
        {
          name: "groups by the key function",
          code: `assert.deepEqual(groupBy([1, 2, 3, 4], (n) => (n % 2 ? "odd" : "even")), { odd: [1, 3], even: [2, 4] });`,
        },
        {
          name: "groups objects by a property",
          code: `const people = [{ n: "a", team: "x" }, { n: "b", team: "y" }, { n: "c", team: "x" }];
const g = groupBy(people, (p) => p.team);
assert.deepEqual(g.x.map((p) => p.n), ["a", "c"]);
assert.deepEqual(g.y.map((p) => p.n), ["b"]);`,
        },
        { name: "returns {} for an empty array", code: `assert.deepEqual(groupBy([], (x) => x), {});` },
      ],
    },
    {
      slug: "reduce-pairs-to-object",
      title: "reduce: build an object from pairs",
      kind: "implement",
      difficulty: 1,
      tags: ["reduce", "objects"],
      description: `Write \`toObject(pairs)\` using \`reduce\`. Each pair is \`[key, value]\`; a later pair with the same key wins.

Example: \`toObject([["a", 1], ["b", 2]])\` → \`{ a: 1, b: 2 }\``,
      starter: `function toObject(pairs) {

}`,
      solution: `function toObject(pairs) {
  return pairs.reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
}`,
      tests: [
        { name: "builds an object", code: `assert.deepEqual(toObject([["a", 1], ["b", 2]]), { a: 1, b: 2 });` },
        { name: "later keys win", code: `assert.deepEqual(toObject([["a", 1], ["a", 3]]), { a: 3 });` },
        { name: "returns {} for no pairs", code: `assert.deepEqual(toObject([]), {});` },
      ],
    },
    {
      slug: "sort-numbers",
      title: "Sort numbers correctly",
      kind: "fix",
      difficulty: 1,
      tags: ["sort"],
      description: `\`sortAscending(numbers)\` should return a new array sorted from smallest to largest, but its output is wrong for some inputs. Fix it.

Example: \`sortAscending([10, 9, 1, 100])\` → \`[1, 9, 10, 100]\``,
      starter: `function sortAscending(numbers) {
  return [...numbers].sort();
}`,
      solution: `function sortAscending(numbers) {
  return [...numbers].sort((a, b) => a - b);
}`,
      tests: [
        { name: "sorts multi-digit numbers numerically", code: `assert.deepEqual(sortAscending([10, 9, 1, 100]), [1, 9, 10, 100]);` },
        { name: "sorts negatives", code: `assert.deepEqual(sortAscending([3, -10, -2]), [-10, -2, 3]);` },
        {
          name: "does not mutate the input",
          code: `const input = [3, 1, 2];
sortAscending(input);
assert.deepEqual(input, [3, 1, 2]);`,
        },
      ],
    },
    {
      slug: "sort-objects-by-key",
      title: "Sort objects by key",
      kind: "implement",
      difficulty: 2,
      tags: ["sort", "immutability"],
      description: `Write \`sortBy(items, key)\` that returns a new array sorted ascending by \`item[key]\`. Values are all numbers or all strings. Items with equal keys keep their original order, and the input is not mutated.

Example: \`sortBy([{ age: 30 }, { age: 25 }], "age")\` → \`[{ age: 25 }, { age: 30 }]\``,
      starter: `function sortBy(items, key) {

}`,
      solution: `function sortBy(items, key) {
  return items.toSorted((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
}`,
      tests: [
        { name: "sorts by a numeric key", code: `assert.deepEqual(sortBy([{ age: 30 }, { age: 25 }, { age: 41 }], "age"), [{ age: 25 }, { age: 30 }, { age: 41 }]);` },
        { name: "sorts by a string key", code: `assert.deepEqual(sortBy([{ n: "cy" }, { n: "al" }, { n: "bo" }], "n").map((x) => x.n), ["al", "bo", "cy"]);` },
        {
          name: "keeps equal keys in original order",
          code: `const items = [{ k: 2, id: "a" }, { k: 1, id: "b" }, { k: 2, id: "c" }, { k: 1, id: "d" }];
assert.deepEqual(sortBy(items, "k").map((x) => x.id), ["b", "d", "a", "c"]);`,
        },
        {
          name: "does not mutate the input",
          code: `const items = [{ k: 2 }, { k: 1 }];
const out = sortBy(items, "k");
assert.notEqual(out, items);
assert.equal(items[0].k, 2);`,
        },
      ],
    },
    {
      slug: "sort-case-insensitive",
      title: "Sort strings case-insensitively",
      kind: "implement",
      difficulty: 2,
      tags: ["sort", "strings"],
      description: `Write \`sortWords(words)\` that returns a new array sorted alphabetically, ignoring case. The original casing of each word is kept in the output.

Example: \`sortWords(["banana", "Apple", "cherry"])\` → \`["Apple", "banana", "cherry"]\``,
      starter: `function sortWords(words) {

}`,
      solution: `function sortWords(words) {
  return words.toSorted((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}`,
      tests: [
        { name: "ignores case", code: `assert.deepEqual(sortWords(["banana", "Apple", "cherry"]), ["Apple", "banana", "cherry"]);` },
        { name: "puts lowercase-first words in the right place", code: `assert.deepEqual(sortWords(["Zed", "alpha", "Mike"]), ["alpha", "Mike", "Zed"]);` },
        {
          name: "does not mutate the input",
          code: `const input = ["b", "A"];
sortWords(input);
assert.deepEqual(input, ["b", "A"]);`,
        },
      ],
    },
    {
      slug: "to-sorted",
      title: "Sort without mutating (toSorted)",
      kind: "fix",
      difficulty: 1,
      tags: ["sort", "immutability"],
      description: `\`ranked(scores)\` should return the scores from highest to lowest. It returns the right values, but callers report that their own arrays change after calling it. Fix it.

Example: \`ranked([50, 90, 70])\` → \`[90, 70, 50]\``,
      starter: `function ranked(scores) {
  return scores.sort((a, b) => b - a);
}`,
      solution: `function ranked(scores) {
  return scores.toSorted((a, b) => b - a);
}`,
      tests: [
        { name: "sorts descending", code: `assert.deepEqual(ranked([50, 90, 70]), [90, 70, 50]);` },
        {
          name: "leaves the input untouched",
          code: `const scores = [50, 90, 70];
ranked(scores);
assert.deepEqual(scores, [50, 90, 70]);`,
        },
        {
          name: "returns a new array",
          code: `const scores = [1];
assert.notEqual(ranked(scores), scores);`,
        },
      ],
    },
    {
      slug: "to-reversed",
      title: "Reverse without mutating (toReversed)",
      kind: "fix",
      difficulty: 1,
      tags: ["immutability"],
      description: `\`latestFirst(events)\` should return the events newest first (the input is oldest first). It works once, but a second call with the same array returns the wrong order. Fix it.

Example: \`latestFirst(["a", "b", "c"])\` → \`["c", "b", "a"]\``,
      starter: `function latestFirst(events) {
  return events.reverse();
}`,
      solution: `function latestFirst(events) {
  return events.toReversed();
}`,
      tests: [
        { name: "reverses the order", code: `assert.deepEqual(latestFirst(["a", "b", "c"]), ["c", "b", "a"]);` },
        {
          name: "returns the same result when called twice",
          code: `const events = ["a", "b", "c"];
latestFirst(events);
assert.deepEqual(latestFirst(events), ["c", "b", "a"]);`,
        },
        {
          name: "does not mutate the input",
          code: `const events = ["a", "b"];
latestFirst(events);
assert.deepEqual(events, ["a", "b"]);`,
        },
      ],
    },
    {
      slug: "slice-vs-splice",
      title: "slice vs splice",
      kind: "fix",
      difficulty: 1,
      tags: ["immutability"],
      description: `\`firstN(items, n)\` should return the first \`n\` items without changing \`items\`. The return value looks right, but something else is wrong. Fix it.

Example: \`firstN(["a", "b", "c"], 2)\` → \`["a", "b"]\``,
      starter: `function firstN(items, n) {
  return items.splice(0, n);
}`,
      solution: `function firstN(items, n) {
  return items.slice(0, n);
}`,
      tests: [
        { name: "returns the first n items", code: `assert.deepEqual(firstN(["a", "b", "c"], 2), ["a", "b"]);` },
        { name: "returns everything when n exceeds length", code: `assert.deepEqual(firstN(["a"], 5), ["a"]);` },
        {
          name: "does not modify the input",
          code: `const items = ["a", "b", "c"];
firstN(items, 2);
assert.deepEqual(items, ["a", "b", "c"]);`,
        },
      ],
    },
    {
      slug: "splice-remove-insert",
      title: "splice: remove and insert",
      kind: "implement",
      difficulty: 2,
      tags: ["mutation"],
      description: `Write \`moveItem(arr, from, to)\` that moves the element at index \`from\` so it ends up at index \`to\`. It mutates \`arr\` in place and returns the same array.

Example: \`moveItem(["a", "b", "c", "d"], 0, 2)\` → \`["b", "c", "a", "d"]\``,
      starter: `function moveItem(arr, from, to) {

}`,
      solution: `function moveItem(arr, from, to) {
  const [item] = arr.splice(from, 1);
  arr.splice(to, 0, item);
  return arr;
}`,
      tests: [
        { name: "moves an item forward", code: `assert.deepEqual(moveItem(["a", "b", "c", "d"], 0, 2), ["b", "c", "a", "d"]);` },
        { name: "moves an item backward", code: `assert.deepEqual(moveItem(["a", "b", "c", "d"], 3, 0), ["d", "a", "b", "c"]);` },
        {
          name: "mutates and returns the same array",
          code: `const arr = [1, 2, 3];
assert.equal(moveItem(arr, 2, 1), arr);
assert.deepEqual(arr, [1, 3, 2]);`,
        },
      ],
      hints: ["`splice(from, 1)` returns an array of the removed items; `splice(to, 0, x)` inserts."],
    },
    {
      slug: "concat-and-spread",
      title: "concat and spread",
      kind: "fix",
      difficulty: 2,
      tags: ["immutability"],
      description: `\`append(arr, item)\` should return a new array with \`item\` added as the single last element, whatever \`item\` is. Some inputs produce the wrong shape. Fix it.

Example: \`append([1], [2, 3])\` → \`[1, [2, 3]]\``,
      starter: `function append(arr, item) {
  return arr.concat(item);
}`,
      solution: `function append(arr, item) {
  return [...arr, item];
}`,
      tests: [
        { name: "appends a primitive", code: `assert.deepEqual(append([1, 2], 3), [1, 2, 3]);` },
        { name: "appends an array as one element", code: `assert.deepEqual(append([1], [2, 3]), [1, [2, 3]]);` },
        {
          name: "does not mutate the input",
          code: `const arr = [1];
const out = append(arr, 2);
assert.notEqual(out, arr);
assert.deepEqual(arr, [1]);`,
        },
      ],
      hints: ["`concat` spreads any array arguments one level."],
    },
    {
      slug: "flat",
      title: "flat",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays"],
      description: `Write \`flattenAll(nested)\` that flattens an array nested to any depth into a single-level array.

Example: \`flattenAll([1, [2, [3, [4]]]])\` → \`[1, 2, 3, 4]\``,
      starter: `function flattenAll(nested) {

}`,
      solution: `function flattenAll(nested) {
  return nested.flat(Infinity);
}`,
      tests: [
        { name: "flattens deep nesting", code: `assert.deepEqual(flattenAll([1, [2, [3, [4]]]]), [1, 2, 3, 4]);` },
        { name: "leaves a flat array as is", code: `assert.deepEqual(flattenAll([1, 2]), [1, 2]);` },
        { name: "drops empty sub-arrays", code: `assert.deepEqual(flattenAll([[], [[]], [1]]), [1]);` },
      ],
    },
    {
      slug: "flat-map",
      title: "flatMap",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order"],
      description: `Write \`allTags(posts)\` that returns every tag from every post in one flat array, in order. A post without a \`tags\` property contributes nothing.

Example: \`allTags([{ tags: ["js", "css"] }, { tags: ["html"] }])\` → \`["js", "css", "html"]\``,
      starter: `function allTags(posts) {

}`,
      solution: `function allTags(posts) {
  return posts.flatMap((post) => post.tags ?? []);
}`,
      tests: [
        { name: "collects tags in order", code: `assert.deepEqual(allTags([{ tags: ["js", "css"] }, { tags: ["html"] }]), ["js", "css", "html"]);` },
        { name: "skips posts without tags", code: `assert.deepEqual(allTags([{ tags: ["a"] }, {}, { tags: [] }]), ["a"]);` },
        { name: "keeps duplicates", code: `assert.deepEqual(allTags([{ tags: ["a"] }, { tags: ["a"] }]), ["a", "a"]);` },
      ],
    },
    {
      slug: "join-sentence",
      title: "join into a sentence",
      kind: "implement",
      difficulty: 2,
      tags: ["strings"],
      description: `Write \`toSentence(items)\` that joins strings into an English list: commas between items, \`" and "\` before the last one, no Oxford comma. One item is returned as is; an empty array gives \`""\`.

Example: \`toSentence(["a", "b", "c"])\` → \`"a, b and c"\``,
      starter: `function toSentence(items) {

}`,
      solution: `function toSentence(items) {
  if (items.length <= 1) return items.join("");
  return \`\${items.slice(0, -1).join(", ")} and \${items.at(-1)}\`;
}`,
      tests: [
        { name: "joins three or more items", code: `assert.equal(toSentence(["a", "b", "c", "d"]), "a, b, c and d");` },
        { name: "joins two items with and", code: `assert.equal(toSentence(["tea", "coffee"]), "tea and coffee");` },
        { name: "returns a single item unchanged", code: `assert.equal(toSentence(["solo"]), "solo");` },
        { name: "returns an empty string for []", code: `assert.equal(toSentence([]), "");` },
      ],
    },
    {
      slug: "array-from-map",
      title: "Array.from with a mapping function",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays"],
      description: `Write \`range(start, end)\` that returns the integers from \`start\` (inclusive) to \`end\` (exclusive). If \`end <= start\`, return \`[]\`.

Example: \`range(2, 6)\` → \`[2, 3, 4, 5]\``,
      starter: `function range(start, end) {

}`,
      solution: `function range(start, end) {
  return Array.from({ length: Math.max(0, end - start) }, (_, i) => start + i);
}`,
      tests: [
        { name: "builds the range", code: `assert.deepEqual(range(2, 6), [2, 3, 4, 5]);` },
        { name: "works with negatives", code: `assert.deepEqual(range(-2, 1), [-2, -1, 0]);` },
        { name: "returns [] when end <= start", code: `assert.deepEqual(range(5, 5), []); assert.deepEqual(range(5, 1), []);` },
      ],
    },
    {
      slug: "array-of-fill",
      title: "fill: the shared reference trap",
      kind: "fix",
      difficulty: 2,
      tags: ["arrays", "references"],
      description: `\`makeGrid(rows, cols)\` should return a \`rows × cols\` grid of zeros where every row is independent. Writing to one cell currently changes other rows too. Fix it.

Example: \`makeGrid(2, 3)\` → \`[[0, 0, 0], [0, 0, 0]]\``,
      starter: `function makeGrid(rows, cols) {
  return new Array(rows).fill(new Array(cols).fill(0));
}`,
      solution: `function makeGrid(rows, cols) {
  return Array.from({ length: rows }, () => new Array(cols).fill(0));
}`,
      tests: [
        { name: "has the right shape", code: `assert.deepEqual(makeGrid(2, 3), [[0, 0, 0], [0, 0, 0]]);` },
        {
          name: "rows are independent",
          code: `const grid = makeGrid(3, 2);
grid[0][0] = 1;
assert.deepEqual(grid, [[1, 0], [0, 0], [0, 0]]);`,
        },
        { name: "handles zero rows", code: `assert.deepEqual(makeGrid(0, 3), []);` },
      ],
      hints: ["`fill(x)` puts the same reference `x` in every slot."],
    },
    {
      slug: "at-negative",
      title: "at() with a negative index",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays"],
      description: `Write \`fromEnd(arr, n)\` that returns the \`n\`th element counting from the end (\`n = 1\` is the last element), or \`undefined\` if out of range.

Example: \`fromEnd(["a", "b", "c"], 1)\` → \`"c"\``,
      starter: `function fromEnd(arr, n) {

}`,
      solution: `function fromEnd(arr, n) {
  return arr.at(-n);
}`,
      tests: [
        { name: "returns the last element for n = 1", code: `assert.equal(fromEnd(["a", "b", "c"], 1), "c");` },
        { name: "returns the first element for n = length", code: `assert.equal(fromEnd(["a", "b", "c"], 3), "a");` },
        { name: "returns undefined out of range", code: `assert.equal(fromEnd(["a", "b", "c"], 4), undefined);` },
        { name: "returns undefined for an empty array", code: `assert.equal(fromEnd([], 1), undefined);` },
      ],
    },
    {
      slug: "chain",
      title: "Chain map, filter and reduce",
      kind: "implement",
      difficulty: 2,
      tags: ["higher-order", "reduce"],
      description: `Write \`paidRevenue(orders)\` that returns the total of \`price * qty\` across orders whose \`status\` is \`"paid"\`. No paid orders gives \`0\`.

Example: \`paidRevenue([{ status: "paid", price: 10, qty: 2 }, { status: "refunded", price: 5, qty: 1 }])\` → \`20\``,
      starter: `function paidRevenue(orders) {

}`,
      solution: `function paidRevenue(orders) {
  return orders
    .filter((order) => order.status === "paid")
    .map((order) => order.price * order.qty)
    .reduce((total, amount) => total + amount, 0);
}`,
      tests: [
        {
          name: "sums paid orders only",
          code: `const orders = [
  { status: "paid", price: 10, qty: 2 },
  { status: "refunded", price: 5, qty: 1 },
  { status: "paid", price: 3, qty: 3 },
];
assert.equal(paidRevenue(orders), 29);`,
        },
        { name: "returns 0 with no paid orders", code: `assert.equal(paidRevenue([{ status: "pending", price: 1, qty: 1 }]), 0);` },
        { name: "returns 0 for an empty array", code: `assert.equal(paidRevenue([]), 0);` },
      ],
    },
  ],
};

export default topic;

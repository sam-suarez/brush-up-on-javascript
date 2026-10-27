import type { Topic } from "../types";

const topic: Topic = {
  course: "practice",
  slug: "arrays-practice",
  title: "JavaScript Arrays",
  description: "Set operations, chunking, zipping, matrices, searching and sliding windows.",
  tags: ["arrays", "algorithms"],
  count: 22,
  challenges: [
    {
      slug: "remove-duplicates",
      title: "Remove duplicates",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "sets"],
      description: `Write \`unique(arr)\` that returns a new array without duplicates, keeping the first occurrence of each value in order. Use SameValueZero equality (so \`NaN\` is deduplicated, and \`1\` and \`"1"\` are different). Don't mutate the input.

Example: \`unique([1, 2, 2, 3, 1])\` → \`[1, 2, 3]\``,
      starter: `function unique(arr) {\n  \n}`,
      solution: `function unique(arr) {\n  return [...new Set(arr)];\n}`,
      tests: [
        { name: "removes duplicates keeping first occurrences", code: `assert.deepEqual(unique([1, 2, 2, 3, 1]), [1, 2, 3]);` },
        { name: "handles an empty array", code: `assert.deepEqual(unique([]), []);` },
        { name: "treats 1 and \"1\" as different", code: `assert.deepEqual(unique([1, "1", 1]), [1, "1"]);` },
        { name: "deduplicates NaN", code: `assert.deepEqual(unique([NaN, NaN, 0]), [NaN, 0]);` },
        { name: "does not mutate the input", code: `const input = [3, 3, 1]; const out = unique(input); assert.deepEqual(input, [3, 3, 1]); assert.notEqual(out, input);` },
      ],
    },
    {
      slug: "intersection",
      title: "Intersection",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "sets"],
      description: `Write \`intersection(a, b)\` that returns the values present in both arrays, in the order they first appear in \`a\`, without duplicates.

Example: \`intersection([1, 2, 2, 3], [2, 3, 4])\` → \`[2, 3]\``,
      starter: `function intersection(a, b) {\n  return a.filter((x) => b.includes(x));\n}`,
      solution: `function intersection(a, b) {\n  const inB = new Set(b);\n  return [...new Set(a)].filter((x) => inB.has(x));\n}`,
      tests: [
        { name: "returns common values without duplicates", code: `assert.deepEqual(intersection([1, 2, 2, 3], [2, 3, 4]), [2, 3]);` },
        { name: "keeps the order of the first array", code: `assert.deepEqual(intersection([3, 1, 2], [1, 2, 3]), [3, 1, 2]);` },
        { name: "returns [] when nothing is shared", code: `assert.deepEqual(intersection([1, 2], [3, 4]), []);` },
        { name: "handles empty arrays", code: `assert.deepEqual(intersection([], [1]), []); assert.deepEqual(intersection([1], []), []);` },
      ],
    },
    {
      slug: "difference",
      title: "Difference",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "sets"],
      description: `Write \`difference(a, b)\` that returns the values of \`a\` that are not in \`b\`, keeping \`a\`'s order and any duplicates in \`a\`.

Example: \`difference([1, 2, 2, 3, 4], [2, 4])\` → \`[1, 3]\``,
      starter: `function difference(a, b) {\n  \n}`,
      solution: `function difference(a, b) {\n  const exclude = new Set(b);\n  return a.filter((x) => !exclude.has(x));\n}`,
      tests: [
        { name: "removes values found in b", code: `assert.deepEqual(difference([1, 2, 2, 3, 4], [2, 4]), [1, 3]);` },
        { name: "keeps duplicates from a", code: `assert.deepEqual(difference([1, 1, 3], [2]), [1, 1, 3]);` },
        { name: "returns [] when everything is excluded", code: `assert.deepEqual(difference([1, 2], [2, 1]), []);` },
        { name: "handles empty arrays", code: `assert.deepEqual(difference([], [1]), []); assert.deepEqual(difference([1], []), [1]);` },
      ],
    },
    {
      slug: "union",
      title: "Union",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "sets"],
      description: `Write \`union(a, b)\` that returns every value that appears in either array, once, in order of first appearance (all of \`a\` first, then new values from \`b\`).

Example: \`union([1, 2, 2], [2, 3, 1, 4])\` → \`[1, 2, 3, 4]\``,
      starter: `function union(a, b) {\n  return [...a, ...b];\n}`,
      solution: `function union(a, b) {\n  return [...new Set([...a, ...b])];\n}`,
      tests: [
        { name: "merges without duplicates", code: `assert.deepEqual(union([1, 2, 2], [2, 3, 1, 4]), [1, 2, 3, 4]);` },
        { name: "keeps order of first appearance", code: `assert.deepEqual(union(["b", "a"], ["c", "a"]), ["b", "a", "c"]);` },
        { name: "handles empty arrays", code: `assert.deepEqual(union([], []), []); assert.deepEqual(union([], [1, 1]), [1]);` },
      ],
    },
    {
      slug: "chunk",
      title: "Chunk",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays"],
      description: `Write \`chunk(arr, size)\` that splits \`arr\` into arrays of length \`size\`; the last chunk holds whatever is left. An empty array gives \`[]\`. Throw a \`RangeError\` if \`size\` is less than 1.

Example: \`chunk([1, 2, 3, 4, 5], 2)\` → \`[[1, 2], [3, 4], [5]]\``,
      starter: `function chunk(arr, size) {\n  \n}`,
      solution: `function chunk(arr, size) {
  if (size < 1) throw new RangeError("size must be at least 1");
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}`,
      tests: [
        { name: "splits with a smaller last chunk", code: `assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);` },
        { name: "splits evenly", code: `assert.deepEqual(chunk([1, 2, 3, 4], 2), [[1, 2], [3, 4]]);` },
        { name: "returns one chunk when size exceeds length", code: `assert.deepEqual(chunk([1, 2], 5), [[1, 2]]);` },
        { name: "returns [] for an empty array", code: `assert.deepEqual(chunk([], 3), []);` },
        { name: "throws a RangeError for size < 1", code: `assert.throws(() => chunk([1], 0), RangeError);` },
      ],
    },
    {
      slug: "zip",
      title: "Zip two arrays",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays"],
      description: `Write \`zip(a, b)\` that pairs up elements by index: \`[[a[0], b[0]], [a[1], b[1]], ...]\`. Stop at the end of the shorter array.

Example: \`zip([1, 2, 3], ["a", "b"])\` → \`[[1, "a"], [2, "b"]]\``,
      starter: `function zip(a, b) {\n  return a.map((x, i) => [x, b[i]]);\n}`,
      solution: `function zip(a, b) {\n  const length = Math.min(a.length, b.length);\n  return Array.from({ length }, (_, i) => [a[i], b[i]]);\n}`,
      tests: [
        { name: "pairs equal-length arrays", code: `assert.deepEqual(zip([1, 2], ["a", "b"]), [[1, "a"], [2, "b"]]);` },
        { name: "stops at the shorter first array", code: `assert.deepEqual(zip([1], ["a", "b", "c"]), [[1, "a"]]);` },
        { name: "stops at the shorter second array", code: `assert.deepEqual(zip([1, 2, 3], ["a", "b"]), [[1, "a"], [2, "b"]]);` },
        { name: "returns [] when either is empty", code: `assert.deepEqual(zip([], [1]), []); assert.deepEqual(zip([1], []), []);` },
      ],
    },
    {
      slug: "unzip",
      title: "Unzip",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "destructuring"],
      description: `Write \`unzip(pairs)\` that reverses \`zip\`: given an array of \`[first, second]\` pairs, return \`[firsts, seconds]\`. An empty input gives \`[[], []]\`.

Example: \`unzip([[1, "a"], [2, "b"]])\` → \`[[1, 2], ["a", "b"]]\``,
      starter: `function unzip(pairs) {\n  \n}`,
      solution: `function unzip(pairs) {\n  return [pairs.map(([first]) => first), pairs.map(([, second]) => second)];\n}`,
      tests: [
        { name: "splits pairs into two arrays", code: `assert.deepEqual(unzip([[1, "a"], [2, "b"], [3, "c"]]), [[1, 2, 3], ["a", "b", "c"]]);` },
        { name: "handles a single pair", code: `assert.deepEqual(unzip([[true, null]]), [[true], [null]]);` },
        { name: "returns [[], []] for no pairs", code: `assert.deepEqual(unzip([]), [[], []]);` },
      ],
    },
    {
      slug: "rotate",
      title: "Rotate left by n",
      kind: "implement",
      difficulty: 2,
      tags: ["arrays"],
      description: `Write \`rotateLeft(arr, n)\` that returns a new array rotated \`n\` places to the left. \`n\` larger than the length wraps around, a negative \`n\` rotates right, and an empty array returns \`[]\`. Don't mutate the input.

Example: \`rotateLeft([1, 2, 3, 4, 5], 2)\` → \`[3, 4, 5, 1, 2]\``,
      starter: `function rotateLeft(arr, n) {\n  return [...arr.slice(n), ...arr.slice(0, n)];\n}`,
      solution: `function rotateLeft(arr, n) {
  if (arr.length === 0) return [];
  const k = ((n % arr.length) + arr.length) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
}`,
      tests: [
        { name: "rotates left by 2", code: `assert.deepEqual(rotateLeft([1, 2, 3, 4, 5], 2), [3, 4, 5, 1, 2]);` },
        { name: "wraps n larger than the length", code: `assert.deepEqual(rotateLeft([1, 2, 3, 4, 5], 7), [3, 4, 5, 1, 2]);` },
        { name: "rotates right for negative n", code: `assert.deepEqual(rotateLeft([1, 2, 3, 4, 5], -1), [5, 1, 2, 3, 4]); assert.deepEqual(rotateLeft([1, 2, 3], -4), [3, 1, 2]);` },
        { name: "returns a copy for n = 0", code: `const input = [1, 2]; const out = rotateLeft(input, 0); assert.deepEqual(out, [1, 2]); assert.notEqual(out, input);` },
        { name: "handles an empty array", code: `assert.deepEqual(rotateLeft([], 3), []);` },
      ],
      hints: ["Normalize `n` into `0..length-1` first; `%` keeps the sign of the dividend."],
    },
    {
      slug: "move-element",
      title: "Move an element from one index to another",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "immutability"],
      description: `Write \`move(arr, from, to)\` that returns a new array where the element at index \`from\` ends up at index \`to\`, with the others shifting to make room. Both indices are valid. Don't mutate the input.

Example: \`move(["a", "b", "c", "d"], 0, 2)\` → \`["b", "c", "a", "d"]\``,
      starter: `function move(arr, from, to) {
  const item = arr[from];
  arr.splice(from, 1);
  arr.splice(to, 0, item);
  return arr;
}`,
      solution: `function move(arr, from, to) {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}`,
      tests: [
        { name: "moves an element forwards", code: `assert.deepEqual(move(["a", "b", "c", "d"], 0, 2), ["b", "c", "a", "d"]);` },
        { name: "moves an element backwards", code: `assert.deepEqual(move(["a", "b", "c", "d"], 3, 0), ["d", "a", "b", "c"]);` },
        { name: "moves to the last index", code: `assert.deepEqual(move([1, 2, 3], 0, 2), [2, 3, 1]);` },
        { name: "same index returns an equal copy", code: `assert.deepEqual(move([1, 2, 3], 1, 1), [1, 2, 3]);` },
        { name: "does not mutate the input", code: `const input = [1, 2, 3]; const out = move(input, 0, 2); assert.deepEqual(input, [1, 2, 3]); assert.notEqual(out, input);` },
      ],
    },
    {
      slug: "range",
      title: "Range",
      kind: "implement",
      difficulty: 2,
      tags: ["arrays"],
      description: `Write \`range(start, end, step = 1)\` that returns the numbers from \`start\` up to but not including \`end\`, \`step\` apart. A negative \`step\` counts down. If \`step\` points away from \`end\` (or \`start === end\`) return \`[]\`. Throw a \`RangeError\` if \`step\` is \`0\`.

Example: \`range(1, 10, 3)\` → \`[1, 4, 7]\``,
      starter: `function range(start, end, step = 1) {\n  \n}`,
      solution: `function range(start, end, step = 1) {
  if (step === 0) throw new RangeError("step must not be 0");
  const length = Math.max(0, Math.ceil((end - start) / step));
  return Array.from({ length }, (_, i) => start + i * step);
}`,
      tests: [
        { name: "counts up with the default step", code: `assert.deepEqual(range(0, 5), [0, 1, 2, 3, 4]);` },
        { name: "uses a custom step and excludes end", code: `assert.deepEqual(range(1, 10, 3), [1, 4, 7]); assert.deepEqual(range(0, 6, 2), [0, 2, 4]);` },
        { name: "counts down with a negative step", code: `assert.deepEqual(range(5, 0, -1), [5, 4, 3, 2, 1]);` },
        { name: "handles negative numbers", code: `assert.deepEqual(range(-3, 1), [-3, -2, -1, 0]);` },
        { name: "returns [] for an empty or backwards range", code: `assert.deepEqual(range(3, 3), []); assert.deepEqual(range(5, 0), []); assert.deepEqual(range(0, 5, -1), []);` },
        { name: "throws a RangeError for step 0", code: `assert.throws(() => range(0, 5, 0), RangeError);` },
      ],
      hints: ["Compute the length up front with `Math.ceil((end - start) / step)` and you can't loop forever."],
    },
    {
      slug: "column-sum",
      title: "Sum a column in a 2D array",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "matrix"],
      description: `Write \`columnSum(matrix, col)\` that returns the sum of column \`col\` across all rows. Rows too short to have that column count as \`0\`. An empty matrix sums to \`0\`.

Example: \`columnSum([[1, 2], [3, 4], [5, 6]], 1)\` → \`12\``,
      starter: `function columnSum(matrix, col) {\n  return matrix.reduce((sum, row) => sum + row[col], 0);\n}`,
      solution: `function columnSum(matrix, col) {\n  return matrix.reduce((sum, row) => sum + (row[col] ?? 0), 0);\n}`,
      tests: [
        { name: "sums the second column", code: `assert.equal(columnSum([[1, 2], [3, 4], [5, 6]], 1), 12);` },
        { name: "sums the first column", code: `assert.equal(columnSum([[1, 2], [3, 4], [5, 6]], 0), 9);` },
        { name: "handles negatives", code: `assert.equal(columnSum([[-1], [-2], [3]], 0), 0);` },
        { name: "treats missing cells as 0", code: `assert.equal(columnSum([[1, 2, 3], [4], [5, 6]], 2), 3);` },
        { name: "returns 0 for an empty matrix", code: `assert.equal(columnSum([], 0), 0);` },
      ],
    },
    {
      slug: "transpose",
      title: "Transpose a matrix",
      kind: "implement",
      difficulty: 2,
      tags: ["arrays", "matrix"],
      description: `Write \`transpose(matrix)\` that swaps rows and columns of a rectangular matrix: \`result[c][r] === matrix[r][c]\`. An empty matrix returns \`[]\`. Don't mutate the input.

Example: \`transpose([[1, 2, 3], [4, 5, 6]])\` → \`[[1, 4], [2, 5], [3, 6]]\``,
      starter: `function transpose(matrix) {\n  \n}`,
      solution: `function transpose(matrix) {\n  if (matrix.length === 0) return [];\n  return matrix[0].map((_, c) => matrix.map((row) => row[c]));\n}`,
      tests: [
        { name: "transposes a 2x3 matrix", code: `assert.deepEqual(transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]]);` },
        { name: "transposes a square matrix", code: `assert.deepEqual(transpose([[1, 2], [3, 4]]), [[1, 3], [2, 4]]);` },
        { name: "turns a row into a column", code: `assert.deepEqual(transpose([[1, 2, 3]]), [[1], [2], [3]]);` },
        { name: "returns [] for an empty matrix", code: `assert.deepEqual(transpose([]), []);` },
        { name: "does not mutate the input", code: `const m = [[1, 2], [3, 4]]; transpose(m); assert.deepEqual(m, [[1, 2], [3, 4]]);` },
      ],
    },
    {
      slug: "flatten-deep",
      title: "Flatten deeply",
      kind: "implement",
      difficulty: 2,
      tags: ["arrays", "recursion"],
      description: `Write \`flattenDeep(arr)\` that flattens arbitrarily nested arrays into one flat array, without using \`Array.prototype.flat\` (a test disables it). Don't mutate the input.

Example: \`flattenDeep([1, [2, [3, [4, [5]]]]])\` → \`[1, 2, 3, 4, 5]\``,
      starter: `function flattenDeep(arr) {\n  return arr.flat(Infinity);\n}`,
      solution: `function flattenDeep(arr) {
  return arr.reduce(
    (flat, item) => (Array.isArray(item) ? [...flat, ...flattenDeep(item)] : [...flat, item]),
    [],
  );
}`,
      tests: [
        { name: "flattens deeply nested arrays", code: `assert.deepEqual(flattenDeep([1, [2, [3, [4, [5]]]]]), [1, 2, 3, 4, 5]);` },
        { name: "removes empty nested arrays", code: `assert.deepEqual(flattenDeep([[[]], 1, [[], [2]]]), [1, 2]);` },
        { name: "handles an empty array", code: `assert.deepEqual(flattenDeep([]), []);` },
        { name: "does not flatten non-array values", code: `assert.deepEqual(flattenDeep(["ab", [{ a: 1 }]]), ["ab", { a: 1 }]);` },
        { name: "does not mutate the input", code: `const input = [1, [2, [3]]]; flattenDeep(input); assert.deepEqual(input, [1, [2, [3]]]);` },
        {
          name: "works without Array.prototype.flat",
          code: `const original = Array.prototype.flat;
Array.prototype.flat = function () { throw new Error("flat is disabled"); };
try {
  assert.deepEqual(flattenDeep([1, [2, [3]]]), [1, 2, 3]);
} finally {
  Array.prototype.flat = original;
}`,
        },
      ],
      hints: ["Recurse whenever `Array.isArray(item)`."],
    },
    {
      slug: "second-largest",
      title: "Second largest",
      kind: "implement",
      difficulty: 2,
      tags: ["arrays", "algorithms"],
      description: `Write \`secondLargest(nums)\` that returns the second largest **distinct** value in \`nums\`, or \`null\` if there are fewer than two distinct values. Don't mutate the input.

Example: \`secondLargest([3, 1, 4, 4])\` → \`3\``,
      starter: `function secondLargest(nums) {\n  return nums.sort((a, b) => b - a)[1];\n}`,
      solution: `function secondLargest(nums) {
  let first = -Infinity;
  let second = -Infinity;
  for (const n of nums) {
    if (n > first) [first, second] = [n, first];
    else if (n < first && n > second) second = n;
  }
  return second === -Infinity ? null : second;
}`,
      tests: [
        { name: "ignores duplicates of the largest", code: `assert.equal(secondLargest([3, 1, 4, 4]), 3);` },
        { name: "works regardless of order", code: `assert.equal(secondLargest([10, 50, 20, 40]), 40);` },
        { name: "handles negatives", code: `assert.equal(secondLargest([-1, -2, -3]), -2);` },
        { name: "returns null with fewer than two distinct values", code: `assert.equal(secondLargest([5, 5]), null); assert.equal(secondLargest([7]), null);` },
        { name: "returns null for an empty array", code: `assert.equal(secondLargest([]), null);` },
        { name: "does not mutate the input", code: `const input = [1, 3, 2]; secondLargest(input); assert.deepEqual(input, [1, 3, 2]);` },
      ],
      hints: ["One pass with two variables is enough; think about what happens when you see the max again."],
    },
    {
      slug: "most-frequent",
      title: "Most frequent element",
      kind: "implement",
      difficulty: 2,
      tags: ["arrays", "maps"],
      description: `Write \`mostFrequent(arr)\` that returns the element that occurs most often. Ties go to the element that appears first. Return \`undefined\` for an empty array. Values are compared with SameValueZero, so \`1\` and \`"1"\` are different.

Example: \`mostFrequent(["a", "b", "b", "a", "b"])\` → \`"b"\``,
      starter: `function mostFrequent(arr) {\n  \n}`,
      solution: `function mostFrequent(arr) {
  const counts = new Map();
  for (const item of arr) counts.set(item, (counts.get(item) ?? 0) + 1);
  let best;
  let bestCount = 0;
  for (const [item, count] of counts) {
    if (count > bestCount) [best, bestCount] = [item, count];
  }
  return best;
}`,
      tests: [
        { name: "finds the most frequent element", code: `assert.equal(mostFrequent(["a", "b", "b", "a", "b"]), "b");` },
        { name: "breaks ties by first appearance", code: `assert.equal(mostFrequent([2, 1, 1, 2]), 2);` },
        { name: "distinguishes 1 from \"1\"", code: `assert.equal(mostFrequent([1, "1", "1"]), "1");` },
        { name: "handles a single element", code: `assert.equal(mostFrequent([null]), null);` },
        { name: "returns undefined for an empty array", code: `assert.equal(mostFrequent([]), undefined);` },
      ],
    },
    {
      slug: "partition",
      title: "Partition by predicate",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "higher-order"],
      description: `Write \`partition(arr, predicate)\` that returns \`[pass, fail]\`: elements for which \`predicate(item, index)\` is truthy, and the rest, both in original order.

Example: \`partition([1, 2, 3, 4], (n) => n % 2 === 0)\` → \`[[2, 4], [1, 3]]\``,
      starter: `function partition(arr, predicate) {\n  return [arr.filter(predicate), []];\n}`,
      solution: `function partition(arr, predicate) {
  const pass = [];
  const fail = [];
  arr.forEach((item, index) => (predicate(item, index) ? pass : fail).push(item));
  return [pass, fail];
}`,
      tests: [
        { name: "splits evens and odds", code: `assert.deepEqual(partition([1, 2, 3, 4], (n) => n % 2 === 0), [[2, 4], [1, 3]]);` },
        { name: "uses truthiness", code: `assert.deepEqual(partition([0, "a", "", 1], (x) => x), [["a", 1], [0, ""]]);` },
        { name: "passes the index", code: `assert.deepEqual(partition(["a", "b", "c"], (_, i) => i < 1), [["a"], ["b", "c"]]);` },
        { name: "handles an empty array", code: `assert.deepEqual(partition([], () => true), [[], []]);` },
      ],
    },
    {
      slug: "running-total",
      title: "Running total",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays"],
      description: `Write \`runningTotal(nums)\` that returns an array where each element is the sum of all numbers up to and including that index.

Example: \`runningTotal([1, 2, 3, 4])\` → \`[1, 3, 6, 10]\``,
      starter: `function runningTotal(nums) {\n  \n}`,
      solution: `function runningTotal(nums) {\n  let sum = 0;\n  return nums.map((n) => (sum += n));\n}`,
      tests: [
        { name: "accumulates positive numbers", code: `assert.deepEqual(runningTotal([1, 2, 3, 4]), [1, 3, 6, 10]);` },
        { name: "handles negatives", code: `assert.deepEqual(runningTotal([5, -2, -3]), [5, 3, 0]);` },
        { name: "handles a single element", code: `assert.deepEqual(runningTotal([7]), [7]);` },
        { name: "returns [] for an empty array", code: `assert.deepEqual(runningTotal([]), []);` },
        { name: "does not mutate the input", code: `const input = [1, 1]; runningTotal(input); assert.deepEqual(input, [1, 1]);` },
      ],
    },
    {
      slug: "compact",
      title: "Compact",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "coercion"],
      description: `Write \`compact(arr)\` that returns a new array without falsy values (\`false\`, \`null\`, \`undefined\`, \`0\`, \`-0\`, \`0n\`, \`NaN\`, \`""\`). Truthy look-alikes such as \`"0"\`, \`"false"\`, \`[]\` and \`{}\` stay.

Example: \`compact([0, 1, false, 2, "", 3])\` → \`[1, 2, 3]\``,
      starter: `function compact(arr) {\n  return arr.filter((x) => x != null);\n}`,
      solution: `function compact(arr) {\n  return arr.filter(Boolean);\n}`,
      tests: [
        { name: "removes falsy values", code: `assert.deepEqual(compact([0, 1, false, 2, "", 3]), [1, 2, 3]);` },
        { name: "removes every falsy kind", code: `assert.deepEqual(compact([null, undefined, NaN, -0, 0n, "x"]), ["x"]);` },
        { name: "keeps truthy look-alikes", code: `assert.deepEqual(compact(["0", "false", [], {}]), ["0", "false", [], {}]);` },
        { name: "handles an empty array", code: `assert.deepEqual(compact([]), []);` },
      ],
    },
    {
      slug: "sort-multi-key",
      title: "Sort by multiple keys",
      kind: "implement",
      difficulty: 2,
      tags: ["arrays", "sorting"],
      description: `Write \`sortByKeys(items, keys)\` that returns a new array of objects sorted by several keys in priority order. A key prefixed with \`-\` sorts descending. Compare values with \`<\` / \`>\` (they are all strings or all numbers per key). Items equal on every key keep their original order. Don't mutate the input.

\`\`\`js
const people = [{ last: "Lee", age: 30 }, { last: "Kim", age: 20 }, { last: "Lee", age: 40 }];
sortByKeys(people, ["last", "-age"]).map((p) => p.age); // [20, 40, 30]
\`\`\``,
      starter: `function sortByKeys(items, keys) {\n  const [key] = keys;\n  return [...items].sort((a, b) => (a[key] < b[key] ? -1 : 1));\n}`,
      solution: `function sortByKeys(items, keys) {
  const specs = keys.map((key) => (key.startsWith("-") ? [key.slice(1), -1] : [key, 1]));
  return items.toSorted((a, b) => {
    for (const [key, direction] of specs) {
      if (a[key] < b[key]) return -direction;
      if (a[key] > b[key]) return direction;
    }
    return 0;
  });
}`,
      tests: [
        {
          name: "sorts by the first key, then the second",
          code: `const people = [{ last: "Lee", first: "Bo" }, { last: "Kim", first: "Al" }, { last: "Lee", first: "Ann" }];
assert.deepEqual(sortByKeys(people, ["last", "first"]).map((p) => p.first), ["Al", "Ann", "Bo"]);`,
        },
        {
          name: "supports a descending key",
          code: `const people = [{ last: "Lee", age: 30 }, { last: "Kim", age: 20 }, { last: "Lee", age: 40 }];
assert.deepEqual(sortByKeys(people, ["last", "-age"]).map((p) => p.age), [20, 40, 30]);`,
        },
        {
          name: "keeps the original order for full ties",
          code: `const items = [{ g: 1, id: "a" }, { g: 0, id: "b" }, { g: 1, id: "c" }, { g: 0, id: "d" }];
assert.deepEqual(sortByKeys(items, ["g"]).map((x) => x.id), ["b", "d", "a", "c"]);`,
        },
        { name: "compares numbers numerically", code: `assert.deepEqual(sortByKeys([{ n: 10 }, { n: 9 }, { n: 100 }], ["n"]).map((x) => x.n), [9, 10, 100]);` },
        {
          name: "does not mutate the input",
          code: `const items = [{ n: 2 }, { n: 1 }];
const out = sortByKeys(items, ["n"]);
assert.deepEqual(items, [{ n: 2 }, { n: 1 }]);
assert.notEqual(out, items);`,
        },
      ],
      hints: ["Return from the comparator as soon as a key differs; only fall through to the next key on a tie."],
    },
    {
      slug: "binary-search",
      title: "Binary search",
      kind: "fix",
      difficulty: 2,
      tags: ["arrays", "algorithms"],
      description: `\`binarySearch(sorted, target)\` should return the index of \`target\` in an ascending array, or \`-1\` if it is absent. It misses some elements that are present. Find and fix the bug.

Example: \`binarySearch([1, 3, 5, 7, 9], 9)\` → \`4\``,
      starter: `function binarySearch(sorted, target) {
  let lo = 0;
  let hi = sorted.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      solution: `function binarySearch(sorted, target) {
  let lo = 0;
  let hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      tests: [
        { name: "finds every element of a small array", code: `const arr = [1, 3, 5, 7, 9]; arr.forEach((x, i) => assert.equal(binarySearch(arr, x), i, String(x)));` },
        { name: "finds the only element", code: `assert.equal(binarySearch([42], 42), 0);` },
        { name: "returns -1 for missing values", code: `const arr = [1, 3, 5]; for (const x of [0, 2, 4, 6]) assert.equal(binarySearch(arr, x), -1, String(x));` },
        { name: "returns -1 for an empty array", code: `assert.equal(binarySearch([], 1), -1);` },
        { name: "works on a large array", code: `const arr = Array.from({ length: 10000 }, (_, i) => i * 2); assert.equal(binarySearch(arr, 19998), 9999); assert.equal(binarySearch(arr, 0), 0); assert.equal(binarySearch(arr, 777), -1);` },
      ],
    },
    {
      slug: "merge-sorted",
      title: "Merge two sorted arrays",
      kind: "implement",
      difficulty: 2,
      tags: ["arrays", "algorithms"],
      description: `Write \`mergeSorted(a, b)\` that merges two ascending arrays of numbers into one ascending array in O(n + m), keeping duplicates. Walk both arrays with two indices: don't concatenate and sort (a test disables \`sort\` and \`toSorted\`). Don't mutate the inputs.

Example: \`mergeSorted([1, 3, 5], [2, 3, 6])\` → \`[1, 2, 3, 3, 5, 6]\``,
      starter: `function mergeSorted(a, b) {\n  return [...a, ...b];\n}`,
      solution: `function mergeSorted(a, b) {
  const merged = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    merged.push(a[i] <= b[j] ? a[i++] : b[j++]);
  }
  return [...merged, ...a.slice(i), ...b.slice(j)];
}`,
      tests: [
        { name: "merges interleaved arrays", code: `assert.deepEqual(mergeSorted([1, 3, 5], [2, 3, 6]), [1, 2, 3, 3, 5, 6]);` },
        { name: "handles one array entirely before the other", code: `assert.deepEqual(mergeSorted([5, 6], [1, 2]), [1, 2, 5, 6]);` },
        { name: "handles empty arrays", code: `assert.deepEqual(mergeSorted([], [1]), [1]); assert.deepEqual(mergeSorted([1], []), [1]); assert.deepEqual(mergeSorted([], []), []);` },
        { name: "handles negatives and different lengths", code: `assert.deepEqual(mergeSorted([-5, 0], [-3, -1, 2, 8]), [-5, -3, -1, 0, 2, 8]);` },
        {
          name: "does not use sort",
          code: `const { sort, toSorted } = Array.prototype;
Array.prototype.sort = Array.prototype.toSorted = function () { throw new Error("sort is disabled"); };
try {
  assert.deepEqual(mergeSorted([1, 4], [2, 3]), [1, 2, 3, 4]);
} finally {
  Object.assign(Array.prototype, { sort, toSorted });
}`,
        },
      ],
    },
    {
      slug: "max-window-sum",
      title: "Sliding window: max sum of k",
      kind: "implement",
      difficulty: 2,
      tags: ["arrays", "algorithms"],
      description: `Write \`maxWindowSum(nums, k)\` that returns the largest sum of any \`k\` consecutive elements. Return \`null\` if \`k\` is less than 1 or greater than \`nums.length\`. Aim for O(n): slide the window instead of re-summing it.

Example: \`maxWindowSum([1, 4, 2, 10, 23, 3, 1, 0, 20], 4)\` → \`39\``,
      starter: `function maxWindowSum(nums, k) {\n  \n}`,
      solution: `function maxWindowSum(nums, k) {
  if (k < 1 || k > nums.length) return null;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    best = Math.max(best, sum);
  }
  return best;
}`,
      tests: [
        { name: "finds the best window", code: `assert.equal(maxWindowSum([1, 4, 2, 10, 23, 3, 1, 0, 20], 4), 39);` },
        { name: "handles all-negative numbers", code: `assert.equal(maxWindowSum([-3, -1, -2], 2), -3);` },
        { name: "k equal to the length sums everything", code: `assert.equal(maxWindowSum([1, 2, 3], 3), 6);` },
        { name: "k = 1 returns the maximum", code: `assert.equal(maxWindowSum([5, -1, 9, 2], 1), 9);` },
        { name: "returns null for an invalid k", code: `assert.equal(maxWindowSum([1, 2], 3), null); assert.equal(maxWindowSum([1, 2], 0), null); assert.equal(maxWindowSum([], 1), null);` },
      ],
      hints: ["When the window moves one step, add the new element and subtract the one that left."],
    },
  ],
};

export default topic;

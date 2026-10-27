import type { Topic } from "../types";

const topic: Topic = {
  course: "interview",
  slug: "classic-puzzles",
  title: "Classic Puzzles",
  description: "The whiteboard favourites: two sum, parentheses, islands, routing and more.",
  tags: ["algorithms", "data structures"],
  count: 10,
  challenges: [
    {
      slug: "two-sum",
      title: "Two sum",
      kind: "implement",
      difficulty: 2,
      tags: ["algorithms"],
      description: `Write \`twoSum(nums, target)\` that returns the indices \`[i, j]\` (with \`i < j\`) of two different elements summing to \`target\`, or \`null\` if there are none. Aim for O(n). Inputs in the tests have at most one solution.

Example: \`twoSum([2, 7, 11, 15], 9)\` → \`[0, 1]\``,
      starter: `function twoSum(nums, target) {

}`,
      solution: `function twoSum(nums, target) {
  const seen = new Map();
  for (const [i, n] of nums.entries()) {
    if (seen.has(target - n)) return [seen.get(target - n), i];
    seen.set(n, i);
  }
  return null;
}`,
      tests: [
        { name: "finds the pair", code: `assert.deepEqual(twoSum([2, 7, 11, 15], 9), [0, 1]);` },
        { name: "does not use the same element twice", code: `assert.deepEqual(twoSum([3, 2, 4], 6), [1, 2]);` },
        { name: "handles duplicate values", code: `assert.deepEqual(twoSum([3, 3], 6), [0, 1]);` },
        { name: "handles negatives", code: `assert.deepEqual(twoSum([-3, 4, 1, 90], -2), [0, 2]);` },
        { name: "returns null when there is no pair", code: `assert.equal(twoSum([1, 2, 3], 100), null);\nassert.equal(twoSum([], 0), null);` },
      ],
    },
    {
      slug: "valid-parentheses",
      title: "Valid parentheses",
      kind: "implement",
      difficulty: 2,
      tags: ["algorithms"],
      description: `Write \`isBalanced(str)\` that returns \`true\` if every \`()\`, \`[]\` and \`{}\` in \`str\` is closed by the matching bracket in the right order. Other characters are ignored. The empty string is balanced.

Example: \`isBalanced("fn(a[0]) { }")\` → \`true\`, \`isBalanced("([)]")\` → \`false\``,
      starter: `function isBalanced(str) {
  let depth = 0;
  for (const ch of str) {
    if ("([{".includes(ch)) depth++;
    if (")]}".includes(ch)) depth--;
  }
  return depth === 0;
}`,
      solution: `function isBalanced(str) {
  const openerFor = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of str) {
    if ("([{".includes(ch)) stack.push(ch);
    else if (Object.hasOwn(openerFor, ch) && stack.pop() !== openerFor[ch]) return false;
  }
  return stack.length === 0;
}`,
      tests: [
        { name: "accepts balanced brackets", code: `assert.equal(isBalanced("()[]{}"), true);\nassert.equal(isBalanced("{[()()]}"), true);` },
        { name: "rejects interleaved brackets", code: `assert.equal(isBalanced("([)]"), false);` },
        { name: "rejects unclosed and early closers", code: `assert.equal(isBalanced("(("), false);\nassert.equal(isBalanced(")("), false);\nassert.equal(isBalanced("())"), false);` },
        { name: "ignores other characters", code: `assert.equal(isBalanced("fn(a[0]) { return 1; }"), true);` },
        { name: "the empty string is balanced", code: `assert.equal(isBalanced(""), true);` },
      ],
    },
    {
      slug: "longest-unique-substring",
      title: "Longest substring without repeating characters",
      kind: "implement",
      difficulty: 3,
      tags: ["algorithms"],
      description: `Write \`longestUniqueSubstring(s)\` that returns the **length** of the longest substring of \`s\` with no repeated characters. Aim for O(n).

Example: \`longestUniqueSubstring("abcabcbb")\` → \`3\``,
      starter: `function longestUniqueSubstring(s) {
  return new Set(s).size;
}`,
      solution: `function longestUniqueSubstring(s) {
  const lastSeen = new Map();
  let start = 0;
  let best = 0;
  for (const [i, ch] of [...s].entries()) {
    if (lastSeen.get(ch) >= start) start = lastSeen.get(ch) + 1;
    lastSeen.set(ch, i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}`,
      tests: [
        { name: "abcabcbb → 3", code: `assert.equal(longestUniqueSubstring("abcabcbb"), 3);` },
        { name: "bbbbb → 1", code: `assert.equal(longestUniqueSubstring("bbbbb"), 1);` },
        { name: "pwwkew → 3", code: `assert.equal(longestUniqueSubstring("pwwkew"), 3);` },
        { name: "never moves the window start backwards (abba → 2)", code: `assert.equal(longestUniqueSubstring("abba"), 2);` },
        { name: "handles empty and all-unique strings", code: `assert.equal(longestUniqueSubstring(""), 0);\nassert.equal(longestUniqueSubstring("abcdef"), 6);` },
      ],
      hints: ["Slide a window: remember the last index of each character and jump the start past a repeat, but only forwards."],
    },
    {
      slug: "deep-freeze",
      title: "Deep freeze",
      kind: "implement",
      difficulty: 2,
      tags: ["recursion", "immutability"],
      description: `Write \`deepFreeze(value)\` that freezes an object and, recursively, every object or array reachable through its own properties. Return the same reference. Primitives are returned unchanged, and objects with cycles must not overflow the stack.

Example: \`deepFreeze({ a: { b: [1] } })\` → the same object, with \`a\` and \`a.b\` frozen too`,
      starter: `function deepFreeze(value) {
  return Object.freeze(value);
}`,
      solution: `function deepFreeze(value, seen = new WeakSet()) {
  if (typeof value !== "object" || value === null || seen.has(value)) return value;
  seen.add(value);
  Object.freeze(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return value;
}`,
      tests: [
        {
          name: "freezes nested objects and arrays",
          code: `const obj = deepFreeze({ a: { b: [1, { c: 2 }] } });\nassert.ok(Object.isFrozen(obj));\nassert.ok(Object.isFrozen(obj.a));\nassert.ok(Object.isFrozen(obj.a.b));\nassert.ok(Object.isFrozen(obj.a.b[1]));`,
        },
        { name: "returns the same reference", code: `const obj = { a: 1 };\nassert.equal(deepFreeze(obj), obj);` },
        {
          name: "writes to nested objects throw in strict mode",
          code: `const obj = deepFreeze({ a: { b: 1 } });\nassert.throws(() => { obj.a.b = 2; }, TypeError);`,
        },
        { name: "returns primitives unchanged", code: `assert.equal(deepFreeze(5), 5);\nassert.equal(deepFreeze(null), null);` },
        {
          name: "handles cycles",
          code: `const a = { name: "a" };\nconst b = { a };\na.b = b;\ndeepFreeze(a);\nassert.ok(Object.isFrozen(a) && Object.isFrozen(b));`,
        },
      ],
    },
    {
      slug: "array-equal",
      title: "Array equality",
      kind: "implement",
      difficulty: 2,
      tags: ["recursion", "equality"],
      description: `Write \`arraysEqual(a, b)\` that compares two arrays element by element. Nested arrays are compared recursively; everything else with \`===\`, except that \`NaN\` equals \`NaN\`. Objects compare by reference.

Example: \`arraysEqual([1, [2, [3]]], [1, [2, [3]]])\` → \`true\``,
      starter: `function arraysEqual(a, b) {
  return a.length === b.length && a.every((item, i) => item === b[i]);
}`,
      solution: `function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((item, i) => {
    const other = b[i];
    if (Array.isArray(item) && Array.isArray(other)) return arraysEqual(item, other);
    return item === other || (Number.isNaN(item) && Number.isNaN(other));
  });
}`,
      tests: [
        { name: "equal nested arrays", code: `assert.equal(arraysEqual([1, [2, [3, []]]], [1, [2, [3, []]]]), true);` },
        { name: "different lengths", code: `assert.equal(arraysEqual([1, 2], [1, 2, 3]), false);\nassert.equal(arraysEqual([[1]], [[1, 2]]), false);` },
        { name: "different nested values", code: `assert.equal(arraysEqual([1, [2]], [1, [3]]), false);` },
        { name: "NaN equals NaN", code: `assert.equal(arraysEqual([NaN, [NaN]], [NaN, [NaN]]), true);` },
        { name: "no type coercion", code: `assert.equal(arraysEqual([1], ["1"]), false);\nassert.equal(arraysEqual([[1]], ["1"]), false);` },
        { name: "objects compare by reference", code: `const o = {};\nassert.equal(arraysEqual([o], [o]), true);\nassert.equal(arraysEqual([{}], [{}]), false);` },
      ],
    },
    {
      slug: "count-islands",
      title: "Count islands in a grid",
      kind: "implement",
      difficulty: 2,
      tags: ["algorithms", "recursion"],
      description: `Write \`countIslands(grid)\`. \`grid\` is an array of rows of \`1\` (land) and \`0\` (water). An island is a group of land cells connected horizontally or vertically (not diagonally). Return the number of islands without mutating \`grid\`.

\`\`\`js
countIslands([
  [1, 1, 0, 0],
  [0, 1, 0, 1],
  [1, 0, 0, 1],
]); // → 3
\`\`\``,
      starter: `function countIslands(grid) {
  return grid.flat().filter((cell) => cell === 1).length;
}`,
      solution: `function countIslands(grid) {
  const seen = grid.map((row) => row.map(() => false));
  const explore = (r, c) => {
    if (grid[r]?.[c] !== 1 || seen[r][c]) return;
    seen[r][c] = true;
    explore(r + 1, c);
    explore(r - 1, c);
    explore(r, c + 1);
    explore(r, c - 1);
  };
  let count = 0;
  grid.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === 1 && !seen[r][c]) {
        count++;
        explore(r, c);
      }
    }),
  );
  return count;
}`,
      tests: [
        { name: "counts three islands", code: `assert.equal(countIslands([[1, 1, 0, 0], [0, 1, 0, 1], [1, 0, 0, 1]]), 3);` },
        { name: "diagonal cells are separate islands", code: `assert.equal(countIslands([[1, 0], [0, 1]]), 2);` },
        { name: "a winding island counts once", code: `assert.equal(countIslands([[1, 1, 1], [0, 0, 1], [1, 1, 1]]), 1);` },
        { name: "handles empty and all-water grids", code: `assert.equal(countIslands([]), 0);\nassert.equal(countIslands([[0, 0], [0, 0]]), 0);` },
        {
          name: "does not mutate the grid",
          code: `const grid = [[1, 0], [1, 1]];\ncountIslands(grid);\nassert.deepEqual(grid, [[1, 0], [1, 1]]);`,
        },
      ],
    },
    {
      slug: "route-matcher",
      title: "A simple route matcher",
      kind: "implement",
      difficulty: 3,
      tags: ["algorithms"],
      description: `Write \`matchRoute(pattern, path)\`. Segments of \`pattern\` starting with \`:\` are parameters; others must match exactly. Return an object of decoded parameter values (\`decodeURIComponent\`) on a match, or \`null\` otherwise.

The segment counts must be equal, a parameter never matches an empty segment, and a trailing slash on either side is ignored. A pattern with no parameters returns \`{}\` on a match.

Example: \`matchRoute("/users/:id/posts/:postId", "/users/42/posts/7")\` → \`{ id: "42", postId: "7" }\``,
      starter: `function matchRoute(pattern, path) {
  return pattern === path ? {} : null;
}`,
      solution: `function matchRoute(pattern, path) {
  const segments = (s) => s.split("/").filter(Boolean);
  const patternParts = segments(pattern);
  const pathParts = segments(path);
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (const [i, part] of patternParts.entries()) {
    if (part.startsWith(":")) params[part.slice(1)] = decodeURIComponent(pathParts[i]);
    else if (part !== pathParts[i]) return null;
  }
  return params;
}`,
      tests: [
        {
          name: "extracts parameters",
          code: `assert.deepEqual(matchRoute("/users/:id/posts/:postId", "/users/42/posts/7"), { id: "42", postId: "7" });`,
        },
        { name: "static segments must match", code: `assert.equal(matchRoute("/users/:id", "/teams/42"), null);` },
        {
          name: "segment counts must match",
          code: `assert.equal(matchRoute("/users/:id", "/users/42/extra"), null);\nassert.equal(matchRoute("/users/:id", "/users"), null);\nassert.equal(matchRoute("/users/:id", "/users/"), null);`,
        },
        { name: "ignores trailing slashes", code: `assert.deepEqual(matchRoute("/users/:id/", "/users/42/"), { id: "42" });\nassert.deepEqual(matchRoute("/about", "/about/"), {});` },
        { name: "decodes parameter values", code: `assert.deepEqual(matchRoute("/files/:name", "/files/a%20b%2Fc"), { name: "a b/c" });` },
      ],
    },
    {
      slug: "parse-query-string",
      title: "Parse a query string",
      kind: "implement",
      difficulty: 2,
      tags: ["algorithms"],
      description: `Write \`parseQuery(query)\` that turns a URL query string into a plain object. The leading \`?\` is optional. Keys and values are decoded (\`+\` means space). A key without \`=\` has value \`""\`. A key that appears more than once maps to an array of its values in order. \`""\` and \`"?"\` give \`{}\`.

Example: \`parseQuery("?a=1&b=x+y&a=2&flag")\` → \`{ a: ["1", "2"], b: "x y", flag: "" }\``,
      starter: `function parseQuery(query) {
  return Object.fromEntries(query.split("&").map((pair) => pair.split("=")));
}`,
      solution: `function parseQuery(query) {
  const result = {};
  for (const [key, value] of new URLSearchParams(query)) {
    if (!Object.hasOwn(result, key)) result[key] = value;
    else if (Array.isArray(result[key])) result[key].push(value);
    else result[key] = [result[key], value];
  }
  return result;
}`,
      tests: [
        { name: "parses simple pairs", code: `assert.deepEqual(parseQuery("a=1&b=2"), { a: "1", b: "2" });` },
        { name: "strips the leading ?", code: `assert.deepEqual(parseQuery("?x=y"), { x: "y" });` },
        {
          name: "decodes values and keys",
          code: `assert.deepEqual(parseQuery("name=John%20Doe&q=a+b&k%26=v%3D"), { name: "John Doe", q: "a b", "k&": "v=" });`,
        },
        { name: "keys without = are empty strings", code: `assert.deepEqual(parseQuery("flag&x=1"), { flag: "", x: "1" });` },
        { name: "repeated keys become arrays", code: `assert.deepEqual(parseQuery("a=1&a=2&b=3&a=4"), { a: ["1", "2", "4"], b: "3" });` },
        { name: "empty input gives an empty object", code: `assert.deepEqual(parseQuery(""), {});\nassert.deepEqual(parseQuery("?"), {});` },
      ],
    },
    {
      slug: "top-k-frequent",
      title: "Top k frequent elements",
      kind: "implement",
      difficulty: 2,
      tags: ["algorithms"],
      description: `Write \`topKFrequent(nums, k)\` that returns the \`k\` most frequent numbers, most frequent first. Break ties by the smaller number first. If there are fewer than \`k\` distinct numbers, return them all.

Example: \`topKFrequent([1, 1, 1, 2, 2, 3], 2)\` → \`[1, 2]\``,
      starter: `function topKFrequent(nums, k) {
  return [...new Set(nums)].slice(0, k);
}`,
      solution: `function topKFrequent(nums, k) {
  const counts = new Map();
  for (const n of nums) counts.set(n, (counts.get(n) ?? 0) + 1);
  return [...counts]
    .sort(([a, countA], [b, countB]) => countB - countA || a - b)
    .slice(0, k)
    .map(([n]) => n);
}`,
      tests: [
        { name: "returns the most frequent first", code: `assert.deepEqual(topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2]);` },
        { name: "order is by frequency, not first appearance", code: `assert.deepEqual(topKFrequent([3, 1, 1, 2, 2, 2], 3), [2, 1, 3]);` },
        { name: "breaks ties by the smaller number", code: `assert.deepEqual(topKFrequent([5, 5, 4, 4, 9], 2), [4, 5]);\nassert.deepEqual(topKFrequent([10, 2], 1), [2]);` },
        { name: "returns all when k is large", code: `assert.deepEqual(topKFrequent([7, 7, 8], 5), [7, 8]);` },
        { name: "handles an empty array", code: `assert.deepEqual(topKFrequent([], 3), []);` },
      ],
    },
    {
      slug: "flatten-comments",
      title: "Flatten a threaded comment tree",
      kind: "implement",
      difficulty: 2,
      tags: ["recursion"],
      description: `Write \`flattenComments(comments)\`. Each comment is \`{ id, text, replies }\` where \`replies\` is an array of comments (it may be missing). Return a flat array of \`{ id, text, depth }\` in depth-first (display) order, with top-level comments at depth \`0\`.

Example: \`flattenComments([{ id: 1, text: "a", replies: [{ id: 2, text: "b" }] }])\` → \`[{ id: 1, text: "a", depth: 0 }, { id: 2, text: "b", depth: 1 }]\``,
      starter: `function flattenComments(comments) {
  return comments.map(({ id, text }) => ({ id, text, depth: 0 }));
}`,
      solution: `function flattenComments(comments, depth = 0) {
  return comments.flatMap(({ id, text, replies = [] }) => [
    { id, text, depth },
    ...flattenComments(replies, depth + 1),
  ]);
}`,
      tests: [
        {
          name: "flattens in display order with depths",
          code: `const tree = [\n  { id: 1, text: "a", replies: [\n    { id: 2, text: "b", replies: [{ id: 3, text: "c", replies: [] }] },\n    { id: 4, text: "d", replies: [] },\n  ] },\n  { id: 5, text: "e", replies: [] },\n];\nassert.deepEqual(flattenComments(tree), [\n  { id: 1, text: "a", depth: 0 },\n  { id: 2, text: "b", depth: 1 },\n  { id: 3, text: "c", depth: 2 },\n  { id: 4, text: "d", depth: 1 },\n  { id: 5, text: "e", depth: 0 },\n]);`,
        },
        {
          name: "handles missing replies",
          code: `assert.deepEqual(flattenComments([{ id: 1, text: "a", replies: [{ id: 2, text: "b" }] }]), [\n  { id: 1, text: "a", depth: 0 },\n  { id: 2, text: "b", depth: 1 },\n]);`,
        },
        { name: "handles an empty thread", code: `assert.deepEqual(flattenComments([]), []);` },
        {
          name: "does not mutate the input",
          code: `const tree = [{ id: 1, text: "a", replies: [{ id: 2, text: "b", replies: [] }] }];\nconst snapshot = JSON.stringify(tree);\nflattenComments(tree);\nassert.equal(JSON.stringify(tree), snapshot);`,
        },
      ],
    },
  ],
};

export default topic;

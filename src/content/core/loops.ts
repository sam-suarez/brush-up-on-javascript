import type { Topic } from "../types";

const topic: Topic = {
  course: "core",
  slug: "loops",
  title: "Loops",
  description: "for, while, do...while, for...of, for...in, break and continue.",
  tags: ["for", "while", "iteration"],
  count: 9,
  challenges: [
    {
      slug: "for-sum",
      title: "Sum numbers with a for loop",
      kind: "implement",
      difficulty: 1,
      tags: ["iteration"],
      description: `Write \`sum(numbers)\` using a classic \`for\` loop. An empty array sums to \`0\`.

Example: \`sum([1, 2, 3])\` → \`6\``,
      starter: `function sum(numbers) {\n  \n}`,
      solution: `function sum(numbers) {\n  let total = 0;\n  for (let i = 0; i < numbers.length; i++) {\n    total += numbers[i];\n  }\n  return total;\n}`,
      tests: [
        { name: "sums [1, 2, 3]", code: `assert.equal(sum([1, 2, 3]), 6);` },
        { name: "handles negatives", code: `assert.equal(sum([5, -10]), -5);` },
        { name: "empty array is 0", code: `assert.equal(sum([]), 0);` },
      ],
    },
    {
      slug: "while-countdown",
      title: "Count down with a while loop",
      kind: "complete",
      difficulty: 1,
      tags: ["iteration"],
      description: `Complete \`countdown(n)\` with a \`while\` loop so it returns the numbers from \`n\` down to \`1\`. Return \`[]\` when \`n\` is \`0\` or negative.

Example: \`countdown(3)\` → \`[3, 2, 1]\``,
      starter: `function countdown(n) {\n  const result = [];\n  // your code here\n  return result;\n}`,
      solution: `function countdown(n) {\n  const result = [];\n  while (n > 0) {\n    result.push(n);\n    n--;\n  }\n  return result;\n}`,
      tests: [
        { name: "counts down from 3", code: `assert.deepEqual(countdown(3), [3, 2, 1]);` },
        { name: "countdown(1) is [1]", code: `assert.deepEqual(countdown(1), [1]);` },
        { name: "returns [] for 0 and negatives", code: `assert.deepEqual(countdown(0), []);\nassert.deepEqual(countdown(-2), []);` },
      ],
    },
    {
      slug: "for-of",
      title: "Iterate an array with for...of",
      kind: "implement",
      difficulty: 1,
      tags: ["iteration"],
      description: `Write \`longestWord(words)\` using \`for...of\`. Return the longest word; on a tie keep the first one. Return \`""\` for an empty array.

Example: \`longestWord(["a", "abc", "ab"])\` → \`"abc"\``,
      starter: `function longestWord(words) {\n  \n}`,
      solution: `function longestWord(words) {\n  let longest = "";\n  for (const word of words) {\n    if (word.length > longest.length) longest = word;\n  }\n  return longest;\n}`,
      tests: [
        { name: "finds the longest word", code: `assert.equal(longestWord(["a", "abc", "ab"]), "abc");` },
        { name: "keeps the first on a tie", code: `assert.equal(longestWord(["cat", "dog", "ox"]), "cat");` },
        { name: "empty array gives an empty string", code: `assert.equal(longestWord([]), "");` },
      ],
    },
    {
      slug: "for-in",
      title: "Iterate object keys with for...in",
      kind: "implement",
      difficulty: 2,
      tags: ["iteration", "prototype"],
      description: `Write \`formatEntries(obj)\` using \`for...in\` that returns an array of \`"key=value"\` strings for the object's own properties, in the order \`for...in\` visits them. Skip inherited enumerable properties.

Example: \`formatEntries({ a: 1, b: "x" })\` → \`["a=1", "b=x"]\``,
      starter: `function formatEntries(obj) {\n  \n}`,
      solution: `function formatEntries(obj) {\n  const result = [];\n  for (const key in obj) {\n    if (Object.hasOwn(obj, key)) result.push(\`\${key}=\${obj[key]}\`);\n  }\n  return result;\n}`,
      hints: ["`for...in` also visits enumerable properties up the prototype chain."],
      tests: [
        { name: "formats each entry", code: `assert.deepEqual(formatEntries({ a: 1, b: "x" }), ["a=1", "b=x"]);` },
        { name: "empty object gives []", code: `assert.deepEqual(formatEntries({}), []);` },
        { name: "skips inherited properties", code: `const obj = Object.create({ inherited: true });\nobj.own = 1;\nassert.deepEqual(formatEntries(obj), ["own=1"]);` },
      ],
    },
    {
      slug: "break-when-found",
      title: "Break out of a loop when a value is found",
      kind: "implement",
      difficulty: 1,
      tags: ["iteration"],
      description: `Write \`firstNegative(numbers)\` that returns the first negative number, or \`undefined\` if there is none. Stop iterating as soon as you find it.

Example: \`firstNegative([3, -1, -5])\` → \`-1\``,
      starter: `function firstNegative(numbers) {\n  let found;\n  for (const n of numbers) {\n    if (n < 0) found = n;\n  }\n  return found;\n}`,
      solution: `function firstNegative(numbers) {\n  for (const n of numbers) {\n    if (n < 0) return n;\n  }\n  return undefined;\n}`,
      tests: [
        { name: "returns the first negative", code: `assert.equal(firstNegative([3, -1, -5]), -1);` },
        { name: "returns undefined when none", code: `assert.equal(firstNegative([1, 2, 0]), undefined);` },
        { name: "stops reading once found", code: `const read = [];\nconst arr = new Proxy([1, -2, 3, 4], {\n  get(target, prop) {\n    if (typeof prop === "string" && /^\\d+$/.test(prop)) read.push(Number(prop));\n    return target[prop];\n  },\n});\nassert.equal(firstNegative(arr), -2);\nassert.ok(!read.includes(2) && !read.includes(3), \`read indexes \${read}\`);` },
      ],
    },
    {
      slug: "continue-skip",
      title: "Skip values with continue",
      kind: "complete",
      difficulty: 1,
      tags: ["iteration"],
      description: `Complete \`sumNumbers(values)\` so it skips (with \`continue\`) anything that isn't a number, including \`NaN\`, and sums the rest.

Example: \`sumNumbers([1, "2", NaN, 3, null])\` → \`4\``,
      starter: `function sumNumbers(values) {\n  let total = 0;\n  for (const value of values) {\n    // your code here\n    total += value;\n  }\n  return total;\n}`,
      solution: `function sumNumbers(values) {\n  let total = 0;\n  for (const value of values) {\n    if (typeof value !== "number" || Number.isNaN(value)) continue;\n    total += value;\n  }\n  return total;\n}`,
      tests: [
        { name: "skips non-numbers", code: `assert.equal(sumNumbers([1, "2", 3, null, undefined, true]), 4);` },
        { name: "skips NaN", code: `assert.equal(sumNumbers([NaN, 5]), 5);` },
        { name: "sums plain numbers", code: `assert.equal(sumNumbers([1, 2, 3]), 6);` },
      ],
    },
    {
      slug: "nested-table-row",
      title: "Nested loops: a multiplication table",
      kind: "implement",
      difficulty: 1,
      tags: ["iteration"],
      description: `Write \`multiplicationTable(n)\` that returns an \`n\` × \`n\` array of rows where \`table[i][j]\` is \`(i + 1) * (j + 1)\`. \`n = 0\` gives \`[]\`.

Example: \`multiplicationTable(2)\` → \`[[1, 2], [2, 4]]\``,
      starter: `function multiplicationTable(n) {\n  \n}`,
      solution: `function multiplicationTable(n) {\n  const table = [];\n  for (let i = 1; i <= n; i++) {\n    const row = [];\n    for (let j = 1; j <= n; j++) row.push(i * j);\n    table.push(row);\n  }\n  return table;\n}`,
      tests: [
        { name: "builds a 3 x 3 table", code: `assert.deepEqual(multiplicationTable(3), [[1, 2, 3], [2, 4, 6], [3, 6, 9]]);` },
        { name: "1 x 1 table", code: `assert.deepEqual(multiplicationTable(1), [[1]]);` },
        { name: "n = 0 gives []", code: `assert.deepEqual(multiplicationTable(0), []);` },
      ],
    },
    {
      slug: "string-characters",
      title: "Loop over a string's characters",
      kind: "implement",
      difficulty: 1,
      tags: ["iteration", "strings"],
      description: `Write \`countVowels(str)\` that loops over the characters of \`str\` and counts the vowels \`a e i o u\`, case-insensitively.

Example: \`countVowels("JavaScript")\` → \`3\``,
      starter: `function countVowels(str) {\n  \n}`,
      solution: `function countVowels(str) {\n  let count = 0;\n  for (const char of str.toLowerCase()) {\n    if ("aeiou".includes(char)) count++;\n  }\n  return count;\n}`,
      tests: [
        { name: "counts vowels in JavaScript", code: `assert.equal(countVowels("JavaScript"), 3);` },
        { name: "is case-insensitive", code: `assert.equal(countVowels("AEIOU"), 5);` },
        { name: "no vowels gives 0", code: `assert.equal(countVowels("rhythm"), 0);` },
        { name: "empty string gives 0", code: `assert.equal(countVowels(""), 0);` },
      ],
    },
    {
      slug: "do-while",
      title: "do...while: run at least once",
      kind: "fix",
      difficulty: 2,
      tags: ["iteration"],
      description: `\`digits(n)\` should return the decimal digits of a non-negative integer, most significant first. It is wrong for one input. Fix it with a \`do...while\` loop.

Example: \`digits(0)\` → \`[0]\``,
      starter: `function digits(n) {\n  const result = [];\n  while (n > 0) {\n    result.unshift(n % 10);\n    n = Math.floor(n / 10);\n  }\n  return result;\n}`,
      solution: `function digits(n) {\n  const result = [];\n  do {\n    result.unshift(n % 10);\n    n = Math.floor(n / 10);\n  } while (n > 0);\n  return result;\n}`,
      tests: [
        { name: "splits 1234", code: `assert.deepEqual(digits(1234), [1, 2, 3, 4]);` },
        { name: "handles trailing zeros", code: `assert.deepEqual(digits(500), [5, 0, 0]);` },
        { name: "digits(0) is [0]", code: `assert.deepEqual(digits(0), [0]);` },
      ],
    },
  ],
};

export default topic;

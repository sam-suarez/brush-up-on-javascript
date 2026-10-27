import type { Topic } from "../types";

const topic: Topic = {
  course: "core",
  slug: "arrays",
  title: "Arrays",
  description: "Create, read, update and rearrange arrays, with and without mutation.",
  tags: ["indexing", "length", "push", "immutability"],
  count: 15,
  challenges: [
    {
      slug: "create-numbers",
      title: "Create an array of numbers",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays"],
      description: `Create a \`const\` named \`numbers\` holding the integers 1 through 5 in order.

Example: \`numbers\` → \`[1, 2, 3, 4, 5]\``,
      starter: `const numbers = [];`,
      solution: `const numbers = [1, 2, 3, 4, 5];`,
      tests: [
        { name: "numbers is an array", code: `assert.ok(Array.isArray(numbers));` },
        { name: "holds 1 through 5", code: `assert.deepEqual(numbers, [1, 2, 3, 4, 5]);` },
      ],
    },
    {
      slug: "create-fruits",
      title: "Create an array of fruits",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays"],
      description: `Create a \`const\` named \`fruits\` holding \`"apple"\`, \`"banana"\` and \`"cherry"\`, in that order.

Example: \`fruits[1]\` → \`"banana"\``,
      starter: `// create fruits here\n`,
      solution: `const fruits = ["apple", "banana", "cherry"];`,
      tests: [
        { name: "has three fruits", code: `assert.equal(fruits.length, 3);` },
        { name: "in the right order", code: `assert.deepEqual(fruits, ["apple", "banana", "cherry"]);` },
      ],
    },
    {
      slug: "mixed-types",
      title: "Create an array with mixed types",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays"],
      description: `Create a \`const\` named \`mixed\` with exactly four elements: a number, a string, a boolean and \`null\`, in that order. The values are up to you.

Example: \`mixed\` → \`[42, "hi", true, null]\``,
      starter: `const mixed = [];`,
      solution: `const mixed = [42, "hi", true, null];`,
      tests: [
        { name: "has four elements", code: `assert.equal(mixed.length, 4);` },
        { name: "types are number, string, boolean, null", code: `assert.type(mixed[0], "number");\nassert.type(mixed[1], "string");\nassert.type(mixed[2], "boolean");\nassert.equal(mixed[3], null);` },
      ],
    },
    {
      slug: "access-by-index",
      title: "Access an element by index",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "indexing"],
      description: `Write \`third(arr)\` that returns the third element of \`arr\`, or \`undefined\` if there is none.

Example: \`third(["a", "b", "c", "d"])\` → \`"c"\``,
      starter: `function third(arr) {\n  \n}`,
      solution: `function third(arr) {\n  return arr[2];\n}`,
      tests: [
        { name: "returns the third element", code: `assert.equal(third(["a", "b", "c", "d"]), "c");` },
        { name: "works with numbers", code: `assert.equal(third([10, 20, 30]), 30);` },
        { name: "returns undefined for short arrays", code: `assert.equal(third([1]), undefined);` },
      ],
    },
    {
      slug: "middle-element",
      title: "Access the middle element",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "indexing"],
      description: `Write \`middle(arr)\` that returns the element at index \`Math.floor(arr.length / 2)\`. For even lengths that is the right of the two middle elements.

Example: \`middle([1, 2, 3, 4, 5])\` → \`3\``,
      starter: `function middle(arr) {\n  \n}`,
      solution: `function middle(arr) {\n  return arr[Math.floor(arr.length / 2)];\n}`,
      tests: [
        { name: "odd length", code: `assert.equal(middle([1, 2, 3, 4, 5]), 3);` },
        { name: "even length picks the right middle", code: `assert.equal(middle([1, 2, 3, 4]), 3);` },
        { name: "single element", code: `assert.equal(middle(["only"]), "only");` },
      ],
    },
    {
      slug: "last-element",
      title: "Get the last element of any array",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "indexing"],
      description: `Write \`last(arr)\` that returns the last element without mutating \`arr\`. Return \`undefined\` for an empty array.

Example: \`last([1, 2, 3])\` → \`3\``,
      starter: `function last(arr) {\n  \n}`,
      solution: `function last(arr) {\n  return arr.at(-1);\n}`,
      tests: [
        { name: "returns the last element", code: `assert.equal(last([1, 2, 3]), 3);` },
        { name: "returns undefined for []", code: `assert.equal(last([]), undefined);` },
        { name: "does not mutate", code: `const input = ["a", "b"];\nlast(input);\nassert.deepEqual(input, ["a", "b"]);` },
      ],
    },
    {
      slug: "length-of-list",
      title: "Find the length of a movie list",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "length"],
      description: `Write \`countMovies(movies)\` that returns how many movies are in the list.

Example: \`countMovies(["Alien", "Heat"])\` → \`2\``,
      starter: `function countMovies(movies) {\n  \n}`,
      solution: `function countMovies(movies) {\n  return movies.length;\n}`,
      tests: [
        { name: "counts two movies", code: `assert.equal(countMovies(["Alien", "Heat"]), 2);` },
        { name: "counts an empty list", code: `assert.equal(countMovies([]), 0);` },
      ],
    },
    {
      slug: "songs-left",
      title: "Count songs left in the playlist",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "length"],
      description: `Write \`songsLeft(playlist, currentIndex)\` that returns how many songs come after the one currently playing.

Example: \`songsLeft(["a", "b", "c", "d"], 1)\` → \`2\``,
      starter: `function songsLeft(playlist, currentIndex) {\n  \n}`,
      solution: `function songsLeft(playlist, currentIndex) {\n  return playlist.length - currentIndex - 1;\n}`,
      tests: [
        { name: "two left after index 1 of 4", code: `assert.equal(songsLeft(["a", "b", "c", "d"], 1), 2);` },
        { name: "three left at the start", code: `assert.equal(songsLeft(["a", "b", "c", "d"], 0), 3);` },
        { name: "none left on the last song", code: `assert.equal(songsLeft(["a", "b", "c", "d"], 3), 0);` },
      ],
    },
    {
      slug: "change-by-index",
      title: "Change an element by index",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "indexing"],
      description: `Write \`setAt(arr, index, value)\` that replaces the element at \`index\` in place and returns the same array.

Example: \`setAt(["a", "b", "c"], 1, "x")\` → \`["a", "x", "c"]\``,
      starter: `function setAt(arr, index, value) {\n  \n}`,
      solution: `function setAt(arr, index, value) {\n  arr[index] = value;\n  return arr;\n}`,
      tests: [
        { name: "replaces the element", code: `assert.deepEqual(setAt(["a", "b", "c"], 1, "x"), ["a", "x", "c"]);` },
        { name: "mutates and returns the same array", code: `const input = [1, 2, 3];\nconst result = setAt(input, 0, 9);\nassert.equal(result, input);\nassert.deepEqual(input, [9, 2, 3]);` },
      ],
    },
    {
      slug: "from-variables",
      title: "Build an array from variables",
      kind: "complete",
      difficulty: 1,
      tags: ["arrays"],
      description: `Build \`colors\` from the three variables, in the order \`first\`, \`second\`, \`third\`. Reference the variables, don't retype the strings.

Example: \`colors\` → \`["red", "green", "blue"]\``,
      starter: `const first = "red";\nconst second = "green";\nconst third = "blue";\n\nconst colors = []; // your code here`,
      solution: `const first = "red";\nconst second = "green";\nconst third = "blue";\n\nconst colors = [first, second, third];`,
      tests: [
        { name: "holds the three colors in order", code: `assert.deepEqual(colors, ["red", "green", "blue"]);` },
        { name: "has length 3", code: `assert.equal(colors.length, 3);` },
      ],
    },
    {
      slug: "index-of",
      title: "Find the index of an element",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "indexing"],
      description: `Write \`positionOf(arr, value)\` that returns the index of the first occurrence of \`value\` (strict equality), or \`-1\` if absent.

Example: \`positionOf(["a", "b", "a"], "a")\` → \`0\``,
      starter: `function positionOf(arr, value) {\n  \n}`,
      solution: `function positionOf(arr, value) {\n  return arr.indexOf(value);\n}`,
      tests: [
        { name: "finds an element", code: `assert.equal(positionOf([10, 20, 30], 30), 2);` },
        { name: "returns the first occurrence", code: `assert.equal(positionOf(["a", "b", "a"], "a"), 0);` },
        { name: "uses strict equality", code: `assert.equal(positionOf([1, 2, 3], "2"), -1);` },
      ],
    },
    {
      slug: "chocolate-position",
      title: "Find the chocolate's position (handle missing)",
      kind: "fix",
      difficulty: 1,
      tags: ["arrays", "indexing"],
      description: `\`chocolatePosition(box)\` should return the 1-based position of \`"chocolate"\` in \`box\`, or \`null\` when there is no chocolate. The missing case is wrong. Fix it.

Example: \`chocolatePosition(["mint", "chocolate"])\` → \`2\``,
      starter: `function chocolatePosition(box) {\n  return box.indexOf("chocolate") + 1;\n}`,
      solution: `function chocolatePosition(box) {\n  const index = box.indexOf("chocolate");\n  return index === -1 ? null : index + 1;\n}`,
      tests: [
        { name: "finds chocolate in second place", code: `assert.equal(chocolatePosition(["mint", "chocolate"]), 2);` },
        { name: "finds chocolate first", code: `assert.equal(chocolatePosition(["chocolate", "mint"]), 1);` },
        { name: "returns null when missing", code: `assert.equal(chocolatePosition(["mint", "caramel"]), null);` },
        { name: "returns null for an empty box", code: `assert.equal(chocolatePosition([]), null);` },
      ],
    },
    {
      slug: "add-elements",
      title: "Add an element to the end and to the start",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "push"],
      description: `Write \`addBoth(arr, first, last)\` that adds \`first\` to the start and \`last\` to the end of \`arr\`, in place, and returns the same array.

Example: \`addBoth([2, 3], 1, 4)\` → \`[1, 2, 3, 4]\``,
      starter: `function addBoth(arr, first, last) {\n  \n}`,
      solution: `function addBoth(arr, first, last) {\n  arr.unshift(first);\n  arr.push(last);\n  return arr;\n}`,
      tests: [
        { name: "adds at both ends", code: `assert.deepEqual(addBoth([2, 3], 1, 4), [1, 2, 3, 4]);` },
        { name: "works on an empty array", code: `assert.deepEqual(addBoth([], "a", "z"), ["a", "z"]);` },
        { name: "mutates and returns the same array", code: `const input = [5];\nassert.equal(addBoth(input, 4, 6), input);\nassert.deepEqual(input, [4, 5, 6]);` },
      ],
    },
    {
      slug: "swap-two",
      title: "Swap two elements",
      kind: "implement",
      difficulty: 1,
      tags: ["arrays", "destructuring"],
      description: `Write \`swap(arr, i, j)\` that swaps the elements at indexes \`i\` and \`j\` in place and returns the same array.

Example: \`swap(["a", "b", "c"], 0, 2)\` → \`["c", "b", "a"]\``,
      starter: `function swap(arr, i, j) {\n  \n}`,
      solution: `function swap(arr, i, j) {\n  [arr[i], arr[j]] = [arr[j], arr[i]];\n  return arr;\n}`,
      tests: [
        { name: "swaps the ends", code: `assert.deepEqual(swap(["a", "b", "c"], 0, 2), ["c", "b", "a"]);` },
        { name: "swapping an index with itself is a no-op", code: `assert.deepEqual(swap([1, 2, 3], 1, 1), [1, 2, 3]);` },
        { name: "mutates and returns the same array", code: `const input = [1, 2];\nassert.equal(swap(input, 0, 1), input);\nassert.deepEqual(input, [2, 1]);` },
      ],
    },
    {
      slug: "replace-without-mutating",
      title: "Replace an element at an index without mutating",
      kind: "implement",
      difficulty: 2,
      tags: ["arrays", "immutability"],
      description: `Write \`replaceAt(arr, index, value)\` that returns a new array with the element at \`index\` replaced. \`arr\` must be left unchanged. A negative \`index\` counts from the end.

Example: \`replaceAt(["a", "b", "c"], -1, "z")\` → \`["a", "b", "z"]\``,
      starter: `function replaceAt(arr, index, value) {\n  arr[index] = value;\n  return arr;\n}`,
      solution: `function replaceAt(arr, index, value) {\n  return arr.with(index, value);\n}`,
      hints: ["ES2023 added non-mutating counterparts to several array methods."],
      tests: [
        { name: "replaces the element", code: `assert.deepEqual(replaceAt(["a", "b", "c"], 1, "x"), ["a", "x", "c"]);` },
        { name: "leaves the input unchanged", code: `const input = [1, 2, 3];\nreplaceAt(input, 0, 9);\nassert.deepEqual(input, [1, 2, 3]);` },
        { name: "returns a new array", code: `const input = [1, 2, 3];\nassert.notEqual(replaceAt(input, 0, 9), input);` },
        { name: "supports negative indexes", code: `assert.deepEqual(replaceAt(["a", "b", "c"], -1, "z"), ["a", "b", "z"]);` },
      ],
    },
  ],
};

export default topic;

import type { Topic } from "../types";

const topic: Topic = {
  course: "practice",
  slug: "sets",
  title: "JavaScript Sets",
  description: "Set basics and set algebra.",
  tags: ["Set", "algebra"],
  count: 7,
  challenges: [
    {
      slug: "create-and-add",
      title: "Create a set and add",
      kind: "implement",
      difficulty: 1,
      tags: ["sets"],
      description: `Write \`collectTags(posts)\` that returns a \`Set\` of every tag used across \`posts\` (each post has a \`tags\` array). Tags are compared after trimming and lowercasing; skip tags that are empty after trimming.

Example: \`collectTags([{ tags: ["JS", "css"] }, { tags: [" js "] }])\` → \`Set(2) { 'js', 'css' }\``,
      starter: `function collectTags(posts) {\n  return posts.flatMap((post) => post.tags);\n}\n`,
      solution: `function collectTags(posts) {
  const tags = new Set();
  for (const post of posts) {
    for (const tag of post.tags) {
      const normalized = tag.trim().toLowerCase();
      if (normalized) tags.add(normalized);
    }
  }
  return tags;
}`,
      tests: [
        { name: "returns a Set", code: `assert.ok(collectTags([]) instanceof Set);` },
        { name: "collects unique tags", code: `assert.deepEqual(collectTags([{ tags: ["js", "css"] }, { tags: ["js", "html"] }]), new Set(["js", "css", "html"]));` },
        { name: "normalizes case and whitespace", code: `assert.deepEqual(collectTags([{ tags: ["JS", " js "] }]), new Set(["js"]));` },
        { name: "skips blank tags", code: `assert.deepEqual(collectTags([{ tags: ["", "  ", "a"] }]), new Set(["a"]));` },
      ],
    },
    {
      slug: "dedupe-with-set",
      title: "Remove duplicates via Set",
      kind: "implement",
      difficulty: 1,
      tags: ["sets"],
      description: `Write \`unique(items)\` that returns a new array without duplicates, keeping the first occurrence order. Use SameValueZero semantics (what \`Set\` does): \`NaN\` is deduplicated, distinct objects are not.

Example: \`unique([3, 1, 3, NaN, NaN, 2, 1])\` → \`[3, 1, NaN, 2]\``,
      starter: `function unique(items) {\n  return items.filter((item, i) => items.indexOf(item) === i);\n}\n`,
      solution: `function unique(items) {\n  return [...new Set(items)];\n}`,
      tests: [
        { name: "keeps first occurrences in order", code: `assert.deepEqual(unique([3, 1, 3, 2, 1]), [3, 1, 2]);` },
        { name: "deduplicates NaN", code: `assert.deepEqual(unique([NaN, 1, NaN]), [NaN, 1]);` },
        { name: "keeps distinct objects", code: `assert.equal(unique([{}, {}]).length, 2);` },
        { name: "returns a new array", code: `const input = [1, 2]; assert.notEqual(unique(input), input);` },
      ],
    },
    {
      slug: "has-delete-size",
      title: "has, delete, size",
      kind: "implement",
      difficulty: 1,
      tags: ["sets"],
      description: `Write \`toggle(set, value)\`: if \`value\` is in \`set\`, remove it and return \`false\`; otherwise add it and return \`true\`. Also write \`countOf(set)\` returning the number of members.

Example: \`toggle(new Set([1]), 1)\` → \`false\` (and the set is now empty)`,
      starter: `function toggle(set, value) {\n  set.add(value);\n  return true;\n}\n\nfunction countOf(set) {\n  return set.length;\n}\n`,
      solution: `function toggle(set, value) {
  if (set.has(value)) {
    set.delete(value);
    return false;
  }
  set.add(value);
  return true;
}

function countOf(set) {
  return set.size;
}`,
      tests: [
        { name: "adds a missing value", code: `const s = new Set(); assert.equal(toggle(s, "a"), true); assert.ok(s.has("a"));` },
        { name: "removes a present value", code: `const s = new Set(["a", "b"]); assert.equal(toggle(s, "a"), false); assert.deepEqual(s, new Set(["b"]));` },
        { name: "countOf returns the size", code: `assert.equal(countOf(new Set([1, 2, 2, 3])), 3); assert.equal(countOf(new Set()), 0);` },
      ],
    },
    {
      slug: "set-union",
      title: "Union",
      kind: "implement",
      difficulty: 1,
      tags: ["sets"],
      description: `Write \`union(a, b)\` that returns a new \`Set\` with every member of either set. Don't mutate the inputs.

Example: \`union(new Set([1, 2]), new Set([2, 3]))\` → \`Set(3) { 1, 2, 3 }\``,
      starter: `function union(a, b) {\n  for (const x of b) a.add(x);\n  return a;\n}\n`,
      solution: `function union(a, b) {\n  return new Set([...a, ...b]);\n}`,
      tests: [
        { name: "combines both sets", code: `assert.deepEqual(union(new Set([1, 2]), new Set([2, 3])), new Set([1, 2, 3]));` },
        { name: "works with an empty set", code: `assert.deepEqual(union(new Set(), new Set(["x"])), new Set(["x"]));` },
        {
          name: "does not mutate the inputs",
          code: `const a = new Set([1]); const b = new Set([2]);
const result = union(a, b);
assert.notEqual(result, a);
assert.deepEqual(a, new Set([1]));`,
        },
      ],
    },
    {
      slug: "set-intersection",
      title: "Intersection",
      kind: "implement",
      difficulty: 1,
      tags: ["sets"],
      description: `Write \`intersection(a, b)\` that returns a new \`Set\` with the members present in both sets. Use \`has\` lookups (iterate the smaller set) rather than nested loops.

Example: \`intersection(new Set([1, 2, 3]), new Set([2, 3, 4]))\` → \`Set(2) { 2, 3 }\``,
      starter: `function intersection(a, b) {\n  \n}\n`,
      solution: `function intersection(a, b) {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  return new Set([...small].filter((x) => large.has(x)));
}`,
      tests: [
        { name: "keeps shared members", code: `assert.deepEqual(intersection(new Set([1, 2, 3]), new Set([2, 3, 4])), new Set([2, 3]));` },
        { name: "returns an empty set when disjoint", code: `assert.deepEqual(intersection(new Set([1]), new Set([2])), new Set());` },
        { name: "handles an empty input", code: `assert.deepEqual(intersection(new Set(), new Set([1, 2])), new Set());` },
        { name: "returns a Set", code: `assert.ok(intersection(new Set([1]), new Set([1])) instanceof Set);` },
      ],
    },
    {
      slug: "set-difference",
      title: "Difference",
      kind: "implement",
      difficulty: 1,
      tags: ["sets"],
      description: `Write \`difference(a, b)\` that returns a new \`Set\` of members of \`a\` that are not in \`b\`, and \`symmetricDifference(a, b)\` that returns members in exactly one of the two.

Example: \`symmetricDifference(new Set([1, 2]), new Set([2, 3]))\` → \`Set(2) { 1, 3 }\``,
      starter: `function difference(a, b) {\n  \n}\n\nfunction symmetricDifference(a, b) {\n  \n}\n`,
      solution: `function difference(a, b) {
  return new Set([...a].filter((x) => !b.has(x)));
}

function symmetricDifference(a, b) {
  return new Set([...difference(a, b), ...difference(b, a)]);
}`,
      tests: [
        { name: "difference removes members of b", code: `assert.deepEqual(difference(new Set([1, 2, 3]), new Set([2])), new Set([1, 3]));` },
        { name: "difference is not symmetric", code: `assert.deepEqual(difference(new Set([2]), new Set([1, 2, 3])), new Set());` },
        { name: "symmetricDifference keeps members in exactly one", code: `assert.deepEqual(symmetricDifference(new Set([1, 2]), new Set([2, 3])), new Set([1, 3]));` },
        { name: "symmetricDifference of equal sets is empty", code: `assert.deepEqual(symmetricDifference(new Set([1]), new Set([1])), new Set());` },
      ],
    },
    {
      slug: "is-subset",
      title: "Is subset",
      kind: "implement",
      difficulty: 1,
      tags: ["sets"],
      description: `Write \`isSubset(a, b)\` that returns \`true\` when every member of \`a\` is also in \`b\`. The empty set is a subset of every set.

Example: \`isSubset(new Set([1, 2]), new Set([1, 2, 3]))\` → \`true\``,
      starter: `function isSubset(a, b) {\n  return a.size <= b.size;\n}\n`,
      solution: `function isSubset(a, b) {
  if (a.size > b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}`,
      tests: [
        { name: "true for a proper subset", code: `assert.equal(isSubset(new Set([1, 2]), new Set([1, 2, 3])), true);` },
        { name: "false when a member is missing", code: `assert.equal(isSubset(new Set([1, 4]), new Set([1, 2, 3])), false);` },
        { name: "true for equal sets", code: `assert.equal(isSubset(new Set(["a"]), new Set(["a"])), true);` },
        { name: "the empty set is a subset", code: `assert.equal(isSubset(new Set(), new Set()), true);` },
        { name: "false when a is larger", code: `assert.equal(isSubset(new Set([1, 2]), new Set([1])), false);` },
      ],
    },
  ],
};

export default topic;

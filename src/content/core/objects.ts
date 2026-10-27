import type { Topic } from "../types";

const topic: Topic = {
  course: "core",
  slug: "objects",
  title: "Objects",
  description: "Object literals, property access, methods with this, shorthand and computed keys.",
  tags: ["properties", "methods", "this"],
  count: 13,
  challenges: [
    {
      slug: "create-object",
      title: "Create an object literal",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Create a \`const\` named \`book\` with \`title\` \`"Dune"\`, \`author\` \`"Frank Herbert"\` and \`year\` \`1965\` (a number). No other properties.

Example: \`book.year\` → \`1965\``,
      starter: `const book = {};`,
      solution: `const book = {\n  title: "Dune",\n  author: "Frank Herbert",\n  year: 1965,\n};`,
      tests: [
        { name: "has the right properties", code: `assert.deepEqual(book, { title: "Dune", author: "Frank Herbert", year: 1965 });` },
        { name: "year is a number", code: `assert.type(book.year, "number");` },
      ],
    },
    {
      slug: "dot-access",
      title: "Access a property with dot notation",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`getName(user)\` that returns the user's \`name\` property.

Example: \`getName({ name: "Ada", age: 36 })\` → \`"Ada"\``,
      starter: `function getName(user) {\n  \n}`,
      solution: `function getName(user) {\n  return user.name;\n}`,
      tests: [
        { name: "returns the name", code: `assert.equal(getName({ name: "Ada", age: 36 }), "Ada");` },
        { name: "returns undefined when there is no name", code: `assert.equal(getName({}), undefined);` },
      ],
    },
    {
      slug: "bracket-access",
      title: "Access a property with bracket notation",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`getProp(obj, key)\` that returns \`obj[key]\`. Keys may contain spaces or dashes.

Example: \`getProp({ "first name": "Ada" }, "first name")\` → \`"Ada"\``,
      starter: `function getProp(obj, key) {\n  \n}`,
      solution: `function getProp(obj, key) {\n  return obj[key];\n}`,
      tests: [
        { name: "reads a key with a space", code: `assert.equal(getProp({ "first name": "Ada" }, "first name"), "Ada");` },
        { name: "reads a key with a dash", code: `assert.equal(getProp({ "max-age": 60 }, "max-age"), 60);` },
        { name: "reads a plain key", code: `assert.equal(getProp({ id: 7 }, "id"), 7);` },
      ],
    },
    {
      slug: "nested-access",
      title: "Access a nested property",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`getCity(user)\` that returns \`user.address.city\`, or \`undefined\` if \`address\` is missing (no throw).

Example: \`getCity({ address: { city: "Lisbon" } })\` → \`"Lisbon"\``,
      starter: `function getCity(user) {\n  return user.address.city;\n}`,
      solution: `function getCity(user) {\n  return user.address?.city;\n}`,
      tests: [
        { name: "reads the nested city", code: `assert.equal(getCity({ address: { city: "Lisbon" } }), "Lisbon");` },
        { name: "returns undefined without an address", code: `assert.equal(getCity({ name: "Ada" }), undefined);` },
      ],
    },
    {
      slug: "add-property",
      title: "Add a property to an existing object",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`addId(obj, id)\` that adds an \`id\` property to \`obj\` in place and returns the same object.

Example: \`addId({ name: "Ada" }, 1)\` → \`{ name: "Ada", id: 1 }\``,
      starter: `function addId(obj, id) {\n  \n}`,
      solution: `function addId(obj, id) {\n  obj.id = id;\n  return obj;\n}`,
      tests: [
        { name: "adds the id", code: `assert.deepEqual(addId({ name: "Ada" }, 1), { name: "Ada", id: 1 });` },
        { name: "mutates and returns the same object", code: `const input = {};\nassert.equal(addId(input, 5), input);\nassert.equal(input.id, 5);` },
      ],
    },
    {
      slug: "update-property",
      title: "Update a property",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`birthday(person)\` that increments \`person.age\` by one in place and returns the same object.

Example: \`birthday({ name: "Ada", age: 36 })\` → \`{ name: "Ada", age: 37 }\``,
      starter: `function birthday(person) {\n  \n}`,
      solution: `function birthday(person) {\n  person.age += 1;\n  return person;\n}`,
      tests: [
        { name: "increments age", code: `assert.deepEqual(birthday({ name: "Ada", age: 36 }), { name: "Ada", age: 37 });` },
        { name: "mutates and returns the same object", code: `const p = { age: 0 };\nassert.equal(birthday(p), p);\nassert.equal(p.age, 1);` },
      ],
    },
    {
      slug: "delete-property",
      title: "Delete a property",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`removePassword(user)\` that removes the \`password\` key from \`user\` in place and returns it. The key must be gone, not just set to \`undefined\`.

Example: \`removePassword({ name: "Ada", password: "x" })\` → \`{ name: "Ada" }\``,
      starter: `function removePassword(user) {\n  user.password = undefined;\n  return user;\n}`,
      solution: `function removePassword(user) {\n  delete user.password;\n  return user;\n}`,
      tests: [
        { name: "removes the key", code: `const user = { name: "Ada", password: "x" };\nremovePassword(user);\nassert.ok(!("password" in user));` },
        { name: "keeps other keys", code: `assert.deepEqual(removePassword({ name: "Ada", password: "x" }), { name: "Ada" });` },
      ],
    },
    {
      slug: "has-property",
      title: "Check whether a property exists",
      kind: "implement",
      difficulty: 2,
      tags: ["objects"],
      description: `Write \`hasKey(obj, key)\` that returns \`true\` if \`obj\` has its own property \`key\`, even when the value is \`undefined\` or falsy. Inherited properties such as \`toString\` don't count.

Example: \`hasKey({ a: undefined }, "a")\` → \`true\``,
      starter: `function hasKey(obj, key) {\n  return Boolean(obj[key]);\n}`,
      solution: `function hasKey(obj, key) {\n  return Object.hasOwn(obj, key);\n}`,
      hints: ["`in` walks the prototype chain."],
      tests: [
        { name: "finds a present key", code: `assert.equal(hasKey({ a: 1 }, "a"), true);` },
        { name: "finds a key whose value is undefined", code: `assert.equal(hasKey({ a: undefined }, "a"), true);` },
        { name: "finds a key whose value is 0", code: `assert.equal(hasKey({ a: 0 }, "a"), true);` },
        { name: "returns false for a missing key", code: `assert.equal(hasKey({ a: 1 }, "b"), false);` },
        { name: "ignores inherited properties", code: `assert.equal(hasKey({}, "toString"), false);` },
      ],
    },
    {
      slug: "method-with-this",
      title: "An object method that uses this",
      kind: "fix",
      difficulty: 2,
      tags: ["objects", "this"],
      description: `\`person.fullName()\` should return \`"<first> <last>"\` from the object it is called on, but it throws. Fix it.

Example: \`person.fullName()\` → \`"Ada Lovelace"\``,
      starter: `const person = {\n  first: "Ada",\n  last: "Lovelace",\n  fullName: () => \`\${this.first} \${this.last}\`,\n};`,
      solution: `const person = {\n  first: "Ada",\n  last: "Lovelace",\n  fullName() {\n    return \`\${this.first} \${this.last}\`;\n  },\n};`,
      hints: ["Arrow functions don't get their own `this`."],
      tests: [
        { name: "returns the full name", code: `assert.equal(person.fullName(), "Ada Lovelace");` },
        { name: "uses the object it is called on", code: `const other = { first: "Grace", last: "Hopper", fullName: person.fullName };\nassert.equal(other.fullName(), "Grace Hopper");` },
      ],
    },
    {
      slug: "shorthand-properties",
      title: "Shorthand property names",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`makePoint(x, y)\` that returns \`{ x, y }\` using shorthand property names.

Example: \`makePoint(1, 2)\` → \`{ x: 1, y: 2 }\``,
      starter: `function makePoint(x, y) {\n  \n}`,
      solution: `function makePoint(x, y) {\n  return { x, y };\n}`,
      tests: [
        { name: "returns a point", code: `assert.deepEqual(makePoint(1, 2), { x: 1, y: 2 });` },
        { name: "returns a new object each time", code: `assert.notEqual(makePoint(0, 0), makePoint(0, 0));` },
      ],
    },
    {
      slug: "computed-keys",
      title: "Computed property names",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`pair(key, value)\` that returns an object with a single property named by \`key\`. Use a computed key in the literal.

Example: \`pair("lang", "js")\` → \`{ lang: "js" }\``,
      starter: `function pair(key, value) {\n  return { key: value };\n}`,
      solution: `function pair(key, value) {\n  return { [key]: value };\n}`,
      tests: [
        { name: "uses the key's value as the name", code: `assert.deepEqual(pair("lang", "js"), { lang: "js" });` },
        { name: "works with keys that aren't identifiers", code: `assert.deepEqual(pair("max-age", 60), { "max-age": 60 });` },
      ],
    },
    {
      slug: "from-two-arrays",
      title: "Build an object from a keys array and a values array",
      kind: "implement",
      difficulty: 2,
      tags: ["objects", "iteration"],
      description: `Write \`zipObject(keys, values)\` that pairs each key with the value at the same index. Keys without a value map to \`undefined\`; extra values are ignored.

Example: \`zipObject(["a", "b"], [1, 2])\` → \`{ a: 1, b: 2 }\``,
      starter: `function zipObject(keys, values) {\n  \n}`,
      solution: `function zipObject(keys, values) {\n  return Object.fromEntries(keys.map((key, i) => [key, values[i]]));\n}`,
      tests: [
        { name: "pairs keys with values", code: `assert.deepEqual(zipObject(["a", "b"], [1, 2]), { a: 1, b: 2 });` },
        { name: "missing values become undefined", code: `assert.deepEqual(zipObject(["a", "b"], [1]), { a: 1, b: undefined });` },
        { name: "extra values are ignored", code: `assert.deepEqual(zipObject(["a"], [1, 2, 3]), { a: 1 });` },
        { name: "empty keys give {}", code: `assert.deepEqual(zipObject([], []), {});` },
      ],
    },
    {
      slug: "copy-with-change",
      title: "Return a new object with one field changed",
      kind: "implement",
      difficulty: 1,
      tags: ["objects", "immutability"],
      description: `Write \`withField(obj, key, value)\` that returns a new object like \`obj\` but with \`key\` set to \`value\`. Leave \`obj\` unchanged.

Example: \`withField({ a: 1, b: 2 }, "b", 3)\` → \`{ a: 1, b: 3 }\``,
      starter: `function withField(obj, key, value) {\n  obj[key] = value;\n  return obj;\n}`,
      solution: `function withField(obj, key, value) {\n  return { ...obj, [key]: value };\n}`,
      tests: [
        { name: "changes the field", code: `assert.deepEqual(withField({ a: 1, b: 2 }, "b", 3), { a: 1, b: 3 });` },
        { name: "can add a new field", code: `assert.deepEqual(withField({ a: 1 }, "c", 0), { a: 1, c: 0 });` },
        { name: "leaves the input unchanged", code: `const input = { a: 1 };\nconst result = withField(input, "a", 2);\nassert.notEqual(result, input);\nassert.deepEqual(input, { a: 1 });` },
      ],
    },
  ],
};

export default topic;

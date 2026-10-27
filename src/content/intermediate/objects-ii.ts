import type { Topic } from "../types";

const topic: Topic = {
  course: "intermediate",
  slug: "objects-ii",
  title: "Objects II",
  description: "Object.keys/values/entries, destructuring, optional chaining, nullish coalescing and shallow copies.",
  tags: ["entries", "destructuring", "optional chaining"],
  count: 18,
  challenges: [
    {
      slug: "object-keys",
      title: "Object.keys",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`isEmpty(obj)\` that returns \`true\` when \`obj\` has no own enumerable string keys. Inherited properties don't count; a key whose value is \`undefined\` does.

Example: \`isEmpty({})\` → \`true\``,
      starter: `function isEmpty(obj) {

}`,
      solution: `function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}`,
      tests: [
        { name: "returns true for {}", code: `assert.equal(isEmpty({}), true);` },
        { name: "returns false when a key exists", code: `assert.equal(isEmpty({ a: 1 }), false);` },
        { name: "counts a key holding undefined", code: `assert.equal(isEmpty({ a: undefined }), false);` },
        { name: "ignores inherited keys", code: `assert.equal(isEmpty(Object.create({ inherited: 1 })), true);` },
      ],
    },
    {
      slug: "object-values",
      title: "Object.values",
      kind: "implement",
      difficulty: 1,
      tags: ["objects"],
      description: `Write \`total(prices)\` that sums the values of an object of numbers. An empty object totals \`0\`.

Example: \`total({ apple: 2, pear: 3 })\` → \`5\``,
      starter: `function total(prices) {

}`,
      solution: `function total(prices) {
  return Object.values(prices).reduce((sum, n) => sum + n, 0);
}`,
      tests: [
        { name: "sums the values", code: `assert.equal(total({ apple: 2, pear: 3 }), 5);` },
        { name: "returns 0 for {}", code: `assert.equal(total({}), 0);` },
        { name: "handles a single value", code: `assert.equal(total({ x: -4 }), -4);` },
      ],
    },
    {
      slug: "object-entries",
      title: "Object.entries",
      kind: "implement",
      difficulty: 1,
      tags: ["objects", "entries"],
      description: `Write \`toQueryString(params)\` that turns an object into \`key=value\` pairs joined by \`&\`, in key order. Encode both keys and values with \`encodeURIComponent\`. An empty object gives \`""\`.

Example: \`toQueryString({ q: "a b", page: 2 })\` → \`"q=a%20b&page=2"\``,
      starter: `function toQueryString(params) {

}`,
      solution: `function toQueryString(params) {
  return Object.entries(params)
    .map(([key, value]) => \`\${encodeURIComponent(key)}=\${encodeURIComponent(value)}\`)
    .join("&");
}`,
      tests: [
        { name: "joins pairs with &", code: `assert.equal(toQueryString({ a: 1, b: "two" }), "a=1&b=two");` },
        { name: "encodes keys and values", code: `assert.equal(toQueryString({ q: "a b", "x&y": "=" }), "q=a%20b&x%26y=%3D");` },
        { name: "returns an empty string for {}", code: `assert.equal(toQueryString({}), "");` },
      ],
    },
    {
      slug: "from-entries",
      title: "Object.fromEntries",
      kind: "implement",
      difficulty: 1,
      tags: ["objects", "entries"],
      description: `Write \`zipObject(keys, values)\` that pairs each key with the value at the same index. Extra values are ignored; keys without a value map to \`undefined\`.

Example: \`zipObject(["a", "b"], [1, 2])\` → \`{ a: 1, b: 2 }\``,
      starter: `function zipObject(keys, values) {

}`,
      solution: `function zipObject(keys, values) {
  return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
}`,
      tests: [
        { name: "pairs keys and values", code: `assert.deepEqual(zipObject(["a", "b"], [1, 2]), { a: 1, b: 2 });` },
        { name: "ignores extra values", code: `assert.deepEqual(zipObject(["a"], [1, 2, 3]), { a: 1 });` },
        { name: "maps missing values to undefined", code: `assert.deepEqual(zipObject(["a", "b"], [1]), { a: 1, b: undefined });` },
      ],
    },
    {
      slug: "transform-values",
      title: "Loop over entries and transform values",
      kind: "implement",
      difficulty: 2,
      tags: ["objects", "entries", "higher-order"],
      description: `Write \`mapValues(obj, fn)\` that returns a new object with the same keys, where each value is \`fn(value, key)\`. Don't mutate \`obj\`.

Example: \`mapValues({ a: 1, b: 2 }, (n) => n * 10)\` → \`{ a: 10, b: 20 }\``,
      starter: `function mapValues(obj, fn) {

}`,
      solution: `function mapValues(obj, fn) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value, key)]));
}`,
      tests: [
        { name: "transforms each value", code: `assert.deepEqual(mapValues({ a: 1, b: 2 }, (n) => n * 10), { a: 10, b: 20 });` },
        { name: "passes the key as the second argument", code: `assert.deepEqual(mapValues({ a: 1, b: 2 }, (v, k) => k + v), { a: "a1", b: "b2" });` },
        {
          name: "does not mutate the input",
          code: `const obj = { a: 1 };
const out = mapValues(obj, (n) => n + 1);
assert.notEqual(out, obj);
assert.deepEqual(obj, { a: 1 });`,
        },
      ],
    },
    {
      slug: "dynamic-access",
      title: "Dynamic property access by variable",
      kind: "implement",
      difficulty: 1,
      tags: ["objects", "immutability"],
      description: `Write \`setField(state, key, value)\` that returns a new object equal to \`state\` with \`key\` set to \`value\`. \`key\` is a variable, so you need a computed property name. Don't mutate \`state\`.

Example: \`setField({ a: 1 }, "b", 2)\` → \`{ a: 1, b: 2 }\``,
      starter: `function setField(state, key, value) {

}`,
      solution: `function setField(state, key, value) {
  return { ...state, [key]: value };
}`,
      tests: [
        { name: "adds a new key", code: `assert.deepEqual(setField({ a: 1 }, "b", 2), { a: 1, b: 2 });` },
        { name: "overwrites an existing key", code: `assert.deepEqual(setField({ a: 1 }, "a", 5), { a: 5 });` },
        {
          name: "does not mutate state",
          code: `const state = { a: 1 };
const next = setField(state, "a", 2);
assert.notEqual(next, state);
assert.deepEqual(state, { a: 1 });`,
        },
      ],
    },
    {
      slug: "optional-chaining",
      title: "Optional chaining on a missing path",
      kind: "fix",
      difficulty: 1,
      tags: ["optional chaining"],
      description: `\`cityOf(user)\` should return the user's city, or \`"unknown"\` when the user, their address or the city is missing. It throws for some inputs. Fix it.

Example: \`cityOf({ name: "Ada" })\` → \`"unknown"\``,
      starter: `function cityOf(user) {
  return user.address.city ?? "unknown";
}`,
      solution: `function cityOf(user) {
  return user?.address?.city ?? "unknown";
}`,
      tests: [
        { name: "returns the city when present", code: `assert.equal(cityOf({ address: { city: "Lyon" } }), "Lyon");` },
        { name: "handles a missing address", code: `assert.equal(cityOf({ name: "Ada" }), "unknown");` },
        { name: "handles a null user", code: `assert.equal(cityOf(null), "unknown");` },
        { name: "handles a missing city", code: `assert.equal(cityOf({ address: {} }), "unknown");` },
      ],
    },
    {
      slug: "nullish-default",
      title: "Nullish coalescing vs ||",
      kind: "fix",
      difficulty: 2,
      tags: ["coercion"],
      description: `\`withDefaults(options)\` fills in \`retries\` (default \`3\`) and \`verbose\` (default \`true\`) when they are \`null\` or \`undefined\`. Callers who pass explicit values sometimes get the defaults instead. Fix it.

Example: \`withDefaults({ retries: 0, verbose: false })\` → \`{ retries: 0, verbose: false }\``,
      starter: `function withDefaults(options) {
  return {
    retries: options.retries || 3,
    verbose: options.verbose || true,
  };
}`,
      solution: `function withDefaults(options) {
  return {
    retries: options.retries ?? 3,
    verbose: options.verbose ?? true,
  };
}`,
      tests: [
        { name: "fills missing values", code: `assert.deepEqual(withDefaults({}), { retries: 3, verbose: true });` },
        { name: "fills null values", code: `assert.deepEqual(withDefaults({ retries: null, verbose: null }), { retries: 3, verbose: true });` },
        { name: "keeps retries: 0", code: `assert.equal(withDefaults({ retries: 0 }).retries, 0);` },
        { name: "keeps verbose: false", code: `assert.equal(withDefaults({ verbose: false }).verbose, false);` },
      ],
    },
    {
      slug: "assign-vs-spread",
      title: "Object.assign vs spread (shallow copy trap)",
      kind: "fix",
      difficulty: 2,
      tags: ["immutability", "references"],
      description: `\`cloneSettings(settings)\` should return a copy that can be edited freely, including its nested \`theme\` object, without affecting the original. Settings are one level deep: top-level primitives plus \`theme\`, a flat object. Editing the clone currently leaks into the original. Fix it.

Example: \`cloneSettings({ lang: "en", theme: { color: "dark" } })\` → \`{ lang: "en", theme: { color: "dark" } }\` (a fully separate copy)`,
      starter: `function cloneSettings(settings) {
  return { ...settings };
}`,
      solution: `function cloneSettings(settings) {
  return { ...settings, theme: { ...settings.theme } };
}`,
      tests: [
        {
          name: "copies all values",
          code: `assert.deepEqual(cloneSettings({ lang: "en", theme: { color: "dark" } }), { lang: "en", theme: { color: "dark" } });`,
        },
        {
          name: "top-level edits don't leak",
          code: `const original = { lang: "en", theme: { color: "dark" } };
cloneSettings(original).lang = "fr";
assert.equal(original.lang, "en");`,
        },
        {
          name: "nested edits don't leak",
          code: `const original = { lang: "en", theme: { color: "dark" } };
const copy = cloneSettings(original);
copy.theme.color = "light";
assert.equal(original.theme.color, "dark");`,
        },
      ],
      hints: ["Spread and `Object.assign` both copy one level. Nested objects are shared by reference."],
    },
    {
      slug: "freeze",
      title: "Freeze an object and prove it",
      kind: "implement",
      difficulty: 2,
      tags: ["immutability", "recursion"],
      description: `Write \`deepFreeze(obj)\` that freezes \`obj\` and every nested object (including arrays) and returns \`obj\`. In strict mode, writing to any level should then throw a \`TypeError\`.

Example: \`Object.isFrozen(deepFreeze({ a: { b: 1 } }).a)\` → \`true\``,
      starter: `function deepFreeze(obj) {

}`,
      solution: `function deepFreeze(obj) {
  for (const value of Object.values(obj)) {
    if (typeof value === "object" && value !== null) deepFreeze(value);
  }
  return Object.freeze(obj);
}`,
      tests: [
        {
          name: "returns the same object, frozen",
          code: `const obj = { a: 1 };
assert.equal(deepFreeze(obj), obj);
assert.ok(Object.isFrozen(obj));`,
        },
        {
          name: "freezes nested objects and arrays",
          code: `const obj = deepFreeze({ a: { b: { c: 1 } }, list: [{ x: 1 }] });
assert.ok(Object.isFrozen(obj.a.b));
assert.ok(Object.isFrozen(obj.list));
assert.ok(Object.isFrozen(obj.list[0]));`,
        },
        {
          name: "writes throw in strict mode",
          code: `const obj = deepFreeze({ a: { b: 1 } });
assert.throws(() => { obj.a.b = 2; }, TypeError);
assert.equal(obj.a.b, 1);`,
        },
        { name: "handles null values", code: `assert.ok(Object.isFrozen(deepFreeze({ a: null })));` },
      ],
      hints: ["`Object.freeze` is shallow.", "`typeof null === \"object\"`."],
    },
    {
      slug: "has-own-vs-in",
      title: "Object.hasOwn vs in",
      kind: "fix",
      difficulty: 2,
      tags: ["prototype", "objects"],
      description: `\`hasSetting(settings, key)\` should return \`true\` only when \`key\` is an own property of \`settings\`, even if its value is \`undefined\`. It must also work on objects created with \`Object.create(null)\`. It currently gives wrong answers for some keys. Fix it.

Example: \`hasSetting({}, "toString")\` → \`false\``,
      starter: `function hasSetting(settings, key) {
  return key in settings;
}`,
      solution: `function hasSetting(settings, key) {
  return Object.hasOwn(settings, key);
}`,
      tests: [
        { name: "finds an own key", code: `assert.equal(hasSetting({ theme: "dark" }, "theme"), true);` },
        { name: "finds an own key holding undefined", code: `assert.equal(hasSetting({ theme: undefined }, "theme"), true);` },
        { name: "ignores inherited keys", code: `assert.equal(hasSetting({}, "toString"), false);` },
        {
          name: "works on null-prototype objects",
          code: `const dict = Object.create(null);
dict.mode = "x";
assert.equal(hasSetting(dict, "mode"), true);
assert.equal(hasSetting(dict, "other"), false);`,
        },
      ],
    },
    {
      slug: "destructure-rename-default",
      title: "Destructure with rename and default",
      kind: "implement",
      difficulty: 1,
      tags: ["destructuring"],
      description: `Write \`normalizeUser(raw)\` that converts \`{ user_name, user_role }\` into \`{ name, role }\`. \`role\` defaults to \`"guest"\` when \`user_role\` is \`undefined\`. Use destructuring with renaming and a default.

Example: \`normalizeUser({ user_name: "Ada" })\` → \`{ name: "Ada", role: "guest" }\``,
      starter: `function normalizeUser(raw) {

}`,
      solution: `function normalizeUser({ user_name: name, user_role: role = "guest" }) {
  return { name, role };
}`,
      tests: [
        { name: "renames both fields", code: `assert.deepEqual(normalizeUser({ user_name: "Ada", user_role: "admin" }), { name: "Ada", role: "admin" });` },
        { name: "defaults role to guest", code: `assert.deepEqual(normalizeUser({ user_name: "Ada" }), { name: "Ada", role: "guest" });` },
        { name: "drops unrelated fields", code: `assert.deepEqual(normalizeUser({ user_name: "Bo", user_role: "dev", id: 3 }), { name: "Bo", role: "dev" });` },
      ],
    },
    {
      slug: "nested-destructure",
      title: "Nested destructuring",
      kind: "implement",
      difficulty: 2,
      tags: ["destructuring"],
      description: `Write \`summary(response)\` for responses shaped \`{ data: { user: { name }, items: [...] } }\`. Return \`"<name>: <first item>"\`, using \`"none"\` when \`items\` is empty. Use nested destructuring.

Example: \`summary({ data: { user: { name: "Ada" }, items: ["pen", "ink"] } })\` → \`"Ada: pen"\``,
      starter: `function summary(response) {

}`,
      solution: `function summary(response) {
  const {
    data: {
      user: { name },
      items: [first = "none"],
    },
  } = response;
  return \`\${name}: \${first}\`;
}`,
      tests: [
        { name: "uses the name and first item", code: `assert.equal(summary({ data: { user: { name: "Ada" }, items: ["pen", "ink"] } }), "Ada: pen");` },
        { name: "falls back to none", code: `assert.equal(summary({ data: { user: { name: "Bo" }, items: [] } }), "Bo: none");` },
      ],
    },
    {
      slug: "rest-destructure",
      title: "Rest in destructuring",
      kind: "implement",
      difficulty: 1,
      tags: ["destructuring", "immutability"],
      description: `Write \`withoutPassword(user)\` that returns a new object with every property of \`user\` except \`password\`. Don't mutate \`user\`.

Example: \`withoutPassword({ id: 1, password: "x" })\` → \`{ id: 1 }\``,
      starter: `function withoutPassword(user) {

}`,
      solution: `function withoutPassword(user) {
  const { password, ...rest } = user;
  return rest;
}`,
      tests: [
        { name: "removes password", code: `assert.deepEqual(withoutPassword({ id: 1, name: "Ada", password: "x" }), { id: 1, name: "Ada" });` },
        { name: "works when there is no password", code: `assert.deepEqual(withoutPassword({ id: 2 }), { id: 2 });` },
        {
          name: "does not mutate the input",
          code: `const user = { id: 1, password: "x" };
withoutPassword(user);
assert.equal(user.password, "x");`,
        },
      ],
    },
    {
      slug: "count-properties",
      title: "Count properties",
      kind: "fix",
      difficulty: 1,
      tags: ["prototype", "objects"],
      description: `\`countProps(obj)\` should return the number of \`obj\`'s own enumerable properties. It overcounts for some objects. Fix it.

Example: \`countProps({ a: 1, b: 2 })\` → \`2\``,
      starter: `function countProps(obj) {
  let count = 0;
  for (const key in obj) count++;
  return count;
}`,
      solution: `function countProps(obj) {
  return Object.keys(obj).length;
}`,
      tests: [
        { name: "counts own properties", code: `assert.equal(countProps({ a: 1, b: 2 }), 2);` },
        { name: "returns 0 for {}", code: `assert.equal(countProps({}), 0);` },
        {
          name: "ignores inherited properties",
          code: `const obj = Object.create({ inherited: true });
obj.own = 1;
assert.equal(countProps(obj), 1);`,
        },
      ],
    },
    {
      slug: "invert",
      title: "Invert keys and values",
      kind: "implement",
      difficulty: 1,
      tags: ["objects", "entries"],
      description: `Write \`invert(obj)\` that swaps keys and values. Values are strings; if two keys share a value, the later key wins.

Example: \`invert({ a: "x", b: "y" })\` → \`{ x: "a", y: "b" }\``,
      starter: `function invert(obj) {

}`,
      solution: `function invert(obj) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
}`,
      tests: [
        { name: "swaps keys and values", code: `assert.deepEqual(invert({ a: "x", b: "y" }), { x: "a", y: "b" });` },
        { name: "later keys win on duplicates", code: `assert.deepEqual(invert({ a: "x", b: "x" }), { x: "b" });` },
        { name: "returns {} for {}", code: `assert.deepEqual(invert({}), {});` },
      ],
    },
    {
      slug: "pick",
      title: "Pick a subset of keys",
      kind: "implement",
      difficulty: 2,
      tags: ["objects"],
      description: `Write \`pick(obj, keys)\` that returns a new object with only the listed keys. Keys that \`obj\` doesn't own are skipped entirely, not set to \`undefined\`.

Example: \`pick({ a: 1, b: 2, c: 3 }, ["a", "c", "z"])\` → \`{ a: 1, c: 3 }\``,
      starter: `function pick(obj, keys) {

}`,
      solution: `function pick(obj, keys) {
  return Object.fromEntries(keys.filter((key) => Object.hasOwn(obj, key)).map((key) => [key, obj[key]]));
}`,
      tests: [
        { name: "picks listed keys", code: `assert.deepEqual(pick({ a: 1, b: 2, c: 3 }, ["a", "c"]), { a: 1, c: 3 });` },
        { name: "skips missing keys", code: `assert.deepEqual(pick({ a: 1 }, ["a", "z"]), { a: 1 });` },
        { name: "keeps own keys holding undefined", code: `assert.deepEqual(pick({ a: undefined, b: 1 }, ["a"]), { a: undefined });` },
        { name: "skips inherited keys", code: `assert.deepEqual(pick({ a: 1 }, ["a", "toString"]), { a: 1 });` },
      ],
    },
    {
      slug: "omit",
      title: "Omit keys",
      kind: "implement",
      difficulty: 1,
      tags: ["objects", "immutability"],
      description: `Write \`omit(obj, keys)\` that returns a new object with every own enumerable key except those listed. Don't mutate \`obj\`.

Example: \`omit({ a: 1, b: 2, c: 3 }, ["b"])\` → \`{ a: 1, c: 3 }\``,
      starter: `function omit(obj, keys) {

}`,
      solution: `function omit(obj, keys) {
  const excluded = new Set(keys);
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !excluded.has(key)));
}`,
      tests: [
        { name: "removes listed keys", code: `assert.deepEqual(omit({ a: 1, b: 2, c: 3 }, ["b", "c"]), { a: 1 });` },
        { name: "ignores keys that aren't present", code: `assert.deepEqual(omit({ a: 1 }, ["z"]), { a: 1 });` },
        {
          name: "does not mutate the input",
          code: `const obj = { a: 1, b: 2 };
const out = omit(obj, ["a"]);
assert.notEqual(out, obj);
assert.deepEqual(obj, { a: 1, b: 2 });`,
        },
      ],
    },
  ],
};

export default topic;

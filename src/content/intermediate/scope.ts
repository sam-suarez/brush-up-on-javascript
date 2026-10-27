import type { Topic } from "../types";

const topic: Topic = {
  course: "intermediate",
  slug: "scope",
  title: "Scope",
  description: "Block and function scope, shadowing, hoisting, the temporal dead zone and closures.",
  tags: ["let", "var", "hoisting", "closures"],
  count: 10,
  challenges: [
    {
      slug: "block-scope",
      title: "Block scope: let vs var",
      kind: "predict",
      difficulty: 1,
      tags: ["scope"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order.

\`\`\`js
console.log("n", 1); // → logs "n 1"
\`\`\``,
      starter: `var a = 1;
let b = 1;

if (true) {
  var a = 2;
  let b = 2;
  console.log("inside", a, b);
}

console.log("outside", a, b);

const expected = [];`,
      solution: `var a = 1;
let b = 1;

if (true) {
  var a = 2;
  let b = 2;
  console.log("inside", a, b);
}

console.log("outside", a, b);

const expected = ["inside 2 2", "outside 2 1"];`,
      tests: [{ name: "expected matches the real output", code: `await tick(); assert.deepEqual(expected, logs);` }],
    },
    {
      slug: "function-scope",
      title: "Function scope: variable not visible outside",
      kind: "fix",
      difficulty: 1,
      tags: ["scope"],
      description: `\`getTheme()\` throws a \`ReferenceError\`. Fix the code so it returns the theme from the config that \`loadConfig()\` builds. \`loadConfig()\` should hand that config object back to its caller. Don't introduce globals.

Example: \`getTheme()\` → \`"dark"\``,
      starter: `function loadConfig() {
  const config = { theme: "dark", fontSize: 14 };
}

function getTheme() {
  loadConfig();
  return config.theme;
}`,
      solution: `function loadConfig() {
  const config = { theme: "dark", fontSize: 14 };
  return config;
}

function getTheme() {
  const config = loadConfig();
  return config.theme;
}`,
      tests: [
        { name: 'getTheme returns "dark"', code: `assert.equal(getTheme(), "dark");` },
        { name: "loadConfig returns the config", code: `assert.deepEqual(loadConfig(), { theme: "dark", fontSize: 14 });` },
        { name: "does not leak config onto globalThis", code: `getTheme(); assert.equal(globalThis.config, undefined);` },
      ],
    },
    {
      slug: "shadowing",
      title: "Shadowing",
      kind: "predict",
      difficulty: 1,
      tags: ["scope"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order. Numbers are logged as strings, e.g. \`console.log(7) → "7"\`.`,
      starter: `let x = 1;

function f(x) {
  x = x + 10;
  {
    let x = 100;
    console.log(x);
  }
  return x;
}

console.log(f(5));
console.log(x);

const expected = [];`,
      solution: `let x = 1;

function f(x) {
  x = x + 10;
  {
    let x = 100;
    console.log(x);
  }
  return x;
}

console.log(f(5));
console.log(x);

const expected = ["100", "15", "1"];`,
      tests: [{ name: "expected matches the real output", code: `await tick(); assert.deepEqual(expected, logs);` }],
    },
    {
      slug: "global-leak",
      title: "Global leak from a missing declaration",
      kind: "fix",
      difficulty: 1,
      tags: ["scope"],
      description: `\`sumPrices(items)\` should return the sum of every item's \`price\`, but calling it throws (the challenge runs in strict mode). Fix it. It must not create any global variable.

Example: \`sumPrices([{ price: 2 }, { price: 3 }])\` → \`5\``,
      starter: `function sumPrices(items) {
  total = 0;
  for (const item of items) {
    total += item.price;
  }
  return total;
}`,
      solution: `function sumPrices(items) {
  let total = 0;
  for (const item of items) {
    total += item.price;
  }
  return total;
}`,
      tests: [
        { name: "sums the prices", code: `assert.equal(sumPrices([{ price: 2 }, { price: 3 }, { price: 5 }]), 10);` },
        { name: "returns 0 for an empty list", code: `assert.equal(sumPrices([]), 0);` },
        {
          name: "does not create a global total",
          code: `try { sumPrices([{ price: 1 }]); } catch {}\nassert.equal(Object.hasOwn(globalThis, "total"), false);`,
        },
      ],
    },
    {
      slug: "closure-counter",
      title: "A closure capturing a counter",
      kind: "implement",
      difficulty: 1,
      tags: ["closures"],
      description: `Write \`makeCounter()\` that returns a function. Each call of the returned function returns the next integer, starting at \`1\`. Counters created by separate \`makeCounter()\` calls are independent.

Example: \`const next = makeCounter(); next(); next()\` → \`2\``,
      starter: `function makeCounter() {\n  \n}`,
      solution: `function makeCounter() {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
}`,
      tests: [
        { name: "returns a function", code: `assert.isFunction(makeCounter());` },
        { name: "counts 1, 2, 3", code: `const next = makeCounter();\nassert.deepEqual([next(), next(), next()], [1, 2, 3]);` },
        {
          name: "counters are independent",
          code: `const a = makeCounter();\nconst b = makeCounter();\na(); a();\nassert.equal(b(), 1);\nassert.equal(a(), 3);`,
        },
      ],
    },
    {
      slug: "loop-closure",
      title: "Loop closure with var",
      kind: "fix",
      difficulty: 3,
      tags: ["closures", "scope"],
      description: `\`makeHandlers(n)\` should return \`n\` functions where the i-th function returns \`i\`. Every handler returns the same number instead. Fix it.

Example: \`makeHandlers(3).map((h) => h())\` → \`[0, 1, 2]\``,
      starter: `function makeHandlers(n) {
  var handlers = [];
  for (var i = 0; i < n; i++) {
    handlers.push(() => i);
  }
  return handlers;
}`,
      solution: `function makeHandlers(n) {
  const handlers = [];
  for (let i = 0; i < n; i++) {
    handlers.push(() => i);
  }
  return handlers;
}`,
      tests: [
        { name: "each handler returns its own index", code: `assert.deepEqual(makeHandlers(3).map((h) => h()), [0, 1, 2]);` },
        { name: "returns n handlers", code: `assert.equal(makeHandlers(5).length, 5);` },
        { name: "handles n = 0", code: `assert.deepEqual(makeHandlers(0), []);` },
      ],
      hints: ["How many `i` bindings does a `var` loop create? How many does a `let` loop create?"],
    },
    {
      slug: "tdz",
      title: "Temporal dead zone",
      kind: "fix",
      difficulty: 2,
      tags: ["hoisting", "scope"],
      description: `\`priceWithTax(price)\` should return the price plus 20% tax, but it throws a \`ReferenceError\`. Fix it without changing the tax rate.

Example: \`priceWithTax(100)\` → \`120\``,
      starter: `function priceWithTax(price) {
  const total = price + tax(price);
  const rate = 0.2;

  function tax(amount) {
    return amount * rate;
  }

  return total;
}`,
      solution: `function priceWithTax(price) {
  const rate = 0.2;
  const total = price + tax(price);

  function tax(amount) {
    return amount * rate;
  }

  return total;
}`,
      tests: [
        { name: "adds 20% tax to 100", code: `assert.closeTo(priceWithTax(100), 120, 1e-9);` },
        { name: "adds 20% tax to 7.5", code: `assert.closeTo(priceWithTax(7.5), 9, 1e-9);` },
        { name: "handles 0", code: `assert.equal(priceWithTax(0), 0);` },
      ],
      hints: ["`tax` is hoisted, so calling it early is fine. What does `tax` read?"],
    },
    {
      slug: "hoisting",
      title: "Hoisting: declarations vs expressions",
      kind: "fix",
      difficulty: 2,
      tags: ["hoisting"],
      description: `The script throws before \`results\` is computed. Fix it so \`results\` holds \`[square(3), cube(2)]\`. Keep \`results\` as the first statement.

Example: \`results\` → \`[9, 8]\``,
      starter: `const results = [square(3), cube(2)];

function square(n) {
  return n * n;
}

var cube = function (n) {
  return n ** 3;
};`,
      solution: `const results = [square(3), cube(2)];

function square(n) {
  return n * n;
}

function cube(n) {
  return n ** 3;
}`,
      tests: [
        { name: "results is [9, 8]", code: `assert.deepEqual(results, [9, 8]);` },
        { name: "cube still works", code: `assert.equal(cube(3), 27);` },
      ],
    },
    {
      slug: "iife",
      title: "IIFE to create a private scope",
      kind: "complete",
      difficulty: 1,
      tags: ["closures", "scope"],
      description: `Complete the IIFE so \`nextId\` is a function returning \`"id-1"\`, \`"id-2"\`, ... on successive calls. Keep the counter inside the IIFE.

Example: \`nextId(); nextId()\` → \`"id-2"\``,
      starter: `const nextId = (() => {
  // your code here
})();`,
      solution: `const nextId = (() => {
  let count = 0;
  return () => {
    count += 1;
    return \`id-\${count}\`;
  };
})();`,
      tests: [
        { name: "nextId is a function", code: `assert.isFunction(nextId);` },
        {
          name: "returns increasing ids",
          code: `const first = Number(nextId().slice(3));\nassert.ok(first >= 1);\nassert.equal(nextId(), \`id-\${first + 1}\`);\nassert.equal(nextId(), \`id-\${first + 2}\`);`,
        },
        { name: "ids have the id- prefix", code: `assert.match(nextId(), /^id-\\d+$/);` },
      ],
    },
    {
      slug: "module-pattern",
      title: "Module pattern: expose a public API",
      kind: "implement",
      difficulty: 2,
      tags: ["closures", "scope"],
      description: `Use the module pattern (an IIFE returning an object) to create \`cart\` with this public API, keeping the item list private:

- \`add(name, price)\` adds an item
- \`total()\` returns the sum of prices
- \`items()\` returns a copy of the item names, in insertion order (mutating it must not affect the cart)
- \`clear()\` empties the cart

The returned object exposes only those four functions.

Example: \`cart.add("pen", 2); cart.add("ink", 5); cart.total()\` → \`7\``,
      starter: `const cart = {};`,
      solution: `const cart = (() => {
  const entries = [];

  return {
    add(name, price) {
      entries.push({ name, price });
    },
    total() {
      return entries.reduce((sum, item) => sum + item.price, 0);
    },
    items() {
      return entries.map((item) => item.name);
    },
    clear() {
      entries.length = 0;
    },
  };
})();`,
      tests: [
        {
          name: "add and total",
          code: `cart.clear();\ncart.add("pen", 2);\ncart.add("ink", 5);\nassert.equal(cart.total(), 7);`,
        },
        {
          name: "items returns names in order",
          code: `cart.clear();\ncart.add("a", 1);\ncart.add("b", 2);\nassert.deepEqual(cart.items(), ["a", "b"]);`,
        },
        {
          name: "items returns a copy",
          code: `cart.clear();\ncart.add("a", 1);\ncart.items().push("x");\nassert.deepEqual(cart.items(), ["a"]);`,
        },
        { name: "clear empties the cart", code: `cart.add("a", 1);\ncart.clear();\nassert.equal(cart.total(), 0);\nassert.deepEqual(cart.items(), []);` },
        {
          name: "exposes only the four functions",
          code: `assert.deepEqual(Object.keys(cart).sort(), ["add", "clear", "items", "total"]);\nassert.ok(Object.values(cart).every((v) => typeof v === "function"));`,
        },
      ],
    },
  ],
};

export default topic;

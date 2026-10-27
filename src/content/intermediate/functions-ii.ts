import type { Topic } from "../types";

const topic: Topic = {
  course: "intermediate",
  slug: "functions-ii",
  title: "Functions II",
  description: "Arrow functions, rest and spread, higher-order functions, recursion, call, apply and bind.",
  tags: ["arrow functions", "higher-order", "recursion"],
  count: 14,
  challenges: [
    {
      slug: "arrow-syntax",
      title: "Arrow function syntax",
      kind: "implement",
      difficulty: 1,
      tags: ["functions"],
      description: `Rewrite all three function expressions as arrow functions with concise (expression) bodies. Behaviour stays the same.

Example: \`greet("Ada")\` → \`"Hi, Ada"\``,
      starter: `const add = function (a, b) {
  return a + b;
};

const square = function (n) {
  return n * n;
};

const greet = function (name) {
  return "Hi, " + name;
};`,
      solution: `const add = (a, b) => a + b;

const square = (n) => n * n;

const greet = (name) => \`Hi, \${name}\`;`,
      tests: [
        { name: "add works", code: `assert.equal(add(2, 3), 5);` },
        { name: "square works", code: `assert.equal(square(4), 16);` },
        { name: "greet works", code: `assert.equal(greet("Ada"), "Hi, Ada");` },
        {
          name: "all three are arrow functions",
          code: `for (const fn of [add, square, greet]) {\n  assert.equal(fn.prototype, undefined, \`\${fn.name} has a prototype, so it is not an arrow\`);\n}`,
        },
      ],
    },
    {
      slug: "arrow-return-object",
      title: "Arrow function returning an object literal",
      kind: "fix",
      difficulty: 1,
      tags: ["functions"],
      description: `\`toPoint(x, y)\` should return an object with \`x\` and \`y\` properties, but it returns \`undefined\`. Fix it, keeping it a one-expression arrow.

Example: \`toPoint(1, 2)\` → \`{ x: 1, y: 2 }\``,
      starter: `const toPoint = (x, y) => { x, y };`,
      solution: `const toPoint = (x, y) => ({ x, y });`,
      tests: [
        { name: "returns { x, y }", code: `assert.deepEqual(toPoint(1, 2), { x: 1, y: 2 });` },
        { name: "returns a fresh object each call", code: `assert.notEqual(toPoint(0, 0), toPoint(0, 0));` },
      ],
    },
    {
      slug: "arrow-this",
      title: "Arrow functions and this",
      kind: "fix",
      difficulty: 2,
      tags: ["this", "functions"],
      description: `\`team.labels()\` should return each member followed by the team name in parentheses, but it throws a \`TypeError\`. Fix it.

Example: \`team.labels()\` → \`["Ada (Core)", "Linus (Core)"]\``,
      starter: `const team = {
  name: "Core",
  members: ["Ada", "Linus"],
  labels() {
    return this.members.map(function (member) {
      return \`\${member} (\${this.name})\`;
    });
  },
};`,
      solution: `const team = {
  name: "Core",
  members: ["Ada", "Linus"],
  labels() {
    return this.members.map((member) => \`\${member} (\${this.name})\`);
  },
};`,
      tests: [
        { name: "labels every member", code: `assert.deepEqual(team.labels(), ["Ada (Core)", "Linus (Core)"]);` },
        {
          name: "uses the current team name",
          code: `const other = { ...team, name: "Web", members: ["Grace"] };\nassert.deepEqual(team.labels.call(other), ["Grace (Web)"]);`,
        },
      ],
      hints: ["What is `this` inside a plain `function` callback in strict mode?"],
    },
    {
      slug: "rest-parameters",
      title: "Rest parameters: sum any number of arguments",
      kind: "implement",
      difficulty: 1,
      tags: ["functions"],
      description: `Write \`sum(...numbers)\` that returns the sum of all its arguments. With no arguments it returns \`0\`.

Example: \`sum(1, 2, 3, 4)\` → \`10\``,
      starter: `function sum() {\n  \n}`,
      solution: `function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}`,
      tests: [
        { name: "sums four arguments", code: `assert.equal(sum(1, 2, 3, 4), 10);` },
        { name: "sums one argument", code: `assert.equal(sum(5), 5);` },
        { name: "returns 0 with no arguments", code: `assert.equal(sum(), 0);` },
      ],
    },
    {
      slug: "spread-arguments",
      title: "Spread an array into a call",
      kind: "implement",
      difficulty: 1,
      tags: ["functions"],
      description: `Write \`maxOf(numbers)\` that returns the largest number in the array by spreading it into \`Math.max\`. Return \`null\` for an empty array.

Example: \`maxOf([3, 9, 2])\` → \`9\``,
      starter: `function maxOf(numbers) {\n  \n}`,
      solution: `function maxOf(numbers) {
  return numbers.length ? Math.max(...numbers) : null;
}`,
      tests: [
        { name: "returns the max", code: `assert.equal(maxOf([3, 9, 2]), 9);` },
        { name: "handles negatives", code: `assert.equal(maxOf([-5, -2, -9]), -2);` },
        { name: "returns null for an empty array", code: `assert.equal(maxOf([]), null);` },
      ],
    },
    {
      slug: "apply-twice",
      title: "Higher-order: apply a function twice",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order"],
      description: `Write \`twice(fn)\` that returns a new function which applies \`fn\` to its argument, then applies \`fn\` again to the result.

Example: \`twice((n) => n + 3)(10)\` → \`16\``,
      starter: `function twice(fn) {\n  \n}`,
      solution: `function twice(fn) {
  return (x) => fn(fn(x));
}`,
      tests: [
        { name: "returns a function", code: `assert.isFunction(twice((n) => n));` },
        { name: "adds 3 twice", code: `assert.equal(twice((n) => n + 3)(10), 16);` },
        { name: "works with strings", code: `assert.equal(twice((s) => s + "!")("hi"), "hi!!");` },
        {
          name: "calls fn exactly twice",
          code: `let calls = 0;\ntwice((n) => { calls += 1; return n; })(1);\nassert.equal(calls, 2);`,
        },
      ],
    },
    {
      slug: "multiplier-factory",
      title: "A function returning a function",
      kind: "implement",
      difficulty: 1,
      tags: ["closures", "higher-order"],
      description: `Write \`multiplier(factor)\` that returns a function multiplying its argument by \`factor\`.

Example: \`multiplier(3)(5)\` → \`15\``,
      starter: `function multiplier(factor) {\n  \n}`,
      solution: `function multiplier(factor) {
  return (n) => n * factor;
}`,
      tests: [
        { name: "triples", code: `assert.equal(multiplier(3)(5), 15);` },
        {
          name: "factories are independent",
          code: `const double = multiplier(2);\nconst half = multiplier(0.5);\nassert.equal(double(8), 16);\nassert.equal(half(8), 4);`,
        },
      ],
    },
    {
      slug: "callbacks",
      title: "Callbacks: run after each item",
      kind: "implement",
      difficulty: 2,
      tags: ["higher-order"],
      description: `Write \`processItems(items, transform, onProgress)\` that returns a new array of \`transform(item)\` results. After each item is transformed, call \`onProgress(done, total)\` where \`done\` is how many items are finished so far. \`onProgress\` is optional.

Example: \`processItems([1, 2], (n) => n * 10)\` → \`[10, 20]\`, and with \`onProgress\` it is called with \`(1, 2)\` then \`(2, 2)\`.`,
      starter: `function processItems(items, transform, onProgress) {\n  \n}`,
      solution: `function processItems(items, transform, onProgress) {
  const results = [];
  for (const item of items) {
    results.push(transform(item));
    onProgress?.(results.length, items.length);
  }
  return results;
}`,
      tests: [
        { name: "returns transformed items", code: `assert.deepEqual(processItems([1, 2, 3], (n) => n * 10), [10, 20, 30]);` },
        {
          name: "reports progress after each item",
          code: `const calls = [];\nprocessItems(["a", "b", "c"], (s) => s, (done, total) => calls.push([done, total]));\nassert.deepEqual(calls, [[1, 3], [2, 3], [3, 3]]);`,
        },
        {
          name: "calls onProgress after the transform",
          code: `const order = [];\nprocessItems([1], (n) => { order.push("transform"); return n; }, () => order.push("progress"));\nassert.deepEqual(order, ["transform", "progress"]);`,
        },
        { name: "handles an empty array", code: `assert.deepEqual(processItems([], (n) => n), []);` },
      ],
    },
    {
      slug: "private-counter",
      title: "Closures: a private counter with increment and decrement",
      kind: "implement",
      difficulty: 1,
      tags: ["closures"],
      description: `Write \`createCounter(start = 0)\` that returns an object with three methods: \`increment()\` and \`decrement()\` change the count by 1 and return the new value; \`value()\` returns the current count. The count itself must not be a property of the returned object.

Example: \`const c = createCounter(5); c.increment(); c.value()\` → \`6\``,
      starter: `function createCounter(start = 0) {\n  \n}`,
      solution: `function createCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}`,
      tests: [
        { name: "starts at 0 by default", code: `assert.equal(createCounter().value(), 0);` },
        {
          name: "increments and decrements",
          code: `const c = createCounter(5);\nassert.equal(c.increment(), 6);\nassert.equal(c.increment(), 7);\nassert.equal(c.decrement(), 6);\nassert.equal(c.value(), 6);`,
        },
        { name: "counters are independent", code: `const a = createCounter();\nconst b = createCounter();\na.increment();\nassert.equal(b.value(), 0);` },
        {
          name: "the count is not exposed as a property",
          code: `const c = createCounter(3);\nassert.ok(Object.values(c).every((v) => typeof v === "function"));`,
        },
      ],
    },
    {
      slug: "recursion-factorial",
      title: "Recursion: factorial",
      kind: "implement",
      difficulty: 1,
      tags: ["recursion"],
      description: `Write a recursive \`factorial(n)\` for non-negative integers. \`factorial(0)\` is \`1\`. Throw a \`RangeError\` for negative input.

Example: \`factorial(5)\` → \`120\``,
      starter: `function factorial(n) {\n  \n}`,
      solution: `function factorial(n) {
  if (n < 0) throw new RangeError("n must be non-negative");
  return n <= 1 ? 1 : n * factorial(n - 1);
}`,
      tests: [
        { name: "factorial(5) is 120", code: `assert.equal(factorial(5), 120);` },
        { name: "factorial(0) is 1", code: `assert.equal(factorial(0), 1);` },
        { name: "factorial(1) is 1", code: `assert.equal(factorial(1), 1);` },
        { name: "throws RangeError for negatives", code: `assert.throws(() => factorial(-1), RangeError);` },
      ],
    },
    {
      slug: "recursion-sum-nested",
      title: "Recursion: sum a nested array",
      kind: "implement",
      difficulty: 2,
      tags: ["recursion"],
      description: `Write \`sumNested(arr)\` that recursively sums all numbers in an array whose elements are numbers or (arbitrarily deeply) nested arrays. Don't use \`flat\`.

Example: \`sumNested([1, [2, [3, [4]]], 5])\` → \`15\``,
      starter: `function sumNested(arr) {\n  \n}`,
      solution: `function sumNested(arr) {
  return arr.reduce(
    (total, item) => total + (Array.isArray(item) ? sumNested(item) : item),
    0,
  );
}`,
      tests: [
        { name: "sums deeply nested numbers", code: `assert.equal(sumNested([1, [2, [3, [4]]], 5]), 15);` },
        { name: "sums a flat array", code: `assert.equal(sumNested([1, 2, 3]), 6);` },
        { name: "handles empty arrays at any level", code: `assert.equal(sumNested([]), 0);\nassert.equal(sumNested([[], [[]], 2]), 2);` },
      ],
    },
    {
      slug: "length-and-name",
      title: "Function.length and Function.name",
      kind: "implement",
      difficulty: 2,
      tags: ["functions"],
      description: `Write \`describeFunction(fn)\` that returns \`"<name>/<length>"\` using the function's \`name\` and \`length\`. When the name is empty, use \`"anonymous"\`.

Refresher: \`length\` counts parameters before the first default or rest parameter.

Example: \`describeFunction(function add(a, b) {})\` → \`"add/2"\``,
      starter: `function describeFunction(fn) {\n  \n}`,
      solution: `function describeFunction(fn) {
  return \`\${fn.name || "anonymous"}/\${fn.length}\`;
}`,
      tests: [
        { name: "named function", code: `assert.equal(describeFunction(function add(a, b) {}), "add/2");` },
        { name: "defaults stop the count", code: `assert.equal(describeFunction(function f(a, b = 2, c) {}), "f/1");` },
        { name: "rest is not counted", code: `assert.equal(describeFunction(function g(a, ...rest) {}), "g/1");` },
        { name: "inferred arrow name", code: `const area = (w, h) => w * h;\nassert.equal(describeFunction(area), "area/2");` },
        { name: "anonymous function", code: `const make = () => (x) => x;\nassert.equal(describeFunction(make()), "anonymous/1");` },
      ],
    },
    {
      slug: "call-and-apply",
      title: "call and apply",
      kind: "complete",
      difficulty: 1,
      tags: ["this", "functions"],
      description: `\`introduce\` reads \`this.name\`. Complete \`introduceWithCall(person, greeting, punctuation)\` using \`call\`, and \`introduceWithApply(person, args)\` using \`apply\`, where \`args\` is \`[greeting, punctuation]\`.

Example: \`introduceWithCall({ name: "Ada" }, "Hi", "!")\` → \`"Hi, I'm Ada!"\``,
      starter: `function introduce(greeting, punctuation) {
  return \`\${greeting}, I'm \${this.name}\${punctuation}\`;
}

function introduceWithCall(person, greeting, punctuation) {
  // your code here
}

function introduceWithApply(person, args) {
  // your code here
}`,
      solution: `function introduce(greeting, punctuation) {
  return \`\${greeting}, I'm \${this.name}\${punctuation}\`;
}

function introduceWithCall(person, greeting, punctuation) {
  return introduce.call(person, greeting, punctuation);
}

function introduceWithApply(person, args) {
  return introduce.apply(person, args);
}`,
      tests: [
        { name: "introduceWithCall", code: `assert.equal(introduceWithCall({ name: "Ada" }, "Hi", "!"), "Hi, I'm Ada!");` },
        { name: "introduceWithApply", code: `assert.equal(introduceWithApply({ name: "Linus" }, ["Hello", "."]), "Hello, I'm Linus.");` },
      ],
    },
    {
      slug: "bind-lost-this",
      title: "bind: fix a lost this",
      kind: "fix",
      difficulty: 2,
      tags: ["this"],
      description: `Passing \`logger.log\` as a callback loses its receiver, so the script throws. Fix it with \`bind\` so \`handler\` always logs through \`logger\`.

Example: after the script runs, \`logger.messages\` → \`["[app] ready"]\``,
      starter: `const logger = {
  prefix: "[app]",
  messages: [],
  log(message) {
    this.messages.push(\`\${this.prefix} \${message}\`);
  },
};

function runLater(callback) {
  callback("ready");
}

const handler = logger.log;
runLater(handler);`,
      solution: `const logger = {
  prefix: "[app]",
  messages: [],
  log(message) {
    this.messages.push(\`\${this.prefix} \${message}\`);
  },
};

function runLater(callback) {
  callback("ready");
}

const handler = logger.log.bind(logger);
runLater(handler);`,
      tests: [
        { name: "runLater logged through logger", code: `assert.deepEqual(logger.messages, ["[app] ready"]);` },
        {
          name: "handler stays bound when called bare",
          code: `logger.messages.length = 0;\nconst detached = handler;\ndetached("again");\nassert.deepEqual(logger.messages, ["[app] again"]);`,
        },
      ],
    },
  ],
};

export default topic;

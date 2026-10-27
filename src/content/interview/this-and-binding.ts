import type { Topic } from "../types";

const topic: Topic = {
  course: "interview",
  slug: "this-and-binding",
  title: "this and binding",
  description: "Implicit, explicit, hard and new binding, and how arrows change the rules.",
  tags: ["this", "bind"],
  count: 8,
  challenges: [
    {
      slug: "extracted-method",
      title: "A method loses this when extracted",
      kind: "fix",
      difficulty: 1,
      tags: ["this"],
      description: `\`increment\` is meant to be a standalone function that increments \`counter.count\` and returns the new value. Calling it throws instead. Fix it without changing the \`counter\` object.

Example: \`increment()\` → \`1\` (and \`counter.count\` is now \`1\`)`,
      starter: `const counter = {
  count: 0,
  increment() {
    this.count += 1;
    return this.count;
  },
};

const increment = counter.increment;`,
      solution: `const counter = {
  count: 0,
  increment() {
    this.count += 1;
    return this.count;
  },
};

const increment = counter.increment.bind(counter);`,
      tests: [
        {
          name: "increment() returns the new count",
          code: `const before = counter.count;\nassert.equal(increment(), before + 1);`,
        },
        {
          name: "increment() updates counter.count",
          code: `const before = counter.count;\nincrement();\nincrement();\nassert.equal(counter.count, before + 2);`,
        },
      ],
    },
    {
      slug: "arrow-method",
      title: "Arrow method in an object literal",
      kind: "fix",
      difficulty: 1,
      tags: ["this"],
      description: `\`user.greet()\` should return \`"Hi, I'm Ada"\`, and the method should work for any object it is borrowed by. It throws instead. Fix it.

Example: \`({ name: "Grace", greet: user.greet }).greet()\` → \`"Hi, I'm Grace"\``,
      starter: `const user = {
  name: "Ada",
  greet: () => "Hi, I'm " + this.name,
};`,
      solution: `const user = {
  name: "Ada",
  greet() {
    return "Hi, I'm " + this.name;
  },
};`,
      tests: [
        { name: "greets with the user's name", code: `assert.equal(user.greet(), "Hi, I'm Ada");` },
        {
          name: "uses the object it is called on",
          code: `const other = { name: "Grace", greet: user.greet };\nassert.equal(other.greet(), "Hi, I'm Grace");`,
        },
      ],
    },
    {
      slug: "this-in-settimeout",
      title: "this inside a setTimeout callback",
      kind: "fix",
      difficulty: 2,
      tags: ["this", "async"],
      description: `\`Ticker#start()\` schedules a timer that should increment the instance's \`ticks\`. After the timer fires, \`ticks\` is still \`0\`. Fix it.

Example: \`const t = new Ticker(); t.start(); /* after the timer */ t.ticks\` → \`1\``,
      starter: `class Ticker {
  constructor() {
    this.ticks = 0;
  }

  start() {
    setTimeout(function () {
      this.ticks += 1;
    }, 0);
  }
}`,
      solution: `class Ticker {
  constructor() {
    this.ticks = 0;
  }

  start() {
    setTimeout(() => {
      this.ticks += 1;
    }, 0);
  }
}`,
      tests: [
        {
          name: "ticks is 1 after the timer fires",
          code: `const t = new Ticker();\nt.start();\nawait tick();\nawait tick();\nassert.equal(t.ticks, 1);`,
        },
        {
          name: "each start() adds one tick to its own instance",
          code: `const a = new Ticker();\nconst b = new Ticker();\na.start(); a.start(); b.start();\nawait tick();\nawait tick();\nassert.equal(a.ticks, 2);\nassert.equal(b.ticks, 1);`,
        },
      ],
      hints: ["A `function` callback gets whatever `this` the timer API calls it with. Which function form takes `this` from its surrounding scope?"],
    },
    {
      slug: "explicit-call",
      title: "Explicit binding with call",
      kind: "implement",
      difficulty: 1,
      tags: ["this"],
      description: `\`describe(greeting)\` reads \`this.name\` and \`this.role\`. Write \`introduce(person, greeting)\` that returns \`describe\`'s result with \`person\` as \`this\`, without adding any property to \`person\`.

Example: \`introduce({ name: "Ada", role: "engineer" }, "Hello")\` → \`"Hello, I'm Ada, an engineer"\``,
      starter: `function describe(greeting) {
  return greeting + ", I'm " + this.name + ", an " + this.role;
}

function introduce(person, greeting) {
  // your code here
}`,
      solution: `function describe(greeting) {
  return greeting + ", I'm " + this.name + ", an " + this.role;
}

function introduce(person, greeting) {
  return describe.call(person, greeting);
}`,
      tests: [
        {
          name: "uses person as this",
          code: `assert.equal(introduce({ name: "Ada", role: "engineer" }, "Hello"), "Hello, I'm Ada, an engineer");`,
        },
        {
          name: "passes the greeting through",
          code: `assert.equal(introduce({ name: "Lin", role: "architect" }, "Hey"), "Hey, I'm Lin, an architect");`,
        },
        {
          name: "does not add properties to person",
          code: `const person = { name: "Ada", role: "engineer" };\nintroduce(person, "Hi");\nassert.deepEqual(Object.keys(person), ["name", "role"]);`,
        },
      ],
    },
    {
      slug: "apply-array",
      title: "apply with an array of arguments",
      kind: "implement",
      difficulty: 1,
      tags: ["this"],
      description: `Write \`applyAll(fn, context, argLists)\` that calls \`fn\` once per array in \`argLists\`, with \`context\` as \`this\` and that array's items as the arguments. Return the results in order.

Example: \`applyAll(function (a, b) { return this.base + a + b; }, { base: 10 }, [[1, 2], [3, 4]])\` → \`[13, 17]\``,
      starter: `function applyAll(fn, context, argLists) {\n  \n}`,
      solution: `function applyAll(fn, context, argLists) {
  return argLists.map((args) => fn.apply(context, args));
}`,
      tests: [
        {
          name: "calls fn with context and each argument list",
          code: `const f = function (a, b) { return this.base + a + b; };\nassert.deepEqual(applyAll(f, { base: 10 }, [[1, 2], [3, 4]]), [13, 17]);`,
        },
        {
          name: "spreads lists of different lengths",
          code: `const f = function (...args) { return this.tag + args.length; };\nassert.deepEqual(applyAll(f, { tag: "n" }, [[], [1], [1, 2, 3]]), ["n0", "n1", "n3"]);`,
        },
        {
          name: "returns an empty array for no argument lists",
          code: `assert.deepEqual(applyAll(() => 1, null, []), []);`,
        },
      ],
    },
    {
      slug: "hard-bind",
      title: "Hard binding with bind",
      kind: "implement",
      difficulty: 2,
      tags: ["this", "closures"],
      description: `Write \`hardBind(fn, context, ...preset)\` that returns a function which always calls \`fn\` with \`context\` as \`this\`, the preset arguments first, then its own arguments. Implement it with a closure rather than \`Function.prototype.bind\`.

Neither method-call syntax nor \`call\`/\`apply\` can change the bound \`this\`.

Example: \`hardBind(function (x) { return this.n + x; }, { n: 1 })(2)\` → \`3\``,
      starter: `function hardBind(fn, context, ...preset) {\n  \n}`,
      solution: `function hardBind(fn, context, ...preset) {
  return function (...args) {
    return fn.apply(context, [...preset, ...args]);
  };
}`,
      tests: [
        {
          name: "calls fn with the bound context",
          code: `const f = hardBind(function (x) { return this.n + x; }, { n: 1 });\nassert.equal(f(2), 3);`,
        },
        {
          name: "ignores call and apply",
          code: `const f = hardBind(function () { return this.id; }, { id: "bound" });\nassert.equal(f.call({ id: "call" }), "bound");\nassert.equal(f.apply({ id: "apply" }), "bound");`,
        },
        {
          name: "ignores method-call syntax",
          code: `const f = hardBind(function () { return this.id; }, { id: "bound" });\nconst obj = { id: "obj", f };\nassert.equal(obj.f(), "bound");`,
        },
        {
          name: "prepends preset arguments",
          code: `const f = hardBind(function (...args) { return [this.p, ...args]; }, { p: 0 }, 1, 2);\nassert.deepEqual(f(3), [0, 1, 2, 3]);`,
        },
      ],
    },
    {
      slug: "new-binding",
      title: "new binding with a constructor function",
      kind: "implement",
      difficulty: 2,
      tags: ["this", "prototype"],
      description: `Write a constructor function \`Point(x, y)\` (not a class) that stores \`x\` and \`y\` on the new instance, plus a \`Point.prototype.toString()\` returning \`"(x, y)"\`.

Make it safe to call without \`new\`: \`Point(1, 2)\` must also return a new \`Point\` instance.

Example: \`String(new Point(1, 2))\` → \`"(1, 2)"\``,
      starter: `function Point(x, y) {\n  \n}`,
      solution: `function Point(x, y) {
  if (!new.target) return new Point(x, y);
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return "(" + this.x + ", " + this.y + ")";
};`,
      tests: [
        {
          name: "new Point stores x and y",
          code: `const p = new Point(1, 2);\nassert.equal(p.x, 1);\nassert.equal(p.y, 2);\nassert.ok(p instanceof Point);`,
        },
        {
          name: "toString lives on the prototype",
          code: `const p = new Point(3, -4);\nassert.equal(String(p), "(3, -4)");\nassert.ok(!Object.hasOwn(p, "toString"));`,
        },
        {
          name: "works without new",
          code: `const p = Point(5, 6);\nassert.ok(p instanceof Point);\nassert.equal(p.x, 5);\nassert.equal(p.y, 6);`,
        },
      ],
      hints: ["`new.target` is `undefined` when a function is called without `new`."],
    },
    {
      slug: "precedence",
      title: "Binding precedence: new vs bind",
      kind: "predict",
      difficulty: 3,
      tags: ["this", "bind"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order. Each \`console.log\` call is one string, arguments joined by a space.

\`\`\`js
console.log(1 > 0); // → "true"
\`\`\``,
      starter: `function Person(name) {
  this.name = name;
}
const target = { name: "target" };
const BoundPerson = Person.bind(target);
const p = new BoundPerson("created");
console.log(p.name);
console.log(target.name);
console.log(p instanceof Person);

function getName() {
  return this.name;
}
const boundGet = getName.bind({ name: "first" });
console.log(boundGet.call({ name: "call" }));
console.log(boundGet.bind({ name: "second" })());
const holder = { name: "holder", boundGet };
console.log(holder.boundGet());

const expected = [];`,
      solution: `function Person(name) {
  this.name = name;
}
const target = { name: "target" };
const BoundPerson = Person.bind(target);
const p = new BoundPerson("created");
console.log(p.name);
console.log(target.name);
console.log(p instanceof Person);

function getName() {
  return this.name;
}
const boundGet = getName.bind({ name: "first" });
console.log(boundGet.call({ name: "call" }));
console.log(boundGet.bind({ name: "second" })());
const holder = { name: "holder", boundGet };
console.log(holder.boundGet());

const expected = ["created", "target", "true", "first", "first", "first"];`,
      tests: [
        { name: "expected matches the real output", code: `await tick();\nassert.deepEqual(expected, logs);` },
      ],
    },
  ],
};

export default topic;

import type { Topic } from "../types";

const topic: Topic = {
  course: "interview",
  slug: "prototypes",
  title: "Prototypes",
  description: "The prototype chain, constructor functions, and what class desugars to.",
  tags: ["prototype", "inheritance"],
  count: 8,
  challenges: [
    {
      slug: "object-create",
      title: "Object.create and the prototype chain",
      kind: "implement",
      difficulty: 1,
      tags: ["prototype"],
      description: `Write \`createDog(name)\` that returns a new object whose prototype is \`animal\` and whose only own property is \`name\`.

Example: \`createDog("Rex").speak()\` → \`"Rex makes a sound"\``,
      starter: `const animal = {
  speak() {
    return this.name + " makes a sound";
  },
};

function createDog(name) {
  // your code here
}`,
      solution: `const animal = {
  speak() {
    return this.name + " makes a sound";
  },
};

function createDog(name) {
  const dog = Object.create(animal);
  dog.name = name;
  return dog;
}`,
      tests: [
        {
          name: "the prototype is animal",
          code: `assert.equal(Object.getPrototypeOf(createDog("Rex")), animal);`,
        },
        { name: "inherits speak", code: `assert.equal(createDog("Rex").speak(), "Rex makes a sound");` },
        {
          name: "has only name as an own property",
          code: `assert.deepEqual(Object.getOwnPropertyNames(createDog("Fido")), ["name"]);`,
        },
      ],
    },
    {
      slug: "add-to-prototype",
      title: "Add a method to a prototype",
      kind: "complete",
      difficulty: 1,
      tags: ["prototype"],
      description: `Add a \`fullName()\` method to \`Person\` instances by putting it on \`Person.prototype\`, so every instance shares one function.

Example: \`new Person("Ada", "Lovelace").fullName()\` → \`"Ada Lovelace"\``,
      starter: `function Person(first, last) {
  this.first = first;
  this.last = last;
}

// your code here`,
      solution: `function Person(first, last) {
  this.first = first;
  this.last = last;
}

Person.prototype.fullName = function () {
  return this.first + " " + this.last;
};`,
      tests: [
        {
          name: "returns the full name",
          code: `assert.equal(new Person("Ada", "Lovelace").fullName(), "Ada Lovelace");`,
        },
        {
          name: "is not an own property of instances",
          code: `assert.ok(!Object.hasOwn(new Person("a", "b"), "fullName"));`,
        },
        {
          name: "is shared by all instances",
          code: `assert.equal(new Person("a", "b").fullName, new Person("c", "d").fullName);`,
        },
      ],
    },
    {
      slug: "constructor-function",
      title: "Constructor function with a prototype method",
      kind: "implement",
      difficulty: 2,
      tags: ["prototype"],
      description: `Write a constructor function \`Stack()\` (not a class). Each instance owns its items. \`push(value)\`, \`pop()\`, \`peek()\` and \`isEmpty()\` live on \`Stack.prototype\`.

\`pop()\` and \`peek()\` return \`undefined\` on an empty stack. Two stacks must never share items.

Example: \`const s = new Stack(); s.push(1); s.push(2); s.pop()\` → \`2\``,
      starter: `function Stack() {\n  \n}`,
      solution: `function Stack() {
  this.items = [];
}

Stack.prototype.push = function (value) {
  this.items.push(value);
};

Stack.prototype.pop = function () {
  return this.items.pop();
};

Stack.prototype.peek = function () {
  return this.items.at(-1);
};

Stack.prototype.isEmpty = function () {
  return this.items.length === 0;
};`,
      tests: [
        {
          name: "push, peek and pop work last-in first-out",
          code: `const s = new Stack();\ns.push(1); s.push(2);\nassert.equal(s.peek(), 2);\nassert.equal(s.pop(), 2);\nassert.equal(s.pop(), 1);\nassert.equal(s.pop(), undefined);\nassert.equal(s.peek(), undefined);`,
        },
        {
          name: "isEmpty reflects the contents",
          code: `const s = new Stack();\nassert.equal(s.isEmpty(), true);\ns.push("x");\nassert.equal(s.isEmpty(), false);`,
        },
        {
          name: "methods live on the prototype",
          code: `const s = new Stack();\nfor (const m of ["push", "pop", "peek", "isEmpty"]) {\n  assert.ok(Object.hasOwn(Stack.prototype, m), m + " on prototype");\n  assert.ok(!Object.hasOwn(s, m), m + " not own");\n}`,
        },
        {
          name: "instances do not share items",
          code: `const a = new Stack();\nconst b = new Stack();\na.push(1);\nassert.equal(b.isEmpty(), true);`,
        },
      ],
    },
    {
      slug: "lookup-order",
      title: "Prototype chain lookup order",
      kind: "predict",
      difficulty: 2,
      tags: ["prototype"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order. Each \`console.log\` call is one string, arguments joined by a space.

\`\`\`js
console.log(true, undefined); // → "true undefined"
\`\`\``,
      starter: `const base = { kind: "base", greet() { return "base"; } };
const mid = Object.create(base);
mid.greet = function () { return "mid"; };
const leaf = Object.create(mid);

console.log(leaf.greet());
console.log(leaf.kind);
leaf.kind = "leaf";
console.log(leaf.kind, base.kind);
delete leaf.kind;
console.log(leaf.kind);
delete mid.greet;
console.log(leaf.greet());
console.log("toString" in leaf, Object.hasOwn(leaf, "toString"));
console.log(leaf.missing);

const expected = [];`,
      solution: `const base = { kind: "base", greet() { return "base"; } };
const mid = Object.create(base);
mid.greet = function () { return "mid"; };
const leaf = Object.create(mid);

console.log(leaf.greet());
console.log(leaf.kind);
leaf.kind = "leaf";
console.log(leaf.kind, base.kind);
delete leaf.kind;
console.log(leaf.kind);
delete mid.greet;
console.log(leaf.greet());
console.log("toString" in leaf, Object.hasOwn(leaf, "toString"));
console.log(leaf.missing);

const expected = ["mid", "base", "leaf base", "base", "base", "true false", "undefined"];`,
      tests: [
        { name: "expected matches the real output", code: `await tick();\nassert.deepEqual(expected, logs);` },
      ],
    },
    {
      slug: "own-vs-inherited",
      title: "Own vs inherited properties",
      kind: "implement",
      difficulty: 2,
      tags: ["prototype", "iteration"],
      description: `Write \`splitKeys(obj)\` that returns \`{ own, inherited }\`: arrays of the enumerable string keys \`obj\` has itself and those it inherits from anywhere up its prototype chain.

Keep the order \`Object.keys\` / \`for...in\` would produce. A key that is shadowed by an own property appears only in \`own\`. Non-enumerable keys are ignored.

Example: \`splitKeys(Object.assign(Object.create({ a: 1 }), { b: 2 }))\` → \`{ own: ["b"], inherited: ["a"] }\``,
      starter: `function splitKeys(obj) {\n  \n}`,
      solution: `function splitKeys(obj) {
  const own = Object.keys(obj);
  const inherited = [];
  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) inherited.push(key);
  }
  return { own, inherited };
}`,
      tests: [
        {
          name: "a plain object has no inherited keys",
          code: `assert.deepEqual(splitKeys({ x: 1, y: 2 }), { own: ["x", "y"], inherited: [] });`,
        },
        {
          name: "collects keys from every level of the chain",
          code: `const top = { a: 1 };\nconst middle = Object.assign(Object.create(top), { b: 2 });\nconst obj = Object.assign(Object.create(middle), { c: 3 });\nassert.deepEqual(splitKeys(obj), { own: ["c"], inherited: ["b", "a"] });`,
        },
        {
          name: "a shadowed key appears only in own",
          code: `const obj = Object.assign(Object.create({ a: 1, b: 2 }), { a: 10 });\nassert.deepEqual(splitKeys(obj), { own: ["a"], inherited: ["b"] });`,
        },
        {
          name: "ignores non-enumerable keys",
          code: `const proto = {};\nObject.defineProperty(proto, "hidden", { value: 1, enumerable: false });\nproto.shown = 2;\nconst obj = Object.create(proto);\nObject.defineProperty(obj, "secret", { value: 3, enumerable: false });\nassert.deepEqual(splitKeys(obj), { own: [], inherited: ["shown"] });`,
        },
      ],
    },
    {
      slug: "set-prototype-of",
      title: "Inheritance with Object.setPrototypeOf",
      kind: "complete",
      difficulty: 2,
      tags: ["prototype", "inheritance"],
      description: `Make \`Dog\` inherit from \`Animal\` without \`class\`: a \`Dog\` instance gets its \`name\` from the \`Animal\` constructor and can call both \`speak()\` and \`bark()\`. Link the prototypes with \`Object.setPrototypeOf\` so \`Dog.prototype.constructor\` stays \`Dog\`.

Example: \`new Dog("Rex").speak()\` → \`"Rex makes a sound"\``,
      starter: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return this.name + " makes a sound";
};

function Dog(name) {
  // your code here
}
Dog.prototype.bark = function () {
  return this.name + " barks";
};
// your code here`,
      solution: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return this.name + " makes a sound";
};

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype.bark = function () {
  return this.name + " barks";
};
Object.setPrototypeOf(Dog.prototype, Animal.prototype);`,
      tests: [
        {
          name: "Dog sets name through Animal",
          code: `const d = new Dog("Rex");\nassert.equal(d.name, "Rex");\nassert.equal(d.bark(), "Rex barks");`,
        },
        { name: "inherits speak", code: `assert.equal(new Dog("Rex").speak(), "Rex makes a sound");` },
        {
          name: "is an instance of both",
          code: `const d = new Dog("Rex");\nassert.ok(d instanceof Dog);\nassert.ok(d instanceof Animal);`,
        },
        {
          name: "Dog.prototype.constructor is still Dog",
          code: `assert.equal(Dog.prototype.constructor, Dog);\nassert.equal(Object.getPrototypeOf(Dog.prototype), Animal.prototype);`,
        },
      ],
    },
    {
      slug: "desugar-class",
      title: "A class desugared to constructor + prototype",
      kind: "implement",
      difficulty: 3,
      tags: ["prototype", "inheritance"],
      description: `Rewrite these classes as constructor functions and prototypes, without the \`class\` keyword:

\`\`\`js
class Rectangle {
  constructor(width, height) { this.width = width; this.height = height; }
  area() { return this.width * this.height; }
  static unit() { return new Rectangle(1, 1); }
}
class Square extends Rectangle {
  constructor(side) { super(side, side); }
}
\`\`\`

Match the observable details: class methods are non-enumerable (\`Object.keys(Rectangle.prototype)\` → \`[]\`), and \`extends\` links both the instance prototypes and the constructors themselves, so \`Square.unit\` is inherited.`,
      starter: `function Rectangle(width, height) {\n  \n}\n\nfunction Square(side) {\n  \n}`,
      solution: `function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}

Object.defineProperty(Rectangle.prototype, "area", {
  value: function area() {
    return this.width * this.height;
  },
  writable: true,
  configurable: true,
});

Rectangle.unit = function () {
  return new Rectangle(1, 1);
};

function Square(side) {
  Rectangle.call(this, side, side);
}

Object.setPrototypeOf(Square.prototype, Rectangle.prototype);
Object.setPrototypeOf(Square, Rectangle);`,
      tests: [
        {
          name: "does not use class",
          code: `assert.ok(!/^class\\b/.test(Rectangle.toString()));\nassert.ok(!/^class\\b/.test(Square.toString()));`,
        },
        {
          name: "Rectangle computes its area",
          code: `const r = new Rectangle(3, 4);\nassert.equal(r.area(), 12);\nassert.deepEqual(Object.keys(r), ["width", "height"]);`,
        },
        {
          name: "area is a non-enumerable prototype method",
          code: `assert.isFunction(Rectangle.prototype.area);\nassert.deepEqual(Object.keys(Rectangle.prototype), []);`,
        },
        {
          name: "Square inherits from Rectangle",
          code: `const s = new Square(5);\nassert.equal(s.area(), 25);\nassert.ok(s instanceof Square);\nassert.ok(s instanceof Rectangle);\nassert.equal(Square.prototype.constructor, Square);`,
        },
        {
          name: "statics are inherited",
          code: `assert.equal(Object.getPrototypeOf(Square), Rectangle);\nassert.equal(Square.unit().area(), 1);\nassert.ok(Rectangle.unit() instanceof Rectangle);`,
        },
      ],
      hints: [
        "Assignment creates enumerable properties; `Object.defineProperty` defaults to non-enumerable.",
        "Two prototype links are needed: one between the `.prototype` objects and one between the functions.",
      ],
    },
    {
      slug: "implement-instanceof",
      title: "Implement instanceof",
      kind: "implement",
      difficulty: 3,
      tags: ["prototype"],
      description: `Write \`isInstanceOf(value, Ctor)\` that returns whether \`Ctor.prototype\` appears anywhere on \`value\`'s prototype chain, without using \`instanceof\` or \`isPrototypeOf\`.

Primitives (including \`null\` and \`undefined\`) return \`false\`, like \`instanceof\` does: \`isInstanceOf(5, Number)\` → \`false\`. Functions are objects, so \`isInstanceOf(() => {}, Function)\` → \`true\`. Objects with a \`null\` prototype return \`false\` for every constructor.`,
      starter: `function isInstanceOf(value, Ctor) {\n  \n}`,
      solution: `function isInstanceOf(value, Ctor) {
  if (value === null || (typeof value !== "object" && typeof value !== "function")) return false;
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}`,
      tests: [
        {
          name: "matches the direct constructor",
          code: `class A {}\nassert.equal(isInstanceOf(new A(), A), true);\nassert.equal(isInstanceOf([], Array), true);`,
        },
        {
          name: "matches constructors further up the chain",
          code: `class A {}\nclass B extends A {}\nassert.equal(isInstanceOf(new B(), A), true);\nassert.equal(isInstanceOf(new B(), Object), true);\nassert.equal(isInstanceOf(() => {}, Function), true);`,
        },
        {
          name: "returns false for unrelated constructors",
          code: `class A {}\nclass B {}\nassert.equal(isInstanceOf(new A(), B), false);\nassert.equal(isInstanceOf({}, Array), false);`,
        },
        {
          name: "returns false for primitives",
          code: `assert.equal(isInstanceOf(5, Number), false);\nassert.equal(isInstanceOf("s", String), false);\nassert.equal(isInstanceOf(null, Object), false);\nassert.equal(isInstanceOf(undefined, Object), false);`,
        },
        {
          name: "returns false for null-prototype objects",
          code: `assert.equal(isInstanceOf(Object.create(null), Object), false);`,
        },
      ],
    },
  ],
};

export default topic;

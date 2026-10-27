import type { Topic } from "../types";

const topic: Topic = {
  course: "intermediate",
  slug: "classes",
  title: "Classes",
  description: "Constructors, methods, accessors, static and private members, inheritance and iteration.",
  tags: ["class", "extends", "private fields"],
  count: 22,
  challenges: [
    {
      slug: "declare-class",
      title: "Declare a class with a constructor",
      kind: "implement",
      difficulty: 1,
      tags: ["classes"],
      description: `Declare a class \`Point\` whose constructor takes \`x\` and \`y\` and stores them as properties of the same names.

Example: \`new Point(1, 2).y\` → \`2\``,
      starter: `// declare Point here\n`,
      solution: `class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}`,
      tests: [
        { name: "stores x and y", code: `const p = new Point(1, 2);\nassert.equal(p.x, 1);\nassert.equal(p.y, 2);` },
        { name: "is a class (throws without new)", code: `assert.throws(() => Point(1, 2), TypeError);` },
      ],
    },
    {
      slug: "add-method",
      title: "Add a method",
      kind: "complete",
      difficulty: 1,
      tags: ["classes"],
      description: `Add a \`distanceTo(other)\` method to \`Point\` that returns the Euclidean distance to another point.

Example: \`new Point(0, 0).distanceTo(new Point(3, 4))\` → \`5\``,
      starter: `class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // your code here
}`,
      solution: `class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(other) {
    return Math.hypot(other.x - this.x, other.y - this.y);
  }
}`,
      tests: [
        { name: "computes a 3-4-5 distance", code: `assert.closeTo(new Point(0, 0).distanceTo(new Point(3, 4)), 5, 1e-9);` },
        { name: "distance to itself is 0", code: `const p = new Point(2, 7);\nassert.equal(p.distanceTo(p), 0);` },
        { name: "lives on the prototype", code: `assert.ok(Object.hasOwn(Point.prototype, "distanceTo"));` },
      ],
    },
    {
      slug: "instantiate",
      title: "Instantiate and call",
      kind: "complete",
      difficulty: 1,
      tags: ["classes"],
      description: `Create \`square\`, a \`Rectangle\` with width and height \`4\`, and set \`squareArea\` to the result of calling its \`area\` method.

Example: \`squareArea\` → \`16\``,
      starter: `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

// your code here
const square = null;
const squareArea = 0;`,
      solution: `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

const square = new Rectangle(4, 4);
const squareArea = square.area();`,
      tests: [
        { name: "square is a Rectangle", code: `assert.ok(square instanceof Rectangle);` },
        { name: "square is 4 by 4", code: `assert.equal(square.width, 4);\nassert.equal(square.height, 4);` },
        { name: "squareArea is 16", code: `assert.equal(squareArea, 16);` },
      ],
    },
    {
      slug: "getter",
      title: "Getter",
      kind: "complete",
      difficulty: 1,
      tags: ["classes"],
      description: `Add a \`fahrenheit\` getter to \`Temperature\` computed from \`celsius\` (\`F = C * 9 / 5 + 32\`). It must reflect later changes to \`celsius\`.

Example: \`new Temperature(100).fahrenheit\` → \`212\``,
      starter: `class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  // your code here
}`,
      solution: `class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  get fahrenheit() {
    return (this.celsius * 9) / 5 + 32;
  }
}`,
      tests: [
        { name: "converts 100 C", code: `assert.equal(new Temperature(100).fahrenheit, 212);` },
        { name: "reflects changes", code: `const t = new Temperature(0);\nassert.equal(t.fahrenheit, 32);\nt.celsius = -40;\nassert.equal(t.fahrenheit, -40);` },
        {
          name: "is a getter, not a method or field",
          code: `const desc = Object.getOwnPropertyDescriptor(Temperature.prototype, "fahrenheit");\nassert.ok(desc && typeof desc.get === "function");`,
        },
      ],
    },
    {
      slug: "setter-validation",
      title: "Setter with validation",
      kind: "implement",
      difficulty: 2,
      tags: ["classes"],
      description: `Write a class \`Person\` with a constructor \`(name, age)\` and an \`age\` accessor pair. The setter throws a \`RangeError\` unless the value is a non-negative integer. The constructor must validate too.

Example: \`new Person("Ada", -1)\` → throws \`RangeError\``,
      starter: `class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}`,
      solution: `class Person {
  #age;

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  get age() {
    return this.#age;
  }

  set age(value) {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError(\`Invalid age: \${value}\`);
    }
    this.#age = value;
  }
}`,
      tests: [
        { name: "stores a valid age", code: `const p = new Person("Ada", 36);\nassert.equal(p.age, 36);\np.age = 37;\nassert.equal(p.age, 37);` },
        { name: "setter rejects negatives", code: `const p = new Person("Ada", 36);\nassert.throws(() => { p.age = -1; }, RangeError);\nassert.equal(p.age, 36);` },
        { name: "setter rejects non-integers", code: `const p = new Person("Ada", 36);\nassert.throws(() => { p.age = 1.5; }, RangeError);\nassert.throws(() => { p.age = "40"; }, RangeError);` },
        { name: "constructor validates", code: `assert.throws(() => new Person("Ada", -1), RangeError);` },
        { name: "accepts 0", code: `assert.equal(new Person("Baby", 0).age, 0);` },
      ],
    },
    {
      slug: "static-method",
      title: "Static method",
      kind: "implement",
      difficulty: 1,
      tags: ["classes"],
      description: `Write a class \`MathUtils\` with a static method \`clamp(value, min, max)\` that limits \`value\` to the inclusive range. It must not be available on instances.

Example: \`MathUtils.clamp(15, 0, 10)\` → \`10\``,
      starter: `class MathUtils {\n  \n}`,
      solution: `class MathUtils {
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}`,
      tests: [
        { name: "clamps above", code: `assert.equal(MathUtils.clamp(15, 0, 10), 10);` },
        { name: "clamps below", code: `assert.equal(MathUtils.clamp(-3, 0, 10), 0);` },
        { name: "keeps values in range", code: `assert.equal(MathUtils.clamp(4, 0, 10), 4);` },
        { name: "is not on instances", code: `assert.equal(new MathUtils().clamp, undefined);` },
      ],
    },
    {
      slug: "static-property",
      title: "Static property",
      kind: "complete",
      difficulty: 1,
      tags: ["classes"],
      description: `Give \`User\` a static \`count\` property, starting at \`0\`, that the constructor increments for every new instance.

Example: \`User.count = 0; new User("a"); new User("b"); User.count\` → \`2\``,
      starter: `class User {
  // your code here

  constructor(name) {
    this.name = name;
  }
}`,
      solution: `class User {
  static count = 0;

  constructor(name) {
    this.name = name;
    User.count += 1;
  }
}`,
      tests: [
        { name: "count is a number on the class", code: `assert.type(User.count, "number");` },
        { name: "counts instances", code: `User.count = 0;\nnew User("a");\nnew User("b");\nassert.equal(User.count, 2);` },
        { name: "instances have no count", code: `assert.equal(new User("c").count, undefined);` },
      ],
    },
    {
      slug: "private-field",
      title: "Private field",
      kind: "implement",
      difficulty: 2,
      tags: ["classes"],
      description: `Write \`BankAccount\` with a private \`#balance\` (starting at the constructor argument, default \`0\`), \`deposit(amount)\`, \`withdraw(amount)\` and a \`balance\` getter. \`withdraw\` throws an \`Error\` with message \`"Insufficient funds"\` if the amount exceeds the balance. Instances have no public own properties.

Example: \`const a = new BankAccount(10); a.deposit(5); a.balance\` → \`15\``,
      starter: `class BankAccount {
  constructor(balance = 0) {
    this.balance = balance;
  }
}`,
      solution: `class BankAccount {
  #balance;

  constructor(balance = 0) {
    this.#balance = balance;
  }

  get balance() {
    return this.#balance;
  }

  deposit(amount) {
    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
  }
}`,
      tests: [
        { name: "deposit and withdraw", code: `const a = new BankAccount(10);\na.deposit(5);\na.withdraw(3);\nassert.equal(a.balance, 12);` },
        { name: "defaults to 0", code: `assert.equal(new BankAccount().balance, 0);` },
        {
          name: "rejects overdrafts",
          code: `const a = new BankAccount(5);\nassert.throws(() => a.withdraw(6), "Insufficient funds");\nassert.equal(a.balance, 5);`,
        },
        { name: "has no public own properties", code: `assert.deepEqual(Object.getOwnPropertyNames(new BankAccount(5)), []);` },
        { name: "balance is read-only from outside", code: `const a = new BankAccount(5);\nassert.throws(() => { a.balance = 100; }, TypeError);` },
      ],
    },
    {
      slug: "private-method",
      title: "Private method",
      kind: "implement",
      difficulty: 1,
      tags: ["classes"],
      description: `Refactor \`Formatter\` so \`trim\` and \`capitalize\` become private methods. \`format\` stays public and behaves the same.

Example: \`new Formatter().format("  aDA ")\` → \`"Ada"\``,
      starter: `class Formatter {
  format(name) {
    return this.capitalize(this.trim(name));
  }

  trim(text) {
    return text.trim();
  }

  capitalize(text) {
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
  }
}`,
      solution: `class Formatter {
  format(name) {
    return this.#capitalize(this.#trim(name));
  }

  #trim(text) {
    return text.trim();
  }

  #capitalize(text) {
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
  }
}`,
      tests: [
        { name: "format still works", code: `assert.equal(new Formatter().format("  aDA "), "Ada");` },
        { name: "only format is public", code: `assert.deepEqual(Object.getOwnPropertyNames(Formatter.prototype).sort(), ["constructor", "format"]);` },
        { name: "helpers are not reachable", code: `const f = new Formatter();\nassert.equal(f.trim, undefined);\nassert.equal(f.capitalize, undefined);` },
      ],
    },
    {
      slug: "extends",
      title: "Inheritance with extends",
      kind: "complete",
      difficulty: 1,
      tags: ["classes", "prototype"],
      description: `Write \`Dog\`, a subclass of \`Animal\`, with a \`speak()\` method returning \`"<name> barks"\`. It inherits \`describe()\` unchanged.

Example: \`new Dog("Rex").speak()\` → \`"Rex barks"\``,
      starter: `class Animal {
  constructor(name) {
    this.name = name;
  }

  describe() {
    return \`\${this.name} is an animal\`;
  }
}

// your code here`,
      solution: `class Animal {
  constructor(name) {
    this.name = name;
  }

  describe() {
    return \`\${this.name} is an animal\`;
  }
}

class Dog extends Animal {
  speak() {
    return \`\${this.name} barks\`;
  }
}`,
      tests: [
        { name: "speak", code: `assert.equal(new Dog("Rex").speak(), "Rex barks");` },
        { name: "inherits describe", code: `assert.equal(new Dog("Rex").describe(), "Rex is an animal");` },
        { name: "is an Animal", code: `assert.ok(new Dog("Rex") instanceof Animal);\nassert.equal(Object.getPrototypeOf(Dog), Animal);` },
        { name: "does not redefine describe", code: `assert.equal(Object.hasOwn(Dog.prototype, "describe"), false);` },
      ],
    },
    {
      slug: "super-constructor",
      title: "super in the constructor",
      kind: "fix",
      difficulty: 2,
      tags: ["classes"],
      description: `Creating a \`Circle\` throws a \`ReferenceError\`. Fix it.

Example: \`new Circle(2).name\` → \`"circle"\``,
      starter: `class Shape {
  constructor(name) {
    this.name = name;
  }
}

class Circle extends Shape {
  constructor(radius) {
    this.radius = radius;
    super("circle");
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}`,
      solution: `class Shape {
  constructor(name) {
    this.name = name;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super("circle");
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}`,
      tests: [
        { name: "sets name via Shape", code: `assert.equal(new Circle(2).name, "circle");` },
        { name: "stores radius", code: `assert.equal(new Circle(2).radius, 2);` },
        { name: "computes area", code: `assert.closeTo(new Circle(1).area(), Math.PI, 1e-9);` },
      ],
    },
    {
      slug: "override-and-super",
      title: "Override a method and call super",
      kind: "complete",
      difficulty: 2,
      tags: ["classes"],
      description: `Override \`describe()\` in \`Manager\` so it returns the parent's description followed by \`", manages <n> people"\` where \`n\` is the number of reports. Reuse the parent's method via \`super\` rather than duplicating it.

Example: \`new Manager("Ada", "CTO", ["Linus"]).describe()\` → \`"Ada (CTO), manages 1 people"\``,
      starter: `class Employee {
  constructor(name, title) {
    this.name = name;
    this.title = title;
  }

  describe() {
    return \`\${this.name} (\${this.title})\`;
  }
}

class Manager extends Employee {
  constructor(name, title, reports) {
    super(name, title);
    this.reports = reports;
  }

  // your code here
}`,
      solution: `class Employee {
  constructor(name, title) {
    this.name = name;
    this.title = title;
  }

  describe() {
    return \`\${this.name} (\${this.title})\`;
  }
}

class Manager extends Employee {
  constructor(name, title, reports) {
    super(name, title);
    this.reports = reports;
  }

  describe() {
    return \`\${super.describe()}, manages \${this.reports.length} people\`;
  }
}`,
      tests: [
        { name: "extends the parent description", code: `assert.equal(new Manager("Ada", "CTO", ["Linus", "Grace"]).describe(), "Ada (CTO), manages 2 people");` },
        { name: "Employee is unchanged", code: `assert.equal(new Employee("Linus", "Dev").describe(), "Linus (Dev)");` },
        {
          name: "delegates to Employee.prototype.describe",
          code: `const original = Employee.prototype.describe;\nEmployee.prototype.describe = () => "PARENT";\ntry {\n  assert.equal(new Manager("Ada", "CTO", []).describe(), "PARENT, manages 0 people");\n} finally {\n  Employee.prototype.describe = original;\n}`,
        },
      ],
    },
    {
      slug: "instanceof",
      title: "instanceof",
      kind: "implement",
      difficulty: 3,
      tags: ["prototype", "classes"],
      description: `Write \`isInstance(value, Ctor)\` that behaves like \`value instanceof Ctor\` for ordinary constructors, without using \`instanceof\` (or \`isPrototypeOf\`): walk the prototype chain of \`value\` looking for \`Ctor.prototype\`. Primitives, \`null\` and \`undefined\` return \`false\`.

Example: \`isInstance([], Object)\` → \`true\``,
      starter: `function isInstance(value, Ctor) {\n  \n}`,
      solution: `function isInstance(value, Ctor) {
  if (value === null || (typeof value !== "object" && typeof value !== "function")) {
    return false;
  }
  let proto = Object.getPrototypeOf(value);
  while (proto !== null) {
    if (proto === Ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}`,
      tests: [
        { name: "direct instance", code: `class A {}\nassert.equal(isInstance(new A(), A), true);` },
        { name: "walks the chain", code: `class A {}\nclass B extends A {}\nassert.equal(isInstance(new B(), A), true);\nassert.equal(isInstance([], Object), true);` },
        { name: "unrelated class", code: `class A {}\nclass B {}\nassert.equal(isInstance(new A(), B), false);` },
        { name: "primitives and null", code: `assert.equal(isInstance(1, Number), false);\nassert.equal(isInstance("s", String), false);\nassert.equal(isInstance(null, Object), false);\nassert.equal(isInstance(undefined, Object), false);` },
        { name: "null-prototype objects", code: `assert.equal(isInstance(Object.create(null), Object), false);` },
        { name: "functions are objects", code: `assert.equal(isInstance(() => {}, Function), true);` },
      ],
      hints: ["`Object.getPrototypeOf` until you hit `null`."],
    },
    {
      slug: "class-expression",
      title: "Class expression",
      kind: "implement",
      difficulty: 2,
      tags: ["classes", "higher-order"],
      description: `Write \`defineRecord(...fields)\` that returns a new class (a class expression). Its constructor takes one value per field, in order, and assigns each to the matching property. Every call returns a distinct class.

Example: \`const Point = defineRecord("x", "y"); new Point(1, 2).y\` → \`2\``,
      starter: `function defineRecord(...fields) {\n  \n}`,
      solution: `function defineRecord(...fields) {
  return class {
    constructor(...values) {
      fields.forEach((field, i) => {
        this[field] = values[i];
      });
    }
  };
}`,
      tests: [
        { name: "assigns fields in order", code: `const Point = defineRecord("x", "y");\nconst p = new Point(1, 2);\nassert.equal(p.x, 1);\nassert.equal(p.y, 2);` },
        { name: "instanceof works", code: `const Point = defineRecord("x", "y");\nassert.ok(new Point(0, 0) instanceof Point);` },
        { name: "returns a class", code: `const R = defineRecord("a");\nassert.throws(() => R(1), TypeError);` },
        { name: "each call returns a distinct class", code: `assert.notEqual(defineRecord("a"), defineRecord("a"));` },
        { name: "missing values are undefined", code: `const R = defineRecord("a", "b");\nconst r = new R(1);\nassert.deepEqual(Object.keys(r), ["a", "b"]);\nassert.equal(r.b, undefined);` },
      ],
    },
    {
      slug: "tostring",
      title: "toString override",
      kind: "complete",
      difficulty: 1,
      tags: ["classes", "coercion"],
      description: `Override \`toString()\` on \`Money\` so it returns the amount with two decimals followed by the currency. It should work with \`String(money)\` and template literals.

Example: \`String(new Money(12.5, "EUR"))\` → \`"12.50 EUR"\``,
      starter: `class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  // your code here
}`,
      solution: `class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  toString() {
    return \`\${this.amount.toFixed(2)} \${this.currency}\`;
  }
}`,
      tests: [
        { name: "toString formats two decimals", code: `assert.equal(new Money(12.5, "EUR").toString(), "12.50 EUR");` },
        { name: "works with String()", code: `assert.equal(String(new Money(3, "USD")), "3.00 USD");` },
        { name: "works in template literals", code: `assert.equal(\`Total: \${new Money(0.1, "GBP")}\`, "Total: 0.10 GBP");` },
      ],
    },
    {
      slug: "field-defaults",
      title: "Class fields with defaults",
      kind: "implement",
      difficulty: 2,
      tags: ["classes"],
      description: `Write \`Settings\` using public class fields with defaults \`theme = "light"\`, \`fontSize = 14\` and \`tags = []\`. The constructor takes an optional overrides object and applies it on top of the defaults. Each instance gets its own \`tags\` array.

Example: \`new Settings({ fontSize: 16 }).theme\` → \`"light"\``,
      starter: `class Settings {
  constructor(overrides) {
    Object.assign(this, overrides);
  }
}`,
      solution: `class Settings {
  theme = "light";
  fontSize = 14;
  tags = [];

  constructor(overrides = {}) {
    Object.assign(this, overrides);
  }
}`,
      tests: [
        { name: "defaults", code: `const s = new Settings();\nassert.equal(s.theme, "light");\nassert.equal(s.fontSize, 14);\nassert.deepEqual(s.tags, []);` },
        { name: "applies overrides", code: `const s = new Settings({ fontSize: 16, theme: "dark" });\nassert.equal(s.fontSize, 16);\nassert.equal(s.theme, "dark");` },
        { name: "tags are not shared", code: `const a = new Settings();\nconst b = new Settings();\na.tags.push("x");\nassert.deepEqual(b.tags, []);` },
        { name: "fields are own properties", code: `assert.deepEqual(Object.keys(new Settings()), ["theme", "fontSize", "tags"]);` },
      ],
    },
    {
      slug: "chaining",
      title: "Method chaining (return this)",
      kind: "implement",
      difficulty: 2,
      tags: ["classes", "this"],
      description: `Write a \`QueryBuilder\` with chainable \`select(...fields)\`, \`from(table)\` and \`where(condition)\`, plus \`build()\` returning the SQL string. \`where\` is optional; calling it more than once joins conditions with \`AND\`.

Example: \`new QueryBuilder().select("id", "name").from("users").where("age > 18").build()\` → \`"SELECT id, name FROM users WHERE age > 18"\``,
      starter: `class QueryBuilder {
  select(...fields) {}
  from(table) {}
  where(condition) {}
  build() {}
}`,
      solution: `class QueryBuilder {
  #fields = [];
  #table = "";
  #conditions = [];

  select(...fields) {
    this.#fields.push(...fields);
    return this;
  }

  from(table) {
    this.#table = table;
    return this;
  }

  where(condition) {
    this.#conditions.push(condition);
    return this;
  }

  build() {
    const sql = \`SELECT \${this.#fields.join(", ")} FROM \${this.#table}\`;
    return this.#conditions.length ? \`\${sql} WHERE \${this.#conditions.join(" AND ")}\` : sql;
  }
}`,
      tests: [
        { name: "builds a full query", code: `assert.equal(new QueryBuilder().select("id", "name").from("users").where("age > 18").build(), "SELECT id, name FROM users WHERE age > 18");` },
        { name: "where is optional", code: `assert.equal(new QueryBuilder().select("*").from("t").build(), "SELECT * FROM t");` },
        { name: "multiple where calls join with AND", code: `assert.equal(new QueryBuilder().select("id").from("t").where("a = 1").where("b = 2").build(), "SELECT id FROM t WHERE a = 1 AND b = 2");` },
        { name: "methods return the same instance", code: `const q = new QueryBuilder();\nassert.equal(q.select("a"), q);\nassert.equal(q.from("t"), q);\nassert.equal(q.where("x"), q);` },
      ],
    },
    {
      slug: "iterable-class",
      title: "Symbol.iterator on a class",
      kind: "implement",
      difficulty: 2,
      tags: ["classes", "iteration"],
      description: `Write \`Range(start, end, step = 1)\` that is iterable with \`for...of\` and spread, yielding numbers from \`start\` up to but excluding \`end\`. A range can be iterated more than once.

Example: \`[...new Range(1, 5)]\` → \`[1, 2, 3, 4]\``,
      starter: `class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }
}`,
      solution: `class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  *[Symbol.iterator]() {
    for (let n = this.start; n < this.end; n += this.step) {
      yield n;
    }
  }
}`,
      tests: [
        { name: "spreads into an array", code: `assert.deepEqual([...new Range(1, 5)], [1, 2, 3, 4]);` },
        { name: "respects step", code: `assert.deepEqual([...new Range(0, 10, 3)], [0, 3, 6, 9]);` },
        { name: "empty when start >= end", code: `assert.deepEqual([...new Range(5, 5)], []);` },
        { name: "can be iterated twice", code: `const r = new Range(0, 3);\nassert.deepEqual([...r], [0, 1, 2]);\nassert.deepEqual([...r], [0, 1, 2]);` },
        { name: "works with for...of", code: `let sum = 0;\nfor (const n of new Range(1, 4)) sum += n;\nassert.equal(sum, 6);` },
      ],
    },
    {
      slug: "abstract-base",
      title: "Abstract-style base class",
      kind: "implement",
      difficulty: 2,
      tags: ["classes"],
      description: `Write a base class \`Shape\` that cannot be instantiated directly (\`new Shape()\` throws a \`TypeError\`) but can be subclassed. It has:

- \`area()\` that throws an \`Error\` with message \`"not implemented"\` unless a subclass overrides it
- \`describe()\` returning \`"<ClassName> with area <area>"\`

Example: \`new Square(2).describe()\` → \`"Square with area 4"\``,
      starter: `class Shape {\n  \n}`,
      solution: `class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new TypeError("Shape is abstract");
    }
  }

  area() {
    throw new Error("not implemented");
  }

  describe() {
    return \`\${this.constructor.name} with area \${this.area()}\`;
  }
}`,
      tests: [
        { name: "cannot instantiate Shape", code: `assert.throws(() => new Shape(), TypeError);` },
        {
          name: "subclasses work",
          code: `class Square extends Shape {\n  constructor(side) { super(); this.side = side; }\n  area() { return this.side ** 2; }\n}\nassert.equal(new Square(2).describe(), "Square with area 4");`,
        },
        { name: "missing area throws", code: `class Blob extends Shape {}\nassert.throws(() => new Blob().describe(), "not implemented");` },
      ],
      hints: ["`new.target` tells the constructor which class `new` was called on."],
    },
    {
      slug: "mixin",
      title: "Mixin via a function",
      kind: "implement",
      difficulty: 2,
      tags: ["classes", "higher-order"],
      description: `Write \`Serializable(Base)\`, a mixin that returns a subclass of \`Base\` adding \`serialize()\`, which returns the instance's own enumerable properties as a JSON string. Instances keep everything from \`Base\`.

Example: \`new (Serializable(User))("Ada").serialize()\` → \`'{"name":"Ada"}'\``,
      starter: `function Serializable(Base) {\n  \n}`,
      solution: `function Serializable(Base) {
  return class extends Base {
    serialize() {
      return JSON.stringify({ ...this });
    }
  };
}`,
      tests: [
        {
          name: "adds serialize",
          code: `class User { constructor(name) { this.name = name; } }\nconst SUser = Serializable(User);\nassert.equal(new SUser("Ada").serialize(), '{"name":"Ada"}');`,
        },
        {
          name: "keeps the base class",
          code: `class User { constructor(name) { this.name = name; } greet() { return "hi " + this.name; } }\nconst u = new (Serializable(User))("Ada");\nassert.ok(u instanceof User);\nassert.equal(u.greet(), "hi Ada");`,
        },
        { name: "does not modify Base", code: `class Plain {}\nSerializable(Plain);\nassert.equal(Plain.prototype.serialize, undefined);` },
      ],
    },
    {
      slug: "static-factory",
      title: "Static factory method",
      kind: "complete",
      difficulty: 2,
      tags: ["classes"],
      description: `Add a static \`fromHex(hex)\` factory to \`Color\` that parses \`"#rrggbb"\` or shorthand \`"#rgb"\` (case-insensitive) and returns an instance. Throw a \`TypeError\` for anything else. Called on a subclass, it should return an instance of that subclass.

Example: \`Color.fromHex("#ff8800")\` → \`Color { r: 255, g: 136, b: 0 }\``,
      starter: `class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  // your code here
}`,
      solution: `class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static fromHex(hex) {
    const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
    if (!match) throw new TypeError(\`Invalid hex color: \${hex}\`);
    let digits = match[1];
    if (digits.length === 3) digits = [...digits].map((d) => d + d).join("");
    const [r, g, b] = digits.match(/../g).map((pair) => parseInt(pair, 16));
    return new this(r, g, b);
  }
}`,
      tests: [
        { name: "parses #rrggbb", code: `const c = Color.fromHex("#ff8800");\nassert.ok(c instanceof Color);\nassert.deepEqual([c.r, c.g, c.b], [255, 136, 0]);` },
        { name: "parses shorthand and uppercase", code: `const c = Color.fromHex("#0AF");\nassert.deepEqual([c.r, c.g, c.b], [0, 170, 255]);` },
        { name: "rejects invalid input", code: `assert.throws(() => Color.fromHex("ff8800"), TypeError);\nassert.throws(() => Color.fromHex("#12345"), TypeError);\nassert.throws(() => Color.fromHex("#gggggg"), TypeError);` },
        { name: "respects subclasses", code: `class Paint extends Color {}\nassert.ok(Paint.fromHex("#000") instanceof Paint);` },
      ],
      hints: ["Inside a static method, `this` is the class it was called on."],
    },
    {
      slug: "value-equals",
      title: "Value object equals()",
      kind: "implement",
      difficulty: 2,
      tags: ["classes", "immutability"],
      description: `Write an immutable value object \`Money(amount, currency)\`: instances are frozen, and \`equals(other)\` returns \`true\` only when \`other\` is also a \`Money\` with the same \`amount\` and \`currency\`. A plain object with the same fields is not equal, and \`equals(null)\` is \`false\`.

Example: \`new Money(5, "EUR").equals(new Money(5, "EUR"))\` → \`true\``,
      starter: `class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  equals(other) {
    return this === other;
  }
}`,
      solution: `class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
    Object.freeze(this);
  }

  equals(other) {
    return (
      other instanceof Money &&
      other.amount === this.amount &&
      other.currency === this.currency
    );
  }
}`,
      tests: [
        { name: "equal values are equal", code: `assert.equal(new Money(5, "EUR").equals(new Money(5, "EUR")), true);` },
        { name: "different amount or currency", code: `assert.equal(new Money(5, "EUR").equals(new Money(6, "EUR")), false);\nassert.equal(new Money(5, "EUR").equals(new Money(5, "USD")), false);` },
        { name: "plain objects and null are not equal", code: `const m = new Money(5, "EUR");\nassert.equal(m.equals({ amount: 5, currency: "EUR" }), false);\nassert.equal(m.equals(null), false);` },
        { name: "instances are frozen", code: `const m = new Money(5, "EUR");\nassert.ok(Object.isFrozen(m));\nassert.throws(() => { m.amount = 10; }, TypeError);` },
      ],
    },
  ],
};

export default topic;

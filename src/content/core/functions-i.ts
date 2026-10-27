import type { Topic } from "../types";

const topic: Topic = {
  course: "core",
  slug: "functions-i",
  title: "Functions I",
  description: "Declarations, parameters, return values, guard clauses and default parameters.",
  tags: ["functions", "parameters", "defaults"],
  count: 23,
  challenges: [
    {
      slug: "declare-a-function",
      title: "Declare a function",
      kind: "implement",
      difficulty: 1,
      tags: ["functions"],
      description: `Declare a function named \`greet\` that takes no arguments and returns the string \`"Hello"\`.

Example: \`greet()\` → \`"Hello"\``,
      starter: `// declare greet here\n`,
      solution: `function greet() {\n  return "Hello";\n}`,
      tests: [
        { name: "greet is a function", code: `assert.isFunction(greet);` },
        { name: 'returns "Hello"', code: `assert.equal(greet(), "Hello");` },
      ],
    },
    {
      slug: "call-and-capture",
      title: "Call a function and capture its return value",
      kind: "complete",
      difficulty: 1,
      tags: ["functions"],
      description: `Call \`square\` with \`7\` and store the return value in a \`const\` named \`result\`.

Example: \`square(3)\` → \`9\``,
      starter: `function square(n) {\n  return n * n;\n}\n\n// your code here\n`,
      solution: `function square(n) {\n  return n * n;\n}\n\nconst result = square(7);`,
      tests: [
        { name: "result holds square(7)", code: `assert.equal(result, 49);` },
        { name: "square still works", code: `assert.equal(square(4), 16);` },
      ],
    },
    {
      slug: "return-dont-log",
      title: "Return a value instead of logging it",
      kind: "fix",
      difficulty: 1,
      tags: ["functions"],
      description: `\`fullName\` prints the name but its callers get \`undefined\`. Make it return the string instead, and log nothing.

Example: \`fullName("Ada", "Lovelace")\` → \`"Ada Lovelace"\``,
      starter: `function fullName(first, last) {\n  console.log(\`\${first} \${last}\`);\n}`,
      solution: `function fullName(first, last) {\n  return \`\${first} \${last}\`;\n}`,
      tests: [
        { name: "returns the full name", code: `assert.equal(fullName("Ada", "Lovelace"), "Ada Lovelace");` },
        { name: "does not log", code: `clearLogs();\nfullName("Grace", "Hopper");\nassert.deepEqual(logs, []);` },
      ],
    },
    {
      slug: "missing-function-keyword",
      title: "Add the missing function keyword",
      kind: "fix",
      difficulty: 1,
      tags: ["functions"],
      description: `This declaration does not parse. Fix it so \`double(n)\` returns twice its argument.

Example: \`double(4)\` → \`8\``,
      starter: `double(n) {\n  return n * 2;\n}`,
      solution: `function double(n) {\n  return n * 2;\n}`,
      tests: [
        { name: "doubles 4", code: `assert.equal(double(4), 8);` },
        { name: "doubles a negative number", code: `assert.equal(double(-3), -6);` },
      ],
    },
    {
      slug: "missing-function-name",
      title: "Add the missing function name",
      kind: "fix",
      difficulty: 1,
      tags: ["functions"],
      description: `This code does not parse. Fix it so a function named \`add\` returns the sum of its two arguments.

Example: \`add(2, 3)\` → \`5\``,
      starter: `function (a, b) {\n  return a + b;\n}`,
      solution: `function add(a, b) {\n  return a + b;\n}`,
      tests: [
        { name: "add is a function", code: `assert.isFunction(add);` },
        { name: "adds two numbers", code: `assert.equal(add(2, 3), 5);` },
        { name: "handles negatives", code: `assert.equal(add(-2, -8), -10);` },
      ],
    },
    {
      slug: "return-the-right-value",
      title: "Return the right value",
      kind: "fix",
      difficulty: 1,
      tags: ["functions"],
      description: `\`toFahrenheit(celsius)\` should convert Celsius to Fahrenheit (\`c * 9 / 5 + 32\`), but it returns the wrong value. Fix it.

Example: \`toFahrenheit(100)\` → \`212\``,
      starter: `function toFahrenheit(celsius) {\n  return celsius;\n  const fahrenheit = (celsius * 9) / 5 + 32;\n  return fahrenheit;\n}`,
      solution: `function toFahrenheit(celsius) {\n  return (celsius * 9) / 5 + 32;\n}`,
      tests: [
        { name: "converts 0 to 32", code: `assert.equal(toFahrenheit(0), 32);` },
        { name: "converts 100 to 212", code: `assert.equal(toFahrenheit(100), 212);` },
        { name: "converts -40 to -40", code: `assert.equal(toFahrenheit(-40), -40);` },
      ],
    },
    {
      slug: "complete-the-body",
      title: "Complete the function body",
      kind: "complete",
      difficulty: 1,
      tags: ["functions"],
      description: `Complete \`area(width, height)\` so it returns the area of a rectangle.

Example: \`area(3, 4)\` → \`12\``,
      starter: `function area(width, height) {\n  // your code here\n}`,
      solution: `function area(width, height) {\n  return width * height;\n}`,
      tests: [
        { name: "returns 12 for 3 x 4", code: `assert.equal(area(3, 4), 12);` },
        { name: "returns 0 when a side is 0", code: `assert.equal(area(0, 5), 0);` },
      ],
    },
    {
      slug: "two-parameters",
      title: "A function with two parameters",
      kind: "implement",
      difficulty: 1,
      tags: ["functions"],
      description: `Write \`average(a, b)\` that returns the mean of two numbers.

Example: \`average(2, 5)\` → \`3.5\``,
      starter: `function average() {\n  \n}`,
      solution: `function average(a, b) {\n  return (a + b) / 2;\n}`,
      tests: [
        { name: "averages 2 and 5", code: `assert.equal(average(2, 5), 3.5);` },
        { name: "averages equal numbers", code: `assert.equal(average(7, 7), 7);` },
        { name: "handles negatives", code: `assert.equal(average(-4, 2), -1);` },
      ],
    },
    {
      slug: "missing-parameters",
      title: "Add the missing parameters",
      kind: "fix",
      difficulty: 1,
      tags: ["functions"],
      description: `Calling \`multiply\` throws a \`ReferenceError\`. Fix it so it returns the product of its two arguments.

Example: \`multiply(3, 4)\` → \`12\``,
      starter: `function multiply() {\n  return a * b;\n}`,
      solution: `function multiply(a, b) {\n  return a * b;\n}`,
      tests: [
        { name: "multiplies 3 and 4", code: `assert.equal(multiply(3, 4), 12);` },
        { name: "multiplies by zero", code: `assert.equal(multiply(9, 0), 0);` },
      ],
    },
    {
      slug: "subtract-parameter-order",
      title: "Find the bug: parameter order in subtract",
      kind: "fix",
      difficulty: 1,
      tags: ["functions"],
      description: `\`subtract(a, b)\` should return \`a - b\`, but the sign comes out wrong. Fix it.

Example: \`subtract(10, 3)\` → \`7\``,
      starter: `function subtract(b, a) {\n  return a - b;\n}`,
      solution: `function subtract(a, b) {\n  return a - b;\n}`,
      tests: [
        { name: "10 - 3 is 7", code: `assert.equal(subtract(10, 3), 7);` },
        { name: "3 - 10 is -7", code: `assert.equal(subtract(3, 10), -7);` },
        { name: "5 - 5 is 0", code: `assert.equal(subtract(5, 5), 0);` },
      ],
    },
    {
      slug: "complete-greet",
      title: "Complete the greet function",
      kind: "complete",
      difficulty: 1,
      tags: ["functions"],
      description: `Complete \`greet(name)\` so it returns \`"Hello, <name>!"\`.

Example: \`greet("Ada")\` → \`"Hello, Ada!"\``,
      starter: `function greet(name) {\n  // your code here\n}`,
      solution: `function greet(name) {\n  return \`Hello, \${name}!\`;\n}`,
      tests: [
        { name: 'greets "Ada"', code: `assert.equal(greet("Ada"), "Hello, Ada!");` },
        { name: 'greets "Linus"', code: `assert.equal(greet("Linus"), "Hello, Linus!");` },
      ],
    },
    {
      slug: "function-as-argument",
      title: "Pass a function as an argument",
      kind: "implement",
      difficulty: 1,
      tags: ["functions", "higher-order"],
      description: `Write \`applyTwice(fn, value)\` that calls \`fn\` on \`value\`, then calls \`fn\` again on that result, and returns the final value. \`fn\` must be called exactly twice.

Example: \`applyTwice((n) => n * 3, 2)\` → \`18\``,
      starter: `function applyTwice(fn, value) {\n  \n}`,
      solution: `function applyTwice(fn, value) {\n  return fn(fn(value));\n}`,
      tests: [
        { name: "triples twice", code: `assert.equal(applyTwice((n) => n * 3, 2), 18);` },
        { name: "works with strings", code: `assert.equal(applyTwice((s) => s + "!", "hi"), "hi!!");` },
        { name: "calls fn exactly twice", code: `let calls = 0;\napplyTwice((n) => { calls++; return n; }, 1);\nassert.equal(calls, 2);` },
      ],
    },
    {
      slug: "return-a-function",
      title: "Return a function from a function",
      kind: "implement",
      difficulty: 2,
      tags: ["functions", "closures", "higher-order"],
      description: `Write \`makeAdder(n)\` that returns a function. The returned function takes \`x\` and returns \`x + n\`. Each adder keeps its own \`n\`.

Example: \`makeAdder(5)(10)\` → \`15\``,
      starter: `function makeAdder(n) {\n  \n}`,
      solution: `function makeAdder(n) {\n  return (x) => x + n;\n}`,
      tests: [
        { name: "returns a function", code: `assert.isFunction(makeAdder(1));` },
        { name: "adds n", code: `assert.equal(makeAdder(5)(10), 15);` },
        { name: "adders are independent", code: `const add1 = makeAdder(1);\nconst add10 = makeAdder(10);\nassert.equal(add1(1), 2);\nassert.equal(add10(1), 11);` },
      ],
    },
    {
      slug: "return-early",
      title: "Return early with a guard clause",
      kind: "implement",
      difficulty: 1,
      tags: ["functions"],
      description: `Write \`safeDivide(a, b)\` that returns \`null\` when \`b\` is \`0\` and \`a / b\` otherwise. Handle the zero case with a guard clause at the top.

Example: \`safeDivide(10, 0)\` → \`null\``,
      starter: `function safeDivide(a, b) {\n  \n}`,
      solution: `function safeDivide(a, b) {\n  if (b === 0) return null;\n  return a / b;\n}`,
      tests: [
        { name: "divides normally", code: `assert.equal(safeDivide(10, 4), 2.5);` },
        { name: "returns null for division by zero", code: `assert.equal(safeDivide(10, 0), null);` },
        { name: "0 divided by a number is 0", code: `assert.equal(safeDivide(0, 5), 0);` },
      ],
    },
    {
      slug: "is-adult",
      title: "isAdult",
      kind: "implement",
      difficulty: 1,
      tags: ["functions"],
      description: `Write \`isAdult(age)\` that returns \`true\` for ages 18 and over, \`false\` otherwise. Return a boolean, not a truthy value.

Example: \`isAdult(18)\` → \`true\``,
      starter: `function isAdult(age) {\n  \n}`,
      solution: `function isAdult(age) {\n  return age >= 18;\n}`,
      tests: [
        { name: "18 is an adult", code: `assert.equal(isAdult(18), true);` },
        { name: "17 is not", code: `assert.equal(isAdult(17), false);` },
        { name: "40 is an adult", code: `assert.equal(isAdult(40), true);` },
      ],
    },
    {
      slug: "is-empty-string",
      title: "isEmptyString",
      kind: "implement",
      difficulty: 1,
      tags: ["functions"],
      description: `Write \`isEmptyString(str)\` that returns \`true\` when \`str\` is empty or contains only whitespace (spaces, tabs, newlines).

Example: \`isEmptyString("   ")\` → \`true\``,
      starter: `function isEmptyString(str) {\n  \n}`,
      solution: `function isEmptyString(str) {\n  return str.trim() === "";\n}`,
      tests: [
        { name: "empty string is empty", code: `assert.equal(isEmptyString(""), true);` },
        { name: "spaces only is empty", code: `assert.equal(isEmptyString("   "), true);` },
        { name: "tabs and newlines are empty", code: `assert.equal(isEmptyString("\\t\\n "), true);` },
        { name: "text is not empty", code: `assert.equal(isEmptyString(" a "), false);` },
      ],
    },
    {
      slug: "is-weekend",
      title: "isWeekend",
      kind: "implement",
      difficulty: 1,
      tags: ["functions"],
      description: `Write \`isWeekend(day)\` that takes a day name and returns \`true\` for Saturday and Sunday. Matching is case-insensitive.

Example: \`isWeekend("sunday")\` → \`true\``,
      starter: `function isWeekend(day) {\n  \n}`,
      solution: `function isWeekend(day) {\n  const name = day.toLowerCase();\n  return name === "saturday" || name === "sunday";\n}`,
      tests: [
        { name: "Saturday is weekend", code: `assert.equal(isWeekend("Saturday"), true);` },
        { name: "lowercase sunday is weekend", code: `assert.equal(isWeekend("sunday"), true);` },
        { name: "Monday is not", code: `assert.equal(isWeekend("Monday"), false);` },
        { name: "FRIDAY is not", code: `assert.equal(isWeekend("FRIDAY"), false);` },
      ],
    },
    {
      slug: "refactor-discount",
      title: "Refactor repeated discount calculations into a function",
      kind: "implement",
      difficulty: 1,
      tags: ["functions"],
      description: `Extract the repeated calculation into \`applyDiscount(price, rate)\` (rate is a fraction, \`0.2\` = 20% off) and use it for \`shirt\`, \`shoes\` and \`hat\`.

Example: \`applyDiscount(100, 0.25)\` → \`75\``,
      starter: `const shirt = 40 - 40 * 0.2;\nconst shoes = 90 - 90 * 0.2;\nconst hat = 25 - 25 * 0.2;`,
      solution: `function applyDiscount(price, rate) {\n  return price - price * rate;\n}\n\nconst shirt = applyDiscount(40, 0.2);\nconst shoes = applyDiscount(90, 0.2);\nconst hat = applyDiscount(25, 0.2);`,
      tests: [
        { name: "applyDiscount(100, 0.25) is 75", code: `assert.closeTo(applyDiscount(100, 0.25), 75, 1e-9);` },
        { name: "a zero rate keeps the price", code: `assert.equal(applyDiscount(50, 0), 50);` },
        { name: "shirt, shoes and hat keep their values", code: `assert.closeTo(shirt, 32, 1e-9);\nassert.closeTo(shoes, 72, 1e-9);\nassert.closeTo(hat, 20, 1e-9);` },
      ],
    },
    {
      slug: "refactor-math",
      title: "Refactor duplicated math into a function",
      kind: "implement",
      difficulty: 1,
      tags: ["functions"],
      description: `Extract the duplicated formula into \`distance(x1, y1, x2, y2)\`, returning the Euclidean distance between two points, and use it for \`d1\` and \`d2\`.

Example: \`distance(0, 0, 3, 4)\` → \`5\``,
      starter: `const d1 = Math.sqrt((4 - 1) ** 2 + (6 - 2) ** 2);\nconst d2 = Math.sqrt((13 - 7) ** 2 + (9 - 1) ** 2);`,
      solution: `function distance(x1, y1, x2, y2) {\n  return Math.hypot(x2 - x1, y2 - y1);\n}\n\nconst d1 = distance(1, 2, 4, 6);\nconst d2 = distance(7, 1, 13, 9);`,
      tests: [
        { name: "distance(0, 0, 3, 4) is 5", code: `assert.closeTo(distance(0, 0, 3, 4), 5, 1e-9);` },
        { name: "order of points does not matter", code: `assert.closeTo(distance(3, 4, 0, 0), 5, 1e-9);` },
        { name: "same point is 0", code: `assert.equal(distance(2, 2, 2, 2), 0);` },
        { name: "d1 and d2 keep their values", code: `assert.closeTo(d1, 5, 1e-9);\nassert.closeTo(d2, 10, 1e-9);` },
      ],
    },
    {
      slug: "default-greeting",
      title: "Default parameter: greeting",
      kind: "implement",
      difficulty: 1,
      tags: ["functions", "defaults"],
      description: `Write \`greet(name)\` that returns \`"Hello, <name>!"\`, defaulting \`name\` to \`"stranger"\` when it is missing or \`undefined\`. An empty string is a real argument and is kept.

Example: \`greet()\` → \`"Hello, stranger!"\``,
      starter: `function greet(name) {\n  return \`Hello, \${name}!\`;\n}`,
      solution: `function greet(name = "stranger") {\n  return \`Hello, \${name}!\`;\n}`,
      tests: [
        { name: "uses the given name", code: `assert.equal(greet("Ada"), "Hello, Ada!");` },
        { name: "defaults when called with no argument", code: `assert.equal(greet(), "Hello, stranger!");` },
        { name: "defaults for undefined", code: `assert.equal(greet(undefined), "Hello, stranger!");` },
        { name: "keeps an empty string", code: `assert.equal(greet(""), "Hello, !");` },
      ],
    },
    {
      slug: "default-multiplier",
      title: "Default parameter: multiplier",
      kind: "implement",
      difficulty: 1,
      tags: ["functions", "defaults"],
      description: `Write \`multiply(n, multiplier)\` where \`multiplier\` defaults to \`2\`. A multiplier of \`0\` must be respected.

Example: \`multiply(5)\` → \`10\``,
      starter: `function multiply(n, multiplier) {\n  return n * multiplier;\n}`,
      solution: `function multiply(n, multiplier = 2) {\n  return n * multiplier;\n}`,
      tests: [
        { name: "doubles by default", code: `assert.equal(multiply(5), 10);` },
        { name: "uses the given multiplier", code: `assert.equal(multiply(5, 3), 15);` },
        { name: "respects a multiplier of 0", code: `assert.equal(multiply(5, 0), 0);` },
      ],
    },
    {
      slug: "default-alongside-required",
      title: "Default parameter alongside a required one",
      kind: "fix",
      difficulty: 2,
      tags: ["functions", "defaults"],
      description: `\`createUser(name, role)\` should return \`{ name, role }\` with \`role\` defaulting to \`"viewer"\`. It returns the wrong object. Fix it.

Example: \`createUser("Ada")\` → \`{ name: "Ada", role: "viewer" }\``,
      starter: `function createUser(role = "viewer", name) {\n  return { name, role };\n}`,
      solution: `function createUser(name, role = "viewer") {\n  return { name, role };\n}`,
      hints: ["Arguments bind to parameters by position, defaults or not."],
      tests: [
        { name: "defaults the role", code: `assert.deepEqual(createUser("Ada"), { name: "Ada", role: "viewer" });` },
        { name: "uses the given role", code: `assert.deepEqual(createUser("Grace", "admin"), { name: "Grace", role: "admin" });` },
      ],
    },
    {
      slug: "default-depends-on-earlier",
      title: "Default parameter that depends on an earlier parameter",
      kind: "implement",
      difficulty: 2,
      tags: ["functions", "defaults"],
      description: `Write \`rectangle(width, height)\` that returns \`{ width, height, area }\`. When \`height\` is omitted it defaults to \`width\` (a square). Use a default parameter, not a check in the body.

Example: \`rectangle(4)\` → \`{ width: 4, height: 4, area: 16 }\``,
      starter: `function rectangle(width, height) {\n  return { width, height, area: width * height };\n}`,
      solution: `function rectangle(width, height = width) {\n  return { width, height, area: width * height };\n}`,
      tests: [
        { name: "defaults height to width", code: `assert.deepEqual(rectangle(4), { width: 4, height: 4, area: 16 });` },
        { name: "uses the given height", code: `assert.deepEqual(rectangle(4, 2), { width: 4, height: 2, area: 8 });` },
        { name: "undefined height also defaults", code: `assert.deepEqual(rectangle(3, undefined), { width: 3, height: 3, area: 9 });` },
        { name: "uses a default parameter (rectangle.length is 1)", code: `assert.equal(rectangle.length, 1);` },
      ],
    },
  ],
};

export default topic;

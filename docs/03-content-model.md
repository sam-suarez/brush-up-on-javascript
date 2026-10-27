# 03 — Content model

## Types (`src/content/types.ts`)

```ts
export type CourseSlug = "core" | "intermediate" | "dom" | "practice" | "interview";

export interface Course {
  slug: CourseSlug;
  title: string;            // "JavaScript Core"
  tagline: string[];        // chips under the title, like JSChallenger
  description: string;
  color: string;            // sidebar icon accent
  topics: TopicMeta[];
}

export interface TopicMeta {
  slug: string;             // "array-methods"
  title: string;            // "Array Methods"
  description: string;      // one or two sentences
  tags: string[];           // chips under the title
  count: number;            // number of challenges, kept in sync by tests/content.test.ts
}

export interface Topic extends TopicMeta {
  course: CourseSlug;
  challenges: Challenge[];
}

export type Difficulty = 1 | 2 | 3;      // 1 refresher · 2 solid · 3 interview-hard
export type ChallengeKind = "implement" | "fix" | "complete" | "predict";

export interface TestCase {
  name: string;             // shown in the results panel, e.g. "returns 6 for [1,2,3]"
  code: string;             // JS executed after the user's code, same scope; throws on failure
}

export interface Challenge {
  slug: string;             // "reduce-sum"
  title: string;
  kind: ChallengeKind;
  difficulty: Difficulty;
  tags: string[];
  description: string;      // markdown
  starter: string;          // what the editor shows initially
  solution: string;         // the author's solution, revealed after solving
  tests: TestCase[];        // at least 2; at least one must fail against `starter`
  hints?: string[];         // revealed one at a time
  html?: string;            // DOM challenges only: body markup injected into the sandbox
  timeoutMs?: number;       // default 3000; async challenges may raise it
}
```

Challenge ids are derived, never stored: `${course}/${topic}/${slug}`.

## Challenge kinds

| Kind | What the user does | Starter |
| --- | --- | --- |
| `implement` | Write a function or value from a spec | A signature stub, often `function name() {}` |
| `fix` | Code is given but broken; find and fix it | The broken code |
| `complete` | Fill in a marked gap | Code with a `// your code here` gap |
| `predict` | Code is given; the user writes the expected console output as an array of strings assigned to `expected` | The code to read plus `const expected = [];` |

`predict` exists for event-loop and coercion material where reading code is the skill. Its tests compare `expected` against the real captured logs.

## Test harness API (what `TestCase.code` can use)

Tests run in the same scope as the user's code, after it, inside an async function. They can `await`.

```ts
assert.ok(value, msg?)
assert.equal(actual, expected, msg?)          // Object.is
assert.notEqual(actual, expected, msg?)
assert.deepEqual(actual, expected, msg?)      // structural, handles arrays, plain objects, Map, Set, Date, NaN
assert.throws(fn, matcher?, msg?)             // matcher: RegExp | string | ErrorConstructor
await assert.rejects(promiseOrFn, matcher?, msg?)
assert.type(value, "string" | "number" | ...)
assert.isFunction(value)
assert.closeTo(actual, expected, delta)

logs            // string[]: every console.log/info/warn/error call so far, joined with spaces, formatted like Node
clearLogs()
tick()          // await: flushes microtasks and one macrotask (setTimeout 0)
wait(ms)        // await: real delay, capped at the challenge timeout
```

Failures throw an `AssertionError` with `actual`/`expected`; the results panel shows the message and a diff when both are present.

Tests must not reference harness internals (`__brush`). Tests must not depend on each other's side effects; each test should set up what it needs or read values the user code defines.

## Authoring rules

1. Description: 1 to 4 short paragraphs of markdown. State the task first. Use inline code for identifiers. Give one example input and output. Mention edge cases the tests check. No teaching paragraphs. A single "Refresher:" line is allowed for things like `Object.is` semantics.
2. Starter must be syntactically valid unless the challenge is about a syntax mistake (`fix`), in which case the description says so.
3. Every challenge has at least 2 tests, usually 3 to 6. Test names read like requirements: "handles an empty array".
4. The solution is idiomatic modern JavaScript (ES2023), the way a senior engineer would write it in a code review, not the shortest possible.
5. Solutions never rely on console output unless the challenge is explicitly about logging.
6. `fix` challenges have exactly one intended bug (or one bug class). The description does not reveal the line.
7. Tags are lowercase, from a shared vocabulary (`closures`, `this`, `prototype`, `async`, `recursion`, `immutability`, `higher-order`, `destructuring`, `regex`, `dom`, `event-loop`, `iteration`, `coercion`).
8. Difficulty: 1 if a competent dev solves it in under a minute, 2 if it needs thought, 3 if it is a known interview question or has a subtle trap.
9. DOM challenges set `html` and tests query `document`. User code may use any DOM API. No frameworks.
10. `predict` challenges: `starter` contains the code to read followed by `const expected = [];`. The single test awaits `tick()` enough times, then `assert.deepEqual(expected, logs)`.
11. No network, no `fetch`, no `localStorage` in any challenge.
12. Keep all code in a challenge under 40 lines. Longer means the challenge should be split.

## File shape (`src/content/intermediate/array-methods.ts`)

```ts
import type { Topic } from "../types";

const topic: Topic = {
  course: "intermediate",
  slug: "array-methods",
  title: "Array Methods",
  description: "...",
  tags: ["map", "filter", "reduce", "sort"],
  count: 33,
  challenges: [
    {
      slug: "map-double",
      title: "map: double every number",
      kind: "implement",
      difficulty: 1,
      tags: ["higher-order"],
      description: `Write \`doubleAll(numbers)\` that returns a new array with every number doubled. Do not mutate the input.

Example: \`doubleAll([1, 2, 3])\` → \`[2, 4, 6]\``,
      starter: `function doubleAll(numbers) {\n  \n}`,
      solution: `function doubleAll(numbers) {\n  return numbers.map((n) => n * 2);\n}`,
      tests: [
        { name: "doubles each number", code: `assert.deepEqual(doubleAll([1, 2, 3]), [2, 4, 6]);` },
        { name: "returns a new array", code: `const input = [1]; assert.notEqual(doubleAll(input), input);` },
        { name: "handles an empty array", code: `assert.deepEqual(doubleAll([]), []);` },
      ],
    },
  ],
};

export default topic;
```

## As built

- Extra assertions: `assert.fail(msg)`, `assert.notDeepEqual`, `assert.match(str, regex)`, `assert.includes(arrayOrString, item)`.
- `deepEqual` compares primitives with SameValueZero (`NaN` equals `NaN`, `-0` equals `0`; use `assert.equal` to tell `-0` apart). Objects must share a prototype, except that null-prototype and plain objects are treated as interchangeable. Key sets must match exactly.
- `predict` challenges have exactly one test, and the schema check allows that.
- `TOPIC=core` or `TOPIC=core/loops` in front of `npx vitest run tests/content.test.ts` validates a subset.
- Node and the browser must agree. Tests run in happy-dom under Node and in a real iframe in the app, so DOM listeners go on elements inside `html` (never on `document` or `window`), and tests never depend on `this` inside timer callbacks.

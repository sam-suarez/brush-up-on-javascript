import type { Topic } from "../types";

const PREDICT_TEST = `for (let i = 0; i < 5; i++) await tick();\nassert.deepEqual(expected, logs);`;

const topic: Topic = {
  course: "interview",
  slug: "event-loop",
  title: "Event Loop",
  description: "Sync code, microtasks and macrotasks. Predict the order, then control it.",
  tags: ["event-loop", "predict"],
  count: 8,
  challenges: [
    {
      slug: "sync-micro-macro",
      title: "Sync, microtask, macrotask",
      kind: "predict",
      difficulty: 2,
      tags: ["event-loop"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order.

Refresher: synchronous code runs first, then every queued microtask (promise callbacks), then the next macrotask (\`setTimeout\`).

\`\`\`js
console.log("A"); // → first line is "A"
\`\`\``,
      starter: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");

const expected = [];`,
      solution: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");

const expected = ["A", "D", "C", "B"];`,
      tests: [{ name: "expected matches the real output", code: PREDICT_TEST }],
    },
    {
      slug: "nested-promises",
      title: "Nested promise ordering",
      kind: "predict",
      difficulty: 3,
      tags: ["event-loop", "async"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order.

\`\`\`js
Promise.resolve().then(() => console.log("x")); // → "x", after all sync code
\`\`\``,
      starter: `Promise.resolve()
  .then(() => {
    console.log("1");
    Promise.resolve().then(() => console.log("2"));
  })
  .then(() => console.log("3"));

Promise.resolve()
  .then(() => console.log("4"))
  .then(() => console.log("5"));

const expected = [];`,
      solution: `Promise.resolve()
  .then(() => {
    console.log("1");
    Promise.resolve().then(() => console.log("2"));
  })
  .then(() => console.log("3"));

Promise.resolve()
  .then(() => console.log("4"))
  .then(() => console.log("5"));

const expected = ["1", "4", "2", "3", "5"];`,
      tests: [{ name: "expected matches the real output", code: PREDICT_TEST }],
      hints: ["A `.then` callback is queued only when the promise it hangs off settles. Write the microtask queue down step by step."],
    },
    {
      slug: "timeout-vs-resolve",
      title: "setTimeout 0 vs Promise.resolve",
      kind: "predict",
      difficulty: 2,
      tags: ["event-loop", "async"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order.

\`\`\`js
setTimeout(() => console.log("t"), 0); // → "t", after the microtask queue drains
\`\`\``,
      starter: `setTimeout(() => console.log("timeout 1"), 0);
Promise.resolve().then(() => {
  console.log("promise 1");
  setTimeout(() => console.log("timeout 2"), 0);
});
setTimeout(() => {
  console.log("timeout 3");
  Promise.resolve().then(() => console.log("promise 2"));
}, 0);
console.log("sync");

const expected = [];`,
      solution: `setTimeout(() => console.log("timeout 1"), 0);
Promise.resolve().then(() => {
  console.log("promise 1");
  setTimeout(() => console.log("timeout 2"), 0);
});
setTimeout(() => {
  console.log("timeout 3");
  Promise.resolve().then(() => console.log("promise 2"));
}, 0);
console.log("sync");

const expected = ["sync", "promise 1", "timeout 1", "timeout 3", "promise 2", "timeout 2"];`,
      tests: [{ name: "expected matches the real output", code: PREDICT_TEST }],
    },
    {
      slug: "await-ordering",
      title: "await ordering",
      kind: "predict",
      difficulty: 3,
      tags: ["event-loop", "async"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order.

Refresher: an \`async\` function runs synchronously until its first \`await\`; the rest is resumed from the microtask queue.

\`\`\`js
(async () => { console.log("a"); await null; console.log("b"); })(); console.log("c");
// → "a", "c", "b"
\`\`\``,
      starter: `async function first() {
  console.log("first start");
  await null;
  console.log("first end");
}

async function second() {
  console.log("second start");
  await first();
  console.log("second end");
}

console.log("start");
second();
Promise.resolve().then(() => console.log("then"));
console.log("end");

const expected = [];`,
      solution: `async function first() {
  console.log("first start");
  await null;
  console.log("first end");
}

async function second() {
  console.log("second start");
  await first();
  console.log("second end");
}

console.log("start");
second();
Promise.resolve().then(() => console.log("then"));
console.log("end");

const expected = ["start", "second start", "first start", "end", "first end", "then", "second end"];`,
      tests: [{ name: "expected matches the real output", code: PREDICT_TEST }],
    },
    {
      slug: "queue-microtask",
      title: "queueMicrotask",
      kind: "predict",
      difficulty: 2,
      tags: ["event-loop"],
      description: `Read the code and fill \`expected\` with the lines it logs, in order.

Refresher: \`queueMicrotask(fn)\` puts \`fn\` on the same queue as promise callbacks.

\`\`\`js
queueMicrotask(() => console.log("m")); console.log("s"); // → "s", "m"
\`\`\``,
      starter: `console.log("1");
setTimeout(() => console.log("2"), 0);
queueMicrotask(() => {
  console.log("3");
  queueMicrotask(() => console.log("4"));
});
Promise.resolve().then(() => console.log("5"));
queueMicrotask(() => console.log("6"));
console.log("7");

const expected = [];`,
      solution: `console.log("1");
setTimeout(() => console.log("2"), 0);
queueMicrotask(() => {
  console.log("3");
  queueMicrotask(() => console.log("4"));
});
Promise.resolve().then(() => console.log("5"));
queueMicrotask(() => console.log("6"));
console.log("7");

const expected = ["1", "7", "3", "5", "6", "4", "2"];`,
      tests: [{ name: "expected matches the real output", code: PREDICT_TEST }],
    },
    {
      slug: "starved-timer",
      title: "A starved timer",
      kind: "fix",
      difficulty: 3,
      tags: ["event-loop", "async"],
      description: `\`processInChunks(items, size, onChunk)\` calls \`onChunk\` with consecutive slices of \`items\` and resolves once every chunk is handled. It is meant to stay responsive: a timer that is already queued when processing starts should get to run between chunks. Right now such a timer only runs after everything has finished. Fix it.

Keep the rest of the behaviour: the first chunk is handled synchronously, chunks are handled in order, and the promise resolves after the last one.

Example: \`setTimeout(() => log("timer")); processInChunks([1, 2, 3, 4], 2, (c) => log(c.join("")))\` → logs \`"12", "timer", "34"\``,
      starter: `function processInChunks(items, size, onChunk) {
  return new Promise((resolve) => {
    let index = 0;
    function next() {
      onChunk(items.slice(index, index + size));
      index += size;
      if (index < items.length) {
        Promise.resolve().then(next);
      } else {
        resolve();
      }
    }
    next();
  });
}`,
      solution: `function processInChunks(items, size, onChunk) {
  return new Promise((resolve) => {
    let index = 0;
    function next() {
      onChunk(items.slice(index, index + size));
      index += size;
      if (index < items.length) {
        setTimeout(next, 0);
      } else {
        resolve();
      }
    }
    next();
  });
}`,
      tests: [
        {
          name: "handles every chunk in order",
          code: `const chunks = [];\nawait processInChunks([1, 2, 3, 4, 5], 2, (c) => chunks.push(c));\nassert.deepEqual(chunks, [[1, 2], [3, 4], [5]]);`,
        },
        {
          name: "a pending timer runs before the last chunk",
          code: `const events = [];\nsetTimeout(() => events.push("timer"), 0);\nawait processInChunks([1, 2, 3, 4, 5, 6], 2, (c) => events.push(c.join("")));\nconst t = events.indexOf("timer");\nassert.ok(t !== -1, "timer had not run when processing finished: " + events.join(", "));\nassert.ok(t < events.indexOf("56"), "timer ran after the last chunk");\nassert.equal(events[0], "12");`,
        },
        {
          name: "resolves after a single chunk",
          code: `const chunks = [];\nawait processInChunks([1, 2], 5, (c) => chunks.push(c));\nassert.deepEqual(chunks, [[1, 2]]);`,
        },
      ],
      hints: [
        "The microtask queue is drained completely before the event loop picks the next timer.",
        "Schedule the next chunk as a macrotask.",
      ],
    },
    {
      slug: "ordered-scheduler",
      title: "Implement a scheduler that logs in the required order",
      kind: "implement",
      difficulty: 2,
      tags: ["event-loop"],
      description: `Write \`schedule(tasks, run)\`. Each task is \`{ name, when }\` with \`when\` one of \`"sync"\`, \`"micro"\` or \`"macro"\`. Call \`run(name)\` for each task on the matching queue: immediately, as a microtask, or as a macrotask (\`setTimeout\` 0). Within a queue, keep the input order.

Use the real queues: a microtask must run after promise callbacks queued before \`schedule\` was called, and a macrotask after timers queued before it.

Example: \`schedule([{ name: "a", when: "macro" }, { name: "b", when: "micro" }, { name: "c", when: "sync" }], log)\` → logs \`"c", "b", "a"\``,
      starter: `function schedule(tasks, run) {\n  \n}`,
      solution: `function schedule(tasks, run) {
  for (const { name, when } of tasks) {
    if (when === "sync") run(name);
    else if (when === "micro") queueMicrotask(() => run(name));
    else if (when === "macro") setTimeout(() => run(name), 0);
  }
}`,
      tests: [
        {
          name: "runs sync, then micro, then macro tasks",
          code: `const out = [];\nschedule([\n  { name: "m1", when: "macro" },\n  { name: "q1", when: "micro" },\n  { name: "s1", when: "sync" },\n  { name: "q2", when: "micro" },\n  { name: "m2", when: "macro" },\n  { name: "s2", when: "sync" },\n], (n) => out.push(n));\nfor (let i = 0; i < 3; i++) await tick();\nassert.deepEqual(out, ["s1", "s2", "q1", "q2", "m1", "m2"]);`,
        },
        {
          name: "sync tasks have run when schedule returns",
          code: `const out = [];\nschedule([{ name: "a", when: "micro" }, { name: "b", when: "sync" }], (n) => out.push(n));\nassert.deepEqual(out, ["b"]);\nfor (let i = 0; i < 3; i++) await tick();`,
        },
        {
          name: "uses the real microtask and timer queues",
          code: `const out = [];\nsetTimeout(() => out.push("earlier timer"), 0);\nPromise.resolve().then(() => out.push("earlier promise"));\nschedule([{ name: "m", when: "macro" }, { name: "q", when: "micro" }], (n) => out.push(n));\nfor (let i = 0; i < 3; i++) await tick();\nassert.deepEqual(out, ["earlier promise", "q", "earlier timer", "m"]);`,
        },
      ],
    },
    {
      slug: "interval-cleanup",
      title: "setInterval cleanup",
      kind: "implement",
      difficulty: 2,
      tags: ["event-loop", "async"],
      description: `Write \`countdown(from, ms, onTick)\` that uses \`setInterval\` to call \`onTick(n)\` every \`ms\` milliseconds with \`from\`, \`from - 1\`, ... down to \`1\`. It returns a promise that resolves after the final tick, and the interval must be cleared then so \`onTick\` is never called again.

If \`from\` is \`0\` or less, resolve without calling \`onTick\` (and without leaving an interval running).

Example: \`await countdown(3, 5, log)\` → logs \`3, 2, 1\``,
      starter: `function countdown(from, ms, onTick) {\n  \n}`,
      solution: `function countdown(from, ms, onTick) {
  return new Promise((resolve) => {
    if (from <= 0) return resolve();
    let n = from;
    const id = setInterval(() => {
      onTick(n);
      n -= 1;
      if (n === 0) {
        clearInterval(id);
        resolve();
      }
    }, ms);
  });
}`,
      tests: [
        {
          name: "ticks from `from` down to 1",
          code: `const ticks = [];\nawait countdown(3, 5, (n) => ticks.push(n));\nassert.deepEqual(ticks, [3, 2, 1]);`,
        },
        {
          name: "does not tick synchronously",
          code: `const ticks = [];\nconst done = countdown(2, 5, (n) => ticks.push(n));\nassert.deepEqual(ticks, []);\nawait done;`,
        },
        {
          name: "clears the interval after the last tick",
          code: `const ticks = [];\nawait countdown(2, 5, (n) => ticks.push(n));\nawait wait(25);\nassert.deepEqual(ticks, [2, 1]);`,
        },
        {
          name: "resolves immediately for 0 or less",
          code: `const ticks = [];\nawait countdown(0, 5, (n) => ticks.push(n));\nawait countdown(-2, 5, (n) => ticks.push(n));\nawait wait(15);\nassert.deepEqual(ticks, []);`,
        },
      ],
    },
  ],
};

export default topic;

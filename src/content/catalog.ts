import type { Course, CourseSlug, TopicMeta } from "./types";
import { topicStats } from "./stats.generated";

type TopicSeed = Omit<TopicMeta, "count" | "challenges">;

interface CourseSeed extends Omit<Course, "topics"> {
  topics: TopicSeed[];
}

const seeds: CourseSeed[] = [
  {
    slug: "core",
    title: "JavaScript Core",
    tagline: ["functions", "arrays", "objects", "loops"],
    description: "Warm-ups on the building blocks. Fast reps to get the syntax back under your fingers.",
    color: "#3ddc84",
    topics: [
      {
        slug: "functions-i",
        title: "Functions I",
        description: "Declarations, parameters, return values, guard clauses and default parameters.",
        tags: ["functions", "parameters", "defaults"],
      },
      {
        slug: "arrays",
        title: "Arrays",
        description: "Create, read, update and rearrange arrays, with and without mutation.",
        tags: ["indexing", "length", "push", "immutability"],
      },
      {
        slug: "objects",
        title: "Objects",
        description: "Object literals, property access, methods with this, shorthand and computed keys.",
        tags: ["properties", "methods", "this"],
      },
      {
        slug: "loops",
        title: "Loops",
        description: "for, while, do...while, for...of, for...in, break and continue.",
        tags: ["for", "while", "iteration"],
      },
    ],
  },
  {
    slug: "intermediate",
    title: "Intermediate JavaScript",
    tagline: ["ES6+", "array methods", "logic building"],
    description: "The everyday toolkit: array methods, object utilities, scope, closures, async and classes.",
    color: "#ff9f43",
    topics: [
      {
        slug: "array-methods",
        title: "Array Methods",
        description: "map, filter, reduce, sort and the rest of the Array.prototype toolbox, including the ES2023 non-mutating methods.",
        tags: ["map", "filter", "reduce", "sort"],
      },
      {
        slug: "objects-ii",
        title: "Objects II",
        description: "Object.keys/values/entries, destructuring, optional chaining, nullish coalescing and shallow copies.",
        tags: ["entries", "destructuring", "optional chaining"],
      },
      {
        slug: "scope",
        title: "Scope",
        description: "Block and function scope, shadowing, hoisting, the temporal dead zone and closures.",
        tags: ["let", "var", "hoisting", "closures"],
      },
      {
        slug: "functions-ii",
        title: "Functions II",
        description: "Arrow functions, rest and spread, higher-order functions, recursion, call, apply and bind.",
        tags: ["arrow functions", "higher-order", "recursion"],
      },
      {
        slug: "async",
        title: "Asynchronous JavaScript",
        description: "Timers, promises, async/await and the Promise combinators.",
        tags: ["promises", "async/await", "event loop"],
      },
      {
        slug: "classes",
        title: "Classes",
        description: "Constructors, methods, accessors, static and private members, inheritance and iteration.",
        tags: ["class", "extends", "private fields"],
      },
    ],
  },
  {
    slug: "dom",
    title: "JavaScript DOM Exercises",
    tagline: ["access elements", "modify elements", "respond to events"],
    description: "Select, build and wire up real DOM. Every challenge runs against live markup in a visible preview.",
    color: "#a78bfa",
    topics: [
      {
        slug: "dom-selectors",
        title: "DOM Selector Methods",
        description: "getElementById, querySelector, querySelectorAll and traversal.",
        tags: ["selectors", "traversal"],
      },
      {
        slug: "dom-events",
        title: "Events and User Interactions",
        description: "Click, input, submit and keyboard events, plus event delegation.",
        tags: ["events", "delegation", "forms"],
      },
      {
        slug: "dom-manipulation",
        title: "DOM Manipulation",
        description: "Create, remove and modify elements, classes, attributes and dataset.",
        tags: ["createElement", "classList", "dataset"],
      },
      {
        slug: "dom-fundamentals",
        title: "DOM Fundamentals",
        description: "Small UI pieces end to end: render lists and tables, filter, tabs and a todo.",
        tags: ["rendering", "state", "ui"],
      },
      {
        slug: "dom-recursion",
        title: "DOM Recursive Functions",
        description: "Walk the tree recursively: count, measure depth and collect leaves.",
        tags: ["recursion", "tree"],
      },
    ],
  },
  {
    slug: "practice",
    title: "JavaScript Practice",
    tagline: ["challenges", "test your understanding", "mixed difficulty"],
    description: "Mixed exercises on strings, numbers, arrays, objects, dates and sets. Edge cases matter.",
    color: "#2ecc71",
    topics: [
      {
        slug: "fundamentals",
        title: "JavaScript Fundamentals",
        description: "String and number manipulation, formatting, parsing and a few classics.",
        tags: ["strings", "numbers", "coercion"],
      },
      {
        slug: "arrays-practice",
        title: "JavaScript Arrays",
        description: "Set operations, chunking, zipping, matrices, searching and sliding windows.",
        tags: ["arrays", "algorithms"],
      },
      {
        slug: "objects-practice",
        title: "JavaScript Objects",
        description: "Deep get, set, clone, equal and merge, plus everyday object transforms.",
        tags: ["objects", "recursion", "maps"],
      },
      {
        slug: "dates",
        title: "JavaScript Dates",
        description: "Construct, format, add, diff and compare dates without a library.",
        tags: ["Date", "formatting"],
      },
      {
        slug: "sets",
        title: "JavaScript Sets",
        description: "Set basics and set algebra.",
        tags: ["Set", "algebra"],
      },
    ],
  },
  {
    slug: "interview",
    title: "Interview Prep",
    tagline: ["closures", "this", "prototypes", "event loop", "implement the built-ins"],
    description: "The questions interviewers actually ask. Read code, predict output, and implement the built-ins.",
    color: "#f2b84b",
    topics: [
      {
        slug: "closures",
        title: "Closures",
        description: "Private state, factories, once, memoize and partial application.",
        tags: ["closures"],
      },
      {
        slug: "this-and-binding",
        title: "this and binding",
        description: "Implicit, explicit, hard and new binding, and how arrows change the rules.",
        tags: ["this", "bind"],
      },
      {
        slug: "prototypes",
        title: "Prototypes",
        description: "The prototype chain, constructor functions, and what class desugars to.",
        tags: ["prototype", "inheritance"],
      },
      {
        slug: "event-loop",
        title: "Event Loop",
        description: "Sync code, microtasks and macrotasks. Predict the order, then control it.",
        tags: ["event-loop", "predict"],
      },
      {
        slug: "promise-patterns",
        title: "Promise Patterns",
        description: "Implement the combinators, retries, timeouts, pools and queues.",
        tags: ["promises", "async"],
      },
      {
        slug: "iterators-and-generators",
        title: "Iterators and Generators",
        description: "The iteration protocol, generators, delegation, laziness and async generators.",
        tags: ["iteration", "generators"],
      },
      {
        slug: "coercion-and-equality",
        title: "Coercion and Equality",
        description: "==, ===, Object.is, truthiness, typeof and the conversions behind them.",
        tags: ["coercion", "equality"],
      },
      {
        slug: "implement-the-built-ins",
        title: "Implement the Built-ins",
        description: "debounce, throttle, curry, bind, map, reduce, an EventEmitter, an LRU cache and more.",
        tags: ["polyfills", "higher-order"],
      },
      {
        slug: "classic-puzzles",
        title: "Classic Puzzles",
        description: "The whiteboard favourites: two sum, parentheses, islands, routing and more.",
        tags: ["algorithms", "data structures"],
      },
    ],
  },
];

export const courses: Course[] = seeds.map((course) => ({
  ...course,
  topics: course.topics.map((topic) => {
    const stats = topicStats[`${course.slug}/${topic.slug}`];
    return { ...topic, count: stats?.count ?? 0, challenges: stats?.challenges ?? [] };
  }),
}));

export const courseBySlug = new Map(courses.map((c) => [c.slug, c]));

export function isCourseSlug(slug: string | undefined): slug is CourseSlug {
  return slug !== undefined && courseBySlug.has(slug as CourseSlug);
}

export function findTopicMeta(courseSlug: string, topicSlug: string): TopicMeta | undefined {
  return courseBySlug.get(courseSlug as CourseSlug)?.topics.find((t) => t.slug === topicSlug);
}

/** Every topic in curriculum order, flattened. */
export const allTopics = courses.flatMap((course) =>
  course.topics.map((topic) => ({ course: course.slug, topic })),
);

export const totalChallenges = allTopics.reduce((sum, { topic }) => sum + topic.count, 0);

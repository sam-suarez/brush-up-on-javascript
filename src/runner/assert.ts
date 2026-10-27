// The assertion library available to TestCase.code as `assert`.
import { inspect } from "./inspect";

export class AssertionError extends Error {
  actual?: string;
  expected?: string;

  constructor(message: string, details?: { actual: unknown; expected: unknown }) {
    super(message);
    this.name = "AssertionError";
    if (details) {
      this.actual = inspect(details.actual);
      this.expected = inspect(details.expected);
    }
  }
}

type Matcher = RegExp | string | (new (...args: never[]) => unknown);

function isPlainProto(proto: unknown): boolean {
  return proto === null || proto === Object.prototype;
}

/** Structural equality. Primitives compare with SameValueZero, so NaN equals NaN and -0 equals 0. */
export function deepEqual(a: unknown, b: unknown, seen = new Map<object, Set<object>>()): boolean {
  if (a === b || (Number.isNaN(a) && Number.isNaN(b))) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;

  const pairs = seen.get(a);
  if (pairs?.has(b)) return true;
  if (pairs) pairs.add(b);
  else seen.set(a, new Set([b]));

  const protoA = Object.getPrototypeOf(a);
  const protoB = Object.getPrototypeOf(b);
  if (protoA !== protoB && !(isPlainProto(protoA) && isPlainProto(protoB))) return false;

  if (a instanceof Date) return Object.is(a.getTime(), (b as Date).getTime());
  if (a instanceof RegExp) return a.source === (b as RegExp).source && a.flags === (b as RegExp).flags;
  if (a instanceof Error && (a.name !== (b as Error).name || a.message !== (b as Error).message))
    return false;

  if (Array.isArray(a)) {
    const arrB = b as unknown[];
    if (a.length !== arrB.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], arrB[i], seen)) return false;
    return true;
  }

  if (a instanceof Map) {
    const mapB = b as Map<unknown, unknown>;
    if (a.size !== mapB.size) return false;
    for (const [key, value] of a) {
      if (!mapB.has(key) || !deepEqual(value, mapB.get(key), seen)) return false;
    }
    return true;
  }

  if (a instanceof Set) {
    const setB = b as Set<unknown>;
    if (a.size !== setB.size) return false;
    const unmatched = [...setB].filter((item) => !a.has(item));
    for (const item of a) {
      if (setB.has(item)) continue;
      const index = unmatched.findIndex((candidate) => deepEqual(item, candidate, seen));
      if (index === -1) return false;
      unmatched.splice(index, 1);
    }
    return true;
  }

  if (ArrayBuffer.isView(a)) {
    const viewA = a as unknown as ArrayLike<number>;
    const viewB = b as unknown as ArrayLike<number>;
    if (viewA.length !== viewB.length) return false;
    for (let i = 0; i < viewA.length; i++) if (!Object.is(viewA[i], viewB[i])) return false;
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  const recA = a as Record<string, unknown>;
  const recB = b as Record<string, unknown>;
  for (const key of keysA) {
    if (!Object.hasOwn(recB, key) || !deepEqual(recA[key], recB[key], seen)) return false;
  }
  return true;
}

function matches(error: unknown, matcher: Matcher): boolean {
  if (matcher instanceof RegExp) {
    return (
      matcher.test(error instanceof Error ? error.message : String(error)) || matcher.test(String(error))
    );
  }
  if (typeof matcher === "string") {
    return (error instanceof Error ? error.message : String(error)).includes(matcher);
  }
  return error instanceof matcher;
}

function describeMatcher(matcher: Matcher): string {
  return typeof matcher === "function" ? matcher.name : String(matcher);
}

export const assert = {
  ok(value: unknown, msg?: string) {
    if (!value) throw new AssertionError(msg ?? `Expected a truthy value, got ${inspect(value)}`);
  },

  fail(msg = "Failed"): never {
    throw new AssertionError(msg);
  },

  equal(actual: unknown, expected: unknown, msg?: string) {
    if (!Object.is(actual, expected)) {
      throw new AssertionError(msg ?? `Expected ${inspect(expected)}, got ${inspect(actual)}`, {
        actual,
        expected,
      });
    }
  },

  notEqual(actual: unknown, expected: unknown, msg?: string) {
    if (Object.is(actual, expected)) {
      throw new AssertionError(msg ?? `Expected a value other than ${inspect(expected)}`);
    }
  },

  deepEqual(actual: unknown, expected: unknown, msg?: string) {
    if (!deepEqual(actual, expected)) {
      throw new AssertionError(msg ?? "Values are not deeply equal", { actual, expected });
    }
  },

  notDeepEqual(actual: unknown, expected: unknown, msg?: string) {
    if (deepEqual(actual, expected)) {
      throw new AssertionError(msg ?? `Expected value not to deeply equal ${inspect(expected)}`);
    }
  },

  throws(fn: () => unknown, matcher?: Matcher, msg?: string) {
    try {
      fn();
    } catch (error) {
      if (matcher && !matches(error, matcher)) {
        throw new AssertionError(
          msg ?? `Expected an error matching ${describeMatcher(matcher)}, got ${inspect(error)}`,
        );
      }
      return;
    }
    throw new AssertionError(msg ?? "Expected the function to throw");
  },

  async rejects(promiseOrFn: Promise<unknown> | (() => Promise<unknown>), matcher?: Matcher, msg?: string) {
    try {
      await (typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn);
    } catch (error) {
      if (matcher && !matches(error, matcher)) {
        throw new AssertionError(
          msg ?? `Expected a rejection matching ${describeMatcher(matcher)}, got ${inspect(error)}`,
        );
      }
      return;
    }
    throw new AssertionError(msg ?? "Expected the promise to reject");
  },

  type(value: unknown, type: string, msg?: string) {
    if (typeof value !== type) {
      throw new AssertionError(msg ?? `Expected typeof ${type}, got ${typeof value}`, {
        actual: typeof value,
        expected: type,
      });
    }
  },

  isFunction(value: unknown, msg?: string) {
    if (typeof value !== "function") {
      throw new AssertionError(msg ?? `Expected a function, got ${inspect(value)}`);
    }
  },

  closeTo(actual: number, expected: number, delta = 1e-9, msg?: string) {
    if (typeof actual !== "number" || !(Math.abs(actual - expected) <= delta)) {
      throw new AssertionError(msg ?? `Expected ${inspect(actual)} to be within ${delta} of ${expected}`, {
        actual,
        expected,
      });
    }
  },

  match(actual: string, pattern: RegExp, msg?: string) {
    if (typeof actual !== "string" || !pattern.test(actual)) {
      throw new AssertionError(msg ?? `Expected ${inspect(actual)} to match ${pattern}`);
    }
  },

  includes(haystack: string | unknown[], needle: unknown, msg?: string) {
    const found =
      typeof haystack === "string"
        ? typeof needle === "string" && haystack.includes(needle)
        : Array.isArray(haystack) && haystack.some((item) => deepEqual(item, needle));
    if (!found)
      throw new AssertionError(msg ?? `Expected ${inspect(haystack)} to include ${inspect(needle)}`);
  },
};

export type Assert = typeof assert;

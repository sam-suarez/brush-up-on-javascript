import { describe, expect, it } from "vitest";
import { deepEqual } from "../src/runner/assert";
import { buildScript, execute } from "../src/runner/harness";
import { inspect } from "../src/runner/inspect";

const t = (name: string, code: string) => ({ name, code });

describe("execute", () => {
  it("passes when every test passes", async () => {
    const result = await execute("const add = (a, b) => a + b;", [
      t("adds", "assert.equal(add(1, 2), 3);"),
      t("adds negatives", "assert.equal(add(-1, -2), -3);"),
    ]);
    expect(result.status).toBe("pass");
    expect(result.tests.map((x) => x.status)).toEqual(["pass", "pass"]);
  });

  it("reports a syntax error with the user's line number", async () => {
    const result = await execute("const a = 1;\nconst b = ;\n", [t("x", "assert.ok(true);")]);
    expect(result.status).toBe("error");
    expect(result.error?.kind).toBe("syntax");
    expect(result.error?.line).toBe(2);
    expect(result.tests[0]?.status).toBe("skipped");
  });

  it("reports a top-level runtime error and skips tests", async () => {
    const result = await execute("const a = 1;\n\nnull.boom;", [t("x", "assert.ok(true);")]);
    expect(result.status).toBe("error");
    expect(result.error?.kind).toBe("runtime");
    expect(result.error?.message).toMatch(/TypeError/);
    expect(result.error?.line).toBe(3);
    expect(result.tests).toEqual([{ name: "x", status: "skipped" }]);
  });

  it("keeps running after a failing test", async () => {
    const result = await execute("const x = 1;", [
      t("fails", "assert.equal(x, 2);"),
      t("passes", "assert.equal(x, 1);"),
    ]);
    expect(result.status).toBe("fail");
    expect(result.tests[0]).toMatchObject({ status: "fail", actual: "1", expected: "2" });
    expect(result.tests[1]?.status).toBe("pass");
  });

  it("supports async tests", async () => {
    const result = await execute("const later = (v) => new Promise((r) => setTimeout(() => r(v), 5));", [
      t("resolves", "assert.equal(await later(4), 4);"),
    ]);
    expect(result.status).toBe("pass");
  });

  it("captures console output with Node-like formatting", async () => {
    const result = await execute(
      `console.log("a", 1, [1, "b"], { k: null }); console.error(new Error("bad"));`,
      [
        t(
          "logs are visible to tests",
          `assert.deepEqual(logs, ["a 1 [ 1, 'b' ] { k: null }", "Error: bad"]);`,
        ),
      ],
    );
    expect(result.status).toBe("pass");
    expect(result.logs).toEqual([
      { level: "log", text: "a 1 [ 1, 'b' ] { k: null }" },
      { level: "error", text: "Error: bad" },
    ]);
  });

  it("tick() orders sync, microtasks and macrotasks", async () => {
    const code = `
      setTimeout(() => console.log("timeout"), 0);
      Promise.resolve().then(() => console.log("micro"));
      console.log("sync");
      const expected = ["sync", "micro", "timeout"];`;
    const result = await execute(code, [
      t("order", "await tick(); await tick(); assert.deepEqual(expected, logs);"),
    ]);
    expect(result.status).toBe("pass");
  });

  it("strict mode makes accidental globals throw", async () => {
    const result = await execute("function f() { leaked = 1; }\nf();", [t("x", "assert.ok(true);")]);
    expect(result.error?.message).toMatch(/ReferenceError/);
  });

  it("times out a never-resolving test", async () => {
    const result = await execute("", [t("hangs", "await new Promise(() => {});"), t("after", "")], {
      timeoutMs: 50,
    });
    expect(result.status).toBe("timeout");
    expect(result.tests.map((x) => x.status)).toEqual(["fail", "skipped"]);
  });

  it("user declarations shadow harness names without breaking compilation", async () => {
    const result = await execute("const logs = 5;", [t("sees user value", "assert.equal(logs, 5);")]);
    expect(result.status).toBe("pass");
  });

  it("buildScript places user code after the prelude", () => {
    const built = buildScript("a\nb", []);
    expect(built.source.split("\n")[built.userStartLine - 1]).toBe("a");
    expect(built.userLineCount).toBe(2);
  });
});

describe("assert", () => {
  it("throws, rejects and closeTo", async () => {
    const result = await execute("", [
      t("throws with matcher", `assert.throws(() => { throw new TypeError("nope"); }, TypeError);`),
      t("throws with regex", `assert.throws(() => { throw new Error("bad input"); }, /bad/);`),
      t("rejects", `await assert.rejects(Promise.reject(new Error("x")), "x");`),
      t("closeTo", `assert.closeTo(0.1 + 0.2, 0.3, 1e-9);`),
      t("throws fails when nothing thrown", `assert.throws(() => {});`),
    ]);
    expect(result.tests.map((x) => x.status)).toEqual(["pass", "pass", "pass", "pass", "fail"]);
  });
});

describe("deepEqual", () => {
  it("handles NaN, -0, Date, RegExp", () => {
    expect(deepEqual(NaN, NaN)).toBe(true);
    expect(deepEqual(-0, 0)).toBe(true);
    expect(deepEqual(new Date(1), new Date(1))).toBe(true);
    expect(deepEqual(new Date(1), new Date(2))).toBe(false);
    expect(deepEqual(/a/g, /a/g)).toBe(true);
    expect(deepEqual(/a/g, /a/i)).toBe(false);
  });

  it("handles Map and Set", () => {
    expect(deepEqual(new Map([["a", { x: 1 }]]), new Map([["a", { x: 1 }]]))).toBe(true);
    expect(deepEqual(new Map([["a", 1]]), new Map([["a", 2]]))).toBe(false);
    expect(deepEqual(new Set([1, { a: 1 }]), new Set([{ a: 1 }, 1]))).toBe(true);
    expect(deepEqual(new Set([1]), new Set([2]))).toBe(false);
  });

  it("compares arrays and objects structurally", () => {
    expect(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
    expect(deepEqual({ a: undefined }, {})).toBe(false);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(deepEqual(Object.assign(Object.create(null), { a: 1 }), { a: 1 })).toBe(true);
    class P {
      x = 1;
    }
    expect(deepEqual(new P(), { x: 1 })).toBe(false);
  });

  it("survives cycles", () => {
    const a: Record<string, unknown> = { n: 1 };
    a.self = a;
    const b: Record<string, unknown> = { n: 1 };
    b.self = b;
    expect(deepEqual(a, b)).toBe(true);
  });
});

describe("inspect", () => {
  it("formats like Node", () => {
    expect(inspect([1, "a", null, undefined])).toBe("[ 1, 'a', null, undefined ]");
    expect(inspect({ a: 1, "b-c": [] })).toBe("{ a: 1, 'b-c': [] }");
    expect(inspect(new Map([["k", 1]]))).toBe("Map(1) { 'k' => 1 }");
    expect(inspect(new Set([1, 2]))).toBe("Set(2) { 1, 2 }");
    expect(inspect(function named() {})).toBe("[Function: named]");
    expect(inspect(class Foo {})).toBe("[class Foo]");
    expect(inspect(-0)).toBe("-0");
    expect(inspect({ a: { b: { c: { d: 1 } } } })).toBe("{ a: { b: { c: [Object] } } }");
    const cyc: Record<string, unknown> = {};
    cyc.me = cyc;
    expect(inspect(cyc)).toBe("{ me: [Circular] }");
  });
});

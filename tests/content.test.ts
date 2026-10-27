import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { allTopics } from "../src/content/catalog";
import { topicStats } from "../src/content/stats.generated";
import type { Challenge, Topic } from "../src/content/types";
import { execute } from "../src/runner/harness";

/** Updated deliberately when content is added. */
const EXPECTED_TOTAL = 353;
const KINDS = new Set(["implement", "fix", "complete", "predict"]);
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// TOPIC=core or TOPIC=core/loops validates a subset (and skips the total count check).
const filter = process.env.TOPIC;
const modules = import.meta.glob<{ default: Topic }>("../src/content/*/*.ts");
const topicFiles = new Map(
  await Promise.all(
    Object.entries(modules)
      .map(([path, load]) => [path.replace("../src/content/", "").slice(0, -3), load] as const)
      .filter(([key]) => !filter || key === filter || key.startsWith(`${filter}/`))
      .map(async ([key, load]) => [key, (await load()).default] as const),
  ),
);

// User code may legitimately leave rejected promises or throw inside timers; don't let that fail the suite.
const swallow = () => {};
beforeAll(() => {
  process.on("unhandledRejection", swallow);
});
afterAll(() => {
  process.off("unhandledRejection", swallow);
});

async function run(challenge: Challenge, code: string) {
  document.body.innerHTML = challenge.html ?? "";
  return execute(code, challenge.tests, { timeoutMs: challenge.timeoutMs });
}

function describeFailures(result: Awaited<ReturnType<typeof run>>): string {
  if (result.error)
    return `${result.error.kind}: ${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}`;
  return result.tests
    .filter((t) => t.status !== "pass")
    .map(
      (t) =>
        `"${t.name}": ${t.message ?? t.status}${t.actual ? `\n  actual:   ${t.actual}\n  expected: ${t.expected}` : ""}`,
    )
    .join("\n");
}

it("every topic file belongs to the catalog", () => {
  const catalogKeys = new Set(allTopics.map(({ course, topic }) => `${course}/${topic.slug}`));
  for (const key of topicFiles.keys()) expect(catalogKeys, `unexpected file ${key}.ts`).toContain(key);
});

describe.each(allTopics.filter(({ course, topic }) => topicFiles.has(`${course}/${topic.slug}`)))(
  "$course/$topic.slug",
  ({ course, topic: meta }) => {
    const key = `${course}/${meta.slug}`;
    const topic = topicFiles.get(key)!;

    it(`${key}: metadata matches the catalog`, () => {
      expect(topic.course).toBe(course);
      expect(topic.slug).toBe(meta.slug);
      expect(topic.count).toBe(topic.challenges.length);
      expect(topicStats[key], "run npm run gen:catalog").toEqual({
        count: topic.challenges.length,
        challenges: topic.challenges.map(({ slug, title, difficulty }) => ({ slug, title, difficulty })),
      });
    });

    it(`${key}: slugs are unique kebab-case`, () => {
      const slugs = topic.challenges.map((c) => c.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const slug of slugs) expect(slug).toMatch(KEBAB);
    });

    describe.each(topic.challenges)(`${key}/$slug`, (challenge) => {
      it("has a valid schema", () => {
        expect(challenge.title.trim()).not.toBe("");
        expect(KINDS.has(challenge.kind), `kind ${challenge.kind}`).toBe(true);
        expect([1, 2, 3]).toContain(challenge.difficulty);
        expect(challenge.tests.length).toBeGreaterThanOrEqual(challenge.kind === "predict" ? 1 : 2);
        for (const test of challenge.tests) {
          expect(test.name.trim()).not.toBe("");
          expect(test.code).not.toContain("__brush");
        }
        for (const tag of challenge.tags) expect(tag).toBe(tag.toLowerCase());
        expect(
          /`[^`]*→[^`]*`/.test(challenge.description) || challenge.description.includes("```"),
          "description needs an example: a code span with → or a fenced block",
        ).toBe(true);
        if (course === "dom") expect(challenge.html, "DOM challenges set html").toBeTruthy();
        if (challenge.kind === "predict") expect(challenge.starter).toMatch(/const expected = \[\];/);
      });

      it("solution passes every test", async () => {
        const result = await run(challenge, challenge.solution);
        expect(result.status, describeFailures(result)).toBe("pass");
      });

      it("starter fails at least one test", async () => {
        const result = await run(challenge, challenge.starter);
        expect(result.status, "starter unexpectedly passes").not.toBe("pass");
      });
    });
  },
);

it.skipIf(filter)("total challenge count", () => {
  const total = [...topicFiles.values()].reduce((sum, t) => sum + t.challenges.length, 0);
  expect(total).toBe(EXPECTED_TOTAL);
});

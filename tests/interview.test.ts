import { describe, expect, it } from "vitest";
import { candidates, defaultSetup, pickChallenges, type InterviewSetup } from "../src/lib/interview";

describe("interview picker", () => {
  const setup: InterviewSetup = { ...defaultSetup(), count: 10 };

  it("respects topic and difficulty filters", () => {
    const filtered: InterviewSetup = {
      ...setup,
      topics: ["interview/closures", "core/loops"],
      difficulties: [2, 3],
    };
    for (const ref of pickChallenges(filtered, 1)) {
      expect(["interview/closures", "core/loops"]).toContain(`${ref.course}/${ref.topic.slug}`);
      expect([2, 3]).toContain(ref.challenge.difficulty);
    }
  });

  it("picks without duplicates", () => {
    const picked = pickChallenges({ ...setup, count: 15 }, 7);
    expect(new Set(picked.map((r) => r.id)).size).toBe(picked.length);
    expect(picked.length).toBe(15);
  });

  it("is deterministic for a seed", () => {
    expect(pickChallenges(setup, 42).map((r) => r.id)).toEqual(pickChallenges(setup, 42).map((r) => r.id));
    expect(pickChallenges(setup, 42).map((r) => r.id)).not.toEqual(
      pickChallenges(setup, 43).map((r) => r.id),
    );
  });

  it("returns fewer than count when the pool is small", () => {
    const tiny: InterviewSetup = { ...setup, topics: ["practice/sets"], count: 15 };
    expect(pickChallenges(tiny, 1).length).toBe(candidates(tiny).length);
  });
});

import { describe, expect, it } from "vitest";
import { challengeRefs } from "../src/lib/challengeIndex";
import { continueTarget, nextChallenge, nextInCourse, sequenceNeighbours } from "../src/lib/nextChallenge";
import type { ProgressState } from "../src/lib/progress";

const solved = (ids: string[]): ProgressState => ({
  version: 1,
  challenges: Object.fromEntries(
    ids.map((id, i) => [
      id,
      { status: "solved", attempts: 1, lastRunAt: `2026-10-01T00:00:${String(i).padStart(2, "0")}Z` },
    ]),
  ),
  solveDates: [],
});

const idsIn = (course: string, topic: string) =>
  challengeRefs.filter((r) => r.course === course && r.topic.slug === topic).map((r) => r.id);

describe("nextChallenge", () => {
  it("returns the first unsolved in the current topic", () => {
    const [first, second] = idsIn("core", "loops");
    expect(nextChallenge(solved([first!]), { course: "core", topic: "loops" })?.id).toBe(second);
  });

  it("falls through to the next topic in the course", () => {
    const arrays = idsIn("core", "arrays");
    const next = nextChallenge(solved(arrays), { course: "core", topic: "arrays" });
    expect(next?.id).toBe(idsIn("core", "objects")[0]);
  });

  it("falls through to the first unsolved anywhere at the end of a course", () => {
    const interviewLast = challengeRefs.filter((r) => r.course === "interview").map((r) => r.id);
    expect(
      nextChallenge(solved(idsIn("interview", "classic-puzzles")), {
        course: "interview",
        topic: "classic-puzzles",
      })?.id,
    ).toBe(challengeRefs[0]!.id);
    expect(interviewLast.length).toBeGreaterThan(0);
  });

  it("returns null when everything is solved", () => {
    expect(nextChallenge(solved(challengeRefs.map((r) => r.id)))).toBeNull();
  });

  it("nextInCourse and continueTarget", () => {
    const empty = solved([]);
    expect(nextInCourse(empty, "dom")?.course).toBe("dom");
    expect(continueTarget(empty)).toBeNull();
    const [a] = idsIn("practice", "sets");
    expect(continueTarget(solved([a!]))?.id).toBe(idsIn("practice", "sets")[1]);
  });

  it("sequenceNeighbours crosses topic boundaries but not courses", () => {
    const lastLoop = idsIn("core", "loops").at(-1)!;
    expect(sequenceNeighbours(lastLoop).next).toBeNull();
    const lastFunctions = idsIn("core", "functions-i").at(-1)!;
    expect(sequenceNeighbours(lastFunctions).next?.id).toBe(idsIn("core", "arrays")[0]);
    expect(sequenceNeighbours(challengeRefs[0]!.id).prev).toBeNull();
  });
});

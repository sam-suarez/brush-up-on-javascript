import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseImport } from "../src/lib/exportImport";
import {
  __resetProgressCacheForTests,
  emptyProgress,
  getProgress,
  markRevealed,
  mergeProgress,
  PROGRESS_KEY,
  recordRun,
  type ProgressState,
} from "../src/lib/progress";
import { streak } from "../src/lib/stats";

const id = "core/loops/for-sum";

beforeEach(() => {
  localStorage.clear();
  __resetProgressCacheForTests();
});

describe("progress store", () => {
  it("records attempts and solves, persisting to storage", () => {
    recordRun(id, false, "x", new Date("2026-10-01T10:00:00Z"));
    expect(getProgress().challenges[id]).toMatchObject({ status: "attempted", attempts: 1 });
    recordRun(id, true, "solved code", new Date("2026-10-01T11:00:00Z"));
    const entry = getProgress().challenges[id]!;
    expect(entry).toMatchObject({ status: "solved", attempts: 2, solvedCode: "solved code" });
    expect(entry.firstSolvedAt).toBe("2026-10-01T11:00:00.000Z");
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).challenges[id].status).toBe("solved");
  });

  it("solved is terminal: a later failing run does not downgrade it", () => {
    recordRun(id, true, "ok");
    recordRun(id, false, "broken");
    expect(getProgress().challenges[id]!.status).toBe("solved");
  });

  it("revealed upgrades to solved on a pass, but not the other way", () => {
    markRevealed(id);
    expect(getProgress().challenges[id]!.status).toBe("revealed");
    recordRun(id, false, "x");
    expect(getProgress().challenges[id]!.status).toBe("revealed");
    recordRun(id, true, "ok");
    markRevealed(id);
    expect(getProgress().challenges[id]!.status).toBe("solved");
  });

  it("recovers from corrupt storage with a fresh state", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    localStorage.setItem(PROGRESS_KEY, "{not json");
    expect(getProgress()).toEqual(emptyProgress());
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 2, challenges: {}, solveDates: [] }));
    __resetProgressCacheForTests();
    expect(getProgress()).toEqual(emptyProgress());
    warn.mockRestore();
  });
});

describe("streak", () => {
  const today = new Date(2026, 9, 26, 12);
  it("counts consecutive days ending today", () => {
    expect(streak(["2026-10-24", "2026-10-25", "2026-10-26"], today)).toBe(3);
  });
  it("counts a streak ending yesterday", () => {
    expect(streak(["2026-10-24", "2026-10-25"], today)).toBe(2);
  });
  it("is zero after a gap", () => {
    expect(streak(["2026-10-23"], today)).toBe(0);
  });
});

describe("merge", () => {
  const state = (entries: ProgressState["challenges"], dates: string[] = []): ProgressState => ({
    version: 1,
    challenges: entries,
    solveDates: dates,
  });

  it("keeps the later lastRunAt and never downgrades solved", () => {
    const a = state(
      {
        [id]: {
          status: "solved",
          attempts: 3,
          lastRunAt: "2026-10-01",
          firstSolvedAt: "2026-10-01",
          solvedCode: "a",
        },
      },
      ["2026-10-01"],
    );
    const b = state(
      {
        [id]: { status: "attempted", attempts: 5, lastRunAt: "2026-10-05" },
        other: { status: "revealed", attempts: 0, lastRunAt: "2026-10-02" },
      },
      ["2026-10-05"],
    );
    const merged = mergeProgress(a, b);
    expect(merged.challenges[id]).toMatchObject({
      status: "solved",
      attempts: 5,
      lastRunAt: "2026-10-05",
      solvedCode: "a",
    });
    expect(merged.challenges.other?.status).toBe("revealed");
    expect(merged.solveDates).toEqual(["2026-10-01", "2026-10-05"]);
  });
});

describe("import parsing", () => {
  it("rejects invalid files and summarises valid ones", () => {
    expect(parseImport("nope").ok).toBe(false);
    expect(parseImport(JSON.stringify({ hello: 1 })).ok).toBe(false);
    const parsed = parseImport(
      JSON.stringify({
        exportedAt: "2026-10-20T00:00:00.000Z",
        progress: {
          version: 1,
          challenges: { [id]: { status: "solved", attempts: 1, lastRunAt: "x" } },
          solveDates: [],
        },
        drafts: { [id]: "code" },
      }),
    );
    expect(parsed.ok && parsed.summary).toEqual({
      solved: 1,
      revealed: 0,
      drafts: 1,
      exportedAt: "2026-10-20T00:00:00.000Z",
    });
  });
});

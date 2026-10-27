import { courseBySlug } from "../content/catalog";
import type { Difficulty } from "../content/types";
import { challengeRefs, type ChallengeRef } from "./challengeIndex";
import { readItem, writeItem } from "./storage";

export const INTERVIEW_KEY = "brush:interview:v1";

export interface InterviewSetup {
  /** `${course}/${topic}` keys. */
  topics: string[];
  difficulties: Difficulty[];
  count: 5 | 10 | 15;
  /** 0 means no limit. */
  minutes: 0 | 15 | 30 | 45;
}

export const defaultSetup = (): InterviewSetup => ({
  topics: (courseBySlug.get("interview")?.topics ?? []).map((t) => `interview/${t.slug}`),
  difficulties: [1, 2, 3],
  count: 5,
  minutes: 15,
});

function isSetup(value: unknown): value is InterviewSetup {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.topics) &&
    v.topics.every((t) => typeof t === "string") &&
    Array.isArray(v.difficulties) &&
    v.difficulties.every((d) => d === 1 || d === 2 || d === 3) &&
    [5, 10, 15].includes(v.count as number) &&
    [0, 15, 30, 45].includes(v.minutes as number)
  );
}

export function loadSetup(): InterviewSetup {
  try {
    const parsed: unknown = JSON.parse(readItem(INTERVIEW_KEY) ?? "null");
    if (isSetup(parsed)) return parsed;
  } catch {
    // fall through
  }
  return defaultSetup();
}

export const saveSetup = (setup: InterviewSetup) => writeItem(INTERVIEW_KEY, JSON.stringify(setup));

/** Small deterministic PRNG so picks are reproducible in tests. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function candidates(setup: Pick<InterviewSetup, "topics" | "difficulties">): ChallengeRef[] {
  const topics = new Set(setup.topics);
  const levels = new Set(setup.difficulties);
  return challengeRefs.filter(
    (r) => topics.has(`${r.course}/${r.topic.slug}`) && levels.has(r.challenge.difficulty),
  );
}

export function pickChallenges(setup: InterviewSetup, seed = Date.now()): ChallengeRef[] {
  const pool = [...candidates(setup)];
  const random = mulberry32(seed);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, setup.count);
}

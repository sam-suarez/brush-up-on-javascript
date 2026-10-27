import { courseBySlug } from "../content/catalog";
import type { CourseSlug } from "../content/types";
import { challengeRefs, refById, type ChallengeRef } from "./challengeIndex";
import { isComplete, type ProgressState } from "./progress";

export interface From {
  course: CourseSlug;
  topic: string;
}

const unsolved = (progress: ProgressState) => (ref: ChallengeRef) => !isComplete(progress.challenges[ref.id]);

/**
 * First unsolved challenge in the given topic, else the first unsolved in a later topic of the same course,
 * else the first unsolved anywhere, else null.
 */
export function nextChallenge(progress: ProgressState, from?: From): ChallengeRef | null {
  const open = unsolved(progress);
  if (from) {
    const inTopic = challengeRefs.find(
      (r) => r.course === from.course && r.topic.slug === from.topic && open(r),
    );
    if (inTopic) return inTopic;
    const topics = courseBySlug.get(from.course)?.topics ?? [];
    const position = topics.findIndex((t) => t.slug === from.topic);
    const laterTopics = new Set(topics.slice(position + 1).map((t) => t.slug));
    const later = challengeRefs.find(
      (r) => r.course === from.course && laterTopics.has(r.topic.slug) && open(r),
    );
    if (later) return later;
  }
  return challengeRefs.find(open) ?? null;
}

/** First unsolved challenge in a course, or null when the course is complete. */
export function nextInCourse(progress: ProgressState, course: CourseSlug): ChallengeRef | null {
  const open = unsolved(progress);
  return challengeRefs.find((r) => r.course === course && open(r)) ?? null;
}

/** Where "Continue" should go: next unsolved after the most recently attempted challenge. Null without progress. */
export function continueTarget(progress: ProgressState): ChallengeRef | null {
  let latest: { id: string; at: string } | undefined;
  for (const [id, entry] of Object.entries(progress.challenges)) {
    if (refById.has(id) && (!latest || entry.lastRunAt > latest.at)) latest = { id, at: entry.lastRunAt };
  }
  if (!latest) return null;
  const ref = refById.get(latest.id)!;
  return nextChallenge(progress, { course: ref.course, topic: ref.topic.slug });
}

/** Sequential neighbours for Next / Previous, crossing topic boundaries within a course. */
export function sequenceNeighbours(id: string): { prev: ChallengeRef | null; next: ChallengeRef | null } {
  const ref = refById.get(id);
  if (!ref) return { prev: null, next: null };
  const position = challengeRefs.indexOf(ref);
  const prev = challengeRefs[position - 1];
  const next = challengeRefs[position + 1];
  return {
    prev: prev && prev.course === ref.course ? prev : null,
    next: next && next.course === ref.course ? next : null,
  };
}

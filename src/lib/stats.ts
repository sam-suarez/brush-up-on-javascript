import { courseBySlug, courses } from "../content/catalog";
import { challengeId, type CourseSlug, type Difficulty, type TopicMeta } from "../content/types";
import { refById, type ChallengeRef } from "./challengeIndex";
import { addDays, dayKey } from "./dates";
import { isComplete, type ProgressState } from "./progress";

export interface Tally {
  solved: number;
  total: number;
}

export function topicProgress(progress: ProgressState, course: CourseSlug, topic: TopicMeta): Tally {
  const solved = topic.challenges.filter((c) =>
    isComplete(progress.challenges[challengeId(course, topic.slug, c.slug)]),
  ).length;
  return { solved, total: topic.count };
}

export function courseProgress(progress: ProgressState, course: CourseSlug): Tally {
  const topics = courseBySlug.get(course)?.topics ?? [];
  return topics.reduce(
    (acc, topic) => {
      const t = topicProgress(progress, course, topic);
      return { solved: acc.solved + t.solved, total: acc.total + t.total };
    },
    { solved: 0, total: 0 },
  );
}

export function overallProgress(progress: ProgressState): Tally {
  return courses.reduce(
    (acc, course) => {
      const t = courseProgress(progress, course.slug);
      return { solved: acc.solved + t.solved, total: acc.total + t.total };
    },
    { solved: 0, total: 0 },
  );
}

/** Consecutive days with a solve, ending today or yesterday. */
export function streak(solveDates: string[], today = new Date()): number {
  const days = new Set(solveDates);
  let cursor = days.has(dayKey(today)) ? today : addDays(today, -1);
  let count = 0;
  while (days.has(dayKey(cursor))) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}

/** Challenges first solved within the last 7 days, today included. */
export function solvedThisWeek(progress: ProgressState, now = new Date()): number {
  const since = dayKey(addDays(now, -6));
  return Object.values(progress.challenges).filter(
    (c) => c.firstSolvedAt && dayKey(new Date(c.firstSolvedAt)) >= since,
  ).length;
}

export function solvedCount(progress: ProgressState): number {
  return Object.entries(progress.challenges).filter(([id, c]) => refById.has(id) && c.status === "solved")
    .length;
}

export function recentlySolved(progress: ProgressState, n: number): { ref: ChallengeRef; at: string }[] {
  return Object.entries(progress.challenges)
    .filter(([id, c]) => c.firstSolvedAt && refById.has(id))
    .map(([id, c]) => ({ ref: refById.get(id)!, at: c.firstSolvedAt! }))
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, n);
}

export function byDifficulty(progress: ProgressState): (Tally & { level: Difficulty })[] {
  const tallies = ([1, 2, 3] as const).map((level) => ({ level, solved: 0, total: 0 }));
  for (const course of courses) {
    for (const topic of course.topics) {
      for (const c of topic.challenges) {
        const tally = tallies[c.difficulty - 1]!;
        tally.total++;
        if (isComplete(progress.challenges[challengeId(course.slug, topic.slug, c.slug)])) tally.solved++;
      }
    }
  }
  return tallies;
}

export const difficultyLabel: Record<Difficulty, string> = {
  1: "refresher",
  2: "solid",
  3: "interview-hard",
};

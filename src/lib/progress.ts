// Progress store: localStorage-backed, exposed to React through useSyncExternalStore.
import { useSyncExternalStore } from "react";
import { dayKey } from "./dates";
import { readItem, writeItem } from "./storage";

export const PROGRESS_KEY = "brush:progress:v1";

export interface ChallengeProgress {
  status: "solved" | "revealed" | "attempted";
  attempts: number;
  firstSolvedAt?: string;
  lastRunAt: string;
  solvedCode?: string;
}

export interface ProgressState {
  version: 1;
  challenges: Record<string, ChallengeProgress>;
  solveDates: string[];
}

export const emptyProgress = (): ProgressState => ({ version: 1, challenges: {}, solveDates: [] });

const STATUSES = new Set(["solved", "revealed", "attempted"]);

function isChallengeProgress(value: unknown): value is ChallengeProgress {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    STATUSES.has(v.status as string) &&
    typeof v.attempts === "number" &&
    typeof v.lastRunAt === "string" &&
    (v.firstSolvedAt === undefined || typeof v.firstSolvedAt === "string") &&
    (v.solvedCode === undefined || typeof v.solvedCode === "string")
  );
}

export function isProgressState(value: unknown): value is ProgressState {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.version === 1 &&
    typeof v.challenges === "object" &&
    v.challenges !== null &&
    Object.values(v.challenges).every(isChallengeProgress) &&
    Array.isArray(v.solveDates) &&
    v.solveDates.every((d) => typeof d === "string")
  );
}

export function parseProgress(raw: string | null): ProgressState {
  if (raw === null) return emptyProgress();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isProgressState(parsed)) return parsed;
  } catch {
    // fall through
  }
  console.warn("Ignoring corrupt or unknown-version progress in localStorage.");
  return emptyProgress();
}

let state: ProgressState | undefined;
const listeners = new Set<() => void>();

export function getProgress(): ProgressState {
  state ??= parseProgress(readItem(PROGRESS_KEY));
  return state;
}

function commit(next: ProgressState) {
  state = next;
  writeItem(PROGRESS_KEY, JSON.stringify(next));
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== PROGRESS_KEY) return;
  state = parseProgress(event.newValue);
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getProgress);
}

export const isComplete = (p: ChallengeProgress | undefined) =>
  p?.status === "solved" || p?.status === "revealed";

export function recordRun(id: string, passed: boolean, code: string, now = new Date()) {
  const current = getProgress();
  const existing = current.challenges[id];
  const iso = now.toISOString();
  const entry: ChallengeProgress = passed
    ? {
        status: "solved",
        attempts: (existing?.attempts ?? 0) + 1,
        firstSolvedAt: existing?.firstSolvedAt ?? iso,
        lastRunAt: iso,
        solvedCode: code,
      }
    : {
        ...existing,
        status: existing?.status ?? "attempted",
        attempts: (existing?.attempts ?? 0) + 1,
        lastRunAt: iso,
      };
  const today = dayKey(now);
  commit({
    ...current,
    challenges: { ...current.challenges, [id]: entry },
    solveDates:
      passed && !current.solveDates.includes(today)
        ? [...current.solveDates, today].sort()
        : current.solveDates,
  });
}

export function markRevealed(id: string, now = new Date()) {
  const current = getProgress();
  const existing = current.challenges[id];
  if (existing?.status === "solved" || existing?.status === "revealed") return;
  commit({
    ...current,
    challenges: {
      ...current.challenges,
      [id]: {
        attempts: existing?.attempts ?? 0,
        ...existing,
        status: "revealed",
        lastRunAt: now.toISOString(),
      },
    },
  });
}

const RANK = { attempted: 0, revealed: 1, solved: 2 } as const;

/** Merge keeps the entry with the later lastRunAt, but never downgrades a solved challenge. */
export function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  const challenges = { ...a.challenges };
  for (const [id, incoming] of Object.entries(b.challenges)) {
    const mine = challenges[id];
    if (!mine) {
      challenges[id] = incoming;
      continue;
    }
    const later = incoming.lastRunAt > mine.lastRunAt ? incoming : mine;
    const best = RANK[incoming.status] > RANK[mine.status] ? incoming : mine;
    challenges[id] = {
      ...later,
      status: best.status,
      firstSolvedAt: [mine.firstSolvedAt, incoming.firstSolvedAt].filter(Boolean).sort()[0],
      solvedCode: best.solvedCode ?? later.solvedCode,
      attempts: Math.max(mine.attempts, incoming.attempts),
    };
  }
  return { version: 1, challenges, solveDates: [...new Set([...a.solveDates, ...b.solveDates])].sort() };
}

export function importProgress(incoming: ProgressState, mode: "merge" | "replace") {
  commit(mode === "replace" ? incoming : mergeProgress(getProgress(), incoming));
}

export function resetProgress() {
  commit(emptyProgress());
}

/** Test hook: forget the in-memory copy so the next read comes from storage. */
export function __resetProgressCacheForTests() {
  state = undefined;
}

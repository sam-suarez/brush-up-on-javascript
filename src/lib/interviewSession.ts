// The running interview session, kept in memory outside React so it survives the Shell switching layouts
// (the session view has no sidebar; setup and results do) and in-app navigation, such as reviewing a result.
import { useSyncExternalStore, type SetStateAction } from "react";
import type { ChallengeRef } from "./challengeIndex";

export type Outcome = "solved" | "failed" | "skipped" | "unreached";

export interface SessionItem {
  ref: ChallengeRef;
  outcome: Outcome;
  attempted: boolean;
  timeMs: number;
}

export interface Session {
  items: SessionItem[];
  index: number;
  startedAt: number;
  itemStartedAt: number;
  limitMs: number;
  endedAt?: number;
}

let current: Session | null = null;
const listeners = new Set<() => void>();

const getSession = () => current;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSession(update: SetStateAction<Session | null>) {
  const next = typeof update === "function" ? update(current) : update;
  if (next === current) return;
  current = next;
  for (const listener of listeners) listener();
}

export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, getSession);
}

/** True while a session is running, which is when the Shell hides its sidebar. */
export function useSessionActive(): boolean {
  const session = useSession();
  return session !== null && session.endedAt === undefined;
}

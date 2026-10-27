import { keysWithPrefix, readItem, removeItem, writeItem } from "./storage";

export const DRAFT_PREFIX = "brush:draft:v1:";

export const getDraft = (id: string): string | null => readItem(DRAFT_PREFIX + id);
export const saveDraft = (id: string, code: string) => writeItem(DRAFT_PREFIX + id, code);
export const clearDraft = (id: string) => removeItem(DRAFT_PREFIX + id);

export function allDrafts(): Record<string, string> {
  const drafts: Record<string, string> = {};
  for (const key of keysWithPrefix(DRAFT_PREFIX)) {
    const value = readItem(key);
    if (value !== null) drafts[key.slice(DRAFT_PREFIX.length)] = value;
  }
  return drafts;
}

export function clearAllDrafts() {
  for (const key of keysWithPrefix(DRAFT_PREFIX)) removeItem(key);
}

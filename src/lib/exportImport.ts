import { allDrafts, clearAllDrafts, saveDraft } from "./drafts";
import { dayKey } from "./dates";
import { getProgress, importProgress, isProgressState, type ProgressState } from "./progress";

export interface ExportFile {
  exportedAt: string;
  progress: ProgressState;
  drafts: Record<string, string>;
}

export interface ImportSummary {
  solved: number;
  revealed: number;
  drafts: number;
  exportedAt: string;
}

export function buildExport(now = new Date()): ExportFile {
  return { exportedAt: now.toISOString(), progress: getProgress(), drafts: allDrafts() };
}

export function downloadExport(now = new Date()) {
  const blob = new Blob([JSON.stringify(buildExport(now), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `brush-up-progress-${dayKey(now)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function isExportFile(value: unknown): value is ExportFile {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.exportedAt === "string" &&
    isProgressState(v.progress) &&
    typeof v.drafts === "object" &&
    v.drafts !== null &&
    Object.values(v.drafts).every((d) => typeof d === "string")
  );
}

export type ParsedImport =
  { ok: true; file: ExportFile; summary: ImportSummary } | { ok: false; error: string };

export function parseImport(text: string): ParsedImport {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }
  if (!isExportFile(parsed)) return { ok: false, error: "That file is not a brush-up progress export." };
  const statuses = Object.values(parsed.progress.challenges).map((c) => c.status);
  return {
    ok: true,
    file: parsed,
    summary: {
      solved: statuses.filter((s) => s === "solved").length,
      revealed: statuses.filter((s) => s === "revealed").length,
      drafts: Object.keys(parsed.drafts).length,
      exportedAt: parsed.exportedAt,
    },
  };
}

export function applyImport(file: ExportFile, mode: "merge" | "replace") {
  importProgress(file.progress, mode);
  if (mode === "replace") clearAllDrafts();
  for (const [id, code] of Object.entries(file.drafts)) saveDraft(id, code);
}

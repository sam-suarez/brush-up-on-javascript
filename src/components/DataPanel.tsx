import { useRef, useState } from "react";
import { clearAllDrafts } from "../lib/drafts";
import {
  applyImport,
  downloadExport,
  parseImport,
  type ExportFile,
  type ImportSummary,
} from "../lib/exportImport";
import { resetProgress } from "../lib/progress";
import { DownloadIcon, UploadIcon } from "./Icons";

type Pending = { file: ExportFile; summary: ImportSummary };

export function DataPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetText, setResetText] = useState("");

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const parsed = parseImport(await file.text());
    if (inputRef.current) inputRef.current.value = "";
    if (!parsed.ok) {
      setMessage({ tone: "error", text: parsed.error });
      setPending(null);
      return;
    }
    setMessage(null);
    setPending({ file: parsed.file, summary: parsed.summary });
  };

  const doImport = (mode: "merge" | "replace") => {
    if (!pending) return;
    applyImport(pending.file, mode);
    setMessage({ tone: "ok", text: mode === "merge" ? "Progress merged." : "Progress replaced." });
    setPending(null);
  };

  return (
    <section id="data" className="card scroll-mt-6 p-5" aria-labelledby="data-heading">
      <h2 id="data-heading" className="text-lg font-semibold">
        Export / import progress
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Progress lives in this browser's localStorage. Export it as JSON to move it somewhere else.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={() => downloadExport()}>
          <DownloadIcon size={15} /> Export JSON
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => inputRef.current?.click()}>
          <UploadIcon size={15} /> Import file
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-label="Import progress file"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
        <button type="button" className="btn btn-danger ml-auto" onClick={() => setConfirmReset(true)}>
          Reset progress
        </button>
      </div>

      {pending && (
        <div className="mt-4 rounded-lg border border-border bg-bg-sunken p-4 text-sm">
          <p>
            {pending.summary.solved} solved, {pending.summary.revealed} revealed, {pending.summary.drafts}{" "}
            drafts, exported {pending.summary.exportedAt.slice(0, 10)}.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => doImport("merge")}>
              Merge
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => doImport("replace")}>
              Replace
            </button>
            <button
              type="button"
              className="text-text-muted hover:text-text"
              onClick={() => setPending(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {confirmReset && (
        <form
          className="mt-4 rounded-lg border border-danger/40 bg-bg-sunken p-4 text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (resetText !== "reset") return;
            resetProgress();
            clearAllDrafts();
            setConfirmReset(false);
            setResetText("");
            setMessage({ tone: "ok", text: "Progress and drafts cleared." });
          }}
        >
          <label htmlFor="reset-confirm">
            This deletes all progress and drafts. Type <code className="font-mono text-danger">reset</code> to
            confirm.
          </label>
          <div className="mt-3 flex flex-wrap gap-3">
            <input
              id="reset-confirm"
              className="input"
              value={resetText}
              onChange={(e) => setResetText(e.target.value)}
              autoComplete="off"
              autoFocus
            />
            <button type="submit" className="btn btn-danger" disabled={resetText !== "reset"}>
              Delete everything
            </button>
            <button
              type="button"
              className="text-text-muted hover:text-text"
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {message && (
        <p role="status" className={`mt-3 text-sm ${message.tone === "ok" ? "text-success" : "text-danger"}`}>
          {message.text}
        </p>
      )}
    </section>
  );
}

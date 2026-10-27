import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { challengeId, type Challenge, type Topic } from "../content/types";
import { clearDraft, getDraft, saveDraft } from "../lib/drafts";
import { markRevealed, recordRun, useProgress } from "../lib/progress";
import { modKey, useWorkbenchShortcuts } from "../lib/shortcuts";
import { disposeSandbox, runInSandbox } from "../runner/sandbox";
import type { ConsoleLine, RunResult } from "../runner/types";
import { ConsolePanel, type RunStatus } from "./ConsolePanel";
import { DifficultyBadge } from "./DifficultyBadge";
import { BulbIcon, PlayIcon, ResetIcon } from "./Icons";
import { Kbd } from "./Kbd";
import { Markdown } from "./Markdown";
import { SolutionPanel } from "./SolutionPanel";
import { TestResults } from "./TestResults";

const Editor = lazy(() => import("./Editor"));

export interface WorkbenchProps {
  topic: Topic;
  challenge: Challenge;
  mode?: "practice" | "interview";
  /** Rendered under the description (breadcrumb lives in the parent). */
  header?: ReactNode;
  /** Rendered after a successful run (practice: Overview / Next buttons). */
  successActions?: ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  /** Called after every run, with the code that ran. */
  onResult?: (result: RunResult, code: string) => void;
}

function errorText(result: RunResult): string | undefined {
  if (!result.error) return undefined;
  return result.error.line ? `${result.error.message} (line ${result.error.line})` : result.error.message;
}

export function Workbench({
  topic,
  challenge,
  mode = "practice",
  header,
  successActions,
  onNext,
  onPrev,
  onResult,
}: WorkbenchProps) {
  const practice = mode === "practice";
  const id = challengeId(topic.course, topic.slug, challenge.slug);
  const progress = useProgress();
  const entry = progress.challenges[id];

  const [code, setCode] = useState(() => (practice ? getDraft(id) : null) ?? challenge.starter);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [result, setResult] = useState<RunResult | null>(null);
  const [lateLogs, setLateLogs] = useState<ConsoleLine[]>([]);
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionShown, setSolutionShown] = useState(false);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);
  const [solvedNow, setSolvedNow] = useState(false);

  const hostRef = useRef<HTMLDivElement>(null);
  const runSeq = useRef(0);
  const codeRef = useRef(code);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isDom = Boolean(challenge.html);

  // Show the challenge markup in the preview before the first run.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (isDom)
      void runInSandbox({ code: "", tests: [], html: challenge.html }, host, { title: "DOM preview" });
    return () => disposeSandbox(host);
  }, [isDom, challenge.html]);

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const onChange = useCallback(
    (value: string) => {
      setCode(value);
      codeRef.current = value;
      if (!practice) return;
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveDraft(id, value), 300);
    },
    [id, practice],
  );

  const run = useCallback(async () => {
    const host = hostRef.current;
    if (!host) return;
    const seq = ++runSeq.current;
    const source = codeRef.current;
    setStatus("running");
    setLateLogs([]);
    const outcome = await runInSandbox(
      { code: source, tests: challenge.tests, html: challenge.html, timeoutMs: challenge.timeoutMs },
      host,
      {
        title: isDom ? "DOM preview" : "Code sandbox",
        onLateLog: (line) => {
          if (runSeq.current === seq) setLateLogs((lines) => [...lines, line]);
        },
      },
    );
    if (runSeq.current !== seq) return;
    setResult(outcome);
    setStatus(outcome.status);
    const passed = outcome.status === "pass";
    if (practice || passed) recordRun(id, passed, source);
    if (passed) setSolvedNow(true);
    onResult?.(outcome, source);
  }, [challenge, id, isDom, practice, onResult]);

  const reset = useCallback(() => {
    setCode(challenge.starter);
    codeRef.current = challenge.starter;
    clearTimeout(saveTimer.current);
    clearDraft(id);
    setResult(null);
    setStatus("idle");
    setLateLogs([]);
  }, [challenge.starter, id]);

  useWorkbenchShortcuts({ run, reset, next: onNext, prev: onPrev });

  const revealSolution = () => {
    markRevealed(id);
    setSolutionShown(true);
    setConfirmGiveUp(false);
  };

  const hints = practice ? (challenge.hints ?? []) : [];
  const alreadyComplete = entry?.status === "solved" || entry?.status === "revealed";
  const showSuccess = practice && solvedNow;
  const showSolution = practice && (showSuccess || solutionShown);
  const border =
    status === "pass"
      ? "border-success"
      : status === "fail" || status === "error" || status === "timeout"
        ? "border-danger"
        : "border-border";

  return (
    <div className="flex flex-col gap-5">
      <header>
        {header}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-accent">{challenge.title}</h1>
          <DifficultyBadge level={challenge.difficulty} />
          {practice && entry?.status === "solved" && (
            <span className="chip border-success/40 text-success">solved</span>
          )}
          {practice && entry?.status === "revealed" && (
            <span className="chip border-success/30 text-success/80">revealed</span>
          )}
        </div>
        {challenge.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {challenge.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div>
        <Markdown source={challenge.description} />
        {(hints.length > 0 || (practice && !showSolution)) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {hints.length > 0 && hintsShown < hints.length && (
              <button
                type="button"
                className="link inline-flex items-center gap-1.5"
                onClick={() => setHintsShown((n) => n + 1)}
              >
                <BulbIcon size={14} /> Show hint ({hintsShown + 1}/{hints.length})
              </button>
            )}
            {practice && !showSolution && !confirmGiveUp && (
              <button
                type="button"
                className="text-text-muted hover:text-text"
                onClick={() => (alreadyComplete ? setSolutionShown(true) : setConfirmGiveUp(true))}
              >
                {alreadyComplete ? "Show solution" : "Give up? Show solution"}
              </button>
            )}
            {confirmGiveUp && (
              <span className="flex items-center gap-3 text-text-muted">
                Reveal the solution? It counts as revealed, not solved.
                <button type="button" className="btn btn-ghost px-3 py-1" onClick={revealSolution}>
                  Reveal
                </button>
                <button type="button" className="hover:text-text" onClick={() => setConfirmGiveUp(false)}>
                  Cancel
                </button>
              </span>
            )}
          </div>
        )}
        {hintsShown > 0 && (
          <ol className="mt-3 space-y-2">
            {hints.slice(0, hintsShown).map((hint, i) => (
              <li key={i} className="card flex gap-2 px-3 py-2 text-sm">
                <BulbIcon size={14} className="mt-1 shrink-0 text-accent" />
                <Markdown source={hint} />
              </li>
            ))}
          </ol>
        )}
      </div>

      <section className={`card overflow-hidden border transition-colors ${border}`} aria-label="Code editor">
        <div className="flex items-center justify-end border-b border-border px-3 py-1.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text"
            onClick={reset}
            title={`Reset to starter code (${modKey}+Shift+R)`}
          >
            <ResetIcon size={13} /> reset
          </button>
        </div>
        <Suspense fallback={<pre className="min-h-[220px] bg-bg-sunken p-4 font-mono text-sm">{code}</pre>}>
          <Editor value={code} onChange={onChange} onRun={run} label={`Code editor for ${challenge.title}`} />
        </Suspense>
        <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2">
          <span className="text-xs text-text-muted">JavaScript</span>
          <span className="flex items-center gap-3">
            <span className="hidden items-center gap-1 text-xs text-text-muted sm:flex">
              <Kbd>{modKey}</Kbd>
              <Kbd>Enter</Kbd>
            </span>
            <button
              type="button"
              className="btn btn-primary"
              onClick={run}
              disabled={status === "running"}
              aria-busy={status === "running"}
            >
              <PlayIcon size={14} /> {status === "running" ? "Running…" : "Run Code"}
            </button>
          </span>
        </div>
      </section>

      {isDom ? (
        <section className="card overflow-hidden" aria-label="DOM preview">
          <div className="h-56 bg-bg-sunken" ref={hostRef} />
          <div className="border-t border-border px-4 py-1.5 text-xs text-text-muted">Preview</div>
        </section>
      ) : (
        <div
          ref={hostRef}
          aria-hidden
          className="pointer-events-none fixed bottom-0 left-0 h-px w-px opacity-0"
        />
      )}

      <ConsolePanel
        lines={[...(result?.logs ?? []), ...lateLogs]}
        status={status}
        error={result ? errorText(result) : undefined}
      />

      {result && result.tests.length > 0 && <TestResults results={result.tests} />}

      {showSolution && (
        <>
          <hr className="border-border" />
          {showSuccess && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-lg font-semibold text-success">Solved. Nice work.</p>
              {successActions}
            </div>
          )}
          <SolutionPanel code={challenge.solution} />
          {!showSuccess && successActions && <div className="flex justify-end">{successActions}</div>}
        </>
      )}
    </div>
  );
}

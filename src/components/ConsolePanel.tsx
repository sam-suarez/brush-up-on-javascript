import type { ConsoleLine } from "../runner/types";

export type RunStatus = "idle" | "running" | "pass" | "fail" | "error" | "timeout";

const levelStyles: Record<ConsoleLine["level"], string> = {
  log: "text-text",
  info: "text-info",
  warn: "text-accent",
  error: "text-danger",
};

export function ConsolePanel({
  lines,
  status,
  error,
}: {
  lines: ConsoleLine[];
  status: RunStatus;
  error?: string;
}) {
  const empty = lines.length === 0 && !error;
  return (
    <section className="card overflow-hidden" aria-label="Console">
      <div className="max-h-64 min-h-20 overflow-auto bg-bg-sunken px-4 py-3 font-mono text-[0.8rem] leading-relaxed">
        {status === "running" && empty ? (
          <p className="text-text-muted">Running…</p>
        ) : empty ? (
          <p className="text-text-muted">
            {status === "idle" ? "Run your code to see output" : "No console output"}
          </p>
        ) : (
          <>
            {lines.map((line, i) => (
              <pre key={i} className={`whitespace-pre-wrap break-words ${levelStyles[line.level]}`}>
                {line.text}
              </pre>
            ))}
            {error && <pre className="whitespace-pre-wrap break-words text-danger">{error}</pre>}
          </>
        )}
      </div>
      <div className="border-t border-border px-4 py-1.5 text-xs text-text-muted">Console</div>
    </section>
  );
}

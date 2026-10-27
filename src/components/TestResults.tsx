import type { TestResult } from "../runner/types";
import { CheckIcon, XIcon } from "./Icons";

export function TestResults({ results }: { results: TestResult[] }) {
  const passed = results.filter((r) => r.status === "pass").length;
  return (
    <section className="card overflow-hidden" aria-label="Test results">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs text-text-muted">
        <span>Tests</span>
        <span aria-live="polite">
          {passed}/{results.length} passing
        </span>
      </div>
      <ul className="divide-y divide-border">
        {results.map((result, i) => (
          <li key={i} className="px-4 py-2.5 text-sm">
            <div className="flex items-start gap-2.5">
              {result.status === "pass" ? (
                <CheckIcon className="mt-0.5 shrink-0 text-success" aria-label="passed" />
              ) : result.status === "fail" ? (
                <XIcon className="mt-0.5 shrink-0 text-danger" aria-label="failed" />
              ) : (
                <span className="mt-0.5 w-4 shrink-0 text-center text-text-muted" aria-label="not run">
                  –
                </span>
              )}
              <span className={result.status === "skipped" ? "text-text-muted" : ""}>
                {result.name}
                {result.status === "skipped" && <span className="ml-2 text-xs">(not run)</span>}
              </span>
            </div>
            {result.status === "fail" && (result.message || result.actual) && (
              <details className="ml-6.5 mt-1.5" open={i === results.findIndex((r) => r.status === "fail")}>
                <summary className="cursor-pointer text-xs text-text-muted">Details</summary>
                <div className="mt-1.5 space-y-1 rounded-md bg-bg-sunken p-2.5 font-mono text-xs">
                  {result.message && <p className="whitespace-pre-wrap text-danger">{result.message}</p>}
                  {result.actual !== undefined && (
                    <p className="whitespace-pre-wrap">
                      <span className="text-text-muted">actual: </span>
                      <span className="text-danger">{result.actual}</span>
                    </p>
                  )}
                  {result.expected !== undefined && (
                    <p className="whitespace-pre-wrap">
                      <span className="text-text-muted">expected: </span>
                      <span className="text-success">{result.expected}</span>
                    </p>
                  )}
                </div>
              </details>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

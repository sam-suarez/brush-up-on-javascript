import { lazy, Suspense } from "react";

const Editor = lazy(() => import("./Editor"));

export function SolutionPanel({ code, title = "The author's solution" }: { code: string; title?: string }) {
  return (
    <section className="card overflow-hidden" aria-label={title}>
      <div className="border-b border-border px-4 py-2 text-xs text-text-muted">{title}</div>
      <Suspense fallback={<pre className="bg-bg-sunken p-4 font-mono text-sm">{code}</pre>}>
        <Editor value={code} readOnly label={title} minHeight="0" />
      </Suspense>
    </section>
  );
}

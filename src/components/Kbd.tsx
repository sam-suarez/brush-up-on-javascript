import type { ReactNode } from "react";

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-bg-sunken px-1.5 py-0.5 font-mono text-[0.7rem] text-text-muted">
      {children}
    </kbd>
  );
}

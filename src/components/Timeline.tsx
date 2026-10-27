import type { ReactNode } from "react";
import { Link } from "react-router";

export type TimelineState = "done" | "revealed" | "next" | "todo";

export interface TimelineItem {
  to: string;
  title: string;
  subtitle?: ReactNode;
  state: TimelineState;
  /** Content of the node circle (an icon, or an x/y ring). */
  badge: ReactNode;
  /** Small label above the title, e.g. the difficulty. */
  label?: ReactNode;
}

const nodeStyles: Record<TimelineState, string> = {
  done: "border-success text-success",
  revealed: "border-success/60 text-success/80 border-dashed",
  next: "border-accent text-accent shadow-[0_0_0_4px_rgb(242_184_75_/_0.15)]",
  todo: "border-border text-text-muted",
};

export function Timeline({ items, nodeSize = 48 }: { items: TimelineItem[]; nodeSize?: number }) {
  return (
    <ol className="relative">
      {items.map((item, i) => (
        <li key={item.to} className="relative flex gap-4 pb-6 last:pb-0">
          {i < items.length - 1 && (
            <span
              aria-hidden
              className="absolute w-px bg-border"
              style={{ left: nodeSize / 2 + 64, top: nodeSize, bottom: 0 }}
            />
          )}
          <span className="flex w-16 shrink-0 justify-end pt-3" aria-hidden={item.state !== "next"}>
            {item.state === "next" && <span className="label-caps text-accent">next »</span>}
          </span>
          <Link
            to={item.to}
            className="group -m-2 flex min-w-0 flex-1 items-start gap-4 rounded-lg p-2 transition-colors hover:bg-bg-raised"
          >
            <span
              className={`flex shrink-0 items-center justify-center rounded-full border-2 bg-bg ${nodeStyles[item.state]}`}
              style={{ width: nodeSize, height: nodeSize }}
            >
              {item.badge}
            </span>
            <span className="min-w-0 pt-1">
              {item.label && <span className="mb-0.5 block">{item.label}</span>}
              <span
                className={`block font-semibold group-hover:text-accent ${item.state === "next" ? "text-accent" : "text-text"}`}
              >
                {item.title}
              </span>
              {item.subtitle && <span className="mt-1 block text-sm text-text-muted">{item.subtitle}</span>}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

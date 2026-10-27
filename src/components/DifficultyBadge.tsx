import type { Difficulty } from "../content/types";
import { difficultyLabel } from "../lib/stats";

const styles: Record<Difficulty, string> = {
  1: "text-success border-success/40",
  2: "text-info border-info/40",
  3: "text-danger border-danger/40",
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return <span className={`chip label-caps ${styles[level]}`}>{difficultyLabel[level]}</span>;
}

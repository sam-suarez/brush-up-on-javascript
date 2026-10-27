import { Link } from "react-router";
import { courseBySlug } from "../content/catalog";
import { challengePath, type ChallengeRef } from "../lib/challengeIndex";
import { useProgress } from "../lib/progress";
import { topicProgress } from "../lib/stats";
import { ChevronRightIcon } from "./Icons";

export function ContinueCard({ target }: { target: ChallengeRef }) {
  const progress = useProgress();
  const tally = topicProgress(progress, target.course, target.topic);
  return (
    <Link
      to={challengePath(target)}
      className="card group flex items-center gap-3 p-3 transition-colors hover:border-accent/60"
    >
      <span className="min-w-0 flex-1">
        <span className="label-caps block text-text-muted">Continue</span>
        <span className="block truncate text-xs text-text-muted">
          {courseBySlug.get(target.course)?.title}
        </span>
        <span className="block truncate text-sm font-semibold text-accent">{target.topic.title}</span>
        <span className="block text-xs text-text-muted">
          {tally.solved}/{tally.total} completed
        </span>
      </span>
      <ChevronRightIcon className="text-text-muted group-hover:text-accent" />
    </Link>
  );
}

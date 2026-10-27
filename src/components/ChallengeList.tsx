import { Link } from "react-router";
import { challengeId, type CourseSlug, type TopicMeta } from "../content/types";
import { isComplete, useProgress } from "../lib/progress";
import { topicProgress } from "../lib/stats";
import { CheckIcon } from "./Icons";

export function ChallengeList({
  course,
  topic,
  currentSlug,
}: {
  course: CourseSlug;
  topic: TopicMeta;
  currentSlug: string;
}) {
  const progress = useProgress();
  const tally = topicProgress(progress, course, topic);
  const percent = tally.total ? Math.round((tally.solved / tally.total) * 100) : 0;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-border p-4">
        <Link to={`/${course}/${topic.slug}`} className="font-semibold text-accent hover:underline">
          {topic.title}
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border" aria-hidden>
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-xs text-text-muted">{percent}%</span>
        </div>
      </div>
      <nav aria-label={`${topic.title} challenges`} className="flex-1 overflow-y-auto p-2">
        <ol>
          {topic.challenges.map((c) => {
            const entry = progress.challenges[challengeId(course, topic.slug, c.slug)];
            const done = isComplete(entry);
            const current = c.slug === currentSlug;
            return (
              <li key={c.slug}>
                <Link
                  to={`/${course}/${topic.slug}/${c.slug}`}
                  aria-current={current ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-bg-raised ${
                    current ? "bg-bg-raised font-semibold text-accent" : "text-text-muted"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      done
                        ? entry?.status === "solved"
                          ? "border-success bg-success text-bg"
                          : "border-success text-success"
                        : current
                          ? "border-accent"
                          : "border-border"
                    }`}
                  >
                    {done && <CheckIcon size={12} strokeWidth={3} />}
                  </span>
                  <span className="leading-snug">{c.title}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

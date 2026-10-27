import { data, Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Breadcrumb } from "../components/Breadcrumb";
import { CheckIcon, TerminalIcon } from "../components/Icons";
import { ProgressRing } from "../components/ProgressRing";
import { Timeline, type TimelineItem } from "../components/Timeline";
import { courseBySlug, findTopicMeta, isCourseSlug } from "../content/catalog";
import { loadTopic } from "../content/load";
import { challengeId } from "../content/types";
import { useProgress } from "../lib/progress";
import { difficultyLabel, topicProgress } from "../lib/stats";

const difficultyColor = { 1: "text-success", 2: "text-info", 3: "text-danger" } as const;

export function loader({ params }: LoaderFunctionArgs) {
  const topic = isCourseSlug(params.course) ? findTopicMeta(params.course, params.topic ?? "") : undefined;
  if (!topic || topic.count === 0) throw data(null, { status: 404 });
  // Warm the topic chunk so opening a challenge is instant.
  void loadTopic(params.course!, topic.slug);
  return { course: courseBySlug.get(params.course as never)!, topic };
}

export function Component() {
  const { course, topic } = useLoaderData<typeof loader>();
  const progress = useProgress();
  const tally = topicProgress(progress, course.slug, topic);
  const statusOf = (slug: string) => progress.challenges[challengeId(course.slug, topic.slug, slug)]?.status;
  const nextIndex = topic.challenges.findIndex(
    (c) => statusOf(c.slug) !== "solved" && statusOf(c.slug) !== "revealed",
  );

  const items: TimelineItem[] = topic.challenges.map((c, i) => {
    const status = statusOf(c.slug);
    const state: TimelineItem["state"] =
      status === "solved" ? "done" : status === "revealed" ? "revealed" : i === nextIndex ? "next" : "todo";
    return {
      to: `/${course.slug}/${topic.slug}/${c.slug}`,
      title: c.title,
      state,
      label: (
        <span className={`label-caps ${difficultyColor[c.difficulty]}`}>{difficultyLabel[c.difficulty]}</span>
      ),
      badge:
        state === "done" || state === "revealed" ? (
          <CheckIcon size={20} strokeWidth={3} />
        ) : (
          <TerminalIcon size={20} />
        ),
    };
  });

  const firstOpen = items.find((i) => i.state === "next");

  return (
    <>
      <title>{`${topic.title} · brush up on javascript`}</title>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: course.title, to: `/${course.slug}` },
          { label: topic.title },
        ]}
      />
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent">{topic.title}</h1>
          <p className="mt-2 max-w-2xl text-text-muted">{topic.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {topic.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <ProgressRing value={tally.solved} max={tally.total} size={72} />
      </div>
      <Timeline items={items} nodeSize={44} />
      <div className="mt-8 flex justify-end">
        {firstOpen ? (
          <Link to={firstOpen.to} className="btn btn-primary">
            {tally.solved > 0 ? "Continue" : "Start"}
          </Link>
        ) : (
          <Link to={`/${course.slug}`} className="btn btn-ghost">
            Topic complete · back to {course.title}
          </Link>
        )}
      </div>
    </>
  );
}

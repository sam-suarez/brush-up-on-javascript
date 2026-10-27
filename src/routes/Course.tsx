import { data, Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Breadcrumb } from "../components/Breadcrumb";
import { ProgressRing } from "../components/ProgressRing";
import { Timeline, type TimelineItem } from "../components/Timeline";
import { courseBySlug, isCourseSlug } from "../content/catalog";
import { challengePath } from "../lib/challengeIndex";
import { nextInCourse } from "../lib/nextChallenge";
import { useProgress } from "../lib/progress";
import { courseProgress, topicProgress } from "../lib/stats";

export function loader({ params }: LoaderFunctionArgs) {
  if (!isCourseSlug(params.course)) throw data(null, { status: 404 });
  return { course: courseBySlug.get(params.course)! };
}

export function Component() {
  const { course } = useLoaderData<typeof loader>();
  const progress = useProgress();
  const tally = courseProgress(progress, course.slug);
  const next = nextInCourse(progress, course.slug);

  const items: TimelineItem[] = course.topics.map((topic) => {
    const t = topicProgress(progress, course.slug, topic);
    const complete = t.total > 0 && t.solved >= t.total;
    return {
      to: `/${course.slug}/${topic.slug}`,
      title: topic.title,
      subtitle: topic.description,
      state: complete ? "done" : next?.topic.slug === topic.slug ? "next" : "todo",
      badge: <ProgressRing value={t.solved} max={t.total} size={48} stroke={3} fillWhenComplete />,
    };
  });

  return (
    <>
      <title>{`${course.title} · brush up on javascript`}</title>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: course.title }]} />
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent">{course.title}</h1>
          <p className="mt-2 max-w-2xl text-text-muted">{course.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {course.tagline.map((chip) => (
              <span key={chip} className="chip">
                {chip}
              </span>
            ))}
          </div>
        </div>
        <ProgressRing value={tally.solved} max={tally.total} size={72} />
      </div>
      <div>
        <Timeline items={items} nodeSize={52} />
      </div>
      {next && (
        <div className="mt-8 flex justify-end">
          <Link to={challengePath(next)} className="btn btn-primary">
            {tally.solved > 0 ? "Continue" : "Start"}
          </Link>
        </div>
      )}
    </>
  );
}

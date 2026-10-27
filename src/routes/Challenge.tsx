import { useEffect, useState } from "react";
import { data, Link, useLoaderData, useNavigate, type LoaderFunctionArgs } from "react-router";
import { Breadcrumb } from "../components/Breadcrumb";
import { ChallengeList } from "../components/ChallengeList";
import { ChevronRightIcon, MenuIcon, StarIcon, XIcon } from "../components/Icons";
import { Workbench } from "../components/Workbench";
import { courseBySlug, findTopicMeta, isCourseSlug } from "../content/catalog";
import { loadChallenge } from "../content/load";
import { challengeId } from "../content/types";
import { challengePath } from "../lib/challengeIndex";
import { sequenceNeighbours } from "../lib/nextChallenge";
import { useProgress } from "../lib/progress";
import { solvedCount } from "../lib/stats";

export async function loader({ params }: LoaderFunctionArgs) {
  const { course, topic, challenge } = params;
  const meta = isCourseSlug(course) ? findTopicMeta(course, topic ?? "") : undefined;
  const loaded = meta ? await loadChallenge(course!, meta.slug, challenge ?? "") : undefined;
  if (!meta || !loaded) throw data(null, { status: 404 });
  return { course: courseBySlug.get(course as never)!, meta, ...loaded };
}

export function Component() {
  const { course, meta, topic, challenge } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const progress = useProgress();
  const id = challengeId(course.slug, topic.slug, challenge.slug);
  // Below 900px the rail is a drawer. Keyed by challenge so it closes once you pick one.
  const [railOpenFor, setRailOpenFor] = useState<string | null>(null);
  const railOpen = railOpenFor === id;
  const setRailOpen = (open: boolean) => setRailOpenFor(open ? id : null);

  useEffect(() => {
    if (!railOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRailOpenFor(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [railOpen]);
  const { prev, next } = sequenceNeighbours(id);
  const topicPath = `/${course.slug}/${topic.slug}`;
  const nextPath = next ? challengePath(next) : `/${course.slug}`;

  const successActions = (
    <div className="flex items-center gap-3">
      <span className="chip gap-1 border-accent/40 py-1 text-accent" title="Challenges solved">
        <StarIcon size={13} /> {solvedCount(progress)}
      </span>
      <Link to={topicPath} className="btn btn-ghost">
        Overview
      </Link>
      <Link to={nextPath} className="btn btn-primary">
        Next <ChevronRightIcon size={14} />
      </Link>
    </div>
  );

  return (
    <div className="min-h-full min-[900px]:pl-[260px]">
      <title>{`${challenge.title} · brush up on javascript`}</title>
      <a
        href="#editor"
        className="skip-link btn btn-primary"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector<HTMLElement>("#editor .cm-content")?.focus();
        }}
      >
        Skip to editor
      </a>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-[260px] border-r border-border bg-bg ${railOpen ? "block" : "hidden"} min-[900px]:block`}
      >
        <ChallengeList course={course.slug} topic={meta} currentSlug={challenge.slug} />
      </aside>
      {railOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 min-[900px]:hidden"
          onClick={() => setRailOpen(false)}
          aria-hidden
        />
      )}

      <main className="relative mx-auto max-w-4xl px-5 py-6 sm:px-8">
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            className="rounded-lg p-1.5 hover:bg-bg-raised min-[900px]:invisible"
            aria-label="Show challenge list"
            aria-expanded={railOpen}
            onClick={() => setRailOpen(true)}
          >
            <MenuIcon size={20} />
          </button>
          <Link
            to={topicPath}
            className="rounded-lg p-1.5 text-text-muted hover:bg-bg-raised hover:text-text"
            aria-label="Close and return to the topic"
          >
            <XIcon size={20} />
          </Link>
        </div>
        <Workbench
          key={id}
          topic={topic}
          challenge={challenge}
          header={
            <Breadcrumb
              items={[
                { label: "Home", to: "/" },
                { label: course.title, to: `/${course.slug}` },
                { label: topic.title, to: topicPath },
                { label: challenge.title },
              ]}
            />
          }
          successActions={successActions}
          onNext={next ? () => navigate(challengePath(next)) : undefined}
          onPrev={prev ? () => navigate(challengePath(prev)) : undefined}
        />
      </main>
    </div>
  );
}

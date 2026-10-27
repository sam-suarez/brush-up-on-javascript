import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { DataPanel } from "../components/DataPanel";
import { CourseIcon } from "../components/Icons";
import { ProgressRing } from "../components/ProgressRing";
import { courses } from "../content/catalog";
import { challengePath } from "../lib/challengeIndex";
import { relativeTime } from "../lib/dates";
import { nextInCourse } from "../lib/nextChallenge";
import { useProgress } from "../lib/progress";
import {
  byDifficulty,
  courseProgress,
  difficultyLabel,
  overallProgress,
  recentlySolved,
  solvedThisWeek,
  streak,
} from "../lib/stats";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card p-4">
      <div className="label-caps text-text-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {hint && <div className="text-xs text-text-muted">{hint}</div>}
    </div>
  );
}

const barColor = { 1: "bg-success", 2: "bg-info", 3: "bg-danger" } as const;

export function Component() {
  const progress = useProgress();
  const { hash } = useLocation();
  const overall = overallProgress(progress);
  const percent = overall.total ? Math.round((overall.solved / overall.total) * 100) : 0;
  const days = streak(progress.solveDates);
  const recent = recentlySolved(progress, 8);

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <>
      <title>Dashboard · brush up on javascript</title>
      <h1 className="text-3xl font-bold text-accent">Dashboard</h1>
      <p className="mt-2 text-text-muted">
        {overall.total} challenges for developers who already know JavaScript and want it sharp again.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Solved" value={`${overall.solved}/${overall.total}`} />
        <Stat label="Complete" value={`${percent}%`} />
        <Stat
          label="Streak"
          value={`${days} day${days === 1 ? "" : "s"}`}
          hint="consecutive days with a solve"
        />
        <Stat label="This week" value={String(solvedThisWeek(progress))} hint="solved in the last 7 days" />
      </div>

      <h2 className="mt-10 text-lg font-semibold">Courses</h2>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
        {courses.map((course) => {
          const tally = courseProgress(progress, course.slug);
          const next = nextInCourse(progress, course.slug);
          return (
            <article key={course.slug} className="card flex flex-col gap-4 p-5">
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <CourseIcon color={course.color} size={26} />
                    <Link to={`/${course.slug}`} className="font-semibold hover:text-accent">
                      {course.title}
                    </Link>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {course.tagline.map((chip) => (
                      <span key={chip} className="chip">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
                <ProgressRing value={tally.solved} max={tally.total} size={60} />
              </div>
              <div className="mt-auto flex gap-3">
                {next ? (
                  <Link to={challengePath(next)} className="btn btn-primary">
                    {tally.solved > 0 ? "Continue" : "Start"}
                  </Link>
                ) : (
                  <span className="btn btn-ghost pointer-events-none text-success">Complete</span>
                )}
                <Link to={`/${course.slug}`} className="btn btn-ghost">
                  Topics
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="card p-5" aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="text-lg font-semibold">
            Recently solved
          </h2>
          {recent.length === 0 ? (
            <p className="mt-3 text-sm text-text-muted">
              Nothing yet. Pick a course and solve your first challenge.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {recent.map(({ ref, at }) => (
                <li key={ref.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <Link to={challengePath(ref)} className="min-w-0 truncate hover:text-accent">
                    {ref.challenge.title}
                    <span className="ml-2 text-xs text-text-muted">{ref.topic.title}</span>
                  </Link>
                  <span className="shrink-0 text-xs text-text-muted">{relativeTime(at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5" aria-labelledby="difficulty-heading">
          <h2 id="difficulty-heading" className="text-lg font-semibold">
            By difficulty
          </h2>
          <ul className="mt-4 space-y-4">
            {byDifficulty(progress).map((d) => (
              <li key={d.level}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="capitalize">{difficultyLabel[d.level]}</span>
                  <span className="text-text-muted">
                    {d.solved}/{d.total}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border" aria-hidden>
                  <div
                    className={`h-full rounded-full ${barColor[d.level]} transition-all`}
                    style={{ width: `${d.total ? (d.solved / d.total) * 100 : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-10">
        <DataPanel />
      </div>
    </>
  );
}

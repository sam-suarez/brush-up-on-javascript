import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { Breadcrumb } from "../components/Breadcrumb";
import { CheckIcon, TimerIcon, XIcon } from "../components/Icons";
import { Workbench } from "../components/Workbench";
import { courses } from "../content/catalog";
import { loadChallenge } from "../content/load";
import type { Challenge, Difficulty, Topic } from "../content/types";
import { challengePath } from "../lib/challengeIndex";
import { formatDuration } from "../lib/dates";
import { candidates, loadSetup, pickChallenges, saveSetup, type InterviewSetup } from "../lib/interview";
import { setSession, useSession, type Outcome, type Session } from "../lib/interviewSession";
import { difficultyLabel } from "../lib/stats";
import type { RunResult } from "../runner/types";

export function Component() {
  const session = useSession();

  if (!session) return <Setup onStart={setSession} />;
  if (session.endedAt) return <Results session={session} onRestart={() => setSession(null)} />;
  return <SessionView session={session} />;
}

function Setup({ onStart }: { onStart: (s: Session) => void }) {
  const [setup, setSetup] = useState<InterviewSetup>(loadSetup);
  const pool = candidates(setup).length;
  const update = (patch: Partial<InterviewSetup>) => setSetup((s) => ({ ...s, ...patch }));

  const toggle = <T,>(list: T[], value: T) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const start = () => {
    saveSetup(setup);
    const now = Date.now();
    onStart({
      items: pickChallenges(setup, now).map((ref) => ({
        ref,
        outcome: "unreached",
        attempted: false,
        timeMs: 0,
      })),
      index: 0,
      startedAt: now,
      itemStartedAt: now,
      limitMs: setup.minutes * 60_000,
    });
  };

  return (
    <>
      <title>Interview mode · brush up on javascript</title>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Interview mode" }]} />
      <h1 className="text-3xl font-bold text-accent">Interview mode</h1>
      <p className="mt-2 max-w-2xl text-text-muted">
        A timed set of random challenges. No hints and no solutions until the end. Solving a challenge here
        counts toward your progress; skipping or failing doesn't change anything.
      </p>

      <form
        className="mt-8 flex flex-col gap-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (pool > 0 && setup.difficulties.length > 0) start();
        }}
      >
        <fieldset>
          <legend className="text-lg font-semibold">Topics</legend>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            {courses.map((course) => {
              const keys = course.topics.filter((t) => t.count > 0).map((t) => `${course.slug}/${t.slug}`);
              const allOn = keys.length > 0 && keys.every((k) => setup.topics.includes(k));
              return (
                <div key={course.slug} className="card p-4">
                  <label className="flex items-center gap-2 font-semibold">
                    <input
                      type="checkbox"
                      checked={allOn}
                      disabled={keys.length === 0}
                      onChange={() =>
                        update({
                          topics: allOn
                            ? setup.topics.filter((k) => !keys.includes(k))
                            : [...new Set([...setup.topics, ...keys])],
                        })
                      }
                      className="accent-[var(--color-accent)]"
                    />
                    {course.title}
                  </label>
                  <div className="mt-2 flex flex-col gap-1 pl-6">
                    {course.topics.map((topic) => {
                      const key = `${course.slug}/${topic.slug}`;
                      return (
                        <label key={key} className="flex items-center gap-2 text-sm text-text-muted">
                          <input
                            type="checkbox"
                            checked={setup.topics.includes(key)}
                            disabled={topic.count === 0}
                            onChange={() => update({ topics: toggle(setup.topics, key) })}
                            className="accent-[var(--color-accent)]"
                          />
                          {topic.title}
                          <span className="text-xs">({topic.count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <fieldset>
            <legend className="font-semibold">Difficulty</legend>
            <div className="mt-2 flex flex-col gap-1">
              {([1, 2, 3] as Difficulty[]).map((level) => (
                <label key={level} className="flex items-center gap-2 text-sm capitalize">
                  <input
                    type="checkbox"
                    checked={setup.difficulties.includes(level)}
                    onChange={() => update({ difficulties: toggle(setup.difficulties, level) })}
                    className="accent-[var(--color-accent)]"
                  />
                  {difficultyLabel[level]}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-semibold">Challenges</legend>
            <div className="mt-2 flex flex-col gap-1">
              {([5, 10, 15] as const).map((count) => (
                <label key={count} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="count"
                    checked={setup.count === count}
                    onChange={() => update({ count })}
                    className="accent-[var(--color-accent)]"
                  />
                  {count}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-semibold">Time limit</legend>
            <div className="mt-2 flex flex-col gap-1">
              {([0, 15, 30, 45] as const).map((minutes) => (
                <label key={minutes} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="minutes"
                    checked={setup.minutes === minutes}
                    onChange={() => update({ minutes })}
                    className="accent-[var(--color-accent)]"
                  />
                  {minutes === 0 ? "None" : `${minutes} min`}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={pool === 0 || setup.difficulties.length === 0}
          >
            Start session
          </button>
          <span className="text-sm text-text-muted">
            {pool === 0
              ? "No challenges match these filters."
              : `${Math.min(pool, setup.count)} of ${pool} matching challenges will be picked.`}
          </span>
        </div>
      </form>
    </>
  );
}

function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [active]);
  return now;
}

function SessionView({ session }: { session: Session }) {
  const now = useNow(true);
  const item = session.items[session.index]!;
  const [loaded, setLoaded] = useState<{ id: string; topic: Topic; challenge: Challenge } | null>(null);
  const elapsed = now - session.startedAt;
  const remaining = session.limitMs ? session.limitMs - elapsed : Infinity;

  useEffect(() => {
    let cancelled = false;
    void loadChallenge(item.ref.course, item.ref.topic.slug, item.ref.challenge.slug).then((result) => {
      if (!cancelled && result) setLoaded({ id: item.ref.id, ...result });
    });
    return () => {
      cancelled = true;
    };
  }, [item.ref]);

  /** Close the current item with an outcome and move on (or end the session). */
  const advance = useCallback((outcome: Outcome | null, endAll = false) => {
    setSession((s) => {
      if (!s || s.endedAt) return s;
      const at = Date.now();
      const items = s.items.map((it, i) => {
        if (i !== s.index) return it;
        const final: Outcome =
          outcome ?? (it.outcome === "solved" ? "solved" : it.attempted ? "failed" : "skipped");
        return { ...it, outcome: final, timeMs: it.timeMs + (at - s.itemStartedAt) };
      });
      const last = s.index >= s.items.length - 1;
      if (endAll || last) return { ...s, items, endedAt: at };
      return { ...s, items, index: s.index + 1, itemStartedAt: at };
    });
  }, []);

  useEffect(() => {
    if (remaining <= 0) advance(null, true);
  }, [remaining, advance]);

  const onResult = useCallback((result: RunResult) => {
    setSession((s) => {
      if (!s) return s;
      const items = s.items.map((it, i) =>
        i === s.index
          ? { ...it, attempted: true, outcome: result.status === "pass" ? ("solved" as const) : it.outcome }
          : it,
      );
      return { ...s, items };
    });
  }, []);

  const solved = item.outcome === "solved";

  return (
    <div className="min-h-full">
      <title>Interview session · brush up on javascript</title>
      <div className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <span className="font-semibold">
            {session.index + 1} of {session.items.length}
          </span>
          <span
            className={`flex items-center gap-1.5 font-mono text-sm ${remaining < 60_000 ? "text-danger" : "text-text-muted"}`}
            aria-label={session.limitMs ? "Time remaining" : "Time elapsed"}
          >
            <TimerIcon size={15} />
            {session.limitMs ? formatDuration(remaining) : formatDuration(elapsed)}
          </span>
          <span className="flex gap-2">
            <button type="button" className="btn btn-ghost px-3 py-1.5" onClick={() => advance(null, true)}>
              End
            </button>
            <button
              type="button"
              className={`btn px-3 py-1.5 ${solved ? "btn-primary" : "btn-ghost"}`}
              onClick={() => advance(null)}
            >
              {solved ? "Next" : "Skip"}
            </button>
          </span>
        </div>
      </div>
      <main className="mx-auto max-w-4xl px-5 py-6 sm:px-8">
        {solved && (
          <p
            className="mb-4 rounded-lg border border-success/40 bg-success/10 px-4 py-2 text-sm text-success"
            role="status"
          >
            Solved. Press Next to continue.
          </p>
        )}
        {loaded && loaded.id === item.ref.id ? (
          <Workbench
            key={item.ref.id}
            topic={loaded.topic}
            challenge={loaded.challenge}
            mode="interview"
            onResult={onResult}
          />
        ) : (
          <p className="text-text-muted">Loading challenge…</p>
        )}
      </main>
    </div>
  );
}

const outcomeStyle: Record<Outcome, string> = {
  solved: "text-success",
  failed: "text-danger",
  skipped: "text-text-muted",
  unreached: "text-text-muted",
};

function Results({ session, onRestart }: { session: Session; onRestart: () => void }) {
  const count = (o: Outcome) => session.items.filter((i) => i.outcome === o).length;
  const total = session.endedAt! - session.startedAt;
  const timedOut = session.limitMs > 0 && total >= session.limitMs;

  return (
    <>
      <title>Interview results · brush up on javascript</title>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Interview mode", to: "/interview-mode" },
          { label: "Results" },
        ]}
      />
      <h1 className="text-3xl font-bold text-accent">{timedOut ? "Time's up" : "Session complete"}</h1>
      <p className="mt-2 text-text-muted">
        {count("solved")} solved · {count("failed")} failed · {count("skipped") + count("unreached")} skipped
        · total {formatDuration(total)}
      </p>

      <ol className="card mt-6 divide-y divide-border">
        {session.items.map((item, i) => (
          <li key={item.ref.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
            <span className="w-6 text-text-muted">{i + 1}.</span>
            <span
              className={`flex w-24 items-center gap-1.5 font-semibold capitalize ${outcomeStyle[item.outcome]}`}
            >
              {item.outcome === "solved" ? (
                <CheckIcon size={14} />
              ) : item.outcome === "failed" ? (
                <XIcon size={14} />
              ) : null}
              {item.outcome === "unreached" ? "not reached" : item.outcome}
            </span>
            <span className="min-w-0 flex-1">
              {item.ref.challenge.title}
              <span className="ml-2 text-xs text-text-muted">{item.ref.topic.title}</span>
            </span>
            <span className="font-mono text-xs text-text-muted">{formatDuration(item.timeMs)}</span>
            <Link to={challengePath(item.ref)} className="link text-xs">
              Review
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex gap-3">
        <button type="button" className="btn btn-primary" onClick={onRestart}>
          New session
        </button>
        <Link to="/" className="btn btn-ghost">
          Dashboard
        </Link>
      </div>
    </>
  );
}

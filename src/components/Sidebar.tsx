import { NavLink, useParams } from "react-router";
import { courses } from "../content/catalog";
import { continueTarget } from "../lib/nextChallenge";
import { useProgress } from "../lib/progress";
import { ContinueCard } from "./ContinueCard";
import { BriefcaseIcon, CourseIcon, DownloadIcon, GithubIcon, HomeIcon } from "./Icons";

/** Set to the repository URL to show a GitHub link in the sidebar. */
export const REPO_URL = "https://github.com/sam-suarez/brush-up-on-javascript";

const navItem = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-bg-raised ${
    isActive ? "bg-bg-raised font-semibold text-text" : "text-text-muted"
  }`;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const progress = useProgress();
  const target = continueTarget(progress);
  const { course: activeCourse } = useParams();

  return (
    <div
      className="flex h-full flex-col gap-5 overflow-y-auto p-4"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) onNavigate?.();
      }}
    >
      <NavLink to="/" className="px-3 pt-1 font-mono text-[0.95rem] font-bold leading-tight text-accent">
        brush up on
        <br />
        javascript
      </NavLink>

      <nav aria-label="Main" className="flex flex-col gap-1">
        <NavLink to="/" end className={navItem}>
          <HomeIcon /> Dashboard
        </NavLink>
      </nav>

      {target && <ContinueCard target={target} />}

      <nav aria-label="Courses" className="flex flex-col gap-1">
        <span className="label-caps px-3 pb-1 text-text-muted">Courses</span>
        {courses.map((course) => (
          <NavLink
            key={course.slug}
            to={`/${course.slug}`}
            className={({ isActive }) => navItem({ isActive: isActive || activeCourse === course.slug })}
          >
            <CourseIcon color={course.color} size={26} />
            <span className="leading-tight">{course.title}</span>
          </NavLink>
        ))}
      </nav>

      <nav aria-label="More" className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
        <NavLink to="/interview-mode" className={navItem}>
          <BriefcaseIcon /> Interview mode
        </NavLink>
        <NavLink to="/#data" className={() => navItem({ isActive: false })}>
          <DownloadIcon /> Export / import progress
        </NavLink>
        {REPO_URL && (
          <a href={REPO_URL} target="_blank" rel="noreferrer" className={navItem({ isActive: false })}>
            <GithubIcon /> GitHub
          </a>
        )}
      </nav>
    </div>
  );
}

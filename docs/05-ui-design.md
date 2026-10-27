# 05 — UI design

## Look

JSChallenger's dark look, reproduced with our own tokens.

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#0d1220` | page background |
| `--color-bg-raised` | `#131a2b` | cards, editor chrome |
| `--color-bg-sunken` | `#0a0e18` | editor and console body |
| `--color-border` | `#263045` | hairlines, timeline connectors |
| `--color-text` | `#e6e9f0` | body text |
| `--color-text-muted` | `#8b94a7` | secondary text, chips |
| `--color-accent` | `#f2b84b` | headings, active nodes, primary buttons |
| `--color-accent-ink` | `#1a1300` | text on accent |
| `--color-success` | `#3ddc84` | solved ticks, passing border |
| `--color-danger` | `#ff6b6b` | failing border, errors |
| `--color-info` | `#6cb6ff` | links in descriptions |

Fonts: Inter (variable) for UI, JetBrains Mono for code. Both bundled via fontsource.

Course accent colors for sidebar icons: core green, intermediate orange, dom violet, practice green, interview yellow.

## Layout

Two columns. Left sidebar 260px, fixed, scrolls independently. Main content scrolls. Below 900px the sidebar collapses into a top bar with a menu button.

### Sidebar (every page except the challenge workbench)
- Logo text "brush up on javascript" in accent.
- Dashboard link with home icon.
- Continue card: course name, topic name, "x/y completed", chevron. Links to the next unsolved challenge. Hidden until progress exists.
- Course list: icon + title per course. Active course bold.
- Bottom: Interview mode link, "Export / import progress", GitHub link to the repo.

### Dashboard `/`
- Title "Dashboard".
- Overall stat row: solved / total, percent, current streak (consecutive days with a solve), solved this week.
- Course cards (5): title, description chips, progress ring (solved/total), "Continue" button to next unsolved in that course.
- Recently solved: last 8 with relative time.
- Difficulty breakdown: three bars (refresher / solid / interview-hard) solved vs total.
- Export / import section: Export JSON button, Import file picker with confirmation, Reset progress button with confirmation (typed "reset").

### Course page `/:course`
- Breadcrumb Home > Course.
- Title in accent, chip row.
- Vertical timeline of topics (like screenshot 3): circle with `x/y` in it, connector line, title and description to the right. Circle fills accent when complete, has a partial ring otherwise. Whole row is a link.

### Topic page `/:course/:topic`
- Breadcrumb Home > Course > Topic.
- Title, chip row.
- Vertical timeline of challenges (like screenshots 4 to 6): circle with terminal icon, title, "CHALLENGE" label replaced by difficulty label (REFRESHER / SOLID / INTERVIEW-HARD). Solved nodes show a tick. The first unsolved node is highlighted accent with a "NEXT »" marker on the left.
- Footer action: "Start" or "Continue" button.

### Challenge workbench `/:course/:topic/:challenge` (screenshots 1 and 2)
- Left rail (replaces sidebar): topic name, progress bar with percent, then the topic's challenges as a list with check circles. Current is accent. Close (×) top-right of main area returns to the topic page.
- Breadcrumb Home > Course > Topic > Challenge.
- Title in accent, difficulty badge, tags.
- Description rendered from markdown.
- Editor card: CodeMirror, JavaScript label bottom-left, "reset" top-right, Run Code button bottom-right. Border is neutral, turns green when all tests pass, red when any fail or the code throws.
- Console card below the editor: captured console output, errors in red, "Console" label. Empty state text "Run your code to see output".
- Tests card: one row per test, tick or cross, name, expandable message/diff on failure. Hidden until first run.
- Hints: "Show hint (1/3)" link under the description, reveals one at a time.
- On success: a divider, "The author's solution" panel with read-only code, a star badge with the total solved count (like the ⭐17 in screenshot 2), and buttons "Overview" (topic page) and "Next ▶" (next challenge in topic, or next topic's first challenge, or course page at the end).
- "Show solution" link is available before solving too, behind a "Give up?" confirmation; it marks the challenge as `revealed` rather than `solved`.
- Keyboard: Cmd/Ctrl+Enter runs. Cmd/Ctrl+Shift+R resets. Alt+→ / Alt+← next/previous challenge. Editor Tab inserts two spaces, Escape then Tab leaves the editor (CodeMirror default).
- Editor state: the user's draft is saved per challenge on every change (debounced 300ms) and restored on return. Reset restores the starter and clears the draft.
- For DOM challenges, a "Preview" card between the editor and console shows the sandbox iframe visibly so the user can see the DOM they are manipulating. For all other challenges the iframe is hidden.

### Interview mode `/interview-mode`
- Setup form: pick topics (multi-select grouped by course, default = all of Interview Prep), difficulty filter, count (5 / 10 / 15), time limit (none / 15 / 30 / 45 min).
- Session: same workbench without the left rail, a top bar with "3 of 10", elapsed/remaining timer, Skip button. No hints, no solution until the session ends.
- Results: solved / skipped / failed per challenge, time per challenge, links to review each. Nothing in the session changes topic progress unless the challenge was solved, in which case it counts as solved like anywhere else.

### Not found
- "404 — that challenge doesn't exist" with a link to the dashboard.

## Components

| Component | Props | Notes |
| --- | --- | --- |
| `Sidebar` | none | reads catalog + progress |
| `ContinueCard` | `target` | from `nextChallenge()` |
| `ProgressRing` | `value`, `max`, `size` | SVG ring, label inside |
| `Timeline` | `items: { to, title, subtitle, state, badge }[]` | state: done, next, todo |
| `ChallengeList` | `topic`, `currentSlug` | the left rail |
| `Editor` | `value`, `onChange`, `onRun`, `readOnly?` | CodeMirror; `lazy()` imported |
| `ConsolePanel` | `lines`, `status` | |
| `TestResults` | `results` | |
| `SolutionPanel` | `code` | read-only CodeMirror |
| `Markdown` | `source` | `marked` + minimal styling |
| `DifficultyBadge` | `level` | |
| `Kbd` | children | keyboard hint chips |

## Accessibility and motion

- All timeline rows are real links with visible focus rings.
- Editor has an accessible label. Run button has `aria-busy` while running.
- Test results announce via `aria-live="polite"`.
- No animation beyond 150ms transitions on borders and the progress ring.

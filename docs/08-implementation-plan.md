# 08 — Implementation plan

Seven parts. Parts 1 to 4 are sequential and produce a working app with a handful of sample challenges. Part 5 (content) is the bulk of the work and splits into five independent sub-parts that can be written in parallel. Parts 6 and 7 close it out.

Each part lists what gets built, what "done" means, and how it is verified. Nothing in a later part is needed to verify an earlier one.

## Part 1 — Project foundation

Build:
- `npm create vite@latest brush-up-on-javascript -- --template react-ts`, then add `react-router`, `@tailwindcss/vite`, `tailwindcss`, fontsource packages, `marked`, Vitest, `happy-dom`, Prettier.
- `src/index.css` with the theme tokens from 05-ui-design and base styles.
- `src/content/types.ts`, `src/content/catalog.ts` (all 29 topics with titles, descriptions, tags, `count: 0` placeholders), `src/content/load.ts` with the dynamic import map.
- Three sample topic files with 2 challenges each (one `implement`, one `fix`, one DOM) so later parts have real data.
- `src/router.tsx` with every route from 02-architecture, all pointing at placeholder components. `Shell` with a working sidebar.
- `README.md` at the repo root: what it is, how to run, how to add a challenge (links to docs/03).
- Scripts from 02-architecture in `package.json`.

Done when: `npm run dev` shows the dashboard with the sidebar listing five courses, clicking a course shows its topics, `npm run typecheck` and `npm run lint` pass, `npm test` runs an empty suite.

## Part 2 — Runner and harness

Build:
- `public/sandbox.html` per 06-runner.
- `src/runner/assert.ts` (source string + types), `harness.ts` (`buildScript`), `sandbox.ts` (`runInSandbox(request): Promise<RunResult>` with timeout and iframe recycling), `types.ts`.
- `tests/harness.test.ts`: syntax error reporting with correct line, runtime error at top level, a failing test does not stop later tests, async tests, `logs` capture, `tick()` ordering, `deepEqual` edge cases (NaN, Map, Set, Date, cycles), timeout path (unit-tested by stubbing the iframe).
- `tests/content.test.ts` skeleton: loads every topic from the catalog, checks schema, runs solution and starter through the harness in `happy-dom`. At this point it runs against the sample topics only.

Done when: harness tests pass and content tests pass for the sample challenges. A throwaway page (`/_runner`) lets you paste code and see the `RunResult` as JSON; removed in Part 7.

## Part 3 — Challenge workbench

Build:
- `Editor` (CodeMirror 6, JavaScript, custom dark theme, Cmd/Ctrl+Enter bound), lazily imported so the dashboard does not pay for it.
- `routes/Challenge.tsx` with loader, description, editor, Run button, `ConsolePanel`, `TestResults`, hints, reset, DOM preview for `html` challenges, success state with `SolutionPanel`, star badge, Overview and Next buttons, "Give up?" reveal.
- `ChallengeList` left rail.
- `src/lib/progress.ts`, `drafts.ts`, `nextChallenge.ts` with tests.
- Keyboard shortcuts from 05-ui-design.

Done when: you can open a sample challenge, write a wrong answer and see red tests with diffs, write the right answer and see green plus the solution, reload and find your draft restored, click Next and land on the following challenge, and the topic page shows the tick.

## Part 4 — Dashboard, course, and topic pages

Build:
- `ProgressRing`, `Timeline`, `ContinueCard`, `DifficultyBadge`.
- `routes/Dashboard.tsx` with stats, course cards, recently solved, difficulty breakdown, export/import/reset.
- `routes/Course.tsx` and `routes/Topic.tsx` timelines with NEXT marker.
- `src/lib/stats.ts`, `exportImport.ts` with tests.
- Responsive collapse of the sidebar below 900px.
- `NotFound` route and an `errorElement` on the root route.

Done when: every page in 05-ui-design exists, looks like the screenshots, and the export → reset → import round trip restores progress exactly.

## Part 5 — Content

Author all 353 challenges from 04-curriculum following 03-content-model. Five independent sub-parts, one per course, each producing the topic files for that course and updating `count` in the catalog. Each sub-part is done when `npm test` passes for its topics: schema valid, counts match, solution passes every test, starter fails at least one test, no two slugs collide, every description has an example.

| Sub-part | Course | Challenges | Notes |
| --- | --- | --- | --- |
| 5a | core | 60 | Fast to write; keep descriptions crisp, these are warm-ups for seniors |
| 5b | intermediate | 110 | Largest. `predict` kind first appears in async |
| 5c | dom | 21 | All need `html`; verify in the visible preview |
| 5d | practice | 80 | Many tests per challenge; edge cases matter |
| 5e | interview | 82 | Hardest to get right; `predict` challenges must be validated with `tick()` sequencing |

Order of authoring within a sub-part: write all challenges for a topic, run the content test for that topic alone (`npx vitest run -t "intermediate/array-methods"`), fix, move on.

A review pass after all five: open ten random challenges per course in the browser, solve them cold, and flag any whose description is ambiguous or whose tests are stricter than the description.

## Part 6 — Interview mode

Build:
- `routes/Interview.tsx` setup form (topics, difficulty, count, time), persisted to `brush:interview:v1`.
- Session state in memory (not the URL): ordered list of challenge ids, index, timestamps, outcomes.
- Session view reuses the workbench components with `mode="interview"` props that hide hints, the solution, and the left rail, and add the top bar with progress and timer.
- Results view with per-challenge outcome and time, "Review" links that open the normal workbench.
- `tests/interview.test.ts` for the random picker (respects filters, no duplicates, deterministic with a seed).

Done when: a 5-challenge, 15-minute session can be completed, skipped through, and timed out, and each path lands on a correct results view.

## Part 7 — Polish and hand-off

- Remove `/_runner`.
- Lighthouse pass on dashboard and a challenge page: no layout shift, contrast AA on all text.
- Bundle check: `npm run build` and confirm each topic is its own chunk and the editor is lazy.
- Final `npm run validate` green.
- README complete: screenshots, how to run, how to add a challenge, how the runner works in three sentences, keyboard shortcuts table.
- `docs/` updated where the build diverged from the plan.

## Estimated effort

| Part | Size |
| --- | --- |
| 1 Foundation | small |
| 2 Runner | medium |
| 3 Workbench | medium-large |
| 4 Pages | medium |
| 5 Content | large (five parallel medium chunks) |
| 6 Interview mode | medium |
| 7 Polish | small |

## Risks and how the plan handles them

- Content quality at this volume. Mitigated by the content test (solution passes, starter fails) and the cold-solve review pass.
- Timing-sensitive tests (`predict`, debounce, throttle) flaking. Mitigated by `tick()` and `wait()` helpers that are deterministic in the sandbox, and by keeping real delays under 100 ms.
- CodeMirror bundle size. Mitigated by lazy import of the editor route.
- Infinite loops in user code. Mitigated by iframe recycling with a timeout.

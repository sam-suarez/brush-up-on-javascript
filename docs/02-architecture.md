# 02 — Architecture

## Stack

| Concern | Choice | Notes |
| --- | --- | --- |
| Build | Vite 7, `@vitejs/plugin-react` | Scaffolded with `npm create vite@latest -- --template react-ts` |
| UI | React 19, TypeScript strict | |
| Routing | `react-router` v7, data mode | `createBrowserRouter` + `RouterProvider`, route objects with `lazy` and `loader` |
| Styling | Tailwind v4 via `@tailwindcss/vite` | Theme tokens in `src/index.css` with `@theme` |
| Editor | CodeMirror 6 (`@uiw/react-codemirror`, `@codemirror/lang-javascript`) | Custom dark theme matching the app |
| Markdown | `marked` (small) for challenge descriptions | Rendered to HTML, sanitized by only allowing our own content |
| Tests | Vitest + `happy-dom` | Content validation and unit tests |
| Lint/format | ESLint (Vite default) + Prettier | |

No backend, no environment variables, no external services at runtime. Fonts are bundled (`@fontsource-variable/inter`, `@fontsource/jetbrains-mono`) so the app works offline.

## Routes

| Path | Module | Purpose |
| --- | --- | --- |
| `/` | `routes/Dashboard.tsx` | Overall progress, continue card, course cards, stats, export/import |
| `/interview-mode` | `routes/Interview.tsx` | Timed random challenge set |
| `/:course` | `routes/Course.tsx` | Vertical timeline of topics with x/y completion |
| `/:course/:topic` | `routes/Topic.tsx` | Vertical timeline of challenges with ticks and a NEXT marker |
| `/:course/:topic/:challenge` | `routes/Challenge.tsx` | The workbench |
| `*` | `routes/NotFound.tsx` | 404 |

All routes sit under a layout route (`routes/Shell.tsx`) that renders the left sidebar and an `<Outlet />`. The challenge route hides the course sidebar and shows the topic checklist instead, like JSChallenger.

## Data flow

- Content is plain TypeScript modules in `src/content/<course>/<topic>.ts`. Each default-exports a `Topic` whose `challenges` is `Challenge[]`.
- `src/content/catalog.ts` holds the static course and topic metadata (slugs, titles, descriptions, tags, counts). It is small and imported eagerly.
- `src/content/load.ts` exports `loadTopic(courseSlug, topicSlug)` which does `import(\`./${course}/${topic}.ts\`)` through a static map of dynamic imports (so Vite can split every topic into its own chunk).
- Route loaders call `loadTopic` and return the data the page needs. The challenge loader returns the full challenge including `tests` and `solution`. (Nothing is secret; it is a local app. The split is only for bundle size.)
- Progress is read from `localStorage` through a small store in `src/lib/progress.ts` exposed via `useProgress()` (built on `useSyncExternalStore`). Components re-render when progress changes.
- Running code happens in a sandboxed iframe managed by `src/runner/sandbox.ts`. Results arrive by `postMessage` and are rendered by the console and test result panels. See 06-runner.

## Folder layout

```
brush-up-on-javascript/
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  vitest.config.ts
  docs/                         this plan
  public/
    favicon.svg
    sandbox.html                the iframe document used by the runner
  src/
    main.tsx                    createBrowserRouter + RouterProvider
    index.css                   theme tokens, base styles, CodeMirror overrides
    router.tsx                  route objects
    routes/
      Shell.tsx
      Dashboard.tsx
      Course.tsx
      Topic.tsx
      Challenge.tsx
      Interview.tsx
      NotFound.tsx
    components/
      Sidebar.tsx
      ContinueCard.tsx
      ProgressRing.tsx
      Timeline.tsx              vertical node list for course and topic pages
      ChallengeList.tsx         left checklist on the challenge page
      Editor.tsx                CodeMirror wrapper
      ConsolePanel.tsx
      TestResults.tsx
      SolutionPanel.tsx
      Markdown.tsx
      DifficultyBadge.tsx
      Kbd.tsx
    content/
      types.ts                  Course, Topic, Challenge, TestCase
      catalog.ts                courses + topics metadata
      load.ts                   loadTopic with dynamic import map
      core/                     course 1  (functions-i, arrays, objects, loops)
      intermediate/             course 2
      dom/                      course 3
      practice/                 course 4
      interview/                course 5
    runner/
      harness.ts                builds the script executed in the sandbox
      assert.ts                 assertion helpers (string source + types)
      sandbox.ts                iframe lifecycle, postMessage, timeout
      types.ts                  RunRequest, RunResult, TestResult, ConsoleLine
    lib/
      progress.ts               localStorage store + useProgress
      drafts.ts                 per-challenge editor drafts
      stats.ts                  derived numbers for the dashboard
      exportImport.ts           progress JSON export/import
      shortcuts.ts              Cmd/Ctrl+Enter, Cmd/Ctrl+Shift+R
      nextChallenge.ts          "what's next" resolution
  tests/
    content.test.ts             every challenge: schema valid, solution passes, starter fails
    harness.test.ts
    progress.test.ts
    nextChallenge.test.ts
```

## Scripts

```
npm run dev        vite dev server on http://localhost:5173
npm run build      production build to dist/
npm run preview    serve dist/ locally
npm run test       vitest run
npm run test:watch vitest
npm run typecheck  tsc --noEmit
npm run lint       eslint .
npm run validate   typecheck + lint + test  (what CI would run)
```

## As built (differences from the plan above)

- **Sandbox page.** There is no `public/sandbox.html`. An opaque-origin iframe cannot load module scripts without CORS, so a small Vite plugin in `vite.config.ts` bundles `src/runner/sandboxEntry.ts` with esbuild into a classic inline script. In dev it serves the result at `/sandbox.html`, and in builds it emits it as `dist/sandbox.html`.
- **Runtime instead of inlined source.** Rather than inlining `assert.ts` as a source string, the harness script receives a runtime object (`src/runner/runtime.ts`: console shim, `assert`, `logs`, `tick`, `wait`) as its only parameter. Both the sandbox and `tests/content.test.ts` call `execute()` from `src/runner/harness.ts`.
- **Syntax error lines** come from `acorn`, which is loaded only after a syntax error happens. Runtime error lines come from the stack, via a `//# sourceURL`.
- **Catalog index.** `src/content/stats.generated.ts` (from `npm run gen:catalog`) stores `count` plus `{ slug, title, difficulty }` for every challenge, not just a `difficulties` array. "Next challenge", the topic timelines, recently solved, difficulty stats and the interview picker all work without loading topic chunks. `TopicMeta.challenges` replaces `difficulties`.
- **Topic loading** uses `import.meta.glob("./*/*.ts")` in place of a hand-written import map. Every topic is still its own chunk.
- **Extra files:** `src/components/Workbench.tsx` (shared by the challenge page and interview mode), `DataPanel.tsx`, `Breadcrumb.tsx`, `Icons.tsx`, `editorTheme.ts`; `src/lib/challengeIndex.ts`, `storage.ts`, `dates.ts`, `interview.ts`.
- **No `/_runner` debug page** was built. The harness tests and the content suite covered it.
- The sidebar GitHub link points at `REPO_URL` in `src/components/Sidebar.tsx`.
- **Interview mode lives at `/interview-mode`**, not `/interview`. The Interview Prep course's slug is `interview`, and a static `/interview` route shadowed its course page. A running session is held in `src/lib/interviewSession.ts` (outside React) so the Shell can drop the sidebar for the session without losing it.

# brush up on javascript

A JSChallenger-style practice site for developers who already know JavaScript and want it sharp again, or are preparing for interviews. 353 auto-graded challenges across five courses, starting at functions and ending at event-loop puzzles and built-in polyfills. No accounts, no lessons, no paywall: everything runs locally in your browser.

## Run it

Requires Node 20+.

```sh
npm install
npm run dev        # http://localhost:5173
```

Progress is stored in `localStorage`. Use **Export / import progress** on the dashboard to move it between browsers.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` / `npm run preview` | Production build to `dist/` (any static host works) and a local preview of it |
| `npm test` | Vitest: harness unit tests, store tests, and validation of every challenge |
| `npm run typecheck` / `npm run lint` | `tsc --noEmit`, ESLint |
| `npm run validate` | typecheck + lint + test |
| `npm run gen:catalog` | Regenerate `src/content/stats.generated.ts` after adding or reordering challenges |

## How the runner works

Your code never runs in the app's window. Each run creates a fresh `<iframe sandbox="allow-scripts">` (opaque origin, so it cannot touch the app's storage or DOM), sends it your code plus the challenge's tests over `postMessage`, and kills the iframe if no result arrives within the timeout, which is how infinite loops are handled. Inside the iframe, the code and tests are joined into one strict-mode async function with a console shim and a small `assert` library. The Node test suite calls the same `execute()` function, so the script that is validated is the same one you run.

## Adding a challenge

1. Read [docs/03-content-model.md](docs/03-content-model.md) for the schema, the test helpers and the authoring rules.
2. Add the challenge to its topic file in `src/content/<course>/<topic>.ts` and bump `count`.
3. `npm run gen:catalog`
4. `TOPIC=<course>/<topic> npx vitest run tests/content.test.ts`: the solution must pass every test, and the starter must fail at least one. If the total changed, update `EXPECTED_TOTAL` in `tests/content.test.ts`.

## Keyboard shortcuts

| Keys | Action |
| --- | --- |
| `⌘/Ctrl + Enter` | Run code |
| `⌘/Ctrl + Shift + R` | Reset to starter code |
| `Alt + →` / `Alt + ←` | Next / previous challenge |
| `Esc` then `Tab` | Leave the editor (Tab otherwise indents) |

## Docs

The original plan lives in [docs/](docs/README.md).

Source: https://github.com/sam-suarez/brush-up-on-javascript

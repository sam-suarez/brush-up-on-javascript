# 01 — Overview

## What this is

A clone of the JSChallenger experience (course → topic → challenge timeline, in-browser editor, Run Code, console, reveal the author's solution, Next) rebuilt for a different audience: developers with several years of experience who want to refresh JavaScript or prepare for interviews.

## Locked decisions (kickoff Q&A, 2026-10-26)

| Decision | Choice |
| --- | --- |
| Project shape | Plain Vite + React + TypeScript single-page app. Runs locally with `npm run dev`. No server, no SSR, no hosting target. |
| Routing | React Router (data mode, `createBrowserRouter`). Lazy route modules so content is code-split per topic. |
| Progress and accounts | Local only. Progress lives in `localStorage`. Export and import as JSON so it can move between browsers. |
| Content orientation | Senior-focused. Beginner topics (variables, booleans, operators, strings, conditionals) are dropped. Content starts at Functions. A fifth course, Interview Prep, adds senior-level material. |
| Paywall | None. Everything is unlocked. No Pricing page, no lock icons. |
| Volume | Full parity with JSChallenger's per-topic challenge counts. Challenges only. No lessons, no exams. About 350 challenges. |

## Goals

1. Every challenge is a real, auto-graded exercise: description, starter code, hidden tests, author solution, console output.
2. Everything runs in the browser. User code executes in a sandboxed iframe, never in the app's own window.
3. Content is validated by a Node test suite: every author solution passes its own tests, every starter code fails at least one.
4. Looks and feels like JSChallenger: dark theme, yellow accent, vertical timeline nodes, sidebar checklist on challenge pages.
5. Fast first load. Each topic's challenges are a separate chunk, loaded when its route is visited.
6. Trivial to run: Node 20+, `npm install`, `npm run dev`. No environment variables.

## Non-goals

- Accounts, sync, social features, leaderboards.
- Lessons or long-form teaching. A challenge description may include a two-line refresher, nothing more.
- Payments.
- Deployment config. (A static `npm run build` output works on any static host if someone wants it later.)
- Languages other than JavaScript.

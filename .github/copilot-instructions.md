# Copilot instructions for Mona Mayhem

## Project snapshot

This repository is a workshop starter for a GitHub contribution battle app called Mona Mayhem. It is intentionally a minimal Astro app with a placeholder home page and a stubbed API route for fetching contribution data.

- App code lives in `src/`.
- The interactive workshop content lives in `workshop/` and `docs/`.
- The GitHub Pages deployment workflow in `.github/workflows/deploy.yml` publishes the static workshop/docs site, not the Astro app itself.
- The README explicitly notes that the repo is a starting point for Copilot-assisted development; several features are intentionally left for workshop steps to implement.

## Build, test, and validation commands

Use the repo's real scripts from `package.json`:

- `npm ci` — install dependencies
- `npm run dev` — start the local Astro dev server
- `npm run build` — production build for the Astro app
- `npm run preview` — preview the built app locally

Important notes:

- There is no `test` script configured in this repo right now.
- There is no lint script configured in this repo right now.
- There is no single-test command to run yet because the repository does not include a test runner or test suite.
- For this codebase, the main validation step is `npm run build` before shipping or changing app behavior.

## High-level architecture

The repository is split into a few distinct layers:

- `src/pages/index.astro` is the landing page for the app. It is intentionally simple and is the place to add the UI that compares two GitHub users.
- `src/pages/api/contributions/[username].ts` is the server route that proxies GitHub contribution data. It validates a GitHub username, returns GitHub's JSON without transforming its schema, and has `export const prerender = false` to ensure it is treated as a server-rendered route.
- `astro.config.mjs` configures Astro with the Node adapter and server output. This is the key file for server-side behavior and deployment decisions.
- `public/` contains static assets such as `favicon.svg`.
- `docs/` contains the workshop website and static docs content used by GitHub Pages.
- `workshop/` contains the step-by-step Copilot workshop guidance in multiple languages.

The repo is designed to be a small, file-based Astro app rather than a React/Vite or layered application. Most functionality is expected to be added in a few route files and page templates rather than a large component tree.

## Key conventions and repository-specific patterns

- Keep the app intentionally lightweight. This repo is a workshop starter, not a production app framework.
- Prefer file-based routing conventions used by Astro. New pages belong under `src/pages/` and API routes belong under `src/pages/api/`.
- For server-backed routes, follow the pattern in `src/pages/api/contributions/[username].ts`: use `export const prerender = false`, return explicit JSON `Response` objects, and keep server-only credentials such as `GITHUB_TOKEN` out of browser responses.
- Treat the `docs/` and `workshop/` folders as documentation and static site content, not as the main application logic unless the task explicitly targets the workshop materials.
- The README’s GitHub Pages section is important context: the current workflow deploys only `docs/` and `workshop/` to Pages. If the Astro app is meant to be deployed to Pages, the app must be reconfigured from server output to static output and the workflow must be updated to upload `dist/`.
- Do not assume a test or lint setup exists. When adding tooling, keep it consistent with the existing minimal Astro app setup and avoid introducing a heavier framework unless the task requires it.

## Working style for this repo

When making changes, favor the smallest set of files that solve the current task:

- page updates usually belong in `src/pages/`
- API behavior belongs in a route under `src/pages/api/`
- deployment or Astro configuration changes belong in `astro.config.mjs` and the GitHub Actions workflow
- workshop content updates belong in `workshop/` or `docs/` only when the task is explicitly about documentation or the workshop itself

This repo is a teaching project: progress is often stepwise and intentionally incomplete at first. Favor implementations that match the workshop flow and keep the app easy to understand for a beginner.

# Repository Guidelines

## Project Structure & Module Organization

- `app.vue` defines the root layout and global composition.
- `pages/` contains file-based Nuxt routes; dynamic routes use brackets (for example `pages/article/[link].vue`).
- `components/` holds reusable UI. Feature components live in `components/article/`, base UI in `components/ui/`.
- `stores/` contains Pinia stores (for example `stores/articles.js`).
- `assets/` is for processed assets; `public/` serves static files as-is.
- `server/` is reserved for Nuxt server routes and middleware.
- There is no dedicated `tests/` directory yet.

## Build, Test, and Development Commands

- `npm install` installs dependencies and runs `nuxt prepare` via `postinstall`.
- `npm run dev` starts the local dev server at `http://localhost:3000`.
- `npm run build` builds the production bundle.
- `npm run preview` serves the production build locally.
- `npm run generate` creates a static build when applicable.

## Coding Style & Naming Conventions

- Use Vue SFCs with `<template>`, `<script setup>`, and `<style>` blocks.
- Match existing formatting: tabs for indentation and braces on their own line in SCSS blocks.
- Component filenames are PascalCase (`Header.vue`, `ArticleCard.vue`). Base UI components use the `Ui` prefix (for example `UiButton.vue`).
- Route filenames follow Nuxt conventions, including dynamic params in brackets.
- No linting/formatting tools are configured; keep edits consistent with nearby files.

## Testing Guidelines

- No test framework or `npm test` script is configured yet.
- If adding tests, document the location (for example `tests/` or `components/**/__tests__`) and add a script in `package.json` (for example `"test": "vitest"`).

## Commit & Pull Request Guidelines

- Commit messages are short, lowercase, and action-oriented (for example `add hover in card`).
- Keep commits focused on one change where possible.
- PRs should include a concise summary, linked issue (if applicable), and screenshots for UI changes.

## Security & Configuration Tips

- Do not commit secrets.
- If environment variables are introduced, add an `.env.example` and document required keys.

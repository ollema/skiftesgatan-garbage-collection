# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page SvelteKit site (in Swedish) documenting a housing association's (BRF Skiftesgatan 4) plan for building a garbage/recycling enclosure: background/requirements, a to-scale SVG plan drawing, a bill-of-materials cost table, and build instructions. Deployed static via GitHub Pages.

## Commands

- `pnpm dev` — start the dev server, served at `http://localhost:5173`. When driving the app with `claude --chrome` / browser tools, start this first and point the browser at that URL.
- `pnpm check` — sync SvelteKit types and run `svelte-check` (TypeScript + Svelte diagnostics). Run this after editing `.svelte` files.
- `pnpm lint` — `prettier --check .` + `eslint .`. `pnpm format` applies Prettier fixes.
- `pnpm knip` — finds unused files/exports/deps.

## Architecture

Everything lives under `src/routes/`, and the whole app is really one page (`+page.svelte`) plus its supporting data modules. The site is prerendered (`+layout.ts` sets `export const prerender = true`).

The interesting logic is the plan drawing, which is derived data, not hand-drawn SVG:

1. **`dimensions.ts`** — the single source of truth for all physical measurements (tile pitch, post width, enclosure width/depth in tiles and meters, post positions, fence corner/anchor points, etc.). Every other module derives from constants here; do not hardcode a measurement elsewhere if it can be computed from `dimensions.ts`.
2. **`bins.ts`** — recycling bin sizes and their x-positions inside the enclosure, positioned using `dimensions.ts` constants.
3. **`plan-view.ts`** — converts the real-world meter coordinates from `dimensions.ts`/`bins.ts` into SVG viewBox coordinates (`planX`/`planY`, `PLAN_SCALE`), and lays out derived shapes (shed, tile fields, posts) for rendering.
4. **`PlanDrawing.svelte`** — renders the actual `<svg>` plan using the coordinates from `plan-view.ts`.
5. **`materials.ts`** — bill-of-materials: quantities are computed from `dimensions.ts` (tile counts, post counts, etc.) and multiplied by a hardcoded `PRICE` table to produce the cost table (`quantities.bomGroups`) and descriptive facts (`FACTS`) shown on the page.
6. **`format.ts`** — small Swedish-locale number/currency formatters (`formatKr`, `formatMeters`, `formatKg`, `formatNumber1`) used by the above.
7. **`+page.svelte`** — assembles all sections (background, drawing, materials, cost table, instructions) and imports from the modules above; it contains no derivation logic itself.

When changing a physical dimension, change it in `dimensions.ts` — the plan drawing and material quantities/costs update automatically. When adding a priced material, add it to the `PRICE` table and a corresponding row/quantity calculation in `materials.ts`.

Path alias: `#lib` / `#lib/*` maps to `src/lib` (see `package.json` `imports` and used in `+layout.svelte` for the favicon).

## Svelte specifics

- Svelte 5 runes mode is forced project-wide via `vite.config.ts` (`compilerOptions.runes`), except inside `node_modules`.
- `experimental: { async: true }` and SvelteKit `remoteFunctions` are enabled in `vite.config.ts`.
- Use the Svelte MCP server tools (`list-sections`/`get-documentation`/`svelte-autofixer`) when writing or editing Svelte code, per `AGENTS.md`.

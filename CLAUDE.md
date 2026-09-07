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

1. **`dimensions.ts`** — the single source of truth for all physical measurements (tile size/pitch, post width, enclosure width/depth in tiles and meters, post positions, fence corner/anchor points, the city's `KRAV_*` requirements, etc.). Every other module derives from constants here; do not hardcode a measurement elsewhere if it can be computed from `dimensions.ts`. It also exports the `Rect` type and `centeredSquare`, plus `BORTRE_STOLPAR`/`FRAMRE_STOLPAR` (the two fence sides' plinth posts) so nothing has to re-derive them by comparing coordinates.
2. **`bins.ts`** — recycling bin sizes and the bin row, laid out by folding gap + width along the enclosure rather than by hardcoded x-positions. Also derives `MIN_INHAGNAD_WIDTH`/`MIN_INHAGNAD_DEPTH`, the minimum enclosure the bins and the city's clearances require.
3. **`plan-view.ts`** — converts the real-world meter coordinates from `dimensions.ts`/`bins.ts` into SVG viewBox coordinates (`planX`/`planY`, `PLAN_SCALE`), lays out derived shapes (shed, plints, cladding boards) for rendering, defines `DIM_LANES` (the lanes annotations sit in, which also size the viewBox margins), and defines the `Layer` names and `Annotation` types (dimension lines, callouts, field labels).
4. **`steps.ts`** — the ten build steps: for each, its title, text, which `Layer`s are visible and which `Annotation`s (measurements) are shown. All measurement values in both the annotations and the prose are computed from `dimensions.ts`/`bins.ts`/`materials.ts`. `OVERVIEW_LAYERS` is the final step's layers.
5. **`PlanDrawing.svelte`** — renders one scene as an `<svg>`: takes `layers` and `annotations` props and draws the always-present base (shed, asphalt, existing fence) plus the requested layers. Used for the overview (no annotations) and for every step. It renders more than once per page, so its SVG pattern ids are prefixed with `$props.id()`.
6. **`StepViewer.svelte`** — the stepper in the instructions section: shows one step at a time from `steps.ts` with prev/next buttons and arrow keys.
7. **`materials.ts`** — bill-of-materials: quantities are computed from `dimensions.ts` (tile counts, post counts, etc.) and multiplied by a hardcoded `PRICE` table to produce the cost table (`quantities.bomGroups`) and descriptive facts (`FACTS`) shown on the page.
8. **`format.ts`** — all Swedish-locale number/currency formatting (`formatKr`, `formatMeters`, `formatMetersTrimmed`, `formatLength`, `formatCm`, `formatMm`, `formatSection`, `formatKg`, `formatNumber1`, `formatNumberTrimmed`) plus `listJoin`. Formatting helpers belong here, not defined locally in a module that needs one.
9. **`+page.svelte`** — assembles all sections (background, drawing, materials, cost table, instructions) and imports from the modules above; it contains no derivation logic itself. Even the background prose pulls the bin sizes and the derived minimum enclosure from `bins.ts`/`dimensions.ts`.

When changing a physical dimension, change it in `dimensions.ts` — the plan drawing, the step drawings, the step prose and material quantities/costs update automatically. When changing what a step shows or measures, edit `steps.ts`, not the Svelte components. When adding a priced material, add it to the `PRICE` table and a corresponding row/quantity calculation in `materials.ts`.

Post positions and bay widths are rounded to a tenth of a millimetre (`roundMm` in `dimensions.ts`) so that measurements which are physically equal compare equal — the cut list in `materials.ts` groups pieces by length, and raw floating-point results made identical bays print as separate groups.

Path alias: `#lib` / `#lib/*` maps to `src/lib` (see `package.json` `imports` and used in `+layout.svelte` for the favicon).

## Svelte specifics

- Svelte 5 runes mode is forced project-wide via `vite.config.ts` (`compilerOptions.runes`), except inside `node_modules`.
- `experimental: { async: true }` and SvelteKit `remoteFunctions` are enabled in `vite.config.ts`.
- Use the Svelte MCP server tools (`list-sections`/`get-documentation`/`svelte-autofixer`) when writing or editing Svelte code, per `AGENTS.md`.

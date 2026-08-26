# Squab Social Creator

A browser-based workflow for planning, creating, reviewing and exporting Squab Storage Bridgwater social content.

## V2 development rebuild

The editable application source has now been reconstructed under `source/` on the V2 development branch. The working workflow keeps the existing batch-first process while expanding the artwork system to 24 templates across 12 genuinely different design families.

V2 includes:

- guided five-step batch and one-off workflow
- 15 campaign-direction presets
- prepared ChatGPT prompt and structured JSON import
- legacy template-ID compatibility
- 24 artwork templates across 12 layout families
- official Squab logo treatment in a controlled non-photographic zone
- reusable local photography library
- saved campaign library
- editable copy, objectives, CTA, dates and output formats
- portrait, square and LinkedIn artwork generation
- per-post and batch QA
- contact sheet, captions, schedule and campaign JSON exports
- complete ZIP publishing pack with PNG artwork and instructions
- human approval before anything is scheduled or published

The live public app remains the version deployed from `main`. Development work must stay off `main` until it has been reviewed and explicitly approved.

## Development

```bash
npm install
npm run typecheck
npm run dev
npm run build
```

Vite uses `source/` as the application root and writes the production build to `dist/`. The GitHub Pages deployment workflow is prepared to publish `dist/` only after approved changes eventually reach `main`.

The product boundaries and workflow are documented in [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md), with the expanded design direction in [`DESIGN_SYSTEM_V2_PLAN.md`](DESIGN_SYSTEM_V2_PLAN.md).

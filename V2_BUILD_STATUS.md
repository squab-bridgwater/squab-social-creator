# V2 build status

This branch is development-only. It must not be merged to `main` until visual review and explicit human approval are complete.

## Implemented

- Maintainable Vite/React/TypeScript source under `source/`
- Existing five-stage content workflow reconstructed
- Nine-post batch and quick one-off modes
- 15 campaign-direction presets
- Brand/tonality-aware ChatGPT prompt generation
- Structured JSON import with legacy template compatibility
- Reusable photograph library and campaign library
- 24 templates across 12 distinct design families
- Official Squab logo asset rendered only in a clean solid footer zone
- Portrait, square and LinkedIn formats
- Per-post and batch QA including the approved 3/3/3 objective mix
- PNG artwork, captions, CSV schedule, contact-sheet PNG and complete ZIP publishing pack
- Future GitHub Pages workflow prepared to build from source when an approved version eventually reaches `main`

## Design QA

The V2 artwork system has been pushed away from flat colour swaps and now uses genuinely different compositions, including photo-led layouts, editorial splits, typographic posters, problem/solution formats, layered cards, benefit grids, quotes, step-based layouts, local/human stories, trust/pricing treatments and stronger CTA layouts.

Brand styling uses the approved Lato family, Squab palette, orange gradient, organic curves, layered cards, controlled shadows and clean logo treatment. The logo is not redrawn, circled, shadowed or placed directly over photography.

## Validation

A development-only validation workflow is present. The first GitHub Actions attempt failed before any build steps were executed, so the source still requires a clean CI typecheck/build before it can be considered technically release-ready. This does not affect the existing live site because `main` has not been changed.

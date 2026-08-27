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

The 24-template contact sheet has been manually reviewed for overall family separation, hierarchy, spacing and logo treatment. The placeholder imagery used for QA is deliberately generic and is not publication imagery.

## Validation

The development branch now passes the full GitHub Actions validation workflow:

- dependency installation: pass
- TypeScript typecheck: pass
- production Vite build: pass
- release-review artifact creation: pass

The built review artifact is retained by GitHub Actions for seven days. No deployment is performed from this branch.

## Current gate

Technical validation is complete. The remaining gate is human visual approval of the expanded template direction before any pull request is created or retargeted toward `main`.

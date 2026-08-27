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
- 12 high-impact dynamic art-direction systems replacing the rejected flat/template-slide direction
- Official Squab logo asset rendered only in a clean solid footer zone
- Portrait, square and LinkedIn formats
- Per-post and batch QA including the approved 3/3/3 objective mix
- PNG artwork, captions, CSV schedule, contact-sheet PNG and complete ZIP publishing pack
- Future GitHub Pages workflow prepared to build from source when an approved version eventually reaches `main`

## Current art direction

The earlier 24-template visual direction was rejected during human review because it felt too much like PowerPoint/presentation design. The application architecture was retained, but the artwork registry and renderer have now been rebuilt around 12 stronger social-native creative territories:

1. Bold Impact
2. Real People
3. The Transformation
4. Local Pride
5. Lifestyle Freedom
6. What Fits
7. Seasonal Moments
8. Business & Workspace
9. Trust & Security
10. Creative / Tactile
11. Minimal & Striking
12. Playful & Unexpected

The new renderer uses cinematic full-bleed imagery, oversized/cropped typography, torn-paper devices, marker strokes, asymmetry, dramatic scale, editorial splits, industrial crops, tactile collage and stronger foreground/background interaction. The direction picker now describes each creative territory rather than presenting a library of flat slide layouts.

The content-generation prompt has also been updated so ChatGPT writes short artwork copy and cinematic image briefs that support these art directions instead of producing copy that implies brochure grids or dense information panels.

## Brand guardrails

- Approved Squab palette and Lato typography remain hard constraints.
- Genuine Squab logo artwork is used.
- The logo is not redrawn, circled, shadowed, recoloured or placed directly on photography.
- The footer provides a controlled solid logo zone across creative directions.
- Legacy template IDs are mapped into the new system so older campaign JSON remains usable.

## Validation

The current development branch passes the GitHub Actions validation workflow:

- dependency installation: pass
- TypeScript typecheck: pass
- production Vite build: pass
- release-review artifact creation: pass

No deployment is performed from this branch and `main` remains untouched.

## Current gate

The next gate is visual review of the 12 hero art directions inside the rebuilt application. Only after those 12 are approved should each territory be expanded into three to four executions and prepared for eventual release approval.

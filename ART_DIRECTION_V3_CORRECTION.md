# Art Direction V3 correction

## Why the current app preview missed the approved concept direction

The generated concept boards were image-led campaign art direction. They relied on cinematic photography, subject separation, rich image treatment, tactile collage, expressive composition and strong visual hierarchy.

The current app renderer translated those concepts too literally into simple SVG blocks, flat colour fields and one generic photo slot. That produced a presentation-slide look and did not faithfully reproduce the energy of the approved concept boards.

## Non-negotiable correction

Do not multiply the current renderer into more variants.

The next renderer must be built around the image first, not the card/layout first.

Each art-direction family should specify:

- required image type and focal subject
- preferred crop behaviour
- foreground/background layering rules
- typographic scale behaviour
- text/image overlap rules
- texture and graphic treatment
- content density limits
- fallback behaviour when the required imagery is missing

## Production principle

A template is not a set of rectangles. It is an art-direction recipe.

The app should treat a selected creative family as a composition system that adapts around the content and image rather than as a static slide.

## Immediate UX correction

- Do not present missing-photo templates as if they are finished creative.
- Photo-dependent directions should display a strong "photo required" state in the editor and should not be included in a review contact sheet until an image has been assigned.
- Separate image-led, type-led and tactile/collage directions clearly.
- Use the approved concept board as the quality benchmark for every family.

## Technical direction

The V3 renderer should support multiple compositing layers:

1. background image or colour field
2. optional secondary crop / duplicate image treatment
3. optional subject or foreground layer
4. organic mask / tear / crop path
5. brand graphic strokes and texture overlays
6. headline layer
7. supporting copy layer
8. controlled logo lockup

Where true subject cut-outs are required, the app must either accept a transparent PNG/WebP supplied by the user or use a deliberately designed crop that does not pretend to be a cut-out.

The app must not fake cinematic photography with empty boxes.

## Review gate

Before expanding to 36-48 executions, build six production-quality hero directions that can be judged directly against the approved concept moodboard. Only after those six pass visual review should the remaining directions be scaled out.

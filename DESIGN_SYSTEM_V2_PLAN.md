# Squab Social Creator - Design System V2 Plan

## Scope

Preserve the existing app workflow and process map. Upgrade the artwork system so campaigns have substantially more visual variety, stronger brand consistency and a more polished, designer-led feel.

This work remains isolated on `dev/source-recovery` until reviewed and approved. The live `main` branch is not to be changed during development.

## Current-state audit

The current compiled app exposes six artwork treatments:

- Photo Impact
- Photo Impact Light
- Editorial Curve
- Editorial Curve Dark
- Bold Split
- Bold Split Light

These are effectively three base compositions with light/dark variants. That creates only limited visual variety across a nine-post batch and explains why different campaigns can feel repetitive.

The current post data model is useful and should be retained where possible. It already contains:

- service and topic
- objective and CTA type
- eyebrow
- headline
- answer
- supporting line
- badge copy and location
- three short benefits
- footer title and line
- one primary image
- caption and image brief
- date, time, formats and publication status

## Brand rules for V2

The uploaded Squab Brand Guidelines and Social Content Studio Handover remain the governing source for hard brand rules.

- Lato family only for social creative: Black/Heavy for major titles, Bold for supporting headings and Regular for body copy.
- Core colours: #f4941e, #e95822, #fabd75, #fddfb7, #000000, #313131, #d2d2d2 and #ffffff.
- Approved orange gradient: #f4941e to #e95822.
- Use genuine Squab logo assets only.
- Do not redraw, distort, recolour, rotate, shadow or apply effects to the logo.
- Maintain the required clear space around the logo.
- Do not place the logo directly over photography.
- Remove decorative circles, badges or other shapes that make the logo look as though it has an unapproved background device.
- Images should show a real storage problem, transition or customer need rather than a spotless finished room.
- Keep artwork concise and readable at phone size.

The current Squab Storage website is a secondary contemporary reference for visual direction and messaging. It reinforces clean orange/black/white contrast, large imagery, straightforward headings, practical service blocks and the themes of clear pricing, real people, flexible storage and professional facilities. Website styling should inspire the new templates without overriding the formal brand guidelines.

## Proposed V2 template library

Target: 24 artwork templates in 12 genuinely different families. Do not create a library made mostly from colour swaps.

### 1. Immersive Photo
- Full-bleed Hero
- Framed Hero

Large customer-situation photography with a controlled text zone and clean logo lockup.

### 2. Editorial Split
- Offset Split
- Vertical Split

Magazine-style layouts using asymmetric image and typography blocks.

### 3. Typographic Poster
- Big Statement
- Quiet Statement

Headline-led posts for strong awareness messages, pricing principles and brand statements.

### 4. Problem / Solution
- Before and After
- Problem Card

Visual storytelling that makes the storage need obvious within two seconds.

### 5. Card Stack
- Advice Stack
- FAQ Stack

Layered cards for practical advice, FAQs and short educational posts.

### 6. Benefit Grid
- Three Benefits
- Feature Spotlight

Useful for business storage, security, access and service explanations without becoming brochure-like.

### 7. Review / Human Proof
- Review Spotlight
- Human Quote

For genuine reviews, customer comments and local staff messages. Staff imagery must be genuine Squab photography before publication.

### 8. Steps / Process
- Three Steps
- Journey Path

For how-it-works content, moving preparation, storage process and practical guidance.

### 9. Local Story
- Team Story
- Bridgwater Spotlight

People-led and community-led templates with stronger local identity.

### 10. Trust / Pricing
- Price Charter
- Clear Choice

Premium, restrained layouts for transparent pricing, comparisons and reassurance.

### 11. Campaign / CTA
- Service Spotlight
- Action Panel

Clear conversion layouts with enough energy for a call to action without pressure or fake urgency.

### 12. Lifestyle Editorial
- Moving Journal
- Business Journal

More expressive editorial compositions for moving-day disruption, downsizing, business stock and seasonal stories.

## Selection experience

The current small two-column list of six template buttons should become a visual template browser.

Recommended behaviour:

1. Group templates by family or purpose.
2. Show a useful thumbnail preview rather than an abstract colour swatch only.
3. Allow filtering by suitable use, for example Photo-led, Advice, Trust, Business, Local, CTA.
4. Keep all templates available manually.
5. Let the app recommend a small subset based on the post objective and content, without locking the user into it.
6. Avoid using the same family repeatedly in an automatically generated nine-post batch unless the user chooses to do so.

## Automatic variety rules

For a standard nine-post batch:

- use at least six different template families where content permits
- do not use the same exact template twice unless manually selected
- do not place visually similar templates next to each other in the publishing order
- balance light, dark, image-led and type-led pages across the contact sheet
- reserve stronger CTA layouts for conversion posts
- use calmer editorial or photo-led layouts for awareness posts

## Logo cleanup

The new renderer should centralise logo handling rather than allowing every template to improvise it.

Create a shared logo-placement component/function with:

- approved black and white transparent logo assets
- fixed minimum clear-space rule
- approved placement zones
- automatic choice of black or white version based on the solid background beneath it
- no circular backing shapes
- no drop shadows or filters
- no logo directly on a photograph

## Architecture direction

Rebuild the missing editable source as a maintainable Vite/React project on the development branch.

Suggested structure:

- `source/data/` campaign presets, facts and content schema
- `source/brand/` colours, typography rules and approved logo assets/references
- `source/templates/` one renderer per template family
- `source/templates/registry` template metadata, categories and recommendations
- `source/render/` shared canvas helpers, image fitting, typography and logo placement
- `source/components/` existing workflow UI
- `source/export/` PNG/contact sheet/publishing pack logic

The live behaviour should remain compatible with existing saved campaign JSON where practical. Existing six template IDs should remain supported as legacy templates or be mapped safely to their nearest V2 equivalents.

## QA requirements

Every new template must be tested for:

- 1080 x 1350 portrait output
- square and LinkedIn variants where supported
- short and near-maximum headline lengths
- no text clipping or overlap
- phone-size readability
- correct logo exclusion zone and treatment
- correct approved colours and Lato typography
- sensible image cropping
- graceful handling when a photo is missing
- correct ZIP and contact-sheet rendering
- compatibility with existing post content fields

## Development order

1. Recover/reconstruct editable source structure from the current compiled app behaviour.
2. Preserve the current workflow and JSON/import/export behaviour.
3. Centralise brand tokens and logo handling.
4. Rebuild the existing six treatments in maintainable source as compatibility templates.
5. Build the 12 V2 template families and 24 variants.
6. Add the improved visual template browser and recommendation logic.
7. QA a complete nine-post batch as a contact sheet.
8. Present the development version for human review.
9. Only after explicit approval should a pull request be considered for `main`.

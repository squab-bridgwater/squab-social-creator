# V2 template renderer contract

Every artwork renderer must use the shared brand tokens and shared logo renderer.

## Required content compatibility

Templates should consume the existing post fields wherever relevant:

- `eyebrow`
- `headline`
- `answer`
- `support`
- `badgeTop`
- `badgeBottom`
- `benefits[3]`
- `footerTitle`
- `footerLine`
- `image`
- `objective`
- `service`
- `subtopic`

No V2 template should require a new content field merely to render successfully. New optional fields may be introduced later only with backwards-compatible defaults.

## Logo rule

Do not draw the Squab logo directly in an individual template. Reserve a solid light or dark logo zone and call `drawApprovedLogo`. Do not add a circle, card, pill, shadow, outline or filter behind the logo.

## Image rule

Image-led templates should favour photography that visibly communicates the storage need, transition or customer situation. The renderer must provide a graceful branded fallback if an image is absent.

## Phone-size rule

Artwork should remain understandable when reduced to roughly 320px wide. The primary message must not depend on small supporting copy.

## Variety rule

The registry family is a meaningful composition family, not merely a colour variant. Automated batches should avoid adjacent repeats and should aim for at least six families across nine posts.

## QA gates before review

- 1080 x 1350 portrait render works
- supported square/LinkedIn render works
- maximum-length headline does not clip
- benefits do not overlap
- logo has a solid background and clear space
- no decorative logo backing device
- image crop remains sensible
- missing image has a deliberate fallback
- export filename and publishing-pack integration remain compatible

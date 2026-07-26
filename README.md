# Squab Social Creator

A free, browser-based workflow for planning, creating, reviewing and exporting
Squab Storage Bridgwater social content.

The app includes 15 campaign-style presets, automatic topic planning, optional
priority controls, a verified facts library, reusable local photography, saved
campaign management, six artwork systems, publishing statuses and multi-format
exports.

Public website:

https://squab-bridgwater.github.io/squab-social-creator/

The working agreement and product boundaries are documented in
[`PROJECT_BRIEF.md`](PROJECT_BRIEF.md).

## Development

```bash
npm install
npm run dev
npm run build
```

The editable application source is under `source/`. The Vite build produces a
self-contained `dist/index.html`. Copy that file to the repository root before
deployment because GitHub Pages publishes the root `index.html`.

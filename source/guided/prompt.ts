import { creativeDirections } from './matrix';
import type { GuidedAnswers } from './types';

const label = (value?: string) => value ? value.replace(/-/g,' ').replace(/\b\w/g, char => char.toUpperCase()) : '';

export function buildGuidedCreativeBrief(answers: GuidedAnswers): string {
  const direction = creativeDirections.find(item => item.id === answers.creativeDirection);
  const formatNote = answers.format === 'feed-story'
    ? 'Create a 1080x1350 4:5 feed master and a separately composed 1080x1920 Story version.'
    : answers.format === 'all'
      ? 'Create separate 1080x1350 4:5, 1080x1080 square and 1080x1920 Story compositions. Recompose intelligently for each ratio; never squash the same layout.'
      : answers.format === 'instagram'
        ? 'Create a 1080x1350 Instagram feed post.'
        : answers.format === 'facebook'
          ? 'Create a Facebook-ready feed post using a 1080x1350 4:5 master unless the concept clearly requires square.'
          : 'Create a 1080x1350 4:5 Instagram/Facebook feed post.';

  const imageRule = answers.imageStrategy === 'conceptual-generated'
    ? 'Generate clearly conceptual campaign imagery. It must not invent or imply fake Squab premises, doors, uniforms, signage, security features or staff.'
    : answers.imageStrategy === 'squab-photo'
      ? 'Use only genuine approved Squab photography for any physical premises, staff, storage doors, workspace or security details.'
      : answers.imageStrategy === 'upload-photo'
        ? 'Use the user-supplied photograph as the source image and art-direct around it rather than replacing identifiable Squab details.'
        : answers.imageStrategy === 'lifestyle-location'
          ? 'Use believable lifestyle or location imagery that does not falsely depict Squab premises.'
          : 'Choose the strongest compliant imagery. Never fabricate Squab premises, staff, signage or physical facility details.';

  return `You are the Squab Social Creative Director. Create one finished social media post from the guided brief below.

GUIDED SELECTIONS
Objective: ${label(answers.objective)}
Audience: ${label(answers.audience)}
Subject: ${label(answers.subject)}
Message angle: ${label(answers.angle)}
Creative direction: ${direction ? `${direction.label} — ${direction.short}` : 'Choose the strongest approved direction'}
Imagery: ${label(answers.imageStrategy)}
CTA: ${label(answers.cta)}
Format: ${label(answers.format)}

HARD SQUAB BRAND RULES
- Use the uploaded Squab Brand Guidelines, brand tonality, pricing charter, FAQs and other Squab project sources as governing context.
- Use approved Squab colours only.
- Use Lato family typography only unless an approved source explicitly requires otherwise.
- Use the genuine supplied Squab logo artwork exactly. Do not redraw, approximate, stylise, distort or generate the logo.
- Never add circles, badges, shadows or decorative backing shapes behind the logo unless they are part of the official supplied artwork.
- Never fabricate Squab storage doors, premises, uniforms, signage, team members or security equipment.
- Keep claims factual and supported by the supplied Squab sources.

APPROVED VISUAL BENCHMARK
Match the ambition and finished-artwork quality of the approved 12-panel Squab social proof board. The proof board is the benchmark for image dominance, type scale, depth, cinematic treatment, collage, marker energy, texture, visual storytelling and scroll-stopping composition.
Reject anything resembling PowerPoint, a brochure, a dashboard, SaaS graphics, flat corporate cards, generic Canva templates or obviously AI-generated layouts.

IMAGE RULE
${imageRule}

OUTPUT RULE
${formatNote}

CREATIVE PROCESS
1. Write the shortest strong on-artwork headline appropriate to the objective and audience.
2. Choose a visual concept that can be understood in about one second.
3. Generate or compose the main campaign image first.
4. Finish with exact Squab typography, logo and concise supporting elements.
5. Keep artwork copy minimal. Put detail in the caption, not on the image.
6. Produce a concise natural UK-English caption and the selected CTA.
7. Critically QA the artwork before presenting it. If it looks flat, generic, fake-Squab, off-brand or materially weaker than the approved proof board, reject it and regenerate internally.

Return the finished social artwork, followed by the final caption and a short note naming the creative direction used.`;
}

export function buildGuidedSummary(answers: GuidedAnswers) {
  const direction = creativeDirections.find(item => item.id === answers.creativeDirection);
  return {
    objective: label(answers.objective),
    audience: label(answers.audience),
    subject: label(answers.subject),
    angle: label(answers.angle),
    creativeDirection: direction?.label ?? 'GPT recommendation',
    imageStrategy: label(answers.imageStrategy),
    cta: label(answers.cta),
    format: label(answers.format),
  };
}

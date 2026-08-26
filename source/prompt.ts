import type { Campaign } from './types';
import type { CampaignPreset } from './data/presets';
import { templates } from './templates/registry';
import { verifiedFacts } from './data/presets';

export function buildCampaignPrompt(campaign: Campaign, preset: CampaignPreset): string {
  const templateIds = templates.map(t => t.id).join(', ');
  const count = campaign.mode === 'one-off' ? 1 : 9;
  return `Create ${count === 1 ? 'one social post' : 'a nine-post social content package'} for Squab Storage Bridgwater.

CAMPAIGN
- Name: ${campaign.name}
- Style: ${preset.name}
- Direction: ${preset.guidance}
- Season/current context: ${campaign.season || 'Not specified'}
- Local focus: ${campaign.localFocus || 'Bridgwater, Somerset'}
- Platforms: ${campaign.platforms || 'Facebook and Instagram'}

BRAND AND TONE
- Warm, calm, clear, practical and human.
- Use plain English and a light touch. Never use fake urgency or aggressive sales language.
- Benefits before feature dumping.
- Keep the artwork copy concise enough to work at phone size.
- The artwork uses Lato and approved Squab orange/black/white brand colours.
- Imagery should show the genuine reason storage is useful, such as moving pressure, renovation disruption, business stock or lack of space. Avoid spotless empty rooms.

VERIFIED FACTS
${verifiedFacts.map(fact => `- ${fact}`).join('\n')}

CONTENT MIX
For a nine-post batch, create a useful balance of awareness, engagement and conversion content. Do not make every post promotional. Use a mixture of household storage, business storage and other relevant Squab services where it makes sense for this campaign direction.

CTA RULES
Use a mixture of awareness-only, soft engagement and conversion CTAs. Keep contact details in captions rather than crowding the artwork.

TEMPLATE IDS
Choose an appropriate template ID for every post from this list only:
${templateIds}
Use strong variety across a batch. Do not repeat the same exact template in a nine-post batch unless absolutely necessary.

OUTPUT
Return valid JSON only with this structure:
{
  "name": "${campaign.name}",
  "mode": "${campaign.mode}",
  "startDate": "${campaign.startDate}",
  "season": "${campaign.season}",
  "localFocus": "${campaign.localFocus}",
  "platforms": "${campaign.platforms}",
  "posts": [
    {
      "id": "post-1",
      "name": "Short internal post name",
      "service": "Self Storage",
      "subtopic": "Specific useful topic",
      "objective": "Awareness",
      "template": "full-bleed-hero",
      "eyebrow": "Short eyebrow",
      "headline": "Main artwork headline",
      "answer": "Short supporting answer",
      "support": "Short supporting line",
      "badgeTop": "Optional short badge",
      "badgeBottom": "BRIDGWATER",
      "benefits": [
        {"title":"Short title","body":"Short practical explanation"},
        {"title":"Short title","body":"Short practical explanation"},
        {"title":"Short title","body":"Short practical explanation"}
      ],
      "footerTitle": "Squab Storage Bridgwater",
      "footerLine": "Short local reassurance",
      "imageBrief": "Specific realistic image brief",
      "caption": "Complete Facebook/Instagram caption with suitable hashtags",
      "suggestedDate": "YYYY-MM-DD",
      "suggestedTime": "HH:MM",
      "ctaType": "Awareness only",
      "contactDetails": "",
      "formats": ["portrait"],
      "publicationStatus": "Draft"
    }
  ]
}

Return exactly ${count} post${count === 1 ? '' : 's'}. Each post must contain exactly three benefits. Do not invent facilities, offers, discounts, prices or opening hours.`;
}

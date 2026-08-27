import type { Campaign } from './types';
import type { CampaignPreset } from './data/presets';
import { templates } from './templates/registry';
import { verifiedFacts } from './data/presets';

export function buildCampaignPrompt(campaign: Campaign, preset: CampaignPreset): string {
  const directions = templates.map(t => `- ${t.id}: ${t.artDirection}`).join('\n');
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
- Warm, calm, clear, empathetic, practical and human: "warm with a wink" when gentle humour fits naturally.
- Use plain English, short sentences and quiet confidence.
- Never use fake urgency, pressure, corporate jargon, exaggerated claims or excessive exclamation marks.
- Lead with how life becomes easier, then explain relevant features.
- Keep artwork copy concise enough to work at phone size.
- Artwork uses Lato and the approved Squab orange, black, charcoal and white brand system.
- Imagery must show the customer's genuine problem or transition, such as moving pressure, renovation disruption, downsizing decisions, business stock or lack of space. Avoid spotless empty rooms and generic luxury interiors.

CREATIVE DIRECTION
The artwork system is built around premium social art direction, not presentation layouts. Write copy and image briefs that support dramatic scale, cinematic photography, cropped typography, editorial collage, tactile marks, asymmetry, visual metaphors and social-native energy where appropriate. Do not write content that needs a dense grid, brochure panel or long list to make sense.

VERIFIED FACTS
${verifiedFacts.map(fact => `- ${fact}`).join('\n')}

CONTENT MIX
${count === 9 ? `Create exactly three Awareness posts, three Engagement posts and three Conversion posts.
- Awareness: useful or reassuring content with no hard CTA.
- Engagement: invite a message, comment or conversation.
- Conversion: use a calm, clear quote, call or website action, especially where service, pricing or local help makes that appropriate.` : `Choose the objective that best fits this one-off post. Do not force a conversion CTA if awareness or engagement is more appropriate.`}
Use the selected campaign direction and seasonality to choose the service/topic weighting. Do not use a permanently fixed service balance.

CTA RULES
- Keep contact information mainly in the caption rather than crowding the artwork.
- Facebook can use a website link, message action or telephone CTA.
- Instagram should favour a direct message or link-in-profile wording because caption links are not clickable.
- Do not invent a phone number or enquiry URL. Only include contact details when supplied and verified.

ART-DIRECTION IDS
Choose the strongest creative direction for each post from this list only:
${directions}
For a nine-post batch, use at least six different art-direction families. Avoid repeating the same exact direction unless the content genuinely demands it. Vary the emotional rhythm of the feed: some cinematic, some tactile, some minimal, some playful, some people-led.

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
      "template": "bold-impact",
      "eyebrow": "Short eyebrow",
      "headline": "Short high-impact artwork headline",
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
      "imageBrief": "Specific realistic cinematic image brief with subject, setting, action, crop and visual tension",
      "caption": "Complete platform-ready caption with suitable hashtags",
      "suggestedDate": "YYYY-MM-DD",
      "suggestedTime": "HH:MM",
      "ctaType": "Awareness only",
      "contactDetails": "",
      "formats": ["portrait"],
      "publicationStatus": "Draft"
    }
  ]
}

Return exactly ${count} post${count === 1 ? '' : 's'}. Each post must contain exactly three benefits. Do not invent facilities, offers, discounts, prices, phone numbers, URLs or opening hours.`;
}

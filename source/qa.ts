import type { Campaign, QaResult, SocialPost } from './types';
import { templates } from './templates/registry';

const templateIds = new Set(templates.map(template => template.id));

export function qaPost(post: SocialPost): QaResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const definition = templates.find(template => template.id === post.template);
  if (!post.headline.trim()) errors.push('Headline is missing.');
  if (!templateIds.has(post.template)) errors.push('Template is not recognised.');
  if (post.benefits.length !== 3) errors.push('Exactly three supporting benefits are required.');
  if (post.headline.length > 72) warnings.push('Headline is long and needs a visual clipping check.');
  if (post.answer.length > 170) warnings.push('Answer copy is dense for phone-size artwork.');
  if (post.eyebrow.length > 28) warnings.push('Eyebrow is long for the artwork.');
  if (post.benefits.some(item => item.title.length > 24 || item.body.length > 72)) warnings.push('A benefit may be too long for its layout.');
  if (!post.image && definition?.imageLed) errors.push('This art direction requires a real photograph before artwork can be approved.');
  if (post.template === 'transformation' && !post.secondaryImage) errors.push('Transformation requires a second, genuinely different after photograph.');
  if (!post.caption.trim()) warnings.push('Caption is empty.');
  if (post.caption.length > 1800) warnings.push('Caption is unusually long.');
  if (!post.suggestedDate || !post.suggestedTime) warnings.push('Publishing date or time is missing.');
  if (!post.formats.length) errors.push('No output format is selected.');
  if (post.objective === 'Awareness' && /quote|call|website|book|reserve/i.test(post.ctaType)) warnings.push('Awareness post has a stronger conversion-style CTA.');
  if (post.objective === 'Conversion' && /awareness only|none|no cta/i.test(post.ctaType)) warnings.push('Conversion post has no clear conversion CTA.');
  return { errors, warnings };
}

export function qaCampaign(campaign: Campaign): QaResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const families = new Set(campaign.posts.map(post => templates.find(template => template.id === post.template)?.family).filter(Boolean));
  const ids = campaign.posts.map(post => post.template);
  const headlines = campaign.posts.map(post => post.headline.trim().toLowerCase()).filter(Boolean);
  if (campaign.mode === 'batch' && campaign.posts.length !== 9) errors.push(`Nine-post batches must contain exactly nine posts. This campaign contains ${campaign.posts.length}.`);
  if (campaign.mode === 'one-off' && campaign.posts.length !== 1) errors.push('One-off campaigns must contain exactly one post.');
  campaign.posts.forEach((post, index) => { const result = qaPost(post); result.errors.forEach(item => errors.push(`Post ${index + 1}: ${item}`)); result.warnings.forEach(item => warnings.push(`Post ${index + 1}: ${item}`)); });
  if (campaign.mode === 'batch' && campaign.posts.length === 9) {
    const objectiveCounts = campaign.posts.reduce<Record<string, number>>((counts, post) => { counts[post.objective] = (counts[post.objective] ?? 0) + 1; return counts; }, {});
    if ((objectiveCounts.Awareness ?? 0) !== 3 || (objectiveCounts.Engagement ?? 0) !== 3 || (objectiveCounts.Conversion ?? 0) !== 3) warnings.push(`Approved CTA mix is 3 Awareness, 3 Engagement and 3 Conversion posts. Current mix is ${objectiveCounts.Awareness ?? 0}/${objectiveCounts.Engagement ?? 0}/${objectiveCounts.Conversion ?? 0}.`);
    if (families.size < 6) warnings.push('Nine-post batches should normally use at least six template families.');
  }
  if (new Set(ids).size < ids.length) warnings.push('One or more exact templates are repeated in this batch.');
  if (new Set(headlines).size < headlines.length) warnings.push('One or more headlines are repeated in this campaign.');
  for (let i = 1; i < campaign.posts.length; i++) { const previous = templates.find(template => template.id === campaign.posts[i - 1].template)?.family; const current = templates.find(template => template.id === campaign.posts[i].template)?.family; if (previous && previous === current) warnings.push(`Posts ${i} and ${i + 1} use the same template family consecutively.`); }
  return { errors, warnings };
}

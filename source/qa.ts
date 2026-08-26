import type { Campaign, QaResult, SocialPost } from './types';
import { templates } from './templates/registry';

const templateIds = new Set(templates.map(template => template.id));

export function qaPost(post: SocialPost): QaResult {
  const errors: string[] = []; const warnings: string[] = [];
  if (!post.headline.trim()) errors.push('Headline is missing.');
  if (!templateIds.has(post.template)) errors.push('Template is not recognised.');
  if (post.headline.length > 82) warnings.push('Headline is long and needs a visual clipping check.');
  if (post.answer.length > 190) warnings.push('Answer copy is dense for phone-size artwork.');
  if (post.benefits.some(item => item.title.length > 28 || item.body.length > 80)) warnings.push('A benefit may be too long for its layout.');
  if (!post.image && templates.find(template => template.id === post.template)?.imageLed) warnings.push('This template is photo-led but no image is assigned.');
  if (!post.caption.trim()) warnings.push('Caption is empty.');
  if (!post.suggestedDate || !post.suggestedTime) warnings.push('Publishing date or time is missing.');
  if (!post.formats.length) errors.push('No output format is selected.');
  return { errors, warnings };
}

export function qaCampaign(campaign: Campaign): QaResult {
  const errors: string[] = []; const warnings: string[] = [];
  const families = new Set(campaign.posts.map(post => templates.find(template => template.id === post.template)?.family).filter(Boolean));
  const ids = campaign.posts.map(post => post.template);
  campaign.posts.forEach((post, index) => {
    const result = qaPost(post);
    result.errors.forEach(item => errors.push(`Post ${index + 1}: ${item}`));
    result.warnings.forEach(item => warnings.push(`Post ${index + 1}: ${item}`));
  });
  if (campaign.mode === 'batch' && campaign.posts.length >= 9 && families.size < 6) warnings.push('Nine-post batches should normally use at least six template families.');
  if (new Set(ids).size < ids.length) warnings.push('One or more exact templates are repeated in this batch.');
  for (let i = 1; i < campaign.posts.length; i++) {
    const a = templates.find(template => template.id === campaign.posts[i - 1].template)?.family;
    const b = templates.find(template => template.id === campaign.posts[i].template)?.family;
    if (a && a === b) warnings.push(`Posts ${i} and ${i + 1} use the same template family consecutively.`);
  }
  return { errors, warnings };
}

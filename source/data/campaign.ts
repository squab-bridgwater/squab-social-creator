import type { Campaign, SocialPost } from '../types';
import { normaliseTemplateId, templates } from '../templates/registry';

const STORAGE_KEY = 'squab-social-creator-v2-campaign';
const templateIds = new Set(templates.map(template => template.id));

function asText(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function normalisePost(raw: any, index: number): SocialPost {
  const template = normaliseTemplateId(asText(raw?.template, 'full-bleed-hero'));
  return {
    id: asText(raw?.id, `post-${index + 1}`),
    name: asText(raw?.name, `Post ${index + 1}`),
    service: asText(raw?.service, 'Self Storage'),
    subtopic: asText(raw?.subtopic) || undefined,
    objective: ['Awareness', 'Engagement', 'Conversion'].includes(raw?.objective) ? raw.objective : 'Awareness',
    template: templateIds.has(template) ? template : 'full-bleed-hero',
    eyebrow: asText(raw?.eyebrow, 'Squab Storage'),
    headline: asText(raw?.headline, 'More room for what comes next'),
    answer: asText(raw?.answer),
    support: asText(raw?.support ?? raw?.supportingLine),
    badgeTop: asText(raw?.badgeTop, 'BRIDGWATER'),
    badgeBottom: asText(raw?.badgeBottom, 'SQUAB STORAGE'),
    benefits: Array.isArray(raw?.benefits) ? raw.benefits.slice(0, 3).map((item: any) => ({ title: asText(item?.title), body: asText(item?.body ?? item?.text) })) : [],
    footerTitle: asText(raw?.footerTitle, 'Squab Storage Bridgwater'),
    footerLine: asText(raw?.footerLine),
    image: asText(raw?.image) || undefined,
    imageBrief: asText(raw?.imageBrief) || undefined,
    caption: asText(raw?.caption),
    suggestedDate: asText(raw?.suggestedDate ?? raw?.date),
    suggestedTime: asText(raw?.suggestedTime ?? raw?.time),
    ctaType: asText(raw?.ctaType, 'Learn more'),
    contactDetails: asText(raw?.contactDetails) || undefined,
    formats: Array.isArray(raw?.formats) && raw.formats.length ? raw.formats.filter((format: string) => ['portrait', 'square', 'linkedin'].includes(format)) : ['portrait'],
    publicationStatus: ['Draft', 'Ready for review', 'Approved', 'Published'].includes(raw?.publicationStatus) ? raw.publicationStatus : 'Draft',
  };
}

export function parseCampaignJson(text: string): Campaign {
  const parsed = JSON.parse(text);
  const root = Array.isArray(parsed) ? { posts: parsed } : parsed;
  if (!root || !Array.isArray(root.posts) || root.posts.length === 0) throw new Error('No posts were found in this JSON.');
  return {
    id: asText(root.id, `campaign-${Date.now()}`),
    name: asText(root.name, 'Imported Squab campaign'),
    mode: root.mode === 'one-off' ? 'one-off' : 'batch',
    status: ['Draft', 'Ready for review', 'Approved', 'Published'].includes(root.status) ? root.status : 'Draft',
    startDate: asText(root.startDate),
    season: asText(root.season),
    localFocus: asText(root.localFocus, 'Bridgwater'),
    platforms: asText(root.platforms, 'Facebook, Instagram and LinkedIn'),
    posts: root.posts.slice(0, 9).map(normalisePost),
    updatedAt: new Date().toISOString(),
  };
}

export function saveCampaign(campaign: Campaign): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...campaign, updatedAt: new Date().toISOString() }));
}

export function loadCampaign(): Campaign | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try { return parseCampaignJson(saved); } catch { return null; }
}

export function exportCampaign(campaign: Campaign): void {
  const blob = new Blob([JSON.stringify(campaign, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${campaign.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'squab-campaign'}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

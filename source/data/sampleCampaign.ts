import type { Campaign } from '../types';
import { createVariedTemplatePlan } from '../templates/registry';

const objectives = ['Awareness', 'Engagement', 'Awareness', 'Conversion', 'Engagement', 'Awareness', 'Conversion', 'Engagement', 'Awareness'] as const;
const templatePlan = createVariedTemplatePlan([...objectives]);
const headlines = [
  'Moving house without living in boxes',
  'What actually fits in a storage unit?',
  'Clear space. Keep the things that matter.',
  'Business stock taking over the spare room?',
  'Three ways to make moving week calmer',
  'Storage that works around real life',
  'Clear pricing, without the guesswork',
  'A little breathing room goes a long way',
  'Local storage, ready when plans change',
];

export const sampleCampaign: Campaign = {
  id: 'development-fixture',
  name: 'Bridgwater Storage Stories',
  mode: 'batch',
  status: 'Draft',
  startDate: '2026-09-01',
  season: 'Early autumn',
  localFocus: 'Bridgwater households and small businesses',
  platforms: 'Facebook, Instagram and LinkedIn',
  updatedAt: new Date().toISOString(),
  posts: headlines.map((headline, index) => ({
    id: `post-${index + 1}`,
    name: `Post ${index + 1}`,
    service: index === 3 || index === 6 ? 'Business Storage' : 'Self Storage',
    subtopic: index === 1 ? 'Unit sizes' : undefined,
    objective: objectives[index],
    template: templatePlan[index],
    eyebrow: index === 3 ? 'For local businesses' : 'Storage in Bridgwater',
    headline,
    answer: index === 6 ? 'Know what you are paying for and choose the space that suits you.' : 'Create useful space while life is busy, without having to part with everything at once.',
    support: 'Flexible storage for moving, renovating, decluttering and growing businesses.',
    badgeTop: 'BRIDGWATER',
    badgeBottom: 'SQUAB STORAGE',
    benefits: [
      { title: 'Flexible', body: 'Choose space around what you actually need.' },
      { title: 'Practical', body: 'Keep belongings accessible while plans change.' },
      { title: 'Local', body: 'A Bridgwater team when you need a hand.' },
    ],
    footerTitle: 'Squab Storage Bridgwater',
    footerLine: 'Storage for the space between plans.',
    imageBrief: 'A believable lived-in storage problem or transition, not an empty pristine room.',
    caption: `${headline}. ${index === 6 ? 'Clear information makes choosing storage simpler.' : 'A practical option when you need more room for a while.'}`,
    suggestedDate: `2026-09-${String(2 + index * 2).padStart(2, '0')}`,
    suggestedTime: index % 2 ? '17:30' : '09:30',
    ctaType: objectives[index] === 'Conversion' ? 'Find out more' : objectives[index] === 'Engagement' ? 'Save for later' : 'Learn more',
    formats: ['portrait'],
    publicationStatus: 'Draft',
  })),
};

export type TemplateCategory = 'Photo-led' | 'Advice' | 'Trust' | 'Business' | 'Local' | 'CTA' | 'Editorial';

export type TemplateDefinition = {
  id: string;
  name: string;
  family: string;
  variant: 'A' | 'B';
  categories: TemplateCategory[];
  suitableObjectives: string[];
  imageLed: boolean;
  tone: 'light' | 'dark' | 'mixed';
};

const pair = (
  family: string,
  a: Omit<TemplateDefinition, 'family' | 'variant'>,
  b: Omit<TemplateDefinition, 'family' | 'variant'>,
): TemplateDefinition[] => [
  { ...a, family, variant: 'A' },
  { ...b, family, variant: 'B' },
];

export const templates: TemplateDefinition[] = [
  ...pair('Immersive Photo',
    { id: 'full-bleed-hero', name: 'Full-bleed Hero', categories: ['Photo-led', 'Editorial'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: true, tone: 'mixed' },
    { id: 'framed-hero', name: 'Framed Hero', categories: ['Photo-led', 'Trust'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: true, tone: 'light' }),
  ...pair('Editorial Split',
    { id: 'offset-split', name: 'Offset Split', categories: ['Editorial', 'Photo-led'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: true, tone: 'light' },
    { id: 'vertical-split', name: 'Vertical Split', categories: ['Editorial', 'Business'], suitableObjectives: ['Awareness', 'Conversion'], imageLed: true, tone: 'dark' }),
  ...pair('Typographic Poster',
    { id: 'big-statement', name: 'Big Statement', categories: ['Trust', 'CTA'], suitableObjectives: ['Awareness', 'Conversion'], imageLed: false, tone: 'dark' },
    { id: 'quiet-statement', name: 'Quiet Statement', categories: ['Trust', 'Editorial'], suitableObjectives: ['Awareness'], imageLed: false, tone: 'light' }),
  ...pair('Problem / Solution',
    { id: 'before-after', name: 'Before and After', categories: ['Photo-led', 'Advice'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: true, tone: 'mixed' },
    { id: 'problem-card', name: 'Problem Card', categories: ['Advice', 'CTA'], suitableObjectives: ['Engagement', 'Conversion'], imageLed: true, tone: 'light' }),
  ...pair('Card Stack',
    { id: 'advice-stack', name: 'Advice Stack', categories: ['Advice'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: false, tone: 'light' },
    { id: 'faq-stack', name: 'FAQ Stack', categories: ['Advice', 'Trust'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: false, tone: 'dark' }),
  ...pair('Benefit Grid',
    { id: 'three-benefits', name: 'Three Benefits', categories: ['Business', 'Trust'], suitableObjectives: ['Awareness', 'Conversion'], imageLed: false, tone: 'light' },
    { id: 'feature-spotlight', name: 'Feature Spotlight', categories: ['Business', 'Trust'], suitableObjectives: ['Awareness', 'Conversion'], imageLed: true, tone: 'dark' }),
  ...pair('Review / Human Proof',
    { id: 'review-spotlight', name: 'Review Spotlight', categories: ['Trust', 'Local'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: false, tone: 'light' },
    { id: 'human-quote', name: 'Human Quote', categories: ['Trust', 'Local', 'Photo-led'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: true, tone: 'mixed' }),
  ...pair('Steps / Process',
    { id: 'three-steps', name: 'Three Steps', categories: ['Advice'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: false, tone: 'light' },
    { id: 'journey-path', name: 'Journey Path', categories: ['Advice', 'Editorial'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: true, tone: 'mixed' }),
  ...pair('Local Story',
    { id: 'team-story', name: 'Team Story', categories: ['Local', 'Photo-led'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: true, tone: 'light' },
    { id: 'bridgwater-spotlight', name: 'Bridgwater Spotlight', categories: ['Local', 'Editorial'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: true, tone: 'dark' }),
  ...pair('Trust / Pricing',
    { id: 'price-charter', name: 'Price Charter', categories: ['Trust', 'Business'], suitableObjectives: ['Awareness', 'Conversion'], imageLed: false, tone: 'light' },
    { id: 'clear-choice', name: 'Clear Choice', categories: ['Trust', 'CTA'], suitableObjectives: ['Conversion'], imageLed: false, tone: 'dark' }),
  ...pair('Campaign / CTA',
    { id: 'service-spotlight', name: 'Service Spotlight', categories: ['CTA', 'Business', 'Photo-led'], suitableObjectives: ['Conversion'], imageLed: true, tone: 'mixed' },
    { id: 'action-panel', name: 'Action Panel', categories: ['CTA'], suitableObjectives: ['Conversion', 'Engagement'], imageLed: false, tone: 'dark' }),
  ...pair('Lifestyle Editorial',
    { id: 'moving-journal', name: 'Moving Journal', categories: ['Editorial', 'Photo-led'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: true, tone: 'light' },
    { id: 'business-journal', name: 'Business Journal', categories: ['Editorial', 'Business', 'Photo-led'], suitableObjectives: ['Awareness', 'Engagement'], imageLed: true, tone: 'dark' }),
];

export const legacyTemplateMap: Record<string, string> = {
  'photo-impact': 'full-bleed-hero',
  'photo-impact-light': 'framed-hero',
  'editorial-curve': 'offset-split',
  'editorial-curve-dark': 'vertical-split',
  'bold-split': 'big-statement',
  'bold-split-light': 'quiet-statement',
};

export function normaliseTemplateId(id: string): string {
  return legacyTemplateMap[id] ?? id;
}

export function recommendTemplates(objective: string, categories: TemplateCategory[] = []): TemplateDefinition[] {
  return templates
    .map(template => ({
      template,
      score: (template.suitableObjectives.includes(objective) ? 3 : 0) +
        categories.filter(category => template.categories.includes(category)).length * 2,
    }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.template);
}

export function createVariedTemplatePlan(objectives: string[]): string[] {
  const usedIds = new Set<string>();
  const familyCounts = new Map<string, number>();
  let previousFamily = '';

  return objectives.map(objective => {
    const ranked = recommendTemplates(objective);
    const selected = ranked.find(template =>
      !usedIds.has(template.id) &&
      template.family !== previousFamily &&
      (familyCounts.get(template.family) ?? 0) < 1,
    ) ?? ranked.find(template => !usedIds.has(template.id) && template.family !== previousFamily)
      ?? ranked.find(template => !usedIds.has(template.id))
      ?? ranked[0];

    usedIds.add(selected.id);
    familyCounts.set(selected.family, (familyCounts.get(selected.family) ?? 0) + 1);
    previousFamily = selected.family;
    return selected.id;
  });
}

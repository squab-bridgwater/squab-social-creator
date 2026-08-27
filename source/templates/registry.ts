export type TemplateCategory = 'Photo-led' | 'Advice' | 'Trust' | 'Business' | 'Local' | 'CTA' | 'Editorial' | 'Seasonal' | 'Playful';

export type TemplateDefinition = {
  id: string;
  name: string;
  family: string;
  variant: 'Hero';
  categories: TemplateCategory[];
  suitableObjectives: string[];
  imageLed: boolean;
  tone: 'light' | 'dark' | 'mixed';
  artDirection: string;
};

export const templates: TemplateDefinition[] = [
  { id: 'bold-impact', name: 'Bold Impact', family: 'Bold Impact', variant: 'Hero', categories: ['Photo-led','CTA','Editorial'], suitableObjectives: ['Awareness','Conversion'], imageLed: true, tone: 'dark', artDirection: 'Oversized cropped type, cinematic subject, aggressive scale and directional energy.' },
  { id: 'real-people', name: 'Real People', family: 'Real People', variant: 'Hero', categories: ['Photo-led','Trust','Local'], suitableObjectives: ['Awareness','Engagement'], imageLed: true, tone: 'mixed', artDirection: 'Human photography with torn-paper storytelling and a genuine quote-like message.' },
  { id: 'transformation', name: 'The Transformation', family: 'The Transformation', variant: 'Hero', categories: ['Photo-led','Advice','Editorial'], suitableObjectives: ['Awareness','Engagement'], imageLed: true, tone: 'mixed', artDirection: 'Before/after narrative with torn reveal, contrast and visual transformation.' },
  { id: 'local-pride', name: 'Local Pride', family: 'Local Pride', variant: 'Hero', categories: ['Local','Photo-led','Trust'], suitableObjectives: ['Awareness','Engagement'], imageLed: true, tone: 'mixed', artDirection: 'Place-led poster with bold local typography, marker annotations and strong community identity.' },
  { id: 'lifestyle-freedom', name: 'Lifestyle Freedom', family: 'Lifestyle Freedom', variant: 'Hero', categories: ['Photo-led','Editorial'], suitableObjectives: ['Awareness','Engagement'], imageLed: true, tone: 'light', artDirection: 'Aspirational lifestyle image with expansive negative space, handwritten energy and freedom cues.' },
  { id: 'what-fits', name: 'What Fits', family: 'What Fits', variant: 'Hero', categories: ['Advice','Photo-led','CTA'], suitableObjectives: ['Engagement','Conversion'], imageLed: true, tone: 'dark', artDirection: 'Object-led visual inventory with oversized statement and hand-marked checklist.' },
  { id: 'seasonal-moment', name: 'Seasonal Moment', family: 'Seasonal Moments', variant: 'Hero', categories: ['Seasonal','Photo-led','CTA'], suitableObjectives: ['Awareness','Engagement','Conversion'], imageLed: true, tone: 'mixed', artDirection: 'Cinematic seasonal scene with expressive headline and timely campaign energy.' },
  { id: 'business-growth', name: 'Business & Workspace', family: 'Business & Workspace', variant: 'Hero', categories: ['Business','Photo-led','CTA'], suitableObjectives: ['Awareness','Conversion'], imageLed: true, tone: 'dark', artDirection: 'Editorial founder/workspace photography with bold growth message and precise utility cues.' },
  { id: 'trust-security', name: 'Trust & Security', family: 'Trust & Security', variant: 'Hero', categories: ['Trust','Photo-led'], suitableObjectives: ['Awareness','Conversion'], imageLed: true, tone: 'dark', artDirection: 'Macro security photography, industrial crop, confident vertical trust markers.' },
  { id: 'creative-tactile', name: 'Creative / Tactile', family: 'Creative / Tactile', variant: 'Hero', categories: ['Editorial','Advice','Playful'], suitableObjectives: ['Awareness','Engagement'], imageLed: false, tone: 'mixed', artDirection: 'Torn paper, tape, ink strokes, imperfect print textures and handmade collage depth.' },
  { id: 'minimal-striking', name: 'Minimal & Striking', family: 'Minimal & Striking', variant: 'Hero', categories: ['Trust','Editorial'], suitableObjectives: ['Awareness'], imageLed: true, tone: 'dark', artDirection: 'Architectural negative space, extreme restraint and a single high-impact orange intervention.' },
  { id: 'playful-unexpected', name: 'Playful & Unexpected', family: 'Playful & Unexpected', variant: 'Hero', categories: ['Playful','Photo-led','Engagement'], suitableObjectives: ['Awareness','Engagement'], imageLed: true, tone: 'mixed', artDirection: 'Surprising scale, witty visual metaphor and social-native cut-out energy.' },
];

export const legacyTemplateMap: Record<string, string> = {
  'photo-impact': 'bold-impact', 'photo-impact-light': 'real-people', 'editorial-curve': 'transformation', 'editorial-curve-dark': 'local-pride', 'bold-split': 'minimal-striking', 'bold-split-light': 'creative-tactile',
  'full-bleed-hero': 'bold-impact', 'framed-hero': 'real-people', 'offset-split': 'transformation', 'vertical-split': 'local-pride', 'big-statement': 'minimal-striking', 'quiet-statement': 'creative-tactile',
  'before-after': 'transformation', 'problem-card': 'what-fits', 'advice-stack': 'creative-tactile', 'faq-stack': 'creative-tactile', 'three-benefits': 'business-growth', 'feature-spotlight': 'business-growth',
  'review-spotlight': 'real-people', 'human-quote': 'real-people', 'three-steps': 'what-fits', 'journey-path': 'lifestyle-freedom', 'team-story': 'real-people', 'bridgwater-spotlight': 'local-pride',
  'price-charter': 'trust-security', 'clear-choice': 'minimal-striking', 'service-spotlight': 'bold-impact', 'action-panel': 'bold-impact', 'moving-journal': 'lifestyle-freedom', 'business-journal': 'business-growth',
};

export function normaliseTemplateId(id: string): string { return legacyTemplateMap[id] ?? id; }

export function recommendTemplates(objective: string, categories: TemplateCategory[] = []): TemplateDefinition[] {
  return templates.map(template => ({ template, score: (template.suitableObjectives.includes(objective) ? 3 : 0) + categories.filter(category => template.categories.includes(category)).length * 2 })).sort((a,b) => b.score-a.score).map(item => item.template);
}

export function createVariedTemplatePlan(objectives: string[]): string[] {
  const used = new Set<string>();
  return objectives.map((objective, index) => {
    const ranked = recommendTemplates(objective);
    const selected = ranked.find(item => !used.has(item.id)) ?? templates[index % templates.length];
    used.add(selected.id);
    return selected.id;
  });
}

export type GuidedObjective = 'awareness' | 'advice' | 'engagement' | 'trust' | 'enquiries' | 'local' | 'seasonal';
export type GuidedAudience = 'moving-home' | 'decluttering' | 'renovating' | 'families' | 'business' | 'trades' | 'online-sellers' | 'workspace' | 'general-local';
export type GuidedImageStrategy = 'squab-photo' | 'upload-photo' | 'conceptual-generated' | 'lifestyle-location' | 'gpt-decide';
export type GuidedFormat = 'feed' | 'feed-story' | 'instagram' | 'facebook' | 'all';
export type GuidedCta = 'none' | 'learn-more' | 'save' | 'engage' | 'website' | 'quote' | 'contact-bridgwater' | 'gpt-decide';

export type Choice = { id: string; label: string; description?: string };

export type GuidedAnswers = {
  objective?: GuidedObjective;
  audience?: GuidedAudience;
  subject?: string;
  angle?: string;
  creativeDirection?: string;
  imageStrategy?: GuidedImageStrategy;
  cta?: GuidedCta;
  format?: GuidedFormat;
};

export type CreativeDirection = {
  id: string;
  label: string;
  short: string;
  bestFor: GuidedObjective[];
  audiences?: GuidedAudience[];
  imageModes: GuidedImageStrategy[];
};

export type GuidedRecommendation = {
  creativeDirections: CreativeDirection[];
  allowedImageStrategies: Choice[];
};

export type Objective = 'Awareness' | 'Engagement' | 'Conversion';
export type PublicationStatus = 'Draft' | 'Ready for review' | 'Approved' | 'Published';
export type OutputFormat = 'portrait' | 'square' | 'story' | 'linkedin';

export type Benefit = {
  title: string;
  body: string;
};

export type SocialPost = {
  id: string;
  name: string;
  service: string;
  subtopic?: string;
  objective: Objective;
  template: string;
  eyebrow: string;
  headline: string;
  answer: string;
  support: string;
  badgeTop: string;
  badgeBottom: string;
  benefits: Benefit[];
  footerTitle: string;
  footerLine: string;
  image?: string;
  secondaryImage?: string;
  imageBrief?: string;
  caption: string;
  suggestedDate: string;
  suggestedTime: string;
  ctaType: string;
  contactDetails?: string;
  formats: OutputFormat[];
  publicationStatus: PublicationStatus;
};

export type Campaign = {
  id: string;
  name: string;
  mode: 'batch' | 'one-off';
  status: PublicationStatus;
  startDate: string;
  season: string;
  localFocus: string;
  platforms: string;
  posts: SocialPost[];
  updatedAt: string;
};

export type QaResult = {
  errors: string[];
  warnings: string[];
};

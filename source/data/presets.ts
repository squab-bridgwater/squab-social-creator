export type CampaignPreset = {
  id: string;
  category: 'Household' | 'Business' | 'Brand' | 'Local' | 'Timely';
  name: string;
  description: string;
  guidance: string;
};

export const campaignPresets: CampaignPreset[] = [
  { id:'moving-home', category:'Household', name:'Moving home', description:'Calm, practical help for people between properties.', guidance:'Focus on moving-day pressure, temporary space and keeping essentials accessible.' },
  { id:'declutter-calm', category:'Household', name:'Declutter without pressure', description:'Useful breathing room without telling people to throw things away.', guidance:'Show genuine lived-in pressure points and practical temporary storage.' },
  { id:'renovation-room', category:'Household', name:'Renovation breathing room', description:'Protect possessions and free working space during home projects.', guidance:'Use believable renovation disruption and practical storage benefits.' },
  { id:'downsizing', category:'Household', name:'Downsizing gently', description:'Support a gradual move into a smaller home.', guidance:'Use empathetic, non-pushy language about decisions, memories and flexible timing.' },
  { id:'business-stock', category:'Business', name:'Business stock overflow', description:'Space for stock, equipment and seasonal peaks.', guidance:'Keep it practical and operational. Avoid generic corporate claims.' },
  { id:'business-growth', category:'Business', name:'Room to grow', description:'Storage and workspace for growing local businesses.', guidance:'Show the business problem first, then the flexible space solution.' },
  { id:'office-workspace', category:'Business', name:'Office & workspace', description:'Highlight practical workspace and storage combinations.', guidance:'Focus on flexibility, professionalism and real working needs.' },
  { id:'clear-pricing', category:'Brand', name:'Clear pricing', description:'Reassurance around transparent, sensible pricing.', guidance:'Use only verified pricing principles. No invented discounts or urgency.' },
  { id:'squab-standard', category:'Brand', name:'The Squab standard', description:'Human service, professionalism and dependable facilities.', guidance:'Balance useful proof with warmth. Avoid feature dumping.' },
  { id:'how-storage-works', category:'Brand', name:'How storage works', description:'Simple education for first-time storage customers.', guidance:'Explain in plain English using steps, FAQs and unit-size guidance.' },
  { id:'bridgwater-local', category:'Local', name:'Bridgwater local', description:'Local team, local customers and useful community relevance.', guidance:'Keep claims specific and grounded in Bridgwater rather than generic local-business language.' },
  { id:'people-behind-squab', category:'Local', name:'People behind Squab', description:'Team-led content using genuine Squab photography.', guidance:'Use genuine staff imagery only and keep the copy natural and useful.' },
  { id:'seasonal-reset', category:'Timely', name:'Seasonal reset', description:'Timely household and business storage needs.', guidance:'Use the current season as context, not as a forced sales hook.' },
  { id:'weather-disruption', category:'Timely', name:'Weather & disruption', description:'Reactive content around realistic local disruption.', guidance:'Only use current verified conditions if making weather-specific claims.' },
  { id:'one-useful-question', category:'Timely', name:'One useful question', description:'A focused FAQ or customer question for reactive posts.', guidance:'Answer one genuine question clearly, then use a light CTA if appropriate.' },
];

export const verifiedFacts = [
  'Squab Storage serves customers in Bridgwater, Somerset.',
  'Squab provides home/self storage, business storage, offices and workspaces.',
  'Squab publishes storage prices online so customers can see pricing before providing personal details.',
  'Promotions should be explained honestly, including the standard rate that applies after a promotion.',
  'After a promotional period ends, Squab aims to keep the standard store rate stable for up to 12 months rather than creating immediate price surprises.',
  'Storage pricing varies by local market, demand and property costs, so do not imply every Squab location has the same price.',
  'Squab does not impose exit charges for ordinary storage use; offer-specific minimum stays can still have their own terms.',
  'Self-storage customers can access their goods from 8am to 8pm, seven days a week.',
  'Squab facilities use recorded CCTV and security systems; do not invent additional security claims beyond the supplied facts.',
  'Customers can ask the Squab team for help choosing an appropriate storage size.',
  'Human approval is required before social artwork or captions are scheduled or published.',
];

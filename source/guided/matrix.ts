import type { Choice, CreativeDirection, GuidedAnswers, GuidedAudience, GuidedObjective, GuidedRecommendation } from './types';

export const objectiveChoices: Choice[] = [
  { id:'awareness', label:'Awareness', description:'Get Squab noticed and remembered.' },
  { id:'advice', label:'Advice / Education', description:'Give useful storage or workspace guidance.' },
  { id:'engagement', label:'Engagement', description:'Create saves, comments or shares.' },
  { id:'trust', label:'Trust / Reassurance', description:'Build confidence in choosing Squab.' },
  { id:'enquiries', label:'Enquiries / Conversion', description:'Encourage a quote, visit or contact.' },
  { id:'local', label:'Local / Community', description:'Strengthen Bridgwater and local relevance.' },
  { id:'seasonal', label:'Seasonal', description:'Use a timely seasonal or calendar moment.' },
];

export const audienceChoices: Choice[] = [
  { id:'moving-home', label:'Moving home' },
  { id:'decluttering', label:'Decluttering / Downsizing' },
  { id:'renovating', label:'Renovating' },
  { id:'families', label:'Families' },
  { id:'business', label:'Business' },
  { id:'trades', label:'Trades' },
  { id:'online-sellers', label:'Online sellers' },
  { id:'workspace', label:'Office / Workspace users' },
  { id:'general-local', label:'General local audience' },
];

const subjectsByAudience: Record<GuidedAudience, Choice[]> = {
  'moving-home': [
    { id:'temporary-storage', label:'Temporary storage while moving' },
    { id:'unit-sizes', label:'What size unit do I need?' },
    { id:'moving-day', label:'Making moving day easier' },
    { id:'between-homes', label:'Storage between homes' },
    { id:'packing', label:'Packing and organising' },
  ],
  decluttering: [
    { id:'make-space', label:'Make space without throwing things away' },
    { id:'downsizing', label:'Downsizing gradually' },
    { id:'seasonal-belongings', label:'Store seasonal belongings' },
    { id:'spare-room', label:'Reclaim the spare room' },
    { id:'life-change', label:'Storage during a life change' },
  ],
  renovating: [
    { id:'protect-belongings', label:'Protect belongings during works' },
    { id:'clear-rooms', label:'Clear rooms before renovation' },
    { id:'project-storage', label:'Temporary project storage' },
    { id:'furniture', label:'Furniture storage' },
  ],
  families: [
    { id:'family-clutter', label:'Family clutter and growing households' },
    { id:'baby-items', label:'Baby and children’s items' },
    { id:'sports-hobbies', label:'Sports and hobby equipment' },
    { id:'seasonal-family', label:'Christmas and seasonal items' },
  ],
  business: [
    { id:'business-storage', label:'Business storage' },
    { id:'stock-overflow', label:'Stock overflow' },
    { id:'archive-storage', label:'Archive storage' },
    { id:'workspace', label:'Workspace' },
    { id:'office', label:'Flexible office space' },
  ],
  trades: [
    { id:'tools-materials', label:'Tools and materials storage' },
    { id:'stock', label:'Trade stock overflow' },
    { id:'vehicle-space', label:'Free up van or garage space' },
    { id:'business-base', label:'Practical business base' },
  ],
  'online-sellers': [
    { id:'ecommerce-stock', label:'E-commerce stock storage' },
    { id:'peak-season', label:'Peak-season overflow' },
    { id:'home-space', label:'Stop stock taking over the house' },
    { id:'growth', label:'Space to grow' },
  ],
  workspace: [
    { id:'office', label:'Flexible office space' },
    { id:'workspace', label:'Workspace rental' },
    { id:'hybrid', label:'Hybrid / flexible working' },
    { id:'business-growth', label:'Space for a growing team' },
  ],
  'general-local': [
    { id:'self-storage', label:'Self storage' },
    { id:'business-storage', label:'Business storage' },
    { id:'workspace', label:'Office and workspace' },
    { id:'local-team', label:'The local Squab team' },
    { id:'clear-pricing', label:'Clear pricing' },
    { id:'storage-standard', label:'The Squab Storage Standard' },
  ],
};

const baseAngles: Choice[] = [
  { id:'problem-solution', label:'Problem → Solution' },
  { id:'make-life-easier', label:'Make life easier' },
  { id:'save-space', label:'Save / reclaim space' },
  { id:'flexibility', label:'Flexibility' },
  { id:'clear-pricing', label:'Clear pricing' },
  { id:'security-trust', label:'Security / Trust' },
  { id:'what-fits', label:'What fits?' },
  { id:'local-service', label:'Local service' },
  { id:'growth', label:'Business growth' },
  { id:'gpt-decide', label:'Let GPT choose the strongest angle' },
];

const angleOverrides: Partial<Record<GuidedObjective, Choice[]>> = {
  advice: [
    { id:'how-to', label:'How to / practical tip' },
    { id:'myth-bust', label:'Myth-busting' },
    { id:'what-fits', label:'What fits?' },
    { id:'checklist', label:'Checklist' },
    { id:'planning', label:'Planning ahead' },
    { id:'gpt-decide', label:'Let GPT choose the strongest angle' },
  ],
  trust: [
    { id:'security-trust', label:'Security / Trust' },
    { id:'clear-pricing', label:'Clear pricing' },
    { id:'real-people', label:'Real people and service' },
    { id:'storage-standard', label:'The Squab Storage Standard' },
    { id:'local-service', label:'Local service' },
    { id:'gpt-decide', label:'Let GPT choose the strongest angle' },
  ],
  engagement: [
    { id:'question', label:'Ask a relatable question' },
    { id:'this-or-that', label:'This or that' },
    { id:'save-for-later', label:'Useful save-for-later post' },
    { id:'before-after', label:'Before / after' },
    { id:'relatable-chaos', label:'Relatable chaos' },
    { id:'gpt-decide', label:'Let GPT choose the strongest angle' },
  ],
  local: [
    { id:'local-pride', label:'Local pride' },
    { id:'local-service', label:'Local service' },
    { id:'real-people', label:'Meet the local team' },
    { id:'community', label:'Community relevance' },
    { id:'gpt-decide', label:'Let GPT choose the strongest angle' },
  ],
  seasonal: [
    { id:'seasonal-problem', label:'Seasonal storage problem' },
    { id:'timely-reminder', label:'Timely reminder' },
    { id:'seasonal-reset', label:'Seasonal reset / clear-out' },
    { id:'peak-business', label:'Business peak-season overflow' },
    { id:'gpt-decide', label:'Let GPT choose the strongest angle' },
  ],
};

export const creativeDirections: CreativeDirection[] = [
  { id:'bold-impact', label:'Bold Impact', short:'Cinematic human scene, huge cropped type, strong orange accents.', bestFor:['awareness','engagement','enquiries','seasonal'], imageModes:['upload-photo','conceptual-generated','lifestyle-location','gpt-decide'] },
  { id:'real-people', label:'Real People', short:'Warm human-led story with authentic photography and emotional copy.', bestFor:['trust','local','awareness','engagement'], imageModes:['squab-photo','upload-photo','lifestyle-location','gpt-decide'] },
  { id:'transformation', label:'Transformation', short:'Immediate before/after visual story with strong contrast.', bestFor:['engagement','advice','enquiries','awareness'], imageModes:['upload-photo','gpt-decide'] },
  { id:'local-pride', label:'Local Pride', short:'Premium Bridgwater/local campaign poster with strong place identity.', bestFor:['local','trust','awareness'], audiences:['general-local','families','business','workspace'], imageModes:['squab-photo','upload-photo','lifestyle-location','gpt-decide'] },
  { id:'lifestyle-freedom', label:'Lifestyle Freedom', short:'Aspirational scene showing what reclaimed space enables.', bestFor:['awareness','engagement','enquiries'], imageModes:['upload-photo','conceptual-generated','lifestyle-location','gpt-decide'] },
  { id:'what-fits', label:'What Fits', short:'Object-rich scene, oversized type and tactile checklist.', bestFor:['advice','engagement','enquiries'], imageModes:['upload-photo','conceptual-generated','gpt-decide'] },
  { id:'seasonal-moment', label:'Seasonal Moment', short:'High-emotion timely scene with oversized seasonal campaign message.', bestFor:['seasonal','awareness','engagement'], imageModes:['upload-photo','conceptual-generated','lifestyle-location','gpt-decide'] },
  { id:'business-growth', label:'Business & Workspace', short:'Founder or worker in a real workspace with bold growth message.', bestFor:['enquiries','awareness','trust'], audiences:['business','trades','online-sellers','workspace'], imageModes:['squab-photo','upload-photo','lifestyle-location','gpt-decide'] },
  { id:'trust-security', label:'Trust & Security', short:'Industrial detail, macro security imagery and confident trust message.', bestFor:['trust','enquiries','advice'], imageModes:['squab-photo','upload-photo','gpt-decide'] },
  { id:'creative-tactile', label:'Creative / Tactile', short:'Ripped paper, marker energy, layered scraps and physical texture.', bestFor:['engagement','awareness','advice','seasonal'], imageModes:['upload-photo','conceptual-generated','gpt-decide'] },
  { id:'minimal-striking', label:'Minimal & Striking', short:'One dominant message, architectural image and extreme contrast.', bestFor:['awareness','trust','local','enquiries'], imageModes:['squab-photo','upload-photo','lifestyle-location','gpt-decide'] },
  { id:'playful-unexpected', label:'Playful & Unexpected', short:'Believable surreal visual metaphor designed to stop the scroll.', bestFor:['awareness','engagement','seasonal'], imageModes:['conceptual-generated','gpt-decide'] },
];

export const ctaChoices: Choice[] = [
  { id:'none', label:'No CTA' },
  { id:'learn-more', label:'Learn more' },
  { id:'save', label:'Save this' },
  { id:'engage', label:'Comment / engage' },
  { id:'website', label:'Visit website' },
  { id:'quote', label:'Get a quote' },
  { id:'contact-bridgwater', label:'Contact Bridgwater' },
  { id:'gpt-decide', label:'Let GPT choose' },
];

export const formatChoices: Choice[] = [
  { id:'feed', label:'Instagram + Facebook feed', description:'Primary 4:5 post.' },
  { id:'feed-story', label:'Feed + Story', description:'4:5 plus 9:16.' },
  { id:'instagram', label:'Instagram only' },
  { id:'facebook', label:'Facebook only' },
  { id:'all', label:'All social formats', description:'4:5, square and Story-safe versions.' },
];

export function getSubjectChoices(audience?: GuidedAudience): Choice[] {
  return audience ? subjectsByAudience[audience] : [];
}

export function getAngleChoices(objective?: GuidedObjective): Choice[] {
  return objective && angleOverrides[objective] ? angleOverrides[objective]! : baseAngles;
}

export function getRecommendation(answers: GuidedAnswers): GuidedRecommendation {
  const objective = answers.objective;
  const audience = answers.audience;
  const scored = creativeDirections.map(direction => {
    let score = 0;
    if (objective && direction.bestFor.includes(objective)) score += 5;
    if (audience && direction.audiences?.includes(audience)) score += 3;
    if (answers.angle === 'before-after' && direction.id === 'transformation') score += 7;
    if (answers.angle === 'what-fits' && direction.id === 'what-fits') score += 7;
    if (answers.angle === 'real-people' && direction.id === 'real-people') score += 7;
    if (answers.angle === 'local-pride' && direction.id === 'local-pride') score += 7;
    if (answers.angle === 'security-trust' && direction.id === 'trust-security') score += 7;
    if (answers.angle === 'growth' && direction.id === 'business-growth') score += 7;
    if (objective === 'seasonal' && direction.id === 'seasonal-moment') score += 6;
    return { direction, score };
  }).sort((a,b) => b.score - a.score || creativeDirections.indexOf(a.direction) - creativeDirections.indexOf(b.direction));

  const selected = scored.slice(0,4).map(item => item.direction);
  const physicalSquabSubject = ['local-team','storage-standard','security-trust'].includes(answers.subject ?? '') || answers.angle === 'real-people' || answers.angle === 'local-service';
  const allowedImageStrategies: Choice[] = physicalSquabSubject
    ? [
        { id:'squab-photo', label:'Use genuine Squab photography' },
        { id:'upload-photo', label:'Upload my Squab photo' },
        { id:'gpt-decide', label:'Let GPT choose from approved genuine imagery' },
      ]
    : [
        { id:'squab-photo', label:'Use genuine Squab photography' },
        { id:'upload-photo', label:'Upload my own photo' },
        { id:'conceptual-generated', label:'Generate conceptual campaign imagery' },
        { id:'lifestyle-location', label:'Lifestyle / location imagery' },
        { id:'gpt-decide', label:'Let GPT decide' },
      ];
  return { creativeDirections:selected, allowedImageStrategies };
}

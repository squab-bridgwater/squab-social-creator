export type BenchmarkFamily = {
  id: string;
  visualTarget: string;
  required: string[];
  reject: string[];
};

// Governing visual benchmark approved 27 Aug 2026.
// The supplied 12-panel concept board is the target for finished creative quality,
// not merely inspiration. Renderers should reproduce its image dominance, scale,
// depth, tactile energy and social-native composition while respecting Squab brand rules.
export const approvedBenchmark: BenchmarkFamily[] = [
  { id:'bold-impact', visualTarget:'Cinematic storage scene with a human subject, huge cropped white/orange headline and hand-marked benefit list.', required:['full-bleed cinematic photo','human focal subject where available','headline occupies roughly a third of the frame','orange expressive type or stroke','benefits integrated over image','logo over controlled clean footer zone'], reject:['large empty dark fields','small headline','boxed photo placeholder','presentation-style split'] },
  { id:'real-people', visualTarget:'Warm genuine person-led storage story with torn-paper quote treatment layered into the photography.', required:['person dominates the visual story','warm believable photography','paper texture overlapping image','large informal quote composition','orange hand mark'], reject:['photo isolated in a rectangle','generic corporate portrait','large unused background'] },
  { id:'transformation', visualTarget:'Immediate before/after story using two contrasting image states divided by a tactile torn seam.', required:['two-image capability','clear BEFORE and AFTER','torn vertical divide','bottom torn-paper statement','dramatic contrast'], reject:['same image simply darkened on one side','flat geometric split','tiny labels'] },
  { id:'local-pride', visualTarget:'Beautiful Bridgwater/location photography treated as a premium local campaign poster.', required:['location image dominates','large expressive local headline','sunset/cinematic grade where source permits','orange checklist annotation','strong place identity'], reject:['generic stock town','corporate information card','small local message'] },
  { id:'lifestyle-freedom', visualTarget:'Aspirational lifestyle scene showing what reclaimed space enables, with expansive handwritten-style message.', required:['aspirational outdoor/lifestyle photography','strong horizon/negative space','large message','orange underline','simple activity cues'], reject:['storage-unit photo as hero','dense information','office-like grid'] },
  { id:'what-fits', visualTarget:'Object-rich lifestyle/storage composition with huge stacked type and a tactile checklist.', required:['recognisable stored objects','oversized stacked headline','white paper checklist','orange handwritten accent','dark cinematic grade'], reject:['empty unit','three generic cards','small product list'] },
  { id:'seasonal-moment', visualTarget:'High-emotion seasonal scene with recognisable seasonal subject and oversized campaign headline.', required:['seasonal scene dominates','strong emotional subject','large expressive headline','orange stroke','short timely support'], reject:['generic dark background','seasonal icon alone','calendar-card treatment'] },
  { id:'business-growth', visualTarget:'Founder/worker in a real workspace with bold vertical growth headline and useful benefit marks.', required:['working human subject','real workspace detail','large headline integrated with scene','orange directional mark','three concise benefits'], reject:['empty office','dashboard cards','generic business stock pose'] },
  { id:'trust-security', visualTarget:'Extreme macro security detail with industrial drama, confident headline and vertical trust markers.', required:['macro lock/security focal point','orange/black industrial environment','high texture','large trust statement','simple icon markers'], reject:['generic padlock icon on flat background','feature grid','tiny security photo'] },
  { id:'creative-tactile', visualTarget:'Physical collage on a real industrial/storage texture with ripped paper, marker writing and layered scraps.', required:['photographic textured base','multiple torn paper layers','imperfect rotation','ink/marker strokes','visible depth/shadow'], reject:['clean rectangles','single white card on charcoal','digital dashboard aesthetic'] },
  { id:'minimal-striking', visualTarget:'Architectural storage image with extreme black/orange geometry, one bold message and human movement.', required:['real architecture','dominant black/orange contrast','one large statement','human scale/movement where possible','strong negative space'], reject:['plain black canvas','small photo strip','multiple content modules'] },
  { id:'playful-unexpected', visualTarget:'Believable surreal visual metaphor with oversized subject emerging from storage/box and tactile labels.', required:['surprising hero subject','photoreal or strong supplied composite','oversized scale','paper labels integrated into scene','bright sky/colour contrast where appropriate'], reject:['normal photo in rounded rectangle','cute iconography only','generic meme card'] },
];

export const benchmarkRules = {
  imageCoverageTarget: 'For photo-led families, meaningful photography should normally occupy 70-100% of the canvas.',
  typographyTarget: 'Primary campaign type should be intentionally oversized, often cropped or overlapping the image, and readable in under one second.',
  depthTarget: 'Use foreground/background overlap, tactile paper, shadows, torn edges or subject interaction to create physical depth where the family calls for it.',
  placeholderRule: 'Missing imagery must never masquerade as finished creative. In review mode, image-led templates without imagery should be clearly marked incomplete rather than visually judged as finished.',
  responsiveRule: 'Compose independently for 4:5, 1:1 and 9:16 safe areas. Do not mechanically squash a portrait composition.',
};

import type { SocialPost } from '../types';
import { brand } from '../brand/tokens';
import { squabLogoData } from '../brand/logoData';
import { normaliseTemplateId, templates } from '../templates/registry';

export type RenderSize = 'portrait' | 'square' | 'linkedin';
const sizes: Record<RenderSize, [number, number]> = {
  portrait: [1080, 1350],
  square: [1080, 1080],
  linkedin: [1200, 1200],
};

const C = {
  orange: brand.colours.orange,
  deep: brand.colours.orangeDark,
  peach: brand.colours.orangeMid,
  cream: brand.colours.orangeSoft,
  black: brand.colours.black,
  charcoal: brand.colours.charcoal,
  grey: brand.colours.grey,
  white: brand.colours.white,
};

const esc = (value = '') => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));

function wrap(text: string, limit: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  words.forEach(word => {
    const next = `${line} ${word}`.trim();
    if (next.length > limit && line) { lines.push(line); line = word; }
    else line = next;
  });
  if (line) lines.push(line);
  return lines.slice(0, 5);
}

function lines(text: string, x: number, y: number, chars: number, size: number, lineHeight: number, fill: string, weight = 900): string {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="Lato,Arial,sans-serif" font-size="${size}" font-weight="${weight}">${wrap(text, chars).map((line, index) => `<tspan x="${x}" dy="${index ? lineHeight : 0}">${esc(line)}</tspan>`).join('')}</text>`;
}

function eyebrow(text: string, x: number, y: number, fill = C.deep): string {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="Lato,Arial,sans-serif" font-size="18" font-weight="900" letter-spacing="3">${esc(text.toUpperCase())}</text>`;
}

function badge(text: string, x: number, y: number, fill = C.orange, ink = C.black): string {
  const width = Math.max(130, Math.min(290, 34 + text.length * 12));
  return `<g transform="translate(${x} ${y})"><rect width="${width}" height="44" rx="22" fill="${fill}"/><text x="${width / 2}" y="29" text-anchor="middle" fill="${ink}" font-family="Lato,Arial,sans-serif" font-size="14" font-weight="900" letter-spacing="1.2">${esc(text.toUpperCase())}</text></g>`;
}

function photo(post: SocialPost, x: number, y: number, w: number, h: number, id: string, radius = 0): string {
  if (!post.image) {
    return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${C.grey}"/><path d="M${x + w * .1} ${y + h * .82} L${x + w * .34} ${y + h * .52} L${x + w * .51} ${y + h * .67} L${x + w * .72} ${y + h * .38} L${x + w * .92} ${y + h * .82}Z" fill="#aaa"/><text x="${x + w / 2}" y="${y + h * .28}" text-anchor="middle" fill="#666" font-family="Lato,Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="2">ADD PHOTO</text></g>`;
  }
  return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}"/></clipPath></defs><image href="${post.image}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
}

function logo(x: number, y: number): string {
  return `<image href="${squabLogoData}" x="${x}" y="${y}" width="188" height="61" preserveAspectRatio="xMinYMid meet"/>`;
}

function ghostNumber(value: number, x: number, y: number, fill: string, opacity = .08): string {
  return `<text x="${x}" y="${y}" fill="${fill}" fill-opacity="${opacity}" font-family="Lato,Arial,sans-serif" font-size="210" font-weight="900" text-anchor="end">${String(value).padStart(2, '0')}</text>`;
}

function sharedDefs(): string {
  return `<defs>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity=".16"/></filter>
    <linearGradient id="orangeGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${C.orange}"/><stop offset="100%" stop-color="${C.deep}"/></linearGradient>
    <linearGradient id="photoShade" x1="0" y1="0" x2="0" y2="1"><stop offset="18%" stop-color="#000" stop-opacity=".02"/><stop offset="88%" stop-color="#000" stop-opacity=".82"/></linearGradient>
  </defs>`;
}

function benefitsInline(post: SocialPost, x: number, y: number, w: number, fill: string): string {
  const items = post.benefits.slice(0, 3);
  const cell = w / Math.max(1, items.length);
  return items.map((item, index) => `<g transform="translate(${x + index * cell} ${y})"><line x1="0" y1="0" x2="${cell - 24}" y2="0" stroke="${fill}" stroke-opacity=".25"/><text x="0" y="33" fill="${fill}" font-family="Lato,Arial,sans-serif" font-size="21" font-weight="900">${esc(item.title)}</text>${lines(item.body, 0, 63, 24, 15, 20, fill, 400)}</g>`).join('');
}

function benefitCards(post: SocialPost, x: number, y: number, w: number, cardFill: string, ink: string): string {
  const gap = 16;
  const cardW = (w - gap * 2) / 3;
  return post.benefits.slice(0, 3).map((item, index) => `<g transform="translate(${x + index * (cardW + gap)} ${y})" filter="url(#softShadow)"><rect width="${cardW}" height="190" rx="24" fill="${cardFill}"/><rect x="18" y="18" width="42" height="8" rx="4" fill="${C.orange}"/><text x="18" y="73" fill="${ink}" font-family="Lato,Arial,sans-serif" font-size="22" font-weight="900">${esc(item.title)}</text>${lines(item.body, 18, 109, 20, 15, 20, ink, 400)}</g>`).join('');
}

function footer(post: SocialPost, W: number, H: number, pad: number): string {
  return `<rect x="0" y="${H - 120}" width="${W}" height="120" fill="${C.white}"/>${logo(pad, H - 91)}<text x="${W - pad}" y="${H - 72}" text-anchor="end" fill="#111" font-family="Lato,Arial,sans-serif" font-size="18" font-weight="700">${esc(post.footerTitle)}</text><text x="${W - pad}" y="${H - 44}" text-anchor="end" fill="#555" font-family="Lato,Arial,sans-serif" font-size="14">${esc(post.footerLine)}</text>`;
}

type FamilyArgs = { post: SocialPost; W: number; H: number; pad: number; variant: number; index: number; id: string };

function immersive({ post, W, H, pad, variant, id }: FamilyArgs): string {
  if (!variant) return `${photo(post, 0, 0, W, H, `${id}-hero`)}<rect width="${W}" height="${H}" fill="url(#photoShade)"/><path d="M${W * .72} 0 H${W} V${H * .24} C${W * .91} ${H * .19},${W * .86} ${H * .08},${W * .72} 0Z" fill="url(#orangeGradient)" fill-opacity=".94"/><rect x="${pad}" y="${H * .535}" width="94" height="8" rx="4" fill="${C.orange}"/>${eyebrow(post.eyebrow, pad, H * .59, C.white)}${lines(post.headline, pad, H * .655, 19, 76, 73, C.white)}${badge(post.badgeTop || 'Bridgwater', pad, H * .84, C.orange, C.black)}`;
  return `<rect width="${W}" height="${H}" fill="${C.cream}"/><path d="M0 ${H * .12} C${W * .24} ${H * .03},${W * .46} ${H * .2},${W} ${H * .08} V0 H0Z" fill="url(#orangeGradient)" fill-opacity=".25"/>${photo(post, pad, 138, W - pad * 2, H * .49, `${id}-frame`, 28)}<g filter="url(#softShadow)"><rect x="${pad * 1.22}" y="${H * .585}" width="${W - pad * 2.44}" height="${H * .29}" rx="28" fill="#fff"/></g><rect x="${pad * 1.55}" y="${H * .635}" width="78" height="8" rx="4" fill="${C.orange}"/>${eyebrow(post.eyebrow, pad * 1.55, H * .68)}${lines(post.headline, pad * 1.55, H * .74, 22, 61, 59, '#111')}`;
}

function editorialSplit({ post, W, H, pad, variant, index, id }: FamilyArgs): string {
  if (!variant) return `<rect width="${W}" height="${H}" fill="#fff"/>${photo(post, W * .46, 0, W * .54, H * .72, `${id}-photo`, 0)}<path d="M0 ${H * .12} H${W * .56} C${W * .48} ${H * .25},${W * .56} ${H * .44},${W * .48} ${H * .63} H0Z" fill="${C.cream}" filter="url(#softShadow)"/>${ghostNumber(index + 1, W * .48, H * .22, C.deep, .07)}<rect x="${pad * 1.25}" y="${H * .19}" width="82" height="8" rx="4" fill="${C.deep}"/>${eyebrow(post.eyebrow, pad * 1.25, H * .235)}${lines(post.headline, pad * 1.25, H * .31, 16, 66, 64, '#111')}`;
  return `<rect width="${W}" height="${H}" fill="${C.charcoal}"/>${photo(post, W * .57, 0, W * .43, H, `${id}-photo`)}<path d="M${W * .51} 0 C${W * .62} ${H * .2},${W * .47} ${H * .4},${W * .59} ${H * .63} C${W * .63} ${H * .72},${W * .57} ${H * .84},${W * .54} ${H} H${W * .48}V0Z" fill="url(#orangeGradient)"/>${ghostNumber(index + 1, W * .5, H * .2, '#fff', .055)}${eyebrow(post.eyebrow, pad, 190, C.orange)}${lines(post.headline, pad, 265, 15, 69, 66, '#fff')}${lines(post.answer, pad, H * .67, 31, 24, 31, '#eee', 400)}`;
}

function typographic({ post, W, H, pad, variant, index }: FamilyArgs): string {
  if (!variant) return `<rect width="${W}" height="${H}" fill="${C.charcoal}"/>${ghostNumber(index + 1, W - pad, H * .23, '#fff', .045)}<path d="M${W * .66} ${H * .7} C${W * .8} ${H * .55},${W * .94} ${H * .64},${W} ${H * .54} V${H - 120} H${W * .58} C${W * .63} ${H * .86},${W * .57} ${H * .78},${W * .66} ${H * .7}Z" fill="url(#orangeGradient)" fill-opacity=".9"/><rect x="${pad}" y="${H * .16}" width="${W * .55}" height="18" rx="9" fill="${C.orange}"/>${eyebrow(post.eyebrow, pad, H * .13, C.orange)}${lines(post.headline, pad, H * .29, 14, 92, 86, '#fff')}${lines(post.answer, pad, H * .69, 38, 25, 33, '#f4f4f4', 400)}`;
  return `<rect width="${W}" height="${H}" fill="${C.cream}"/><path d="M${W * .64} 0 H${W} V${H * .32} C${W * .89} ${H * .22},${W * .8} ${H * .28},${W * .71} ${H * .18} C${W * .66} ${H * .12},${W * .64} ${H * .06},${W * .64} 0Z" fill="url(#orangeGradient)" fill-opacity=".85"/><g filter="url(#softShadow)"><rect x="${pad}" y="${H * .2}" width="${W - pad * 2}" height="${H * .58}" rx="34" fill="#fff"/></g>${ghostNumber(index + 1, W - pad * 1.35, H * .34, C.orange, .09)}${eyebrow(post.eyebrow, pad * 1.45, H * .29)}${lines(post.headline, pad * 1.45, H * .39, 18, 75, 71, '#111')}${lines(post.answer, pad * 1.45, H * .69, 39, 24, 31, '#444', 400)}`;
}

function problemSolution({ post, W, H, pad, variant, id }: FamilyArgs): string {
  if (!variant) return `<rect width="${W}" height="${H}" fill="#fff"/><g filter="url(#softShadow)">${photo(post, pad, H * .09, (W - pad * 2) / 2 - 12, H * .42, `${id}-left`, 24)}${photo(post, W / 2 + 12, H * .09, (W - pad * 2) / 2 - 12, H * .42, `${id}-right`, 24)}</g><g transform="translate(${W / 2 - 64} ${H * .43})"><rect width="128" height="54" rx="27" fill="${C.orange}"/><text x="64" y="35" text-anchor="middle" font-family="Lato" font-size="14" font-weight="900">SPACE</text></g>${eyebrow(post.eyebrow, pad, H * .61)}${lines(post.headline, pad, H * .69, 24, 60, 58, '#111')}`;
  return `<rect width="${W}" height="${H}" fill="${C.cream}"/><path d="M0 ${H * .76} C${W * .2} ${H * .65},${W * .37} ${H * .86},${W * .58} ${H * .73} C${W * .77} ${H * .61},${W * .92} ${H * .73},${W} ${H * .68} V${H - 120}H0Z" fill="${C.peach}" fill-opacity=".55"/>${photo(post, pad, H * .1, W - pad * 2, H * .39, `${id}-photo`, 28)}<g filter="url(#softShadow)"><rect x="${pad}" y="${H * .54}" width="${W - pad * 2}" height="${H * .29}" rx="28" fill="#fff"/></g>${badge(post.badgeTop || 'A little breathing room', pad * 1.35, H * .58, C.orange, C.black)}${eyebrow(post.eyebrow, pad * 1.35, H * .66)}${lines(post.headline, pad * 1.35, H * .72, 22, 58, 56, '#111')}`;
}

function cardStack({ post, W, H, pad, variant, index }: FamilyArgs): string {
  const bg = variant ? C.charcoal : '#fff';
  const ink = variant ? '#fff' : '#111';
  const cards = post.benefits.slice(0, 3).map((item, i) => {
    const x = pad + i * 14, y = H * .49 + i * 145, width = W - pad * 2 - i * 28;
    return `<g transform="translate(${x} ${y})" filter="url(#softShadow)"><rect width="${width}" height="120" rx="22" fill="${variant ? '#454545' : '#fff'}" stroke="${variant ? '#5d5d5d' : '#ece8e1'}"/><rect width="8" height="120" rx="4" fill="${C.orange}"/><text x="32" y="43" fill="${ink}" font-family="Lato" font-size="22" font-weight="900">${esc(item.title)}</text>${lines(item.body, 32, 76, 45, 17, 22, ink, 400)}</g>`;
  }).join('');
  return `<rect width="${W}" height="${H}" fill="${bg}"/>${ghostNumber(index + 1, W - pad, H * .18, ink, .045)}<path d="M${W * .73} 0 H${W} V${H * .24} C${W * .89} ${H * .17},${W * .82} ${H * .08},${W * .73} 0Z" fill="${C.orange}" fill-opacity="${variant ? .9 : .2}"/>${eyebrow(post.eyebrow, pad, 150, variant ? C.orange : C.deep)}${lines(post.headline, pad, 225, 22, 64, 61, ink)}${cards}`;
}

function benefitGrid({ post, W, H, pad, variant, index, id }: FamilyArgs): string {
  if (!variant) return `<rect width="${W}" height="${H}" fill="#fff"/>${ghostNumber(3, W - pad, H * .24, C.orange, .1)}${eyebrow(post.eyebrow, pad, 150)}${lines(post.headline, pad, 230, 21, 65, 62, '#111')}${benefitCards(post, pad, H * .56, W - pad * 2, '#fff', '#111')}`;
  return `<rect width="${W}" height="${H}" fill="${C.charcoal}"/>${photo(post, W * .61, 0, W * .39, H, `${id}-photo`)}<path d="M${W * .52} 0 C${W * .66} ${H * .19},${W * .54} ${H * .41},${W * .62} ${H * .59} C${W * .68} ${H * .74},${W * .56} ${H * .86},${W * .58} ${H}H0V0Z" fill="${C.charcoal}"/>${ghostNumber(index + 1, W * .53, H * .2, '#fff', .045)}${eyebrow(post.eyebrow, pad, 180, C.orange)}${lines(post.headline, pad, 255, 14, 63, 60, '#fff')}${benefitsInline(post, pad, H * .57, W * .48, '#fff')}`;
}

function reviewProof({ post, W, H, pad, variant, id }: FamilyArgs): string {
  if (!variant) return `<rect width="${W}" height="${H}" fill="#fff"/><path d="M0 ${H * .14} C${W * .22} ${H * .05},${W * .45} ${H * .18},${W * .64} ${H * .08} C${W * .81} 0,${W * .92} ${H * .08},${W} ${H * .03}V0H0Z" fill="${C.cream}"/><text x="${pad}" y="${H * .27}" fill="${C.orange}" font-family="Lato" font-size="155" font-weight="900">“</text>${lines(post.headline, pad, H * .4, 22, 62, 59, '#111')}${lines(post.answer, pad, H * .67, 45, 23, 30, '#555', 400)}<rect x="${pad}" y="${H * .82}" width="160" height="8" rx="4" fill="${C.orange}"/>`;
  return `<rect width="${W}" height="${H}" fill="${C.cream}"/>${photo(post, pad, 125, W * .4, H * .67, `${id}-person`, 28)}<g filter="url(#softShadow)"><rect x="${W * .37}" y="${H * .23}" width="${W * .56}" height="${H * .5}" rx="30" fill="#fff"/></g><text x="${W * .43}" y="${H * .34}" fill="${C.orange}" font-family="Lato" font-size="104" font-weight="900">“</text>${eyebrow(post.eyebrow, W * .43, H * .39)}${lines(post.headline, W * .43, H * .46, 15, 55, 53, '#111')}${lines(post.answer, W * .43, H * .69, 29, 20, 27, '#444', 400)}`;
}

function stepsProcess({ post, W, H, pad, variant, id }: FamilyArgs): string {
  const stepRows = post.benefits.slice(0, 3).map((item, i) => `<g transform="translate(${pad} ${H * .48 + i * 135})"><circle cx="35" cy="35" r="35" fill="${C.orange}"/><text x="35" y="45" text-anchor="middle" fill="#111" font-family="Lato" font-size="26" font-weight="900">${i + 1}</text><text x="95" y="28" fill="#111" font-family="Lato" font-size="22" font-weight="900">${esc(item.title)}</text>${lines(item.body, 95, 60, variant ? 24 : 42, 17, 22, '#444', 400)}</g>`).join('');
  if (!variant) return `<rect width="${W}" height="${H}" fill="#fff"/><path d="M${pad + 35} ${H * .515} C${pad + 10} ${H * .59},${pad + 70} ${H * .63},${pad + 35} ${H * .69} C${pad} ${H * .75},${pad + 70} ${H * .79},${pad + 35} ${H * .85}" fill="none" stroke="${C.peach}" stroke-width="8" stroke-linecap="round"/>${eyebrow(post.eyebrow, pad, 150)}${lines(post.headline, pad, 225, 22, 60, 58, '#111')}${stepRows}`;
  return `<rect width="${W}" height="${H}" fill="${C.cream}"/>${photo(post, W * .65, 0, W * .35, H, `${id}-photo`)}<path d="M${W * .58} 0 C${W * .68} ${H * .2},${W * .58} ${H * .43},${W * .66} ${H * .61} C${W * .71} ${H * .74},${W * .62} ${H * .87},${W * .64} ${H} H0V0Z" fill="${C.cream}"/>${eyebrow(post.eyebrow, pad, 150)}${lines(post.headline, pad, 225, 15, 59, 56, '#111')}${stepRows}`;
}

function localStory({ post, W, H, pad, variant, id }: FamilyArgs): string {
  if (!variant) return `<rect width="${W}" height="${H}" fill="#fff"/>${photo(post, 0, 0, W * .54, H, `${id}-team`)}<g filter="url(#softShadow)"><rect x="${W * .46}" y="${H * .16}" width="${W * .47}" height="${H * .58}" rx="30" fill="${C.cream}"/></g>${badge(post.badgeTop || 'Local team', W * .52, H * .22, C.orange, C.black)}${eyebrow(post.eyebrow, W * .52, H * .31)}${lines(post.headline, W * .52, H * .39, 14, 57, 54, '#111')}`;
  return `<rect width="${W}" height="${H}" fill="${C.charcoal}"/>${photo(post, 0, 0, W, H * .49, `${id}-local`)}<path d="M0 ${H * .43} C${W * .22} ${H * .36},${W * .41} ${H * .5},${W * .62} ${H * .42} C${W * .81} ${H * .35},${W * .93} ${H * .43},${W} ${H * .39} V${H - 120}H0Z" fill="${C.charcoal}"/>${badge(post.badgeTop || 'Bridgwater', pad * 1.25, H * .47, C.orange, C.black)}${eyebrow(post.eyebrow, pad * 1.25, H * .57, C.orange)}${lines(post.headline, pad * 1.25, H * .64, 20, 64, 61, '#fff')}${lines(post.answer, pad * 1.25, H * .82, 38, 20, 27, '#ddd', 400)}`;
}

function trustPricing({ post, W, H, pad, variant, index }: FamilyArgs): string {
  if (!variant) return `<rect width="${W}" height="${H}" fill="#fff"/>${ghostNumber(index + 1, W - pad, H * .27, C.orange, .08)}<rect x="${pad}" y="${H * .14}" width="${W - pad * 2}" height="8" rx="4" fill="${C.orange}"/>${eyebrow(post.eyebrow, pad, H * .22)}${lines(post.headline, pad, H * .31, 19, 69, 66, '#111')}${lines(post.answer, pad, H * .55, 39, 24, 32, '#444', 400)}${benefitCards(post, pad, H * .7, W - pad * 2, '#fff', '#111')}`;
  return `<rect width="${W}" height="${H}" fill="${C.charcoal}"/><path d="M${W * .62} 0 H${W} V${H * .34} C${W * .86} ${H * .27},${W * .75} ${H * .34},${W * .66} ${H * .22} C${W * .61} ${H * .15},${W * .6} ${H * .08},${W * .62} 0Z" fill="url(#orangeGradient)"/><rect x="${pad}" y="${H * .14}" width="${W - pad * 2}" height="8" rx="4" fill="${C.orange}"/>${eyebrow(post.eyebrow, pad, H * .22, C.orange)}${lines(post.headline, pad, H * .31, 19, 69, 66, '#fff')}${lines(post.answer, pad, H * .57, 39, 24, 32, '#eee', 400)}${benefitsInline(post, pad, H * .76, W - pad * 2, '#fff')}`;
}

function campaignCta({ post, W, H, pad, variant, index, id }: FamilyArgs): string {
  if (!variant) return `<rect width="${W}" height="${H}" fill="#fff"/>${photo(post, 0, 0, W, H * .53, `${id}-service`)}<path d="M0 ${H * .47} C${W * .2} ${H * .39},${W * .38} ${H * .55},${W * .59} ${H * .45} C${W * .78} ${H * .36},${W * .91} ${H * .47},${W} ${H * .42} V${H * .64}H0Z" fill="${C.cream}"/><g filter="url(#softShadow)"><rect x="${pad}" y="${H * .48}" width="${W - pad * 2}" height="${H * .32}" rx="30" fill="${C.cream}"/></g>${badge(post.badgeTop || post.ctaType, pad * 1.35, H * .53, C.orange, C.black)}${eyebrow(post.eyebrow, pad * 1.35, H * .62)}${lines(post.headline, pad * 1.35, H * .69, 20, 62, 59, '#111')}`;
  return `<rect width="${W}" height="${H}" fill="${C.charcoal}"/>${ghostNumber(index + 1, W - pad, H * .22, '#fff', .045)}<g filter="url(#softShadow)"><rect x="${pad}" y="${H * .13}" width="${W - pad * 2}" height="${H * .64}" rx="34" fill="url(#orangeGradient)"/></g><path d="M${pad} ${H * .62} C${W * .26} ${H * .54},${W * .42} ${H * .72},${W * .62} ${H * .6} C${W * .78} ${H * .51},${W * .88} ${H * .58},${W - pad} ${H * .54}V${H * .77}H${pad}Z" fill="#fff" fill-opacity=".1"/>${eyebrow(post.eyebrow, pad * 1.45, H * .23, '#fff')}${lines(post.headline, pad * 1.45, H * .33, 18, 71, 68, '#fff')}${lines(post.answer, pad * 1.45, H * .63, 37, 24, 32, '#fff', 400)}${badge(post.ctaType || 'Find out more', pad * 1.45, H * .72, '#fff', C.black)}`;
}

function lifestyle({ post, W, H, pad, variant, id }: FamilyArgs): string {
  if (!variant) return `<rect width="${W}" height="${H}" fill="#fff"/><g filter="url(#softShadow)">${photo(post, pad, 105, W - pad * 2, H * .48, `${id}-journal`, 28)}</g><path d="M0 ${H * .68} C${W * .22} ${H * .6},${W * .45} ${H * .74},${W * .64} ${H * .65} C${W * .79} ${H * .58},${W * .92} ${H * .65},${W} ${H * .61} V${H * .73}H0Z" fill="${C.cream}"/><rect x="${pad}" y="${H * .615}" width="82" height="8" rx="4" fill="${C.orange}"/>${eyebrow(post.eyebrow, pad, H * .66)}${lines(post.headline, pad, H * .73, 22, 61, 59, '#111')}`;
  return `<rect width="${W}" height="${H}" fill="${C.charcoal}"/>${photo(post, W * .55, 0, W * .45, H, `${id}-business`)}<path d="M0 ${H * .14} H${W * .61} C${W * .54} ${H * .29},${W * .63} ${H * .43},${W * .55} ${H * .61} C${W * .5} ${H * .72},${W * .57} ${H * .82},${W * .52} ${H}H0Z" fill="${C.charcoal}"/><g filter="url(#softShadow)"><rect x="${pad}" y="${H * .16}" width="${W * .51}" height="${H * .54}" rx="30" fill="${C.peach}"/></g>${badge(post.badgeTop || 'Business storage', pad * 1.35, H * .22, C.deep, '#fff')}${eyebrow(post.eyebrow, pad * 1.35, H * .31, C.deep)}${lines(post.headline, pad * 1.35, H * .39, 16, 59, 56, '#111')}${lines(post.answer, pad * 1.35, H * .65, 30, 20, 27, '#333', 400)}`;
}

const familyRenderers = [immersive, editorialSplit, typographic, problemSolution, cardStack, benefitGrid, reviewProof, stepsProcess, localStory, trustPricing, campaignCta, lifestyle];

export function renderArtworkSvg(post: SocialPost, size: RenderSize = 'portrait'): string {
  const [W, H] = sizes[size];
  const id = normaliseTemplateId(post.template);
  const index = Math.max(0, templates.findIndex(template => template.id === id));
  const family = Math.floor(index / 2);
  const variant = index % 2;
  const pad = Math.round(W * .065);
  const renderer = familyRenderers[family] ?? immersive;
  const body = renderer({ post, W, H, pad, variant, index, id });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${sharedDefs()}${body}${footer(post, W, H, pad)}</svg>`;
}

export function svgDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

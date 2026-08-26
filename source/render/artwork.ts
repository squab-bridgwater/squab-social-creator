import type { SocialPost } from '../types';
import { brand } from '../brand/tokens';
import { normaliseTemplateId, templates } from '../templates/registry';

export type RenderSize = 'portrait' | 'square' | 'linkedin';
const sizes: Record<RenderSize, [number, number]> = { portrait: [1080, 1350], square: [1080, 1080], linkedin: [1200, 1200] };

const familyIndex = (templateId: string) => Math.max(0, templates.findIndex(template => template.id === normaliseTemplateId(templateId)));
const esc = (text = '') => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
const wrap = (text: string, limit: number) => {
  const words = text.trim().split(/\s+/); const lines: string[] = []; let line = '';
  words.forEach(word => { const next = `${line} ${word}`.trim(); if (next.length > limit && line) { lines.push(line); line = word; } else line = next; });
  if (line) lines.push(line); return lines.slice(0, 5);
};

function textLines(text: string, x: number, y: number, widthChars: number, size: number, lineHeight: number, fill: string, weight = 900, anchor = 'start') {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="Lato,Arial,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${wrap(text, widthChars).map((line, i) => `<tspan x="${x}" dy="${i ? lineHeight : 0}">${esc(line)}</tspan>`).join('')}</text>`;
}

function imageLayer(post: SocialPost, x: number, y: number, w: number, h: number, id: string) {
  if (!post.image) return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#d2d2d2"/><text x="${x + w / 2}" y="${y + h / 2}" text-anchor="middle" fill="#666" font-family="Lato,Arial,sans-serif" font-size="28" font-weight="700">PHOTO</text>`;
  return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><image href="${post.image}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
}

function logoLockup(x: number, y: number, light = false) {
  const fill = light ? '#ffffff' : '#000000';
  return `<g transform="translate(${x} ${y})" fill="${fill}"><text x="0" y="0" font-family="Lato,Arial,sans-serif" font-size="44" font-weight="900" letter-spacing="2">SQUAB</text><text x="2" y="24" font-family="Lato,Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="4">STORAGE</text></g>`;
}

function benefits(post: SocialPost, x: number, y: number, w: number, fill: string) {
  const items = post.benefits.slice(0, 3); if (!items.length) return '';
  const cell = w / items.length;
  return items.map((item, i) => `<g transform="translate(${x + i * cell} ${y})"><line x1="0" y1="0" x2="${cell - 28}" y2="0" stroke="${fill}" stroke-opacity=".35"/><text x="0" y="34" fill="${fill}" font-family="Lato,Arial,sans-serif" font-size="21" font-weight="900">${esc(item.title)}</text>${textLines(item.body, 0, 65, 24, 15, 20, fill, 400)}</g>`).join('');
}

export function renderArtworkSvg(post: SocialPost, size: RenderSize = 'portrait'): string {
  const [W, H] = sizes[size]; const id = normaliseTemplateId(post.template); const idx = familyIndex(id); const family = Math.floor(idx / 2); const variant = idx % 2;
  const orange = brand.colours.orange; const deep = brand.colours.deepOrange; const charcoal = brand.colours.charcoal; const cream = brand.colours.paleOrange; const peach = brand.colours.lightOrange;
  const dark = variant === 1 || [2, 5, 9, 10].includes(family); const bg = dark ? charcoal : '#ffffff'; const ink = dark ? '#ffffff' : '#111111';
  const pad = Math.round(W * .065); const footerY = H - 82; let body = '';
  const photo = (x:number,y:number,w:number,h:number,n:string) => imageLayer(post,x,y,w,h,`clip-${id}-${n}`);
  const headline = (x:number,y:number,chars=20,sizePx=Math.round(W*.067),colour=ink) => textLines(post.headline,x,y,chars,sizePx,Math.round(sizePx*.96),colour,900);
  const eyebrow = (x:number,y:number,colour=deep) => `<text x="${x}" y="${y}" fill="${colour}" font-family="Lato,Arial,sans-serif" font-size="18" font-weight="900" letter-spacing="3">${esc(post.eyebrow.toUpperCase())}</text>`;
  switch (family) {
    case 0: body = variant ? `<rect width="${W}" height="${H}" fill="${cream}"/>${photo(pad,150,W-pad*2,H*.49,'a')}<rect x="${pad}" y="${H*.61}" width="${W-pad*2}" height="${H*.28}" fill="#fff"/>${eyebrow(pad*1.5,H*.68)}${headline(pad*1.5,H*.735,23,62,'#111')}` : `${photo(0,0,W,H,'a')}<rect width="${W}" height="${H}" fill="url(#shade)"/><defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="20%" stop-color="#000" stop-opacity=".05"/><stop offset="85%" stop-color="#000" stop-opacity=".82"/></linearGradient></defs>${eyebrow(pad,H*.57,'#fff')}${headline(pad,H*.64,19,76,'#fff')}`; break;
    case 1: body = variant ? `<rect width="${W*.54}" height="${H}" fill="${charcoal}"/>${photo(W*.54,0,W*.46,H,'a')}${eyebrow(pad,190,orange)}${headline(pad,260,15,70,'#fff')}${textLines(post.answer,pad,H*.66,31,24,32,'#fff',400)}` : `<rect width="${W}" height="${H}" fill="#fff"/>${photo(W*.46,0,W*.54,H*.72,'a')}<rect x="${pad}" y="${H*.13}" width="${W*.49}" height="${H*.5}" fill="${cream}"/>${eyebrow(pad*1.45,H*.2)}${headline(pad*1.45,H*.28,16,67,'#111')}`; break;
    case 2: body = `<rect width="${W}" height="${H}" fill="${variant ? cream : charcoal}"/><rect x="${pad}" y="${H*.17}" width="${variant ? 130 : W*.56}" height="18" fill="${orange}"/>${eyebrow(pad,H*.13,variant?deep:orange)}${headline(pad,H*.28,variant?17:14,variant?76:92,ink)}${textLines(post.answer,pad,H*.68,42,27,36,ink,400)}`; break;
    case 3: body = variant ? `<rect width="${W}" height="${H}" fill="${cream}"/>${photo(pad,H*.11,W-pad*2,H*.38,'a')}<rect x="${pad}" y="${H*.55}" width="${W-pad*2}" height="${H*.29}" fill="#fff"/>${eyebrow(pad*1.45,H*.62)}${headline(pad*1.45,H*.69,22,59,'#111')}` : `<rect width="${W}" height="${H}" fill="#fff"/>${photo(pad,H*.1,(W-pad*2)/2-10,H*.42,'a')}${photo(W/2+10,H*.1,(W-pad*2)/2-10,H*.42,'b')}${eyebrow(pad,H*.61)}${headline(pad,H*.68,24,60,'#111')}`; break;
    case 4: body = `<rect width="${W}" height="${H}" fill="${bg}"/>${eyebrow(pad,150)}${headline(pad,225,22,64,ink)}${post.benefits.slice(0,3).map((b,i)=>`<g transform="translate(${pad+i*14} ${H*.49+i*150})"><rect width="${W-pad*2-i*28}" height="125" rx="10" fill="${variant? '#444':'#fff'}" stroke="${variant?'#666':'#ddd'}"/><text x="28" y="43" fill="${ink}" font-family="Lato" font-size="22" font-weight="900">${esc(b.title)}</text>${textLines(b.body,28,76,46,17,22,ink,400)}</g>`).join('')}`; break;
    case 5: body = `<rect width="${W}" height="${H}" fill="${bg}"/>${variant?photo(W*.58,0,W*.42,H,'a'):''}${eyebrow(pad,160)}${headline(pad,235,variant?14:21,65,ink)}${benefits(post,pad,H*.55,variant?W*.48:W-pad*2,ink)}`; break;
    case 6: body = variant ? `<rect width="${W}" height="${H}" fill="${cream}"/>${photo(pad,130,W*.38,H*.66,'a')}<rect x="${W*.38}" y="${H*.24}" width="${W*.54}" height="${H*.48}" fill="#fff"/>${eyebrow(W*.43,H*.32)}${headline(W*.43,H*.4,15,57,'#111')}${textLines(post.answer,W*.43,H*.66,29,22,29,'#333',400)}` : `<rect width="${W}" height="${H}" fill="#fff"/><text x="${pad}" y="${H*.24}" fill="${orange}" font-family="Georgia,serif" font-size="130">“</text>${headline(pad,H*.37,22,62,'#111')}${textLines(post.answer,pad,H*.64,45,23,31,'#555',400)}`; break;
    case 7: body = `<rect width="${W}" height="${H}" fill="${variant?cream:'#fff'}"/>${variant?photo(W*.62,0,W*.38,H,'a'):''}${eyebrow(pad,150)}${headline(pad,225,variant?15:22,60,'#111')}${post.benefits.slice(0,3).map((b,i)=>`<g transform="translate(${pad} ${H*.48+i*135})"><circle cx="35" cy="35" r="35" fill="${orange}"/><text x="35" y="45" text-anchor="middle" fill="#111" font-family="Lato" font-size="26" font-weight="900">${i+1}</text><text x="95" y="28" fill="#111" font-family="Lato" font-size="22" font-weight="900">${esc(b.title)}</text>${textLines(b.body,95,60,variant?24:42,17,22,'#444',400)}</g>`).join('')}`; break;
    case 8: body = variant ? `<rect width="${W}" height="${H}" fill="${charcoal}"/>${photo(0,0,W,H*.48,'a')}<rect x="${pad}" y="${H*.4}" width="${W-pad*2}" height="${H*.43}" fill="${charcoal}"/>${eyebrow(pad*1.4,H*.49,orange)}${headline(pad*1.4,H*.57,20,65,'#fff')}${textLines(post.answer,pad*1.4,H*.78,38,21,28,'#fff',400)}` : `<rect width="${W}" height="${H}" fill="#fff"/>${photo(0,0,W*.52,H,'a')}<rect x="${W*.47}" y="${H*.16}" width="${W*.47}" height="${H*.6}" fill="${cream}"/>${eyebrow(W*.53,H*.25)}${headline(W*.53,H*.33,14,58,'#111')}`; break;
    case 9: body = `<rect width="${W}" height="${H}" fill="${variant?charcoal:'#fff'}"/><rect x="${pad}" y="${H*.14}" width="${W-pad*2}" height="8" fill="${orange}"/>${eyebrow(pad,H*.22,orange)}${headline(pad,H*.3,19,70,ink)}${textLines(post.answer,pad,H*.58,39,26,35,ink,400)}${benefits(post,pad,H*.73,W-pad*2,ink)}`; break;
    case 10: body = variant ? `<rect width="${W}" height="${H}" fill="${charcoal}"/><rect x="${pad}" y="${H*.14}" width="${W-pad*2}" height="${H*.64}" fill="${deep}"/>${eyebrow(pad*1.5,H*.23,'#fff')}${headline(pad*1.5,H*.32,18,72,'#fff')}${textLines(post.answer,pad*1.5,H*.63,38,25,34,'#fff',400)}` : `<rect width="${W}" height="${H}" fill="#fff"/>${photo(0,0,W,H*.52,'a')}<rect x="${pad}" y="${H*.43}" width="${W-pad*2}" height="${H*.38}" fill="${cream}"/>${eyebrow(pad*1.4,H*.52)}${headline(pad*1.4,H*.6,20,63,'#111')}`; break;
    default: body = variant ? `<rect width="${W}" height="${H}" fill="${charcoal}"/>${photo(W*.55,0,W*.45,H,'a')}<rect x="${pad}" y="${H*.16}" width="${W*.52}" height="${H*.56}" fill="${peach}"/>${eyebrow(pad*1.35,H*.25,deep)}${headline(pad*1.35,H*.34,16,60,'#111')}` : `<rect width="${W}" height="${H}" fill="#fff"/>${photo(pad,110,W-pad*2,H*.48,'a')}${eyebrow(pad,H*.65)}${headline(pad,H*.72,22,62,'#111')}`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}<rect x="0" y="${H-120}" width="${W}" height="120" fill="${dark?'#111':'#fff'}" fill-opacity=".96"/>${logoLockup(pad,footerY,dark)}<text x="${W-pad}" y="${footerY}" text-anchor="end" fill="${dark?'#fff':'#111'}" font-family="Lato,Arial,sans-serif" font-size="18" font-weight="700">${esc(post.footerTitle)}</text><text x="${W-pad}" y="${footerY+28}" text-anchor="end" fill="${dark?'#ddd':'#555'}" font-family="Lato,Arial,sans-serif" font-size="14">${esc(post.footerLine)}</text></svg>`;
}

export function svgDataUrl(svg: string): string { return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; }
export function downloadSvg(post: SocialPost, size: RenderSize = 'portrait') { const blob = new Blob([renderArtworkSvg(post,size)],{type:'image/svg+xml'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${post.id}-${size}.svg`; a.click(); URL.revokeObjectURL(url); }

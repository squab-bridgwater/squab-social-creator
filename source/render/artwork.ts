import type { SocialPost } from '../types';
import { brand } from '../brand/tokens';
import { squabLogoData } from '../brand/logoData';
import { normaliseTemplateId } from '../templates/registry';

export type RenderSize = 'portrait' | 'square' | 'story' | 'linkedin';
const sizes: Record<RenderSize,[number,number]> = { portrait:[1080,1350], square:[1080,1080], story:[1080,1920], linkedin:[1200,1200] };
const C = brand.colours;
const esc=(value='')=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]||char));

function wrap(text:string,limit:number,max=6){const words=text.trim().split(/\s+/).filter(Boolean);const out:string[]=[];let line='';for(const word of words){const next=`${line} ${word}`.trim();if(next.length>limit&&line){out.push(line);line=word}else line=next}if(line)out.push(line);return out.slice(0,max)}
function lines(text:string,x:number,y:number,chars:number,size:number,leading:number,fill:string,weight=900,rotate=0,anchor='start'){return `<g transform="rotate(${rotate} ${x} ${y})"><text x="${x}" y="${y}" fill="${fill}" font-family="Lato,Arial,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${size>80?-2:0}">${wrap(text,chars).map((line,i)=>`<tspan x="${x}" dy="${i?leading:0}">${esc(line)}</tspan>`).join('')}</text></g>`}
function logo(x:number,y:number,w=205){return `<image href="${squabLogoData}" x="${x}" y="${y}" width="${w}" preserveAspectRatio="xMinYMid meet"/>`}
function defs(){return `<defs>
  <filter id="shadow"><feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000" flood-opacity=".28"/></filter>
  <filter id="paperShadow"><feDropShadow dx="2" dy="12" stdDeviation="8" flood-color="#000" flood-opacity=".32"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="9"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .13"/></feComponentTransfer></filter>
  <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="8%" stop-color="#000" stop-opacity=".06"/><stop offset="68%" stop-color="#000" stop-opacity=".2"/><stop offset="100%" stop-color="#000" stop-opacity=".88"/></linearGradient>
  <linearGradient id="sideShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".82"/><stop offset="60%" stop-color="#000" stop-opacity=".4"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.orange}"/><stop offset="1" stop-color="${C.orangeDark}"/></linearGradient>
  <pattern id="missing" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="22" height="44" fill="#242424"/><rect x="22" width="22" height="44" fill="#333"/></pattern>
</defs>`}
function scribble(x:number,y:number,w:number,stroke=C.orange,width=12){return `<path d="M${x} ${y} C${x+w*.16} ${y-13},${x+w*.3} ${y+13},${x+w*.46} ${y-5} S${x+w*.74} ${y+15},${x+w} ${y-3}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`}
function doubleScribble(x:number,y:number,w:number){return `${scribble(x,y,w,C.orange,11)}${scribble(x+18,y+20,w*.86,C.orange,7)}`}
function footer(W:number,H:number,pad:number){const fh=H>1500?148:116;return `<rect x="0" y="${H-fh}" width="${W}" height="${fh}" fill="#fff"/>${logo(pad,H-fh+18,190)}<text x="${W-pad}" y="${H-fh/2+5}" text-anchor="end" fill="#111" font-family="Lato,Arial,sans-serif" font-size="${H>1500?18:15}" font-weight="700">SQUAB STORAGE · BRIDGWATER</text>`}
function incomplete(W:number,H:number,label='PHOTO REQUIRED'){return `<rect width="${W}" height="${H}" fill="url(#missing)"/><rect x="${W*.1}" y="${H*.4}" width="${W*.8}" height="${Math.min(170,H*.16)}" rx="8" fill="#111" fill-opacity=".92"/><text x="${W/2}" y="${H*.48}" text-anchor="middle" fill="${C.orange}" font-family="Lato,Arial,sans-serif" font-size="${Math.round(W*.065)}" font-weight="900">${label}</text><text x="${W/2}" y="${H*.53}" text-anchor="middle" fill="#fff" font-family="Lato,Arial,sans-serif" font-size="18" font-weight="700">Assign suitable photography before visual approval.</text>`}
function image(data:string|undefined,x:number,y:number,w:number,h:number,id:string,position='xMidYMid',fallbackLabel='PHOTO REQUIRED'){if(!data)return `<g transform="translate(${x} ${y})">${incomplete(w,h,fallbackLabel)}</g>`;return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><image href="${data}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${position} slice" clip-path="url(#${id})"/>`}
function photo(post:SocialPost,x:number,y:number,w:number,h:number,id:string,position='xMidYMid'){return image(post.image,x,y,w,h,id,position)}
function benefitChecks(post:SocialPost,x:number,y:number,fill='#fff',gap=54){return post.benefits.slice(0,3).map((b,i)=>`<g transform="translate(${x} ${y+i*gap})"><path d="M0 16 l8 8 l18 -22" fill="none" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/><text x="42" y="23" fill="${fill}" font-family="Lato,Arial,sans-serif" font-size="20" font-weight="900">${esc(b.title||b.body)}</text></g>`).join('')}
function tornVertical(x:number,y:number,h:number,amp=18){let d=`M${x} ${y}`;for(let yy=y;yy<h+y;yy+=46)d+=` l${((yy/46)%2===0?amp:-amp)} 23 l${((yy/46)%2===0?-amp:amp)} 23`;return d+` L${x+12} ${y+h} Z`}
function tornPaperPath(x:number,y:number,w:number,h:number){return `M${x+10} ${y+8} L${x+w-18} ${y} L${x+w} ${y+h-20} L${x+w-26} ${y+h-8} L${x+w-60} ${y+h} L${x+w-88} ${y+h-11} L${x+w-122} ${y+h} L${x+88} ${y+h-8} L${x+42} ${y+h} L${x} ${y+h-18} Z`}

function renderBold(post:SocialPost,W:number,H:number,pad:number){
  if(!post.image)return `${incomplete(W,H)}${footer(W,H,pad)}`;
  const safeBottom=H-(H>1500?148:116); const headline=wrap(post.headline,13,4); const first=headline[0]||'MORE'; const rest=headline.slice(1).join(' ')||post.support;
  return `${photo(post,0,0,W,safeBottom,'bold','xMidYMid')}<rect width="${W}" height="${safeBottom}" fill="url(#shade)"/><path d="M0 0 H${W*.74} L${W*.62} ${safeBottom*.42} H0Z" fill="#000" fill-opacity=".55"/>
  <text x="${pad-10}" y="${safeBottom*.18}" fill="#fff" font-family="Lato,Arial,sans-serif" font-size="${Math.round(W*.185)}" font-weight="900" letter-spacing="-8">${esc(first.toUpperCase())}</text>
  ${lines(rest,pad,safeBottom*.29,15,Math.round(W*.085),Math.round(W*.082),'#fff',900,-2)}
  ${doubleScribble(pad,safeBottom*.51,W*.42)}
  <g transform="translate(${pad} ${safeBottom*.61})"><text x="0" y="0" fill="#fff" font-family="Lato" font-size="18" font-weight="900" letter-spacing="2">${esc((post.eyebrow||'MORE SPACE').toUpperCase())}</text>${benefitChecks(post,0,48,'#fff',50)}</g>${footer(W,H,pad)}`;
}

function renderPeople(post:SocialPost,W:number,H:number,pad:number){
  if(!post.image)return `${incomplete(W,H,'PEOPLE PHOTO REQUIRED')}${footer(W,H,pad)}`;
  const safeBottom=H-(H>1500?148:116), paperW=W*.47, paperH=Math.min(safeBottom*.58,720), paperY=safeBottom*.1;
  return `${photo(post,0,0,W,safeBottom,'people','xMidYMid')}<rect width="${W}" height="${safeBottom}" fill="url(#sideShade)" fill-opacity=".38"/>
  <path d="${tornPaperPath(pad*.45,paperY,paperW,paperH)}" fill="#f5efe5" filter="url(#paperShadow)"/>
  ${lines(post.headline,pad*.8,paperY+90,15,Math.round(W*.067),Math.round(W*.071),'#111',900,-3)}${doubleScribble(pad*.8,paperY+paperH*.72,W*.28)}
  <g transform="translate(${pad*.8} ${paperY+paperH*.83})"><rect width="${W*.28}" height="62" fill="#111"/><text x="20" y="39" fill="#fff" font-family="Lato" font-size="16" font-weight="900">REAL PEOPLE. REAL STORIES.</text></g>
  <text x="${W-pad}" y="${safeBottom-45}" text-anchor="end" fill="#fff" font-family="Lato" font-size="20" font-weight="900">${esc(post.support||post.answer)}</text>${footer(W,H,pad)}`;
}

function renderTransformation(post:SocialPost,W:number,H:number,pad:number){
  const safeBottom=H-(H>1500?148:116), photoH=safeBottom*.73;
  if(!post.image||!post.secondaryImage)return `<rect width="${W}" height="${safeBottom}" fill="#111"/>${post.image?image(post.image,0,0,W*.5,photoH,'before','xMidYMid'):`<g>${incomplete(W*.5,photoH,'BEFORE PHOTO REQUIRED')}</g>`}${post.secondaryImage?image(post.secondaryImage,W*.5,0,W*.5,photoH,'after','xMidYMid'):`<g transform="translate(${W*.5} 0)">${incomplete(W*.5,photoH,'AFTER PHOTO REQUIRED')}</g>`}<text x="${pad}" y="${photoH+70}" fill="#fff" font-family="Lato" font-size="24" font-weight="900">TRANSFORMATION REQUIRES TWO DIFFERENT PHOTOS</text>${footer(W,H,pad)}`;
  return `${image(post.image,0,0,W*.5,photoH,'before','xMidYMid')}<rect x="0" width="${W*.5}" height="${photoH}" fill="#000" fill-opacity=".28"/>${image(post.secondaryImage,W*.5,0,W*.5,photoH,'after','xMidYMid')}
  <g transform="translate(${pad} ${pad}) rotate(-3)"><rect width="128" height="52" fill="#f5efe5" filter="url(#paperShadow)"/><text x="18" y="34" fill="#111" font-family="Lato" font-size="22" font-weight="900">BEFORE</text></g>
  <g transform="translate(${W*.55} ${pad}) rotate(2)"><rect width="116" height="52" fill="#f5efe5" filter="url(#paperShadow)"/><text x="18" y="34" fill="#111" font-family="Lato" font-size="22" font-weight="900">AFTER</text></g>
  <path d="${tornVertical(W*.5-8,0,photoH,20)}" fill="#f5efe5"/>
  <path d="M0 ${photoH-48} C${W*.18} ${photoH-76},${W*.31} ${photoH-15},${W*.46} ${photoH-52} S${W*.76} ${photoH-16},${W} ${photoH-58} V${safeBottom} H0Z" fill="#f5efe5"/>
  ${lines(post.headline,pad,photoH+70,20,Math.round(W*.062),Math.round(W*.065),'#111',900,-1)}${doubleScribble(pad,safeBottom-76,W*.39)}${footer(W,H,pad)}`;
}

function renderLocal(post:SocialPost,W:number,H:number,pad:number){
  if(!post.image)return `${incomplete(W,H,'BRIDGWATER PHOTO REQUIRED')}${footer(W,H,pad)}`;
  const safeBottom=H-(H>1500?148:116);
  return `${photo(post,0,0,W,safeBottom,'local','xMidYMid')}<rect width="${W}" height="${safeBottom}" fill="url(#shade)"/><rect width="${W}" height="${safeBottom}" fill="#041018" fill-opacity=".16"/>
  <g transform="translate(${pad} ${safeBottom*.1}) rotate(-2)">${lines(post.headline,0,0,17,Math.round(W*.071),Math.round(W*.074),'#fff',900,0)}${doubleScribble(0,safeBottom*.27,W*.44)}</g>
  <g transform="translate(${W*.53} ${safeBottom*.55}) rotate(-2)" filter="url(#paperShadow)"><path d="M0 12 L${W*.39} 0 L${W*.41} 172 L12 184Z" fill="${C.orange}"/><text x="24" y="50" fill="#111" font-family="Lato" font-size="19" font-weight="900">✓ LOCAL PEOPLE</text><text x="24" y="93" fill="#111" font-family="Lato" font-size="19" font-weight="900">✓ LOCAL BUSINESS</text><text x="24" y="136" fill="#111" font-family="Lato" font-size="19" font-weight="900">✓ STRONGER COMMUNITY</text></g>
  <text x="${pad}" y="${safeBottom-45}" fill="#fff" font-family="Lato" font-size="18" font-weight="900" letter-spacing="2">BRIDGWATER · SOMERSET</text>${footer(W,H,pad)}`;
}

function renderLifestyle(post:SocialPost,W:number,H:number,pad:number){
  if(!post.image)return `${incomplete(W,H,'LIFESTYLE PHOTO REQUIRED')}${footer(W,H,pad)}`;
  const safeBottom=H-(H>1500?148:116);
  return `${photo(post,0,0,W,safeBottom,'life','xMidYMid')}<rect width="${W}" height="${safeBottom}" fill="url(#shade)" fill-opacity=".58"/>
  <path d="M0 0 H${W*.8} C${W*.66} ${safeBottom*.09},${W*.58} ${safeBottom*.21},${W*.44} ${safeBottom*.31} C${W*.3} ${safeBottom*.41},${W*.17} ${safeBottom*.45},0 ${safeBottom*.48}Z" fill="#fff" fill-opacity=".94"/>
  ${lines(post.headline,pad,safeBottom*.11,15,Math.round(W*.075),Math.round(W*.076),'#111',900,-2)}${doubleScribble(pad,safeBottom*.38,W*.4)}
  <g transform="translate(${W*.72} ${safeBottom*.2})" fill="#111" font-family="Lato" font-weight="900" font-size="16"><text y="0">EXPLORE</text><text y="54">CREATE</text><text y="108">LIVE</text><text y="162">BREATHE</text></g>
  <text x="${pad}" y="${safeBottom-42}" fill="#fff" font-family="Lato" font-size="20" font-weight="900">${esc(post.support||'SPACE CREATES FREEDOM.')}</text>${footer(W,H,pad)}`;
}

function renderFits(post:SocialPost,W:number,H:number,pad:number){
  if(!post.image)return `${incomplete(W,H,'OBJECT-RICH PHOTO REQUIRED')}${footer(W,H,pad)}`;
  const safeBottom=H-(H>1500?148:116);
  return `${photo(post,0,0,W,safeBottom,'fits','xMidYMid')}<rect width="${W}" height="${safeBottom}" fill="url(#sideShade)"/>
  ${lines(post.headline,pad,safeBottom*.13,11,Math.round(W*.088),Math.round(W*.084),'#fff',900,-1)}${doubleScribble(pad,safeBottom*.48,W*.34)}
  <g transform="translate(${W*.53} ${safeBottom*.38}) rotate(-3)" filter="url(#paperShadow)"><path d="M0 16 L${W*.39} 0 L${W*.4} ${safeBottom*.32} L18 ${safeBottom*.34}Z" fill="#f5efe5"/><text x="24" y="52" fill="#111" font-family="Lato" font-size="22" font-weight="900">WHAT FITS?</text>${post.benefits.slice(0,3).map((b,i)=>`<text x="24" y="${102+i*54}" fill="#111" font-family="Lato" font-size="20" font-weight="900">✓ ${esc(b.title)}</text>`).join('')}</g>
  <g transform="translate(${pad} ${safeBottom*.72}) rotate(-4)"><ellipse cx="${W*.2}" cy="58" rx="${W*.21}" ry="58" fill="none" stroke="${C.orange}" stroke-width="10"/><text x="${W*.2}" y="52" text-anchor="middle" fill="${C.orange}" font-family="Lato" font-size="22" font-weight="900">WHATEVER YOUR</text><text x="${W*.2}" y="82" text-anchor="middle" fill="${C.orange}" font-family="Lato" font-size="22" font-weight="900">NEXT CHAPTER</text></g>${footer(W,H,pad)}`;
}

function renderSeasonal(post:SocialPost,W:number,H:number,pad:number){const safe=H-(H>1500?148:116);return `${post.image?photo(post,0,0,W,safe,'season'):incomplete(W,safe,'SEASONAL PHOTO REQUIRED')}<rect width="${W}" height="${safe}" fill="url(#shade)"/>${lines(post.headline,pad,safe*.18,15,Math.round(W*.075),Math.round(W*.074),'#fff')}${doubleScribble(pad,safe*.48,W*.4)}${footer(W,H,pad)}`}
function renderBusiness(post:SocialPost,W:number,H:number,pad:number){const safe=H-(H>1500?148:116);return `${post.image?photo(post,0,0,W,safe,'business'):incomplete(W,safe,'WORKSPACE PHOTO REQUIRED')}<rect width="${W}" height="${safe}" fill="url(#sideShade)"/>${lines(post.headline,pad,safe*.16,13,Math.round(W*.078),Math.round(W*.076),'#fff')}${doubleScribble(pad,safe*.48,W*.34)}${benefitChecks(post,pad,safe*.58)}${footer(W,H,pad)}`}
function renderTrust(post:SocialPost,W:number,H:number,pad:number){const safe=H-(H>1500?148:116);return `${post.image?photo(post,0,0,W,safe,'trust'):incomplete(W,safe,'SECURITY PHOTO REQUIRED')}<rect width="${W}" height="${safe}" fill="#000" fill-opacity=".4"/><rect x="${pad}" y="${safe*.12}" width="10" height="${safe*.44}" fill="${C.orange}"/>${lines(post.headline,pad*1.45,safe*.18,16,Math.round(W*.064),Math.round(W*.066),'#fff')}${benefitChecks(post,W*.69,safe*.22)}${footer(W,H,pad)}`}
function renderTactile(post:SocialPost,W:number,H:number,pad:number){const safe=H-(H>1500?148:116);return `<rect width="${W}" height="${safe}" fill="#252525"/><rect width="${W}" height="${safe}" filter="url(#grain)" opacity=".8"/><g transform="translate(${pad} ${safe*.12}) rotate(-4)" filter="url(#paperShadow)"><path d="${tornPaperPath(0,0,W*.67,safe*.48)}" fill="#f4efe5"/>${lines(post.headline,34,96,15,Math.round(W*.068),Math.round(W*.071),'#111')}${doubleScribble(34,safe*.35,W*.33)}</g><g transform="translate(${W*.49} ${safe*.62}) rotate(5)"><path d="${tornPaperPath(0,0,W*.39,142)}" fill="${C.orange}"/><text x="24" y="58" fill="#111" font-family="Lato" font-size="25" font-weight="900">SPACE CREATES</text><text x="24" y="96" fill="#111" font-family="Lato" font-size="25" font-weight="900">POSSIBILITIES.</text></g>${footer(W,H,pad)}`}
function renderMinimal(post:SocialPost,W:number,H:number,pad:number){const safe=H-(H>1500?148:116);return `<rect width="${W}" height="${safe}" fill="#111"/>${post.image?photo(post,W*.55,0,W*.45,safe,'minimal'):''}${lines(post.headline,pad,safe*.18,12,Math.round(W*.078),Math.round(W*.077),'#fff')}<rect x="${pad}" y="${safe*.53}" width="${W*.3}" height="9" fill="${C.orange}"/>${footer(W,H,pad)}`}
function renderPlayful(post:SocialPost,W:number,H:number,pad:number){const safe=H-(H>1500?148:116);return `<rect width="${W}" height="${safe}" fill="#a9def9"/>${post.image?photo(post,0,0,W,safe,'play'):incomplete(W,safe,'PLAYFUL HERO PHOTO REQUIRED')}<g transform="translate(${pad} ${safe*.12}) rotate(-5)" filter="url(#paperShadow)"><rect width="${W*.45}" height="${safe*.24}" fill="#fff"/>${lines(post.headline,24,70,12,Math.round(W*.062),Math.round(W*.064),'#111')}</g>${footer(W,H,pad)}`}

export function renderArtworkSvg(post:SocialPost,size:RenderSize='portrait'):string{
 const [W,H]=sizes[size];const pad=Math.round(W*.062);const id=normaliseTemplateId(post.template);let body='';
 switch(id){case'bold-impact':body=renderBold(post,W,H,pad);break;case'real-people':body=renderPeople(post,W,H,pad);break;case'transformation':body=renderTransformation(post,W,H,pad);break;case'local-pride':body=renderLocal(post,W,H,pad);break;case'lifestyle-freedom':body=renderLifestyle(post,W,H,pad);break;case'what-fits':body=renderFits(post,W,H,pad);break;case'seasonal-moment':body=renderSeasonal(post,W,H,pad);break;case'business-growth':body=renderBusiness(post,W,H,pad);break;case'trust-security':body=renderTrust(post,W,H,pad);break;case'creative-tactile':body=renderTactile(post,W,H,pad);break;case'minimal-striking':body=renderMinimal(post,W,H,pad);break;case'playful-unexpected':body=renderPlayful(post,W,H,pad);break;default:body=renderBold(post,W,H,pad)}
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs()}${body}</svg>`;
}
export function svgDataUrl(svg:string):string{return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
export function downloadSvg(post:SocialPost,size:RenderSize='portrait'){const blob=new Blob([renderArtworkSvg(post,size)],{type:'image/svg+xml'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${post.id}-${size}.svg`;a.click();URL.revokeObjectURL(url)}

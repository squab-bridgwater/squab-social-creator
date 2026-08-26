import type { Campaign } from '../types';
import { renderArtworkSvg } from '../render/artwork';

function download(name: string, blob: Blob) { const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url); }

export function exportCaptions(campaign: Campaign) {
  const text = campaign.posts.map((post,index)=>`POST ${index+1}: ${post.headline}\nDate: ${post.suggestedDate} ${post.suggestedTime}\nCTA: ${post.ctaType}\n\n${post.caption}\n`).join('\n---\n\n');
  download(`${slug(campaign.name)}-captions.txt`,new Blob([text],{type:'text/plain'}));
}

export function exportSchedule(campaign: Campaign) {
  const rows=[['Post','Headline','Date','Time','Objective','Template','Status'],...campaign.posts.map((p,i)=>[String(i+1),p.headline,p.suggestedDate,p.suggestedTime,p.objective,p.template,p.publicationStatus])];
  const csv=rows.map(row=>row.map(value=>`"${String(value).replace(/"/g,'""')}"`).join(',')).join('\n');
  download(`${slug(campaign.name)}-schedule.csv`,new Blob([csv],{type:'text/csv'}));
}

export function exportArtwork(postIndex: number, campaign: Campaign) {
  const post=campaign.posts[postIndex]; post.formats.forEach(format=>download(`${slug(campaign.name)}-${String(postIndex+1).padStart(2,'0')}-${format}.svg`,new Blob([renderArtworkSvg(post,format)],{type:'image/svg+xml'})));
}

export function exportContactSheet(campaign: Campaign) {
  const cellW=360, cellH=450, gap=24, W=cellW*3+gap*4, H=cellH*3+gap*4;
  const cells=campaign.posts.slice(0,9).map((post,i)=>{ const x=gap+(i%3)*(cellW+gap), y=gap+Math.floor(i/3)*(cellH+gap); const nested=renderArtworkSvg(post,'portrait').replace('<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">','<g transform="scale(.333333)">').replace('</svg>','</g>'); return `<g transform="translate(${x} ${y})">${nested}</g>`; }).join('');
  download(`${slug(campaign.name)}-contact-sheet.svg`,new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#efefef"/>${cells}</svg>`],{type:'image/svg+xml'}));
}

function slug(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'squab-campaign';}

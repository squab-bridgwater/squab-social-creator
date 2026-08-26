import JSZip from 'jszip';
import type { Campaign, OutputFormat, SocialPost } from '../types';
import { renderArtworkSvg } from '../render/artwork';

function download(name:string,blob:Blob){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function slug(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'squab-campaign'}
const dimensions:Record<OutputFormat,[number,number]>={portrait:[1080,1350],square:[1080,1080],linkedin:[1200,1200]};

async function svgToPng(svg:string,format:OutputFormat):Promise<Blob>{
  await document.fonts.ready;
  const[w,h]=dimensions[format];const svgBlob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});const url=URL.createObjectURL(svgBlob);const image=new Image();
  try{await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('Artwork could not be rasterised.'));image.src=url});const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas is unavailable.');ctx.drawImage(image,0,0,w,h);return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG could not be created.')),'image/png'))}finally{URL.revokeObjectURL(url)}
}

export function captionsText(campaign:Campaign){return campaign.posts.map((post,index)=>`POST ${index+1}: ${post.headline}\nDate: ${post.suggestedDate} ${post.suggestedTime}\nCTA: ${post.ctaType}\nContact details: ${post.contactDetails||''}\n\n${post.caption}\n`).join('\n---\n\n')}
export function scheduleCsv(campaign:Campaign){const rows=[['Post','Headline','Date','Time','Objective','Template','CTA','Status'],...campaign.posts.map((p,i)=>[String(i+1),p.headline,p.suggestedDate,p.suggestedTime,p.objective,p.template,p.ctaType,p.publicationStatus])];return rows.map(row=>row.map(value=>`"${String(value).replace(/"/g,'""')}"`).join(',')).join('\n')}
export function exportCaptions(campaign:Campaign){download(`${slug(campaign.name)}-captions.txt`,new Blob([captionsText(campaign)],{type:'text/plain'}))}
export function exportSchedule(campaign:Campaign){download(`${slug(campaign.name)}-schedule.csv`,new Blob([scheduleCsv(campaign)],{type:'text/csv'}))}

export async function exportArtwork(postIndex:number,campaign:Campaign){const post=campaign.posts[postIndex];for(const format of post.formats){const png=await svgToPng(renderArtworkSvg(post,format),format);download(`${slug(campaign.name)}-${String(postIndex+1).padStart(2,'0')}-${format}.png`,png)}}

function contactSheetSvg(campaign:Campaign){const cellW=360,cellH=450,gap=24,W=cellW*3+gap*4,H=Math.ceil(Math.min(campaign.posts.length,9)/3)*cellH+(Math.ceil(Math.min(campaign.posts.length,9)/3)+1)*gap;const cells=campaign.posts.slice(0,9).map((post,i)=>{const x=gap+(i%3)*(cellW+gap),y=gap+Math.floor(i/3)*(cellH+gap);const nested=renderArtworkSvg(post,'portrait').replace('<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">','<g transform="scale(.333333)">').replace('</svg>','</g>');return `<g transform="translate(${x} ${y})">${nested}</g>`}).join('');return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#efefef"/>${cells}</svg>`}
export function exportContactSheet(campaign:Campaign){download(`${slug(campaign.name)}-contact-sheet.svg`,new Blob([contactSheetSvg(campaign)],{type:'image/svg+xml'}))}

async function postArtworkFiles(post:SocialPost,index:number,campaign:Campaign,zip:JSZip){for(const format of post.formats){const png=await svgToPng(renderArtworkSvg(post,format),format);zip.file(`artwork/${String(index+1).padStart(2,'0')}-${slug(post.name||post.headline)}-${format}.png`,png)}}

export async function exportPublishingPack(campaign:Campaign,onProgress?:(message:string)=>void){
  const zip=new JSZip();onProgress?.('Rendering artwork…');
  for(let i=0;i<campaign.posts.length;i++){onProgress?.(`Rendering artwork ${i+1} of ${campaign.posts.length}…`);await postArtworkFiles(campaign.posts[i],i,campaign,zip)}
  zip.file('captions.txt',captionsText(campaign));zip.file('posting-schedule.csv',scheduleCsv(campaign));zip.file('campaign.json',JSON.stringify(campaign,null,2));zip.file('contact-sheet.svg',contactSheetSvg(campaign));
  zip.file('README.txt',`SQUAB SOCIAL PUBLISHING PACK\n\n1. Review every artwork file at phone size.\n2. Check the photograph visibly supports the message.\n3. Read every caption and verify dates, facts and CTA details.\n4. Open Meta Business Suite and select the correct Squab Facebook and Instagram accounts.\n5. Upload the matching PNG and paste the matching caption.\n6. Preview and schedule only after human approval.\n\nGenerated ${new Date().toLocaleString('en-GB')}.`);
  onProgress?.('Building ZIP…');const blob=await zip.generateAsync({type:'blob'});download(`${slug(campaign.name)}-publishing-pack.zip`,blob);onProgress?.('Publishing pack downloaded.')
}

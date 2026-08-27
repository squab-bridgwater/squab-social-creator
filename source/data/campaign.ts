import type { Campaign, OutputFormat, SocialPost } from '../types';
import { normaliseTemplateId, templates } from '../templates/registry';

const STORAGE_KEY='squab-social-creator-v2-campaign';
const templateIds=new Set(templates.map(template=>template.id));
const objectives=['Awareness','Engagement','Conversion'];
const statuses=['Draft','Ready for review','Approved','Published'];
const allowedFormats:OutputFormat[]=['portrait','square','story','linkedin'];

function asText(value:unknown,fallback=''):string{return typeof value==='string'?value.trim():fallback}
function stripCodeFences(text:string):string{return text.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim()}
function formatsFrom(raw:unknown):OutputFormat[]{if(!Array.isArray(raw))return['portrait'];const formats=raw.filter((value):value is OutputFormat=>allowedFormats.includes(value as OutputFormat));return formats.length?formats:['portrait']}

function normalisePost(raw:any,index:number):SocialPost{
 if(!raw||typeof raw!=='object')throw new Error(`Post ${index+1} is not a valid object.`);
 const rawBenefits=Array.isArray(raw.benefits)?raw.benefits:[];
 if(rawBenefits.length!==3)throw new Error(`Post ${index+1} must contain exactly three benefits.`);
 const template=normaliseTemplateId(asText(raw.template,'bold-impact'));
 return{
  id:asText(raw.id,`post-${index+1}`),name:asText(raw.name,`Post ${index+1}`),service:asText(raw.service,'Self Storage'),subtopic:asText(raw.subtopic)||undefined,
  objective:objectives.includes(raw.objective)?raw.objective:'Awareness',template:templateIds.has(template)?template:'bold-impact',eyebrow:asText(raw.eyebrow,'Squab Storage'),headline:asText(raw.headline,'More room for what comes next'),answer:asText(raw.answer),support:asText(raw.support??raw.supportingLine),badgeTop:asText(raw.badgeTop,'BRIDGWATER'),badgeBottom:asText(raw.badgeBottom,'SQUAB STORAGE'),
  benefits:rawBenefits.map((item:any,benefitIndex:number)=>{if(!item||typeof item!=='object')throw new Error(`Benefit ${benefitIndex+1} in post ${index+1} is invalid.`);return{title:asText(item.title),body:asText(item.body??item.text)}}),
  footerTitle:asText(raw.footerTitle,'Squab Storage Bridgwater'),footerLine:asText(raw.footerLine,'Local space. Real help.'),image:asText(raw.image)||undefined,secondaryImage:asText(raw.secondaryImage)||undefined,imageBrief:asText(raw.imageBrief)||undefined,caption:asText(raw.caption),suggestedDate:asText(raw.suggestedDate??raw.date),suggestedTime:asText(raw.suggestedTime??raw.time,'10:00'),ctaType:asText(raw.ctaType,'Awareness only'),contactDetails:asText(raw.contactDetails)||undefined,formats:formatsFrom(raw.formats),publicationStatus:statuses.includes(raw.publicationStatus)?raw.publicationStatus:'Draft'
 };
}

export function parseCampaignJson(text:string):Campaign{
 let parsed:any;try{parsed=JSON.parse(stripCodeFences(text))}catch{throw new Error('The pasted response is not valid JSON. Copy the complete JSON response and try again.')}
 const root=Array.isArray(parsed)?{posts:parsed}:parsed;
 if(!root||!Array.isArray(root.posts)||root.posts.length===0)throw new Error('No posts were found in this JSON.');
 if(root.posts.length>9)throw new Error('A campaign can contain a maximum of nine posts.');
 const mode=root.mode==='one-off'||root.posts.length===1?'one-off':'batch';
 if(mode==='batch'&&root.posts.length!==9)throw new Error(`A nine-post batch must contain exactly nine posts. This response contains ${root.posts.length}.`);
 return{id:asText(root.id,`campaign-${Date.now()}`),name:asText(root.name??root.batchName,'Imported Squab campaign'),mode,status:statuses.includes(root.status)?root.status:'Draft',startDate:asText(root.startDate),season:asText(root.season),localFocus:asText(root.localFocus,'Bridgwater, Somerset'),platforms:asText(root.platforms,'Facebook, Instagram and LinkedIn'),posts:root.posts.map(normalisePost),updatedAt:new Date().toISOString()};
}

export function saveCampaign(campaign:Campaign):void{localStorage.setItem(STORAGE_KEY,JSON.stringify({...campaign,updatedAt:new Date().toISOString()}))}
export function loadCampaign():Campaign|null{const saved=localStorage.getItem(STORAGE_KEY);if(!saved)return null;try{return parseCampaignJson(saved)}catch{return null}}
export function exportCampaign(campaign:Campaign):void{const blob=new Blob([JSON.stringify(campaign,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${campaign.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'squab-campaign'}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}

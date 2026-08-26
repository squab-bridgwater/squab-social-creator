import type { Campaign } from '../types';

export type PhotoAsset = { id:string; name:string; category:string; dataUrl:string; addedAt:string };
const CAMPAIGNS_KEY='squab-social-v2-campaign-library';
const PHOTOS_KEY='squab-social-v2-photo-library';

export function listCampaigns():Campaign[]{try{return JSON.parse(localStorage.getItem(CAMPAIGNS_KEY)||'[]')}catch{return []}}
export function saveCampaignToLibrary(campaign:Campaign):Campaign[]{const existing=listCampaigns().filter(item=>item.id!==campaign.id);const next=[{...campaign,updatedAt:new Date().toISOString()},...existing].slice(0,30);localStorage.setItem(CAMPAIGNS_KEY,JSON.stringify(next));return next}
export function deleteCampaignFromLibrary(id:string):Campaign[]{const next=listCampaigns().filter(item=>item.id!==id);localStorage.setItem(CAMPAIGNS_KEY,JSON.stringify(next));return next}
export function duplicateCampaign(campaign:Campaign):Campaign{return {...campaign,id:`campaign-${Date.now()}`,name:`${campaign.name} copy`,status:'Draft',updatedAt:new Date().toISOString(),posts:campaign.posts.map((post,i)=>({...post,id:`post-${i+1}-${Date.now()}`,publicationStatus:'Draft'}))}}

export function listPhotos():PhotoAsset[]{try{return JSON.parse(localStorage.getItem(PHOTOS_KEY)||'[]')}catch{return []}}
export function savePhoto(asset:PhotoAsset):PhotoAsset[]{const next=[asset,...listPhotos().filter(item=>item.id!==asset.id)].slice(0,40);localStorage.setItem(PHOTOS_KEY,JSON.stringify(next));return next}
export function deletePhoto(id:string):PhotoAsset[]{const next=listPhotos().filter(item=>item.id!==id);localStorage.setItem(PHOTOS_KEY,JSON.stringify(next));return next}
export function readFileAsDataUrl(file:File):Promise<string>{return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file)})}

import React, { useMemo, useRef, useState } from 'react';
import { templates, TemplateCategory, recommendTemplates } from './templates/registry';
import type { Campaign, SocialPost } from './types';
import { sampleCampaign } from './data/sampleCampaign';
import { exportCampaign, loadCampaign, parseCampaignJson, saveCampaign } from './data/campaign';
import { renderArtworkSvg, svgDataUrl } from './render/artwork';
import { qaCampaign, qaPost } from './qa';
import { exportArtwork, exportCaptions, exportContactSheet, exportSchedule } from './export/publishingPack';

const categories: Array<'All' | TemplateCategory> = ['All','Photo-led','Advice','Trust','Business','Local','CTA','Editorial'];
const steps = ['Brief','Content','Photos','Artwork','Review & Export'];

export function App() {
  const [campaign,setCampaign]=useState<Campaign>(()=>loadCampaign()??sampleCampaign);
  const [step,setStep]=useState(3); const [selectedIndex,setSelectedIndex]=useState(0); const [category,setCategory]=useState<'All'|TemplateCategory>('All');
  const [message,setMessage]=useState('Development branch only. Nothing here publishes to Meta or changes the live app.');
  const fileRef=useRef<HTMLInputElement>(null); const post=campaign.posts[selectedIndex]??campaign.posts[0];
  const visible=useMemo(()=>category==='All'?templates:templates.filter(t=>t.categories.includes(category)),[category]);
  const qa=useMemo(()=>qaCampaign(campaign),[campaign]);
  const updatePost=(patch:Partial<SocialPost>)=>setCampaign(current=>({...current,posts:current.posts.map((item,i)=>i===selectedIndex?{...item,...patch}:item),updatedAt:new Date().toISOString()}));
  const save=()=>{saveCampaign(campaign);setMessage('Campaign saved in this browser.');};
  const importJson=async(file:File)=>{try{const next=parseCampaignJson(await file.text());setCampaign(next);setSelectedIndex(0);setMessage(`Imported ${next.posts.length} posts.`);}catch(error){setMessage(error instanceof Error?error.message:'Import failed.');}};
  const uploadPhoto=async(file:File)=>{const reader=new FileReader();reader.onload=()=>updatePost({image:String(reader.result)});reader.readAsDataURL(file);};
  const recommendations=recommendTemplates(post.objective).slice(0,6).map(t=>t.id);
  const postQa=qaPost(post);

  return <main className="shell">
    <header className="topbar"><div><p className="eyebrow">Squab Social Creator</p><h1>Content Studio V2</h1></div><div className="top-actions"><span className="dev-badge">DEV ONLY</span><button onClick={save}>Save</button><button onClick={()=>exportCampaign(campaign)}>Export JSON</button></div></header>
    <div className="notice">{message}</div>
    <nav className="stepper">{steps.map((label,i)=><button className={step===i?'active':''} onClick={()=>setStep(i)} key={label}><span>{i+1}</span>{label}</button>)}</nav>

    {step===0&&<section className="panel brief-grid"><div><label>Campaign name<input value={campaign.name} onChange={e=>setCampaign({...campaign,name:e.target.value})}/></label><label>Season<input value={campaign.season} onChange={e=>setCampaign({...campaign,season:e.target.value})}/></label></div><div><label>Local focus<textarea value={campaign.localFocus} onChange={e=>setCampaign({...campaign,localFocus:e.target.value})}/></label><label>Platforms<input value={campaign.platforms} onChange={e=>setCampaign({...campaign,platforms:e.target.value})}/></label></div><div className="brief-summary"><strong>{campaign.posts.length} posts</strong><span>{campaign.mode==='batch'?'Nine-post batch workflow':'One-off workflow'}</span><button onClick={()=>setStep(1)}>Continue to content</button></div></section>}

    {step===1&&<section className="panel"><div className="section-head"><div><h2>Content import</h2><p>Paste or import the structured campaign JSON produced by ChatGPT. Legacy template IDs are mapped automatically.</p></div><button onClick={()=>fileRef.current?.click()}>Import JSON</button><input ref={fileRef} hidden type="file" accept="application/json,.json" onChange={e=>e.target.files?.[0]&&importJson(e.target.files[0])}/></div><div className="content-list">{campaign.posts.map((item,i)=><button onClick={()=>{setSelectedIndex(i);setStep(3)}} key={item.id}><b>{String(i+1).padStart(2,'0')}</b><span><strong>{item.headline}</strong><small>{item.service} · {item.objective}</small></span></button>)}</div></section>}

    {step===2&&<section className="panel"><div className="section-head"><div><h2>Photograph assignment</h2><p>Assign genuine Squab or suitable customer-situation photography. Photo-led layouts flag missing imagery in QA.</p></div></div><div className="photo-grid">{campaign.posts.map((item,i)=><article key={item.id} className={item.image?'has-photo':''}><div className="photo-thumb">{item.image?<img src={item.image}/>:<span>No photo</span>}</div><strong>{i+1}. {item.headline}</strong><small>{item.imageBrief}</small><label className="upload">{item.image?'Replace photo':'Choose photo'}<input type="file" accept="image/*" onChange={e=>{setSelectedIndex(i);e.target.files?.[0]&&uploadPhoto(e.target.files[0])}}/></label></article>)}</div></section>}

    {step===3&&<section className="studio"><aside className="post-rail">{campaign.posts.map((item,i)=><button className={i===selectedIndex?'active':''} onClick={()=>setSelectedIndex(i)} key={item.id}><b>{i+1}</b><span>{item.headline}</span></button>)}</aside><section className="artboard-panel"><div className="artboard-head"><div><h2>{post.headline}</h2><span>{post.template}</span></div><div className="qa-chip">{postQa.errors.length?'Needs fixing':postQa.warnings.length?'Check':'QA clear'}</div></div><img className="artboard" src={svgDataUrl(renderArtworkSvg(post,'portrait'))}/><div className="art-actions"><label className="upload">Assign photo<input type="file" accept="image/*" onChange={e=>e.target.files?.[0]&&uploadPhoto(e.target.files[0])}/></label><button onClick={()=>exportArtwork(selectedIndex,campaign)}>Download artwork</button></div></section><aside className="editor"><label>Eyebrow<input value={post.eyebrow} onChange={e=>updatePost({eyebrow:e.target.value})}/></label><label>Headline<textarea value={post.headline} onChange={e=>updatePost({headline:e.target.value})}/></label><label>Supporting answer<textarea value={post.answer} onChange={e=>updatePost({answer:e.target.value})}/></label><label>Caption<textarea rows={5} value={post.caption} onChange={e=>updatePost({caption:e.target.value})}/></label><div className="template-title"><strong>Template</strong><small>Recommended options are marked</small></div><nav className="filters compact">{categories.map(item=><button className={category===item?'active':''} onClick={()=>setCategory(item)} key={item}>{item}</button>)}</nav><div className="template-picker">{visible.map(template=><button className={`${post.template===template.id?'selected':''} ${recommendations.includes(template.id)?'recommended':''}`} onClick={()=>updatePost({template:template.id})} key={template.id}><div className={`mini-preview family-${Math.floor(templates.indexOf(template)/2)%6}`}><span>{template.variant}</span><b>{template.name}</b></div><small>{template.family}</small></button>)}</div></aside></section>}

    {step===4&&<section className="panel review"><div className="section-head"><div><h2>Review and export</h2><p>Human approval remains mandatory before anything is scheduled or published.</p></div><div className={`qa-total ${qa.errors.length?'bad':qa.warnings.length?'warn':'good'}`}>{qa.errors.length} errors · {qa.warnings.length} warnings</div></div><div className="contact-grid">{campaign.posts.map((item,i)=><button onClick={()=>{setSelectedIndex(i);setStep(3)}} key={item.id}><img src={svgDataUrl(renderArtworkSvg(item,'portrait'))}/><span>{i+1}. {item.headline}</span></button>)}</div>{(qa.errors.length>0||qa.warnings.length>0)&&<div className="qa-list">{qa.errors.map(item=><p className="error" key={item}>{item}</p>)}{qa.warnings.map(item=><p key={item}>{item}</p>)}</div>}<div className="export-row"><button onClick={()=>exportContactSheet(campaign)}>Contact sheet</button><button onClick={()=>exportCaptions(campaign)}>Captions</button><button onClick={()=>exportSchedule(campaign)}>Schedule CSV</button><button onClick={()=>exportCampaign(campaign)}>Campaign JSON</button></div></section>}
  </main>;
}

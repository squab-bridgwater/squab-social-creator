import React, { useMemo, useState } from 'react';
import type { SocialPost } from './types';
import { renderArtworkSvg, svgDataUrl, type RenderSize } from './render/artwork';

const families = [
  ['bold-impact','Bold Impact'],['real-people','Real People'],['transformation','Transformation'],['local-pride','Local Pride'],['lifestyle-freedom','Lifestyle Freedom'],['what-fits','What Fits'],
] as const;

const samples: Record<string, Partial<SocialPost>> = {
  'bold-impact': { headline:'More life. Less clutter.', eyebrow:'More space. More freedom.', support:'Space for what matters next.', benefits:[{title:'More space',body:''},{title:'More freedom',body:''},{title:'A brighter you',body:''}] },
  'real-people': { headline:'Extra space means extra family time.', support:'Real people. Real stories.', benefits:[{title:'Flexible',body:''},{title:'Human',body:''},{title:'Local',body:''}] },
  'transformation': { headline:'Same space. A completely different story.', support:'Make room for what comes next.', benefits:[{title:'Before',body:''},{title:'After',body:''},{title:'Breathe',body:''}] },
  'local-pride': { headline:'Proud to support a stronger Bridgwater.', support:'Local space. Real support.', benefits:[{title:'Local people',body:''},{title:'Local business',body:''},{title:'Stronger community',body:''}] },
  'lifestyle-freedom': { headline:'Less clutter. More adventure.', support:'Space creates freedom.', benefits:[{title:'Explore',body:''},{title:'Create',body:''},{title:'Breathe',body:''}] },
  'what-fits': { headline:'Big plans need bigger space.', support:'Whatever your next chapter.', benefits:[{title:'Bikes',body:''},{title:'Furniture',body:''},{title:'Business',body:''}] },
};

function basePost(template:string):SocialPost{
  const sample=samples[template]??{};
  return {id:'review',name:'Review',service:'Self Storage',objective:'Awareness',template,eyebrow:'Squab Storage',headline:'More space for what comes next.',answer:'Flexible storage for real life.',support:'Space creates possibilities.',badgeTop:'BRIDGWATER',badgeBottom:'SQUAB STORAGE',benefits:[{title:'Flexible',body:''},{title:'Practical',body:''},{title:'Local',body:''}],footerTitle:'Squab Storage Bridgwater',footerLine:'Local space. Real help.',caption:'',suggestedDate:'',suggestedTime:'',ctaType:'Awareness only',formats:['portrait'],publicationStatus:'Draft',...sample};
}

async function asDataUrl(file:File){return await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(r.error);r.readAsDataURL(file);});}

export function ReviewLab(){
  const [template,setTemplate]=useState('bold-impact');
  const [format,setFormat]=useState<RenderSize>('portrait');
  const [post,setPost]=useState<SocialPost>(()=>basePost('bold-impact'));
  const artwork=useMemo(()=>svgDataUrl(renderArtworkSvg(post,format)),[post,format]);
  const choose=(id:string)=>{setTemplate(id);setPost(current=>({...basePost(id),image:current.image,secondaryImage:current.secondaryImage,formats:current.formats}));};
  const upload=async(file:File|undefined,secondary=false)=>{if(!file)return;const url=await asDataUrl(file);setPost(current=>secondary?{...current,secondaryImage:url}:{...current,image:url});};
  return <main className="review-lab">
    <header><div><small>SQUAB SOCIAL CREATOR · DEVELOPMENT REVIEW LAB</small><h1>Approved art-direction test bench</h1><p>Use real photography to judge the first six hero directions against the approved 12-panel benchmark. This page cannot publish or change the live app.</p></div><span>DEV ONLY</span></header>
    <section className="review-controls">
      <div><strong>Creative direction</strong><nav>{families.map(([id,name])=><button key={id} className={template===id?'active':''} onClick={()=>choose(id)}>{name}</button>)}</nav></div>
      <div><strong>Format</strong><nav>{(['portrait','square','story'] as RenderSize[]).map(id=><button key={id} className={format===id?'active':''} onClick={()=>setFormat(id)}>{id==='portrait'?'4:5 Feed':id==='square'?'1:1 Square':'9:16 Story'}</button>)}</nav></div>
      <div className="review-uploads"><label>Primary photograph<input type="file" accept="image/*" onChange={e=>void upload(e.target.files?.[0])}/></label>{template==='transformation'&&<label>After photograph<input type="file" accept="image/*" onChange={e=>void upload(e.target.files?.[0],true)}/></label>}</div>
    </section>
    <section className="review-workspace">
      <div className={`review-canvas ${format}`}><img src={artwork} alt={`${template} preview`}/></div>
      <aside><label>Headline<textarea value={post.headline} onChange={e=>setPost({...post,headline:e.target.value})}/></label><label>Supporting line<textarea value={post.support} onChange={e=>setPost({...post,support:e.target.value})}/></label><h2>Benchmark check</h2><ul><li>Photography should dominate the composition.</li><li>Headline should stop the scroll within one second.</li><li>Orange should feel like an intervention, not decoration.</li><li>Depth should come from overlap, paper, crop and foreground/background tension.</li><li>Reject it if it still feels like a slide or information card.</li></ul>{template==='transformation'&&<p className="review-warning">Transformation deliberately requires two different photographs. It will not fake a before/after from one image.</p>}</aside>
    </section>
  </main>;
}

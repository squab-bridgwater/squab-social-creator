import React, { useMemo, useState } from 'react';
import { audienceChoices, ctaChoices, formatChoices, getAngleChoices, getRecommendation, getSubjectChoices, objectiveChoices } from './matrix';
import { buildGuidedCreativeBrief, buildGuidedSummary } from './prompt';
import type { Choice, GuidedAnswers } from './types';

type StepId = 'objective' | 'audience' | 'subject' | 'angle' | 'creativeDirection' | 'imageStrategy' | 'cta' | 'format' | 'review';
const orderedSteps: StepId[] = ['objective','audience','subject','angle','creativeDirection','imageStrategy','cta','format','review'];

function ChoiceGrid({ choices, value, onChoose }: { choices: Choice[]; value?: string; onChoose:(id:string)=>void }) {
  return <div className="guided-choice-grid">{choices.map(choice => <button key={choice.id} className={value===choice.id?'selected':''} onClick={()=>onChoose(choice.id)}><strong>{choice.label}</strong>{choice.description&&<span>{choice.description}</span>}</button>)}</div>;
}

export function PromptWizard() {
  const [answers,setAnswers]=useState<GuidedAnswers>({});
  const [stepIndex,setStepIndex]=useState(0);
  const [copied,setCopied]=useState(false);
  const step=orderedSteps[stepIndex];
  const recommendation=useMemo(()=>getRecommendation(answers),[answers]);
  const summary=useMemo(()=>buildGuidedSummary(answers),[answers]);
  const prompt=useMemo(()=>buildGuidedCreativeBrief(answers),[answers]);

  const choose=(key:keyof GuidedAnswers,value:string)=>{
    setCopied(false);
    setAnswers(current=>{
      const next={...current,[key]:value};
      if(key==='objective') return {objective:value as GuidedAnswers['objective']};
      if(key==='audience') return {...next,subject:undefined,angle:undefined,creativeDirection:undefined,imageStrategy:undefined,cta:undefined,format:undefined};
      if(key==='subject') return {...next,angle:undefined,creativeDirection:undefined,imageStrategy:undefined,cta:undefined,format:undefined};
      if(key==='angle') return {...next,creativeDirection:undefined,imageStrategy:undefined,cta:undefined,format:undefined};
      if(key==='creativeDirection') return {...next,imageStrategy:undefined,cta:undefined,format:undefined};
      return next;
    });
    setStepIndex(index=>Math.min(index+1,orderedSteps.length-1));
  };

  const goBack=()=>setStepIndex(index=>Math.max(0,index-1));
  const restart=()=>{setAnswers({});setStepIndex(0);setCopied(false);};
  const copyPrompt=async()=>{try{await navigator.clipboard.writeText(prompt);setCopied(true);}catch{setCopied(false);}};

  const question= step==='objective' ? 'What should this post achieve?'
    : step==='audience' ? 'Who are we mainly trying to reach?'
    : step==='subject' ? 'What are we talking about?'
    : step==='angle' ? 'What angle should we take?'
    : step==='creativeDirection' ? 'Which creative direction should we use?'
    : step==='imageStrategy' ? 'What imagery should we use?'
    : step==='cta' ? 'How strong should the call to action be?'
    : step==='format' ? 'Where will this post be used?'
    : 'Ready to create the post?';

  return <main className="guided-shell">
    <header className="guided-header"><div><p className="eyebrow">Squab Social Creator</p><h1>Guided Post Builder</h1><p>Choose. Narrow. Create. No blank brief required.</p></div><div className="guided-progress"><b>{Math.min(stepIndex+1,8)}/8</b><span>guided choices</span></div></header>

    <div className="guided-progressbar"><i style={{width:`${Math.min((stepIndex/8)*100,100)}%`}}/></div>

    {step!=='review' ? <section className="guided-card">
      <div className="guided-question"><small>STEP {stepIndex+1}</small><h2>{question}</h2>{step==='creativeDirection'&&<p>These are the four directions the matrix recommends from your earlier choices.</p>}{step==='imageStrategy'&&<p>Options are filtered to prevent fake Squab premises or staff imagery.</p>}</div>
      {step==='objective'&&<ChoiceGrid choices={objectiveChoices} value={answers.objective} onChoose={id=>choose('objective',id)}/>} 
      {step==='audience'&&<ChoiceGrid choices={audienceChoices} value={answers.audience} onChoose={id=>choose('audience',id)}/>} 
      {step==='subject'&&<ChoiceGrid choices={getSubjectChoices(answers.audience)} value={answers.subject} onChoose={id=>choose('subject',id)}/>} 
      {step==='angle'&&<ChoiceGrid choices={getAngleChoices(answers.objective)} value={answers.angle} onChoose={id=>choose('angle',id)}/>} 
      {step==='creativeDirection'&&<div className="guided-direction-grid">{recommendation.creativeDirections.map((direction,index)=><button key={direction.id} className={answers.creativeDirection===direction.id?'selected':''} onClick={()=>choose('creativeDirection',direction.id)}><span className="rank">{index===0?'RECOMMENDED':`OPTION ${index+1}`}</span><strong>{direction.label}</strong><p>{direction.short}</p></button>)}</div>}
      {step==='imageStrategy'&&<ChoiceGrid choices={recommendation.allowedImageStrategies} value={answers.imageStrategy} onChoose={id=>choose('imageStrategy',id)}/>} 
      {step==='cta'&&<ChoiceGrid choices={ctaChoices} value={answers.cta} onChoose={id=>choose('cta',id)}/>} 
      {step==='format'&&<ChoiceGrid choices={formatChoices} value={answers.format} onChoose={id=>choose('format',id)}/>} 
      <div className="guided-nav"><button disabled={stepIndex===0} onClick={goBack}>Back</button><button className="ghost" onClick={restart}>Start again</button></div>
    </section> : <section className="guided-review">
      <div className="guided-card"><div className="guided-question"><small>CREATIVE CHECKPOINT</small><h2>{question}</h2><p>The matrix has converted your selections into a complete Squab creative brief for ChatGPT image generation.</p></div><dl className="guided-summary">{Object.entries(summary).map(([key,value])=><div key={key}><dt>{key.replace(/([A-Z])/g,' $1')}</dt><dd>{String(value)}</dd></div>)}</dl><div className="guided-review-actions"><button className="primary" onClick={copyPrompt}>{copied?'Prompt copied':'Copy complete GPT prompt'}</button><a href="https://chatgpt.com/" target="_blank" rel="noreferrer">Open ChatGPT</a><button onClick={goBack}>Change last choice</button></div></div>
      <details className="guided-prompt-preview"><summary>View the generated creative brief</summary><pre>{prompt}</pre></details>
    </section>}

    <aside className="guided-running-summary"><strong>Your brief</strong><span>{summary.objective||'Objective'}</span><span>{summary.audience||'Audience'}</span><span>{summary.subject||'Subject'}</span><span>{summary.angle||'Angle'}</span><span>{summary.creativeDirection||'Creative direction'}</span></aside>
  </main>;
}

import React, { useMemo, useRef, useState } from 'react';
import type { Campaign, Objective, OutputFormat, SocialPost } from './types';
import { templates } from './templates/registry';
import { sampleCampaign } from './data/sampleCampaign';
import { exportCampaign, loadCampaign, parseCampaignJson, saveCampaign } from './data/campaign';
import { campaignPresets } from './data/presets';
import { buildCampaignPrompt } from './prompt';
import { deleteCampaignFromLibrary, deletePhoto, duplicateCampaign, listCampaigns, listPhotos, type PhotoAsset, readFileAsDataUrl, saveCampaignToLibrary, savePhoto } from './data/library';
import { renderArtworkSvg, svgDataUrl } from './render/artwork';
import { qaCampaign, qaPost } from './qa';
import { exportArtwork, exportCaptions, exportContactSheet, exportPublishingPack, exportSchedule } from './export/publishingPack';
import { TemplatePicker } from './components/TemplatePicker';
import { PhotoLibrary } from './components/PhotoLibrary';

const steps = ['Set the brief', 'Create the content', 'Edit artwork', 'Review all nine', 'Export and publish'];

export function App() {
  const [campaign, setCampaign] = useState<Campaign>(() => loadCampaign() ?? sampleCampaign);
  const [step, setStep] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [presetId, setPresetId] = useState('moving-home');
  const [message, setMessage] = useState('Development branch only. Nothing here publishes to Meta or changes the live app.');
  const [jsonText, setJsonText] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [buildingPack, setBuildingPack] = useState(false);
  const [savedCampaigns, setSavedCampaigns] = useState<Campaign[]>(() => listCampaigns());
  const [photos, setPhotos] = useState<PhotoAsset[]>(() => listPhotos());
  const [photoCategory, setPhotoCategory] = useState('General');
  const fileRef = useRef<HTMLInputElement>(null);

  const post = campaign.posts[selectedIndex] ?? campaign.posts[0];
  const preset = campaignPresets.find(item => item.id === presetId) ?? campaignPresets[0];
  const prompt = useMemo(() => buildCampaignPrompt(campaign, preset), [campaign, preset]);
  const qa = useMemo(() => qaCampaign(campaign), [campaign]);
  const postQa = qaPost(post);
  const objectiveCounts = useMemo(() => campaign.posts.reduce<Record<string, number>>((counts, item) => {
    counts[item.objective] = (counts[item.objective] ?? 0) + 1;
    return counts;
  }, {}), [campaign.posts]);

  const patchCampaign = (patch: Partial<Campaign>) => setCampaign(current => ({ ...current, ...patch, updatedAt: new Date().toISOString() }));
  const updatePost = (patch: Partial<SocialPost>) => setCampaign(current => ({ ...current, posts: current.posts.map((item, index) => index === selectedIndex ? { ...item, ...patch } : item), updatedAt: new Date().toISOString() }));

  const save = () => {
    saveCampaign(campaign);
    setSavedCampaigns(saveCampaignToLibrary(campaign));
    setMessage('Campaign saved on this device.');
  };

  const importText = (text: string) => {
    try {
      const next = parseCampaignJson(text);
      setCampaign(next);
      setSelectedIndex(0);
      setJsonText('');
      setStep(2);
      setMessage(`Imported ${next.posts.length} post${next.posts.length === 1 ? '' : 's'}. Review the artwork and photography next.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Import failed.');
    }
  };

  const addPhotos = async (files: File[]) => {
    for (const file of files) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const asset: PhotoAsset = { id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: file.name, category: photoCategory, dataUrl, addedAt: new Date().toISOString() };
        setPhotos(savePhoto(asset));
      } catch {
        setMessage(`${file.name} could not be added.`);
      }
    }
    if (files.length) setMessage(`${files.length} photograph${files.length === 1 ? '' : 's'} added to the reusable library.`);
  };

  const assignPhoto = (asset: PhotoAsset, index = selectedIndex) => {
    setCampaign(current => ({ ...current, posts: current.posts.map((item, itemIndex) => itemIndex === index ? { ...item, image: asset.dataUrl } : item), updatedAt: new Date().toISOString() }));
    setMessage(`${asset.name} assigned to post ${index + 1}.`);
  };

  const autoAssign = () => {
    if (!photos.length) return setMessage('Add photographs to the reusable library first.');
    setCampaign(current => ({ ...current, posts: current.posts.map((item, index) => ({ ...item, image: photos[index % photos.length].dataUrl })), updatedAt: new Date().toISOString() }));
    setMessage('Photographs assigned across the campaign. Review every crop before export.');
  };

  const toggleFormat = (format: OutputFormat) => {
    const formats = post.formats.includes(format) ? post.formats.filter(item => item !== format) : [...post.formats, format];
    updatePost({ formats: formats.length ? formats : ['portrait'] });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setMessage('Prepared ChatGPT prompt copied.');
    } catch {
      setMessage('Clipboard access was blocked. Select and copy the prompt manually.');
    }
  };

  const newCampaign = () => {
    const copy = duplicateCampaign(sampleCampaign);
    copy.name = 'New Squab campaign';
    setCampaign(copy);
    setSelectedIndex(0);
    setShowLibrary(false);
    setStep(0);
  };

  const buildPack = async () => {
    if (qa.errors.length) return setMessage('Fix the required QA errors before building the publishing pack.');
    setBuildingPack(true);
    try {
      await exportPublishingPack(campaign, setMessage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The publishing pack could not be built.');
    } finally {
      setBuildingPack(false);
    }
  };

  return <main className="shell">
    <header className="topbar">
      <div><p className="eyebrow">Squab Social Creator</p><h1>Content Studio V2</h1></div>
      <div className="top-actions"><span className="dev-badge">DEV ONLY</span><button onClick={() => setShowLibrary(value => !value)}>Campaigns ({savedCampaigns.length})</button><button onClick={save}>Save</button><button onClick={() => exportCampaign(campaign)}>Export JSON</button></div>
    </header>
    <div className="notice">{message}</div>

    {showLibrary ? <section className="panel campaign-library">
      <div className="section-head"><div><h2>Campaign library</h2><p>Saved locally on this device. Open, duplicate or remove previous work.</p></div><button onClick={newCampaign}>New campaign</button></div>
      <div className="saved-grid">{savedCampaigns.map(item => <article key={item.id}><small>{item.mode === 'batch' ? 'Nine-post batch' : 'One-off'}</small><h3>{item.name}</h3><span>{item.status} · {new Date(item.updatedAt).toLocaleDateString('en-GB')}</span><div><button onClick={() => { setCampaign(item); setSelectedIndex(0); setShowLibrary(false); setStep(0); }}>Open</button><button onClick={() => { setCampaign(duplicateCampaign(item)); setSelectedIndex(0); setShowLibrary(false); setStep(0); }}>Duplicate</button><button className="danger" onClick={() => setSavedCampaigns(deleteCampaignFromLibrary(item.id))}>Delete</button></div></article>)}</div>
    </section> : <>
      <nav className="stepper" aria-label="Workflow steps">{steps.map((label, index) => <button className={step === index ? 'active' : ''} onClick={() => setStep(index)} key={label}><span>{index + 1}</span>{label}</button>)}</nav>

      {step === 0 && <section className="panel">
        <div className="mode-switch"><button className={campaign.mode === 'batch' ? 'active' : ''} onClick={() => patchCampaign({ mode: 'batch', posts: campaign.posts.length === 9 ? campaign.posts : sampleCampaign.posts })}>Nine-post batch</button><button className={campaign.mode === 'one-off' ? 'active' : ''} onClick={() => patchCampaign({ mode: 'one-off', posts: [campaign.posts[0] ?? sampleCampaign.posts[0]] })}>Quick one-off</button></div>
        <div className="brief-grid"><div><label>Campaign name<input value={campaign.name} onChange={event => patchCampaign({ name: event.target.value })}/></label><label>First suggested post date<input type="date" value={campaign.startDate} onChange={event => patchCampaign({ startDate: event.target.value })}/></label><label>Season or current context<input value={campaign.season} onChange={event => patchCampaign({ season: event.target.value })}/></label></div><div><label>Local focus<textarea rows={3} value={campaign.localFocus} onChange={event => patchCampaign({ localFocus: event.target.value })}/></label><label>Platforms<input value={campaign.platforms} onChange={event => patchCampaign({ platforms: event.target.value })}/></label></div><div className="brief-summary"><strong>{campaign.mode === 'batch' ? '9' : '1'} post{campaign.mode === 'batch' ? 's' : ''}</strong><span>One brief, one structured ChatGPT handover, then review and export.</span><div className="mix-summary"><b>{objectiveCounts.Awareness ?? 0}</b> awareness · <b>{objectiveCounts.Engagement ?? 0}</b> engagement · <b>{objectiveCounts.Conversion ?? 0}</b> conversion</div><button onClick={() => setStep(1)}>Continue to content</button></div></div>
        <div className="preset-section"><div className="section-head"><div><h2>Choose a campaign direction</h2><p>These guide the topic mix and tone. The content remains editable after import.</p></div></div><div className="preset-grid">{campaignPresets.map(item => <button className={presetId === item.id ? 'selected' : ''} onClick={() => setPresetId(item.id)} key={item.id}><small>{item.category}</small><strong>{item.name}</strong><span>{item.description}</span></button>)}</div></div>
        <div className="preset-section"><PhotoLibrary photos={photos} category={photoCategory} onCategory={setPhotoCategory} onAddFiles={addPhotos} onChoose={asset => assignPhoto(asset)} onRemove={id => setPhotos(deletePhoto(id))} onAutoAssign={autoAssign}/></div>
      </section>}

      {step === 1 && <section className="content-bridge">
        <section className="panel"><div className="section-head"><div><h2>Your complete ChatGPT prompt</h2><p>Brand rules, approved CTA mix, verified facts and all 24 template IDs are included.</p></div><button onClick={copyPrompt}>Copy prompt</button></div><textarea className="prompt-box" readOnly rows={19} value={prompt}/><a className="external-link" href="https://chatgpt.com/" target="_blank" rel="noreferrer">Open ChatGPT</a></section>
        <section className="panel"><div className="section-head"><div><h2>Paste ChatGPT's response</h2><p>Paste the complete JSON response, or import a saved JSON file.</p></div><button onClick={() => fileRef.current?.click()}>Import JSON file</button><input ref={fileRef} hidden type="file" accept="application/json,.json" onChange={event => event.target.files?.[0] && void event.target.files[0].text().then(importText)}/></div><textarea className="json-box" rows={16} value={jsonText} onChange={event => setJsonText(event.target.value)} placeholder='Paste the response beginning with { "name": ... }'/><div className="bridge-actions"><span>{jsonText.trim() ? 'Ready to import.' : 'Nothing is imported until you click the button.'}</span><button disabled={!jsonText.trim()} onClick={() => importText(jsonText)}>Import and build all artwork</button></div></section>
      </section>}

      {step === 2 && <section className="studio">
        <aside className="post-rail">{campaign.posts.map((item, index) => <button className={index === selectedIndex ? 'active' : ''} onClick={() => setSelectedIndex(index)} key={item.id}><b>{index + 1}</b><span>{item.headline}</span></button>)}</aside>
        <section className="artboard-panel"><div className="artboard-head"><div><h2>{post.headline}</h2><span>{templates.find(item => item.id === post.template)?.name ?? post.template}</span></div><div className="qa-chip">{postQa.errors.length ? 'Needs fixing' : postQa.warnings.length ? 'Check' : 'QA clear'}</div></div><img className="artboard" src={svgDataUrl(renderArtworkSvg(post, 'portrait'))} alt="Artwork preview"/><div className="art-actions"><button onClick={() => void exportArtwork(selectedIndex, campaign)}>Download selected formats</button><button onClick={() => setStep(3)}>Review all nine</button></div>{[...postQa.errors, ...postQa.warnings].length > 0 && <div className="post-qa">{[...postQa.errors, ...postQa.warnings].map(item => <span key={item}>{item}</span>)}</div>}</section>
        <aside className="editor">
          <PhotoLibrary compact photos={photos} category={photoCategory} onCategory={setPhotoCategory} onAddFiles={addPhotos} onChoose={asset => assignPhoto(asset)} onRemove={id => setPhotos(deletePhoto(id))}/>
          <label>Post name<input value={post.name} onChange={event => updatePost({ name: event.target.value })}/></label>
          <label>Service<input value={post.service} onChange={event => updatePost({ service: event.target.value })}/></label>
          <label>Objective<select value={post.objective} onChange={event => updatePost({ objective: event.target.value as Objective })}>{['Awareness', 'Engagement', 'Conversion'].map(item => <option key={item}>{item}</option>)}</select></label>
          <label>Eyebrow<input value={post.eyebrow} onChange={event => updatePost({ eyebrow: event.target.value })}/></label>
          <label>Headline<textarea rows={2} value={post.headline} onChange={event => updatePost({ headline: event.target.value })}/></label>
          <label>Supporting answer<textarea rows={3} value={post.answer} onChange={event => updatePost({ answer: event.target.value })}/></label>
          <label>Supporting line<input value={post.support} onChange={event => updatePost({ support: event.target.value })}/></label>
          <div className="two-col"><label>Date<input type="date" value={post.suggestedDate} onChange={event => updatePost({ suggestedDate: event.target.value })}/></label><label>Time<input type="time" value={post.suggestedTime} onChange={event => updatePost({ suggestedTime: event.target.value })}/></label></div>
          <label>CTA type<input value={post.ctaType} onChange={event => updatePost({ ctaType: event.target.value })}/></label>
          <label>Contact details for caption<input value={post.contactDetails ?? ''} onChange={event => updatePost({ contactDetails: event.target.value })}/></label>
          <div className="benefit-editor"><strong>Supporting benefits</strong>{post.benefits.map((benefit, benefitIndex) => <div key={benefitIndex}><input value={benefit.title} onChange={event => updatePost({ benefits: post.benefits.map((item, index) => index === benefitIndex ? { ...item, title: event.target.value } : item) })}/><textarea rows={2} value={benefit.body} onChange={event => updatePost({ benefits: post.benefits.map((item, index) => index === benefitIndex ? { ...item, body: event.target.value } : item) })}/></div>)}</div>
          <label>Caption<textarea rows={6} value={post.caption} onChange={event => updatePost({ caption: event.target.value })}/></label>
          <div className="format-row">{(['portrait', 'square', 'linkedin'] as OutputFormat[]).map(format => <button className={post.formats.includes(format) ? 'active' : ''} onClick={() => toggleFormat(format)} key={format}>{format}</button>)}</div>
          <TemplatePicker post={post} onChange={template => updatePost({ template })}/>
        </aside>
      </section>}

      {step === 3 && <section className="panel review">
        <div className="section-head"><div><h2>{campaign.mode === 'batch' ? 'Review all nine together' : 'Review the post'}</h2><p>Check imagery, every word, factual claims, CTA strength and phone-size readability before export.</p></div><div className={`qa-total ${qa.errors.length ? 'bad' : qa.warnings.length ? 'warn' : 'good'}`}>{qa.errors.length} errors · {qa.warnings.length} warnings</div></div>
        <div className="contact-grid">{campaign.posts.map((item, index) => <button onClick={() => { setSelectedIndex(index); setStep(2); }} key={item.id}><img src={svgDataUrl(renderArtworkSvg(item, 'portrait'))} alt=""/><span>{index + 1}. {item.headline}</span></button>)}</div>
        {(qa.errors.length > 0 || qa.warnings.length > 0) && <div className="qa-list">{qa.errors.map(item => <p className="error" key={item}>{item}</p>)}{qa.warnings.map(item => <p key={item}>{item}</p>)}</div>}
        <div className="human-check"><strong>Human approval</strong><span>The image clearly shows the need</span><span>Every word has been read</span><span>Claims and dates are accurate</span><span>The post works at phone size</span></div>
        <div className="review-next"><span>Open any post above to make corrections.</span><button onClick={() => setStep(4)}>Continue to export</button></div>
      </section>}

      {step === 4 && <section className="panel export-stage">
        <div className="section-head"><div><h2>Export and publish</h2><p>Nothing is published automatically. Download the complete pack, then make the final human decision in Meta Business Suite.</p></div><div className={`qa-total ${qa.errors.length ? 'bad' : qa.warnings.length ? 'warn' : 'good'}`}>{qa.errors.length ? `${qa.errors.length} to fix` : 'Ready for human review'}</div></div>
        <div className="export-summary"><article><span>ARTWORK</span><strong>{campaign.posts.reduce((total, item) => total + item.formats.length, 0)} PNGs</strong><small>Selected portrait, square and LinkedIn formats</small></article><article><span>CAPTIONS</span><strong>{campaign.posts.length}</strong><small>Matched captions and schedule rows</small></article><article><span>DESIGN VARIETY</span><strong>{new Set(campaign.posts.map(item => templates.find(template => template.id === item.template)?.family)).size} families</strong><small>Across {campaign.posts.length} post{campaign.posts.length === 1 ? '' : 's'}</small></article></div>
        <div className="pack-card"><div><strong>Complete publishing pack</strong><span>PNG artwork, matched captions, schedule CSV, campaign JSON, contact sheet and publishing instructions.</span></div><button disabled={buildingPack || qa.errors.length > 0} onClick={() => void buildPack()}>{buildingPack ? 'Building pack…' : 'Download publishing pack'}</button></div>
        <div className="export-row"><button onClick={() => void exportContactSheet(campaign)}>Contact sheet</button><button onClick={() => exportCaptions(campaign)}>Captions</button><button onClick={() => exportSchedule(campaign)}>Schedule CSV</button><button onClick={() => exportCampaign(campaign)}>Campaign JSON</button></div>
        <div className="meta-handoff"><div><strong>Final human step</strong><p>Choose the correct Facebook and Instagram accounts, upload the matching PNG, paste the caption, preview it, then approve or schedule it.</p></div><a href="https://business.facebook.com/" target="_blank" rel="noreferrer">Open Meta Business Suite</a></div>
      </section>}
    </>}
  </main>;
}

import React, { useMemo, useState } from 'react';
import type { SocialPost } from '../types';
import { recommendTemplates, templates, type TemplateCategory } from '../templates/registry';

const categories: Array<'All' | TemplateCategory> = ['All', 'Photo-led', 'Advice', 'Trust', 'Business', 'Local', 'CTA', 'Editorial', 'Seasonal', 'Playful'];

type Props = { post: SocialPost; onChange: (template: string) => void; };

export function TemplatePicker({ post, onChange }: Props) {
  const [category, setCategory] = useState<'All' | TemplateCategory>('All');
  const recommended = useMemo(() => new Set(recommendTemplates(post.objective).slice(0, 4).map(item => item.id)), [post.objective]);
  const visible = useMemo(() => category === 'All' ? templates : templates.filter(template => template.categories.includes(category)), [category]);

  return <section className="template-browser">
    <div className="template-title"><div><strong>Creative direction</strong><small>12 dynamic art-direction systems. The layout adapts to the post rather than behaving like a fixed slide.</small></div><span>★ recommended</span></div>
    <nav className="filters compact" aria-label="Filter creative directions">{categories.map(item => <button type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</nav>
    <div className="template-picker art-direction-picker">{visible.map(template => {
      const familyIndex = templates.indexOf(template);
      return <button type="button" className={`${post.template === template.id ? 'selected' : ''} ${recommended.has(template.id) ? 'recommended' : ''}`} onClick={() => onChange(template.id)} key={template.id} title={template.artDirection}>
        <div className={`family-preview family-preview-${familyIndex}`}>
          <span>{String(familyIndex + 1).padStart(2, '0')}</span><b>{template.name}</b><i>{template.imageLed ? 'CINEMATIC / PHOTO' : 'TACTILE / TYPE'}</i>
        </div>
        <small>{template.name}</small><em>{template.artDirection}</em>
      </button>;
    })}</div>
  </section>;
}

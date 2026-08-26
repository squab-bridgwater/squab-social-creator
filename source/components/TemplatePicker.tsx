import React, { useMemo, useState } from 'react';
import type { SocialPost } from '../types';
import { recommendTemplates, templates, type TemplateCategory } from '../templates/registry';

const categories: Array<'All' | TemplateCategory> = ['All', 'Photo-led', 'Advice', 'Trust', 'Business', 'Local', 'CTA', 'Editorial'];

type Props = {
  post: SocialPost;
  onChange: (template: string) => void;
};

export function TemplatePicker({ post, onChange }: Props) {
  const [category, setCategory] = useState<'All' | TemplateCategory>('All');
  const recommended = useMemo(() => new Set(recommendTemplates(post.objective).slice(0, 6).map(item => item.id)), [post.objective]);
  const visible = useMemo(() => category === 'All' ? templates : templates.filter(template => template.categories.includes(category)), [category]);

  return <section className="template-browser">
    <div className="template-title"><div><strong>Design treatment</strong><small>24 templates across 12 genuinely different layout families</small></div><span>★ recommended</span></div>
    <nav className="filters compact" aria-label="Filter templates">{categories.map(item => <button type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</nav>
    <div className="template-picker">{visible.map(template => {
      const index = templates.indexOf(template);
      const familyIndex = Math.floor(index / 2);
      return <button type="button" className={`${post.template === template.id ? 'selected' : ''} ${recommended.has(template.id) ? 'recommended' : ''}`} onClick={() => onChange(template.id)} key={template.id} title={`${template.name} · ${template.family}`}>
        <div className={`family-preview family-preview-${familyIndex} variant-${template.variant.toLowerCase()}`}>
          <span>{template.family}</span><b>{template.name}</b><i>{template.imageLed ? 'PHOTO' : 'TYPE'}</i>
        </div>
        <small>{template.name}</small><em>{template.family}</em>
      </button>;
    })}</div>
  </section>;
}

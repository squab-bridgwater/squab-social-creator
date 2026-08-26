import React, { useMemo, useState } from 'react';
import { templates, TemplateCategory } from './templates/registry';

const categories: Array<'All' | TemplateCategory> = ['All', 'Photo-led', 'Advice', 'Trust', 'Business', 'Local', 'CTA', 'Editorial'];

export function App() {
  const [category, setCategory] = useState<'All' | TemplateCategory>('All');
  const [selected, setSelected] = useState('full-bleed-hero');
  const visible = useMemo(() => category === 'All' ? templates : templates.filter(t => t.categories.includes(category)), [category]);

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Squab Social Creator</p>
          <h1>Template Studio V2</h1>
          <p className="intro">Development-only template browser. The existing campaign workflow remains the product backbone.</p>
        </div>
        <div className="status">24 templates · 12 families</div>
      </header>

      <nav className="filters" aria-label="Template filters">
        {categories.map(item => <button key={item} className={item === category ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
      </nav>

      <section className="grid">
        {visible.map((template, index) => (
          <button className={`template-card ${selected === template.id ? 'selected' : ''}`} key={template.id} onClick={() => setSelected(template.id)}>
            <div className={`preview preview-${index % 6}`}>
              <span className="logo-zone">SQUAB</span>
              <div className="preview-copy">
                <small>{template.family}</small>
                <strong>{template.name}</strong>
                <span>{template.imageLed ? 'Photo-led composition' : 'Typography-led composition'}</span>
              </div>
            </div>
            <div className="meta">
              <div><strong>{template.name}</strong><span>{template.family}</span></div>
              <span className="tone">{template.tone}</span>
            </div>
          </button>
        ))}
      </section>
    </main>
  );
}

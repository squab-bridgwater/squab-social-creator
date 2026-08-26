import React from 'react';
import type { PhotoAsset } from '../data/library';

const categories = ['General', 'Household', 'Moving', 'Business', 'Offices & Workspace', 'Local Team'];

type Props = {
  photos: PhotoAsset[];
  category: string;
  onCategory: (value: string) => void;
  onAddFiles: (files: File[]) => Promise<void>;
  onChoose?: (asset: PhotoAsset) => void;
  onRemove: (id: string) => void;
  onAutoAssign?: () => void;
  compact?: boolean;
};

export function PhotoLibrary(props: Props) {
  const { photos, category, onCategory, onAddFiles, onChoose, onRemove, onAutoAssign, compact = false } = props;
  return <section className={`photo-library-section ${compact ? 'compact' : ''}`}>
    <div className="section-head"><div><h3>Reusable Squab photography</h3><p>Add genuine photography once, categorise it and reuse it across campaigns.</p></div>{onAutoAssign && <button type="button" onClick={onAutoAssign}>Auto-assign this campaign</button>}</div>
    <div className="photo-toolbar"><select value={category} onChange={event => onCategory(event.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select><label className="upload">Add photographs<input type="file" accept="image/*" multiple onChange={event => void onAddFiles(Array.from(event.target.files ?? []))}/></label></div>
    {photos.length > 0 ? <div className="library-photo-grid">{photos.slice(0, compact ? 8 : 40).map(asset => <article key={asset.id}><img src={asset.dataUrl} alt=""/><strong>{asset.name}</strong><small>{asset.category}</small><div>{compact && onChoose && <button type="button" onClick={() => onChoose(asset)}>Use for this post</button>}<button type="button" className="danger" onClick={() => onRemove(asset.id)}>Remove</button></div></article>)}</div> : <p className="empty-state">No reusable photographs have been added on this device yet.</p>}
  </section>;
}

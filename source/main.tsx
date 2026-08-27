import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ReviewLab } from './ReviewLab';
import { PromptWizard } from './guided/PromptWizard';
import './styles.css';
import './v2-additions.css';
import './art-directions.css';
import './review-lab.css';
import './guided/guided.css';

const params = new URLSearchParams(window.location.search);
const isReviewLab = params.get('lab') === '1';
const isGuidedWizard = params.get('wizard') === '1';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isGuidedWizard ? <PromptWizard /> : isReviewLab ? <ReviewLab /> : <App />}
  </React.StrictMode>,
);

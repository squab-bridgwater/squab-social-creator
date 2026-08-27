import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ReviewLab } from './ReviewLab';
import './styles.css';
import './v2-additions.css';
import './art-directions.css';
import './review-lab.css';

const isReviewLab = new URLSearchParams(window.location.search).get('lab') === '1';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isReviewLab ? <ReviewLab /> : <App />}
  </React.StrictMode>,
);

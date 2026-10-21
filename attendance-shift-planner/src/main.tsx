import React from 'react'; import { createRoot } from 'react-dom/client';
import App from './App'; import './styles.css'; import { SPEC } from './spec';
const r=document.documentElement.style;
r.setProperty('--accent', SPEC.identity.primary); r.setProperty('--accent2', SPEC.identity.accent);
r.setProperty('--radius', SPEC.identity.radius); r.setProperty('--font-ar', `'${SPEC.identity.fonts[0]}',sans-serif`); r.setProperty('--font-en', `'${SPEC.identity.fonts[1]}',sans-serif`);
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);

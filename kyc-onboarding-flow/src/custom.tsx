// Flagship hand-finishing (Phase 2): STEP FLOW (S2) progress spine + CAPTURE STEP (S3) coached capture.
// A11y overlay obligations (a11y-baseline §7): session ribbon, SR guidance for capture, upload alternative.
import React, { useState } from 'react';

const STEPS = ['Full legal name', 'Date of birth', 'National ID number', 'Address', 'Document capture', 'Review & submit'];
function StepFlow({ ar }: { ar: boolean }) {
  const [idx, setIdx] = useState(1); const [val, setVal] = useState(''); const [saved, setSaved] = useState(false);
  const answer = (v: string) => { setVal(v); setSaved(false); setTimeout(() => setSaved(true), 500); };
  return <div><h2>Step flow — one question per screen, Progress Spine</h2>
    <div role="status" style={{ border: '1px dashed var(--accent)', borderRadius: 'var(--radius)', padding: '.6rem 1rem', marginBottom: '1rem' }}>
      Session ribbon: 09:42 remaining · <button>Extend session</button> · Autosave: {saved ? 'saved ✓ (P10)' : 'editing…'}</div>
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem' }}>
      <ol className="steps" aria-label="Progress spine">{STEPS.map((s, i) => <li key={s} className={i < idx ? 'done' : i === idx ? 'now' : ''}>{s}{i === 0 && val ? ' — recalled ✓ (P11)' : ''}</li>)}</ol>
      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '1.2rem' }}>
        {idx === 0 && <><label style={{ display: 'grid', gap: '.4rem' }}>Full legal name (as on the document)
          <input value={val} onChange={e => answer(e.target.value)} style={{ padding: '.6rem', font: 'inherit', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }} placeholder="e.g. Sara Ahmed" /></label>
          <p className="hint">Recalled answers are marked as recalled; nothing is re-asked (3.3.7).</p></>}
        {idx > 0 && idx < 5 && <><h3 style={{ marginTop: 0 }}>{STEPS[idx]}</h3><p>Micro-step surface: one question, autosaved as a draft StepState. Back navigation to completed steps is free until submission.</p>
          <label style={{ display: 'grid', gap: '.4rem' }}>Your answer <input onChange={() => answer('x')} style={{ padding: '.6rem', font: 'inherit', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }} /></label></>}
        {idx === 5 && <><h3 style={{ marginTop: 0 }}>Review & submit</h3><p>All steps folded. Submission creates a ReviewTask ranked by deadline in the console queue (S8) and an immutable ledger entry.</p></>}
        <div className="row"><button disabled={idx === 0} onClick={() => setIdx(v => v - 1)}>Back</button>
          <button className="primary" disabled={idx === 0 && !val} onClick={() => setIdx(v => Math.min(v + 1, 5))}>{idx === 5 ? 'Submit application' : 'Save & continue'}</button>
          <button>Save & exit — resume anytime</button></div>
      </div>
    </div></div>;
}
function Capture({ ar }: { ar: boolean }) {
  const [checks, setChecks] = useState([true, true, false, false]); const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const labels = ['All four corners inside the frame', 'No glare on the document surface', 'Text is sharp and readable', 'Document fills most of the frame'];
  const toggle = (i: number) => setChecks(c => c.map((v, j) => j === i ? !v : v));
  return <div><h2>Capture step — coached document capture</h2>
    <div className="row" role="group" aria-label="Capture mode"><button aria-pressed={mode === 'camera'} onClick={() => setMode('camera')}>Camera guidance</button>
      <button aria-pressed={mode === 'upload'} onClick={() => setMode('upload')}>Upload instead (always available)</button></div>
    {mode === 'camera' ? <div style={{ background: 'var(--ink)', color: '#f2f0e9', borderRadius: 'var(--radius)', padding: '1.4rem' }}>
      <div style={{ border: '2px dashed var(--accent2)', borderRadius: 'var(--radius)', height: 190, display: 'grid', placeItems: 'center' }}><span>▭ Hold the document flat, all four corners inside the frame</span></div>
      <ul style={{ listStyle: 'none', padding: 0 }}>{labels.map((l, i) => <li key={l}><label><input type="checkbox" checked={checks[i]} onChange={() => toggle(i)} /> {l} {checks[i] ? '✓' : ''}</label></li>)}</ul>
      <button className="primary" disabled={!checks.every(Boolean)}>{checks.every(Boolean) ? 'Capture document' : 'Align the document to enable capture'}</button>
      <p className="hint" style={{ color: '#cfd4dc' }}>Live gate checklist is announced to screen readers; no biometric step is ever the only path (§7).</p></div>
    : <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '1.2rem' }}><label style={{ display: 'grid', gap: '.5rem' }}>Upload a photo or scan of the document <input type="file" /></label>
      <p className="hint">Same quality gates run on uploads; re-take/re-upload loop is unlimited.</p></div>}
  </div>;
}
export const CUSTOM_SCREENS: Record<string, React.FC<{ ar: boolean }>> = { S2: StepFlow, S3: Capture };

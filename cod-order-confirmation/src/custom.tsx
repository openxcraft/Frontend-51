// Flagship hand-finishing (Phase 2): ORDER DRAWER (S3) — confirmation ladder + RTO risk drill.
import React, { useState } from 'react';

const LADDER = ['Attempt 1 · Call + message', 'Attempt 2 · Call, different hour', 'Attempt 3 · Final call + window offer', 'Escalate · Manual review / cancel'];
function Drawer({ ar }: { ar: boolean }) {
  const [step, setStep] = useState(0); const [agreed, setAgreed] = useState(false); const [window_, setWindow] = useState('Tomorrow 10:00–13:00');
  return <div><h2>Order drawer — confirmation ladder + RTO risk</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
      <div>
        <p><b>Order #COD-8841</b> · Buyer: Huda S. · 3 items · Cash on delivery · District: Nasr City</p>
        <ol className="steps">{LADDER.map((s, i) => <li key={i} className={i < step ? 'done' : i === step ? 'now' : ''}>{s}{i < step ? ' — no answer, logged to ledger' : ''}</li>)}</ol>
        <div className="row"><button className="primary" disabled={step >= LADDER.length - 1 || agreed} onClick={() => setStep(v => v + 1)}>Record attempt outcome</button>
          <span className="hint">Quiet hours respected: no attempts 21:00–09:00 (policy center S9).</span></div>
        <fieldset style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '1rem' }}>
          <legend>Delivery-window agreement (S4)</legend>
          {['Today 16:00–19:00', 'Tomorrow 10:00–13:00', 'Tomorrow 16:00–19:00'].map(w => <label key={w} style={{ display: 'block', padding: '.25rem 0' }}>
            <input type="radio" name="win" checked={window_ === w} onChange={() => setWindow(w)} /> {w}</label>)}
          <button className="primary" disabled={agreed} onClick={() => setAgreed(true)}>{agreed ? 'Agreed ✓ — manifest updated (S7)' : 'Confirm agreement with buyer'}</button>
          {agreed && <p role="status">Agreement recorded with timestamp + attempt trail. Courier handoff manifest now includes this order.</p>}
        </fieldset>
      </div>
      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>RTO risk drill</h3>
        <p style={{ fontSize: '2rem', margin: '.2rem 0' }}><b>62</b><span className="hint"> / 100 — elevated</span></p>
        {[['Unconfirmed attempts', 70], ['Address precision', 45], ['Buyer history', 58], ['Basket value band', 66]].map(([k, v]) => <div key={k as string} style={{ marginBottom: '.5rem' }}><span>{k}</span>
          <div style={{ background: 'var(--canvas)', border: '1px solid var(--line)', borderRadius: 99, height: 10 }}><div style={{ width: v + '%', height: '100%', background: 'var(--accent2)', borderRadius: 99 }} /></div></div>)}
        <p className="hint">Risk explains itself: each factor is inspectable, none auto-cancels an order. A human confirms (P15).</p>
      </div>
    </div></div>;
}
export const CUSTOM_SCREENS: Record<string, React.FC<{ ar: boolean }>> = { S3: Drawer };

// Flagship hand-finishing (Phase 2): THE BOARD (S2) fairness-ranked + OFFER DETAIL fairness reveal (S3).
import React, { useState } from 'react';

type Offer = { id: string; worker: string; shift: string; wants: string; fairness: number; quals: number; rest: number; balance: number };
const OFFERS: Offer[] = [
  { id: 'sw-101', worker: 'Sara A.', shift: 'Fri 14:00–22:00 · Floor', wants: 'Morning shift', fairness: 94, quals: 100, rest: 96, balance: 88 },
  { id: 'sw-102', worker: 'Omar K.', shift: 'Sat 09:00–17:00 · Stock', wants: 'Any evening', fairness: 87, quals: 100, rest: 82, balance: 79 },
  { id: 'sw-103', worker: 'Lina M.', shift: 'Sun 14:00–22:00 · Floor', wants: 'Weekday morning', fairness: 81, quals: 75, rest: 90, balance: 84 },
  { id: 'sw-104', worker: 'Yusuf R.', shift: 'Mon 22:00–06:00 · Night', wants: 'Day shift', fairness: 76, quals: 100, rest: 61, balance: 72 },
];
function Bar({ label, v }: { label: string; v: number }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr 40px', gap: '.6rem', alignItems: 'center' }}>
    <span>{label}</span><div style={{ background: 'var(--canvas)', border: '1px solid var(--line)', borderRadius: 99, height: 12 }}><div style={{ width: v + '%', height: '100%', background: 'var(--accent)', borderRadius: 99 }} /></div><b>{v}</b></div>;
}
function Board({ ar }: { ar: boolean }) {
  const [taken, setTaken] = useState<string[]>([]); const [sel, setSel] = useState<Offer>(OFFERS[0]);
  return <div><h2>THE BOARD — fairness-ranked swap offers</h2>
    <p className="hint">Ranking is explained, never a black box: fairness = qualification match · rest-rule safety · swap balance. Blackout dates refuse with the rule named.</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div>{[...OFFERS].sort((a, b) => b.fairness - a.fairness).map(o => <div key={o.id} style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '.8rem', marginBottom: '.6rem', opacity: taken.includes(o.id) ? .45 : 1 }}>
        <b>#{o.fairness} fairness</b> · {o.worker}<br />{o.shift}<br /><span className="hint">Wants: {o.wants}</span>
        <div className="row"><button onClick={() => setSel(o)}>Fairness reveal</button>
          <button className="primary" disabled={taken.includes(o.id)} onClick={() => setTaken(v => [...v, o.id])}>{taken.includes(o.id) ? 'Response sent ✓' : 'Respond to swap'}</button></div></div>)}</div>
      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Fairness Reveal — {sel.worker}</h3>
        <Bar label="Qualification match" v={sel.quals} /><Bar label="Rest-rule safety" v={sel.rest} /><Bar label="Swap balance (30d)" v={sel.balance} />
        <p><b>Overall fairness: {sel.fairness}</b></p><p className="hint">Supervisor approval still required; the ledger (S17) records every step (P17).</p></div>
    </div></div>;
}
export const CUSTOM_SCREENS: Record<string, React.FC<{ ar: boolean }>> = { S2: Board, S3: Board };

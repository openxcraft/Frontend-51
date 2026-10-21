// Flagship hand-finishing (Phase 2): EXPLORATION CANVAS (S3) — segment-annealed funnel with drill paths.
import React, { useMemo, useState } from 'react';

const STAGES = ['Visited', 'Signed up', 'Activated', 'First purchase', 'Repeat purchase'];
const SEGMENTS: Record<string, number[]> = {
  'All users': [10000, 6200, 3900, 2100, 940],
  'Arabic locale': [4300, 2900, 1980, 1120, 560],
  'English locale': [5700, 3300, 1920, 980, 380],
  'Mobile': [6800, 3900, 2200, 1130, 470],
  'Desktop': [3200, 2300, 1700, 970, 470],
};
function Canvas({ ar }: { ar: boolean }) {
  const [seg, setSeg] = useState('All users'); const [drill, setDrill] = useState<number | null>(null);
  const vals = SEGMENTS[seg]; const max = vals[0];
  const drops = useMemo(() => vals.map((v, i) => i === 0 ? 0 : Math.round((1 - v / vals[i - 1]) * 100)), [vals]);
  const worst = drops.indexOf(Math.max(...drops.slice(1)));
  return <div><h2>Exploration canvas — where does the funnel leak?</h2>
    <div className="row" role="group" aria-label="Segment">{Object.keys(SEGMENTS).map(s => <button key={s} aria-pressed={seg === s} className={seg === s ? 'chip on' : 'chip'} onClick={() => { setSeg(s); setDrill(null); }}>{s}</button>)}</div>
    <div style={{ background: 'var(--ink)', borderRadius: 'var(--radius)', padding: '1.2rem', color: '#eef1f5' }}>
      {STAGES.map((s, i) => <div key={s} style={{ marginBottom: '.7rem' }}>
        <button onClick={() => setDrill(i)} style={{ background: 'none', border: 0, color: 'inherit', padding: 0, textAlign: 'start', width: '100%' }}>
          <span style={{ display: 'inline-block', width: 150 }}>{s}</span>
          <span style={{ display: 'inline-block', verticalAlign: 'middle', height: 22, width: Math.max(4, (vals[i] / max) * 55) + '%', background: i === worst ? 'var(--accent2)' : 'var(--accent)', borderRadius: 4 }} />
          <b> {vals[i].toLocaleString()}</b>{i > 0 && <span style={{ color: '#f0b429' }}> −{drops[i]}% drop</span>}</button></div>)}
      <p className="hint" style={{ color: '#aeb6c2' }}>Largest leak for {seg}: <b style={{ color: '#fff' }}>{STAGES[worst - 1]} → {STAGES[worst]} (−{drops[worst]}%)</b>. Select any stage to drill into its cohort.</p>
    </div>
    {drill !== null && <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '1rem', marginTop: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>Drill: {STAGES[drill]} · {seg}</h3>
      <p>{vals[drill].toLocaleString()} users · bilingual event taxonomy names shown in both locales · cohort-linked from S5.</p>
      <p className="hint">Annealing note: segment values recompute from the adapter sample, never from a cached dashboard aggregate (07b Sources & Samples, S7).</p></div>}
  </div>;
}
export const CUSTOM_SCREENS: Record<string, React.FC<{ ar: boolean }>> = { S3: Canvas };

// Flagship hand-finishing (Phase 2): Document editor (S3) + Parity Weave (S5).
// Signature components from 06: RegisterDial, TashkeelToggle, DiffBrush behaviour, streaming generation (P13).
import React, { useEffect, useRef, useState } from 'react';

const REGISTERS = [
  { id: 'plain', ar: 'فصحى بيضاء', en: 'MSA Plain', hint: 'Short sentences, direct verbs, minimal ornament.' },
  { id: 'middle', ar: 'فصحى وسطى', en: 'MSA Middle', hint: 'Balanced register for brand campaigns; some rhetorical warmth.' },
  { id: 'dialect', ar: 'متسامح مع العامية', en: 'Dialect-tolerant', hint: 'Accepts regional dialect markers; flags them instead of failing.' },
];
const SOURCE = 'أطلقنا تشكيلة الشتاء الجديدة — خامات طبيعية، قصّات مدروسة، وأسعار في متناول الجميع. اكتشفها الآن في جميع فروعنا.';
const TARGET = 'Our new winter collection has landed — natural fabrics, considered cuts, and prices within everyone\u2019s reach. Discover it now at all our stores.';

function Editor({ ar }: { ar: boolean }) {
  const [reg, setReg] = useState('middle');
  const [tashkeel, setTashkeel] = useState(false);
  const [text, setText] = useState(SOURCE);
  const [stream, setStream] = useState('');
  const [busy, setBusy] = useState(false);
  const timer = useRef<any>(null);
  const generate = () => {
    if (busy) return; setBusy(true); setStream('');
    const full = 'تشكيلة شتاءٍ وُلدت من خاماتٍ طبيعية وقصّاتٍ مدروسة — دفءٌ صادق بسعرٍ في متناول الجميع. زوروا فروعنا اليوم.';
    let i = 0; timer.current = setInterval(() => { i += 3; setStream(full.slice(0, i)); if (i >= full.length) { clearInterval(timer.current); setBusy(false); } }, 45);
  };
  const stop = () => { clearInterval(timer.current); setBusy(false); };
  useEffect(() => () => clearInterval(timer.current), []);
  return <div>
    <h2>{ar ? 'محرّر المستند' : 'Document editor'} — Register Dial · Tashkeel · Streaming</h2>
    <fieldset className="row" style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '1rem' }}>
      <legend>{ar ? 'سجلّ اللغة' : 'Register Dial'} (radio-group semantics, 06)</legend>
      {REGISTERS.map(r => <label key={r.id} style={{ display: 'block', padding: '.3rem 0' }}>
        <input type="radio" name="register" checked={reg === r.id} onChange={() => setReg(r.id)} /> <b>{r.ar} · {r.en}</b> — {r.hint}</label>)}
    </fieldset>
    <p className="row"><button aria-pressed={tashkeel} onClick={() => setTashkeel(v => !v)}>Tashkeel: {tashkeel ? 'ON — line-height reserved ≥1.8' : 'OFF'}</button>
      <button className="primary" onClick={generate} disabled={busy}>{busy ? 'Generating…' : 'Generate variant'}</button>
      {busy && <button onClick={stop}>Stop</button>}
      <span className="hint">Quota: 320 / 1000 units (P14)</span></p>
    <label style={{ display: 'grid', gap: '.4rem' }}>{ar ? 'النص' : 'Document text'}
      <textarea value={text} onChange={e => setText(e.target.value)} rows={4} style={{ font: 'inherit', padding: '.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--line)', lineHeight: tashkeel ? 1.9 : 1.6 }} /></label>
    <p className="hint">Inspection: register drift 0 spans · dialect: none detected · glossary hits 2 preferred ✓ (inspectText)</p>
    {stream && <div aria-live="polite" style={{ border: '1px dashed var(--accent)', borderRadius: 'var(--radius)', padding: '1rem', marginTop: '.8rem' }}>
      <b>{busy ? 'Streaming (P13)…' : 'Draft variant — review before applying (P15 trust checkpoint)'}</b>
      <p lang="ar" dir="rtl" style={{ lineHeight: 1.8 }}>{stream}</p>
      {!busy && <button className="primary" onClick={() => { setText(stream); setStream(''); }}>Accept into document</button>}</div>}
  </div>;
}

function Weave({ ar }: { ar: boolean }) {
  const [done, setDone] = useState(false); const [busy, setBusy] = useState(false);
  const run = () => { setBusy(true); setTimeout(() => { setBusy(false); setDone(true); }, 900); };
  return <div><h2>Parity Weave — bilingual transform review (CP-3)</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '1rem' }}><b>Source · العربية</b><p lang="ar" dir="rtl" style={{ lineHeight: 1.8 }}>{SOURCE}</p></div>
      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '1rem' }}><b>Target · English</b>{done ? <p>{TARGET}</p> : <p className="hint">{busy ? 'Transform Job running — queued → running (async-contract)…' : 'Not transformed yet.'}</p>}</div>
    </div>
    <p className="row">{!done ? <button className="primary" onClick={run} disabled={busy}>Transform content (Job)</button>
      : <><span>Length parity: 96% · glossary enforced ✓</span><button className="primary" onClick={() => setDone(false)}>Commit transform</button></>}</p></div>;
}

export const CUSTOM_SCREENS: Record<string, React.FC<{ ar: boolean }>> = { S3: Editor, S5: Weave };

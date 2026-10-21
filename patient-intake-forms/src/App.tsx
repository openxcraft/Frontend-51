import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { SPEC } from './spec';
import { callOp, recordsFor } from './adapter/mock';
import { CUSTOM_SCREENS } from './custom';

type UiState = 'populated' | 'empty' | 'loading' | 'error';
type Ent = { name: string; fields: Array<{ name: string; optional?: boolean; type: string }> };
type Flow = { title: string; steps: string[] };
const SCREENS = SPEC.screens as unknown as Array<any>;
const ENTITIES = (SPEC as unknown as any).entities as Ent[];
const FLOWS: Flow[] = ((SPEC as unknown as any).flows as any[]).map(f => typeof f === 'string' ? { title: f, steps: [] } : f);
const COMPS = (SPEC as unknown as any).components as Array<any>;
const COPY = (SPEC as unknown as any).copy as Record<string, string[]>;
const isArDefault = SPEC.direction.includes('bilingual-ar');

function primaryEntity(screen: any): Ent | undefined {
  const ops: string[] = [...String(screen.data || '').matchAll(/\b(?:list|get)([A-Z]\w+)/g)].map(m => m[1]);
  for (const stem of ops) {
    const e = ENTITIES.find(x => x.name.toLowerCase() === stem.toLowerCase().replace(/s$/, '')) || ENTITIES.find(x => stem.toLowerCase().startsWith(x.name.toLowerCase()));
    if (e) return e;
  }
  return ENTITIES[0];
}
const scalar = (f: { type: string }) => !/\[\]|\{/.test(f.type) || /string\[\]/.test(f.type);

export default function App() {
  const [screenId, setScreenId] = useState(SCREENS[0]?.id);
  const [state, setState] = useState<UiState>('populated');
  const [ar, setAr] = useState(isArDefault);
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [announce, setAnnounce] = useState('');
  const [toast, setToast] = useState('');
  const [store, setStore] = useState<Record<string, Array<Record<string, any>>>>({});
  const [detail, setDetail] = useState<Record<string, any> | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [lastDeleted, setLastDeleted] = useState<{ sid: string; rec: Record<string, any> } | null>(null);
  const [flowIdx, setFlowIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [opSel, setOpSel] = useState<string>((SPEC as any).ops[0] || '');
  const [opResult, setOpResult] = useState('');
  const [opBusy, setOpBusy] = useState(false);
  const [jobState, setJobState] = useState('');

  const screen = SCREENS.find(s => s.id === screenId) || SCREENS[0];
  const ent = primaryEntity(screen);
  const records = ent ? (store[screen.id] ?? recordsFor(ent.name, 6)) : [];
  const setRecords = (rows: Array<Record<string, any>>) => setStore(s => ({ ...s, [screen.id]: rows }));
  const Custom = CUSTOM_SCREENS[screen.id];
  const filtered = SCREENS.filter(s => (s.name + ' ' + s.purpose).toLowerCase().includes(query.toLowerCase()));
  const flow = FLOWS[flowIdx];

  useEffect(() => { document.documentElement.dir = ar ? 'rtl' : 'ltr'; document.documentElement.lang = ar ? 'ar' : 'en'; }, [ar]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette(v => !v); }
      if (e.key === 'Escape') { setPalette(false); setConfirmDel(null); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);
  useEffect(() => { setAnnounce(`${screen.name} — ${screen.purpose}`); setSelected([]); setDetail(null); }, [screen]);

  const cols = ent ? ent.fields.filter(scalar).slice(0, 5) : [];
  const addRecord = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault(); if (!ent) return;
    const fd = new FormData(ev.currentTarget); const rec: Record<string, any> = { id: ent.name.toLowerCase() + '-' + (200 + records.length) };
    for (const f of ent.fields.filter(scalar)) { const v = fd.get(f.name); if (v !== null && v !== '') rec[f.name] = /number/.test(f.type) ? Number(v) : /boolean/.test(f.type) ? v === 'on' : v; else if (!(f.name in rec)) rec[f.name] = f.name === 'id' ? rec.id : '—'; }
    setRecords([rec, ...records]); setToast((ar ? 'تمت الإضافة: ' : 'Added: ') + ent.name); ev.currentTarget.reset();
  };
  const doDelete = (id: string) => { const rec = records.find(r => String(r.id) === id); setRecords(records.filter(r => String(r.id) !== id)); if (rec) setLastDeleted({ sid: screen.id, rec }); setConfirmDel(null); setToast(ar ? 'تم الحذف — التراجع متاح' : 'Deleted — undo available'); };
  const runOp = async () => { setOpBusy(true); setOpResult(''); const r = await callOp(opSel); setOpResult(JSON.stringify(r, null, 1)); setOpBusy(false); if (r?.data?.state) setJobState(r.data.state); };

  return (
    <div className="shell">
      <a className="skip" href="#main">{ar ? 'تخطَّ إلى المحتوى' : 'Skip to content'}</a>
      <div className="live" aria-live="polite">{announce}</div>
      {toast && <div className="toast" role="status">{toast} {lastDeleted && <button onClick={() => { setRecords([lastDeleted.rec, ...records]); setLastDeleted(null); setToast(''); }}>{ar ? 'تراجع' : 'Undo'}</button>}</div>}
      <aside className="rail" aria-label="Screens">
        <div className="brand"><strong>{SPEC.title}</strong><span>{SPEC.family} · Tier {SPEC.tier}{SPEC.flagship ? ' · Flagship' : ''}</span></div>
        <button className="palette-btn" onClick={() => setPalette(true)}>⌘K {ar ? 'بحث وأوامر' : 'Search & commands'}</button>
        <nav>{SCREENS.map(s => (
          <button key={s.id} className={s.id === screen.id ? 'nav active' : 'nav'} onClick={() => setScreenId(s.id)} aria-current={s.id === screen.id ? 'page' : undefined}>
            <span className="sid">{s.id}</span>{s.name}<small>{s.archetype}</small>
          </button>))}
        </nav>
        <div className="railfoot">{SPEC.adapter}<br />{SPEC.ops.length} operations · {SCREENS.length} screens · {ENTITIES.length} entities</div>
      </aside>

      <main id="main" className="main" tabIndex={-1}>
        <header className="topbar">
          <div><h1>{screen.name}</h1><p>{screen.purpose}</p></div>
          <div className="top-actions">
            <span className="save" role="status">● {ar ? 'تم الحفظ' : 'Saved'}</span>
            <button onClick={() => setAr(v => !v)}>{ar ? 'English · LTR' : 'العربية · RTL'}</button>
          </div>
        </header>

        <section className="meta" aria-label="Spec binding">
          <span>Identity: <b>{SPEC.identity.colorName}</b> · {SPEC.identity.pairing} ({SPEC.identity.fonts.join(' + ')}) · radius {SPEC.identity.radius} · {SPEC.identity.elevation} · {SPEC.identity.motion}</span>
          {screen.data && <span>Data → adapter: <code>{screen.data}</code></span>}
        </section>

        <div className="statebar" role="group" aria-label="Screen state (11-empty-loading-error)">
          {(['populated', 'empty', 'loading', 'error'] as UiState[]).map(s => <button key={s} className={state === s ? 'chip on' : 'chip'} onClick={() => setState(s)}>{s}</button>)}
          <span className="hint">Four-state obligation · P01/P02 · copy: 11</span>
        </div>

        {state === 'loading' && <div className="workspace" aria-busy="true"><p className="copyline">{COPY.loading?.[0] || (ar ? 'جارٍ التحميل…' : 'Loading…')}</p>{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ width: `${92 - i * 14}%` }} />)}</div>}
        {state === 'empty' && <div className="workspace empty"><h2>{ar ? 'لا شيء هنا بعد' : 'Nothing here yet'}</h2><p>{COPY.empty?.[0] || (ar ? 'أنشئ أول عنصر لبدء العمل — حالة الفراغ الأولى (P01).' : 'Create the first item to get started — first-run empty state (P01).')}</p><button className="primary" onClick={() => setState('populated')}>{ar ? 'إنشاء' : 'Create'}</button></div>}
        {state === 'error' && <div className="workspace error" role="alert"><h2>{ar ? 'تعذّر التحميل' : 'Could not load'}</h2><p>{COPY.error?.[0] || 'NETWORK · retryable · correlation surfaced per copy-voice.'} <button className="primary" onClick={() => setState('populated')}>{ar ? 'إعادة المحاولة' : 'Retry'}</button></p></div>}

        {state === 'populated' && (Custom ? <section className="workspace custom"><Custom ar={ar} /></section> : (
          <section className={`workspace arch-${screen.archetype}`}>
            <div className="chips"><span className="fchip">Filter: Active ✕</span><span className="fchip">Saved view: Default</span><span className="arch">{screen.archetype}</span>{ent && <span className="arch">{ent.name}</span>}</div>
            {ent ? <>
              <table><thead><tr><th><span className="visually-hidden">Select</span></th>{cols.map(f => <th key={f.name}>{f.name}</th>)}<th></th></tr></thead>
                <tbody>{records.map(r => <tr key={String(r.id)}>
                  <td><input type="checkbox" aria-label={`Select ${r.id}`} checked={selected.includes(String(r.id))} onChange={e => setSelected(v => e.target.checked ? [...v, String(r.id)] : v.filter(x => x !== String(r.id)))} /></td>
                  {cols.map(f => <td key={f.name}>{String(r[f.name] ?? '—')}</td>)}
                  <td><button onClick={() => setDetail(r)}>Open</button> <button onClick={() => setConfirmDel(String(r.id))}>Delete</button></td></tr>)}</tbody></table>
              {selected.length > 0 && <div className="bulkbar">{selected.length} selected <button onClick={() => setToast('Export queued as a Job')}>Export</button><button onClick={() => setSelected([])}>Clear</button></div>}
              {detail && <div className="detail"><h3>{ent.name} · {String(detail.id)}</h3><dl>{ent.fields.map(f => <div key={f.name}><dt>{f.name}</dt><dd>{String(detail[f.name] ?? '—')}</dd></div>)}</dl><button onClick={() => setDetail(null)}>Close</button></div>}
              <form className="addform" onSubmit={addRecord}><h3>{ar ? 'إضافة' : 'Add'} {ent.name}</h3>
                {ent.fields.filter(scalar).slice(0, 6).map(f => /boolean/.test(f.type)
                  ? <label key={f.name}>{f.name} <input type="checkbox" name={f.name} /></label>
                  : <label key={f.name}>{f.name}{f.optional ? '' : ' *'} <input name={f.name} type={/number/.test(f.type) ? 'number' : 'text'} required={!f.optional && f.name !== 'id'} placeholder={f.type.slice(0, 28)} /></label>)}
                <button className="primary" type="submit">{ar ? 'إضافة' : 'Add'}</button></form>
            </> : <p>Workspace per 04 IA. Adapter: <code>{SPEC.adapter}</code>.</p>}
          </section>
        ))}

        <section className="grid2">
          <div className="card"><h2>Critical flows · 03</h2>
            {flow ? <><label>Flow <select value={flowIdx} onChange={e => { setFlowIdx(Number(e.target.value)); setStepIdx(0); }}>{FLOWS.map((f, i) => <option key={i} value={i}>{f.title}</option>)}</select></label>
              <ol className="steps">{flow.steps.map((s, i) => <li key={i} className={i < stepIdx ? 'done' : i === stepIdx ? 'now' : ''}>{s}</li>)}</ol>
              <div className="row"><button disabled={stepIdx === 0} onClick={() => setStepIdx(v => v - 1)}>Back</button>
                <button className="primary" disabled={stepIdx >= flow.steps.length} onClick={() => setStepIdx(v => v + 1)}>{stepIdx >= flow.steps.length ? 'Complete ✓' : 'Next step'}</button>
                <span className="hint">{Math.min(stepIdx + 1, flow.steps.length)}/{flow.steps.length}</span></div></>
              : <p>Flows specified in 03-ux-flows.md, mapped to the rail screens.</p>}</div>

          <div className="card"><h2>Invented components · 06</h2>
            {COMPS.length ? <ul className="complist">{COMPS.map((c, i) => <li key={i}><b>{c.name}</b> — {c.purpose}<ComponentDemo name={c.name} ar={ar} /></li>)}</ul>
              : <p>Shared primitives only (foundation) — see 06-component-needs.md.</p>}</div>

          <div className="card"><h2>Adapter explorer · 07b ({SPEC.ops.length} ops)</h2>
            <div className="row"><select value={opSel} onChange={e => setOpSel(e.target.value)} aria-label="Adapter operation">{SPEC.ops.map(o => <option key={o}>{o}</option>)}</select>
              <button className="primary" onClick={runOp} disabled={opBusy}>{opBusy ? '…' : 'Run via mock adapter'}</button></div>
            {jobState && <p className="hint">Job state: {jobState} · async-contract lifecycle applies</p>}
            {opResult && <pre className="result">{opResult}</pre>}
            <p className="hint">UI talks only to {SPEC.adapter}; mock is deterministic (07c).</p></div>

          <div className="card"><h2>Copy & states · 11</h2>
            {(['empty', 'loading', 'error', 'success'] as const).map(k => COPY[k]?.length ? <p key={k}><b>{k}:</b> {COPY[k][0]}</p> : null)}
            <p className="hint">Verbatim strings extracted from this product's 11-empty-loading-error.md where its matrix is tabular; otherwise foundation copy-voice defaults apply.</p></div>
        </section>
      </main>

      {confirmDel && <div className="overlay" role="dialog" aria-modal="true" aria-label="Confirm delete">
        <div className="palette"><h2>Delete {confirmDel}?</h2><p>This is irreversible in the mock store. It will be removed from {screen.name}.</p>
          <div className="row"><button onClick={() => setConfirmDel(null)}>Cancel</button><button className="danger" onClick={() => doDelete(confirmDel)}>Delete</button></div></div></div>}

      {palette && <div className="overlay" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette"><input autoFocus placeholder={ar ? 'ابحث في الشاشات…' : 'Search screens…'} value={query} onChange={e => setQuery(e.target.value)} />
          {filtered.map(s => <button key={s.id} onClick={() => { setScreenId(s.id); setPalette(false); }}>{s.id} · {s.name}</button>)}
        </div></div>}
    </div>
  );
}

function ComponentDemo({ name, ar }: { name: string; ar: boolean }) {
  const [on, setOn] = useState(false); const [val, setVal] = useState(50);
  if (/toggle|switch/i.test(name)) return <button className="demo" aria-pressed={on} onClick={() => setOn(v => !v)}>{name}: {on ? (ar ? 'مفعّل' : 'On') : (ar ? 'متوقف' : 'Off')}</button>;
  if (/dial|slider|gauge|meter/i.test(name)) return <label className="demo">{name} <input type="range" min={0} max={100} value={val} onChange={e => setVal(Number(e.target.value))} /> {val}</label>;
  return <button className="demo" onClick={() => setOn(v => !v)}>{name}{on ? ' — open ✓' : ''}</button>;
}

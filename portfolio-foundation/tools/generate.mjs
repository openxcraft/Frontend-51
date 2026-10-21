// Spec-driven generator: specs-source/<slug>/*.md -> apps/<slug>/ (React+TS+Vite)
// Re-runnable. Every generated file carries its spec source. No provider names are emitted.
import fs from 'node:fs'; import path from 'node:path';
const ROOT = path.resolve(process.cwd());
const SRC = path.join(ROOT, 'specs-source'); const APPS = path.join(ROOT, 'apps');
const read = (p) => fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
const esc = (s) => (s||'').replace(/\|/g,'/').replace(/\*\*/g,'').replace(/`/g,'').trim();

// --- identity ledger ---
const ledger = {};
for (const line of read(path.join(SRC,'_shared/design-language-map.md')).split('\n')) {
  const m = line.match(/^\d+\.\s+([\w-]+)\s*\|\s*"([^"]+)"[^|]*\|\s*(P\d+)\s*\|\s*([A-D])\s*\|\s*([\w-]+)\s*\|\s*([\w.-]+)\s*\|\s*(\w+)/);
  if (m) ledger[m[1]] = { colorName:m[2], pairing:m[3], radius:m[4], elevation:m[5], icon:m[6], motion:m[7] };
}
const PAIRINGS = {P01:['IBM Plex Sans Arabic','IBM Plex Sans'],P02:['Noto Kufi Arabic','Space Grotesk'],P03:['Noto Naskh Arabic','Newsreader'],P04:['Cairo','Sora'],P05:['Tajawal','Hanken Grotesk'],P06:['Almarai','Inter'],P07:['Readex Pro','DM Sans'],P08:['Amiri','Source Serif 4'],P09:['Reem Kufi','Fraunces'],P10:['El Messiri','Lora'],P11:['Changa','Archivo'],P12:['Harmattan','Work Sans'],P13:['Baloo Bhaijaan 2','Plus Jakarta Sans'],P14:['Rubik','Space Mono'],P15:['Mada','Instrument Sans'],P16:['Scheherazade New','Libre Caslon Text'],P17:['Noto Sans Arabic','Manrope'],P18:['Lalezar','Bebas Neue']};
const RADIUS = {A:'4px',B:'8px',C:'14px',D:'22px'};

function parseScreens(md){
  const out=[];
  for (const line of md.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').map(esc);
    // cells: ['', 'S1', 'Name', 'purpose', 'data', '']
    const idx = cells.findIndex(c=>/^[SM]\d+$/.test(c) || /^\d+$/.test(c) && cells.length>4);
    if (idx<0) continue;
    const name = cells[idx+1]; if(!name || /screen/i.test(name) && cells[idx+1].length<3) continue;
    if (/^[-: ]+$/.test(name) || name==='Screen') continue;
    out.push({ id: cells[idx], name, purpose: cells[idx+2]||'', shell: /applicant|mobile|review|desktop/i.test(cells[idx+1]+cells[idx+2]) ? cells[idx+1] : '', data: cells[idx+3]||cells[idx+2]||'' });
  }
  for (const line of md.split('\n')) {
    let m=line.match(/([A-Z][A-Za-z &]{2,30}) \((S\d+)-class/); if(m && !out.some(s=>s.id===m[2])) out.push({id:m[2],name:m[1].trim(),purpose:'Rail surface described in IA prose',data:''});
    m=line.match(/([A-Z][A-Za-z ]{2,30}?) is (S\d+)[:.]/); if(m && !out.some(s=>s.id===m[2])) out.push({id:m[2],name:m[1].trim(),purpose:'Surface described in IA prose',data:''});
  }
  // dedupe by id+name
  const seen=new Set(); return out.filter(s=>{const k=s.id+s.name; if(seen.has(k)||!s.name) return false; seen.add(k); return true;});
}
function parseFlows(md){
  const out=[];
  for (const line of md.split('\n')) { const m=line.match(/^#{2,3}\s+(.*(CP-?\d|Critical|Flow|Path).*)$/i); if(m) out.push(esc(m[1])); }
  return [...new Set(out)].slice(0,8);
}
function parseComponents(md){
  const out=[];
  for (const line of md.split('\n')) { if(!line.trim().startsWith('|')) continue; const cells=line.split('|').map(esc); const n=cells[1]; if(n && n.length>2 && !/component|[-: ]+/i.test(n) && !/shared/i.test(n)) out.push({name:n, purpose:cells[2]||'', obligations:cells[3]||''}); }
  return out.slice(0,10);
}
function tsBlocks(md){ return [...md.matchAll(/```(?:ts|typescript)\n([\s\S]*?)```/g)].map(m=>m[1]); }
function topNames(code){ return new Set([...code.matchAll(/export\s+(?:interface|type|enum|class|const)\s+(\w+)/g)].map(m=>m[1])); }
function splitTop(code){ // split into top-level export chunks by export keyword at col 0
  const parts=code.split(/(?=^export\s)/m).map(s=>s.trim()).filter(Boolean); return parts;
}
function parseContract(md, md07a){
  const blocks=tsBlocks(md); const code=blocks.join('\n');
  const ops=[...code.matchAll(/^\s{2}(\w+)\s*\(/gm)].map(m=>m[1]);
  const imported=new Set();
  for(const m of code.matchAll(/(?:import|export)\s+(?:type\s+)?\{([\s\S]*?)\}\s*from\s*'\.\/07a/g)) for(const n of m[1].split(',')) { const nm=n.trim().split(/\s+as\s+/)[0].trim(); if(nm) imported.add(nm); }
  const have=topNames(code); let supplement='';
  for(const chunk of splitTop(tsBlocks(md07a).join('\n'))){ const m=chunk.match(/export\s+(?:interface|type|enum|class|const)\s+(\w+)/); if(m && !have.has(m[1]) && !imported.has(m[1])){ supplement+=chunk+'\n'; have.add(m[1]); } }
  return { code, supplement, imported, ops:[...new Set(ops)] };
}

function parseEntities(md07a, md07b){
  const SKIP = new Set(['Session','Page','Result','AdapterError','Job','CursorQuery','StreamSink','StreamEvent']);
  const out=[]; const seen=new Set();
  for (const code of [tsBlocks(md07a).join('\n'), tsBlocks(md07b).join('\n')]) {
    for (const m of code.matchAll(/export interface (\w+) \{([\s\S]*?)\n\}/g)) {
      const name=m[1]; if (SKIP.has(name) || seen.has(name) || /AdapterV\d|Filter|Query|Input|Patch$|Request|Response|Brief|Handle|Report$|Policy$|Settings|View$|Ref$/.test(name)) continue;
      const fields=[];
      for (const line of m[2].split('\n')) { const f=line.replace(/\/\/.*$/,'').trim().match(/^(\w+)(\?)?:\s*(.+?);?$/); if (f && !/^\*/.test(line.trim())) fields.push({name:f[1], optional:!!f[2], type:f[3].replace(/;$/,'').trim()}); }
      if (fields.length>=2) { seen.add(name); out.push({name, fields:fields.slice(0,12)}); }
      if (out.length>=10) return out;
    }
  }
  return out;
}
function parseFlowsV2(md){
  const out=[]; let cur=null;
  for (const line of md.split('\n')) {
    const h=line.match(/^#{2,3}\s+(.*)$/);
    if (h) { if (cur && cur.steps.length>=2) out.push(cur); cur = /(CP-?\d|Critical|Flow|Path)/i.test(h[1]) ? {title:esc(h[1]), steps:[]} : null; continue; }
    if (cur) { const s=line.trim().match(/^(?:\d+[.)]|[-*]|→|->)\s*(.+)$/); if (s) { const txt=esc(s[1]); if (txt.length>3 && txt.length<160) cur.steps.push(txt); } }
  }
  if (cur && cur.steps.length>=2) out.push(cur);
  return out.slice(0,6).map(f=>({...f, steps:f.steps.slice(0,9)}));
}
function parseCopy(md){
  const buckets={empty:[],loading:[],error:[],success:[]}; let bucket=null;
  for (const line of md.split('\n')) {
    const low=line.toLowerCase();
    if (/^#{1,3}\s/.test(line)) bucket = /empty/.test(low)?'empty':/load|skeleton/.test(low)?'loading':/error|fail/.test(low)?'error':/success|done|complete/.test(low)?'success':bucket;
    if (!bucket || !line.trim().startsWith('|')) continue;
    for (const cell of line.split('|').map(esc)) if (cell.length>=8 && cell.length<=130 && /[A-Za-z\u0600-\u06FF]/.test(cell) && !/state|copy|string/i.test(cell)) { if (buckets[bucket].length<5 && !buckets[bucket].includes(cell)) buckets[bucket].push(cell); }
  }
  return buckets;
}
// Implementation corrections for the 10 spec defects in SPEC_DEFECTS.md.
// specs-source is NEVER touched; corrections apply only to generated code and are counted in the file header.
const CORRECTIONS = {
  'arabic-copy-studio': { append: "export interface BrandKit { id: string; workspaceId: string; voiceTraits: string[]; sampleCopy: string[]; bannedTerms: string[]; registerHint?: string; } // SPEC_DEFECTS A: defined from 07a prose fields" },
  'brand-voice-guardian': { append: "export interface TermInput { termAr?: string; termEn?: string; definition?: string; doNotUse?: string[]; conflictGroup?: string | null; } export interface BannedInput { term: string; severity?: string; note?: string; } // SPEC_DEFECTS A: from 07a prose (GlossaryTerm/BannedTerm)" },
  'caption-lab': { append: "export interface ProjectSummary { id: string; workspaceId?: string; title: string; mediaRef?: string; duration?: number; status: string; updatedAt?: string; } // SPEC_DEFECTS A: from 07a prose (Project)" },
  'clinic-appointment-desk': { replace: [["export interface ClinicSettingsPatch {  /* mirrors the 07a policy sub-shapes for patching */ }", "export interface ClinicSettingsPatch { reminderLadder?: ReminderLadderPolicy; noShow?: NoShowPolicy; waitlist?: WaitlistPolicy; messageTemplates?: ClinicSettings['messageTemplates']; } // SPEC_DEFECTS D: fields mirrored from ClinicSettings (07a)"]] },
  'khatt-type-playground': { replace: [["export type Result<T> = { ok: true; data: T } | { ok: false; error: AdapterError };", "export type Result<T, E extends AdapterError = AdapterError> = { ok: true; data: T } | { ok: false; error: E }; // SPEC_DEFECTS D: two-arg form used by adapter methods"]] },
  'op-ed-desk': { replace: [["export interface Job {\n  id: string; kind: 'lint-deterministic' | 'lint-full';", "export interface Job<T = unknown> { result?: T; partial?: T; error?: AdapterError; // SPEC_DEFECTS D: generic form used by adapter methods\n  id: string; kind: 'lint-deterministic' | 'lint-full';"], ["Result<Page<Job<{ reportId: string }>, AdapterError>>>;", "Result<Page<Job<{ reportId: string }>>, AdapterError>>; // SPEC_DEFECTS B: missing > in spec"], ["lastActivityAt: string }, AdapterError>>>;", "lastActivityAt: string }>, AdapterError>>; // SPEC_DEFECTS B: Page<T> closed inside Result in spec"]] },
  'invoice-generator-desk': { replace: [["    targetRef: string; detail?: string; at: string;\n  }, AdapterError>>;", "    targetRef: string; detail?: string; at: string;\n  }>, AdapterError>>; // SPEC_DEFECTS B: Page<T> closed inside Result in spec"], ["getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }>, AdapterError>>;", "getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>; // SPEC_DEFECTS B: stray > after inline object in spec"]] },
  'shipping-rate-comparator': { replace: [["    targetRef: string; detail?: string; at: string;\n  }, AdapterError>>;", "    targetRef: string; detail?: string; at: string;\n  }>, AdapterError>>; // SPEC_DEFECTS B: Page<T> closed inside Result in spec"]] },
  'social-clip-cutter': { append: "export interface Job<T> { id: string; kind: string; state: 'queued'|'running'|'awaiting-input'|'succeeded'|'failed'|'cancelled'|'expired'; progress: { determinate: boolean; done?: number; total?: number }; partial?: T; result?: T; error?: AdapterError; } // SPEC_DEFECTS C: foundation Job shape (async-contract)" },
};
function applyCorrections(slug, code){
  const c = CORRECTIONS[slug] || {};
  let applied = 0;
  for (const [f, r] of (c.replace || [])) { if (code.includes(f)) { code = code.split(f).join(r); applied++; } else console.log('CORRECTION-MISS', slug, f.slice(0, 60)); }
  for (const [pat, r] of (c.regex || [])) { const re = new RegExp(pat, 'g'); const before = code; code = code.replace(re, r); if (code !== before) applied++; else console.log('CORRECTION-MISS', slug, pat); }
  // podcast/social-clip class C: re-export -> also import locally (names used in-file)
  if (slug === 'podcast-publish-kit' || slug === 'social-clip-cutter') {
    code = code.replace(/(export type \{([\s\S]*?)\} from '\.\/07a-data-contract';)/g, (m, whole, names) => { applied++; return "import type {" + names + "} from './07a-data-contract'; // SPEC_DEFECTS C: local import (re-export alone brings no names into scope)\n" + whole; });
  }
  if (c.append) { code += "\n// ===== Implementation correction (SPEC_DEFECTS.md) =====\n" + c.append + "\n"; applied++; }
  return { code, applied };
}

function archetype(screen, family){
  const t=(screen.name+' '+screen.purpose).toLowerCase();
  if (/calendar|schedule|planner|grid shift/.test(t)) return 'calendar-grid';
  if (/editor|studio|composer|builder|playground|canvas|weave|grid|workspace —|workspace -/.test(t)) return 'editor-studio';
  if (/dashboard|analytics|cohort|funnel|scorecard|spend|insight|explorer|compare/.test(t)) return 'dashboard-analytics';
  if (/board|cascade|campaign|pipeline|kanban/.test(t)) return 'board';
  if (/entry|step|intake|capture|claim|onboard|wizard|setup|form/.test(t)) return 'wizard-flow';
  if (/queue|review|triage|approval|ledger|history|log|desk|inbox/.test(t)) return 'review-queue';
  if (/job|export|queue/.test(t)) return 'jobs-centre';
  if (/setting|admin|profile|policy|template|presets|library|glossary|brand kit|register/.test(t)) return 'settings-admin';
  if (family==='analytics') return 'dashboard-analytics';
  return 'list-console';
}

const slugs = fs.readdirSync(SRC).filter(d=>fs.statSync(path.join(SRC,d)).isDirectory() && !d.startsWith('_'));
let summary=[];
for (const slug of slugs) {
  const dir=path.join(SRC,slug), app=path.join(APPS,slug);
  const manifest=JSON.parse(read(path.join(dir,'manifest.json')));
  const ia=read(path.join(dir,'04-information-arch.md'));
  let screens=parseScreens(ia); if(screens.length===0) screens=[{id:'S1',name:'Home',purpose:esc(read(path.join(dir,'00-brief.md')).split('\n').find(l=>l.trim().length>20)||''),data:''}];
  screens=screens.map(s=>({...s, archetype:archetype(s,manifest.family)}));
  const flows=parseFlowsV2(read(path.join(dir,'03-ux-flows.md'))); const entities=parseEntities(read(path.join(dir,'07a-data-contract.md')), read(path.join(dir,'07b-adapter-contract.md'))); const copy=parseCopy(read(path.join(dir,'11-empty-loading-error.md')));
  const comps=parseComponents(read(path.join(dir,'06-component-needs.md')));
  const {code,supplement,imported,ops}=parseContract(read(path.join(dir,'07b-adapter-contract.md')), read(path.join(dir,'07a-data-contract.md')));
  const id05=read(path.join(dir,'05-identity.md'));
  const hexes=[...new Set([...id05.matchAll(/#[0-9A-Fa-f]{6}\b/g)].map(m=>m[0]))];
  const L=ledger[slug]||{colorName:'Primary',pairing:'P06',radius:'B',elevation:'soft-lift',icon:'line-2',motion:'crisp'};
  const fonts=PAIRINGS[L.pairing]||PAIRINGS.P06;
  const brief=read(path.join(dir,'00-brief.md'));
  const title=slug.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
  const spec={slug,title,family:manifest.family,tier:manifest.tier,flagship:!!manifest.flagship,adapter:manifest.adapter_contract,direction:manifest.direction_default,identity:{...L,fonts,primary:hexes[0]||'#243b53',accent:hexes[1]||hexes[0]||'#b7791f',canvas:hexes[2]||'#f7f5f0',radius:RADIUS[L.radius]},screens,flows,components:comps,ops,entities,copy,briefLine:esc(brief.split('\n').filter(l=>l.trim().length>40)[2]||'')};
  fs.mkdirSync(path.join(app,'src/adapter'),{recursive:true});
  fs.writeFileSync(path.join(app,'src/spec.ts'), `// GENERATED from specs-source/${slug}/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.\nexport const SPEC = ${JSON.stringify(spec,null,1)} as const;\nexport type Spec = typeof SPEC;\n`);
  const corr = applyCorrections(slug, code + (supplement ? '\n// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====\n' + supplement : ''));
  fs.writeFileSync(path.join(app,'src/adapter/contract.ts'), `// VERBATIM from specs-source/${slug}/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.${corr.applied ? ` Implementation corrections applied: ${corr.applied} (see portfolio SPEC_DEFECTS.md; specs-source untouched).` : ''}\n// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.\n${corr.code}\n`);
  if (imported.size || code.includes("from './07a") || code.includes("import('./07a')") || code.includes('import("./07a")')) {
    const chunks07a = splitTop(tsBlocks(read(path.join(dir,'07a-data-contract.md'))).join('\n')); const seen07a=new Set(); let mod07a='';
    for (const ch of chunks07a) { const mm=ch.match(/export\s+(?:interface|type|enum|class|const)\s+(\w+)/); if (mm) { if (seen07a.has(mm[1])) continue; seen07a.add(mm[1]); } mod07a+=ch+'\n'; }
    fs.writeFileSync(path.join(app,'src/adapter/07a-data-contract.ts'), `// Verbatim TS blocks from specs-source/${slug}/07a-data-contract.md — 07b imports this module by name.\n${/AdapterError/.test(mod07a) && !/(interface|type) AdapterError/.test(mod07a) ? "import type { AdapterError } from './contract'; // SPEC_DEFECTS C: 07a references the foundation error type defined in 07b\n" : ''}${mod07a}`);
    fs.writeFileSync(path.join(app,'src/adapter/07a.ts'), `export * from './07a-data-contract';\n`);
  }
  // mock.ts is supplied by tools/template/mock.ts (copied post-generation, like App.tsx)
  fs.writeFileSync(path.join(app,'package.json'), JSON.stringify({name:slug,private:true,version:'1.0.0',type:'module',scripts:{dev:'vite',build:'tsc --noEmit && vite build','build:fast':'vite build',preview:'vite preview'},dependencies:{react:'^18.3.1','react-dom':'^18.3.1'},devDependencies:{vite:'^5.4.0','@vitejs/plugin-react':'^4.3.0',typescript:'^5.5.0','@types/react':'^18.3.0','@types/react-dom':'^18.3.0'}},null,1)+'\n');
  fs.writeFileSync(path.join(app,'.gitignore'), 'node_modules/\ndist/\n');
  fs.writeFileSync(path.join(app,'vite.config.ts'), `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins:[react()], build:{ outDir:'dist' } });\n`);
  fs.writeFileSync(path.join(app,'tsconfig.json'), JSON.stringify({compilerOptions:{target:'ES2022',jsx:'react-jsx',module:'ESNext',moduleResolution:'bundler',strict:false,skipLibCheck:true,noEmit:true},include:['src']},null,1)+'\n');
  const fontQ=[...fonts].map(f=>`family=${f.replace(/ /g,'+')}:wght@400;500;700`).join('&');
  fs.writeFileSync(path.join(app,'index.html'), `<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?${fontQ}&display=swap" rel="stylesheet"></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n`);
  // mock.ts is supplied by tools/template/mock.ts (copied post-generation, like App.tsx)
  const customPath = path.join(app,'src/custom.tsx');
  if (!fs.existsSync(customPath)) fs.writeFileSync(customPath, "// Hand-finished signature screens for this product (Phase 2). Keyed by screen id from spec.ts.\n// The generator never overwrites this file.\nimport React from 'react';\nexport const CUSTOM_SCREENS: Record<string, React.FC<{ ar: boolean }>> = {};\n");
  summary.push({slug,screens:screens.length,ops:ops.length,components:comps.length,flows:flows.length});
}
fs.writeFileSync(path.join(ROOT,'GENERATION.json'),JSON.stringify(summary,null,1));
console.log('generated',summary.length,'apps · screens',summary.reduce((a,s)=>a+s.screens,0),'· ops',summary.reduce((a,s)=>a+s.ops,0));
for(const s of summary) if(s.ops===0||s.screens===0) console.log('WARN',s);

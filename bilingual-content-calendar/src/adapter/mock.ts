// Deterministic mock adapter per 07c-mock-adapter.md: seeded by slug+entity, resettable.
// Implements every operation named in the 07b contract (SPEC.ops) with contract-shaped
// Result values fabricated from the product's own 07a entities. No network, no providers.
import { SPEC } from '../spec';

type Ent = { name: string; fields: Array<{ name: string; optional?: boolean; type: string }> };
const ENTITIES = (SPEC as any).entities as Ent[];
const OPS = (SPEC as any).ops as string[];

function hash(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); }
function prand(key: string): number { return (hash(key) % 10000) / 10000; }

const AR_WORDS = ['مسودة', 'مراجعة', 'اعتماد', 'نشر', 'أرشيف', 'تحليل', 'خطة', 'تقرير'];
export function sampleValue(entity: string, field: { name: string; type: string }, i: number): any {
  const t = field.type, n = field.name, r = prand(entity + ':' + n + ':' + i);
  if (/string\[\]|string \|/.test(t) && /\[\]/.test(t)) return [sampleValue(entity, { name: n, type: 'string' }, i)];
  if (/'[^']*'(\s*\|\s*'[^']*')+/.test(t)) { const opts = [...t.matchAll(/'([^']*)'/g)].map(m => m[1]); return opts[Math.floor(r * opts.length)] || opts[0]; }
  if (/boolean/.test(t)) return r > 0.45;
  if (/number/.test(t)) return Math.round(r * 1000) / 10;
  if (/Date|string/.test(t)) {
    if (/id$/i.test(n) || n === 'id') return entity.toLowerCase() + '-' + (100 + i);
    if (/at$|date/i.test(n)) return '2026-10-' + String(10 + (i % 18)).padStart(2, '0') + 'T09:30:00Z';
    if (/ar$|arabic/i.test(n)) return AR_WORDS[Math.floor(r * AR_WORDS.length)] + ' ' + (i + 1);
    if (/email/i.test(n)) return 'user' + i + '@example.test';
    if (/url|ref/i.test(n)) return 'ref://' + entity.toLowerCase() + '/' + (100 + i);
    if (/title|name/i.test(n)) return entity + ' ' + (i + 1) + ' — ' + AR_WORDS[Math.floor(r * AR_WORDS.length)];
    return entity + ' ' + n + ' ' + (i + 1);
  }
  if (/\[\]/.test(t)) return [];
  if (/\{/.test(t)) return {};
  return entity + ' ' + (i + 1);
}
export function makeRecord(entity: Ent, i: number): Record<string, any> {
  const rec: Record<string, any> = {};
  for (const f of entity.fields) rec[f.name] = sampleValue(entity.name, f, i);
  if (!('id' in rec)) rec.id = entity.name.toLowerCase() + '-' + (100 + i);
  return rec;
}
export function recordsFor(entityName: string, count = 6): Record<string, any>[] {
  const e = ENTITIES.find(x => x.name === entityName) || ENTITIES[0];
  if (!e) return [];
  return Array.from({ length: count }, (_, i) => makeRecord(e, i + 1));
}
export function guessEntity(op: string): Ent | undefined {
  const stem = op.replace(/^(list|get|create|add|update|delete|remove|upsert|save|start|submit|import|export|run|fetch)/, '');
  return ENTITIES.find(e => e.name.toLowerCase() === stem.toLowerCase().replace(/s$/, ''))
    || ENTITIES.find(e => stem.toLowerCase().startsWith(e.name.toLowerCase()))
    || ENTITIES.find(e => e.name.toLowerCase().startsWith(stem.toLowerCase().replace(/s$/, '')))
    || ENTITIES[0];
}

let jobSeq = 0;
export async function callOp(op: string, args: any[] = []): Promise<any> {
  await new Promise(r => setTimeout(r, 60 + prand(op) * 120));
  const ent = guessEntity(op);
  if (/^getSession/.test(op)) return { ok: true, data: { memberId: 'member-1', workspaceId: 'ws-demo', locale: 'ar', role: 'owner' } };
  if (/^(getUsage|getQuota)/.test(op)) return { ok: true, data: { used: 320, limit: 1000, windowResetAt: '2026-11-01T00:00:00Z' } };
  if (/^listJobs/.test(op)) return { ok: true, data: { items: [{ id: 'job-1', kind: 'export', state: 'succeeded', progress: { determinate: true, done: 12, total: 12 } }], nextCursor: null, hasMore: false } };
  if (/^(getJob|retryJob)/.test(op)) return { ok: true, data: { id: 'job-1', kind: 'export', state: 'succeeded', progress: { determinate: true, done: 12, total: 12 } } };
  if (/^cancelJob/.test(op)) return { ok: true, data: { cancelled: true } };
  if (/^(start|import|export|run|transform|align|generate)/.test(op) && /Job|Generation|Transform|Import|Export/.test(op + (ent?.name || '')) || /^(start|import)/.test(op)) {
    jobSeq++; return { ok: true, data: { id: 'job-' + (100 + jobSeq), kind: op, state: 'running', progress: { determinate: true, done: 3, total: 12 } } };
  }
  if (/^list/.test(op) && ent) return { ok: true, data: { items: recordsFor(ent.name, 6), nextCursor: null, hasMore: false } };
  if (/^(delete|remove|void|archive|resolve|accept|approve|reject|submit|publish|lock|activate|deactivate)/.test(op)) return { ok: true, data: { id: String(args[0] || ent?.name.toLowerCase() + '-100'), applied: true } };
  if (/^(create|add|upsert|save)/.test(op) && ent) return { ok: true, data: { ...makeRecord(ent, 1), ...(typeof args[0] === 'object' ? args[0] : {}) } };
  if (/^update/.test(op) && ent) return { ok: true, data: { ...makeRecord(ent, 1), ...(typeof args[1] === 'object' ? args[1] : {}) } };
  if (/^get/.test(op) && ent) return { ok: true, data: makeRecord(ent, 1) };
  return { ok: true, data: { op, acknowledged: true } };
}

export const mockAdapter: Record<string, (...a: any[]) => Promise<any>> =
  Object.fromEntries(OPS.map(op => [op, (...a: any[]) => callOp(op, a)]));
export function resetMock(): void { jobSeq = 0; }

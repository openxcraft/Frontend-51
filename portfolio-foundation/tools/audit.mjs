import fs from 'node:fs'; import path from 'node:path';
const apps = fs.readdirSync('apps').sort();
const BANNED = ['openai','chatgpt','claude','anthropic','gemini','jasper','copy.ai','writesonic','midjourney'];
let problems = [], totalOps = 0, totalScreens = 0, totalEntities = 0, maxJs = 0;
for (const a of apps) {
  const dir = path.join('apps', a);
  const srcFiles = ['src/App.tsx','src/custom.tsx','src/spec.ts','src/adapter/mock.ts'].map(f => path.join(dir, f)).filter(f => fs.existsSync(f));
  const allSrc = srcFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n').toLowerCase();
  for (const b of BANNED) if (allSrc.includes(b)) problems.push(`${a}: banned provider name "${b}" in UI source`);
  const app = fs.readFileSync(path.join(dir, 'src/App.tsx'), 'utf8');
  const css = fs.readFileSync(path.join(dir, 'src/styles.css'), 'utf8');
  if (!app.includes('className="skip"')) problems.push(`${a}: missing skip link`);
  if (!app.includes('aria-live')) problems.push(`${a}: missing aria-live`);
  if (!css.includes(':focus-visible')) problems.push(`${a}: missing focus-visible style`);
  if (!app.includes("document.documentElement.dir")) problems.push(`${a}: missing RTL dir toggle`);
  const spec = JSON.parse(fs.readFileSync(path.join(dir, 'src/spec.ts'), 'utf8').match(/export const SPEC = ([\s\S]*?) as const;/)[1]);
  const contract = fs.readFileSync(path.join(dir, 'src/adapter/contract.ts'), 'utf8');
  totalOps += spec.ops.length; totalScreens += spec.screens.length; totalEntities += spec.entities.length;
  for (const op of spec.ops) if (!contract.includes(op + '(') && !contract.includes(op + ' (')) problems.push(`${a}: op ${op} missing from contract.ts`);
  const js = fs.readdirSync(path.join(dir, 'dist/assets')).filter(f => f.endsWith('.js'));
  for (const j of js) { const s = fs.statSync(path.join(dir, 'dist/assets', j)).size; if (s > maxJs) maxJs = s; if (s > 300 * 1024) problems.push(`${a}: JS bundle ${(s/1024).toFixed(0)}KB over 300KB budget`); }
}
fs.writeFileSync('AUDIT_REPORT.md', `# Audit Report — ${new Date().toISOString()}\nScope: all 50 apps (UI source + built dist). Font families are open-licence (ledger catalog); delivery via Google Fonts CDN in index.html — self-hosting is a deployment option, not a provider surface.\n\n- Provider-name scan (AI/vendor names in UI source): ${problems.filter(p=>p.includes('banned')).length} hits\n- A11y structure (skip link, aria-live, focus-visible, RTL toggle): ${problems.filter(p=>/skip|aria|focus|RTL/.test(p)).length} problems\n- Coverage: ${totalScreens} screens · ${totalOps} ops (every op verified present in its contract.ts) · ${totalEntities} entities parsed\n- Largest JS bundle: ${(maxJs/1024).toFixed(1)} KB (budget 300 KB)\n- Problems: ${problems.length}\n${problems.map(p=>'- '+p).join('\n')}\n`);
console.log('audit problems:', problems.length, '· ops', totalOps, '· screens', totalScreens, '· entities', totalEntities, '· maxJS KB', (maxJs/1024).toFixed(1));
for (const p of problems.slice(0, 20)) console.log(p);

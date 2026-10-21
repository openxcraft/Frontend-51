import { execSync } from 'node:child_process';
import fs from 'node:fs';
const apps = fs.readdirSync('apps').sort();
const pass = []; const fail = [];
for (const a of apps) {
  try { execSync('npx tsc --noEmit -p apps/' + a + '/tsconfig.json', { stdio: 'pipe' }); pass.push(a); }
  catch (e) { const out = String(e.stdout || ''); const missing = [...new Set([...out.matchAll(/Cannot find name .(\w+)./g)].map(m => m[1]))]; fail.push({ a, missing, first: out.split(String.fromCharCode(10))[0] || '' }); }
}
fs.writeFileSync('TYPECHECK_REPORT.md', '# Typecheck Report\nPASS ' + pass.length + '/50: ' + pass.join(', ') + '\n\nFAIL ' + fail.length + '/50:\n' + fail.map(f => '- ' + f.a + ': missing=[' + f.missing.join(', ') + '] ' + f.first).join('\n') + '\n');
console.log('tsc pass', pass.length, 'fail', fail.length);
for (const f of fail) console.log(f.a, '::', f.missing.join(','));

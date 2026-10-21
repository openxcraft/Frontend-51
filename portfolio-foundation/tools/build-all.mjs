import { execSync } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path';
const only = process.argv[2]; const apps = fs.readdirSync('apps').filter(a=>!only||a===only).sort();
let pass=0, fail=[]; const rows=[];
for (const a of apps) { const t=Date.now(); try { execSync('npx vite build',{cwd:path.join('apps',a),stdio:'pipe'}); const dist=path.join('apps',a,'dist'); const size=fs.readdirSync(dist,{recursive:true}).reduce((s,f)=>{try{return s+fs.statSync(path.join(dist,f)).size}catch{return s}},0); pass++; rows.push(`| ${a} | PASS | ${(size/1024).toFixed(1)} KB | ${Date.now()-t} ms |`);} catch(e){ fail.push(a); rows.push(`| ${a} | FAIL | — | ${String(e.stdout||e.message).slice(0,200).replace(/\n/g,' ')} |`);} console.log(a, fail.includes(a)?'FAIL':'PASS'); }
fs.writeFileSync('BUILD_REPORT.md', `# Build Report — ${new Date().toISOString()}\n${pass}/${apps.length} PASS · failed: ${fail.join(', ')||'none'}\n\n| app | result | dist | detail |\n|---|---|---|---|\n${rows.join('\n')}\n`);
console.log(`DONE ${pass}/${apps.length}`); if(fail.length) process.exitCode=1;

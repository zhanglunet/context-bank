import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {installCommand,validateGuides} from '../site/practice-tools.mjs';
const catalog=JSON.parse(await readFile('dist/catalog.json','utf8'));
const guides=JSON.parse(await readFile('dist/paths.json','utf8'));
validateGuides(guides,catalog);
assert.equal(catalog.length,49);assert.equal(guides.length,6);
const skills=catalog.filter(x=>x.type==='Skill');assert.equal(skills.length,34);
for(const x of skills){assert.ok(x.installation);for(const a of ['codex','claude-code','cursor'])assert.match(installCommand(x.installation,a),/\/tree\/[a-f0-9]{40} --skill [a-z0-9-]+ --agent /);assert.ok(x.installation.dependencies.length);assert.ok(x.startPrompt);const md=await readFile('dist/downloads/'+x.id+'.md','utf8');assert.ok(md.includes(x.copy));}
for(const g of guides){assert.ok((await readFile('dist/downloads/guide-'+g.id+'.md','utf8')).includes(g.prompt));await readFile('dist/path/'+g.id+'/index.html');}
const verified=catalog.filter(x=>x.evidence.length);assert.deepEqual(verified.map(x=>x.id).sort(),['livepowers-outcome-ledger','source-ledger','table-check']);
const weekly=await readFile('dist/evidence/2026-10-18/weekly-report.md','utf8');for(const source of ['S1','S2','S3','S4'])assert.ok(weekly.includes(source));
const table=await readFile('dist/evidence/2026-10-18/table-check.md','utf8');for(const field of ['A002','CNY','USD','空值','重复'])assert.ok(table.includes(field));assert.ok(!table.includes('350'));
const outcome=await readFile('dist/evidence/2026-10-18/outcome-report.md','utf8');assert.ok(outcome.includes('验收任务平均成本 = 15.00'));assert.ok(outcome.includes('rework 3.00'));
console.log('Verified: six task guides partition all 49 methods; 34 pinned installation entries; three scoped synthetic execution receipts and artifacts.');

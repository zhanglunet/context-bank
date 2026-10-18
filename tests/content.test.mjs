import test from 'node:test';
import assert from 'node:assert/strict';
import {validate,parseDocument,safePath} from '../scripts/content.mjs';
const good={schema_version:1,id:'sample',type:'note',title:'Title',summary:'Summary',scenarios:['写报告'],author:'zhanglunet',license:'CC-BY-4.0',compatibility:[{tool:'文本AI',verification:'unverified'}]};
test('valid content and frontmatter',()=>{assert.equal(validate(good,'## 输入\n示例').id,'sample');assert.equal(parseDocument('---\n'+JSON.stringify(good)+'\n---\nhello').body,'hello');});
test('reject traversal, unsafe URLs, scripts and credentials',()=>{assert.throws(()=>safePath('../secret'));assert.throws(()=>safePath('https://x'));assert.throws(()=>validate({...good,source_url:'javascript:alert(1)'},'text'));assert.throws(()=>validate(good,'<script>alert(1)</script>'));assert.throws(()=>validate(good,'ghp_'+'A'.repeat(36)));});
test('reject incomplete and fake verification',()=>{assert.throws(()=>validate({...good,title:''},'x'));assert.throws(()=>validate({...good,compatibility:[{tool:'AI',verification:'verified'}]},'x'));});
test('slug rejects punctuation and empty scenario list',()=>{assert.throws(()=>validate({...good,id:'../x'},'x'));assert.throws(()=>validate({...good,scenarios:[]},'x'));});
test('skills require standard agent frontmatter',()=>{assert.throws(()=>validate({...good,type:'skill'},'x'));assert.equal(validate({...good,type:'skill',name:'sample',description:'Sample skill'},'x').type,'skill');});

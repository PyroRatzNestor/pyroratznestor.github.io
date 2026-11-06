const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const original = JSON.parse(html.split('\n').find(line => line.startsWith('const PARTS=')).slice(12, -1));
const catalog = html.slice(
  html.indexOf('/* ---------- filtration catalog references ---------- */'),
  html.indexOf('const pHost=')
);
function enrich(parts) {
  return vm.runInNewContext(`(function(){
    ${catalog}
    return {parts: PARTS, category: FILTER_CATEGORY, directory: BERMAD_DIRECTORY};
  })()`, { PARTS: parts });
}
const { parts, category, directory } = enrich(structuredClone(original));
const key = r => [r.m, r.o, r.t, r.p].join('|');
const find = (m, o) => {
  const record = parts.find(r => r.m === m && r.o === o);
  assert.ok(record, `Missing ${m} ${o}`);
  return record;
};
const facts = r => r.facts.join(' ');

test('all inline application JavaScript parses', () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length);
  scripts.forEach(([, script]) => new vm.Script(script));
});

test('catalog enrichment preserves every workbook identity and direct spec link', () => {
  for (const before of original) {
    const after = parts.find(r => key(r) === key(before));
    assert.ok(after, key(before));
    assert.equal(after.s, before.s, key(before));
    assert.equal(after.p, before.p, key(before));
    if (!['Amiad', 'Netafim', 'Bermad'].includes(before.m)) {
      assert.deepEqual(after, before);
    }
  }
});

test('records are unique and repeat enrichment does not duplicate entries', () => {
  assert.equal(new Set(parts.map(key)).size, parts.length);
  const again = enrich(structuredClone(parts)).parts;
  assert.equal(again.length, parts.length);
  assert.equal(JSON.stringify(again), JSON.stringify(parts));
});

test('catalog references have facts and real source editions, never upload years', () => {
  const referenced = parts.filter(r => r.source && /; (PDF|printed) pp\./.test(r.source));
  assert.ok(referenced.length >= 100);
  for (const r of referenced) {
    assert.equal(r.c, category);
    assert.ok(r.facts.length > 0, key(r));
    assert.match(r.source, r.m === 'Amiad' ? /01\.2021; PDF pp\. \d/ : /2025 v5\.0; printed pp\. \d/);
    assert.doesNotMatch(r.source, /2026/);
    assert.equal(r.s, '', 'Do not manufacture direct PDF links');
  }
});

test('Amiad overview keeps family ceilings distinct from model ratings', () => {
  assert.match(facts(find('Amiad', 'SAF')), /400 m3\/h.*1,760 GPM/);
  assert.match(facts(find('Amiad', 'ABF')), /200-3,500 microns/);
  assert.match(facts(find('Amiad', 'Spin Klin Compact')), /15 m3\/h \(66 GPM\)/);
  assert.match(facts(find('Amiad', 'AGF')), /70 m3\/h.*per unit/);
  assert.match(facts(find('Amiad', 'SAF')), /does not specify operating pressure/);
  assert.equal(find('Amiad', 'ADI-P').t, 'Filter Controller');
});

test('SandStorm preserves tank, chamber, media and pressure distinctions', () => {
  const nc = facts(find('Netafim', 'SandStorm NC 36-inch'));
  assert.match(nc, /45 m3\/h per tank/);
  assert.match(nc, /6 bar \(87 psi\)/);
  assert.match(nc, /35 m3\/h with Basalt.*19 m3\/h with Silica/);
  const steel = facts(find('Netafim', 'SandStorm Double Chamber 36-inch'));
  assert.match(steel, /8 or 10 bar/);
  assert.match(steel, /50 m3\/h with Basalt.*28 m3\/h with Silica/);
});

test('AlphaDisc distinguishes per-unit capacity and cleaning quantities', () => {
  const r = facts(find('Netafim', 'AlphaDisc Trio XL 8-inch'));
  assert.match(r, /110 m3\/h PER FILTER UNIT/);
  assert.match(r, /15720 cm2/);
  assert.match(r, /1\.5 bar.*13 m3\/h.*65 L.*18 seconds/);
  assert.match(r, /above 7 bar is not recommended/);
});

test('known source pressure conflicts are explicit rather than silently resolved', () => {
  const spin = facts(find('Netafim', 'SpinKlin 2-inch'));
  assert.match(spin, /SOURCE CONFLICT.*p\. 29.*10 bar.*p\. 30.*1\.5 bar.*2\.8 bar/);
  assert.match(spin, /No pressure recommendation/);
  for (const model of ['ScreenGuard Semi-auto Polymer In-line', 'ScreenGuard Manual Polymer']) {
    assert.match(facts(find('Netafim', model)), /SOURCE CONFLICT.*10 bar.*PN8.*unresolved/);
  }
});

test('ScreenGuard orientation and mini housing ratings are not conflated', () => {
  const vertical = facts(find('Netafim', 'ScreenGuard Auto Vertical 4-inch'));
  const horizontal = facts(find('Netafim', 'ScreenGuard Auto Horizontal 4-inch'));
  assert.match(vertical, /75 m3\/h.*2000 cm2/);
  assert.match(vertical, /backwash 2 bar.*18 m3\/h/);
  assert.match(horizontal, /80 m3\/h.*5300 cm2/);
  assert.match(horizontal, /backwash 2 bar.*24 m3\/h/);
  assert.match(facts(find('Netafim', 'ScreenGuard Manual Polymer Mini 2-inch')), /8 bar.*16 m3\/h/);
});

test('pre-pump cleaning supply is not a housing rating', () => {
  const r = find('Netafim', 'ScreenGuard PPS16F');
  assert.equal(r.t, 'Strainer');
  assert.match(facts(r), /1400 m3\/h.*1\.5 m3\/h at 1\.5 bar/);
  assert.match(facts(r), /not a housing pressure rating/);
});

test('CentriForce retains minimum separation flow as well as maximum flow', () => {
  const r = find('Netafim', 'CentriForce 4-inch Super');
  assert.equal(r.t, 'Sand Separator');
  assert.match(facts(r), /59-95 m3\/h.*2-5 m/);
  assert.match(facts(r), /downstream filtration may still be required/);
});

test('unverified workbook names and BERMAD specs remain explicitly pending', () => {
  for (const r of parts.filter(r => r.m === 'Bermad' && r.c === category)) {
    assert.match(r.source, /pending.*no sheets downloaded/);
    assert.match(facts(r), /Legacy lookup entry only/);
    assert.equal(r.directory, directory);
    assert.equal(r.s, '');
  }
  assert.match(find('Amiad', 'FAM').source, /not verified/);
  assert.match(find('Netafim', 'Disc-Kleen').source, /not verified/);
  assert.match(find('Netafim', 'Hydraulic').source, /not verified/);
});

test('new service checklist is appended without shifting saved checklist indices', () => {
  const start = html.indexOf('const lists=');
  const end = html.indexOf('function openCheck');
  const names = vm.runInNewContext(`${html.slice(start, end)};Object.keys(lists)`);
  assert.equal(names[0], 'Pump startup / commissioning');
  assert.equal(names[8], 'Pump teardown');
  assert.equal(names[9], 'Filtration / backwash service');
});

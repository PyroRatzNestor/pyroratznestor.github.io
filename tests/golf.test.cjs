const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'dashboard.html'), 'utf8');
const files = ['hunter', 'rainbird', 'toro'].map(brand => `data/golf-${brand}.js`);
const scripts = files.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
const golf = html.slice(
  html.indexOf('/* ---------- golf catalog references ---------- */'),
  html.indexOf('/* ---------- end golf catalog references ---------- */')
);
const original = JSON.parse(html.split('\n').find(line => line.startsWith('const PARTS=')).slice(12, -1));
const prior = html.slice(
  html.indexOf('/* ---------- landscape technical references ---------- */'),
  html.indexOf('const pHost=')
);
const baseTools = html.slice(html.indexOf('const f1='), html.indexOf('const PARTS='));
function load(parts = structuredClone(original), includePrior = false) {
  return vm.runInNewContext(`(function(){
    ${scripts}
    ${includePrior ? baseTools + prior : ''}
    ${golf}
    return {catalogs:GOLF_CATALOGS, parts:PARTS, enrich:enrichGolfParts,
      matches:matchesPartQuery, coverage:golfCoverageHTML,
      tools:${includePrior ? 'tools' : '{}'}};
  })()`, { PARTS: parts, esc: s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) });
}
const { catalogs, parts, matches } = load();
const find = (brand, model) => {
  const result = catalogs.find(c => c.brand === brand).records.find(r => r.model === model || r.aliases.includes(model));
  assert.ok(result, `${brand}: ${model}`);
  return result;
};

test('golf scripts parse and load synchronously before the application', () => {
  files.forEach(file => {
    new vm.Script(fs.readFileSync(path.join(root, file), 'utf8'));
    assert.ok(html.indexOf(`src="${file}"`) < html.indexOf('<script>'));
  });
  assert.equal(catalogs.length, 3);
  assert.deepEqual(Array.from(catalogs, c => c.pages), [88, 110, 112]);
  assert.match(catalogs[0].edition, /Volume 41/);
  assert.match(catalogs[1].edition, /2026.*2027/);
  assert.match(catalogs[2].edition, /2026/);
  assert.deepEqual(Array.from(catalogs, c => c.records.length), [68, 147, 57]);
});

test('coverage partitions every catalog page exactly once', () => {
  for (const catalog of catalogs) {
    const counts = Array(catalog.pages + 1).fill(0);
    for (const section of catalog.coverage) {
      const [start, end] = section.pdf;
      assert.ok(Number.isInteger(start) && Number.isInteger(end) && start >= 1 && end <= catalog.pages && end >= start);
      assert.ok(['context', 'products', 'technical'].includes(section.kind));
      assert.ok(section.note);
      for (let page = start; page <= end; page++) {
        counts[page]++;
        if (section.kind !== 'context') {
          assert.ok(catalog.records.some(r => r.pdf[0] <= page && r.pdf[1] >= page), `${catalog.brand} p.${page} has no cited product/technical reference`);
        }
      }
    }
    for (let page = 1; page <= catalog.pages; page++) assert.equal(counts[page], 1, `${catalog.brand} p.${page}`);
  }
});

test('every golf record has bounded citations, distinct identity and factual content', () => {
  for (const catalog of catalogs) {
    const keys = new Set();
    assert.ok(catalog.records.length > 0, catalog.brand);
    assert.match(catalog.url, /^https:\/\//);
    for (const r of catalog.records) {
      assert.ok(r.model && r.type);
      const key = `${r.model}|${r.type}`;
      assert.ok(!keys.has(key), `${catalog.brand}: ${key}`);
      keys.add(key);
      assert.ok(r.pdf.length === 2 && r.pdf.every(Number.isInteger));
      assert.ok(r.pdf[0] >= 1 && r.pdf[1] <= catalog.pages && r.pdf[1] >= r.pdf[0]);
      assert.ok(Array.isArray(r.aliases) && r.aliases.every(a => typeof a === 'string' && a.trim()));
      assert.equal(new Set(r.aliases).size, r.aliases.length, key);
      assert.ok(r.facts.length && r.facts.every(f => typeof f === 'string' && f.trim()));
      assert.doesNotMatch(r.facts.join(' '), /undefined|NaN|TODO|TBD/);
    }
  }
});

test('golf ingestion preserves original records and repeat enrichment is idempotent', () => {
  assert.deepEqual(parts.slice(0, original.length), original);
  assert.equal(parts.length, original.length + catalogs.reduce((n, c) => n + c.records.length, 0));
  const loaded = load();
  const before = JSON.stringify(loaded.parts);
  loaded.enrich();
  assert.equal(JSON.stringify(loaded.parts), before);
  for (const r of loaded.parts.slice(original.length)) {
    assert.equal(r.c, 'Golf irrigation');
    assert.equal(r.s, '', 'No invented direct spec URLs');
    assert.match(r.source, /; .*\.pdf; PDF pp\. \d+-\d+$/);
  }
});

test('golf coexists with landscape, filtration and unchanged hydraulic/wiring tools', () => {
  const combined = load(structuredClone(original), true);
  assert.equal(combined.parts.filter(r => r.c === 'Golf irrigation').length, catalogs.reduce((n, c) => n + c.records.length, 0));
  assert.ok(combined.parts.some(r => r.c === 'Landscape irrigation' && r.source));
  assert.ok(combined.parts.some(r => r.m === 'Amiad' && r.source));
  assert.ok(combined.parts.some(r => r.m === 'Netafim' && r.source));
  assert.equal(combined.tools.precip.name, 'Precipitation rate (golf heads)');
  assert.equal(combined.tools.landprecip.name, 'Precipitation rate (landscape heads)');
  assert.ok(combined.tools.convwire && combined.tools.pathwire && combined.tools.pipe);
  const before = JSON.stringify(combined.parts);
  combined.enrich();
  assert.equal(JSON.stringify(combined.parts), before);
});

test('Hunter covers controls, every rotor family, accessories and included landscape models', () => {
  for (const model of ['PILOT-CCS', 'Pilot-FC80', 'Pilot-DH999', 'Pilot-600', 'POGO-WEATHER', 'ICD-HP',
    'GT-880', 'GT-884', 'GT-885', 'GT-835', 'G-880', 'G-884', 'G-885', 'G-835',
    'G-80-B', 'G-84-B', 'G-85-B', 'G-35-B', 'G-990', 'G-995',
    'HSJ-3', 'G312015SP', '987201SP', 'HQ-44-LRC-AW', 'H-SADDLE-415', '475700SP',
    'PGP-12', 'I-20-04-SS', 'I-25-06-SS', 'MP-3500-90', 'PROS-12-SI-PRS40', 'ICV-301', 'Luxor App']) {
    find('Hunter', model);
  }
  assert.match(find('Hunter', 'GT-880').facts.join(' '), /14\.2-58\.5 GPM/);
  assert.match(find('Hunter', 'GT-835').facts.join(' '), /Source anomaly/);
  assert.match(find('Hunter', 'Pilot-FC80').facts.join(' '), /conflicting configuration/);
  assert.match(find('Hunter', '991200SP').facts.join(' '), /2019/);
});

test('verified Hunter nozzle examples reproduce precipitation under their chart assumptions', () => {
  const { tools } = load(structuredClone(original), true);
  for (const [flow, spacing, square, triangle] of [[14.2,49,0.57,0.66], [8.9,37,0.63,0.72], [1.9,18,0.56,0.65]]) {
    for (const [tri, expected] of [[0,square],[1,triangle]]) {
      const output = tools.precip.calc({gpm:flow,arc:360,sp:spacing,rsp:spacing,tri});
      const result = Number(output.match(/<b>([\d.]+)/)[1]);
      assert.ok(Math.abs(result - expected) <= 0.01, `${flow} GPM, ${spacing} ft, tri=${tri}: ${output}`);
    }
  }
});

test('Rain Bird and Toro index controls, rotors, service products and technical references', () => {
  for (const [brand, terms] of [
    ['Rain Bird', ['552', 'R-VAN', 'valve', 'wire', 'precipitation']],
    ['Toro', ['IntelliDash', 'Lynx', 'INFINITY', 'FLEX800', 'OSMAC', '220G', '470', 'wire', 'precipitation']]
  ]) {
    const records = parts.filter(r => r.c === 'Golf irrigation' && r.m === brand);
    for (const term of terms) assert.ok(records.some(r => matches(r, term)), `${brand}: ${term}`);
    assert.ok(records.some(r => r.t === 'Technical Reference'));
  }
});

test('all listed variants and technical facts are searchable without losing spelling alias', () => {
  for (const catalog of catalogs) {
    for (const record of catalog.records) {
      const part = parts.find(r => r.m === catalog.brand && r.o === record.model && r.c === 'Golf irrigation');
      for (const alias of record.aliases) assert.ok(matches(part, alias), `${catalog.brand}: ${alias}`);
      assert.ok(matches(part, record.model));
      assert.ok(matches(part, catalog.edition));
    }
  }
  assert.ok(matches({m:'Netafim', o:'AlphaDisc'}, 'Netaphim'));
  assert.ok(matches(parts.find(r => r.o === 'GT-880'), '14.2-58.5 GPM'));
  assert.match(html, /Listed models \/ identifiers:/);
  const summary = load().coverage();
  for (const catalog of catalogs) assert.ok(summary.includes(catalog.edition));
  assert.match(summary, /not a transcription of every performance-table cell/);
});

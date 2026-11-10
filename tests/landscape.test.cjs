const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'dashboard.html'), 'utf8');
const original = JSON.parse(html.split('\n').find(line => line.startsWith('const PARTS=')).slice(12, -1));
const baseTools = html.slice(html.indexOf('const f1='), html.indexOf('const PARTS='));
const landscape = html.slice(
  html.indexOf('/* ---------- landscape technical references ---------- */'),
  html.indexOf('/* ---------- filtration catalog references ---------- */')
);
const load = parts => vm.runInNewContext(`(function(){
  ${baseTools}
  ${landscape}
  return {tools, parts: PARTS, refs: LANDSCAPE_REFS,
    gauges: LANDSCAPE_GAUGES, valves: LANDSCAPE_VALVE_FEET,
    soils: LANDSCAPE_SOILS, cv: LANDSCAPE_HDL_CV, pcr: LANDSCAPE_HDL_PCR};
})()`, { PARTS: parts, esc: s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) });
const { tools, parts, refs, gauges, valves, soils, cv, pcr } = load(structuredClone(original));
const keys = ['landprecip', 'landarea', 'landwire', 'landslope', 'hdlrun'];
const defaults = key => Object.fromEntries(tools[key].fields.map(([id, , value]) => [id, value]));
const calc = (key, values = {}) => tools[key].calc({ ...defaults(key), ...values });
const plain = html => html.replace(/<[^>]*>/g, '');
const firstNumber = html => Number(html.match(/<b>([\d.]+)/)[1]);

test('all application scripts parse and every new tool has a source citation', () => {
  for (const [, script] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    new vm.Script(script);
  }
  for (const key of keys) {
    assert.match(calc(key), /Source: Hunter/);
    assert.ok(tools[key].fields.length > 0);
    assert.doesNotMatch(calc(key), /NaN|Infinity|undefined/);
  }
});

test('golf and landscape precipitation remain separate with unchanged golf defaults', () => {
  assert.equal(tools.precip.name, 'Precipitation rate (golf heads)');
  assert.equal(tools.landprecip.name, 'Precipitation rate (landscape heads)');
  assert.deepEqual(defaults('precip'), { gpm: 12, arc: 360, sp: 65, rsp: 65, tri: 0 });
  assert.equal(firstNumber(calc('precip')), 0.27);
  assert.match(calc('wiresize'), /14 AWG/);
  assert.equal(defaults('landprecip').sp, 15);
});

test('landscape default reproduces Rain Bird HE-VAN 15 chart within rounded precision', () => {
  assert.equal(firstNumber(calc('landprecip')), 1.58);
  assert.equal(firstNumber(calc('landprecip', { tri: 1 })), 1.83);
  assert.match(plain(calc('landprecip')), /40.2 mm\/hr/);
  assert.match(calc('landprecip'), /Consumer Products 2026 p\. 8/);
});

test('matched arc flows have equal application rates and spacing is explicit', () => {
  for (const [arc, gpm] of [[90, 0.925], [180, 1.85], [360, 3.70]]) {
    assert.equal(firstNumber(calc('landprecip', { arc, gpm })), 1.58);
  }
  assert.equal(firstNumber(calc('landprecip', { rsp: 30 })), 0.79);
  assert.equal(firstNumber(calc('landprecip', { tri: 1, rsp: -1 })), 1.83);
  for (const values of [{rsp:0}, {rsp:-1}, {sp:0}, {gpm:0}, {arc:0}, {arc:361}, {tri:0.5}, {tri:2}]) {
    assert.match(calc('landprecip', values), /^Enter positive/);
  }
});

test('total-area application and gross applied-depth runtime use published units', () => {
  assert.equal(firstNumber(calc('landarea')), 0.96);
  assert.match(plain(calc('landarea')), /15\.6 minutes/);
  assert.equal(firstNumber(calc('landarea', {gpm:20})), 1.93);
  assert.match(plain(calc('landarea', {depth:0})), /0\.0 minutes/);
  for (const values of [{gpm:0}, {area:0}, {area:-1}, {depth:-1}]) {
    assert.match(calc('landarea', values), /^Total zone flow/);
  }
  assert.match(calc('landarea'), /not a crop-water or net root-zone prescription/);
});

test('all 49 conventional valve distance cells match Hunter p. 215', () => {
  const expected = [
    [850,1040,1210,1350,1460,1540,1590],
    [1040,1340,1650,1920,2150,2330,2440],
    [1210,1650,2150,2630,3080,3450,3700],
    [1350,1920,2630,3390,4170,4880,5400],
    [1460,2150,3080,4170,5400,6670,7690],
    [1540,2330,3450,4880,6670,8700,10530],
    [1590,2440,3700,5400,7690,10530,13330]
  ];
  assert.equal(JSON.stringify(valves), JSON.stringify(expected));
  gauges.forEach((common, r) => gauges.forEach((control, c) => {
    const max = expected[r][c];
    assert.equal(firstNumber(calc('landwire', {common, control})), max);
    assert.match(calc('landwire', {common, control, dist:max}), /<b>Within<\/b>/);
    assert.match(calc('landwire', {common, control, dist:max+1}), /<b>EXCEEDS<\/b>/);
    assert.equal(firstNumber(calc('landwire', {common, control, active:2})), max/2);
  }));
  assert.match(calc('landwire'), /350\/190 mA.*60 Hz.*370\/210 mA.*50 Hz/);
  for (const values of [{common:20}, {control:15}, {active:3}, {active:1.5}, {dist:-1}]) {
    assert.match(calc('landwire', values), /^Use listed AWG/);
  }
});

test('PSR catalog facts remain reference-only rather than an irrigation calculator', () => {
  assert.equal(tools.psrwire, undefined);
  assert.equal(refs['Pump-start relay wiring'].tool, undefined);
  assert.match(refs['Pump-start relay wiring'].facts.join(' '), /PSR-22 at 14 AWG is 616 ft/);
  assert.match(refs['Pump-start relay wiring'].facts.join(' '), /PSR-52 and PSR-53 at 14 AWG are 341 ft/);
});

test('all 56 soil/cover/slope reference cells match Hunter p. 199', () => {
  const expected = [
    [2,2,2,1.5,1.5,1,1,0.5],
    [1.75,1.5,1.25,1,1,0.75,0.75,0.4],
    [1.75,1,1.25,0.8,1,0.6,0.75,0.4],
    [1.25,0.75,1,0.5,0.75,0.4,0.5,0.3],
    [1,0.5,0.8,0.4,0.6,0.3,0.4,0.2],
    [0.6,0.3,0.5,0.25,0.4,0.15,0.3,0.1],
    [0.2,0.15,0.15,0.1,0.12,0.08,0.1,0.06]
  ];
  assert.equal(JSON.stringify(soils.map(([,limits])=>limits)), JSON.stringify(expected));
  for (let soil=1; soil<=7; soil++) {
    [0,5,8,12].forEach((slope,band) => {
      for (const bare of [0,1]) {
        assert.equal(firstNumber(calc('landslope', {soil,slope,bare})), expected[soil-1][band*2+bare]);
      }
    });
  }
  assert.equal(firstNumber(calc('landslope', {soil:7,slope:4.999})), 0.15);
  assert.equal(firstNumber(calc('landslope', {soil:7,slope:5})), 0.10);
  assert.match(calc('landslope', {rate:0.08}), /at or below/);
  assert.match(calc('landslope', {rate:0.081}), /exceeds/);
  for (const values of [{soil:0},{soil:8},{soil:1.5},{slope:-1},{bare:2},{rate:-1}]) {
    assert.match(calc('landslope',values), /^Choose soil/);
  }
});

test('HDL variants, pressures and spacings use exact published lookup combinations', () => {
  assert.equal(firstNumber(calc('hdlrun')), 441);
  assert.equal(firstNumber(calc('hdlrun',{variant:2})), 482);
  assert.equal(firstNumber(calc('hdlrun',{variant:3})), 441);
  assert.equal(firstNumber(calc('hdlrun',{variant:2,gph:0.6,psi:10,spacing:24})), 298);
  assert.equal(firstNumber(calc('hdlrun',{variant:1,gph:0.4,psi:60,spacing:24})), 947);
  assert.equal(firstNumber(calc('hdlrun',{variant:3,gph:0.9,psi:15,spacing:12})), 117);
  for (const [variant,table] of [[1,cv],[2,pcr],[3,cv]]) {
    for (const [gph,pressures] of Object.entries(table)) {
      if (variant===3 && Number(gph)===0.4) continue;
      for (const [psi,distances] of Object.entries(pressures)) {
        const spacings=variant===3?[12,18]:[12,18,24];
        spacings.forEach((spacing,i)=>{
          const v={variant,gph:Number(gph),psi:Number(psi),spacing,length:distances[i]};
          assert.equal(firstNumber(calc('hdlrun',v)),distances[i]);
          assert.match(calc('hdlrun',v),/<b>Within<\/b>/);
          assert.match(calc('hdlrun',{...v,length:distances[i]+1}),/<b>EXCEEDS<\/b>/);
        });
      }
    }
  }
  for (const values of [{variant:3,spacing:24},{variant:3,gph:0.4},{variant:2,gph:0.4},{psi:35},{psi:14},{spacing:13},{psi:10}]) {
    assert.match(calc('hdlrun',values),/^No catalog entry/);
  }
  assert.match(calc('hdlrun',{variant:4}),/^Choose variant/);
  assert.match(calc('hdlrun',{length:-1}),/^Choose variant/);
});

test('new tools explicitly reject nonfinite inputs and arithmetic overflow', () => {
  for (const key of keys) {
    for (const [id] of tools[key].fields) {
      for (const value of [NaN,Infinity,-Infinity]) {
        assert.doesNotMatch(calc(key,{[id]:value}),/<b>/,`${key}.${id}`);
      }
    }
  }
  assert.match(calc('landprecip',{gpm:Number.MAX_VALUE}),/outside the supported/);
  assert.match(calc('landarea',{area:Number.MIN_VALUE}),/outside the supported/);
});

test('source-linked landscape records are unique and preserve all workbook records', () => {
  const key=r=>[r.m,r.o,r.t,r.p].join('|');
  for (const r of original) assert.deepEqual(parts.find(p=>key(p)===key(r)),r);
  assert.equal(new Set(parts.map(key)).size,parts.length);
  const again=load(structuredClone(parts)).parts;
  assert.equal(JSON.stringify(again),JSON.stringify(parts));
  const added=parts.filter(p=>p.c==='Landscape irrigation');
  assert.equal(added.length,32);
  assert.ok(added.every(p=>p.source && p.facts.length && p.s===''));
  const rain=added.find(p=>p.o==='HE-VAN 15');
  assert.match(rain.source,/printed p\. 8 \(PDF p\. 12\)/);
  assert.match(rain.facts.join(' '),/3\.70 GPM.*1\.58.*1\.83/);
  assert.match(added.find(p=>p.o==='CPF100').facts.join(' '),/do not use the Hunter solenoid table/);
});

test('reference topics cover appendix scope and name the Rain Bird consumer limitation', () => {
  assert.equal(refs['Pipe / fittings / pressure'].tool, 'pipe');
  assert.match(refs['Pipe / fittings / pressure'].facts.join(' '), /Global hydraulic reference.*golf, landscape, filtration and pump systems/);
  assert.equal(Object.keys(refs).length,8);
  const text=Object.values(refs).flatMap(r=>r.facts).join('\n');
  for (const term of ['194-217','p. 198','p. 199','p. 196','p. 197','p. 214','p. 215','p. 216','p. 217','no end-of-book technical appendix']) {
    assert.ok(text.includes(term),term);
  }
  assert.ok(Object.values(refs).every(r=>!r.tool||tools[r.tool]));
  assert.match(html,/LIB\.Irrigation\['Hunter Industries'\]\.docs\.push/);
  assert.match(html,/LIB\.Irrigation\['Rain Bird irrigation'\]\.docs\.push/);
});

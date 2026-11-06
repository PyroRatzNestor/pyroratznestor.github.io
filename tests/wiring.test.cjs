const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const source = html.slice(html.indexOf('const f1='), html.indexOf('const PARTS='));
const { tools, resistance } = vm.runInNewContext(`(function(){
  ${source}
  return { tools, resistance: WIRE_OHMS };
})()`);
const defaults = key => Object.fromEntries(tools[key].fields.map(([id, , value]) => [id, value]));
const calc = (key, values = {}) => tools[key].calc({ ...defaults(key), ...values }).replace(/<[^>]*>/g, '');

test('copper gauge resistance entries match Hunter p. 215 and omit conflicting AWG 1', () => {
  const expected = {20:10.1,19:8.05,18:6.39,17:5.05,16:4.02,15:3.18,14:2.52,13:2,12:1.59,11:1.26,10:0.999,9:0.793,8:0.628,7:0.498,6:0.395,5:0.313,4:0.249,3:0.197,2:0.156};
  assert.equal(JSON.stringify(resistance), JSON.stringify(expected));
  assert.equal(resistance[1], undefined);
});

test('conventional wire calculator matches Hunter golf example and separate common gauges', () => {
  assert.match(calc('convwire'), /Voltage-budget distance: 2145\.0 ft one-way/);
  assert.match(calc('convwire'), /drop 3\.36 V; estimated load voltage 20\.64 V/);
  const unequal = calc('convwire', { common: 12, amp: 0.35, dist: 1000 });
  assert.match(unequal, /drop 1\.44 V; estimated load voltage 22\.56 V/);
  assert.match(unequal, /shared common with other active branches/);
  assert.match(calc('convwire', { active: 2 }), /1072\.5 ft one-way/);
});

test('supply and minimum voltage change distance for AC and DC separately', () => {
  const ac = calc('convwire', { source: 24, min: 20 });
  const dc = calc('convwire', { supply: 1, source: 12, min: 10 });
  assert.match(ac, /AC estimate neglects reactance/);
  assert.match(dc, /1072\.5 ft one-way/);
  assert.match(dc, /pulse duration or polarity/);
  assert.notEqual(ac, dc);
});

test('two-wire calculator uses both path conductors and includes all path current', () => {
  const result = calc('pathwire', { source: 30, min: 20, awg: 14, ma: 300, dist: 2000 });
  assert.match(result, /6613\.8 ft one-way/);
  assert.match(result, /drop 3\.02 V; idealized remaining voltage 26\.98 V/);
  assert.match(result, /Not a manufacturer-approved decoder path length/);
  assert.match(result, /idle loads, simultaneous active loads/);
  assert.match(calc('pathwire', { source: 30, min: 20, ma: 600 }), /3306\.9 ft one-way/);
});

test('actual unrounded distance governs comparison against the voltage budget', () => {
  const max = 10 / (0.3 * 2 * 2.52 / 1000);
  assert.match(calc('pathwire', { dist: max }), /Within the entered resistance budget/);
  assert.match(calc('pathwire', { dist: max + 0.01 }), /EXCEEDS the entered resistance budget/);
  assert.match(calc('convwire', { dist: 3000 }), /EXCEEDS the entered voltage budget/);
});

test('both calculators reject invalid, nonfinite and overflowing electrical inputs', () => {
  for (const [key, values] of [
    ['convwire', { supply: 2 }], ['convwire', { common: 1 }],
    ['convwire', { active: 1.5 }], ['convwire', { active: 0 }],
    ['convwire', { amp: 0 }], ['convwire', { amp: Number.MAX_VALUE, active: 2 }],
    ['pathwire', { ma: 0 }], ['pathwire', { ma: Infinity }]
  ]) assert.doesNotMatch(calc(key, values), /distance: [\d]/);
  for (const key of ['convwire', 'pathwire']) {
    for (const values of [
      { source: 0 }, { min: 0 }, { source: 20, min: 20 }, { source: 20, min: 25 },
      { awg: 1 }, { dist: -1 }, { dist: Infinity }, { source: NaN }
    ]) assert.doesNotMatch(calc(key, values), /distance: [\d]/);
  }
});

test('conventional and decoder tools have separate entries and keep existing source lookups', () => {
  assert.match(html, /Conventional valve wire distance \/ voltage','tool','convwire/);
  assert.match(html, /Two-wire decoder path distance \/ voltage','tool','pathwire/);
  assert.match(html, /landwire:\{name:'Hunter landscape valve wire distance'/);
  assert.ok(tools.dec_hunter);
  assert.ok(tools.wiresize);
  assert.ok(tools.twvd);
});

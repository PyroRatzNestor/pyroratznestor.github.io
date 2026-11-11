const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'dashboard.html'), 'utf8');
const toolsSource = html.slice(html.indexOf('const f1='), html.indexOf('const PARTS='));
const { tools, presets, options } = vm.runInNewContext(`(function(){
  ${toolsSource}
  return {tools, presets: PIPE_PRESETS, options: PIPE_PRESET_OPTIONS};
})()`);
const tool = tools.pipe;
const defaults = Object.fromEntries(tool.fields.map(([id, , value]) => [id, value]));
const presetIndex = (type, size) => presets.findIndex(p => p.type === type && p.size === size) + 1;
const calc = values => tool.calc({ ...defaults, ...values });
const preset = (type, size, values = {}) => calc({ preset: presetIndex(type, size), ...values });
const plain = html => html.replace(/<[^>]*>/g, '');

test('pipe presets cover the Hunter average-ID tables with unique material/size combinations', () => {
  assert.equal(presets.length, 87);
  const optionCount = options.reduce((total, group) => total + group.options.length, 0);
  assert.equal(presets.length, optionCount - 1);
  assert.ok(options.some(group => group.label === 'Schedule 40 PVC IPS'));
  assert.equal(new Set(presets.map(p => `${p.type}|${p.size}`)).size, presets.length);
  assert.ok(presets.every(p => p.id > 0 && p.c > 0 && p.page >= 201 && p.page <= 213));
  assert.equal(JSON.stringify(
    presets.filter(p => p.type === 'AWWA C900 DR18 Class 150').map(({ size, id, c }) => [size, id, c])
  ), JSON.stringify([['4', 4.234, 150], ['6', 6.088, 150], ['8', 7.984, 150], ['10', 9.792, 150], ['12', 11.646, 150]]));
  assert.equal(JSON.stringify(
    presets.filter(p => p.type === 'Copper Type K').map(({ size, id }) => [size, id])
  ), JSON.stringify([['1/2', 0.527], ['5/8', 0.652], ['3/4', 0.745], ['1', 0.995], ['1-1/4', 1.245], ['1-1/2', 1.481], ['2', 1.959], ['2-1/2', 2.435], ['3', 2.907]]));
});

test('conflicting catalog labels do not become misleading pipe presets', () => {
  assert.equal(presetIndex('PVC Class 200 IPS', '1/2'), 0);
  assert.equal(presetIndex('Schedule 40 PVC IPS', '5'), 0);
  assert.match(calc({}), /Omitted source anomalies/);
  assert.match(calc({ gpm: Number.MAX_VALUE }), /outside the supported numeric range/);
});

test('Schedule 40 PVC preset reproduces Hunter p. 207 velocity and friction chart', () => {
  const result = preset('Schedule 40 PVC IPS', '4', { gpm: 100, len: 100 });
  assert.match(result, /2\.56 ft\/s/);
  assert.match(result, /0\.25 psi\) per 100 ft/);
  assert.match(plain(result), /0\.59 ft over 100 ft \(0\.25 psi\)/);
  assert.match(result, /Hunter p\. 207/);
  assert.match(plain(result), /actual ID 3\.998 in, C=150/);
});

test('same nominal size uses material/class-specific ID and C and changes friction loss', () => {
  const pvc = preset('Schedule 40 PVC IPS', '1', { gpm: 30, len: 100 });
  const class315 = preset('PVC Class 315 IPS', '1', { gpm: 30, len: 100 });
  const steel = preset('Schedule 40 steel', '1', { gpm: 30, len: 100 });
  assert.match(plain(pvc), /actual ID 1\.029 in, C=150/);
  assert.match(plain(class315), /actual ID 1\.101 in, C=150/);
  assert.match(plain(steel), /actual ID 1\.049 in, C=100/);
  assert.notEqual(pvc, class315);
  assert.notEqual(pvc, steel);
});

test('custom mode retains manual ID/C entry; invalid and nonfinite values are rejected', () => {
  const custom = calc({ d: 3.998, c: 150, gpm: 100, len: 100 });
  assert.match(custom, /Custom dimensions and C entered manually/);
  assert.match(custom, /0\.25 psi\) per 100 ft/);
  for (const values of [
    { preset: -1 }, { preset: presets.length + 1 }, { preset: 1.5 },
    { gpm: -1 }, { d: 0 }, { c: 0 }, { len: -1 },
    { gpm: Infinity }, { d: NaN }, { c: Infinity }, { len: Infinity }
  ]) {
    assert.match(calc(values), /^Choose a valid preset/);
  }
});

test('presets explicitly cite global reference dimensions, not manufacturer-specific products', () => {
  const result = preset('AWWA C905 DR25', '20');
  assert.match(result, /standard reference dimensions, not manufacturer-specific/);
  assert.match(result, /Hunter p\. 213/);
  assert.match(result, /charts cover additional PE sizes without a listed average ID/);
});

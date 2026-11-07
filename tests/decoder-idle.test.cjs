const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const source = html.slice(html.indexOf('const f1='), html.indexOf('const PARTS='));
const { tools, profiles } = vm.runInNewContext(`${source}\n({tools, profiles:DECODER_IDLE_PROFILES})`);
const defaults = Object.fromEntries(tools.decoderidle.fields.map(([id, , value]) => [id, value === '' ? NaN : value]));
const calc = values => tools.decoderidle.calc({ ...defaults, ...values }).replace(/<[^>]*>/g, '');

test('Pilot nominal estimate counts physical devices without inventing a tolerance', () => {
  const result = calc({ count: 100, ref: 120 });
  assert.match(result, /nominal estimate: approximately 100\.000 mA/);
  assert.match(result, /Roughly 1 mA per two-way module/);
  assert.match(result, /\+20\.000 mA versus the nominal subtotal \(not a fault verdict\)/);
  assert.match(result, /No tolerance band/);
  assert.doesNotMatch(result, /pass:|healthy|within.*range/i);
});

test('DUAL and Calsense preserve reference ranges and compare exact boundaries', () => {
  assert.match(calc({ model: 3, count: 50 }), /idle range: 150\.000-200\.000 mA/);
  assert.match(calc({ model: 6, count: 35, ref: 28 }), /28\.000-35\.000 mA.*within/s);
  assert.match(calc({ model: 6, count: 35, ref: 35 }), /within.*reference decoder-only range/);
  assert.match(calc({ model: 6, count: 35, ref: 35.00001 }), /above.*reference decoder-only range/);
  assert.match(calc({ model: 6, count: 35, ref: 27.99999 }), /below.*reference decoder-only range/);
});

test('mixed compatible Rain Bird models sum separately, not by station count', () => {
  const result = calc({ model: 4, count: 100, model2: 5, count2: 25 });
  assert.match(result, /nominal estimate: approximately 75\.000 mA/);
  assert.match(result, /100 x Rain Bird FD-101 \/ FD-102: 0\.500 mA each/);
  assert.match(result, /25 x Rain Bird FD-202 \/ FD-401 \/ FD-601: 1\.000 mA each/);
  assert.match(result, /Count physical decoder devices, not stations, addresses or solenoids/);
  assert.match(calc({ model: 2, count: 50, model2: 2, count2: 50 }), /100\.000 mA/);
  assert.match(calc({ model: 4, model2: 2, count2: 1 }), /Do not combine different decoder systems/);
  assert.match(calc({ model: 10, low: 2, high: 3, model2: 2, count2: 1 }), /Do not combine/);
});

test('unconfirmed families never inherit ICD, DUAL, Pilot or other-brand values', () => {
  for (const model of [1, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18]) {
    assert.equal(profiles[model].low, undefined);
    const result = calc({ model });
    assert.match(result, /no confirmed preset/);
    assert.match(result, /No current total calculated/);
    assert.doesNotMatch(result, /Decoder-only idle.*mA/);
  }
  assert.match(calc({ model2: 1, count2: 1 }), /no confirmed preset/);
});

test('golf ICM, LXIVM and FD stay separate without changing saved profile indices', () => {
  assert.equal(profiles[4].system, 'rb-fd');
  assert.equal(profiles[10].system, 'custom');
  assert.equal(profiles[13].system, 'rb-icm');
  assert.equal(profiles[14].system, 'rb-ivm');
  assert.notEqual(profiles[13].system, profiles[14].system);
  assert.match(calc({ model: 13 }), /separate family from ESP-LXIVM and FD/);
  assert.match(calc({ model: 14 }), /separate from golf IC\/ICM and FD/);
  assert.match(profiles[9].name, /WeatherTRAK H2O/);
  assert.match(profiles[18].name, /Weathermatic SmartWire SLDEC/);
  for (const model of [15, 16, 17]) assert.match(profiles[model].name, /Toro/);
});

test('Tucor references do not turn conflicting nominal values into a tolerance', () => {
  assert.match(calc({ model: 11, count: 100 }), /nominal estimate: approximately 50\.000 mA/);
  const conflict = calc({ model: 11, model2: 12, count2: 10 });
  assert.match(conflict, /conflicting nominal figures, not a published 0\.8-1\.0 mA tolerance range/);
  assert.match(conflict, /No current total calculated/);
  assert.match(calc({ model: 8 }), /powered-off idle reading is not a powered diagnostic baseline/);
  assert.match(profiles[3].name, /legacy field systems/);
});

test('custom mode labels entered rates, supports nominal values and zero measurement', () => {
  const range = calc({ model: 10, count: 100, low: 2.5, high: 3.5, ref: 0 });
  assert.match(range, /250\.000-350\.000 mA/);
  assert.match(range, /Measured 0\.000 mA: below the entered decoder-only range/);
  assert.match(range, /User-entered values, not manufacturer-verified presets/);
  assert.doesNotMatch(range, /Manufacturer reference/);
  assert.match(calc({ model: 10, low: 3.5, high: 3.5 }), /nominal estimate: approximately 350\.000 mA/);
  assert.match(calc({ model: 10, count: 1, low: 1e-8, high: 1e-8, ref: 0 }), /approximately 1\.000e-8 mA/);
  assert.match(calc({ model: 10, count: 1, low: 1e9, high: 1e9 }), /approximately 1\.000e\+9 mA/);
});

test('invalid inputs and overflow cannot produce current totals', () => {
  for (const values of [
    { count: 0 }, { count: -1 }, { count: 1.5 }, { count: Infinity },
    { count: Number.MAX_SAFE_INTEGER + 1 }, { count: NaN }, { count2: -1 },
    { model: 0 }, { model: -1 }, { model: 99 }, { model: 2.5 }, { model2: NaN },
    { ref: -1 }, { ref: Infinity },
    { model: 10, low: 0, high: 1 }, { model: 10, low: 2, high: 1 },
    { model: 10, low: NaN, high: 1 }, { model: 10, low: 1, high: Infinity },
    { model: 10, low: Number.MAX_VALUE, high: Number.MAX_VALUE }
  ]) assert.doesNotMatch(calc(values), /Decoder-only idle/, JSON.stringify(values));
});

test('preset sources and limitations remain visible in every calculated preset result', () => {
  for (const model of [2, 3, 4, 5, 6, 11]) {
    assert.ok(profiles[model].url.startsWith('https://'));
    const result = tools.decoderidle.calc({ ...defaults, model });
    assert.ok(result.includes(profiles[model].url));
    assert.match(result, /Provisional source references/);
    assert.match(result, /direct document verification is pending/);
    assert.match(result, /Surge protectors.*are not modeled/);
    assert.match(result, /unlisted loads are not assumed to be zero/);
    assert.match(result, /manufacturer-approved meter\/method/);
    assert.match(result, /high\/low reading alone cannot identify/);
  }
});

test('idle calculator is reachable from menus, decoder references and diagnostic path', () => {
  assert.match(html, /Decoder idle current \/ expected mA','tool','decoderidle/);
  assert.match(html, /'Check expected idle current from decoder count','idle'/);
  assert.match(html, /idle:R\('IDLE CURRENT \/ INVENTORY'.*'decoderidle'\)/);
  assert.match(html, /id="dcidle"/);
  assert.match(html, /\$\('#dcidle'\)\.onclick=\(\)=>openTool\('decoderidle',false\)/);
});

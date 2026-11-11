const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'data/pps-home-commissioning.js'), 'utf8');
const form = JSON.parse(JSON.stringify(vm.runInNewContext(source + '\nTRACER_PPS_HOME_COMMISSIONING')));
const dashboard = fs.readFileSync(path.join(root, 'dashboard.html'), 'utf8');

test('PPS Home form source and all four section families are represented', () => {
  assert.equal(form.formId, 'pps-home-commissioning');
  assert.match(form.source, /QF-16\.5.*Rev B.*01\/22\/25.*pages 1-4/);
  assert.equal(form.headerFields.length, 7);
  assert.equal(form.attendeeFields.length, 4);
  assert.equal(form.completionFields.length, 5);
  assert.equal(form.panel.prePower.length, 9);
  assert.equal(form.panel.powerOn.length, 18);
  assert.equal(form.skid.prePower.length, 4);
  assert.equal(form.skid.powerOn.length, 13);
  assert.deepEqual(Object.values(form.photos).map(items => items.length), [6, 4, 4]);
});

test('pump, settings and measurement fields cover the supplied table layout', () => {
  assert.equal(form.pumpCounts.length, 9);
  assert.equal(form.pumpFields.length, 9);
  assert.equal(form.readings.length, 13);
  assert.equal(form.noteLines, 14);
  assert.deepEqual(form.readings.map(field => field.id), [
    'l1g', 'l1l2', 'l2g', 'l1l3', 'l3g', 'l2l3', 'fullRunVolts',
    'psiSetpoint', 'highPressureSwitch', 'lowPressureAlarm',
    'highPressureAlarm', 'prvCrack', 'pressureTank'
  ]);
});

test('form duplicate markers remain explicit and checklist item IDs are unique', () => {
  const items = [
    ...form.panel.prePower, ...form.panel.powerOn,
    ...form.skid.prePower, ...form.skid.powerOn
  ];
  assert.equal(items.filter(item => item.duplicate).length, 13);
  for (const section of [form.panel, form.skid]) {
    for (const group of ['prePower', 'powerOn']) {
      const ids = section[group].map(item => item.id);
      assert.equal(new Set(ids).size, ids.length);
    }
  }
  assert.match(form.duplicateNote, /repeated/i);
});

test('PPS commissioning is reachable by direct portal route and uses a separate local record', () => {
  assert.match(dashboard, /data\/pps-home-commissioning\.js/);
  assert.match(dashboard, /key==='ppscommissioning'.*openPpsCommissioning/);
  assert.match(dashboard, /tracerPpsHomeCommissioning/);
  assert.match(dashboard, /EXPORT PPS RECORD JSON/);
  assert.match(dashboard, /IMPORT PPS RECORD JSON/);
  assert.match(dashboard, /never enter a code in this record/i);
});

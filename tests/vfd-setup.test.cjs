const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const source = html.slice(
  html.indexOf('/* ---------- commissioned drive setup ---------- */'),
  html.indexOf('/* ---------- end commissioned drive setup ---------- */')
);
function load() {
  const data = new Map(), nodes = {}, notes = [], prompts = [];
  let confirmResult = true, storageFailure = false, serial = 0;
  const storage = {
    getItem: key => data.has(key) ? data.get(key) : null,
    setItem(key, value) {
      if (storageFailure) throw new Error('Storage quota denied');
      data.set(key, value);
    }
  };
  const bench = {
    set innerHTML(value) {
      this.markup = value;
      for (const key of Object.keys(nodes)) delete nodes[key];
      for (const [, id] of value.matchAll(/\bid="([^"]+)"/g)) {
        nodes['#' + id] = {value: '', textContent: '', style: {}, disabled: id === 'vfd_save' && value.includes('id="vfd_save" disabled')};
      }
    }
  };
  const context = {
    $: selector => selector === '#bench' ? bench : nodes[selector],
    esc: s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c])),
    setTabs() {}, scrollBench() {}, localStorage: storage,
    confirm: text => { prompts.push(text); return confirmResult; },
    crypto: {randomUUID: () => 'asset-' + (++serial)},
    appendNote: text => notes.push(text),
    openTool() {}, openFlow() {}
  };
  const api = vm.runInNewContext(`${source}\n({
    profiles:VFD_PROFILES, items:VFD_ITEMS, meta:VFD_META, symptoms:VFD_SYMPTOMS,
    acqReferences:ACQ580_REFERENCES, acqSource:ACQ580_SOURCE, acqContext:ACQ580_CONTEXT,
    acsReferences:ACS550_REFERENCES, acsSource:ACS550_SOURCE, acsContext:ACS550_CONTEXT,
    f800References:F800E_REFERENCES, f800Source:F800E_SOURCE, f800Context:F800E_CONTEXT,
    d700References:D700_REFERENCES, d700Source:D700_SOURCE, d700Context:D700_CONTEXT, d700Panel:D700_PANEL,
    intellidriveReferences:INTELLIDRIVE_REFERENCES, intellidriveSource:INTELLIDRIVE_SOURCE,
    intellidriveContext:INTELLIDRIVE_CONTEXT, intellidrivePanel:INTELLIDRIVE_PANEL,
    atv320References:ATV320_REFERENCES, atv320Source:ATV320_SOURCE,
    atv320Context:ATV320_CONTEXT, atv320Panel:ATV320_PANEL,
    key:VFD_RECORD_KEY, create:newVfdWorksheet, valid:validVfdWorksheet,
    read:readVfdRecords, compare:vfdComparison, text:vfdWorksheetText,
    open:openVfdSetup, draft:()=>vfdDraft, dirty:()=>vfdDirty
  })`, context);
  return {
    ...api, nodes, data, notes, prompts, bench, storage,
    confirm: result => { confirmResult = result; },
    failStorage: fail => { storageFailure = fail; },
    input(id, value) {
      const el = nodes['#' + id];
      assert.ok(el, `Missing ${id}`);
      el.value = value;
      el.oninput({target: el});
    },
    change(id, value) {
      const el = nodes['#' + id];
      assert.ok(el, `Missing ${id}`);
      el.value = value;
      el.onchange({target: el});
    },
    click(id) { nodes['#' + id].onclick(); }
  };
}

test('drive profiles keep exact families separate and supply no guessed parameter values', () => {
  const app = load();
  assert.deepEqual(Object.keys(app.profiles), ['acq580', 'acs550', 'f800e', 'd700', 'intellidrive', 'atv600', 'atv320', 'other']);
  assert.match(app.profiles.acq580.scope, /ACS580\/ACS550 mappings are not substitutes/);
  assert.match(app.profiles.f800e.scope, /FR-E800 is a different series/);
  assert.match(app.profiles.intellidrive.scope, /expose PID Control settings.*do not transfer industrial-drive values/);
  assert.match(app.profiles.atv600.scope, /Do not copy mappings from ATV320/);
  for (const key of Object.keys(app.profiles)) {
    const r = app.create(key);
    assert.ok(app.valid(r));
    for (const value of Object.values(r.values)) {
      assert.ok(Object.values(value).every(v => v === ''));
    }
  }
});

test('ATV320 references identify software, PID gains, scaling, sleep and fault semantics', () => {
  const app = load(), refs = app.atv320References;
  assert.match(app.atv320Source, /ATV320.*NVE41295\.06.*2025-04.*V3\.5IE46/);
  assert.match(app.atv320Context, /V3\.5IE46.*earlier versions.*confirm.*PIF/);
  assert.match(app.profiles.atv320.scope, /separate from ATV600/);
  assert.match(app.atv320Panel, /jog dial.*ENT.*ESC.*CONF > FULL > FUN > PID/);
  assert.match(app.atv320Panel, /RPI.*without pressing ENT.*read-only inspection/);
  assert.match(app.atv320Panel, /external control power.*lock out.*15 minutes.*verify absence of voltage/);
  for (const [id] of app.items) {
    assert.ok(refs[id]?.length, `Missing ATV320 reference for ${id}`);
    for (const [name, description, page] of refs[id]) {
      assert.ok(name && description);
      assert.match(page, /^pp?\.\s+\d/);
    }
  }
  const row = id => refs[id].map(item => item.join(' ')).join(' ');
  assert.match(row('feedback'), /PIF1\/PIF2 scale the sensor range.*PIP1\/PIP2 scale the process/);
  assert.match(row('feedback'), /AI3.*current input.*rather than assuming a 4-20 mA/);
  assert.match(row('setpoint'), /PII.*RPI.*reference channel.*PAU.*manual/);
  assert.match(row('direction'), /PIC = No.*increases.*positive.*Yes.*decreases/);
  assert.match(row('proportional'), /RPG.*0\.01-100.*default 1/);
  assert.match(row('integral'), /RIG.*integral gain, not an integral time.*0\.01-100.*PIS.*disable integral/);
  assert.match(row('derivative'), /RDG.*Derivative gain.*0\.00-100.*default 0.*not a derivative time/);
  assert.match(row('filter'), /AI1F \/ AI2F \/ AI3F.*0-10\.00 s/);
  assert.match(row('minimum'), /LSP.*POL.*separate PID minimum output/);
  assert.match(row('maximum'), /HSP.*TFR.*POH.*50 Hz.*60 Hz/);
  assert.match(row('ramps'), /ACC.*DEC.*AC2.*PRP.*FRS.*wake-ups.*separate PID reference ramp/);
  assert.match(row('sleep'), /TLS.*0-999\.9 s.*0 s means unlimited.*automatic restart/);
  assert.match(row('wake'), /RSL.*percentage.*PIF1\/PIF2.*not an absolute PSI.*TLS = 0 or RSL = 0/);
  assert.match(row('boost'), /Not mapped.*AC2.*not pressure boost/);
  assert.match(row('fault'), /ATR \/ TAR.*resume operation.*Fault output is unavailable.*retry window/);
  assert.match(row('interlocks'), /ITH.*motor thermal current.*do not bypass/);
});

test('ATV320 references render and export separately while preserving saved worksheets', () => {
  const app = load(), existing = app.create('atv320'), other = app.create('atv600');
  existing.id = 'atv320-existing'; existing.savedAt = '2026-11-07';
  existing.meta.asset = 'Existing'; existing.meta.model = 'ATV320';
  existing.values.integral = {parameter:'Vendor RIG', units:'gain', baseline:'2', current:'3', factory:'', reference:'Station record'};
  other.id = 'atv600-existing'; other.savedAt = '2026-11-07';
  other.meta.asset = 'Other'; other.meta.model = 'ATV630'; other.values.wake.baseline = 'Site setting';
  const stored = JSON.stringify([existing, other]);
  app.data.set(app.key, stored);
  app.open(false);
  app.change('vfd_records', existing.id);
  assert.equal(app.data.get(app.key), stored);
  assert.equal(app.draft().values.integral.baseline, '2');
  assert.equal(app.draft().values.integral.current, '3');
  assert.equal(app.draft().values.integral.factory, '');
  assert.match(app.bench.markup, /Schneider ATV320 NVE41295\.06 reference/);
  assert.match(app.bench.markup, /Panel: reading and authorized changes/);
  app.click('vfd_notes');
  assert.match(app.notes[0], /Schneider ATV320 NVE41295\.06 reference RIG \/ PIS.*integral gain.*\(pp\. 263-264\)/);
  assert.match(app.notes[0], /Parameter\/menu \(site-entered\): Vendor RIG/);
  assert.match(app.notes[0], /Commissioned baseline: 2/);
  assert.match(app.notes[0], /without pressing ENT/);
  for (const profile of ['acq580', 'acs550', 'f800e', 'd700', 'intellidrive', 'atv600', 'other']) {
    assert.doesNotMatch(app.text(app.create(profile)), /Schneider ATV320 NVE41295\.06 reference/);
  }
  app.change('vfd_records', other.id);
  assert.equal(app.draft().values.wake.baseline, 'Site setting');
  assert.match(app.bench.markup, /pending document-level verification/);
  assert.doesNotMatch(app.bench.markup, /Schneider ATV320 NVE41295\.06 reference/);
  assert.equal(app.data.get(app.key), stored);
});

test('Intellidrive PN957 references distinguish keypad PID, sleep and fault semantics', () => {
  const app = load(), refs = app.intellidriveReferences;
  assert.match(app.intellidriveSource, /PN957 \(2020-06-25\).*PID10-01.*PID20-01.*PID30-01.*PID50-01/);
  assert.match(app.profiles.intellidrive.scope, /other Intellidrive generations are not assumed equivalent/);
  assert.match(app.intellidriveContext, /manual defaults and ranges are references, not commissioned values/i);
  assert.match(app.intellidrivePanel, /cover closed.*disconnect power.*five minutes.*verify residual voltage/i);
  assert.match(app.intellidrivePanel, /MAIN MENU.*ENTER to highlight.*arrows.*ENTER again to save.*screen change before saving discards/i);
  assert.match(app.intellidrivePanel, /Pump Out runs at fixed speed without pressure control.*dangerously high pressure/);
  for (const [id] of app.items) {
    assert.ok(refs[id]?.length, `Missing Intellidrive reference for ${id}`);
    for (const [name, description, page] of refs[id]) {
      assert.ok(name && description);
      assert.match(page, /^pp?\.\s+\d/);
    }
  }
  const row = id => refs[id].map(item => item.join(' ')).join(' ');
  assert.match(row('feedback'), /4-20 mA.*0-100 PSI.*100-300 PSI.*trusted gauge/);
  assert.match(row('setpoint'), /external setpoint.*digital input.*voltage.*60 PSI.*15 PSI.*minus 3 PSI/);
  assert.match(row('proportional'), /0-10000.*default 1500/);
  assert.match(row('integral'), /20-65000 ms.*default 1500 ms/);
  assert.match(row('derivative'), /0-10000 ms.*60 ms.*0-2000.*120.*filter time constant/);
  assert.match(row('direction'), /does not document a selectable PID action-direction/);
  assert.match(row('ramps'), /does not list a general motor acceleration\/deceleration setting/);
  assert.match(row('sleep'), /Wake Delay.*pressure ramp-down during boost.*not the dry-run automatic restart delay.*does not specify a separate sleep-entry threshold/);
  assert.match(row('wake'), /below the active setpoint.*5-15 PSI.*default 5 PSI.*not an absolute pressure/);
  assert.match(row('boost'), /3-10 PSI.*30 sec-5 min.*3 sec-2 min/);
  assert.match(row('fault'), /Automatic retry can start the pump.*Fill Time starts after 55 Hz/);
  assert.match(row('fault'), /3 minutes.*1-minute Fill Time default.*55 Hz/);
  assert.match(row('fault'), /stops, waits one minute.*restarting if pressure is below/);
  assert.match(row('interlocks'), /Service Factor Amps.*above the correct rating may allow overheating/);
  assert.match(row('interlocks'), /Run Enabled, Ext Fault or Setpoint.*do not bypass/);
});

test('Intellidrive references render and export without replacing existing worksheet entries', () => {
  const app = load(), existing = app.create('intellidrive');
  existing.id = 'pentair-existing'; existing.savedAt = '2026-11-07';
  existing.meta.asset = 'Existing'; existing.meta.model = 'PID20-01';
  existing.values.integral = {parameter:'Vendor integration', units:'ms', baseline:'2200', current:'2400', factory:'', reference:'Station record'};
  const stored = JSON.stringify([existing]);
  app.data.set(app.key, stored);
  app.open(false);
  app.change('vfd_records', existing.id);
  assert.equal(app.data.get(app.key), stored);
  assert.equal(app.draft().values.integral.baseline, '2200');
  assert.equal(app.draft().values.integral.current, '2400');
  assert.equal(app.draft().values.integral.factory, '');
  assert.match(app.bench.markup, /Pentek Intellidrive PN957 reference/);
  assert.match(app.bench.markup, /Wake Up Differential/);
  assert.match(app.bench.markup, /Panel: reading and authorized changes/);
  assert.doesNotMatch(app.bench.markup, /ABB ACQ580 Rev C reference/);
  app.click('vfd_notes');
  assert.match(app.notes[0], /Pentek Intellidrive PN957 reference Settings > PID Control > Integration Time.*20-65000 ms.*\(p\. 13\)/);
  assert.match(app.notes[0], /Parameter\/menu \(site-entered\): Vendor integration/);
  assert.match(app.notes[0], /Commissioned baseline: 2200/);
  assert.match(app.notes[0], /Pump Out runs at fixed speed without pressure control/);
  for (const profile of ['acq580', 'acs550', 'f800e', 'd700', 'atv600', 'other']) {
    assert.doesNotMatch(app.text(app.create(profile)), /Pentek Intellidrive PN957 reference/);
  }
});

test('FR-D700 applied and basic manuals support PID and panel references with discrepancy warning', () => {
  const app = load(), refs = app.d700References;
  assert.match(app.d700Source, /FR-D700.*IB\(NA\)-0600438ENG-D.*2019-01.*Applied.*IB\(NA\)-0600366ENG-H.*2018-06/);
  assert.match(app.d700Context, /FR-D720.*FR-D740.*FR-D720S.*FR-D710W.*Pr\.128 = 20.*Pr\.128 = 10.*confirm this discrepancy/i);
  assert.match(app.d700Panel, /PU\/EXT.*MODE.*dial.*SET to read.*authorized value.*press SET/i);
  assert.match(app.d700Panel, /control ownership.*external start.*safe or stopped/);
  assert.match(app.d700Panel, /Pr\.CL or ALLC.*Er1-Er4.*do not bypass locks/);
  assert.match(app.d700Panel, /Pr\.160 = 9999.*0 displays simple and extended/);
  const row = id => (refs[id] || []).map(x => x.join(' ')).join(' ');
  for (const [id] of app.items) assert.ok(refs[id]?.length, `Missing reference for ${id}`);
  assert.match(row('feedback'), /20\/21.*terminal 4.*Pr\.267.*calibration/);
  assert.match(row('setpoint'), /Pr\.133.*9999 selects terminal 2.*X14.*if unassigned/);
  assert.match(row('direction'), /20 as reverse.*21 as forward.*40-43.*diagram.*10.*conflicting/);
  assert.match(row('proportional'), /Pr\.129.*0\.1-1000%.*9999 means no proportional control.*100%/);
  assert.match(row('integral'), /Pr\.130.*0\.1-3600 s.*9999 means no integral control.*1 s/);
  assert.match(row('derivative'), /Pr\.134.*0\.01-10 s.*9999 means no differential/);
  assert.match(row('filter'), /Pr\.74.*0-8.*5 ms to 1 s.*not a direct seconds setting/);
  assert.match(row('ramps'), /Pr\.7 \/ Pr\.8 \/ Pr\.20.*referenced to Pr\.20/);
  assert.match(row('sleep'), /Pr\.575 \/ Pr\.576.*below Pr\.576.*Pr\.575 = 9999 disables/);
  assert.match(row('wake'), /Pr\.577.*minus 1000%.*setpoint minus measured.*automatically resumes.*not an absolute pressure/);
  assert.match(row('fault'), /Pr\.65 \/ Pr\.67 \/ Pr\.68 \/ Pr\.69.*automatically|Pr\.65 \/ Pr\.67 \/ Pr\.68 \/ Pr\.69.*Automatic retry resets/);
  assert.match(row('boost'), /Not mapped.*do not assume the FR-F800/);
  const r = app.create('d700');
  r.values.wake.baseline = 'Site setting';
  const text = app.text(r);
  assert.match(text, /Panel procedure.*PU\/EXT.*MODE.*SET/);
  assert.match(text, /Applied pp\. 213, 218/);
  assert.match(text, /Commissioned baseline: Site setting/);
  assert.doesNotMatch(text, /FR-F800 \/ -E reference|ABB Rev C reference/);
  for (const profile of ['f800e', 'acq580', 'acs550', 'other']) {
    assert.doesNotMatch(app.text(app.create(profile)), /FR-D700 Basic D \/ Applied H reference|Panel procedure \(Basic manual/);
  }
});

test('D700 profile renders separately and preserves existing worksheets', () => {
  const app = load(), existing = app.create('f800e');
  existing.id='old'; existing.savedAt='2026-11-07'; existing.meta.asset='Existing'; existing.meta.model='FR-F800-E';
  existing.values.integral.baseline='20';
  app.data.set(app.key, JSON.stringify([existing]));
  app.open(false);
  app.nodes['#vfd_newprofile'].value='d700';
  app.click('vfd_new');
  assert.match(app.bench.markup, /Panel: reading and authorized changes/);
  assert.match(app.bench.markup, /conflicting PID-action label in the sleep diagram/);
  assert.match(app.bench.markup, /No D700 sleep-boost mapping is established/);
  assert.ok(Object.values(app.draft().values).every(v=>Object.values(v).every(x=>x==='')));
  app.input('vfd_meta_asset','Legacy pump');
  app.input('vfd_meta_model','FR-D740');
  app.input('vfd_integral_baseline','12');
  app.click('vfd_notes');
  assert.match(app.notes[0], /Mitsubishi FR-D700 Basic D \/ Applied H reference Pr\.130/);
  app.click('vfd_save');
  assert.equal(app.read()[0].values.integral.baseline,'20');
  assert.equal(app.read()[1].values.integral.baseline,'12');
  app.change('vfd_records','old');
  assert.doesNotMatch(app.bench.markup, /Panel: reading and authorized changes|FR-D700 Basic D \/ Applied H reference/);
});

test('FR-F800 and Ethernet references preserve distinct sources, scope and model-specific semantics', () => {
  const app = load(), refs = app.f800References;
  assert.match(app.f800Source, /FR-F800 Instruction Manual.*292550 Version B.*2015-12-03.*FR-A800-E \/ FR-F800-E.*IB\(NA\)-0600628ENG-B.*2016-11/);
  assert.match(app.f800Context, /exact revision\/firmware compatibility.*not established.*Pr\.128.*Pr\.753/);
  for (const [id] of app.items) {
    assert.ok(refs[id]?.length, `Missing FR-F800 reference for ${id}`);
    for (const [, description, page] of refs[id]) {
      assert.ok(description);
      assert.match(page, /^(detailed|Ethernet) pp?\. /);
    }
  }
  const row = id => refs[id].map(item => item.join(' ')).join(' ');
  assert.match(row('feedback'), /Pr\.128, Pr\.609 \/ Pr\.610.*Pr\.753, Pr\.1140 \/ Pr\.1141.*not always terminal 4/);
  assert.match(row('direction'), /Pr\.128 \/ Pr\.753.*inverted calibration/);
  assert.match(row('proportional'), /Pr\.129 \/ Pr\.756.*0\.1-1000%.*9999.*Smaller band means stronger/);
  assert.match(row('integral'), /Pr\.130 \/ Pr\.757.*0\.1-3600 s.*9999 selects no integral/);
  assert.match(row('derivative'), /Pr\.134 \/ Pr\.758.*0\.01-10 s.*9999 selects no differential/);
  assert.match(row('filter'), /Pr\.74.*0-8.*not a time value in seconds/);
  assert.match(row('minimum'), /Pr\.2.*5-171/);
  assert.match(row('maximum'), /Pr\.1 \/ Pr\.18.*5-171/);
  assert.match(row('ramps'), /Pr\.7 \/ Pr\.8 \/ Pr\.20.*relative to Pr\.20/);
  assert.match(row('sleep'), /Pr\.575.*Pr\.576.*Pr\.577.*Pr\.1147.*Pr\.1148.*Pr\.1149.*575 = 9999/);
  assert.match(row('sleep'), /Pr\.1364 \/ Pr\.1365.*Motor operation can occur during sleep/);
  assert.match(row('wake'), /Pr\.577 \/ Pr\.1149; Pr\.1368.*not an absolute pressure.*Pr\.577 minus 1000%.*reversed scaling/);
  assert.match(row('boost'), /Pr\.1366 \/ Pr\.1367 \/ Pr\.1368.*1366 = 9999.*PID continues/);
  assert.match(row('boost'), /Pr\.127 \/ Pr\.760-764.*separate from sleep boost and pressure-tank precharge/);
  assert.match(row('setpoint'), /Pr\.550 \/ Pr\.551.*NET-mode.*PU-mode.*550 = 5.*9999/);
  assert.match(row('setpoint'), /Pr\.338 \/ Pr\.339.*Instruction Manual \(Detailed\).*do not establish the active PID setpoint/);
  assert.match(row('fault'), /Pr\.65 \/ Pr\.67 \/ Pr\.68.*automatically reset and restart/);
  assert.match(row('fault'), /Pr\.502 \/ Pr\.779; Pr\.1431 \/ Pr\.1432.*1431 = 3 or 1432 not 9999.*restart or continue/);
  assert.match(row('fault'), /Pr\.342.*RAM-only changes clear on power-off.*panel shows EEPROM/);
  const r = app.create('f800e');
  r.values.setpoint.parameter = 'Vendor path';
  const text = app.text(r);
  assert.match(text, /Mitsubishi FR-F800 \/ -E reference Pr\.550 \/ Pr\.551.*Ethernet pp\. 9-12/);
  assert.match(text, /Mitsubishi FR-F800 \/ -E reference Pr\.130 \/ Pr\.757.*detailed pp\./);
  assert.match(text, /Parameter\/menu \(site-entered\): Vendor path/);
  assert.doesNotMatch(text, /ABB Rev C reference|ABB ACS550 Rev H reference/);
  app.open(false);
  app.nodes['#vfd_newprofile'].value = 'f800e';
  app.click('vfd_new');
  assert.match(app.bench.markup, /2015 detailed manual predates the -E supplement/);
  assert.match(app.bench.markup, /Pr\.130 \/ Pr\.757/);
  assert.match(app.bench.markup, /Pr\.502 \/ Pr\.779/);
  assert.equal(app.draft().values.setpoint.parameter, '');
});

test('existing Mitsubishi worksheet fields and other drive profiles remain unchanged', () => {
  const app = load(), r = app.create('f800e');
  r.id = 'mitsubishi-existing'; r.savedAt = '2026-11-07'; r.meta.asset = 'Existing'; r.meta.model = 'FR-F800-E';
  r.values.integral = {parameter:'Vendor P130', units:'s', baseline:'18', current:'20', factory:'', reference:'Station drawing'};
  const stored = JSON.stringify([r]);
  app.data.set(app.key, stored);
  app.open(false);
  app.change('vfd_records', r.id);
  assert.equal(app.data.get(app.key), stored);
  assert.equal(app.draft().values.integral.baseline, '18');
  assert.equal(app.draft().values.integral.current, '20');
  assert.equal(app.draft().values.integral.factory, '');
  assert.match(app.text(app.draft()), /Parameter\/menu \(site-entered\): Vendor P130/);
  for (const key of ['acq580', 'acs550', 'intellidrive', 'atv600', 'other']) {
    assert.doesNotMatch(app.text(app.create(key)), /Pr\.1366 \/ Pr\.1367 \/ Pr\.1368|Mitsubishi FR-F800 \/ -E reference/);
  }
});

test('ACS550 mappings identify firmware, PID sets and model-specific sleep and fault semantics', () => {
  const app = load(), refs = app.acsReferences;
  assert.match(app.acsSource, /ACS550-01\/U1.*3AFE64804588.*3AUA0000001418.*Rev H.*2014-07-04/);
  assert.match(app.acsContext, /3\.14e or later.*3301.*group 40.*group 41.*4027.*Group 42.*1106 = 19/);
  for (const [id] of app.items) {
    assert.ok(refs[id]?.length, `Missing ACS550 reference for ${id}`);
    for (const [number, description, page] of refs[id]) {
      assert.ok(number && description);
      assert.match(page, /pp\./);
    }
  }
  const row = id => refs[id].map(item => item.join(' ')).join(' ');
  assert.match(row('feedback'), /1301-1306.*4014-4021 \/ 4114-4121/);
  assert.match(row('setpoint'), /1106 = 19.*4010-4013 \/ 4110-4113/);
  assert.match(row('direction'), /4005 \/ 4105.*reference minus feedback/);
  assert.match(row('proportional'), /4001 \/ 4101.*0\.1-100\.0.*1\.0/);
  assert.match(row('integral'), /4002 \/ 4102.*0\.0 disables.*0\.1-3600\.0 s.*60\.0 s/);
  assert.match(row('derivative'), /4003-4004 \/ 4103-4104.*0\.0 s and 1\.0 s/);
  assert.match(row('ramps'), /2202\/2203.*2008.*2204/);
  assert.match(row('sleep'), /4022-4024 \/ 4122-4124.*selection 7.*digital-input.*speed\/frequency/);
  assert.match(row('wake'), /4025-4026 \/ 4125-4126.*not absolute pressure.*4006\/4007.*inversion/);
  assert.match(row('boost'), /Not mapped.*do not assume the ACQ580/);
  assert.match(row('fault'), /1604; 3101-3108.*restart.*safety review/);
});

test('ACS550 records persist independently with model-specific references in render and Notes', () => {
  const app = load(), existing = app.create('acq580');
  existing.id = 'acq-existing'; existing.savedAt = '2026-11-07'; existing.meta.asset = 'Existing'; existing.meta.model = 'ACQ580';
  existing.values.wake.baseline = '5 psi';
  app.data.set(app.key, JSON.stringify([existing]));
  app.open(false);
  app.nodes['#vfd_newprofile'].value = 'acs550';
  app.click('vfd_new');
  assert.match(app.bench.markup, /ABB ACS550-01\/U1 Rev H reference/);
  assert.match(app.bench.markup, /4025-4026 \/ 4125-4126/);
  assert.doesNotMatch(app.bench.markup, /40\.47-40\.48/);
  assert.ok(Object.values(app.draft().values).every(v => Object.values(v).every(x => x === '')));
  app.input('vfd_meta_asset', 'Legacy pump');
  app.input('vfd_meta_model', 'ACS550-U1');
  app.input('vfd_wake_parameter', 'Site value');
  app.input('vfd_wake_baseline', '8 psi');
  app.click('vfd_notes');
  assert.match(app.notes[0], /ABB ACS550 Rev H reference 4025-4026 \/ 4125-4126/);
  assert.match(app.notes[0], /Firmware|firmware/);
  assert.match(app.notes[0], /Parameter\/menu \(site-entered\): Site value/);
  assert.doesNotMatch(app.notes[0], /40\.47-40\.48/);
  app.click('vfd_save');
  const records = app.read();
  assert.equal(records.length, 2);
  assert.equal(records[0].values.wake.baseline, '5 psi');
  assert.equal(records[1].profile, 'acs550');
  assert.equal(records[1].values.wake.baseline, '8 psi');
  assert.equal(records[1].values.wake.factory, '');
  app.change('vfd_records', existing.id);
  assert.match(app.bench.markup, /40\.47-40\.48/);
  assert.doesNotMatch(app.bench.markup, /4025-4026 \/ 4125-4126/);
});

test('ACQ580 references are revision-specific and distinguish PID sets, actuals, scaling and safety', () => {
  const app = load(), refs = app.acqReferences;
  assert.match(app.acqSource, /3AXD50000035867 Rev C.*2017-06-21.*2\.03\.0\.0/);
  assert.match(app.acqContext, /07\.05.*40\.06 bit 10.*40\.57.*group 40.*group 41/);
  for (const [id] of app.items) {
    assert.ok(refs[id]?.length, `Missing reference for ${id}`);
    for (const [number, description, page] of refs[id]) {
      assert.match(number, /\d+\.\d+/);
      assert.ok(description);
      assert.match(page, /pp\./);
    }
  }
  const row = id => refs[id].map(item => item.join(' ')).join(' ');
  assert.match(row('feedback'), /12\.21 \/ 12\.22; 12\.25-12\.30; 12\.102/);
  assert.match(row('feedback'), /40\.14-40\.15.*not transmitter minimum and maximum/);
  assert.match(row('feedback'), /40\.02.*read-only/);
  assert.match(row('setpoint'), /40\.03.*read-only.*internal values are not automatically active/);
  assert.match(row('direction'), /40\.31 \/ 41\.31.*setpoint minus feedback/);
  assert.match(row('proportional'), /40\.32 \/ 41\.32.*0\.10-100\.00.*1\.00 s.*no unit/);
  assert.match(row('integral'), /40\.33 \/ 41\.33.*10\.0 s.*3\.0 s.*0 disables/);
  assert.match(row('minimum'), /30\.11.*30\.13.*separate/);
  assert.match(row('maximum'), /30\.12.*30\.14.*separate/);
  assert.match(row('ramps'), /speed-reference.*not 30\.12.*frequency-reference/);
  assert.match(row('sleep'), /40\.43-40\.44 \/ 41\.43-41\.44.*40\.01.*0 disables.*60\.0 s/);
  assert.match(row('wake'), /40\.47-40\.48 \/ 41\.47-41\.48.*not absolute pressure.*0\.50 s/);
  assert.match(row('fault'), /31\.11-31\.16.*automatic reset can restart/);
});

test('ACQ580 references render and export separately without changing existing site data', () => {
  const app = load(), r = app.create('acq580');
  r.id = 'existing'; r.savedAt = '2026-11-07'; r.meta.asset = 'Existing'; r.meta.model = 'ACQ580';
  r.values.wake = {parameter: 'Vendor reference', units: 'psi', baseline: '15', current: '12', factory: '', reference: 'Station drawing'};
  const stored = JSON.stringify([r]);
  app.data.set(app.key, stored);
  app.open(false);
  app.change('vfd_records', r.id);
  assert.equal(app.data.get(app.key), stored);
  assert.equal(app.draft().values.wake.parameter, 'Vendor reference');
  assert.equal(app.draft().values.wake.baseline, '15');
  assert.equal(app.draft().values.wake.factory, '');
  assert.match(app.bench.markup, /ABB ACQ580 Rev C reference/);
  assert.match(app.bench.markup, /40\.47-40\.48 \/ 41\.47-41\.48/);
  const text = app.text(app.draft());
  assert.match(text, /program 2\.03\.0\.0/);
  assert.match(text, /40\.47-40\.48 \/ 41\.47-41\.48.*not absolute pressure/);
  assert.match(text, /Parameter\/menu \(site-entered\): Vendor reference/);
  assert.match(text, /Commissioned baseline: 15/);
  assert.doesNotMatch(text, /Manufacturer parameter numbers, ranges\/defaults and revision\/page mappings: pending/);
  for (const profile of ['intellidrive', 'atv600', 'other']) {
    const other = app.create(profile);
    const otherText = app.text(other);
    if (profile !== 'intellidrive') assert.match(otherText, /pending document-level verification/);
    assert.doesNotMatch(otherText, /ABB Rev C reference|40\.47-40\.48/);
    app.nodes['#vfd_newprofile'].value = profile;
    app.click('vfd_new');
    assert.doesNotMatch(app.bench.markup, /ABB ACQ580 Rev C reference|40\.47-40\.48/);
  }
  assert.equal(app.data.get(app.key), stored);
});

test('symptom paths reference real functions and preserve control/protection prerequisites', () => {
  const app = load(), ids = new Set(app.items.map(([id]) => id));
  assert.equal(Object.keys(app.symptoms).length, 8);
  for (const item of Object.values(app.symptoms)) {
    assert.ok(item.steps.length >= 3);
    assert.ok(item.rows.length > 0);
    assert.ok(item.rows.every(id => ids.has(id)));
  }
  assert.match(app.symptoms.hunting.steps.join(' '), /sensor.*gauge.*before touching PID/);
  assert.match(app.symptoms.nowake.steps.join(' '), /PLC or station controller/);
  assert.match(app.symptoms.retry.steps.join(' '), /Never add retries or bypass protections/);
  assert.match(app.symptoms.nosleep.steps.join(' '), /Do not raise pressure or lower protective limits/);
  assert.match(app.items.find(([id]) => id === 'proportional')[2], /gain.*band/);
  assert.match(app.items.find(([id]) => id === 'integral')[2], /time versus integral gain/);
});

test('comparison distinguishes unknowns and textual differences without numeric conversions', () => {
  const {compare} = load();
  assert.equal(compare({baseline: '', current: ''}), 'Not recorded');
  assert.match(compare({baseline: '', current: '30 Hz'}), /Baseline unknown/);
  assert.match(compare({baseline: '30', current: ''}), /Current value not recorded/);
  assert.match(compare({baseline: ' 30  Hz ', current: '30 Hz'}), /Same recorded text/);
  assert.match(compare({baseline: '30', current: '30.0'}), /Different recorded text/);
  assert.match(compare({baseline: '1 s', current: '1000 ms'}), /not a fault verdict/);
});

test('Notes export includes model, provenance, all records and safe before/after observations', () => {
  const app = load(), r = app.create('f800e');
  r.meta.asset = 'Pump station A';
  r.meta.vendor = 'Commissioning record v2';
  r.meta.owner = 'PLC';
  r.symptom = 'cycling';
  r.values.proportional = {parameter: 'Site entry', units: 'band %', baseline: '40', current: '50', factory: '100', reference: 'Vendor document rev B p12'};
  r.observations = '09:00 pressure / setpoint / Hz / flow; no changes made.';
  const text = app.text(r);
  assert.match(text, /Mitsubishi FR-F800-E/);
  assert.match(text, /Commissioning record v2/);
  assert.match(text, /Pressure-control owner.*PLC/);
  assert.match(text, /Commissioned baseline: 40/);
  assert.match(text, /Observed current: 50/);
  assert.match(text, /factory default \(reference only\): 100/);
  assert.match(text, /Vendor document rev B p12/);
  assert.match(text, /09:00 pressure/);
  assert.match(text, /no drive connection, programming or automatic tuning/);
  assert.match(text, /exact revision\/firmware compatibility.*not established/);
  assert.match(text, /retain rollback values/);
  for (const [, label] of app.items) assert.ok(text.includes(label));
});

test('storage validation rejects corrupt, unknown-version and duplicate data without replacing it', () => {
  const app = load();
  assert.equal(app.read().length, 0);
  const r = app.create();
  r.id = 'one'; r.savedAt = '2026-11-07T00:00:00.000Z';
  for (const raw of ['{', '{}', JSON.stringify([r, r]), JSON.stringify([{...r, profile: 'unrecognized'}]), JSON.stringify([{...r, values: {}}])]) {
    app.data.set(app.key, raw);
    assert.throws(() => app.read());
    assert.equal(app.data.get(app.key), raw);
    app.open(false);
    assert.equal(app.nodes['#vfd_save'].disabled, true);
    assert.match(app.nodes['#vfd_status'].textContent, /Cannot read saved drive worksheets/);
  }
});

test('save requires asset/model, persists independent records and never auto-updates the baseline', () => {
  const app = load();
  app.open(false);
  app.click('vfd_save');
  assert.match(app.nodes['#vfd_status'].textContent, /Enter a site \/ asset identifier and exact drive model/);
  assert.equal(app.data.size, 0);
  app.input('vfd_meta_asset', 'Site A');
  app.input('vfd_meta_model', 'ACQ580-01');
  app.input('vfd_proportional_baseline', '2');
  app.input('vfd_proportional_current', '3');
  app.click('vfd_save');
  const first = app.read()[0];
  assert.equal(first.values.proportional.baseline, '2');
  assert.equal(first.values.proportional.current, '3');
  assert.equal(app.dirty(), false);
  app.nodes['#vfd_newprofile'].value = 'f800e';
  app.click('vfd_new');
  assert.equal(app.draft().profile, 'f800e');
  assert.equal(app.draft().values.proportional.baseline, '');
  app.input('vfd_meta_asset', 'Site B');
  app.input('vfd_meta_model', 'FR-F800-E');
  app.click('vfd_save');
  assert.equal(app.read().length, 2);
  app.change('vfd_records', first.id);
  assert.equal(app.draft().values.proportional.baseline, '2');
  app.input('vfd_proportional_current', '4');
  assert.equal(app.read()[0].values.proportional.current, '3');
  assert.equal(app.draft().values.proportional.baseline, '2');
  app.confirm(false);
  app.click('vfd_save');
  assert.equal(app.read()[0].values.proportional.current, '3');
  app.confirm(true);
  app.click('vfd_save');
  assert.equal(app.read()[0].values.proportional.current, '4');
  assert.equal(app.read()[1].meta.asset, 'Site B');
});

test('unsaved draft survives navigation and cancellation; storage failure stays explicit', () => {
  const app = load();
  app.open(false);
  app.input('vfd_meta_asset', 'Keep me');
  app.input('vfd_meta_model', 'ACQ580');
  app.input('vfd_meta_owner', 'Station PLC');
  app.change('vfd_symptom', 'hunting');
  assert.match(app.nodes['#vfd_steps'].innerHTML, /Station PLC/);
  assert.equal(app.nodes['#vfd_section_proportional'].open, true);
  app.open(false);
  assert.equal(app.draft().meta.asset, 'Keep me');
  assert.match(app.nodes['#vfd_status'].textContent, /Unsaved/);
  app.nodes['#vfd_newprofile'].value = 'other';
  app.confirm(false);
  app.click('vfd_new');
  assert.equal(app.draft().meta.asset, 'Keep me');
  app.failStorage(true);
  app.click('vfd_save');
  assert.match(app.nodes['#vfd_status'].textContent, /Worksheet NOT saved.*quota denied/);
  assert.equal(app.dirty(), true);
  assert.equal(app.data.size, 0);
  app.click('vfd_notes');
  assert.match(app.notes[0], /Keep me/);
});

test('existing storage is re-read when saving so another asset is not lost', () => {
  const app = load();
  app.open(false);
  app.input('vfd_meta_asset', 'New asset');
  app.input('vfd_meta_model', 'ACQ580');
  const other = app.create('atv600');
  other.id = 'other-tab'; other.savedAt = '2026-11-07'; other.meta.asset = 'Saved elsewhere'; other.meta.model = 'ATV630';
  app.data.set(app.key, JSON.stringify([other]));
  app.click('vfd_save');
  assert.equal(app.read().length, 2);
  assert.equal(app.read()[0].id, 'other-tab');
});

test('additional stored row metadata does not bind nonexistent controls', () => {
  const app = load(), r = app.create();
  r.id = 'extra-metadata'; r.savedAt = '2026-11-07'; r.meta.asset = 'Existing'; r.meta.model = 'ACQ580';
  r.values.proportional.extra = 'Unknown metadata is not a form control';
  app.data.set(app.key, JSON.stringify([r]));
  app.open(false);
  app.change('vfd_records', r.id);
  assert.equal(app.draft().meta.asset, 'Existing');
  app.input('vfd_proportional_current', '2');
  assert.match(app.nodes['#vfd_compare_proportional'].textContent, /Baseline unknown/);
});

test('user-entered fields are escaped on render rather than interpreted as markup', () => {
  const app = load();
  app.open(false);
  app.input('vfd_meta_asset', '"><img src=x onerror=alert(1)>');
  app.input('vfd_proportional_parameter', '<script>alert(1)</script>');
  app.open(false);
  assert.ok(app.bench.markup.includes('&lt;img'));
  assert.ok(app.bench.markup.includes('&lt;script&gt;'));
  assert.ok(!app.bench.markup.includes('<img src=x'));
});

test('guide remains a reference, reachable from VFD menu, tab and pressure-hunting path', () => {
  assert.match(html, /Commissioned drive setup & PID troubleshooting','view','vfdsetup'/);
  assert.match(html, /tabsDef\.push\(\['vfdsetup','Drive setup \/ PID'\]\)/);
  assert.match(html, /if\(k==='vfdsetup'\)\{openVfdSetup\(s\);return\}/);
  assert.match(html, /'VFD booster pump PID tuning hunting acceleration deceleration','vfdsetup'/);
  assert.match(html, /OPEN DRIVE SETUP GUIDE/);
  assert.doesNotMatch(html, /vfdsetup:\{name:/);
});

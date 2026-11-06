const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const base = html.slice(html.indexOf('const f1='), html.indexOf('const PARTS='));
const landscape = html.slice(
  html.indexOf('/* ---------- landscape technical references ---------- */'),
  html.indexOf('/* ---------- filtration catalog references ---------- */')
);
const tools = vm.runInNewContext(`${base}\n${landscape}\ntools`, { PARTS: [], esc: String });
const init = html.slice(html.indexOf('function initQuickCalculators(){'), html.indexOf('function openDec('));

function load(saved = 'pressure_head') {
  const selected = [];
  const stored = {};
  const nodes = {
    '#quick_calc': {
      value: '',
      options: [],
      appendChild(option) { this.options.push(option); },
      addEventListener(event, callback) { assert.equal(event, 'change'); this.change = callback; }
    },
    '#quickConverter': {},
    '#quickCalc': {}
  };
  vm.runInNewContext(`${init}\ninitQuickCalculators()`, {
    tools,
    $: selector => nodes[selector],
    store: {get: () => saved, set: (key, value) => { stored[key] = value; }},
    document: {createElement: tag => { assert.equal(tag, 'option'); return {}; }},
    mountCalc: (selector, key) => selected.push([selector, key])
  });
  return {nodes, selected, stored};
}

test('quick dropdown includes every calculator exactly once, including contextual lookups', () => {
  const {nodes} = load();
  const options = nodes['#quick_calc'].options;
  assert.equal(options.length, Object.keys(tools).length);
  assert.equal(new Set(options.map(o => o.value)).size, options.length);
  for (const [key, tool] of Object.entries(tools)) {
    assert.ok(options.some(o => o.value === key && o.textContent === tool.name), key);
  }
  for (const key of ['tdh', 'sys', 'pipe', 'convwire', 'pathwire', 'dec_hunter', 'dec_rb',
    'landprecip', 'landwire', 'hdlrun', 'ph3', 'coords']) assert.ok(tools[key], key);
});

test('all quick selections mount locally and converter restores without a calculator instance', () => {
  const {nodes, selected, stored} = load();
  const select = nodes['#quick_calc'];
  assert.equal(nodes['#quickConverter'].hidden, false);
  assert.equal(nodes['#quickCalc'].hidden, true);
  for (const key of Object.keys(tools)) {
    select.value = key;
    select.change();
    assert.deepEqual(selected.at(-1), ['#quickCalc', key]);
    assert.equal(nodes['#quickConverter'].hidden, true);
    assert.equal(nodes['#quickCalc'].hidden, false);
    assert.equal(stored.tracerQuickCalculator, key);
  }
  select.value = 'pressure_head';
  select.change();
  assert.equal(nodes['#quickConverter'].hidden, false);
  assert.equal(nodes['#quickCalc'].hidden, true);
  assert.equal(nodes['#quickCalc'].innerHTML, '');
});

test('quick calculator restores selection and falls back for removed tools', () => {
  assert.deepEqual(load('pipe').selected, [['#quickCalc', 'pipe']]);
  assert.equal(load('psrwire').nodes['#quick_calc'].value, 'pressure_head');
});

test('embedded controls are instance-scoped and optional inputs remain supported', () => {
  const mount = html.slice(html.indexOf('function mountCalc('), html.indexOf('function initQuickCalculators('));
  assert.match(mount, /prefix=host\.id\+'\s*_'/);
  assert.match(mount, /!\['r','gauge','ref','vs'\]\.includes\(id\)/);
  assert.match(mount, /data-calc-notes/);
  assert.match(mount, /bindCoordinateCopy\(output,v\)/);
  assert.doesNotMatch(html, /id="cpc"/);
  assert.match(html, /id="quick_calc"/);
  assert.match(html, /id="quickConverter"/);
});

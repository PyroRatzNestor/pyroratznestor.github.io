const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'dashboard.html'), 'utf8');
const dataSource = fs.readFileSync(path.join(root, 'data/troubleshooting.js'), 'utf8');
const validationSource = fs.readFileSync(path.join(root, 'assets/troubleshooting.js'), 'utf8');
const content = JSON.parse(JSON.stringify(vm.runInNewContext(dataSource + '\nTRACER_TROUBLESHOOTING')));
const {validate} = vm.runInNewContext(validationSource + '\nTRACER_TECHNIQUES_API', {URL});
const base = html.slice(html.indexOf('const f1='), html.indexOf('const PARTS='));
const landscape = html.slice(
  html.indexOf('/* ---------- landscape technical references ---------- */'),
  html.indexOf('/* ---------- filtration catalog references ---------- */')
);
const tools = vm.runInNewContext(`${base}\n${landscape}\ntools`, { PARTS: [], esc: String });
const toolKeys = [...Object.keys(tools), 'vfdsetup'];
const clone = () => JSON.parse(JSON.stringify(content));
const renderer = html.slice(
  html.indexOf('let diagnosticLibrary=null'),
  html.indexOf('/* ---------- commissioned drive setup ---------- */')
);
const escape = value => String(value).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function app(library = clone(), api = {validate}) {
  const nodes = {}, notes = [], calls = [], errors = [];
  let buttons = [];
  const bench = {
    markup: '',
    set innerHTML(markup) {
      this.markup = markup;
      for (const key of Object.keys(nodes)) delete nodes[key];
      for (const [, id] of markup.matchAll(/\bid="([^"]+)"/g)) nodes['#' + id] = {};
      buttons = [...markup.matchAll(/data-i="(\d+)"/g)].map(([, i]) => ({dataset: {i}}));
    }
  };
  const status = {hidden: true, textContent: ''};
  const picker = {
    '#techniqueSelect': {value: '', disabled: true, options: [], appendChild(option) { this.options.push(option); }},
    '#techniqueOpen': {disabled: true},
    '#techniqueStatus': {textContent: ''},
    '#techniquePicker': {}
  };
  const context = {
    TRACER_TROUBLESHOOTING: library, TRACER_TECHNIQUES_API: api,
    tools, URL, esc: escape,
    $: selector => selector === '#bench' ? bench : selector === '#portalRouteStatus' ? status : picker[selector] || nodes[selector],
    $$: () => buttons,
    console: {error: message => errors.push(message)},
    prof: () => ({make: 'Test equipment'}), skipProfile: false,
    setTabs() {}, scrollBench() {}, gate: () => calls.push(['gate']),
    hints: () => ['Use the installed manual.'], litButtons() {},
    go: query => calls.push(['search', query]), withBrand: query => query,
    openTool: (...args) => calls.push(['tool', ...args]),
    appendNote: text => notes.push(text)
  };
  context.document = {createElement: tag => { assert.equal(tag, 'option'); return {}; }};
  const {openFlow, initTechniquePicker} = vm.runInNewContext(renderer + '\n({openFlow,initTechniquePicker})', context);
  return {
    open: key => openFlow(key, false),
    choose: index => { assert.ok(buttons[index], 'decision option exists'); buttons[index].onclick(); },
    click: selector => { assert.ok(nodes[selector]?.onclick, selector); nodes[selector].onclick(); },
    markup: () => bench.markup, notes, calls, status, errors,
    initPicker: initTechniquePicker, picker
  };
}

test('techniques validate against real calculator links and load before the dashboard application', () => {
  assert.equal(validate(content, toolKeys), content);
  const data = html.indexOf('<script src="data/troubleshooting.js">');
  const validation = html.indexOf('<script src="assets/troubleshooting.js">');
  assert.ok(data > 0 && validation > data && html.indexOf('let diagnosticLibrary=null') > validation);
});

test('invalid content cannot claim review or manufacturer support without review records and citations', () => {
  const cases = [
    [lib => { lib.schemaVersion = 2; }, /schemaVersion/],
    [lib => { lib.techniques.hunt.symptom = ''; }, /symptom/],
    [lib => { lib.techniques.hunt.safetyPrerequisites = []; }, /safetyPrerequisites/],
    [lib => { lib.techniques.hunt.verification = []; }, /verification/],
    [lib => { lib.techniques.hunt.review.status = 'approved'; }, /review/],
    [lib => { lib.techniques.hunt.review.status = 'reviewed'; }, /reviewedOn/],
    [lib => { lib.techniques.hunt.review.reviewedOn = '2026-02-30'; }, /reviewedOn/],
    [lib => { lib.techniques.hunt.evidence.kind = 'manufacturer-backed'; }, /exact citations/],
    [lib => { lib.techniques.hunt.evidence.sources = [{title: 'Manual', revision: '', locator: 'p. 10'}]; }, /revision/],
    [lib => { lib.techniques.hunt.evidence.sources = [{title: 'Manual', revision: 'A', locator: 'p. 10', url: 'javascript:alert(1)'}]; }, /HTTP/]
  ];
  for (const [mutate, expected] of cases) {
    const library = clone(); mutate(library);
    assert.throws(() => validate(library, toolKeys), expected);
  }
  const reviewed = clone();
  reviewed.techniques.hunt.review = {status: 'reviewed', reviewedOn: '2026-11-10', note: 'Test fixture review, not a real approval.'};
  reviewed.techniques.hunt.reviewFlags = [];
  reviewed.techniques.hunt.evidence = {kind: 'manufacturer-backed', note: 'Test fixture only.', sources: [{title: 'Test manual', revision: 'Rev A', locator: 'p. 10', url: 'https://example.test/manual'}]};
  assert.equal(validate(reviewed, toolKeys), reviewed);
});

test('broken decisions, tool links, unreachable nodes and local or cross-technique cycles are rejected', () => {
  for (const [mutate, expected] of [
    [lib => { lib.techniques.hunt.start = 'missing'; }, /start/],
    [lib => { lib.techniques.hunt.nodes.a.options[0].next = 'missing'; }, /unknown decision/],
    [lib => { lib.techniques.hunt.nodes.a.options[0].next = 'flow:missing'; }, /unknown technique/],
    [lib => { lib.techniques.hunt.nodes.t1.tool = 'missing'; }, /unknown calculator/],
    [lib => { lib.techniques.hunt.nodes.a.options[0].next = 'a'; }, /cycle/],
    [lib => { lib.techniques.hunt.nodes.a.options[0].next = 'flow:hunt'; }, /cycle/],
    [lib => { lib.techniques.hunt.nodes.orphan = {...lib.techniques.hunt.nodes.t1}; }, /unreachable/]
  ]) {
    const library = clone(); mutate(library);
    assert.throws(() => validate(library, toolKeys), expected);
  }
});

test('every local decision route renders, logs evidence and verification, and can restart', () => {
  const instance = app();
  for (const [id, technique] of Object.entries(content.techniques)) {
    if (technique.review.status === 'draft') {
      instance.open(id);
      assert.match(instance.markup(), /Draft techniques cannot be run/);
      assert.doesNotMatch(instance.markup(), /data-i=/);
      continue;
    }
    const paths = [];
    function walk(nodeId, options) {
      const node = technique.nodes[nodeId];
      if (node.result) { paths.push({options, node}); return; }
      node.options.forEach((option, index) => {
        if (!option.next.startsWith('flow:')) walk(option.next, [...options, index]);
      });
    }
    walk(technique.start, []);
    for (const {options, node} of paths) {
      instance.open(id);
      const reviewLabel = technique.review.status === 'reviewed' ? 'Technically reviewed' : 'Needs technical review';
      assert.ok(instance.markup().includes(reviewLabel));
      for (const index of options) instance.choose(index);
      assert.ok(instance.markup().includes(escape(node.domain)), id);
      assert.match(instance.markup(), /not a confirmed diagnosis/);
      for (const item of technique.verification) assert.ok(instance.markup().includes(escape(item)));
      instance.click('#fn');
      const note = instance.notes.at(-1);
      assert.ok(note.includes('Technique: ' + id + ' | Revision: ' + technique.revision));
      assert.ok(note.includes(node.measurements.join('; ')));
      assert.ok(note.includes(technique.verification.join('; ')));
      if (!technique.evidence.sources.length) assert.match(note, /No verified path-level citation/);
      for (const source of technique.evidence.sources) assert.ok(note.includes(source.title + ' | ' + source.revision + ' | ' + source.locator));
      assert.ok(note.includes(reviewLabel));
      if (node.tool) {
        instance.click('#ft2');
        assert.deepEqual(instance.calls.at(-1), ['tool', node.tool, true]);
      }
      instance.click('#fr');
      assert.ok(instance.markup().includes(escape(technique.nodes[technique.start].question)), id);
    }
    for (const node of Object.values(technique.nodes)) {
      if (node.result) continue;
      for (const option of node.options.filter(option => option.next.startsWith('flow:'))) {
        assert.ok(content.techniques[option.next.slice(5)], id);
      }
    }
  }
});

test('cross-technique choices preserve navigation to the selected path', () => {
  const instance = app();
  instance.open('ptype');
  instance.choose(0);
  assert.ok(instance.markup().includes(content.techniques.pt_lift.title));
  assert.ok(instance.markup().includes(escape(content.techniques.pt_lift.nodes.a.question)));
});

test('playbook discovers new content without interface edits and reports missing content instead of enabling a broken menu', () => {
  const library = clone();
  library.techniques.new_path = {...JSON.parse(JSON.stringify(library.techniques.hunt)), title: 'New draft technique'};
  library.techniques.new_path.review.status = 'draft';
  const instance = app(library); instance.initPicker();
  const select = instance.picker['#techniqueSelect'];
  assert.equal(select.options.length, Object.keys(library.techniques).length);
  assert.equal(select.disabled, false);
  assert.equal(instance.picker['#techniqueOpen'].disabled, false);
  assert.ok(select.options.find(option => option.value === 'new_path').textContent.includes('Draft'));
  select.value = 'new_path';
  let prevented = false;
  instance.picker['#techniquePicker'].onsubmit({preventDefault: () => { prevented = true; }});
  assert.ok(prevented);
  assert.match(instance.markup(), /Draft techniques cannot be run/);
  const broken = app(null); broken.initPicker();
  assert.equal(broken.picker['#techniqueSelect'].disabled, true);
  assert.equal(broken.picker['#techniqueOpen'].disabled, true);
  assert.match(broken.picker['#techniqueStatus'].textContent, /unavailable/);
});

test('draft techniques cannot run, and missing or invalid content reports failure explicitly', () => {
  const draft = clone(); draft.techniques.hunt.review.status = 'draft';
  const instance = app(draft); instance.open('hunt');
  assert.match(instance.markup(), /Draft techniques cannot be run/);
  assert.doesNotMatch(instance.markup(), /data-i=/);
  for (const [library, api] of [[undefined, {validate}], [null, {validate}], [clone(), null]]) {
    const broken = app(library === undefined ? null : library, api);
    assert.equal(broken.status.hidden, false);
    assert.equal(broken.errors.length, 1);
    broken.open('hunt');
    assert.match(broken.markup(), /Troubleshooting unavailable/);
    assert.match(broken.markup(), /Calculators and saved notes remain available/);
    assert.doesNotMatch(broken.markup(), /data-i=/);
  }
  instance.open('constructor');
  assert.match(instance.markup(), /does not exist/);
});

test('metadata and citations are escaped in views and included in exported notes', () => {
  const library = clone(), technique = library.techniques.hunt;
  technique.title = '<img src=x onerror=alert(1)>';
  technique.evidence.note = '<script>not executable</script>';
  technique.reviewFlags = [{node: 'a', category: 'operating-test', note: '<img src=x onerror=alert(1)> Unreviewed test.'}];
  technique.evidence.sources = [{title: '<b>Manual</b>', revision: 'Rev "A"', locator: 'p. 10', url: 'https://example.test/?a=1&b=2'}];
  const instance = app(library); instance.open('hunt'); instance.choose(0);
  assert.ok(instance.markup().includes('&lt;img'));
  assert.ok(instance.markup().includes('&lt;script&gt;'));
  assert.ok(instance.markup().includes('href="https://example.test/?a=1&amp;b=2"'));
  assert.doesNotMatch(instance.markup(), /<img|<script>/);
  instance.click('#fn');
  assert.ok(instance.notes[0].includes('<b>Manual</b> | Rev "A" | p. 10'));
  assert.ok(instance.notes[0].includes('https://example.test/?a=1&b=2'));
  assert.ok(instance.notes[0].includes('operating-test | <img src=x onerror=alert(1)> Unreviewed test.'));
});

test('sample pressure path stops at missing evidence instead of forcing a fault classification', () => {
  const instance = app();
  instance.open('wont');
  instance.choose(2);
  assert.ok(instance.markup().includes('INSUFFICIENT EVIDENCE'));
  instance.click('#fn');
  assert.ok(instance.notes.at(-1).includes('cause is not established'));
  assert.ok(instance.notes.at(-1).includes('differential total head'));
  instance.open('wont');
  instance.choose(1);
  instance.choose(3);
  assert.ok(instance.markup().includes('INSUFFICIENT EVIDENCE'));
});

test('step-level flags appear at the affected decision/result and survive logging', () => {
  const instance = app();
  instance.open('wont');
  assert.match(instance.markup(), /Unresolved review flags/);
  assert.ok(instance.markup().includes(escape(content.techniques.wont.reviewFlags[0].note)));
  instance.choose(0);
  const flag = content.techniques.wont.reviewFlags.find(item => item.node === 'e1');
  assert.ok(instance.markup().includes(escape(flag.note)));
  instance.click('#fn');
  assert.ok(instance.notes.at(-1).includes('e1 | energized-testing | ' + flag.note));
});

test('review flags must target real steps and cannot silently coexist with technical approval', () => {
  for (const [mutate, expected] of [
    [lib => { lib.techniques.hunt.reviewFlags = 'not a list'; }, /reviewFlags/],
    [lib => { lib.techniques.hunt.reviewFlags[0].node = 'missing'; }, /unknown decision/],
    [lib => { lib.techniques.hunt.reviewFlags[0].category = 'approved'; }, /category/],
    [lib => { lib.techniques.hunt.reviewFlags[0].note = ''; }, /note/],
    [lib => { lib.techniques.hunt.review = {status: 'reviewed', reviewedOn: '2026-11-10', note: 'Test fixture only.'}; }, /resolve outstanding flags/]
  ]) {
    const library = clone(); mutate(library);
    assert.throws(() => validate(library, toolKeys), expected);
  }
});

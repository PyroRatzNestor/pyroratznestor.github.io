const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const pages = Object.fromEntries(['index.html', 'dashboard.html', 'tools.html', 'references.html', 'help.html']
  .map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
const dashboard = pages['dashboard.html'];

test('portal navigation, local assets and section links resolve without server rewrites', () => {
  for (const [file, html] of Object.entries(pages)) {
    const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
    const nav = html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/)[0];
    assert.equal([...nav.matchAll(/aria-current="page"/g)].length, 1, file);
    assert.ok(nav.includes(`href="${file}" aria-current="page"`), file);
    assert.match(html, /class="skip-link" href="#main"/);
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id);
    assert.equal(new Set(ids).size, ids.length, `${file} duplicate ids`);
    for (const [, attribute] of markup.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^https?:/.test(attribute)) continue;
      const url = new URL(attribute, `https://example.test/portal/${file}`);
      const target = url.pathname.replace('/portal/', '');
      assert.ok(fs.existsSync(path.join(root, target)), `${file}: ${attribute}`);
      if (url.hash) assert.ok(pages[target].includes(`id="${url.hash.slice(1)}"`), `${file}: ${attribute}`);
    }
    for (const [, src] of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
      assert.ok(fs.existsSync(path.join(root, src)), `${file}: ${src}`);
    }
  }
});

const routeSource = dashboard.slice(dashboard.indexOf('function initPortalRoute(){'), dashboard.indexOf('\nsetTabs();drawProfile();'));
const base = dashboard.slice(dashboard.indexOf('const f1='), dashboard.indexOf('const PARTS='));
const landscape = dashboard.slice(
  dashboard.indexOf('/* ---------- landscape technical references ---------- */'),
  dashboard.indexOf('/* ---------- filtration catalog references ---------- */')
);
const tools = vm.runInNewContext(`${base}\n${landscape}\ntools`, { PARTS: [], esc: String });

function route(search) {
  const calls = [];
  const status = {hidden: true, textContent: ''};
  vm.runInNewContext(`${routeSource}\ninitPortalRoute()`, {
    tools, URLSearchParams,
    window: {location: {search}},
    $: selector => { assert.equal(selector, '#portalRouteStatus'); return status; },
    openTool: (...args) => calls.push(['tool', ...args]),
    openFlow: (...args) => calls.push(['technique', ...args]),
    openCheck: () => calls.push(['check']),
    scrollBench: value => calls.push(['scroll', value])
  });
  return {calls, status};
}

test('all portal tool entry links resolve to real tools or special views', () => {
  for (const html of Object.values(pages)) {
    for (const [, key] of html.matchAll(/dashboard\.html\?tool=([^"#]+)"/g)) {
      const {calls, status} = route('?tool=' + key);
      assert.equal(status.hidden, true, key);
      assert.equal(calls[0][0], key === 'check' ? 'check' : 'tool', key);
    }
  }
  for (const key of Object.keys(tools)) assert.deepEqual(route('?tool=' + key).calls, [['tool', key, true]]);
  assert.deepEqual(route('?tool=check').calls, [['check'], ['scroll', true]]);
});

test('missing tool links keep the default dashboard; unknown and prototype keys show a message', () => {
  assert.deepEqual(route('').calls, []);
  for (const key of ['missing', '__proto__', 'constructor', '<script>']) {
    const {calls, status} = route('?tool=' + encodeURIComponent(key));
    assert.deepEqual(calls, []);
    assert.equal(status.hidden, false);
    assert.match(status.textContent, /not available/);
    assert.ok(!status.textContent.includes(key));
  }
});

test('technique entry links dispatch to diagnostics without changing calculator routing', () => {
  assert.deepEqual(route('?technique=hunt').calls, [['technique', 'hunt', true]]);
  assert.deepEqual(route('?technique=hunt&tool=pipe').calls, [['technique', 'hunt', true]]);
  assert.deepEqual(route('?technique=&tool=pipe').calls, [['tool', 'pipe', true]]);
});

function directory(search = '') {
  const entries = [...pages['tools.html'].matchAll(/<article class="portal-card">([\s\S]*?)<\/article>/g)]
    .map(([, html]) => ({textContent: html.replace(/<[^>]+>/g, ' '), hidden: false}));
  const events = {};
  const input = {value: '', addEventListener: (name, fn) => { events[name] = fn; }, focus: () => { input.focused = true; }};
  const count = {};
  const empty = {};
  const nodes = {
    '#directorySearch': {addEventListener: (name, fn) => { events[name] = fn; }},
    '#directoryQuery': input,
    '#directoryCount': count,
    '#directoryEmpty': empty,
    '#directoryClear': {addEventListener: (name, fn) => { events.clear = fn; }}
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/directory.js'), 'utf8'), {
    URLSearchParams, window: {location: {search}},
    document: {querySelector: selector => nodes[selector], querySelectorAll: () => entries}
  });
  return {entries, events, input, count, empty};
}

test('directory search filters by all words, supports query links and clear restores every link', () => {
  const {entries, events, input, count, empty} = directory('?q=GOLF%20precipitation');
  assert.equal(entries.filter(entry => !entry.hidden).length, 1);
  assert.match(entries.find(entry => !entry.hidden).textContent, /golf heads/);
  input.value = '  pipe   friction ';
  events.input();
  assert.equal(entries.filter(entry => !entry.hidden).length, 1);
  assert.match(entries.find(entry => !entry.hidden).textContent, /Pipe velocity/);
  input.value = 'no-such-tool';
  let prevented = false;
  events.submit({preventDefault: () => { prevented = true; }});
  assert.ok(prevented);
  assert.equal(empty.hidden, false);
  assert.match(count.textContent, /^0 of /);
  events.clear();
  assert.ok(entries.every(entry => !entry.hidden));
  assert.equal(empty.hidden, true);
  assert.equal(input.value, '');
  assert.equal(input.focused, true);
});

test('cross-page navigation guard warns for unsaved notes or worksheets, not unchanged records', () => {
  const source = dashboard.slice(
    dashboard.indexOf("window.addEventListener('beforeunload'"),
    dashboard.indexOf('/* ---------- portal entry links ---------- */')
  );
  for (const [value, savedNotesValue, vfdDirty, expected] of [
    ['', '', false, false], ['saved', 'saved', false, false],
    ['new text', 'saved', false, true], ['', 'saved', false, true],
    ['saved', 'saved', true, true]
  ]) {
    let callback;
    vm.runInNewContext(source, {
      notes: {value}, savedNotesValue, vfdDirty,
      window: {addEventListener: (name, fn) => { assert.equal(name, 'beforeunload'); callback = fn; }}
    });
    const event = {prevented: false, preventDefault() { this.prevented = true; }};
    callback(event);
    assert.equal(event.prevented, expected);
    assert.equal(event.returnValue, expected ? '' : undefined);
  }
});

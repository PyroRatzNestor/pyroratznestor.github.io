const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const source = html.slice(
  html.indexOf('/* ---------- troubleshooting topic menus ---------- */'),
  html.indexOf('/* ---------- quick psi/ft (original) ---------- */')
);
const forms = {};
const calls = [];
const { cards } = vm.runInNewContext(`${source}\n({cards})`, {
  $: selector => ({appendChild: form => { forms[selector.slice(1)] = form; }}),
  document: {createElement: tag => {
    assert.equal(tag, 'form');
    const select = {value: ''};
    return {select, querySelector: selector => {
      assert.equal(selector, 'select');
      return select;
    }};
  }},
  esc: s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
  go: query => calls.push(['search', query]),
  withBrand: query => 'Hunter ' + query,
  openTool: (key, scroll) => calls.push(['tool', key, scroll]),
  openFlow: (key, scroll) => calls.push(['flow', key, scroll])
});

test('all troubleshooting cards have labeled dropdowns retaining every topic', () => {
  assert.deepEqual(Object.keys(forms), ['c1', 'c2', 'c3']);
  for (const [id, topics] of Object.entries(cards)) {
    const form = forms[id];
    assert.equal(form.className, 'topic-menu');
    assert.ok(form.innerHTML.includes(`for="${id}_topic"`));
    assert.ok(form.innerHTML.includes(`id="${id}_topic" required`));
    assert.match(form.innerHTML, /<button type="submit">OPEN SELECTION<\/button>/);
    assert.equal([...form.innerHTML.matchAll(/<option value="\d+">/g)].length, topics.length);
    assert.equal(form.onchange, undefined);
  }
});

test('empty menu does not navigate and every topic preserves its original action', () => {
  for (const [id, topics] of Object.entries(cards)) {
    const form = forms[id];
    let prevented = false;
    form.select.value = '';
    const before = calls.length;
    form.onsubmit({preventDefault: () => { prevented = true; }});
    assert.ok(prevented);
    assert.equal(calls.length, before);
    topics.forEach(([, kind, target], index) => {
      form.select.value = String(index);
      form.onsubmit({preventDefault() {}});
      const expected = kind === 'search' ? ['search', 'Hunter ' + target]
        : [kind === 'flow' ? 'flow' : 'tool', target, true];
      assert.deepEqual(calls.at(-1), expected);
    });
  }
});

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('recent-search UI and history recording are removed', () => {
  assert.doesNotMatch(html, /id="recent"|drawRecent|tracerRecent/);
});

test('web search preserves query encoding, whitespace handling and empty-query behavior', () => {
  const opened = [];
  const go = vm.runInNewContext(
    html.slice(html.indexOf('const go='), html.indexOf('const withBrand=')) + '\ngo',
    { window: { open: (...args) => opened.push(args) } }
  );
  go('  Hunter valve & wire  ');
  go('   ');
  assert.deepEqual(opened, [
    ['https://www.google.com/search?q=Hunter%20valve%20%26%20wire', '_blank', 'noopener']
  ]);
});

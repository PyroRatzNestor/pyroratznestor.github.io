const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'dashboard.html'), 'utf8');
const root = html.match(/:root\{([^}]+)\}/)[1];
const highContrast = html.match(/body\.hc\{([^}]+)\}/)[1];
const variables = css => Object.fromEntries([...css.matchAll(/--([\w-]+):\s*(#[0-9a-f]{3,6})/gi)].map(([, key, value]) => [key, value]));
function luminance(hex) {
  const digits = hex.slice(1);
  const full = digits.length === 3 ? [...digits].map(digit => digit + digit).join('') : digits;
  const channels = full.match(/../g).map(channel => parseInt(channel, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (values[1] + 0.05) / (values[0] + 0.05);
}

test('dashboard header and document title use the new name', () => {
  assert.match(html, /<title>Technician Dashboard<\/title>/);
  assert.match(html, /<h1 class="title">Technician Dashboard<\/h1>/);
  assert.doesNotMatch(html, /TRACER \/\/ FIELD TECHNICAL DASHBOARD|Service Technician Command Center/);
});

test('theme text and controls meet contrast targets in both modes', () => {
  const normal = variables(root), high = {...normal, ...variables(highContrast)};
  for (const theme of [normal, high]) {
    for (const color of ['text', 'muted', 'cyan', 'green', 'amber', 'red']) {
      assert.ok(contrast(theme[color], theme.panel) >= 4.5, `${color} on panel`);
    }
    assert.ok(contrast('#ffffff', theme.control) >= 4.5, 'button text');
    assert.ok(contrast(theme.green, theme.control) >= 4.5, 'selected button text');
    assert.ok(contrast(theme.muted, theme.inp) >= 4.5, 'input placeholder');
    assert.ok(contrast(theme['control-line'], theme.inp) >= 3, 'input border');
    assert.ok(contrast(theme['control-line'], theme.control) >= 3, 'button border');
  }
  assert.match(html, /:focus-visible\{outline:3px solid var\(--green\)/);
  assert.match(html, /id="hc" aria-pressed="false"/);
  assert.match(html, /setAttribute\('aria-pressed',String\(enabled\)\)/);
  assert.match(html, /store\.get\('tracerHC',false\)/);
});

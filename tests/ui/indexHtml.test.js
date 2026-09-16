import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('index html keeps the entry module path independent from the deployment base url', () => {
  const indexHtml = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

  assert.match(indexHtml, /<script type="module" src="\/src\/main\.jsx"><\/script>/);
  assert.doesNotMatch(indexHtml, /<script type="module" src="%BASE_URL%src\/main\.jsx"><\/script>/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createAssetProvider } from '../src/assets.js';

test('disk and embedded providers return identical assets', async () => {
  const publicDir = new URL('../public/', import.meta.url);
  const names = ['index.html', 'styles.css', 'icons.js', 'app.js'];
  const embedded = Object.fromEntries(await Promise.all(names.map(async name => [name, await readFile(new URL(name, publicDir))])));
  const disk = createAssetProvider({ mode: 'disk', publicDir });
  const memory = createAssetProvider({ mode: 'embedded', embeddedAssets: embedded });
  for (const name of names) {
    assert.deepEqual(await memory.get(name), await disk.get(name));
    assert.equal(memory.contentType(name), disk.contentType(name));
  }
  assert.equal(await memory.get('missing.txt'), undefined);
});

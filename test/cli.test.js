import test from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs } from '../src/cli.js';

test('parses portable CLI options', () => {
  assert.deepEqual(parseArgs(['--no-open', '--port', '44000', '--codex-home', '/tmp/c', '--scan-dir', '/a', '--scan-dir', '/b']), {
    open: false, port: 44000, codexHome: '/tmp/c', scanDirs: ['/a', '/b']
  });
});

test('rejects unsafe host and invalid port', () => {
  assert.throws(() => parseArgs(['--host', '0.0.0.0']), /127\.0\.0\.1/);
  assert.throws(() => parseArgs(['--port', '70000']), /port/i);
});

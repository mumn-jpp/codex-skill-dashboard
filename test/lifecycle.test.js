import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createIdleController, acquireInstanceLock } from '../src/lifecycle.js';

test('idle controller exits once after heartbeat timeout', () => {
  let now = 0;
  let scheduled;
  let exits = 0;
  const controller = createIdleController({
    timeoutMs: 60_000,
    now: () => now,
    schedule: fn => { scheduled = fn; return 1; },
    cancel: () => {},
    onIdle: () => { exits += 1; }
  });
  controller.start();
  now = 50_000;
  controller.heartbeat();
  now = 70_000;
  scheduled();
  assert.equal(exits, 0);
  now = 111_000;
  scheduled();
  scheduled();
  assert.equal(exits, 1);
});

test('disabled idle controller never schedules exit', () => {
  let schedules = 0;
  const controller = createIdleController({ disabled: true, schedule: () => { schedules += 1; } });
  controller.start();
  controller.heartbeat();
  assert.equal(schedules, 0);
});

test('instance lock records token and detects existing instance', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'csd-instance-'));
  const first = await acquireInstanceLock({ runtimeDir: dir, pid: 123, tokenFactory: () => 'secret-token' });
  assert.equal(first.acquired, true);
  const record = JSON.parse(await readFile(path.join(dir, 'instance.json'), 'utf8'));
  assert.equal(record.token, 'secret-token');
  const second = await acquireInstanceLock({ runtimeDir: dir, pid: 456, isProcessAlive: () => true });
  assert.equal(second.acquired, false);
  assert.equal(second.existing.pid, 123);
  await first.release();
});

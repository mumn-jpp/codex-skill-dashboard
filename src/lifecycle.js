import { randomBytes } from 'node:crypto';
import { mkdir, open, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';

export function createIdleController({
  timeoutMs = 60_000,
  disabled = false,
  now = Date.now,
  schedule = (fn, ms) => setTimeout(fn, ms),
  cancel = clearTimeout,
  onIdle = () => {}
} = {}) {
  let lastHeartbeat = now();
  let timer;
  let fired = false;
  const check = () => {
    if (disabled || fired) return;
    const remaining = timeoutMs - (now() - lastHeartbeat);
    if (remaining <= 0) {
      fired = true;
      onIdle();
      return;
    }
    timer = schedule(check, remaining);
  };
  return {
    start() { if (!disabled && !timer) timer = schedule(check, timeoutMs); },
    heartbeat() { if (disabled || fired) return; lastHeartbeat = now(); },
    stop() { if (timer) cancel(timer); timer = undefined; }
  };
}

const defaultAlive = pid => {
  try { process.kill(pid, 0); return true; } catch { return false; }
};

export async function acquireInstanceLock({
  runtimeDir,
  pid = process.pid,
  tokenFactory = () => randomBytes(24).toString('hex'),
  isProcessAlive = defaultAlive
}) {
  await mkdir(runtimeDir, { recursive: true, mode: 0o700 });
  const file = path.join(runtimeDir, 'instance.json');
  const token = tokenFactory();
  const record = { pid, token, port: null, createdAt: new Date().toISOString() };
  const attempt = async () => {
    const handle = await open(file, 'wx', 0o600);
    await handle.writeFile(JSON.stringify(record));
    await handle.close();
  };
  try {
    await attempt();
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    let existing;
    try { existing = JSON.parse(await readFile(file, 'utf8')); } catch { existing = null; }
    if (existing?.pid && isProcessAlive(existing.pid)) return { acquired: false, existing };
    await unlink(file).catch(() => {});
    await attempt();
  }
  return {
    acquired: true,
    record,
    async update(values) {
      Object.assign(record, values);
      const handle = await open(file, 'w', 0o600);
      await handle.writeFile(JSON.stringify(record));
      await handle.close();
    },
    async release() {
      try {
        const current = JSON.parse(await readFile(file, 'utf8'));
        if (current.token === token && current.pid === pid) await unlink(file);
      } catch {}
    }
  };
}

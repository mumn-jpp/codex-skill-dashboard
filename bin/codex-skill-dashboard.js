#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { parseArgs } from '../src/cli.js';
import { resolveRuntimePaths } from '../src/paths.js';
import { scanSkills } from '../src/scanner.js';
import { createAnnotationRepository } from '../src/annotations.js';
import { createSkillService } from '../src/service.js';
import { createServer } from '../src/server.js';
import { trashSkill, openSkillDirectory } from '../src/platform-actions.js';
import { acquireInstanceLock, createIdleController } from '../src/lifecycle.js';
import { createAssetProvider } from '../src/assets.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const options = parseArgs(process.argv.slice(2));
const version = globalThis.__CSD_VERSION__ || '0.1.0';
if (options.help) { console.log('codex-skill-dashboard [--no-open] [--no-idle-exit] [--port N] [--codex-home PATH] [--scan-dir PATH] [--data-dir PATH]'); process.exit(0); }
if (options.version) { console.log(version); process.exit(0); }

const paths = resolveRuntimePaths({ cli: options });
const instance = await acquireInstanceLock({ runtimeDir: path.join(paths.dataDir, 'runtime') });
const openUrl = url => {
  if (!url) return;
  const [cmd, args] = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  spawn(cmd, args, { detached: true, stdio: 'ignore', shell: false }).unref();
};
if (!instance.acquired) {
  if (instance.existing.port) openUrl(`http://127.0.0.1:${instance.existing.port}`);
  process.exit(0);
}

const service = createSkillService({ scanner: scanSkills, repository: createAnnotationRepository(paths.annotationPath), roots: paths.scanRoots });
await service.init();
const trashAdapter = async target => { const { default: trash } = await import('trash'); await trash([target]); };
const actions = { open: skill => openSkillDirectory(skill), trash: skill => trashSkill(skill, paths.scanRoots[0].path, trashAdapter) };
let closing = false;
let server;
const shutdown = async () => {
  if (closing) return;
  closing = true;
  idle.stop();
  if (server?.listening) await new Promise(resolve => server.close(resolve));
  await instance.release();
};
const idle = createIdleController({ disabled: !options.idleExit, onIdle: () => shutdown().then(() => process.exit(0)) });
const embeddedAssets = globalThis.__CSD_EMBEDDED_ASSETS__;
const assetProvider = embeddedAssets ? createAssetProvider({ mode: 'embedded', embeddedAssets }) : undefined;
server = createServer({ service, publicDir: new URL('../public/', import.meta.url), assetProvider, actions, session: { token: instance.record.token, heartbeat: () => idle.heartbeat() } });
server.listen(options.port, '127.0.0.1', async () => {
  const port = server.address().port;
  const url = `http://127.0.0.1:${port}`;
  await instance.update({ port });
  idle.start();
  console.log(`Codex Skill Dashboard: ${url}`);
  if (options.open) openUrl(url);
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => shutdown().then(() => process.exit(0)));

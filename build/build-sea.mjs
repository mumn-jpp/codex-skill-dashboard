import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 25 || (major === 25 && minor < 5)) throw new Error('Building SEA requires Node.js 25.5+; use Node.js 26 in native CI.');
execFileSync(process.execPath, [path.join(root, 'build', 'bundle.mjs')], { stdio: 'inherit' });
const output = path.join(root, 'dist', process.platform === 'win32' ? 'codex-skill-dashboard.exe' : 'codex-skill-dashboard');
const config = { main: path.join(root, 'dist', 'app.mjs'), mainFormat: 'module', executable: process.execPath, output, disableExperimentalSEAWarning: true, useSnapshot: false, useCodeCache: false };
const configPath = path.join(root, 'dist', 'sea-config.json');
await writeFile(configPath, JSON.stringify(config, null, 2));
execFileSync(process.execPath, ['--build-sea', configPath], { stdio: 'inherit' });
const data = await readFile(output);
if (!data.length) throw new Error('SEA output is empty');
console.log(`Built ${output}`);

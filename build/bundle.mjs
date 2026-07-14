import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const names = ['index.html', 'styles.css', 'icons.js', 'app.js'];
const assets = Object.fromEntries(await Promise.all(names.map(async name => [name, (await readFile(path.join(root, 'public', name))).toString('base64')])));
const decoded = `Object.fromEntries(Object.entries(${JSON.stringify(assets)}).map(([key,value])=>[key,Buffer.from(value,'base64')]))`;
await mkdir(path.join(root, 'dist'), { recursive: true });
await build({
  entryPoints: [path.join(root, 'bin', 'codex-skill-dashboard.js')],
  outfile: path.join(root, 'dist', 'app.mjs'),
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  banner: { js: `globalThis.__CSD_VERSION__=${JSON.stringify(pkg.version)};globalThis.__CSD_EMBEDDED_ASSETS__=${decoded};` },
  legalComments: 'external',
  sourcemap: false
});
console.log(`Built dist/app.mjs with ${names.length} embedded assets.`);

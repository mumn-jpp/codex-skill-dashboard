import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = [
  '../packaging/windows/installer.iss',
  '../packaging/linux/codex-skill-dashboard.desktop',
  '../packaging/linux/build-appimage.sh',
  '../packaging/linux/build-deb.sh',
  '../packaging/macos/Info.plist',
  '../packaging/macos/build-dmg.sh'
];

test('packaging contains no autostart or background service installation', async () => {
  const text = (await Promise.all(files.map(file => readFile(new URL(file, import.meta.url), 'utf8')))).join('\n');
  for (const forbidden of ['CurrentVersion\\Run', 'Startup', 'systemctl enable', 'LaunchAgents', 'New-Service', 'sc create']) {
    assert.equal(text.includes(forbidden), false, `forbidden packaging behavior: ${forbidden}`);
  }
});

test('Linux desktop entry is visible and launches the bundled executable', async () => {
  const text = await readFile(new URL('../packaging/linux/codex-skill-dashboard.desktop', import.meta.url), 'utf8');
  assert.match(text, /Type=Application/);
  assert.match(text, /Exec=codex-skill-dashboard/);
  assert.doesNotMatch(text, /NoDisplay=true/);
});

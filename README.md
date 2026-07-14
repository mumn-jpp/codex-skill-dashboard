# Codex Skill Dashboard

Cross-platform local dashboard for discovering, annotating, copying, and safely moving user-installed Codex skills to the operating-system trash.

## Install for ordinary users

Download the release for your operating system:

- Windows: run `Codex-Skill-Dashboard-Setup-<version>-unsigned.exe`, then use the desktop or Start Menu shortcut.
- Linux: launch the AppImage, or install the DEB and use the application-menu icon.
- macOS: open the DMG, drag the app to Applications, then click its icon.

The native releases include their runtime. Node.js, npm, pnpm, and Git are not required. The app never registers itself to start at boot and never installs a background service. It starts only when you click it; after all dashboard pages are closed for about 60 seconds, the local process exits.

## Developer run

Source and npm use require Node.js 22 or newer.

```bash
npx codex-skill-dashboard
```

The service listens only on `127.0.0.1`. It scans `$CODEX_HOME/skills` and `$CODEX_HOME/plugins/cache`, or `~/.codex` when `CODEX_HOME` is unset. Personal annotations are stored in the platform application-data directory.

Only detected user-installed skills can be moved to the system trash. System, plugin, external, and missing skills are read-only. There is no permanent-delete fallback.

## Source development

```bash
npm install
npm test
npm start
```

MIT licensed. The tool does not execute skill files, use telemetry, or expose the service to the network.

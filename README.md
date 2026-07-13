# Codex Skill Dashboard

Cross-platform local dashboard for discovering, annotating, copying, and safely moving user-installed Codex skills to the operating-system trash.

## Run

Requires Node.js 22 or newer.

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

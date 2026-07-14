# Codex Skill Dashboard

A cross-platform local tool for discovering, understanding, annotating, copying, and safely managing Codex skills.

The project is in early development. The source application and embedded bundle work locally; dependency-free Windows, Linux, and macOS packages are pending native CI verification.

See the [Chinese project introduction](README.md) for the complete feature, safety, installation, and development documentation.

## Source development

Requires Node.js 22 or newer.

```bash
git clone https://github.com/mumn-jpp/codex-skill-dashboard.git
cd codex-skill-dashboard
pnpm install
pnpm test
pnpm start
```

The service binds only to `127.0.0.1`, does not use telemetry, and never permanently deletes skills. Only detected user-installed skills can be moved to the operating-system trash.

Licensed under the [MIT License](LICENSE).

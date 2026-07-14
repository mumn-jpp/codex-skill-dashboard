# Releasing

1. Update `package.json`, `CHANGELOG.md`, and packaging version metadata together.
2. Run `pnpm install --frozen-lockfile`, `pnpm test`, and `pnpm run build:bundle`.
3. Push a `v<version>` tag. Native artifacts are built only on their matching GitHub runner with Node.js 26.
4. Inspect uploaded file lists and SHA-256 files before publishing the GitHub Release.
5. Without signing credentials, artifacts must remain visibly marked unsigned. Do not rename them as signed.
6. Never add startup registration, services, systemd units, LaunchAgents, personal paths, annotations, or credentials to an artifact.

Windows and macOS production releases should be signed before broad distribution. Signing and notarization credentials belong in protected GitHub environments, never repository files.

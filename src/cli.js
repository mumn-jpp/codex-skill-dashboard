const valueFlags = new Map([['--port','port'],['--codex-home','codexHome'],['--scan-dir','scanDir'],['--data-dir','dataDir'],['--host','host']]);

export function parseArgs(argv) {
  const out = { open: true, port: 43127, scanDirs: [] };
  for (let i=0;i<argv.length;i++) {
    const arg=argv[i];
    if (arg==='--no-open') out.open=false;
    else if (arg==='--help') out.help=true;
    else if (arg==='--version') out.version=true;
    else if (valueFlags.has(arg)) {
      const value=argv[++i]; if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`);
      const key=valueFlags.get(arg);
      if (key==='scanDir') out.scanDirs.push(value); else if (key==='port') out.port=Number(value); else out[key]=value;
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!Number.isInteger(out.port)||out.port<1||out.port>65535) throw new Error('Invalid port');
  if (out.host && out.host!=='127.0.0.1') throw new Error('Host must be 127.0.0.1');
  delete out.host;
  return out;
}

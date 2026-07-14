import { readFile } from 'node:fs/promises';

const contentTypes = {
  'index.html': 'text/html; charset=utf-8',
  'styles.css': 'text/css; charset=utf-8',
  'icons.js': 'text/javascript; charset=utf-8',
  'app.js': 'text/javascript; charset=utf-8'
};

export function createAssetProvider({ mode = 'disk', publicDir, embeddedAssets = {} }) {
  return {
    async get(name) {
      if (!Object.hasOwn(contentTypes, name)) return undefined;
      if (mode === 'embedded') {
        const value = embeddedAssets[name];
        return value === undefined ? undefined : Buffer.from(value);
      }
      try { return await readFile(new URL(name, publicDir)); } catch (error) { if (error.code === 'ENOENT') return undefined; throw error; }
    },
    contentType(name) { return contentTypes[name]; }
  };
}

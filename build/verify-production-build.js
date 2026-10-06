import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

import { requireProductionRuntime } from './runtime-origin.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const runtime = requireProductionRuntime(loadEnv('production', root, '').VITE_API_BASE);
const staticConfig = JSON.parse(
  await readFile(resolve(root, 'dist', 'staticwebapp.config.json'), 'utf8')
);
const policy = staticConfig.globalHeaders?.['Content-Security-Policy'] || '';
const connectDirective = policy
  .split(';')
  .map((directive) => directive.trim())
  .find((directive) => directive.startsWith('connect-src '));

assert.ok(connectDirective, 'generated CSP must contain connect-src');
assert.equal(
  connectDirective.split(/\s+/).includes(runtime.origin),
  true,
  'generated CSP must allow the exact configured runtime origin'
);

const assetDirectory = resolve(root, 'dist', 'assets');
const javascriptAssets = (await readdir(assetDirectory))
  .filter((name) => name.endsWith('.js'));
assert.ok(javascriptAssets.length > 0, 'production build must contain JavaScript');
const bundle = (
  await Promise.all(
    javascriptAssets.map((name) => readFile(resolve(assetDirectory, name), 'utf8'))
  )
).join('\n');

assert.equal(
  bundle.includes(runtime.baseUrl),
  true,
  'production bundle must contain the configured runtime base URL'
);
for (const path of ['/v1/timeclock', '/v1/dailylog', '/v3/chat']) {
  assert.equal(bundle.includes(path), true, `production bundle is missing ${path}`);
}
assert.equal(
  bundle.includes('http://127.0.0.1:9120'),
  false,
  'production bundle must not contain the development-only localhost runtime'
);

console.log(JSON.stringify({
  apiBase: runtime.baseUrl,
  cspOrigin: runtime.origin,
  verifiedCalls: ['/v1/timeclock', '/v1/dailylog', '/v3/chat']
}));

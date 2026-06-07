import { readFileSync, writeFileSync } from 'fs';

const path = './dist/server/wrangler.json';
const config = JSON.parse(readFileSync(path, 'utf-8'));

// Remove SESSION KV binding (no ID = deploy error)
if (config.kv_namespaces) {
  config.kv_namespaces = config.kv_namespaces.filter(
    kv => kv.binding !== 'SESSION'
  );
  if (config.kv_namespaces.length === 0) delete config.kv_namespaces;
}

// Rename reserved ASSETS binding
if (config.assets?.binding === 'ASSETS') {
  config.assets.binding = 'STATIC_ASSETS';
}

writeFileSync(path, JSON.stringify(config, null, 2));
console.log('✓ wrangler.json patched');

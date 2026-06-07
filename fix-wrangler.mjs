import { readFileSync, writeFileSync } from 'fs';

const path = './dist/server/wrangler.json';
const config = JSON.parse(readFileSync(path, 'utf-8'));

// Remove SESSION KV binding (no ID = deploy error)
if (config.kv_namespaces) {
  config.kv_namespaces = config.kv_namespaces.filter(kv => kv.binding !== 'SESSION');
  if (config.kv_namespaces.length === 0) delete config.kv_namespaces;
}

// Remove fields that are invalid for Cloudflare Pages (Workers-only)
delete config.main;
delete config.rules;
delete config.assets;

// Remove unknown top-level fields that cause warnings/errors
const invalidFields = [
  'definedEnvironments','ai_search_namespaces','ai_search','agent_memory',
  'secrets_store_secrets','artifacts','unsafe_hello_world','flagship',
  'worker_loaders','ratelimits','vpc_services','vpc_networks',
  'python_modules','previews'
];
for (const field of invalidFields) delete config[field];

// Remove invalid dev fields
if (config.dev) {
  delete config.dev.enable_containers;
  delete config.dev.generate_types;
  if (Object.keys(config.dev).length === 0) delete config.dev;
}

writeFileSync(path, JSON.stringify(config, null, 2));
console.log('✓ wrangler.json patched');

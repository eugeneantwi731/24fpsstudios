const password = process.argv[2];

if (!password) {
  console.error('Usage: node generate-hash.mjs <password>');
  process.exit(1);
}

const encoder = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' }, keyMaterial, 256);
const toHex = (buf) => [...buf].map(b => b.toString(16).padStart(2, '0')).join('');
console.log(`${toHex(salt)}:${toHex(new Uint8Array(bits))}`);
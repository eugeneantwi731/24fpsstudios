import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { fileURLToPath } from 'url';

export default defineConfig({
  site: 'https://24fpsstudios.com',
  output: 'server',
  adapter: cloudflare(),
  vite: {
    resolve: {
      alias: {
        'src': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
});
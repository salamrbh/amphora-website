// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  redirects: {
    '/systeme': { status: 301, destination: '/' },
    '/skills': { status: 301, destination: '/' },
    '/systeme-old': { status: 301, destination: '/' },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});

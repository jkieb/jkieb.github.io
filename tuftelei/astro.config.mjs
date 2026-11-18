// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://jkieb.github.io',
  base: '/tuftelei',
  output: 'static',
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      assetsInlineLimit: 0
    }
  }
});

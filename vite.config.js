import { defineConfig } from 'vite';
import gbboMetadata from './vite-plugins/gbbo-metadata.js';

export default defineConfig({
  // Expands the <gbbo-metadata> tag in each page's <head> into real meta tags
  plugins: [gbboMetadata()],
  base: './', // This ensures assets use relative paths for GitHub Pages
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        contestants: 'contestants.html',
        finals: 'finals.html',
        join: 'join.html',
        rules: 'rules.html',
        standings: 'standings.html',
        vote: 'vote.html'
      }
    },
    // Ensure CSS is properly extracted and assets are handled correctly
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    // Copy all assets from the assets directory to dist
    copyPublicDir: true
  },
  // Define the assets directory as the public directory
  publicDir: 'assets',
  server: {
    port: 3000,
    open: true
  },
  css: {
    postcss: './postcss.config.js'
  },
  optimizeDeps: {
    include: ['lit']
  }
}); 
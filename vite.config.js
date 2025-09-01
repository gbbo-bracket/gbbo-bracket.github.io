import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // This ensures assets use relative paths for GitHub Pages
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        contestants: 'contestants.html',
        rules: 'rules.html',
        standings: 'standings.html'
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
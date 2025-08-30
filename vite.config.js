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
        contestants: 'contestants.html'
      }
    },
    // Ensure CSS is properly extracted and assets are handled correctly
    cssCodeSplit: false,
    assetsInlineLimit: 0
  },
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
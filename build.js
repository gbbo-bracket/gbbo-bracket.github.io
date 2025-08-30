#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Build for GitHub Pages
console.log('🧁 Building GBBO Bracket 2025 for GitHub Pages...');
console.log('📦 Building with Vite...');

try {
  // Use the GitHub Pages build command
  execSync('npm run build:gh-pages', { 
    stdio: 'inherit' 
  });
  
  console.log('✅ Build completed successfully!');
  console.log('🌐 The site is ready for GitHub Pages deployment');
  console.log('📁 Build output is in the dist/ directory');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 
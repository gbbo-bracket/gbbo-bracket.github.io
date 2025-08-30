#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Build Tailwind CSS
console.log('🧁 Building GBBO Bracket 2025...');
console.log('📦 Compiling Tailwind CSS...');

try {
  execSync('npx tailwindcss -i ./src/input.css -o ./dist/output.css', { 
    stdio: 'inherit' 
  });
  console.log('✅ Build completed successfully!');
  console.log('🌐 Open index.html in your browser to view the site');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 
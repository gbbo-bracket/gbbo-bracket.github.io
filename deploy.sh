#!/bin/bash

echo "🧁 Building GBBO Bracket 2025 for GitHub Pages..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build for GitHub Pages
echo "🔨 Building with Vite..."
npm run build:gh-pages

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "🌐 The site is ready for GitHub Pages deployment"
    echo "📁 Build output is in the dist/ directory"
    echo ""
    echo "To deploy:"
    echo "1. Commit and push your changes to GitHub"
    echo "2. GitHub Actions will automatically build and deploy"
    echo "3. Or manually push the dist/ folder to the gh-pages branch"
else
    echo "❌ Build failed!"
    exit 1
fi 
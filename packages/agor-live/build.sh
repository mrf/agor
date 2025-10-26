#!/bin/bash

# Build Script for agor-live Package
# Builds all components and bundles them into a single npm package

set -e  # Exit on error

echo "🏗️  Building agor-live package..."
echo ""

# Get script directory (packages/agor-live)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "📍 Repository root: $REPO_ROOT"
echo "📦 Package directory: $SCRIPT_DIR"
echo ""

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf "$SCRIPT_DIR/dist"
mkdir -p "$SCRIPT_DIR/dist"

# Build @agor/core
echo ""
echo "📦 Building @agor/core..."
cd "$REPO_ROOT/packages/core"
pnpm build

# Build CLI
echo ""
echo "🖥️  Building CLI..."
cd "$REPO_ROOT/apps/agor-cli"
pnpm build

# Build Daemon
echo ""
echo "⚙️  Building Daemon..."
cd "$REPO_ROOT/apps/agor-daemon"
pnpm build

# Build UI
echo ""
echo "🎨 Building UI..."
cd "$REPO_ROOT/apps/agor-ui"
pnpm build

# Copy built artifacts to agor-live package
echo ""
echo "📋 Copying build artifacts..."

# Copy core
echo "  → Copying core..."
mkdir -p "$SCRIPT_DIR/dist/core"
cp -r "$REPO_ROOT/packages/core/dist/"* "$SCRIPT_DIR/dist/core/"

# Copy CLI
echo "  → Copying CLI..."
mkdir -p "$SCRIPT_DIR/dist/cli"
cp -r "$REPO_ROOT/apps/agor-cli/dist/"* "$SCRIPT_DIR/dist/cli/"

# Copy Daemon
echo "  → Copying daemon..."
mkdir -p "$SCRIPT_DIR/dist/daemon"
cp -r "$REPO_ROOT/apps/agor-daemon/dist/"* "$SCRIPT_DIR/dist/daemon/"

# Copy UI
echo "  → Copying UI..."
mkdir -p "$SCRIPT_DIR/dist/ui"
cp -r "$REPO_ROOT/apps/agor-ui/dist/"* "$SCRIPT_DIR/dist/ui/"

# Create node_modules/@agor/core package for imports to resolve
echo ""
echo "📦 Setting up @agor/core package..."
mkdir -p "$SCRIPT_DIR/node_modules/@agor/core/dist"

# Copy the core package.json (has exports defined)
cp "$REPO_ROOT/packages/core/package.json" "$SCRIPT_DIR/node_modules/@agor/core/package.json"

# Copy dist files (duplicate but necessary for proper module resolution)
cp -r "$REPO_ROOT/packages/core/dist/"* "$SCRIPT_DIR/node_modules/@agor/core/dist/"

# Calculate package size
echo ""
echo "📊 Package size:"
du -sh "$SCRIPT_DIR/dist" | awk '{print "  Total: " $1}'
echo ""
du -sh "$SCRIPT_DIR/dist/core" | awk '{print "  Core:   " $1}'
du -sh "$SCRIPT_DIR/dist/cli" | awk '{print "  CLI:    " $1}'
du -sh "$SCRIPT_DIR/dist/daemon" | awk '{print "  Daemon: " $1}'
du -sh "$SCRIPT_DIR/dist/ui" | awk '{print "  UI:     " $1}'

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Package structure:"
tree -L 2 -d "$SCRIPT_DIR/dist" 2>/dev/null || find "$SCRIPT_DIR/dist" -type d -maxdepth 2 | sed 's|^|  |'

echo ""
echo "🚀 Next steps:"
echo "  1. Test local installation:"
echo "     npm install -g $SCRIPT_DIR"
echo ""
echo "  2. Or publish to npm:"
echo "     cd $SCRIPT_DIR && npm publish"
echo ""

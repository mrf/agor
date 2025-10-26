#!/usr/bin/env node

/**
 * Agor Daemon Entry Point (Production)
 *
 * This entry point loads the bundled daemon from dist/daemon.
 * The daemon is compiled from apps/agor-daemon and bundled during build.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get directory of this file
const dirname = path.dirname(fileURLToPath(import.meta.url));

// Daemon is bundled in dist/daemon relative to bin/
const daemonPath = path.resolve(dirname, '../dist/daemon/index.js');

// Import and run the daemon
await import(daemonPath);

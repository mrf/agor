#!/usr/bin/env node

/**
 * Agor CLI Entry Point (Production)
 *
 * This entry point loads the bundled CLI from dist/cli.
 * The CLI commands are compiled from apps/agor-cli and bundled during build.
 */

import { execute } from '@oclif/core';

// oclif will resolve commands relative to this file
// Commands are at ../dist/cli/commands (configured in package.json)
await execute({ development: false, dir: import.meta.url });

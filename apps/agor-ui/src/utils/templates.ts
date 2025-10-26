/**
 * Template utilities for Handlebars templates
 *
 * Provides a simple interface for compiling and rendering Handlebars templates.
 */

import Handlebars from 'handlebars';

/**
 * Compile a Handlebars template string
 *
 * @param templateSource - Raw Handlebars template string
 * @returns Compiled template function
 */
export function compileTemplate<T = Record<string, unknown>>(
  templateSource: string
): (context: T) => string {
  return Handlebars.compile(templateSource);
}

/**
 * Render a Handlebars template with context
 *
 * @param templateSource - Raw Handlebars template string
 * @param context - Template context data
 * @returns Rendered template string
 */
export function renderTemplate<T = Record<string, unknown>>(
  templateSource: string,
  context: T
): string {
  const compiled = Handlebars.compile(templateSource);
  return compiled(context);
}

/**
 * Process a Handlebars template (compile and render in one step)
 *
 * Alias for renderTemplate with clearer naming
 *
 * @param templateSource - Raw Handlebars template string
 * @param context - Template context data
 * @returns Rendered template string
 */
export function processHandlebarsTemplate<T = Record<string, unknown>>(
  templateSource: string,
  context: T
): string {
  return renderTemplate(templateSource, context);
}

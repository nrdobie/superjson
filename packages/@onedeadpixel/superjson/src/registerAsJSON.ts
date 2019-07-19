/**
 * @module @onedeadpixel/superjson
 */
import SJSON from '.'

/**
 * Original JSON object
 */
export const originalJSON = global.JSON

/**
 * Makes the default SuperJSON instance what is used instead of JSON
 */
export function registerAsJSON() {
  // @ts-ignore
  global.JSON = SJSON
}

/**
 * Restores JSON back to its default
 */
export function unregisterAsJSON() {
  global.JSON = originalJSON
}

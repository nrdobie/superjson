/**
 * Get default instance using `import SJSON from '@taget/superjson'`
 *
 * @module @onedeadpixel/superjson
 * @preferred
 */

/**
 * Prevent typedoc issues
 */
import { SuperJSON } from './SuperJSON'
import { registerAll } from './transformers'

/**
 * The default SuperJSON instance with support for all JS classes
 */
const SJSON = new SuperJSON()

// Register all JS core types
registerAll(SJSON)

export default SJSON

export * from './SuperJSON'
export * from './transformers'
export * from './registerAsJSON'
export * from './compose'

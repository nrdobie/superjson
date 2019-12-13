/**
 * @module @onedeadpixel/superjson
 */
import { SuperJSON } from '../SuperJSON'
import { registerDate } from './Date'
import { registerMap } from './Map'
import { registerSet } from './Set'
import { registerTypedArrays } from './TypedArray'

export * from './Date'
export * from './Map'
export * from './Set'
export * from './TypedArray'

/**
 * Registers all the core JS classes
 *
 * @param sjson SuperJSON instance to register classes to
 */
export function registerAll(sjson: SuperJSON) {
  registerDate(sjson)
  registerMap(sjson)
  registerSet(sjson)
  registerTypedArrays(sjson)
}

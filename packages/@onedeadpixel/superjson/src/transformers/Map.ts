/**
 * @module @onedeadpixel/superjson
 */
import { SuperJSON } from '../SuperJSON'

/**
 * Registers the core JS Map class
 *
 * @param sjson SuperJSON instance to register Map to
 */
export function registerMap(sjson: SuperJSON) {
  /* istanbul ignore else */
  if (Map) {
    sjson.register(Map, {
      name: 'Map',
      toJSONValue: map => Array.from(map.entries()),
      fromJSONValue: values => new Map(values)
    })
  }
}

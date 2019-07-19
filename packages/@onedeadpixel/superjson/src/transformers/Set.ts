/**
 * @module @onedeadpixel/superjson
 */
import { SuperJSON } from '../SuperJSON'

/**
 * Registers the core JS Set class
 *
 * @param sjson SuperJSON instance to register Set to
 */
export function registerSet(sjson: SuperJSON) {
  /* istanbul ignore else */
  if (Set) {
    sjson.register(Set, {
      name: 'Set',
      toJSONValue: set => Array.from(set.values()),
      fromJSONValue: values => new Set(values)
    })
  }
}

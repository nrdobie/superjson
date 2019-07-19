/**
 * @module @onedeadpixel/superjson
 */
import { SuperJSON } from '../SuperJSON'

/**
 * Registers the core JS Date class
 *
 * @param sjson SuperJSON instance to register Date to
 */
export function registerDate(sjson: SuperJSON) {
  /* istanbul ignore else */
  if (Date) {
    sjson.register(Date, {
      name: 'Date',
      toJSONValue: date => date.toISOString(),
      fromJSONValue: isoString => new Date(isoString)
    })
  }
}

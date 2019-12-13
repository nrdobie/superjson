/**
 * @module @onedeadpixel/superjson
 */
import { SuperJSON } from '../SuperJSON'

/**
 * Map of TypedArray constructors
 */
const typedArrayConstructors = new Map<string, any>([
  ['Int8Array', Int8Array],
  ['Uint8Array', Uint8Array],
  ['Uint8ClampedArray', Uint8ClampedArray],
  ['Int16Array', Int16Array],
  ['Uint16Array', Uint16Array],
  ['Int32Array', Int32Array],
  ['Uint32Array', Uint32Array],
  ['Float32Array', Float32Array],
  ['Float64Array', Float64Array]
])

/**
 * Registers the core JS TypedArrays
 *
 * Supports the following TypedArrays:
 *
 *  - Int8Array
 *  - Uint8Array
 *  - Uint8ClampedArray
 *  - Int16Array
 *  - Uint16Array
 *  - Int32Array
 *  - Uint32Array
 *  - Float32Array
 *  - Float64Array
 *
 * @param sjson SuperJSON instance to register TypedArrays to
 */
export function registerTypedArrays(sjson: SuperJSON) {
  for (const [name, TypedArray] of typedArrayConstructors.entries()) {
    /* istanbul ignore else */
    if (TypedArray) {
      sjson.register(TypedArray, {
        name,
        toJSONValue: (typedArray: any) => Array.from(typedArray.values()),
        fromJSONValue: arrayOfValues => TypedArray.from(arrayOfValues)
      })
    }
  }
}

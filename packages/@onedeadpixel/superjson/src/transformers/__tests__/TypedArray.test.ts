import { SuperJSON } from '../../SuperJSON'
import { registerTypedArrays } from '../TypedArray'

let sjson: SuperJSON

beforeEach(() => {
  sjson = new SuperJSON()
})

test.each`
  name                   | value
  ${'Int8Array'}         | ${Int8Array.from([1, 2, 3])}
  ${'Uint8Array'}        | ${Uint8Array.from([1, 2, 3])}
  ${'Uint8ClampedArray'} | ${Uint8ClampedArray.from([1, 2, 3])}
  ${'Int16Array'}        | ${Int16Array.from([1, 2, 3])}
  ${'Uint16Array'}       | ${Uint16Array.from([1, 2, 3])}
  ${'Int32Array'}        | ${Int32Array.from([1, 2, 3])}
  ${'Uint32Array'}       | ${Uint32Array.from([1, 2, 3])}
  ${'Float32Array'}      | ${Float32Array.from([1, 2, 3])}
  ${'Float64Array'}      | ${Float64Array.from([1, 2, 3])}
`('registerTypedArrays adds support for $name', ({ value }) => {
  registerTypedArrays(sjson)

  const str = sjson.stringify(value)

  expect(str).toMatchSnapshot()

  const parsed = sjson.parse(str)

  expect(parsed.constructor).toBe(value.constructor)
  expect(Array.from(parsed.values())).toEqual(Array.from(value.values()))
})

import { registerAll } from '..'
import { SuperJSON } from '../../SuperJSON'
import { registerDate } from '../Date'
import { registerMap } from '../Map'
import { registerSet } from '../Set'
import { registerTypedArrays } from '../TypedArray'

jest.mock('../Date')
jest.mock('../Map')
jest.mock('../Set')
jest.mock('../TypedArray')

let sjson: SuperJSON

beforeEach(() => {
  sjson = new SuperJSON()
})

test('registerAll should register all transformers', () => {
  registerAll(sjson)

  expect(registerDate).toHaveBeenCalledWith(sjson)
  expect(registerMap).toHaveBeenCalledWith(sjson)
  expect(registerSet).toHaveBeenCalledWith(sjson)
  expect(registerTypedArrays).toHaveBeenCalledWith(sjson)
})

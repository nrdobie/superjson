import { SuperJSON } from '../../SuperJSON'
import { registerMap } from '../Map'

let sjson: SuperJSON

beforeEach(() => {
  sjson = new SuperJSON()
})

test('registerMap should add Map support to SJSON', () => {
  registerMap(sjson)

  const map = new Map([[1, 'goodfellow'], [2, 'target']])

  const str = sjson.stringify(map)

  expect(str).toMatchSnapshot()

  const parsed = sjson.parse(str)

  expect(parsed).toEqual(map)
})

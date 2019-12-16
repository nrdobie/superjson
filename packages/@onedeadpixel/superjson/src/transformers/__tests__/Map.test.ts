import { SuperJSON } from '../../SuperJSON'
import { registerMap } from '../Map'

let sjson: SuperJSON

beforeEach(() => {
  sjson = new SuperJSON()
})

test('registerMap should add Map support to SJSON', () => {
  registerMap(sjson)

  const map = new Map([
    [1, 'Mocha'],
    [2, 'LiveScript'],
    [3, 'JavaScript'],
    [4, 'ECMAScript']
  ])

  const str = sjson.stringify(map)

  expect(str).toMatchSnapshot()

  const parsed = sjson.parse(str)

  expect(parsed).toEqual(map)
})

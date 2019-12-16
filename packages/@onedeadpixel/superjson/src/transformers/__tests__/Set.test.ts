import { SuperJSON } from '../../SuperJSON'
import { registerSet } from '../Set'

let sjson: SuperJSON

beforeEach(() => {
  sjson = new SuperJSON()
})

test('registerSet should add set support to SJSON', () => {
  registerSet(sjson)

  const set = new Set(['Mocha', 'LiveScript', 'JavaScript', 'ECMAScript'])

  const str = sjson.stringify(set)

  expect(str).toMatchSnapshot()

  const parsed = sjson.parse(str)

  expect(parsed).toEqual(set)
})

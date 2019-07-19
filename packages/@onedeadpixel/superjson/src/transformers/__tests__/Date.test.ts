import { SuperJSON } from '../../SuperJSON'
import { registerDate } from '../Date'

let sjson: SuperJSON

beforeEach(() => {
  sjson = new SuperJSON()
})

test('registerDate should add Date support to SJSON', () => {
  registerDate(sjson)

  const date = new Date('1902-06-24T00:00:00Z')

  const str = sjson.stringify(date)

  expect(str).toMatchSnapshot()

  const parsed = sjson.parse(str)

  expect(parsed).toEqual(date)
})

import { registerAsJSON, unregisterAsJSON } from '../registerAsJSON'

afterEach(() => {
  unregisterAsJSON()
})

test('registerAsJSON should replace JSON with SJSON', () => {
  registerAsJSON()

  expect(JSON.stringify(new Date('1995-12-04T00:00:00Z'))).toMatchSnapshot()
})

test('unregisterAsJSON should replace SJSON with JSON', () => {
  registerAsJSON()

  expect(JSON.stringify(new Date('1995-12-04T00:00:00Z'))).toMatchSnapshot()

  unregisterAsJSON()

  expect(JSON.stringify(new Date('1995-12-04T00:00:00Z'))).toMatchSnapshot()
})

import SJSON from '..'

test('SJSON should hand complex data', () => {
  const complex = {
    string: 'hello world',
    number: 1234,
    boolean: true,
    date: new Date('1995-12-04T00:00:00Z'),
    maps: new Map([
      [1, 'Mocha'],
      [2, 'LiveScript'],
      [3, 'JavaScript'],
      [4, 'ECMAScript']
    ]),
    sets: new Set(['Mocha', 'LiveScript', 'JavaScript', 'ECMAScript'])
  }

  const str = SJSON.stringify(complex, null, '  ')

  expect(str).toMatchSnapshot()

  const parsed = SJSON.parse(str)

  expect(parsed).toEqual(complex)
})

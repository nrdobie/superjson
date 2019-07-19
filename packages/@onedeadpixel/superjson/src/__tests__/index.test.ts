import SJSON from '..'

test('SJSON should hand complex data', () => {
  const complex = {
    name: 'Target',
    founded: new Date('1902-06-24T00:00:00Z'),
    previousNames: new Set([
      `Goodfellow Dry Goods`,
      `Dayton's Dry Goods Company`,
      `Dayton Company`,
      `Dayton Corporation`,
      `Dayton-Hudson Corporation`
    ]),
    keyPeople: new Map([
      ['CEO', 'Brian Cornell'],
      ['CFO', 'Cathy Smith'],
      ['CTO', 'Mike McNamara']
    ]),
    stores: new Map([
      ['AL', new Set(['T9999', 'T9998', 'T9997'])],
      ['IA', new Set(['T8999', 'T8998', 'T8997'])],
      ['MN', new Set(['T7999', 'T7998', 'T7997'])]
    ])
  }

  const str = SJSON.stringify(complex, null, '  ')

  expect(str).toMatchSnapshot()

  const parsed = SJSON.parse(str)

  expect(parsed).toEqual(complex)
})

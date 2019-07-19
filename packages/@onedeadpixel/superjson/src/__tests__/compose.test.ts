import { compose } from '../compose'

test('compose should pass value through', () => {
  const mockOne = jest.fn().mockReturnValue('one')
  const mockTwo = jest.fn().mockReturnValue('two')
  const mockThree = jest.fn().mockReturnValue('three')

  const run = compose(
    mockOne,
    mockTwo,
    mockThree
  )

  expect(run('key', 'four')).toBe('one')

  expect(mockOne).toHaveBeenCalledWith('key', 'two')
  expect(mockTwo).toHaveBeenCalledWith('key', 'three')
  expect(mockThree).toHaveBeenCalledWith('key', 'four')
})

import { SuperJSON } from '../SuperJSON'
import { registerDate, registerMap } from '../transformers'

class TestAnimal {
  public static fromJSONValue(value: any) {
    return new TestAnimal(value.name)
  }

  constructor(public name: string) {}

  public toJSONValue() {
    return { name: this.name }
  }
}

const TestFail = { prototype: {} }

describe('SuperJSON', () => {
  let sjson: SuperJSON
  beforeEach(() => {
    sjson = new SuperJSON()

    registerDate(sjson)
  })

  describe('.reviver', () => {
    it('should be usable standalone', () => {
      const testString = `{"test": { "__sj_type": "Date", "__sj_value": "1995-12-04T00:00:00Z" } }`

      expect(JSON.parse(testString, sjson.reviver)).toEqual({
        test: new Date('1995-12-04T00:00:00Z')
      })
    })
  })

  describe('.replacer', () => {
    it('should be usable standalone', () => {
      expect(
        JSON.stringify(
          { test: new Date('1995-12-04T00:00:00Z') },
          sjson.replacer
        )
      ).toMatchSnapshot()
    })
  })

  describe('#constructor', () => {
    it('should allow for custom keys', () => {
      sjson = new SuperJSON({ typeKey: '__diff_key', valueKey: '__diff_value' })
      registerDate(sjson)

      const str = sjson.stringify(new Date('1995-12-04T00:00:00Z'))
      expect(str).toMatchSnapshot()
      const parsed = sjson.parse(str)
      expect(parsed).toEqual(new Date('1995-12-04T00:00:00Z'))
    })
  })

  describe('#parse', () => {
    it('should parse a regular JSON string', () => {
      const testString = `{"test": true}`

      expect(sjson.parse(testString)).toEqual({ test: true })
    })

    it('should parse a SuperJSON string', () => {
      const testString = `{"test": { "__sj_type": "Date", "__sj_value": "1995-12-04T00:00:00Z" } }`

      expect(sjson.parse(testString)).toEqual({
        test: new Date('1995-12-04T00:00:00Z')
      })
    })

    it('should support custom reviver', () => {
      const testString = `{"testOne": { "__sj_type": "Date", "__sj_value": "1995-12-04T00:00:00Z" }, "testTwo": true }`

      const reviver = (key: any, value: any) =>
        key === 'testTwo' ? undefined : value

      expect(sjson.parse(testString, reviver)).toEqual({
        testOne: new Date('1995-12-04T00:00:00Z')
      })
    })
  })

  describe('#stringify', () => {
    it('should stringify regular object', () => {
      const testObject = { test: true }

      expect(sjson.stringify(testObject)).toMatchSnapshot()
    })

    it('should stringify a SuperJSON object', () => {
      const testObject = { test: new Date('1995-12-04T00:00:00Z') }

      expect(sjson.stringify(testObject)).toMatchSnapshot()
    })

    it('should support custom replacer', () => {
      const testString = {
        testOne: new Date('1995-12-04T00:00:00Z'),
        testTwo: true
      }

      const replacer = (key: any, value: any) =>
        key === 'testTwo' ? undefined : value

      expect(sjson.stringify(testString, replacer)).toMatchSnapshot()
    })
  })

  describe('#register', () => {
    let testAnimal: TestAnimal
    beforeEach(() => {
      testAnimal = new TestAnimal('Odin')
    })

    it('should be able to use an instance', () => {
      sjson.register(TestAnimal)

      const str = sjson.stringify(testAnimal)
      expect(str).toMatchSnapshot()
      const parsed = sjson.parse(str)
      expect(parsed.name).toBe('Odin')
    })

    it('should be able to override name', () => {
      sjson.register(TestAnimal, { name: 'TesterAnimal' })

      const str = sjson.stringify(testAnimal)
      expect(str).toMatchSnapshot()
      const parsed = sjson.parse(str)
      expect(parsed.name).toBe('Odin')
    })

    it('should be able to override toJSONValue and fromJSONValue', () => {
      sjson.register(TestAnimal, {
        toJSONValue: animal => ({ betterName: animal.name }),
        fromJSONValue: value => new TestAnimal(value.betterName)
      })

      const str = sjson.stringify(testAnimal)
      expect(str).toMatchSnapshot()
      const parsed = sjson.parse(str)
      expect(parsed.name).toBe('Odin')
    })

    it('should require a name', () => {
      expect(() =>
        sjson.register(TestFail as any, {
          toJSONValue: () => ({}),
          fromJSONValue: () => ({})
        })
      ).toThrowErrorMatchingSnapshot()
    })

    it('should require a toJSONValue', () => {
      expect(() =>
        sjson.register(TestFail as any, {
          name: 'TestFail',
          fromJSONValue: () => ({})
        })
      ).toThrowErrorMatchingSnapshot()
    })

    it('should require a fromJSONValue', () => {
      expect(() =>
        sjson.register(TestFail as any, {
          name: 'TestFail',
          toJSONValue: () => ({})
        })
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('#unregister', () => {
    it('should unregister by class', () => {
      registerMap(sjson)

      sjson.unregister(Map)

      expect(sjson.stringify(new Map([[1, 'target']]))).toMatchSnapshot()
    })

    it('should unregister by name', () => {
      registerMap(sjson)

      sjson.unregister('Map')

      expect(sjson.stringify(new Map([[1, 'target']]))).toMatchSnapshot()
    })

    it('should throw error for unregistered type', () => {
      expect(() => sjson.unregister(Map)).toThrowErrorMatchingSnapshot()
    })
  })

  describe('#getTransformer', () => {
    it('should reverse a string', () => {
      const transformer = sjson.getTransformer('Date')

      expect(transformer.klass).toBe(Date)
    })

    it('should reverse a class', () => {
      const transformer = sjson.getTransformer(Date)

      expect(transformer.klass).toBe(Date)
    })

    it('should reverse an instance', () => {
      const date = new Date()
      const transformer = sjson.getTransformer(date as any)

      expect(transformer.klass).toBe(Date)
    })

    it('should throw error on unregistered type', () => {
      expect(() => sjson.getTransformer(Map)).toThrowErrorMatchingSnapshot()
    })
  })
})

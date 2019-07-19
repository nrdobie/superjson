/**
 * @module @onedeadpixel/superjson
 */
import isObject from 'isobject'
import { compose } from './compose'

type KlassType<Klass = any> = new (...args: any[]) => Klass

/**
 * Options for SuperJSON
 */
interface ISuperJSONOptions {
  /**
   * Special key to signify a SuperJSON serialized type in stringified code.
   */
  typeKey: string

  /**
   * Special key to signify a SuperJSON serialized value in stringified code.
   */
  valueKey: string
}

/**
 * SuperJSON transformer
 */
interface ISuperJSONTransform<Klass = any> {
  /**
   * Class for transformer
   */
  klass: KlassType<Klass>

  /**
   * Name of transformer type
   */
  name: string

  /**
   * Function to turn instance into JSON value
   */
  toJSONValue: (instance: Klass) => any

  /**
   * Function to turn JSON value into instance
   */
  fromJSONValue: (value: any) => Klass
}

interface ISuperJSONRegisterOptions<Klass> {
  /**
   * Name of transformer type
   */
  name?: string

  /**
   * Function to turn instance into JSON value
   */
  toJSONValue?: (instance: Klass) => any

  /**
   * Function to turn JSON value into instance
   */
  fromJSONValue?: (value: any) => Klass
}

/**
 * @hidden
 */
const originalJSON = global.JSON

export class SuperJSON {
  /**
   * Standalone reviver function that can be passed to `JSON.parse`
   */
  public get reviver() {
    const self = this
    return function sjsonReviver(key: any, value: any) {
      return self.jsonReviver(key, value)
    }
  }

  /**
   * Standalone reviver function that can be passed to `JSON.parse`
   */
  public get replacer() {
    const self = this
    return function sjsonReplacer(key: any, value: any) {
      return self.jsonReplacer(key, value, this[key])
    }
  }

  /**
   * Default options for SuperJSON
   */
  public static DEFAULT_OPTIONS: ISuperJSONOptions = {
    typeKey: '__sj_type',
    valueKey: '__sj_value'
  }

  /**
   * Settings for SuperJSON instance
   */
  public readonly options: ISuperJSONOptions

  /**
   * Active transforms
   */
  private registeredTransforms: Map<string, ISuperJSONTransform> = new Map()

  /**
   * Lookup table to convert Class into name
   */
  private klassLookup: Map<KlassType, string> = new Map()

  constructor(options: Partial<ISuperJSONOptions> = {}) {
    this.options = {
      ...options,
      ...SuperJSON.DEFAULT_OPTIONS
    }
  }

  /**
   * `JSON.parse` compatible function to convert JSON string into JavaScript objects
   *
   * @param text JSON string to convert to JavaScript objects
   * @param reviver If a function, this prescribes how the value originally produced by parsing is transformed, before being returned.
   */
  public parse(text: string, reviver?: (key: any, value: any) => any): any {
    return originalJSON.parse(
      text,
      compose(
        this.reviver,
        reviver
      )
    )
  }

  /**
   * `JSON.stringify` compatible function to convert JavaScript objects into JSON string
   *
   * @param value The value to convert to a JSON string.
   * @param replacer A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string.
   * @param space A String or Number object that's used to insert white space into the output JSON string for readability purposes.
   */
  public stringify(
    value: any,
    replacer?: (key: any, value: any) => any,
    space?: string | number
  ) {
    return originalJSON.stringify(
      value,
      compose(
        this.replacer,
        replacer
      ),
      space
    )
  }

  /**
   * Adds a Class to be serialized by SuperJSON
   *
   * @param klass Class to add to SuperJSON for serialization
   * @param options Additional settings for controlling serialization
   */
  public register<Klass>(
    klass: KlassType<Klass>,
    options: ISuperJSONRegisterOptions<Klass> = {}
  ) {
    let name: string
    if (options.name) {
      name = options.name
    } else if ('name' in klass) {
      name = klass.name
    } else {
      throw new TypeError(`name must be provided by options or class`)
    }

    let toJSONValue: ISuperJSONTransform<Klass>['toJSONValue']
    if (options.toJSONValue) {
      toJSONValue = options.toJSONValue
    } else if ('toJSONValue' in klass.prototype) {
      toJSONValue = (instance: any) => instance.toJSONValue()
    } else {
      throw new TypeError(`toJSONValue must be provided by options or class`)
    }

    let fromJSONValue: ISuperJSONTransform<Klass>['fromJSONValue']
    if (options.fromJSONValue) {
      fromJSONValue = options.fromJSONValue
    } else if ('fromJSONValue' in klass) {
      fromJSONValue = value => (klass as any).fromJSONValue(value)
    } else {
      throw new TypeError(`fromJSONValue must be provided by options or class`)
    }

    const transform: ISuperJSONTransform<Klass> = {
      klass,
      name,
      toJSONValue,
      fromJSONValue
    }

    this.registeredTransforms.set(name, transform)
    this.klassLookup.set(klass, name)

    return this
  }

  /**
   * Removes a Class from being serialized by SuperJSON
   *
   * @param klass Class to remove from SuperJSON
   */
  public unregister(klass: new (...args: any[]) => any): this

  /**
   * Removes a Class from being serialized by SuperJSON
   *
   * @param name Name of Class to remove from SuperJSON
   */
  public unregister(name: string): this
  public unregister(klassOrName: (new (...args: any[]) => any) | string) {
    let name: string
    if (typeof klassOrName !== 'string') {
      name = this.klassLookup.get(klassOrName)
    } else {
      name = klassOrName
    }

    if (!this.registeredTransforms.has(name)) {
      throw new Error(`${name || (klassOrName as any).name} is not registered`)
    }

    const transform = this.registeredTransforms.get(name)

    this.registeredTransforms.delete(name)
    this.klassLookup.delete(transform.klass)

    return this
  }

  /**
   * Gets the transformer for a Class
   *
   * @param instance instance to get transformer for
   */
  public getTransformer(instance: {
    constructor: KlassType
  }): ISuperJSONTransform

  /**
   * Gets the transformer for a Class
   *
   * @param klass Class to get transformer for
   */
  public getTransformer(klass: new (...args: any[]) => any): ISuperJSONTransform

  /**
   * Gets the transformer for a Class
   *
   * @param name name to get transformer for
   */
  public getTransformer(name: string): ISuperJSONTransform
  public getTransformer(
    instanceKlassOrName: { constructor: KlassType } | KlassType | string
  ) {
    let name: string
    if (typeof instanceKlassOrName !== 'string') {
      let klass: any
      if (instanceKlassOrName.constructor === Function) {
        klass = instanceKlassOrName
      } else {
        klass = instanceKlassOrName.constructor
      }

      name = this.klassLookup.get(klass)

      if (!name) {
        throw Error(`${klass.name} is not registered`)
      }
    } else {
      name = instanceKlassOrName
    }

    return this.registeredTransforms.get(name)
  }

  /**
   * Used as a `JSON.parse` reviver to convert JSON values into objects.
   *
   * @param key Object key
   * @param value Object value
   */
  private jsonReviver(key: any, value: any) {
    if (this.isRevivable(value)) {
      const type = value[this.options.typeKey]
      const jsonValue = value[this.options.valueKey]
      const transform = this.getTransformer(type)

      return transform.fromJSONValue(jsonValue)
    }

    return value
  }

  /**
   * Checks if the value has a transformer
   *
   * @param value value to test
   */
  private isRevivable(value: any) {
    return (
      isObject(value) &&
      this.options.typeKey in value &&
      this.options.valueKey in value &&
      this.registeredTransforms.has(value[this.options.typeKey])
    )
  }

  /**
   * Used as a `JSON.stringify` replacer to convert objects into JSON values.
   *
   * @param key Object key
   * @param value Object value
   * @param originalValue Object value before `.toJSON` was called.
   */
  private jsonReplacer(key: any, value: any, originalValue: any) {
    const transformValue =
      value !== originalValue && value !== undefined ? originalValue : value

    if (this.isReplaceable(transformValue)) {
      const transformer = this.getTransformer(transformValue)

      const jsonValue = transformer.toJSONValue(transformValue)

      return {
        [this.options.typeKey]: transformer.name,
        [this.options.valueKey]: jsonValue
      }
    }

    return value
  }

  /**
   * Checks if the value has a transformer
   *
   * @param value value to test
   */
  private isReplaceable(value: any) {
    return (
      isObject(value) &&
      'constructor' in value &&
      this.klassLookup.has(value.constructor)
    )
  }
}

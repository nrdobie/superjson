# @onedeadpixel/superjson

JSON serializer with support for custom Classes and more JavaScript built-in objects.

## Installation

```bash
npm install --save @onedeadpixel/superjson

# or

yarn add @onedeadpixel/superjson
```

## Usage

SuperJSON has the same call signature as JSON for both `SJSON.parse` and `SJSON.stringify`, so it works as a direct replacement for JSON calls.

```typescript
import SJSON from '@onedeadpixel/superjson'

const complexObject = {
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
  sets: new Set(['Mocha', 'LiveScript', 'JavaScript', 'ECMAScript']),
  custom: new CustomClass({ id: 'hello' })
}

SJSON.register(CustomClass)

SJSON.stringify(complexObject, null, '  ') // =>
// {
//   "string": "hello world",
//   "number": 1234,
//   "boolean": true,
//   "date": { "__sj_type": "Date", "__sj_value": "1995-12-04T00:00:00Z" },
//   "maps": {
//     "__sj_type": "Map",
//     "__sj_value": [[1, "Mocha"], [2, "LiveScript"], [3, "JavaScript"], [4, "ECMAScript"]]
//   },
//   "sets": {
//     "__sj_type": "Set",
//     "__sj_value": ["Mocha", "LiveScript", "JavaScript", "ECMAScript"]
//   },
//   "custom": { "__sj_type": "CustomClass", "__sj_value": { "id": "hello" } }
// }
```

### Use SuperJSON for JSON

If you want to make all JSON parse and stringify calls through SuperJSON, you can replace the global JSON object with SuperJSON. This is useful for when you want other packages to use SuperJSON but the packages doesn't have direct support for SuperJSON.

```typescript
// Quick Way
import '@onedeadpixel/superjson/register'

// Controlled Way
import { registerAsJSON, unregisterAsJSON } from '@onedeadpixel/superjson'
registerAsJSON() // JSON is now SJSON
unregisterAsJSON() // JSON is back to JSON
```

## Supported Types

These types are supported out of the box by SuperJSON.

- Primitives (string, number, boolean)
- Arrays
- Plain Objects
- Date
- Set
- Map
- TypedArray (Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array)

## Custom Types

Along with the core types provided by SuperJSON, you can add your own custom classes to SuperJSON for serialization. There are two way to add a custom type, first is to add `toJSONValue` and `fromJSONValue` methods to the class or define the functions as part of `SJSON.register`.

### Class Methods

The `toJSONValue` is an instance method that should return a value that you can use to recreate the instance when the stringified version is parsed. The `fromJSONValue` is a static method that takes in the results of `toJSONValue` and returns the new instance.

```typescript
import SJSON from '@onedeadpixel/superjson'

class Car {
  static fromJSONValue(value: any) {
    return new Car(value.make, value.model, value.year)
  }

  constructor(public make: string, public model: string, public year: number) {}

  toJSONValue() {
    return {
      make: this.make,
      model: this.model,
      year: this.year
    }
  }
}

SJSON.register(Car)
```

### Register Options

The `toJSONValue` option should return a value that you can use to recreate the instance when the stringified version is parsed. The `fromJSONValue` option takes in the results of `toJSONValue` and returns the new instance.

```typescript
import SJSON from '@onedeadpixel/superjson'

class Car {
  constructor(public make: string, public model: string, public year: number) {}
}

SJSON.register(Car, {
  toJSONValue(car: Car) {
    return {
      make: car.make,
      model: car.model,
      year: car.year
    }
  },
  fromJSONValue(value: any) {
    return new Car(value.make, value.model, value.year)
  }
})
```

### Things to Watch

- SuperJSON will try to infer the name from `Class.name`, but this can cause collisions, e.g. Immutable's Map would interfere with JS's Map, or be change due to obfuscators like UglifyJS or Terser. If there are issues with inferring the name you can pass the name as an option during register, e.g. `SJSON.register(Immutable.Map, { name: 'Immutable#Map' })`.
- Custom classes need to be registered before SuperJSON will be able to parse or stringify them.

## Custom SuperJSON

By default SuperJSON will come with an out-of-the-box version with support for core JavaScript types and can be imported from `import SJSON from '@onedeadpixel/superjson'`. If for some reason you need a custom version of SuperJSON you can create your own instances and customize it to better suit your needs.

```typescript
import { SuperJSON, registerMap } from '@onedeadpixel/superjson'

const SJSON = new SuperJSON({
  typeKey: '@myType',
  valueKey: '@myValue'
})

registerMap(SJSON) // adds support for Map

SJSON.stringify(
  {
    date: new Date('1995-12-04T00:00:00Z'),
    maps: new Map([
      [1, 'Mocha'],
      [2, 'LiveScript'],
      [3, 'JavaScript'],
      [4, 'ECMAScript']
    ])
  },
  null,
  '  '
) // =>
// {
//   "date": "1995-12-04T00:00:00Z",
//   "maps": {
//     "@myType": "Map",
//     "@myValue": [[1, "Mocha"], [2, "LiveScript"], [3, "JavaScript"], [4, "ECMAScript"]]
//   }
// }
```

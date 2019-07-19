/**
 * Allows for multiple revivers and replacers to be passed to parse and
 * stringify. Runs functions in reverse order.
 *
 * @param fns revivers and replacers to use
 */
export function compose(
  ...fns: Array<(key: any, value: any) => any>
): (key: any, value: any) => any {
  const functions = fns.filter(fn => !!fn).reverse()

  return function composer(key: any, value: any): any {
    let currentValue = value
    for (const fn of functions) {
      currentValue = fn.call(this, key, currentValue)
    }
    return currentValue
  }
}

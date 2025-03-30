/**
 * Given an existing object literal, this utility function will inject a new property into the object that will be lazily evaluated when accessed.
 *
 * Subsequent calls to the property will return the same value/reference as the first call.
 *
 * @example ```ts
 * const target = { test: "hello" };
 *
 * injectLazyProp(target, "test2", () => "there");
 *
 * console.log(target.test2); // "there"
 * ```
 *
 * @param target The object to inject the property into
 * @param property The key name of the property to inject
 * @param getter The function that will be called to lazily evaluate the property
 */
export function injectLazyProp<
  T extends Record<PropertyKey, unknown>,
  K extends string,
  // biome-ignore lint/suspicious/noExplicitAny: Use of any is necessary here for a generic function constraint
  F extends () => any,
>(
  target: T,
  property: K,
  getter: F,
): asserts target is {
  // It's a bit of a mess, but this cleans up nasty intersection types when the function is called sequentially in an app
  // and generates a clean easy-to-read type for the user
  [K2 in keyof (T & { [Key in K]: ReturnType<F> })]: (T & {
    [Key in K]: ReturnType<F>;
  })[K2];
} {
  Object.defineProperty(target, property, {
    get() {
      const value = getter();

      Object.defineProperty(target, property, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      });

      return value;
    },
    set(value) {
      Object.defineProperty(target, property, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    },
    enumerable: true,
    configurable: true,
  });
}

/**
 * Given an object literal of getter functions, this utility function will create a new object that will lazily evaluate the properties when accessed.
 *
 * Subsequent calls to the property will be the same value/reference as the first call.
 *
 * @example ```ts
 * // Pretend these are expensive operations
 * const lazyObject = createLazyObject({
 *   test: () => true,
 *   test2: () => false,
 * });
 *
 * console.log(lazyObject.test); // true
 * console.log(lazyObject.test2); // false
 * ```
 *
 * @param getters The object literal of getter functions
 * @returns The new object that will lazily evaluate the properties when accessed
 */
export function createLazyObject<
  // biome-ignore lint/suspicious/noExplicitAny: Use of any is necessary here for a generic function constraint
  T extends Record<string, () => any>,
>(getters: T): { [K in keyof T]: ReturnType<T[K]> } {
  const result = {} as { [K in keyof T]: ReturnType<T[K]> };

  for (const [key, getter] of Object.entries(getters)) {
    injectLazyProp(result, key, getter);
  }

  return result;
}

export default createLazyObject;

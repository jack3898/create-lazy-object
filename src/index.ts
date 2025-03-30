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

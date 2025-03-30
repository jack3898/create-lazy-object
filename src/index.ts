export function createLazyObject<
  // biome-ignore lint/suspicious/noExplicitAny: Use of any is necessary here for a generic function constraint
  T extends Record<string, () => any>,
>(getters: T): { [K in keyof T]: ReturnType<T[K]> } {
  const result = {} as { [K in keyof T]: ReturnType<T[K]> };

  for (const key of Object.keys(getters) as (keyof T)[]) {
    Object.defineProperty(result, key, {
      configurable: true,
      enumerable: true,
      get() {
        const getter = getters[key];
        const value = getter?.();

        // Redefine the property to store the value
        Object.defineProperty(result, key, {
          value,
          writable: true,
          enumerable: true,
          configurable: true,
        });

        return value;
      },
      set(value) {
        Object.defineProperty(result, key, {
          value,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      },
    });
  }

  return result;
}

export default createLazyObject;

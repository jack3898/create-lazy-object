function isKeyOf<T extends Record<PropertyKey, unknown>>(
  key: PropertyKey,
  obj: T,
): key is keyof T {
  return key in obj;
}

export function createLazyObject<
  // biome-ignore lint/suspicious/noExplicitAny: Use of any is necessary here for a generic function constraint
  T extends Record<string, (() => any) | undefined>,
>(getters: T): { [K in keyof T]: ReturnType<NonNullable<T[K]>> } {
  const cache = {} as { [K in keyof T]: ReturnType<NonNullable<T[K]>> };

  return new Proxy(cache, {
    get(target, property) {
      if (isKeyOf(property, target)) {
        return target[property];
      }

      if (isKeyOf(property, getters)) {
        const getter = getters[property];
        const value = getter?.();

        target[property] = value;

        return value;
      }

      return undefined;
    },
    set(target, property, value) {
      // @ts-expect-error - Due to the cache (an optional construct), inheriting types that represent the proxied object (a not so optional construct), this assignment is valid
      target[property] = value;

      return true;
    },
    has(target, property: string) {
      this?.get?.(target, property, undefined);

      return property in target;
    },
    ownKeys() {
      return Object.keys(getters);
    },
    deleteProperty(target, property) {
      if (typeof property === "string") {
        return delete target[property];
      }

      return false;
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true,
      };
    },
  });
}

export default createLazyObject;

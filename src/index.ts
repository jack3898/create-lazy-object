export function createLazyObject<
  K extends string,
  // biome-ignore lint/suspicious/noExplicitAny: any type is needed for function type constraint
  F extends (...args: any[]) => any,
  R extends ReturnType<F>,
>(getters: Record<K, F>): { [I in K]: R } {
  const cache: Record<K, R> = {} as Record<K, R>; // I don't usually like type assertions but I think this type is unavoidable

  return new Proxy<Record<K, R>>(cache, {
    get(target, property: K): R {
      if (Object.hasOwn(target, property)) {
        return target[property];
      }

      const value: R = getters[property]();

      target[property] = value;

      return value;
    },
    set(target, property: K, newValue: R) {
      target[property] = newValue;

      return true;
    },
    has(target, property) {
      this?.get?.(target, property, undefined);

      return Object.hasOwn(target, property);
    },
    ownKeys() {
      return Object.keys(getters);
    },
    deleteProperty(target, property: K) {
      return delete target[property];
    },
    getOwnPropertyDescriptor(target, prop) {
      return {
        enumerable: true,
        configurable: true,
      };
    },
  });
}

export default createLazyObject;

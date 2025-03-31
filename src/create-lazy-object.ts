import { injectLazyProp } from "./inject-lazy-prop";
import type { AnyFn, LazyObjectResult, LazyOpts } from "./types";

/**
 * Given an object literal of getter functions, this utility function will create a new object that will lazily evaluate the properties when accessed.
 *
 * This function works with immutability in mind, so the original object will not be modified.
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
 * @param mergeWith An optional non-lazy standard object to merge the lazy object with
 * @returns The new object that will lazily evaluate the properties when accessed
 */
export function createLazyObject<
  T extends Record<string, AnyFn>,
  M extends Record<PropertyKey, unknown>,
>(getters: T, mergeWith?: M, opts?: LazyOpts<keyof T>): LazyObjectResult<T, M> {
  const result = (mergeWith ? { ...mergeWith } : {}) as LazyObjectResult<T, M>;

  for (const [key, getter] of Object.entries(getters)) {
    injectLazyProp(result, key, getter, opts);
  }

  return result;
}

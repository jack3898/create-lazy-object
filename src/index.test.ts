import { it, expect, vi } from "vitest";
import { createLazyObject } from "./index";

it("should run a test", () => {
  expect(true).toBe(true);
});

it("should get a property", () => {
  const object = {};

  const lazyObject = createLazyObject({ test: () => object });

  expect(lazyObject.test).toBe(object);
});

it("should set a property", () => {
  const object = true;
  const settedObject = false;

  const lazyObject = createLazyObject({ test: () => object });

  lazyObject.test = settedObject;

  expect(lazyObject.test).toBe(settedObject);
});

it("should cache getting a property", () => {
  const getter = vi.fn().mockImplementation(() => crypto.randomUUID());

  const lazyObject = createLazyObject({ test: getter });

  const result1 = lazyObject.test;
  const result2 = lazyObject.test;

  expect(getter).toHaveBeenCalledTimes(1);

  expect(result1 === result2).toBe(true);
});

it("should check if a the object has a property", () => {
  const lazyObject = createLazyObject({ test: () => false });

  expect("test" in lazyObject).toBe(true);
});

it("should pre-compute the value when checking if a property exists", () => {
  const getter = vi.fn();
  const lazyObject = createLazyObject({ test: () => getter() });

  expect("test" in lazyObject).toBe(true);

  expect(getter).toHaveBeenCalledTimes(1);

  lazyObject.test;

  expect(getter).toHaveBeenCalledTimes(1);
});

it("should get the keys of the lazy object", () => {
  const lazyObject = createLazyObject({ test: () => true, test2: () => false });

  expect(Object.keys(lazyObject)).toEqual(["test", "test2"]);
});

it("should get the values for the lazy object", () => {
  const lazyObject = createLazyObject({ test: () => true, test2: () => false });

  expect(Object.values(lazyObject)).toEqual([true, false]);
});

import { it, expect, vi, describe } from "vitest";
import createLazyObjectDefault, {
  createLazyObject,
  injectLazyProp,
} from "./index";

describe("basic", () => {
  it("should run a test", () => {
    expect(true).toBe(true);
  });

  it("should expose correct exports", () => {
    expect(createLazyObjectDefault).toBe(createLazyObject);
  });
});

describe("createLazyObject", () => {
  it("should get a property", () => {
    const value = true;

    const lazyObject = createLazyObject({ test: () => value });

    expect(lazyObject.test).toBe(value);
  });

  it("should set a property", () => {
    const object = true;
    const setted = false;

    const lazyObject = createLazyObject({ test: () => object });

    lazyObject.test = setted;

    expect(lazyObject.test).toBe(setted);
  });

  it("should cache getting a property", () => {
    const getter = vi.fn().mockImplementation(() => crypto.randomUUID());

    const lazyObject = createLazyObject({ test: getter });

    const result1 = lazyObject.test;
    const result2 = lazyObject.test;

    expect(getter).toHaveBeenCalledOnce();

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

    expect(getter).not.toHaveBeenCalled();

    lazyObject.test;

    expect(getter).toHaveBeenCalledOnce();
  });

  it("should get the keys of the lazy object", () => {
    const lazyObject = createLazyObject({
      test: () => true,
      test2: () => false,
    });

    expect(Object.keys(lazyObject)).toEqual(["test", "test2"]);
  });

  it("should get the values for the lazy object", () => {
    const lazyObject = createLazyObject({
      test: () => true,
      test2: () => false,
    });

    expect(Object.values(lazyObject)).toEqual([true, false]);
  });

  it("should delete a property from the cache", () => {
    const getter = vi.fn();

    const lazyObject = createLazyObject({
      test: () => getter(),
    });

    lazyObject.test;

    // biome-ignore lint/performance/noDelete: test case
    delete lazyObject.test;

    lazyObject.test;

    expect(getter).toHaveBeenCalledOnce();
  });

  it("should represent an object if it's used in whole", () => {
    const lazyObject = createLazyObject({
      test: () => true,
      test2: () => false,
      test3: () => ({ key: "value" }),
      test4: () => undefined,
    });

    expect(lazyObject).toEqual({
      test: true,
      test2: false,
      test3: { key: "value" },
      test4: undefined,
    });
  });
});

describe("injectLazyProp", () => {
  it("should inject a new lazy prop into an existing object", () => {
    const getter = vi.fn().mockImplementation(() => "there");
    const normalObject = { test: "hello" };

    injectLazyProp(normalObject, "test2", () => getter());

    normalObject.test2;

    expect(normalObject.test2).toBe("there");
    expect(getter).toHaveBeenCalledOnce();
  });

  it("should support more than one injected property", () => {
    const normalObject = {
      test: "hello",
    };

    injectLazyProp(normalObject, "test2", () => "there");
    injectLazyProp(normalObject, "test3", () => "mate");

    expect(normalObject.test2).toBe("there");
    expect(normalObject.test3).toBe("mate");
  });

  it("should overwrite an existing property", () => {
    const normalObject = {
      test: "hello",
    };

    injectLazyProp(normalObject, "test", () => "there");

    expect(normalObject.test).toBe("there");
  });

  it("should persist the result of the getter", () => {
    const getter = vi.fn().mockReturnValue(crypto.randomUUID());
    const normalObject = {};

    injectLazyProp(normalObject, "test", getter);

    normalObject.test;
    normalObject.test;

    expect(getter).toHaveBeenCalledOnce();
    expect(normalObject.test).toBe(normalObject.test);
  });
});

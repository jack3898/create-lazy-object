# Create Lazy Object

A tiny zero-dependency package that lets you define an object literal using a utility to lazily compute properties on access.

The first access to the property is cached, and then reused for subsequent accesses.

## API

There are two ways to define a lazy object. The first way is to use `createLazyObject`:

```ts
const lazyObject = createLazyObject({
  test: () => {
    console.log("Doing something expensive...");

    return 42;
  },
});

// Output: 42
console.log(lazyObject.test);
```

The second way is to use `injectLazyProp`:

```ts
const object = {
  test: "hello",
};

injectLazyProp(object, "test2", () => "there!");

// Output: "there!"
console.log(object.test2);
```

## Type safety

This package is one of the most type-safe packages around lazy property creation.

`createLazyObject`'s type signature is inferred from the return type of all the getter functions.

The `injectLazyProp` function asserts the type signature of objects passed into it, which means not only does it inject the property at runtime, but at the type level too.

## Give it a spin!

Check out a pre-configured playground [here](https://stackblitz.com/edit/stackblitz-starters-pyenggnw?file=src%2Findex.ts) and give create-lazy-object a spin!

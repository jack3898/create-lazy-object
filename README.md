# Create Lazy Object

A tiny zero-dependency package that lets you define an object literal using a utility to lazily compute properties on access.

The first access to the property is cached, and then reused for subsequent accesses.

## API

```ts
const lazyObject = createLazyObject({
  test: () => {
    console.log("Doing something expensive...");

    return 42;
  },
});

// 42!
console.log(lazyObject.test);
```

## Type safety

All types are inferred by the return types of the provided lazy functions. It's that simple.

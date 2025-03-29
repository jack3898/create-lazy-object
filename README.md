# Create Lazy Object

A tiny zero dependency package that lets you define an object literal using a utility to lazily compute properties on access.

Powered by proxies!

## API

```ts
function expensiveComputation(): boolean {
  //... imaging something expensive
  return true;
}

const lazyObject = createLazyObject({
  test: expensiveComputation,
});

// true!
console.log(lazyObject.test);
```

## Type safety

Using the getters object provided to `createLazyObject`, all types are inferred by the return types of the getter functions.

Using the utility is almost the same as defining an object as-is, it's just all the properties (and even methods) should be wrapped in functions.

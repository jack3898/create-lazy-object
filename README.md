# Create Lazy Object

A tiny zero-dependency package that lets you define an object literal using a utility to lazily compute properties on access.

The first access to the property is cached, and then reused for subsequent accesses.

Powered by proxies!

## API

```ts
function expensiveComputation(): boolean {
  //... imagine something expensive
  return true;
}

const lazyObject = createLazyObject({
  test: expensiveComputation,
});

// true!
console.log(lazyObject.test);
```

## Remove a cached item

Simply delete the property from the object.

```ts
delete lazyObject.test;
```

Then the next access will recompute the value. Make sure to type the return value of the lazy function as optional (undefined) to prevent any type errors you may get.

## Type safety

All types are inferred by the return types of the provided lazy functions. It's that simple!

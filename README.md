# Create Lazy Object

Define an object literal using a utility to lazily compute properties on access.

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

Using the getters object provided to `createLazyObject`, all types are inferred by the return types of the getter functions. Using the utility is almost the same as defining an object as-is, it's just all the properties (and even methods) should be wrapped in functions.

## Setting

You can use the setters as normal.

```ts
function expensiveComputation(): boolean {
  //... imaging something expensive
  return true;
}

const lazyObject = createLazyObject({
  test: expensiveComputation,
});

lazyObject.test = false;

// false!
console.log(lazyObject.test);
```

## Use cases?

I wrote this package to make creating a context in my backend application more performant.

It is handy to have a lazy object in the context so that it's generated on the fly when the backend accesses them.
# create-lazy-object

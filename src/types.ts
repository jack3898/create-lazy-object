export type LazyOpts<K> = {
  onAccess?: (key: K) => void;
};

export type AnyFn = (...args: unknown[]) => unknown;

type ResolvedGetters<T extends Record<string, AnyFn>> = {
  [K in keyof T]: ReturnType<T[K]>;
};

export type LazyObjectResult<
  LazyObj extends Record<string, AnyFn>,
  NormalObj extends Record<PropertyKey, unknown>,
> = {
  [K in keyof (ResolvedGetters<LazyObj> &
    NormalObj)]: (ResolvedGetters<LazyObj> & NormalObj)[K];
};

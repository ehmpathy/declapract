export enum RequiredAction {
  NO_CHANGE = 'NO_CHANGE',
  FIX_AUTOMATIC = 'FIX_AUTOMATIC',
  FIX_MANUAL = 'FIX_MANUAL',
}

export type ProjectVariablesImplementation = Record<string, any>;

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

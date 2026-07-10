export * from './core/useElAutoScroll';
export * from './core/useGeolocation';
export * from './core/useProviderInject';
export * from './core/useUpdater';

export { default as useHighPrecisionTimer } from './core/useHighPrecisionTimer';
export type { optionsType as HighPrecisionTimerOptions } from './core/useHighPrecisionTimer/hp-time';
export type {
  argsType as ProviderContextConfig,
  ataticType as ProviderContextType,
} from './core/useProviderInject';
export type { Options as UpdaterOptions } from './core/useUpdater';

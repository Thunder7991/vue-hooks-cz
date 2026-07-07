export {
  default as useGeolocation,
  transformWGS84ToGCJ02,
} from './useGeolocation/useGeolocation';
export type {
  PositionState,
  UseGeolocationOptions,
} from './useGeolocation/useGeolocation';

export { default as useHighPrecisionTimer } from './useHighPrecisionTimer';
export type { optionsType as HighPrecisionTimerOptions } from './useHighPrecisionTimer/hp-time';

export { useInjectContext, useProviderContext } from './useProviderInject';
export type { argsType as ProviderContextConfig, ataticType as ProviderContextType } from './useProviderInject';

export { useUpdater } from './useUpdater';
export type { Options as UpdaterOptions } from './useUpdater/plugin';

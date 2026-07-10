# cz-hooks

Vue 3 composition hooks packaged as a Vite library.

## Hooks

| Hook | Import | Description |
| --- | --- | --- |
| [useElAutoScroll](./core/useElAutoScroll/README.md) | `cz-hooks/useElAutoScroll` | Auto scroll hook for Element Plus `el-scrollbar`, with bottom-to-top reset. |
| [useGeolocation](./core/useGeolocation/README.md) | `cz-hooks/useGeolocation` | Browser geolocation hook with WGS84 and GCJ-02 coordinate state. |
| [useDdGeolocation](./core/useGeolocation/README.md#dingtalk-geolocation) | `cz-hooks/useDdGeolocation` | DingTalk JSAPI geolocation hook. Requires `dingtalk-jsapi`. |
| [useHighPrecisionTimer](./core/useHighPrecisionTimer/README.md) | `cz-hooks/useHighPrecisionTimer` | High precision countdown timer based on `performance.now()` and `requestAnimationFrame`. |
| [useProviderInject](./core/useProviderInject/README.md) | `cz-hooks/useProviderInject` | Vue provide/inject helpers for shared composition state. |
| [useUpdater](./core/useUpdater/README.md) | `cz-hooks/useUpdater` | Static asset update detection helper for deployed SPAs. |

## Install

```bash
npm install cz-hooks vue
```

## Imports

```ts
import {
  useElAutoScroll,
  useGeolocation,
  useHighPrecisionTimer,
  useProviderContext,
  useInjectContext,
  useUpdater,
} from 'cz-hooks';
```

Subpath imports are also available:

```ts
import { useElAutoScroll } from 'cz-hooks/useElAutoScroll';
import { useGeolocation } from 'cz-hooks/useGeolocation';
import { useProviderContext } from 'cz-hooks/useProviderInject';
import { useHighPrecisionTimer } from 'cz-hooks/useHighPrecisionTimer';
import { useUpdater } from 'cz-hooks/useUpdater';
```

The DingTalk geolocation hook is optional:

```bash
npm install dingtalk-jsapi
```

```ts
import { useDdGeolocation } from 'cz-hooks/useDdGeolocation';
```

## Add A New Hook

Create a new folder with an `index.ts` entry:

```text
core/
  useNewHook/
    index.ts
    README.md
```

Export the hook from `core/useNewHook/index.ts`:

```ts
export function useNewHook() {
  // ...
}
```

The build automatically scans `core/use*/index.ts`, so subpath imports work without editing `vite.config.ts` or `package.json`:

```ts
import { useNewHook } from 'cz-hooks/useNewHook';
```

Only edit the root `index.ts` when you also want to support this style:

```ts
import { useNewHook } from 'cz-hooks';
```

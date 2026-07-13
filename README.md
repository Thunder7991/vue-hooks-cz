# vue-hooks-cz

A collection of hooks shaped by everyday development practice, designed to make routine work feel faster, smoother, and a little more effortless. While increasing efficiency, we will also offer you a unique experience.

## Hooks

| Hook | Import | Description |
| --- | --- | --- |
| [useElAutoScroll](./core/useElAutoScroll/README.md) | `vue-hooks-cz/useElAutoScroll` | Auto scroll hook for Element Plus `el-scrollbar`, with bottom-to-top reset. |
| [useElTableAutoScroll](./core/useElTableAutoScroll/README.md) | `vue-hooks-cz/useElTableAutoScroll` | Auto scroll hook for Element Plus `el-table`, with table body detection and refresh support. |
| [useGeolocation](./core/useGeolocation/README.md) | `vue-hooks-cz/useGeolocation` | Browser geolocation hook with WGS84 and GCJ-02 coordinate state. |
| [useDdGeolocation](./core/useGeolocation/README.md#dingtalk-geolocation) | `vue-hooks-cz/useDdGeolocation` | DingTalk JSAPI geolocation hook. Requires `dingtalk-jsapi`. |
| [useHighPrecisionTimer](./core/useHighPrecisionTimer/README.md) | `vue-hooks-cz/useHighPrecisionTimer` | High precision countdown timer based on `performance.now()` and `requestAnimationFrame`. |
| [useProviderInject](./core/useProviderInject/README.md) | `vue-hooks-cz/useProviderInject` | Vue provide/inject helpers for shared composition state. |
| [useUpdater](./core/useUpdater/README.md) | `vue-hooks-cz/useUpdater` | Static asset update detection helper for deployed SPAs. |

## Install

```bash
npm install vue-hooks-cz vue
```

## Imports

```ts
import {
  useElAutoScroll,
  useElTableAutoScroll,
  useGeolocation,
  useHighPrecisionTimer,
  useProviderContext,
  useInjectContext,
  useUpdater,
} from 'vue-hooks-cz';
```

Subpath imports are also available:

```ts
import { useElAutoScroll } from 'vue-hooks-cz/useElAutoScroll';
import { useElTableAutoScroll } from 'vue-hooks-cz/useElTableAutoScroll';
import { useGeolocation } from 'vue-hooks-cz/useGeolocation';
import { useProviderContext } from 'vue-hooks-cz/useProviderInject';
import { useHighPrecisionTimer } from 'vue-hooks-cz/useHighPrecisionTimer';
import { useUpdater } from 'vue-hooks-cz/useUpdater';
```

The DingTalk geolocation hook is optional:

```bash
npm install dingtalk-jsapi
```

```ts
import { useDdGeolocation } from 'vue-hooks-cz/useDdGeolocation';
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
import { useNewHook } from 'vue-hooks-cz/useNewHook';
```

Only edit the root `index.ts` when you also want to support this style:

```ts
import { useNewHook } from 'vue-hooks-cz';
```

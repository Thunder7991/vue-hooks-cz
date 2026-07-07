# cz-hooks

Vue 3 composition hooks packaged as a Vite library.

## Install

```bash
npm install cz-hooks vue
```

## Imports

```ts
import {
  useGeolocation,
  useHighPrecisionTimer,
  useProviderContext,
  useInjectContext,
  useUpdater,
} from 'cz-hooks';
```

Subpath imports are also available:

```ts
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

See `useGeolocation/README.md` and `useProviderInject/README.md` for hook-specific notes.

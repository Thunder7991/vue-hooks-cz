# useGeolocation

Browser geolocation hook and DingTalk geolocation hook.

## Browser geolocation

No extra dependency is required except Vue.

```ts
import { useGeolocation } from 'cz-hooks/useGeolocation';
```

## DingTalk geolocation

The DingTalk hook is published as a separate subpath so regular users do not need to install the DingTalk SDK.

Install the peer dependency only when using this hook:

```bash
npm install dingtalk-jsapi
```

Then import it explicitly:

```ts
import { useDdGeolocation } from 'cz-hooks/useDdGeolocation';

const location = useDdGeolocation({
  url: '/api/dingtalk/jsapi-signature',
});
```

Your signature endpoint should return the DingTalk JSAPI config consumed by `dd.config`.

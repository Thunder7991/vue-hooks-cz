# useElAutoScroll

Auto scroll hook for Element Plus `el-scrollbar`.

## What It Does

- Scrolls an `el-scrollbar` content area with `requestAnimationFrame`.
- Resets to the top automatically when the content reaches the bottom.
- Pauses while the user hovers over the scrollbar by default.
- Cleans up animation frames and hover listeners when the component unmounts.
- Exposes `start`, `stop`, and `reset` methods for manual control.

## Advantages

- Works with Element Plus scrollbar instances through `wrapRef` and `setScrollTop`.
- Does not import Element Plus directly, so it will not add Element Plus to the bundle.
- Supports fractional speed values such as `0.1` for smooth low-speed scrolling.
- Keeps the scrolling logic outside the component template, making list components easier to maintain.

## Dependency

This hook is designed for projects that already use Element Plus `el-scrollbar`.

No extra package is required by `cz-hooks`, but your application should install Element Plus when using this hook:

```bash
npm install element-plus
```

## Usage

```vue
<template>
  <el-scrollbar ref="ScrollbarRef" height="100%">
    <div ref="ContentRef">
      <!-- list content -->
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  useElAutoScroll,
  type AutoScrollScrollbar,
} from 'cz-hooks/useElAutoScroll';

const ScrollbarRef = ref<AutoScrollScrollbar>();
const ContentRef = ref<HTMLElement>();

const { start, stop, reset, isRunning, isHovering } = useElAutoScroll(
  ScrollbarRef,
  ContentRef,
  { speed: 0.1 },
);
</script>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `speed` | `number` | `1` | Scroll distance added on every animation frame. Fractional values are supported. |
| `pauseOnHover` | `boolean` | `true` | Whether to pause while the user hovers over the scrollbar. |
| `immediate` | `boolean` | `true` | Whether to start scrolling automatically after mount. |

## Return

| Field | Description |
| --- | --- |
| `isRunning` | Whether auto scrolling is currently running. |
| `isHovering` | Whether the user is hovering over the scrollbar. |
| `start` | Starts auto scrolling. |
| `stop` | Stops auto scrolling and cancels the animation frame. |
| `reset` | Resets the scrollbar to the top. |

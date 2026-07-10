import { nextTick, onMounted, onUnmounted, ref, type Ref } from 'vue';

type MaybeElementRef = HTMLElement | { value?: HTMLElement };

export interface AutoScrollScrollbar {
  wrapRef?: MaybeElementRef;
  setScrollTop?: (value: number) => void;
}

export interface UseElAutoScrollOptions {
  speed?: number;
  pauseOnHover?: boolean;
  immediate?: boolean;
}

export interface UseElAutoScrollReturn {
  isRunning: Ref<boolean>;
  isHovering: Ref<boolean>;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export type UseAutoScrollOptions = UseElAutoScrollOptions;
export type UseAutoScrollReturn = UseElAutoScrollReturn;

const defaultAutoScrollSpeed = 1;

function resolveElement(element: MaybeElementRef | undefined) {
  if (!element)
    return undefined;

  if (element instanceof HTMLElement)
    return element;

  return element.value;
}

export function useElAutoScroll(
  scrollbarRef: Ref<AutoScrollScrollbar | HTMLElement | undefined>,
  contentRef: Ref<HTMLElement | undefined>,
  options: UseElAutoScrollOptions = {},
): UseElAutoScrollReturn {
  const speed = Math.max(0, options.speed ?? defaultAutoScrollSpeed);
  const pauseOnHover = options.pauseOnHover ?? true;
  const immediate = options.immediate ?? true;
  const isRunning = ref(false);
  const isHovering = ref(false);

  let frameId = 0;
  let currentScrollTop = 0;
  let scrollWrap: HTMLElement | undefined;

  function getScrollWrap() {
    const scrollbar = scrollbarRef.value;

    if (!scrollbar)
      return undefined;

    if (scrollbar instanceof HTMLElement)
      return scrollbar;

    return resolveElement(scrollbar.wrapRef);
  }

  function setScrollTop(value: number) {
    const scrollbar = scrollbarRef.value;
    const wrap = getScrollWrap();

    if (!wrap)
      return;

    if (scrollbar && !(scrollbar instanceof HTMLElement) && scrollbar.setScrollTop) {
      scrollbar.setScrollTop(value);
      return;
    }

    wrap.scrollTop = value;
  }

  function bindHoverEvents() {
    const wrap = getScrollWrap();

    if (scrollWrap === wrap)
      return;

    scrollWrap?.removeEventListener('mouseenter', handleMouseEnter);
    scrollWrap?.removeEventListener('mouseleave', handleMouseLeave);
    scrollWrap = wrap;

    if (!pauseOnHover)
      return;

    scrollWrap?.addEventListener('mouseenter', handleMouseEnter);
    scrollWrap?.addEventListener('mouseleave', handleMouseLeave);
  }

  function scrollFrame() {
    bindHoverEvents();

    const wrap = getScrollWrap();
    const content = contentRef.value;

    if (isRunning.value && (!pauseOnHover || !isHovering.value) && wrap && content) {
      const maxScrollTop = Math.max(0, content.scrollHeight - wrap.clientHeight);

      if (maxScrollTop > 0) {
        currentScrollTop = Math.max(currentScrollTop, wrap.scrollTop);

        if (currentScrollTop >= maxScrollTop) {
          currentScrollTop = 0;
          setScrollTop(0);
        }
        else {
          currentScrollTop = Math.min(currentScrollTop + speed, maxScrollTop);
          setScrollTop(currentScrollTop);
        }
      }
    }

    frameId = window.requestAnimationFrame(scrollFrame);
  }

  function handleMouseEnter() {
    isHovering.value = true;
  }

  function handleMouseLeave() {
    isHovering.value = false;
  }

  function start() {
    if (isRunning.value)
      return;

    isRunning.value = true;

    if (!frameId)
      frameId = window.requestAnimationFrame(scrollFrame);
  }

  function stop() {
    isRunning.value = false;

    if (frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }

  function reset() {
    currentScrollTop = 0;
    setScrollTop(0);
  }

  onMounted(() => {
    nextTick(() => {
      bindHoverEvents();

      if (immediate)
        start();
    });
  });

  onUnmounted(() => {
    stop();
    scrollWrap?.removeEventListener('mouseenter', handleMouseEnter);
    scrollWrap?.removeEventListener('mouseleave', handleMouseLeave);
    scrollWrap = undefined;
  });

  return {
    isRunning,
    isHovering,
    start,
    stop,
    reset,
  };
}

export default useElAutoScroll;

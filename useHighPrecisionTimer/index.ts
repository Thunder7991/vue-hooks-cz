import { onUnmounted, ref } from "vue";
import HighPrecisionTimer from "./highPrecisionTimer"
import type { optionsType } from "./hp-time"
export default function useHighPrecisionTimer(options:optionsType) {
    const remaining = ref(options.duration || 0);
    const isRunning = ref(false);
    const timer = ref<HighPrecisionTimer|null>(null);
    
    // 初始化定时器
    const initTimer = () => {
      timer.value = new HighPrecisionTimer({
        ...options,
        onUpdate: (ms) => {
          remaining.value = ms as number;
          if (options.onUpdate) options.onUpdate(ms);
        },
        onEnd: () => {
          isRunning.value = false;
          if (options.onEnd) options.onEnd();
        }
      });
    };
    
    // 启动定时器
    const start = () => {
      if (!timer.value) initTimer();
      timer.value!.start();
      isRunning.value = true;
    };
    
    // 暂停定时器
    const pause = () => {
      if (timer.value) {
        timer.value.pause();
        isRunning.value = false;
      }
    };
    
    // 重置定时器
    const reset = () => {
      if (timer.value) {
        timer.value.reset();
        isRunning.value = false;
      } else {
        remaining.value = options.duration || 0;
      }
    };
    
    // 组件卸载时清理资源
    onUnmounted(() => {
      if (timer.value) {
        timer.value.pause();
      }
    });
    
    // 返回状态和方法
    return {
      remaining,
      isRunning,
      start,
      pause,
      reset
    };
  }

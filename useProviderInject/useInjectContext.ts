/*
 * @Author: thunderchen
 * @Date: 2022-11-24 21:22:45
 * @LastEditTime: 2024-06-20 18:33:58
 * @email: 853524319@qq.com
 */

import {
  inject,
  unref,
  watch,
  Ref,
  reactive,
  InjectionKey,
  ref,
  shallowRef,
  isRef,
  isReactive,
  onUnmounted,
} from 'vue';

const createFunctions = {
  ref: () => ref<any>({}),
  reactive: () => reactive<any>({}),
  shallowRef: () => shallowRef<any>({}),
};

type ExtendedRef<T> = Ref<T> & { __v_isShallow?: boolean; __v_isRef?: boolean };
// stateRef:需要注入的依赖[]
// 依赖key值 symbol
export function useInjectContext(
  PIkey: InjectionKey<Record<string, ExtendedRef<any>>>,
  stateRef: string[],
  refType?: ('ref' | 'reactive' | 'shallowRef')[],
) {
  if (!stateRef.length) {
    return [];
  }
  let temporaryData: any = [];
  let temporaryKey: any = [];
  let Refs: ExtendedRef<any>[] = [];
  const injectRefs = inject(PIkey);
  let i = 1;
  for (const item of stateRef) {
    if (injectRefs) {
      temporaryData.push(() => unref(injectRefs![item]));
      temporaryKey.push('nv' + i);
      const contextRef = refType ? (createFunctions[refType[i - 1]]() as any) : ref<any>({});
      i++;
      Refs.push(contextRef);
    }
  }
  watch(
    temporaryData,
    (temporaryKey) => {
      //数据重组 key
      for (let i = 0; i < stateRef.length; i++) {
        if (isRef(Refs[i]) && (Refs[i].__v_isShallow == true || Refs[i].__v_isRef == true)) {
          Refs[i].value = temporaryKey[i];
        } else if (isReactive(Refs[i])) {
          if (Object.prototype.toString.call(Refs[i]) === '[object Object]') {
            Refs[i] = reactive(temporaryKey[i]);
          } else {
            Refs[i] = ref(temporaryKey[i]);
          }
        }
      }
    },
    {
      deep: true,
      immediate: true,
    },
  );
  //数据销毁
  onUnmounted(() => {
    //TODO
    if (Refs && Refs.length) {
      Refs.forEach((item: any) => {
        if (isReactive(item)) {
          item = null;
        } else {
          item.value = null;
        }
      });
      Refs = [];
      temporaryData = [];
      temporaryKey = [];
    }
  });
  return Refs;
}

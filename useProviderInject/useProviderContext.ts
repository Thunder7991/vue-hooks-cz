/*
 * @Author: thunderchen
 * @Date: 2023-11-10 16:47:35
 * @LastEditTime: 2024-07-25 12:27:14
 * @email: 853524319@qq.com
 * @Description: Provider
 */
import {
  InjectionKey,
  Ref,
  isReactive,
  onUnmounted,
  provide,
  reactive,
  ref,
  shallowRef,
} from 'vue';

const staticProxy = ['ref', 'reactive', 'shallowRef'] as const;
export type ataticType = (typeof staticProxy)[number];
export type argsType = {
  key: string;
  value: any;
  type: ataticType;
};
let context: Record<string, Ref<any>> = {};
export function useProviderContext(
  provideKey: InjectionKey<Record<string, Ref<any>>>,
  provideConfig: argsType[],
): [(key: string, value: any) => void, (key: string) => Ref<any> | undefined] | undefined {
  if (!Array.isArray(provideConfig)) {
    return;
  }
  context = {};
  if (provideConfig.length) {
    for (let i = 0; i < provideConfig.length; i++) {
      const { key, value, type }: argsType = provideConfig[i];
      const validateKey = !(!key || typeof key !== 'string');
      const validateValue = !!value;
      const validateType = !(!type || typeof type !== 'string' || !staticProxy.includes(type));
      if (!validateKey || !validateValue || !validateType) {
        console.error('useProviderContext error');
        continue;
      }
      if (context.hasOwnProperty(key)) {
        console.error('warning: provider context  have a current property!');
        continue;
      }
      switch (type) {
        case 'ref':
          context[key] = ref(value);
          break;
        case 'reactive':
          //TODO
          context[key] = reactive(value);
          break;
        case 'shallowRef':
          context[key] = shallowRef(value);
          break;
        default:
          throw new Error(`Invalid type: ${type}`);
      }
      //添加类型
      provide(provideKey, context);
    }
  } else {
    console.error('warning: The second parameter is empty!');
  }
  const setProxyData = (key: string, value: any) => {
    if (!key) {
      return;
    }
    if (context.hasOwnProperty(key)) {
      //获取元素的类型
      const argObj = provideConfig.find((item: argsType) => {
        return item.key === key;
      });
      if (argObj) {
        if (['ref', 'shallowRef'].includes(argObj.type)) {
          context[key].value = value;
        } else if (
          isReactive(context[key]) &&
          Object.prototype.toString.call(value) === '[object Object]'
        ) {
          context[key] = reactive(value);
        } else {
          throw new Error(`Invalid type: ${argObj.key}`);
        }
      }
    } else {
      throw new Error(`provider context does not have a current property!`);
    }
  };
  const getProxyData = (key: string) => {
    if (!key) {
      return;
    }
    if (context.hasOwnProperty(key)) {
      return context[key];
    } else {
      throw new Error(`provider context does not have a current property!`);
    }
  };
  onUnmounted(() => {
    context = {};
  });
  return [setProxyData, getProxyData];
}

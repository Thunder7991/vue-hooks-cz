
import { Updater, Options } from './plugin';
interface Fn<T = any> {
    (...arg: T[]): T;
  }

export const useUpdater = ( timer = 10000, path?: string) => {
  //初始化实例
  let updaterInstance = Updater.getInstance({timer, path});
  const handleNoUpdate = (cb: Fn) => {
    // 在Updater的no-update事件触发时调用回调函数
    updaterInstance.on('no-update', cb);
  };
  const handleUpdate = (cb: Fn) => {
    // 在Updater的update事件触发时调用回调函数
    updaterInstance.on('update', cb);
  };
  return [handleNoUpdate,handleUpdate];
};

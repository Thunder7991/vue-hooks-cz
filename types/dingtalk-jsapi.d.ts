declare module 'dingtalk-jsapi' {
  export interface ConfigOptions {
    agentId: string;
    corpId: string;
    timeStamp: number;
    nonceStr: string;
    signature: string;
    type?: number;
    jsApiList: string[];
  }

  export interface LocationOptions {
    type?: number;
    useCache?: boolean;
    coordinate?: string;
    withReGeocode?: boolean;
    cacheTimeout?: number;
    targetAccuracy?: string;
    success?: (res: any) => void;
    fail?: (err: any) => void;
    complete?: () => void;
  }

  export function config(options: ConfigOptions): void;
  export function ready(callback: () => void): void;
  export function error(callback: (err: any) => void): void;
  export function getLocation(options: LocationOptions): void;
}

/*
 * @Author: thunderchen
 * @Date: 2025-11-03 16:08:04
 * @LastEditTime: 2025-11-03 16:10:39
 * @email: 853524319@qq.com
 * @Description: 
 */
/*
 * @Author: thunderchen
 * @Date: 2025-09-03 14:01:39
 * @LastEditTime: 2025-11-03 16:07:23
 * @email: 853524319@qq.com
 * @Description:  Geolocation Hook: 获取地理位置并转换为 GCJ-02（国测局）坐标
 */

import { ref, reactive, toRaw } from 'vue';
import useFetchApi from '@/utils/request/useFetchApi';
import * as dd from 'dingtalk-jsapi';
export const transformWGS84ToGCJ02 = (lng, lat) => {
  const a = 6378245.0; // 长半轴
  const ee = 0.00669342162296594323; // 偏心率平方

  // 判断是否在中国境内
  const outOfChina = (lng, lat) => {
    return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
  };

  // 转换纬度
  const transformLat = (lng, lat) => {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lat * Math.PI) + 40.0 * Math.sin((lat / 3.0) * Math.PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((lat / 12.0) * Math.PI) + 320 * Math.sin((lat * Math.PI) / 30.0)) * 2.0) / 3.0;
    return ret;
  };

  // 转换经度
  const transformLng = (lng, lat) => {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin((lng / 3.0) * Math.PI)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((lng / 12.0) * Math.PI) + 300.0 * Math.sin((lng / 30.0) * Math.PI)) * 2.0) / 3.0;
    return ret;
  };

  // 如果不在中国境内，直接返回原坐标
  if (outOfChina(lng, lat)) {
    return { lng, lat };
  }

  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);

  const radLat = (lat / 180.0) * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);

  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * Math.PI);
  dLng = (dLng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * Math.PI);

  const mgLat = lat + dLat;
  const mgLng = lng + dLng;

  return {
    lng: mgLng,
    lat: mgLat,
  };
};
export interface PositionState {
  lng: number;
  lat: number;
}

export interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const defaultOptions: PositionOptions = {
    enableHighAccuracy: options.enableHighAccuracy ?? true,
    timeout: options.timeout ?? 15000,
    maximumAge: options.maximumAge ?? 0,
  };
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 原始 WGS84 坐标
  const wgs84 = reactive<PositionState>({ lng: 0, lat: 0 });
  // 转换后的 GCJ02 坐标
  const gcj02 = reactive<PositionState>({ lng: 0, lat: 0 });
  // 对外暴露的当前位置（默认使用 GCJ02，便于在国内地图中直接使用）
  const startPosition = reactive<PositionState>({ lng: 0, lat: 0 });

  // === 新增：缓存与定时重置逻辑 ===
  const CACHE_TIMEOUT = 5 * 60 * 1000 // 5分钟
  const positionCache = ref<{ lng: number; lat: number; timestamp: number } | null>(null)
  let resetTimer: number | undefined

  const isStartPositionEmpty = () => !startPosition.lng && !startPosition.lat
  const isCacheValid = () => {
    if (!positionCache.value) return false
    return Date.now() - positionCache.value.timestamp < CACHE_TIMEOUT
  }

  const resetPositionCache = () => {
    startPosition.lng = 0
    startPosition.lat = 0
    positionCache.value = null
    if (resetTimer) {
      clearTimeout(resetTimer)
      resetTimer = undefined
    }
  }

  const setPositionWithCache = (lng: number, lat: number) => {
    startPosition.lng = lng
    startPosition.lat = lat
    positionCache.value = { lng, lat, timestamp: Date.now() }
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = window.setTimeout(() => {
      resetPositionCache()
    }, CACHE_TIMEOUT)
  }

  const getLocation =async () => {
    error.value = null;

    // 优先返回有效缓存
    if (isCacheValid() && positionCache.value) {
      const { lng, lat } = positionCache.value
      startPosition.lng = lng
      startPosition.lat = lat
      return
    }

    // 若 startPosition 无值（被重置或从未定位），则重新获取
    if (isStartPositionEmpty()) {
      if (loading.value) return
      loading.value = true

      try {
        await getLocationOnce()
      } finally {
        loading.value = false
      }
    }
  };

  const getLocationOnce = () =>
    new Promise<PositionState>((resolve, reject) => {
      loading.value = true;
      //获取access token
      useFetchApi(`******`)
        .post({
          request_body_json: {
            url: window.location.href,
          },
        })
        .json()
        .then(({ data }) => {
          if (data.value) {
            console.log(176,data.value)
            const config = data.value as {
              jsapiTicket: string;
              timeStamp: number;
              agentId: string;
              corpId: string;
              sign: string;
              accessToken: string;
              url: string;
              nonceStr: string;
            };
            //验证 钉钉
            dd.config({
              agentId: config.agentId, // 企业内部应用，该值为企业内部应用的agentId。
              corpId: config.corpId, //必填，企业ID
              timeStamp: config.timeStamp, // 必填，生成签名的时间戳
              nonceStr: config.nonceStr, // 必填，自定义固定字符串。
              signature: config.sign, // 必填，签名
              type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
              jsApiList: ['getLocation'], // 必填，需要使用的jsapi列表，注意：不要带dd。
            });
            dd.error(function (err) {
              loading.value = false;
              if (err.toString().includes('notInDingTalk')) {
                showToast({
                  message: '不支持当前环境',
                  duration: 2000,
                });
                error.value = '不支持当前环境';
                reject(error.value);
                return 
              }
              if (err.errorCode == 29) {
                showToast({
                  message: '签名验证失败',
                  duration: 2000,
                });
                error.value = '签名验证失败';
                reject(error.value);
              } else {
                showToast({
                  message: err.errorMessage,
                  duration: 2000,
                });
                (error.value = err.errorMessage), reject(error.value);
              }
            }); //该方法必须带上，用来捕鉴权出现的异常信息，否则不方便排查出现的问题

            dd.ready(function () {
              dd.getLocation({
                type: 1,
                useCache: false,
                coordinate: '1',
                withReGeocode: false,
                cacheTimeout: 30,
                targetAccuracy: '40',
                success: (res) => {
                   loading.value = false;
                      const { latitude, longitude } = res;
                if (res.errorCode === 4 && latitude===0 && longitude===0) {
                         showToast({
                  message: '定位服务未开启，请先开启定位服务',
                  duration: 2000,
                });
                reject('定位服务未开启，请先开启定位服务');
                return 
                  }
               
                  // 使用缓存机制设置位置（替代直接赋值）
                  setPositionWithCache(longitude, latitude);
                  resolve({ lng: startPosition.lng, lat: startPosition.lat });
                },
                fail: (err: any) => {
                  loading.value = false;
                  (error.value = err.errorMessage), reject(error.value);
                },
                complete: () => {
                  loading.value = false;
                },
              });
            });
          }
        });
    });
  return {
    // 状态
    loading,
    error,
    // 坐标（WGS84 / GCJ02 / 默认导出为 startPosition=GCJ02）
    wgs84,
    gcj02,
    startPosition,
    // 方法
    getLocation,
    getLocationOnce,
  };
};

export default useGeolocation;

/*
 * @Author: thunderchen
 * @Date: 2025-09-03 14:01:39
 * @LastEditTime: 2025-09-05 13:01:59
 * @email: 853524319@qq.com
 * @Description:  Geolocation Hook: 获取地理位置并转换为 GCJ-02（国测局）坐标
 */

import { ref, reactive } from 'vue'

export const transformWGS84ToGCJ02 = (lng, lat) => {
  const a = 6378245.0; // 长半轴
  const ee = 0.00669342162296594323; // 偏心率平方
  
  // 判断是否在中国境内
  const outOfChina = (lng, lat) => {
    return (lng < 72.004 || lng > 137.8347) || (lat < 0.8293 || lat > 55.8271);
  };
  
  // 转换纬度
  const transformLat = (lng, lat) => {
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * Math.PI) + 40.0 * Math.sin(lat / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * Math.PI) + 320 * Math.sin(lat * Math.PI / 30.0)) * 2.0 / 3.0;
    return ret;
  };
  
  // 转换经度
  const transformLng = (lng, lat) => {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin(lng / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * Math.PI) + 300.0 * Math.sin(lng / 30.0 * Math.PI)) * 2.0 / 3.0;
    return ret;
  };
  
  // 如果不在中国境内，直接返回原坐标
  if (outOfChina(lng, lat)) {
    return { lng, lat };
  }
  
  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  
  const radLat = lat / 180.0 * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
  
  const mgLat = lat + dLat;
  const mgLng = lng + dLng;
  
  return {
    lng: mgLng,
    lat: mgLat
  };
};
export interface PositionState {
  lng: number
  lat: number
}

export interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const defaultOptions: PositionOptions = {
    enableHighAccuracy: options.enableHighAccuracy ?? true,
    timeout: options.timeout ?? 15000,
    maximumAge: options.maximumAge ?? 0
  }

  const supported = typeof window !== 'undefined' && 'geolocation' in navigator
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 原始 WGS84 坐标
  const wgs84 = reactive<PositionState>({ lng: 0, lat: 0 })
  // 转换后的 GCJ02 坐标
  const gcj02 = reactive<PositionState>({ lng: 0, lat: 0 })
  // 对外暴露的当前位置（默认使用 GCJ02，便于在国内地图中直接使用）
  const startPosition = reactive<PositionState>({ lng: 0, lat: 0 })

  const handleSuccess = (position: GeolocationPosition) => {
    const wgs84Lng = position.coords.longitude
    const wgs84Lat = position.coords.latitude

    wgs84.lng = wgs84Lng
    wgs84.lat = wgs84Lat

    const { lng, lat } = transformWGS84ToGCJ02(wgs84Lng, wgs84Lat)
    gcj02.lng = lng
    gcj02.lat = lat

    startPosition.lng = lng
    startPosition.lat = lat
  }

  const getLocation = () => {
    error.value = null
    if (!supported) {
      error.value = '您的浏览器不支持定位功能'
      return
    }
    loading.value = true
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        try {
          
          handleSuccess(pos)
        } finally {
          loading.value = false
        }
      },
      (err) => {
        loading.value = false
        // 常见错误码：1-权限拒绝 2-位置不可用 3-超时
        if (err.code === 1) error.value = '获取定位权限被拒绝'
        else if (err.code === 2) error.value = '暂时无法获取您的位置'
        else if (err.code === 3) error.value = '获取位置超时，请重试'
        else error.value = err.message || '定位失败'
      },
      defaultOptions
    )
  }

  const getLocationOnce = () =>
    new Promise<PositionState>((resolve, reject) => {
      if (!supported) {
        const msg = '您的浏览器不支持定位功能'
        error.value = msg
        reject(new Error(msg))
        return
        }
      loading.value = true
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          try {
            handleSuccess(pos)
            resolve({ lng: startPosition.lng, lat: startPosition.lat })
          } catch (e) {
            reject(e)
          } finally {
            loading.value = false
          }
        },
        (err) => {
          loading.value = false
          if (err.code === 1) error.value = '获取定位权限被拒绝'
          else if (err.code === 2) error.value = '暂时无法获取您的位置'
          else if (err.code === 3) error.value = '获取位置超时，请重试'
          else error.value = err.message || '定位失败'
          reject(error.value)
        },
        defaultOptions
      )
    })

  return {
    // 状态
    supported,
    loading,
    error,
    // 坐标（WGS84 / GCJ02 / 默认导出为 startPosition=GCJ02）
    wgs84,
    gcj02,
    startPosition,
    // 方法
    getLocation,
    getLocationOnce
  }
}

export default useGeolocation
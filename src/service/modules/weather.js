import { getCity, getTemp } from '../request'
import { KEY_weather } from '../request/config'

// 实时天气
export function getTemp_Now(id) {
  return getTemp.get({
    url: `v7/weather/now?location=${id}&key=${KEY_weather}`,
  })
}

// 24小时天气
export function getTemp_24(id) {
  return getTemp.get({
    url: `v7/weather/24h?location=${id}&key=${KEY_weather}`,
  })
}

// 7天天气
export function getTemp_7d(id) {
  return getTemp.get({
    url: `v7/weather/7d?location=${id}&key=${KEY_weather}`,
  })
}

// 实时空气质量
export function getTemp_air(id) {
  return getTemp.get({
    url: `v7/air/now?location=${id}&key=${KEY_weather}`,
  })
}

// 生活指数
export function getTemp_indices(id) {
  return getTemp.get({
    url: `v7/indices/1d?type=1,2,3,4,5,6&location=${id}&key=${KEY_weather}`,
  })
}

// 热门城市
export function getHotCity() {
  return getCity.get({
    url: `v2/city/top?number=20&range=cn&key=${KEY_weather}`,
  })
}

// 搜索城市
export function getWeatherSearchCity(name) {
  let url = 'v2/city/lookup?location='
  let key = `&key=${KEY_weather}`
  const arr = url.concat(name, key)
  return getCity.get({
    url: arr,
  })
}

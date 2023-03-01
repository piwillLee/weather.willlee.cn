import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { getHotCity, getWeatherSearchCity } from 'src/service/modules/weather.js'

const useMainStore = defineStore('main', {
  state: () => ({
    currentTime: dayjs(),
    tempNow: [],
    temp7d: [],
    currentCityID: '',
    isShowTabbar: true,
    localCity: '',
  }),
  actions: {
    async searchCityAction(location) {
      const res = await getWeatherSearchCity(location)
      const localCity = {
        name: res.location[0].name,
        id: res.location[0].id,
      }

      // 添加到城市列表
      this.localCity = localCity
    },
    getGeoPosition(context) {
      // 1.申请获取地理定位
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => getLocation(pos), // 成功函数
          (e) => showError(e), // 失败函数
          { timeout: 5000 } // PositionOptions参数 设置超时时间
        )
      } else {
        alert('浏览器不支持地理定位！')
      }

      // 2.成功获取到定位
      const getLocation = (pos) => {
        // 判断是否已获取到定位 ? 返回经纬度 : 直接使用ip定位
        // pos = pos ? `${pos.coords.longitude},${pos.coords.latitude}` : "auto_ip";
        pos = `${pos.coords.longitude},${pos.coords.latitude}`
        console.log('当前城市定位', pos)

        this.searchCityAction(pos)
      }
    },
  },
})

export default useMainStore

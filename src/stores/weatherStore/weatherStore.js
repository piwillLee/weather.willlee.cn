import { defineStore } from "pinia";
import dayjs, { Ls } from "dayjs";
import {
  getWeatherSearchCity,
  getTemp_Now,
  getTemp_24,
  getTemp_7d,
  getTemp_air,
  getTemp_indices,
} from "src/service";

import { Loading, QSpinnerTail } from "quasar";

const useWeatherStore = defineStore("weather", {
  state() {
    return {
      isLoading: false,
      showWeatherDate: true,
      currentTime: dayjs(),
      localCity: null, // 浏览器地理定位城市
      defaultCity: {
        name: "北京",
        id: "101010100",
      },
      cityList: [],
      cityData: [],
      tempNow: [],
      tempNowObj: "",
      tempNowAir: "",
      tempNowAirObj: "",
      tempIndices: "",
      tempIndicesObj: "",
      temp24: [],
      temp7d: [],

      currentCity: "北京",
      currentCityID: "101010100",
      hotCityList: "",
      searchValue: "",
    };
  },
  actions: {
    async getCityNow(city) {
      let now = null;
      const res = await getTemp_Now(city.id);
    },

    // 获取天气数据
    async getCityData(id, name) {
      let now;
      // 实时天气
      const res = await getTemp_Now(id);
      now = res.now;

      // 24小时天气
      let day;
      const res24 = await getTemp_24(id);
      day = res24.hourly;

      // 七天天气;l
      let week;
      await getTemp_7d(id).then((res) => {
        week = res.daily;
      });

      // 天气质量
      let air;
      await getTemp_air(id).then((res) => {
        air = res.now;
        // console.log("------天气质量", tempNowAir.value);
      });
      // 生活指数
      let indices;
      await getTemp_indices(id).then((res) => {
        indices = res.daily;
      });

      const cityDataObj = {
        cityName: name,
        cityId: id,
        cityData: {
          now,
          day,
          week,
          air,
          indices,
        },
      };

      return cityDataObj;
    },

    getAllCityData() {
      Loading.show({
        message: "请求数据中，请稍等...",
        spinner: QSpinnerTail,
      });
      let promise = this.cityList.map((value) => {
        return this.getCityData(value.id, value.name);
      });

      Promise.all(promise).then((data) => {
        this.cityData = [];
        data.forEach((value) => {
          this.cityData.push(value);
        });

        Loading.hide(); // 请求结束
      });
    },

    // 搜索城市
    async searchCityAction(location) {
      const res = await getWeatherSearchCity(location);
      const localCity = {
        name: res.location[0].name,
        id: res.location[0].id,
      };
      this.localCity = localCity;
      // 添加到城市列表
      this.cityList.unshift(this.localCity);
      // 发送网络请求
      this.getAllCityData();
    },

    // 获取定位城市
    getGeoPosition(context) {
      Loading.show({
        message: "定位中，请稍等...",
      });
      // 1.申请获取地理定位
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            getLocation(pos);
            Loading.hide();
          }, // 成功函数
          (e) => {
            this.setDefaultCity();
            Loading.hide();
            showError(e);
          }, // 失败函数
          { timeout: 5000 } // PositionOptions参数 设置超时时间
        );
      } else {
        alert("浏览器不支持地理定位！");
      }

      // 2.成功获取到定位
      const getLocation = (pos) => {
        pos = `${pos.coords.longitude},${pos.coords.latitude}`; // 定位城市经纬度
        this.searchCityAction(pos);
      };

      // 3.定位失败反馈
      function showError(error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("定位失败，用户拒绝请求地理定位");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("定位失败，位置信息是不可用");
            break;
          case error.TIMEOUT:
            alert("定位失败，请求获取用户位置超时");
            break;
          case error.UNKNOWN_ERROR:
            alert("未知错误，定位系统失效");
            break;
        }
      }
    },

    // 设置默认城市
    setDefaultCity() {
      this.localCity = this.defaultCity;
      // 添加到城市列表
      this.cityList.unshift(this.localCity);
      // 清空cityData
      // this.cityData = [];
      // 发送网络请求
      this.getAllCityData();
    },
  },
});

export default useWeatherStore;

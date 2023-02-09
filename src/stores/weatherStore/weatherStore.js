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

import { Loading } from "quasar";

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
      console.log("实时天气", now);

      // 24小时天气
      let day;
      const res24 = await getTemp_24(id);
      day = res24.hourly;

      console.log("24小时", day);

      // 七天天气;l
      let week;
      await getTemp_7d(id).then((res) => {
        week = res.daily;
        console.log("七天天气", week);
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
        // console.log("------生活指数", tempIndices.value);
      });
      console.log("99999999999999999999999");
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

      this.cityData.push(cityDataObj);

      console.log("cityDate----------", this.cityData);
    },
    async searchCityAction(location) {
      const res = await getWeatherSearchCity(location);
      const localCity = {
        name: res.location[0].name,
        id: res.location[0].id,
      };

      this.localCity = localCity;
      // 添加到城市列表
      this.cityList.unshift(this.localCity);

      // 清空cityData
      this.cityData = [];

      // 发送网络请求
      this.cityList.map((value) => {
        this.getCityData(value.id, value.name);
      });
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
        // 判断是否已获取到定位 ? 返回经纬度 : 直接使用ip定位
        // pos = pos ? `${pos.coords.longitude},${pos.coords.latitude}` : "auto_ip";
        pos = `${pos.coords.longitude},${pos.coords.latitude}`;
        console.log("当前城市定位", pos);
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
    setDefaultCity() {
      this.localCity = this.defaultCity;
      // 添加到城市列表
      this.cityList.unshift(this.localCity);
      // 清空cityData
      this.cityData = [];
      // 发送网络请求
      this.cityList.map((value) => {
        this.getCityData(value.id, value.name);
      });
    },
  },
});

export default useWeatherStore;

<template>
  <q-pull-to-refresh @refresh="refresh">
    <div class="weather-template " v-show="showWeatherDate">
      <div class="cityName row justify-center text-h5">{{ props.cityData.cityName }}</div>
      <div class="tempNow q-mt-xl">
        <div class="temp-left text-h1 q-mr-md ">
          {{ props.cityData.cityData.now.temp }}
        </div>
        <div class="temp-right">
          <span class="text-h6">℃</span>
          <span>体感
            <br>
            <span class="q-mr-xs">{{ props.cityData.cityData.now.feelsLike }}</span>
            <span>℃</span>
          </span>
        </div>
      </div>

      <!-- 24小时 -->
      <div class="tempToday hide-scrollbar  row  no-wrap " @touchstart.stop @mousedown.stop>
        <div class="item column items-center no-wrap" v-for="(item, index) in props.cityData.cityData.day" :key="index">
          <!-- 温度 -->
          <div class="temp">
            {{ item.temp }}
          </div>
          <!-- icon -->
          <img class="weather-icon" :src="`weatherIcons/${item.icon}.svg`" alt="QWeather">
          <!-- 天气 -->
          <div class="time">
            {{ item.text }}
          </div>
          <!-- 风向 -->
          <div class="windDir">
            {{ item.windDir }}
          </div>
          <!-- 时间 -->
          <div class="time">
            {{ formatHM(item.fxTime) }}
          </div>
        </div>
      </div>

      <!-- 7天 -->
      <div class="temp7d 	">
        <div class="temp7d-item" v-for="item, index in props.cityData.cityData.week" :key="index">
          <span class="week"> {{ fmtDate(item.fxDate) }} {{ getWeek(formatE(item.fxDate)) }}</span>
          <img class="weather-icon" :src="`weatherIcons/${item.iconDay}.svg`" alt="QWeather">
          <span class="temp-range">
            <span>{{ item.tempMin }}</span>
            <span>{{ item.tempMax }}</span>
          </span>
        </div>
      </div>

      <!-- 天气指数 -->
      <weather-content-card :content="content_now"></weather-content-card>


      <!-- 空气质量 -->
      <div class="air  shadow-1 card-box q-pa-lg">
        <div class="header q-pb-lg">空气质量</div>
        <div class="footer">
          <div v-for="(item, index) in content_air" :key="index">
            <div class="air-footer-item">
              <div class="name">{{ item.name }}</div>
              <div class="text">{{ item.text }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 生活指数 -->
      <weather-content-card :content="content_indices"></weather-content-card>

      <!-- 太阳 -->
      <weather-sun-card :cardData="cardData_sun"> </weather-sun-card>

      <!-- 月亮 -->
      <weather-sun-card :cardData="cardData_moon"> </weather-sun-card>
    </div>

    <q-inner-loading class="loading" :showing="isLoading" label="获取数据中..." label-class="text-teal"
      label-style="font-size: 1.5em" />
  </q-pull-to-refresh>

</template>
<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia';
import fmtDate from "src/utils/format/format-day"
import axios from 'axios';
import gsap from 'gsap';

import useWeatherStore from 'src/stores/weatherStore/weatherStore'
import { date } from 'quasar'

import WeatherContentCard from './weatherContentCard.vue';
import WeatherSunCard from './weather-sun-card.vue'

// 获取父组件传来的城市 id
const props = defineProps({
  cityData: {
    type: Object,
    default: () => ({})
  }
})
// console.log('cityData----------', props.cityData);

const weatherStore = useWeatherStore();
const { showWeatherDate, isLoading, temp24, tempNowObj, tempNowAir, tempNowAirObj, tempIndices, tempIndicesObj, locationCity, allCityList, cityList } = storeToRefs(weatherStore)

onMounted(() => {
  gsap.to('.weather-template', { y: 0 })

})

/**
 * 下拉刷新
 */


function showWeatherLoading () {
  isLoading.value = true
  showWeatherDate.value = false

  // 清空cityData
  weatherStore.cityData = [];
  // 发送网络请求
  weatherStore.cityList.map((value) => {
    weatherStore.getCityData(value.id, value.name);
  });

  setTimeout(() => {


    isLoading.value = false
    showWeatherDate.value = true

  }, 1000)


}

function refresh (done) {
  showWeatherLoading()
  done()
  // setTimeout(() => {

  // }, 1000)
}

// 实时天气指数
const content_now = [
  {
    name: '体感',
    text: props.cityData.cityData.now.feelsLike + " ℃",
    icon: 'bi-thermometer-half',
  },
  {
    name: '风力',
    text: props.cityData.cityData.now.windScale + " 级",
    icon: 'bi-wind',
  },
  {
    name: '湿度',
    text: props.cityData.cityData.now.humidity + " %",
    icon: 'bi-moisture',
  },
  {
    name: '云量',
    text: props.cityData.cityData.now.cloud + " %",
    icon: 'bi-cloud',
  },
  {
    name: '能见度',
    text: props.cityData.cityData.now.vis + " KM",
    icon: 'bi-eye',
  },
  {
    name: '气压',
    text: props.cityData.cityData.now.pressure + " hPa",
    icon: 'bi-speedometer2',
  },

]

// 生活指数数据
const content_indices = [
  {
    name: props.cityData.cityData.indices[0]?.name,
    text: props.cityData.cityData.indices[0]?.category,
    icon: 'bi-universal-access',
  },
  {
    name: props.cityData.cityData.indices[1]?.name,
    text: props.cityData.cityData.indices[1]?.category,
    icon: 'bi-car-front',
  },
  {
    name: props.cityData.cityData.indices[2]?.name,
    text: props.cityData.cityData.indices[2]?.category,
    icon: 'bi-incognito',
  },
  {
    name: props.cityData.cityData.indices[3]?.name,
    text: props.cityData.cityData.indices[3]?.category,
    icon: 'bi-chevron-double-right',
  },
  {
    name: props.cityData.cityData.indices[4]?.name,
    text: props.cityData.cityData.indices[4]?.category,
    icon: 'bi-shield',
  },
  {
    name: props.cityData.cityData.indices[5]?.name,
    text: props.cityData.cityData.indices[5]?.category,
    icon: 'bi-image-alt',
  },

]

// 空气指数
const content_air = [
  {
    name: "PM2.5",
    text: props.cityData.cityData.air.pm2p5,
    // icon: 'bi-universal-access',
  },
  {
    name: "PM10",
    text: props.cityData.cityData.air.pm10,
    // icon: 'bi-car-front',
  },
  {
    name: "CO",
    text: props.cityData.cityData.air.co,
    icon: 'bi-incognito',
  },
  {
    name: "SO2",
    text: props.cityData.cityData.air.so2,
    icon: 'bi-chevron-double-right',
  },
]

// 太阳
const cardData_sun = {

  title: '太阳',
  rise: {
    name: '日出',
    time: props.cityData.cityData.week[0].sunrise
  },
  set: {
    name: '日落',
    time: props.cityData.cityData.week[0].sunset
  },

}
// 月亮
const cardData_moon = {
  title: '月亮',
  rise: {
    name: '月出',
    time: props.cityData.cityData.week[0].moonrise
  },
  set: {
    name: '月落',
    time: props.cityData.cityData.week[0].moonset
  },
}




const timeStamp = Date.now()
const formatHM = (time) => {
  return date.formatDate(time, 'HH:mm')
}
const formatW = (time) => {
  return date.formatDate(time, 'dddd')
}
// 星期几
const formatE = (time) => {
  return date.formatDate(time, 'E')
}

const getWeek = (time) => {
  var week = ['一', '二', '三', '四', '五', '六', '日',]
  for (var i = 0; i < week.length; i++) {
    if (i == time - 1) {
      return '周' + week[i]
    }
  }
}

const tempIndicesIconArr = ['bi-universal-access', 'bi-car-front', 'bi-incognito', 'bi-chevron-double-right', 'bi-shield', 'bi-image-alt']

const tempIndicesIcon = (index) => {

  return tempIndicesIconArr[index];
}

</script>

<style scoped>
.weather-template {
  position: absolute;
  width: 100%;
  padding: var(--pd);
}

.tempNow {
  display: flex;
  justify-content: center;
  align-items: center;
}



.temp-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90px;
  font-size: 12px;

}



/* 今天 */
.tempToday {
  overflow-x: auto;
}

.windDir {
  font-size: 12px;
  white-space: nowrap;
  transform: scale(0.8);
}

.item {

  /* display: flex; */
  /* flex-direction: column; */
  padding: 120px 20px 16px;
}



.weather-icon {
  width: 24px;
  margin-bottom: 6px;
}


/* 七天 */

.temp7d {
  padding: 16px 0;
}

.temp7d-item {
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.week {
  flex: 33.33%;
}

.weather-icon {
  width: 24px;
  height: 24px;
  filter: invert();

  flex: 33.33%;
}

.temp-range {
  margin-left: 16px;
  flex: 33.33%;
  display: flex;
  justify-content: flex-end;
}

.temp-range span {
  margin-left: 6px;
}

.now {

  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
}

.card-box {
  margin-top: 16px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.068);
}

.now-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 33.33%;
  margin-top: 12px;
}

.now-inner .icon {
  width: 20px;
  height: 20px;
  font-size: 26px;
  margin: 8px 0 2px;
}

.now-inner .text {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 12px;
}

.now-inner .data {
  font-size: 12px;
  font-weight: bold;

}

/* 空气指数 */
.air {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.air .header {
  display: flex;
  align-items: flex-end;

}

.air .header .aqi {
  font-size: 24px;
  line-height: 24px;
  margin-right: 6px;
}

.air .header .category {
  font-size: 12px;
  line-height: 18px;
}

.air .footer {
  display: flex;
  justify-content: space-between;
}

.air-footer-item .name {
  font-size: 12px;
  opacity: 0.5;
}

.air-footer-item .text {
  font-size: 16px;
}

/* 日出 日落*/
.sun {
  padding: 20px;
}

.sun-status {
  display: flex;
  justify-content: space-between;
}

/* .sun-time {
  display: flex;
  align-items: center;


} */
</style>

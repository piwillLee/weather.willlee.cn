<template>
  <div class="weather">
    <div class="weather-card">
      <div class="header">
        <div class="tempNow">{{ tempNow?.temp }}°</div>
        <div class="message">
          <div class="position">
            {{ locationCity.name }}
            <q-icon name="bi-cursor-fill" />
          </div>
          <div class="range">
            <span>{{ tempToday?.tempMin }}°</span>
            <span>{{ tempToday?.tempMax }}°</span>
          </div>
        </div>
      </div>
      <div class="weekDate">
        <div class="item" v-for="(item, index) in temp7d" :key="index">
          <!-- <div class="date">11/30 周三</div> -->
          <div class="date">{{ fmtDate(item.fxDate) }}</div>

          <img class="weather-icon tempNow" :src="`src/assets/img/weatherIcons/${item.iconDay}.svg`" alt="QWeather" />
          <div class="tempRange">
            {{ item.tempMin + '/' + item.tempMax }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import fmtDate from 'src/utils/format/format-day'

import { storeToRefs } from 'pinia'

import useWeatherStore from 'src/stores/weatherStore/weatherStore'

const weatherStore = useWeatherStore()
const { temp7d, tempNow, tempNowObj, locationCity, cityList, cityData } = storeToRefs(weatherStore)

// 添加 locationCity 到 cityList
const addLocationCity = () => {
  let isHasLocationCity = false

  cityList.value.map((value, index) => {
    if (value.id == locationCity.value.id) {
      isHasLocationCity = true
    }
  })

  if (isHasLocationCity) {
    return
  } else {
    cityList.value.unshift(locationCity.value)
  }
}
// 本地城市是否有值
if (locationCity.value) {
  addLocationCity()
  console.log('--------------', cityList.value)
}

const url7d = `https://devapi.qweather.com/v7/weather/7d?location=${locationCity.value.id}&key=7823d8770a4e47e5825a87043157331a`
const urlNow = `https://devapi.qweather.com/v7/weather/now?location=${locationCity.value.id}&key=7823d8770a4e47e5825a87043157331a`

const tempToday = ref()

onMounted(() => {
  if (tempNow.value == 0) {
    axios.get(urlNow).then((res) => {
      tempNow.value = res.data.now
      // console.log('实时天气：', tempNow.value);
      // console.log(tempNow.value.temp);

      // console.log(tempNowObj.value);
    })
    axios.get(url7d).then((res) => {
      temp7d.value = res.data.daily
      tempToday.value = temp7d.value[0]
      // console.log('七日天气数据：', temp7d.value);
    })
  }
})
</script>

<style scoped>
.weather-card {
  width: 300px;
  background-color: rgb(255, 255, 255);
  height: 130px;
  color: #555555;
  border-radius: 6px;
  border: 1px solid #d0d0d0;
}

.weather-card .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 70px;
  border-bottom: 1px solid #b7b7b7;
}

.tempNow {
  width: 40px;
  height: 40px;
  margin: 4px 0;
  font-size: 36px;
  text-align: center;
  line-height: 40px;
}

.message {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.range {
  display: flex;
}

small {
  margin-left: 10px;
}

.weekDate {
  display: flex;
  flex-direction: row;
}

.weekDate .item {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  flex: 1;
  min-width: 0;
}

.weekDate .date {
  font-size: 12px;
  /* margin-top: 3px; */
}

.weather-icon {
  width: 20px;
  height: 20px;
  margin: 2px 0;
  opacity: 0.5;
}

.tempRange {
  font-size: 12px;
}

span {
  flex: 1;
}
</style>

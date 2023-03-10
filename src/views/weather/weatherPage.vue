<template>
  <div class="weather weather-bg">
    <div class="page-layout">
      <!-- header -->
      <div class="page-header">
        <div class="left botton">
          <img class="logo" src="favicon.ico" alt="" />
          天天天气
        </div>
        <div class="title botton"></div>
        <div class="right botton">
          <q-icon @click="onLeftBtnClick" name="my_location" class="icon q-mr-md" size="xs" />
          <q-icon @click="onRightBtnClick" name="bi-plus-lg" class="icon" size="sm" />
        </div>
      </div>
      <!-- content -->
      <div class="page-content hide-scrollbar" :style="{ width: windowWidth + 'px' }">
        <div class="weather-page" v-touch-swipe.mouse.right.left="handleSwipe" :style="move">
          <div
            ref="cardRef"
            :style="{ width: windowWidth + 'px' }"
            class="card scroll hide-scrollbar"
            v-for="(item, index) in cityData"
            :key="index"
          >
            <weather-template :cityData="item"></weather-template>
          </div>
        </div>
      </div>
      <!-- footer -->
      <div class="page-footer column items-center justify-center">
        <div class="footer-index row justify-center items-center">
          <div class="index-dot q-mx-xs" v-for="(item, index) in cityList.length" :key="index">
            <q-icon :name="indexIcon(index)" :class="currentIndex == index ? '' : 'opacity-5'" />
          </div>
        </div>
      </div>
    </div>
    <q-inner-loading
      class="loading"
      :showing="visible"
      label="获取数据中..."
      label-class="text-teal"
      label-style="font-size: 1.5em"
    />
  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed, watch, toRaw } from 'vue'
import { storeToRefs } from 'pinia'
import WeatherTemplate from './cpns/weather-template.vue'
import useWeatherStore from 'src/stores/weatherStore/weatherStore'
import { useQuasar } from 'quasar'
import { useGeolocation } from '@vueuse/core'
const $q = useQuasar()
const visible = ref(false)
const geoPosition = ref()
// 获取经纬度
const { coords } = useGeolocation()
// coords 是 RefImpl，不能直接取值，用 watch 取值
watch(coords, (old) => {
  geoPosition.value = {
    latitude: old.latitude,
    longitude: old.longitude,
  }
})
// 路由
const router = useRouter()
const weatherStore = useWeatherStore()

// 本地是否有城市缓存
if ($q.localStorage.getItem('cityList')) {
  // 发送网络请求
  weatherStore.getAllCityData()
} else {
  // 获取城市定位，成功时发送网络请求
  weatherStore.getGeoPosition()
}

// 获取定位
const onLeftBtnClick = () => {
  weatherStore.getGeoPosition()
}

const onRightBtnClick = () => {
  router.push('/weather/city')
}

const { cityList, cityData } = storeToRefs(weatherStore)

// 当前索引值
let currentIndex = ref('')
// 需要移动距离
let moveDistance = ref('0')

const move = computed(() => {
  return {
    left: moveDistance.value + 'px',
  }
})
// 当前总共移动距离
let totalDistance = ref('0')

// 获取屏幕宽度
const windowWidth = ref('0')
onMounted(() => {
  windowWidth.value = document.documentElement.clientWidth
  window.addEventListener('resize', () => {
    windowWidth.value = document.documentElement.clientWidth
  })
})

// 滑动切换
const handleSwipe = (evt) => {
  // 向左
  if (evt.direction === 'left' && currentIndex.value < cityList.value.length - 1) {
    currentIndex.value++
    totalDistance.value -= windowWidth.value
    moveDistance.value = totalDistance.value
  }
  // 向右
  if (evt.direction === 'right' && currentIndex.value > 0) {
    currentIndex.value--
    totalDistance.value += windowWidth.value
    moveDistance.value = totalDistance.value
  }
}

// 页面底部 icon
const indexIcon = (index) => {
  const icon = currentIndex.value == index ? 'bi-record-fill' : 'bi-record'
  const iconGeo = currentIndex.value == index ? 'bi-geo-alt-fill' : 'bi-geo-alt'

  return index == 0 ? iconGeo : icon
}
</script>

<style scoped>
.content {
  height: calc(100vh - 100px);
  overflow: auto;
}

.page-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.page-header {
  padding: 0 var(--pd);
  height: 50px;
  /* border: 1px solid; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: var(--primary);
  border-bottom: var(--border-line);
  user-select: none;
  position: sticky;
  top: 0;
  z-index: 99999;
}

.page-header > .botton {
  display: flex;
  justify-content: center;
  align-items: center;
  /* width: 48px; */
  height: 50px;
  font-size: 16px;
}

.logo {
  width: 24px;
  height: 24px;
  margin: 6px;
}

.page-content {
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.page-footer {
  position: sticky;
  bottom: 0;
  border-top: var(--border-line);
  height: 48px;
  overflow: hidden;
  background: var(--primary);
  z-index: 99999;
}

.weather-page {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  flex-direction: row;
  transition: all 1s ease;
}

.card {
  overflow: auto;
  flex-shrink: 0;
  width: 100%;
  position: relative;
}
</style>

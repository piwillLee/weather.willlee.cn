<template>
  <div class="weather weather-bg">
    <div class="page-layout">
      <!-- header -->
      <div class="page-header " @click="onLeftBtnClick">
        <div class="left botton"></div>
        <div class="title"></div>
        <div class="right botton" @click="onRightBtnClick">
          <q-icon name="bi-plus-lg" class="icon" />
        </div>
      </div>
      <!-- content -->
      <div class="page-content hide-scrollbar" :style="{ width: windowWidth + 'px' }">

        <div class="weather-page" v-touch-swipe.mouse.right.left="handleSwipe" :style="move">
          <div ref="cardRef" :style="{ width: windowWidth + 'px' }" class="card scroll hide-scrollbar"
            v-for="(item, index) in cityData" :key="index">
            <weather-template :cityData="item"></weather-template>
          </div>
        </div>
      </div>
      <!-- footer -->
      <div class="page-footer column items-center justify-center">
        <div class="footer-index row justify-center ">
          <div class="index-dot q-mr-sm" v-for="(item, index) in cityList.length" :key="index">
            <q-icon :name="indexIcon(index)" :class="(currentIndex == index ? '' : 'opacity-5')" />
          </div>
        </div>
      </div>
    </div>
    <q-inner-loading class="loading" :showing="visible" label="获取数据中..." label-class="text-teal"
      label-style="font-size: 1.5em" />
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, computed, watch, toRaw, } from 'vue'
import { storeToRefs } from 'pinia';
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
    longitude: old.longitude
  }
})
const weatherStore = useWeatherStore()
// 获取城市定位，成功时发送网络请求
if (weatherStore.cityData.length < 1) {
  weatherStore.getGeoPosition()
}
// 路由
const router = useRouter()
const onRightBtnClick = () => {
  router.push('/weather/city');
}

const { cityList, cityData, } = storeToRefs(weatherStore);

// 当前索引值
let currentIndex = ref('')
// 需要移动距离
let moveDistance = ref('0')

const move = computed(() => {
  return {
    left: moveDistance.value + 'px'
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

  console.log('滑动方向', evt.direction);
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
}

.page-header {
  padding: 0 var(--pd);
  height: 48px;
  /* border: 1px solid; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--border-line);
}

.page-header>.botton {
  display: flex;
  justify-content: center;
  align-items: center;
  /* width: 48px; */
  height: 48px;
  font-size: 24px;
}

.page-content {
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.page-footer {
  border-top: var(--border-line);
  height: 48px;

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

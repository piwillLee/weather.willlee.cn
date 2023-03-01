<template>
  <div class="weather-bg cityList">
    <div class="weather top-page weather-bg-blur">
      <div class="nav-tabbar">
        <q-toolbar class="bg-primary text-white transparent">
          <q-btn flat round dense icon="bi-chevron-left" class="q-mr-sm" @click="onLeftBtnClick" />
          <q-toolbar-title class="text-center text-subtitle1">城市管理</q-toolbar-title>
          <q-btn flat round dense icon="bi-search" @click="onRightBtnClick" />
        </q-toolbar>
      </div>
      <q-list class="q-pa-lg bt">
        <template v-for="(item, index) in cityData" :key="index">
          <q-slide-item
            left-color="blue-3"
            right-color="amber-14"
            @action="deleteCity(item, index)"
            @right="onRight"
            class="city-list-item q-mb-md rounded-borders"
          >
            <div class="row justify-between q-pa-md">
              <div class="row items-center text-subtitle1">
                {{ item.cityName }}
                <q-icon v-if="index == 0" class="q-ml-md" name="bi-geo-alt" />
              </div>
              <span>
                <span class="text-h5">{{ item.cityData.now.temp }}</span>
                <span class="q-ml-sm">℃</span>
              </span>
            </div>
            <template v-slot:right>
              <q-item class="row items-center">
                删除
                <q-icon name="delete" />
              </q-item>
            </template>
          </q-slide-item>
        </template>
      </q-list>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import useWeatherStore from 'src/stores/weatherStore/weatherStore'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
const weatherStore = useWeatherStore()
const { cityData, cityList } = storeToRefs(weatherStore)
const $q = useQuasar()
/**
 * 删除城市列表项
 */
function deleteCity(item, index) {
  // 第一个是定位城市，不能删除
  if (index !== 0) {
    cityList.value.splice(index, 1)
    // 本地化
    $q.localStorage.set('cityList', cityList.value)
    cityData.value.splice(index, 1)
  }
}

const router = useRouter()

const onLeftBtnClick = () => {
  router.back()
}
const onRightBtnClick = () => {
  router.push('/weather/search')
}

const onRight = ({ reset }) => {
  reset()
}
</script>

<style scoped>
.cityList {
  color: #fff;
}

.card {
  flex-shrink: 0;
  width: 24.375rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.city-list-item {
  /* color: #000; */
  background: var(--primary);
  border: 1px solid rgb(255, 255, 255);
  box-shadow: 3px 6px 0px var(--secondary);
}
</style>

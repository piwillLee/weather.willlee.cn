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
      <div class="city-list q-pa-lg">
        <template v-for="(item, index) in cityList" :key="index">

          <div v-touch-hold.mouse="handleHold"
            class="city-list-item shadow-1 q-mb-lg q-pa-md  rounded-borders text-subtitle1"
            @click="deleteCity(item, index)">
            {{ item.name }}
            <q-icon v-if="index == 0" class="" name="bi-geo-alt" />
          </div>
          <q-dialog v-model="small">
            <q-card class="weather-bg column justfy-center">
              <q-btn padding="20px 30px" size="sm" @click="deleteCity(item, index)" icon="delete" flat label="删除">
              </q-btn>
            </q-card>
          </q-dialog>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import useWeatherStore from 'src/stores/weatherStore/weatherStore'
import { storeToRefs } from 'pinia';

const weatherStore = useWeatherStore();
const { cityData, cityList } = storeToRefs(weatherStore)
const small = ref(false)

function handleHold () {
  small.value = true
}

/**
 * 删除城市列表项
 */
function deleteCity (item, index) {
  // 第一个是定位城市，不能删除
  if (index !== 0) {
    cityList.value.splice(index, 1);
    cityData.value.splice(index, 1);
  }
}

const router = useRouter()

const onLeftBtnClick = () => {
  router.back();
}
const onRightBtnClick = () => {
  router.push('/weather/search');
}
</script>

<style scoped>
.cityList {
  color: #fff;
}

.box {
  background-color: rgb(69, 88, 174);
  height: calc(100vh - 100px);
  position: relative;
  transition: all 1s ease;
}

.box-inner {
  background-color: rgb(134, 167, 134);
  display: flex;
  position: absolute;
  flex-direction: row;

  height: 50%;
  transition: all 1s ease-in-out;
}

.card {
  flex-shrink: 0;
  width: 390px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.city-list-item {
  background-color: rgba(22, 22, 22, 0.6);
}

.q-dialog__backdrop {
  background-color: rgba(22, 22, 22, 0.2);
}
</style>

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
      <!-- <div class="city-list q-pa-lg">
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
      </div> -->

      <q-list class=" q-pa-lg bt">
        <template v-for="(item, index) in cityList" :key="index">
          <q-slide-item left-color="teal-10" right-color="red-6" @action="deleteCity(item, index)" @right="onRight"
            class="city-list-item     bg-light-blue-10 q-mb-md

  ">
            <q-item class="row items-center">


              {{ item.name }}
              <q-icon v-if="index == 0" class="q-ml-md" name="bi-geo-alt" />

            </q-item>


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
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import useWeatherStore from 'src/stores/weatherStore/weatherStore'
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
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

const $q = useQuasar()


let timer

// function finalize (reset) {
//   timer = setTimeout(() => {
//     reset()
//   }, 10)
// }

const onRight = ({ reset }) => {
  reset()
  // finalize(reset)
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



/* .q-slide-item__right {
  background-color: none !important;
} */
</style>

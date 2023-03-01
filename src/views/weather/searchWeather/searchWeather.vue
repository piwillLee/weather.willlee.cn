<template>
  <div class="weather-bg">
    <div class="search top-page weather-bg-blur">
      <div class="q-pa-md">
        <q-input
          dark
          color="amber-13"
          v-model="searchText"
          autofocus
          dense
          debounce="500"
          placeholder="城市名称"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="bi-search" color="white" />
          </template>

          <!-- <template v-slot:append>
            <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
          </template> -->
          <template v-slot:after>
            <q-btn dense flat label="取消" color="white" class="text-h6" @click="onCancelClick" />
          </template>
        </q-input>
        <!-- 热门城市 -->
        <div class="hot-city" v-show="!isSearch">
          <div class="text-h6 q-mt-lg">热门城市</div>
          <div class="hot-city-list row flex center">
            <div class="hot-city-item col-4 text-center q-pa-sm" v-for="item in hotCityList" :key="item.id">
              <q-btn outline rounded style="width: 100%" :label="item.name" @click="onItemClick(item)" />
            </div>
          </div>
        </div>

        <!-- 搜索结果 -->
        <div class="search-result q-pa-sm" v-if="isSearch">
          <div class="search-result-list q-py-sm" v-for="item in searchResult" :key="item.id">
            <div class="result-item" @click="onItemClick(item)">{{ item.name }}-{{ item.adm1 }}-{{ item.country }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { getHotCity, getWeatherSearchCity } from 'src/service/modules/weather.js'
import { ref, watch } from 'vue'
import useWeatherStore from 'src/stores/weatherStore/weatherStore'
import { storeToRefs } from 'pinia'
import { LocalStorage } from 'quasar'
import { useQuasar } from 'quasar'

const weatherStore = useWeatherStore()
const { cityList, hotCityList } = storeToRefs(weatherStore)
const $q = useQuasar()

const router = useRouter()

const isSearch = ref(false)

// 搜索内容
const searchText = ref()

// 搜索结果
const searchResult = ref()

watch(searchText, () => {
  if (searchText.value != 0) {
    isSearch.value = true
  } else {
    isSearch.value = false
  }

  // 获取搜索结果
  getWeatherSearchCity(searchText.value).then((res) => {
    searchResult.value = res.location
  })
})

/**
 * 选择搜索城市
 */
const onItemClick = (item) => {
  const cityObj = {
    name: item.name,
    id: item.id,
  }
  const isHasSameCity = ref(false)
  // 遍历列表，城市是否存在
  cityList.value.map((item) => {
    if (item.name == cityObj.name) {
      isHasSameCity.value = true
    }
  })

  if (isHasSameCity.value) {
    router.back() // 城市已经在列表中
  } else {
    // 新增城市

    cityList.value.push(cityObj)

    // 本地化
    $q.localStorage.set('cityList', cityList.value)
    // 发送网络请求，获取城市天气
    weatherStore.getAllCityData()
    router.back()
  }
}

/**
 * 获取热门城市数据
 */
getHotCity().then((res) => {
  hotCityList.value = res.topCityList
})

/**
 * 返回上一界面
 */
const onCancelClick = () => {
  router.back()
}
</script>

<style scoped>
.search {
  color: #fff !important;
}

.hot-city-item > .q-btn {
  box-shadow: 1px 2px 0px var(--secondary);
}

.q-input {
  color: #fff !important;
}

.q-input:active {
  color: red !important;
}
</style>

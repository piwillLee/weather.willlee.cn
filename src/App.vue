<template>

  <div class="app">

    <!-- <weather-page></weather-page> -->

    <router-view />

  </div>
</template>

<script setup>

import useMainStore from './stores/mainStore/mainStore';
import { storeToRefs } from 'pinia';

const mainStore = useMainStore()
const { isShowTabbar } = storeToRefs(mainStore)

</script>

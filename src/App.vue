<template>
  <div class="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script setup>

import useMainStore from './stores/mainStore/mainStore';
import { storeToRefs } from 'pinia';

const mainStore = useMainStore()
const { isShowTabbar } = storeToRefs(mainStore)

</script>

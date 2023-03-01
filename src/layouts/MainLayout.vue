<template>
  <HomePage></HomePage>
  <q-tabs v-model="tab" class="text-teal fixed-bottom dense">
    <q-tab name="home" to="/home" exact icon="home" label="" />
    <q-tab name="alarms" to="/weather" exact icon="alarm" label="" />
    <!-- <q-tab name="movies" icon="bi-check-lg" label="" /> -->
    <q-tab name="movies" icon="movie" label="" />
    <q-icon name="bi-check-lg" />
  </q-tabs>
  <router-view></router-view>
</template>

<script setup>
import { ref } from 'vue'
import HomePage from 'pages/home/homePage.vue'

const tab = ref('home')
</script>

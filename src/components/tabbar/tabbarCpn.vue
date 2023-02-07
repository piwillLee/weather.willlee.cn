<template>
  <q-tabs indicator-color="transparent" active-color="black" v-model="tab" class="text-teal fixed-bottom dense">
    <q-route-tab name="home" to="/home" exact icon="home" label="" />
    <q-route-tab name="todo" to="/todo" icon="bi-check-lg" label="" />
    <q-route-tab name="calendar" to="/calendar" icon="bi-calendar-check" label="" />
    <q-route-tab name="user" to="/user" icon="bi-person" label="" />
  </q-tabs>
</template>
<script setup>
import { ref } from 'vue'
const tab = ref('home')
</script>

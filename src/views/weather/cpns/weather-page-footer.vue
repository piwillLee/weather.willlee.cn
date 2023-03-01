<template>
  <div class="page-footer">
    <div class="footer-index row justify-center">
      <div class="index-dot q-mr-sm" v-for="(item, index) in cityList.length" :key="index">
        <q-icon :name="indexIcon(index)" :class="currentIndex == index ? '' : 'opacity-5'" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(() => {
  data: {
  }
})
</script>

<style scoped></style>

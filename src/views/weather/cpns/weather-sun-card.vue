<template>
  <div class="sun-card shadow-1 q-pa-lg q-mt-md">
    <div class="title q-mb-lg"> {{ cardData.title }}</div>
    <div class="row justify-between ">
      <div class="left">
        <span class="q-mr-sm">{{ cardData.rise?.name }}</span>
        <span class="time">{{ cardData.rise?.time }}</span>
      </div>
      <div class="right">
        <span class="time">{{ cardData.set?.time }}</span>
        <span class="q-ml-sm">{{ cardData.set?.name }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  cardData: {
    type: Object,
    default: () => ({})
  }
})
console.log(props.cardData);
</script>

<style  scoped>
.sun-card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
</style>

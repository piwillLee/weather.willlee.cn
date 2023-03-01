<template>
  <div class="contentCard justify-between row q-py-sm q-mt-md shadow-1">
    <template v-for="(item, index) in content" :key="index">
      <div class="cardItem col-4 column justify-center items-center q-pa-md">
        <q-icon :name="item.icon" class="icon" />
        <div class="name q-pt-sm">{{ item.name }}</div>
        <div class="text">{{ item.text }}</div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style scoped>
.contentCard {
  /* border: 1px solid ; */
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.icon {
  width: 20px;
  height: 20px;
  font-size: 26px;
}

.name {
  opacity: 0.8;
  font-size: 12px;
  transform: scale(0.9);
}

.text {
  font-size: 12px;
  font-weight: 800;
}
</style>

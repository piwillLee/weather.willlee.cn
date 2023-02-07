import { ref } from "vue";

export function useSwiperPage(divRef) {
  // 当前索引值
  let currentIndex = ref("");
  // 需要移动距离
  let moveDistance = ref("0");
  const move = computed(() => {
    return {
      left: moveDistance.value + "px",
    };
  });

  // 当前总共移动距离
  let totalDistance = 0;
  const windowWidth = computed(() => {
    return document.documentElement.clientWidth;
  });

  // 滑动切换
  const handleSwipe = (evt) => {
    // 获取屏幕宽度
    console.log(evt.direction);
    // 向左
    if (
      evt.direction === "left" &&
      currentIndex.value < cityList.value.length - 1
    ) {
      currentIndex.value++;
      totalDistance -= windowWidth.value;
      moveDistance.value = totalDistance;
    }
    // 向右
    if (evt.direction === "right" && currentIndex.value > 0) {
      currentIndex.value--;
      totalDistance += windowWidth.value;
      moveDistance.value = totalDistance;
    }
  };
  // 页面底部 icon
  const indexIcon = (index) => {
    const icon = currentIndex.value == index ? "bi-record-fill" : "bi-record";
    const iconGeo =
      currentIndex.value == index ? "bi-geo-alt-fill" : "bi-geo-alt";
    return index == 0 ? iconGeo : icon;
  };
  return {
    currentIndex,
    move,
    handleSwipe,
    indexIcon,
  };
}

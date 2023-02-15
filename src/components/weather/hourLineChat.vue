<template>
  <div class="hour-line-chat">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div id="main" style="width:100%;height:400px;"></div>
  </div>
</template>

<script setup >
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  data: {
    type: Array,
    default: (() => [])
  }
})

const hourTempData = ref([]);// 24小时天气数组
const hourTimeData = ref([]);// 24小时时间
const tempIcon = ref([]); // icon
props.data.forEach(item => {
  hourTempData.value.push(item.temp);
  hourTimeData.value.push(dayjs(item.fxTime).format('hh:mm'));
  tempIcon.value.push(`weatherIcons/${item.icon}.svg`);
})


onMounted(() => {

  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('main'));

  const option = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis'
    },
    xAxis: [
      {
        data: hourTimeData.value
        ,
        offset: 20,
        axisLine: {            // 坐标轴线
          show: false,        // 默认显示，属性show控制显示与否
          onZero: false,
          lineStyle: {
            color: "rgba(255, 255, 255, 1)"
          }
        },
        axisTick: {  // 坐标轴刻度相关设置。
          alignWithLabel: true,
          show: false
        },
        axisLabel: {
          formatter: function (value) {
            return value
          },
          rich: ''
        }
      },
    ],
    yAxis: {
      show: false,
      splitLine: {
        show: false
      }
    },

    dataZoom: {
      start: 50,
      type: 'inside',
      zoomOnMouseWheel: false, //滚轮是否触发缩放,
      moveOnMouseMove: true, //鼠标滚轮触发滚动

    },
    series: {
      type: 'line',
      smooth: true,
      data: hourTempData.value,
      itemStyle: {
        normal: {
          lineStyle: {
            width: 5, //折线宽度
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#ff4f16' // 0% 处的颜色
              }, {
                offset: 1, color: '#30c055' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },

            offset: 13,
            shadowBlur: 12,
            shadowOffsetX: 1,
            shadowOffsetY: 10.5
          }
        }
      }
    }
  }

  const xAxis = option.xAxis
  var obj = {}
  xAxis.filter(value => {
    value.data.forEach((item, index) => {
      var time = hourTimeData.value[index]

      obj[time] = {
        // width: 50,
        height: 50,
        align: 'center',
        backgroundColor: tempIcon.value[index]
      }
    })
  })

  option.xAxis[0].axisLabel.rich = obj
  // 绘制图表
  myChart.setOption(option);

  window.addEventListener("resize", function () {
    myChart.resize();
  });

})
</script>

<style lang="less" scoped>
.home {
  display: flex;
}
</style>

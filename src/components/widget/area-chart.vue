<template>
  <div>
    <Echarts
      :style="{ width: '100%', heigth: '100%' }"
      :option="option"
      :autoresize="true"
    ></Echarts>
  </div>
</template>

<script setup lang="ts">
import { reactive, defineProps, computed } from "vue";
const props = defineProps({
  value: {
    type: Array,
  },
  styles: {
    type: Object,
    default: {},
  },
});

let option = computed(() => {
  return {
    xAxis: {
      show: props.styles.xAxisVisible,
      type: "category",
      boundaryGap: false,
      data: JSON.parse(props.styles.xdata),
    },
    yAxis: {
      type: "value",
      show: props.styles.yAxisVisible,
    },
    title: {
      show: props.styles.titleVisible,
      left: "center",
      text: props.styles.value,
    },
    series: [
      {
        data: JSON.parse(props.styles.ydata),
        type: "line",
        areaStyle: {
          color: props.styles.areaColor,
        },
        lineStyle: {
          color: props.styles.lineColor,
        },
      },
    ],
  };
});

const data = reactive({});
</script>

<style scoped>
.bar {
  width: 100%;
  height: 100%;
}
</style>

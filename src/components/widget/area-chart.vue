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
      data: props.value?.map((item: any) => item.name),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: props.value?.map((item: any) => item.value),
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

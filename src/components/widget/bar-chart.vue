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
      data: JSON.parse(props.styles.xdata),
    },
    yAxis: {
      show: props.styles.yAxisVisible,
      type: "value",
    },
    title: {
      show: props.styles.titleVisible,
      left: "center",
      text: props.styles.value,
    },
    series: [
      {
        data: JSON.parse(props.styles.ydata),
        type: "bar",
        showBackground: props.styles.bgColorVisible,
        backgroundStyle: {
          color: props.styles.bgColor,
        },
        itemStyle: {
          color: props.styles.Color,
        },
      },
    ],
  };
});

const data = reactive({});
</script>

<style scoped></style>

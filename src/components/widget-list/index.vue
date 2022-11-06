<template>
  <div class="dropview">
    <div
      class="widget"
      draggable="true"
      @mousedown="(e) => emit('OnWidgetMouseDown', e, widget)"
      v-for="(widget, index) in list"
      :key="widget.type"
    >
      {{ widget.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps,defineEmits } from "vue";
const emit = defineEmits(['OnWidgetMouseDown'])
defineProps({
  list: {
    type: Array<any>,
    default: [],
  },
});
</script>

<style scoped lang="less">
.dropview {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  .widget {
    color: white;
    font-weight: 900;
    width: 100px;
    height: 50px;
    background-color: rgb(64, 158, 255);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.3rem;
  }
}
</style>

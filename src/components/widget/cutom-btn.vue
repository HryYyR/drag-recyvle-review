<template>
  <div>
    <button
      class="btn"
      :style="{
        color: styles.color,
        backgroundColor: styles.bgColor,
        fontSize: `${styles.fontSize}px`,
        opacity: styles.opacity,
        borderRadius: `${styles.borderRadius}px`,
        borderWidth: `${styles.border}px`,
        borderColor: styles.borderColor,
        width: '100%',
        height: '100%',
      }"
    >
      {{ styles.value }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
let props = defineProps({
  value: {
    type: String,
    required: true,
  },
  styles: {
    type: Object,
    required: true,
    default: {},
  },
});
</script>

<style scoped lang="less">
.btn {
  &:hover {
    background-color: rgb(85, 135, 252);
  }
}
</style>

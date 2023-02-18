<template>
  <div
    :style="{
      color: styles.color,
      fontSize: `${styles.fontSize}px`,
      opacity: styles.opacity,
      backgroundColor: styles.bgColor,
      position: 'relative',
      width: '100%',
      height: '100%',
      padding: `${styles.padding}px`,
      margin: `${styles.margin}px`,
    }"
  >
    {{ styles.value }}
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  value: {
    type: String,
  },
  styles: {
    type: Object,
    default: {},
  },
});
</script>

<style scoped></style>

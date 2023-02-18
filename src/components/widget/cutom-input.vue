<template>
  <input
    type="text"
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
      position: 'relative',
      padding: `${styles.padding}px`,
      margin: `${styles.margin}px`,
    }"
    v-model="styles.value"
  />
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

<style scoped lang="less"></style>

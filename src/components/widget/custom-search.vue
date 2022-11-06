<template>
  <div>
    <input
      class="btn"
      :style="{
        color: styles.color,
        backgroundColor: styles.bgColor,
        fontSize: `${styles.fontSize}px`,
        opacity: styles.opacity,
        borderRadius: `${styles.borderRadius}px`,
        borderWidth: `${styles.border}px`,
        borderColor: styles.borderColor,
        borderStyle: 'solid',
        padding: `${styles.padding}px`,
        margin: `${styles.margin}px`,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/search.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '95% 50%',
        backgroundSize: `${styles.iconSize}px ${styles.iconSize}px`,
      }"
      :value="styles.value"
    />
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

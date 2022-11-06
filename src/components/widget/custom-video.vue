<template>
  <VideoPlayer :options="options" autoplay></VideoPlayer>
</template>

<script setup lang="ts">
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import { reactive, onMounted, defineProps, computed } from "vue";
const props = defineProps({
  value: {
    type: String,
    default: "null",
  },
  styles: {
    type: Object,
    default: "null",
  },
});

let options = computed(() => {
  return {
    muted: true,
    loop: props.styles.ctrlLoop,
    language: "en",
    playbackRates: [0.7, 1.0, 1.5, 2.0],
    sources: [
      {
        type: "video/mp4",
        src: props.value,
      },
    ],
    poster: "",
  };
});
const data = reactive({
  //   options: {
  //     muted: true,
  //     language: "en",
  //     playbackRates: [0.7, 1.0, 1.5, 2.0],
  //     sources: [
  //       {
  //         type: "video/mp4",
  //         src: props.value,
  //       },
  //     ],
  //     poster: "../../assets/vue.svg",
  //   },
});

onMounted(() => {});
</script>

<style scoped></style>

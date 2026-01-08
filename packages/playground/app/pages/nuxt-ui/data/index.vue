<script setup lang="ts">
import Accordion from './components/Accordion.vue'
import Carousel from './components/Carousel.vue'
import EmptyArea from './components/EmptyArea.vue';
</script>

<template>
  <NuxtLayout name="uicomp" layout-class="flex flex-col gap-4">
    <!-- TODO 逐步完善 Data 模块里的内容 -->
    <h2 has-line>
      Accordion
    </h2>
    <Accordion />

    <h2 has-line>
      Carousel
    </h2>
    <Carousel />

    <h2 has-line>
      Empty Area
    </h2>
    <EmptyArea />
  </NuxtLayout>
</template>

<style scoped>

</style>

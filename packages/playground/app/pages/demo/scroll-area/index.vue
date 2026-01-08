<script setup lang="ts">
withDefaults(defineProps<{
  orientation?: 'vertical' | 'horizontal'
  lanes?: number
  gap?: number
}>(), {
  orientation: 'vertical',
  lanes: 3,
  gap: 16
})

const heights = [320, 480, 640, 800]

function getHeight(index: number) {
  const seed = (index * 11 + 7) % 17
  return heights[seed % heights.length]!
}

const items = Array.from({ length: 200 }).map((_, index) => {
  const height = getHeight(index)

  return {
    id: index,
    title: `Item ${index + 1}`,
    src: `https://picsum.photos/640/${height}?v=${index}`,
    width: 640,
    height
  }
})
</script>

<template>
  <NuxtLayout name="uicomp" layout-class="flex flex-col gap-4">
    <h2>支持滚动的虚拟瀑布流列表</h2>
    <UScrollArea
      v-slot="{ item }"
      :items="items"
      :orientation="orientation"
      :virtualize="{
        gap,
        lanes,
        estimateSize: 480
      }"
      class="w-full h-128 p-4">
      <img
        :src="item.src"
        :alt="item.title"
        :width="item.width"
        :height="item.height"
        loading="lazy"
        class="rounded-md size-full object-cover">
    </UScrollArea>
  </NuxtLayout>
</template>

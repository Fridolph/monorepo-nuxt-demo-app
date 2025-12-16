<template>
  <div v-if="sourceData && sourceData.length > 0" class="max-w-210 grid grid-cols-25 mb-4">
    <div v-for="item in sourceData" :key="item?.id"
      class="overflow-hidden flex flex-col w-full h-19 b-l-1px b-t-0 b-r-px b-r-transparent">
      <div class="w-30px h-8 flex items-center justify-center"
        :class="{
          'bg-#eaeaea': item.group === 0,
          'bg1': item?.group === 1,
          'bg2': item?.group === 2,
          'bg3': item?.group === 3,
        }">
        <Icon v-if="item?.status === 0" name="gs-basic:info-outline" size="16"
          class="text-#e57d15" />
      </div>
      <div class="text-xs rotate-90 translate-y-3 translate-x--1.5 text-gray">
        <span>{{ formatTime(item.value) }}</span>
      </div>
    </div>
    <div class="overflow-hidden flex flex-col w-full h-19 b-l-1px b-t-0 b-r-px b-r-transparent">
      <div class="w-30px h-8 flex items-center justify-center" />
      <div class="text-xs rotate-90 translate-y-3 translate-x--1.5 text-gray">
        <span>00:00</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  // curRadio: 1 | 2 | 3 // 1 p-s-offP  2 POP  3 customize
  sourceData: any[]
  names: string[]
  colors: string[]
}>()

function formatTime(time: number) {
  if (time === -1) return '00:00'
  return time < 10 ? `0${time}:00` : `${time}:00`
}
</script>

<style scoped lang="scss">
.bg1 {
  background-color: v-bind('props.colors[0]');
}
.bg2 {
  background-color: v-bind('props.colors[1]');
}
.bg3 {
  background-color: v-bind('props.colors[2]');
}
</style>

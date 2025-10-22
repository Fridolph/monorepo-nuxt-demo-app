<template>
  <div v-if="sourceData && sourceData.length > 0" class="max-w-210 grid grid-cols-25 mb-4">
    <div v-for="(item, idx) in sourceData" :key="idx"
      class="overflow-hidden flex flex-col w-full h-19 b-l-1px b-t-0 b-r-px b-r-transparent">
      <div class="w-30px h-8 flex items-center justify-center"
        :class="[item.group === null ? 'bg-#e5e5e7' : '', item.group !== null ? `c-bg-${item.group}` : '']">
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
.c-bg-0 { background-color: v-bind('props.colors[0]'); }
.c-bg-1 { background-color: v-bind('props.colors[1]'); }
.c-bg-2 { background-color: v-bind('props.colors[2]'); }
.c-bg-3 { background-color: v-bind('props.colors[3]'); }
.c-bg-4 { background-color: v-bind('props.colors[4]'); }
.c-bg-5 { background-color: v-bind('props.colors[5]'); }
.c-bg-6 { background-color: v-bind('props.colors[6]'); }
.c-bg-7 { background-color: v-bind('props.colors[7]'); }
.c-bg-8 { background-color: v-bind('props.colors[8]'); }
.c-bg-9 { background-color: v-bind('props.colors[9]'); }
.c-bg-10 { background-color: v-bind('props.colors[10]'); }
.c-bg-11 { background-color: v-bind('props.colors[11]'); }
.c-bg-12 { background-color: v-bind('props.colors[12]'); }
.c-bg-13 { background-color: v-bind('props.colors[13]'); }
.c-bg-14 { background-color: v-bind('props.colors[14]'); }
.c-bg-15 { background-color: v-bind('props.colors[15]'); }
.c-bg-16 { background-color: v-bind('props.colors[16]'); }
.c-bg-17 { background-color: v-bind('props.colors[17]'); }
.c-bg-18 { background-color: v-bind('props.colors[18]'); }
.c-bg-19 { background-color: v-bind('props.colors[19]'); }
.c-bg-20 { background-color: v-bind('props.colors[20]'); }
.c-bg-21 { background-color: v-bind('props.colors[21]'); }
.c-bg-22 { background-color: v-bind('props.colors[22]'); }
.c-bg-23 { background-color: v-bind('props.colors[23]'); }
</style>

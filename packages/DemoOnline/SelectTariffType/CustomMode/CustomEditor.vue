<template>
  <div class="max-w-210 grid grid-cols-25 mb-4">
    <div
      v-for="item in list"
      :key="item?.id"
      class="overflow-hidden flex flex-col w-full h-19 b-l-1px b-t-0 b-r-px b-r-transparent hover:shadow"
      :class="{
        'cursor-pointer': isEnabled(item),
        'cursor-not-allowed': isLocked(item),
      }"
      @click="selectTimeItem(item)"
    >
      <div
        class="w-30px h-8 flex items-center justify-center"
        :class="{
          'bg-#EAEAEA': isEnabled(item),
          'bg-#E57D15': isCanSub(item),
          'bg-#3EC06466': isLocked(item),
        }"
      >
        <Icon
          v-if="item.status === 0"
          name="material-symbols:add"
          size="18"
          class="text-gray"
        />
        <Icon
          v-if="item?.status === 1 && groupNumber === item.group"
          name="material-symbols:remove"
          size="18"
          class="text-white"
        />
        <Icon
          v-if="item?.status === 1 && groupNumber !== item.group"
          name="material-symbols:lock"
          size="18"
          class="text-white"
        />
      </div>
      <div class="text-sm rotate-90 translate-y-2.5 translate-x--1.5 text-gray">
        <span>{{ formatTime(item?.value) }}</span>
      </div>
    </div>
    <div
      class="overflow-hidden flex flex-col w-full h-19 b-l-1px b-t-0 b-r-px b-r-transparent"
    >
      <div class="w-30px h-8 flex items-center justify-center" />
      <div class="text-sm rotate-90 translate-y-2.5 translate-x--1.5 text-gray">
        <span>00:00</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TimeItem {
  id?: number
  value: number
  status: 0 | 1
  group: number
}

const props = defineProps<{
  sourceData: TimeItem[]
  groupNumber: number
  groupPrice: number | null
}>()

const emits = defineEmits(['on-change'])
const list = ref<TimeItem[]>([])

const isEnabled = (item: TimeItem) => item?.status === 0
const isCanSub = (item: TimeItem) => item?.status === 1 && props.groupNumber === item.group
const isLocked = (item: TimeItem) => item?.status === 1 && props.groupNumber !== item.group

onMounted(() => {
  list.value = JSON.parse(JSON.stringify(props.sourceData))
})

watch(() => props.sourceData, (vals) => {
  list.value = JSON.parse(JSON.stringify(vals))
})

function formatTime(time: number) {
  return time === -1 ? '00:00' : `${time < 10 ? '0' : ''}${time}:00`
}

function selectTimeItem(item: TimeItem) {
  if (isLocked(item)) return
  const newItem = {
    value: item.value,
    status: item.status === 0 ? 1 : 0,
    group: isEnabled(item) ? props.groupNumber : null,
    price: isEnabled(item) ? props.groupPrice : null,
  }
  list.value = list.value.map((i: TimeItem) => (i.value === item.value ? newItem : i)) as TimeItem[]
  // console.log(newItem, list.value)
  emits('on-change', newItem, list.value)
}
</script>

<template>
  <div class="max-w-210 grid grid-cols-25 mb-4">
    <div v-for="item in selectTimeList" :key="item.id"
      class="overflow-hidden flex flex-col w-full h-19 b-l-1px b-t-0 b-r-px b-r-transparent"
      :class="{
        'cursor-pointer': type === 'edit',
      }"
      @click="type === 'edit' && selectTimeItem(item)">
      <div class="w-30px h-8 flex items-center justify-center"
        :class="{
          'bg-#3EC06466': item.status === 0,
          'bg-#EAEAEA': item.status === 1,
          'bg-#E57D15': item.status === 2,
        }">
        <Icon v-if="type === 'edit' && item.status === 0" name="material-symbols:lock" size="18"
          class="text-white" />
        <Icon v-if="type === 'edit' && item.status === 1" name="material-symbols:add" size="18"
          class="text-green" />
        <Icon v-if="type === 'edit' && item.status === 2" name="material-symbols:remove" size="18"
          class="text-white" />
      </div>
      <div class="text-sm rotate-90 translate-y-2.5 translate-x--1.5 text-gray">
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'edit' | 'view'
  curRadio: 1 | 2 | 3 // 1 p-s-offP  2 POP  3 customize
}>()
const emits = defineEmits(['on-change'])

const selectTimeList = ref<any[]>([
  // { label: '00:00', status: 0 },
])

function selectTimeItem(item: any) {
  if (item.value === null || item.status === -1 || item.status === 0) return
  item.status = item.status === 1 ? 2 : 1

  emits('on-change', selectTimeList.value)
}

function mockTimeList() {
  for (let i = 0; i < 24; i++) {
    selectTimeList.value.push({
      value: i,
      label: `${i < 10 ? '0' + i : i}:00`,
      status: Math.floor(Math.random() * 3),
    })
  }
  selectTimeList.value.push({
    value: -1,
    label: `00:00`,
    status: -1,
  })
}
</script>

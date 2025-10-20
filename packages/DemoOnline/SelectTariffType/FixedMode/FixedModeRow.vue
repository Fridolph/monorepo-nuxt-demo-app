<template>
  <div class="row-item">
    <div class="has-line flex h-8 self-center">
      {{ groupName }}
    </div>
    <div class="flex flex-wrap justify-start gap-1 items-center">
      <div class="flex-1 t-tag-wrap flex gap-1 flex-wrap">
        <div v-for="(item, i) in taglist" :key="i" class="t-tag">
          <span>{{ item.label }}</span>
          <Icon
            name="material-symbols:cancel"
            size="16"
            class="text-gray"
            @click="onDeleteTag(item)"
          />
        </div>
      </div>
      <div class="t-action-wrap" @click="openPeriodDialog">
        <Icon name="material-symbols:add" size="20" />
      </div>
    </div>
    <div class="flex h-8 self-center gap-1">
      <InputNumber
        v-model="inputPrice"
        input-class="text-sm"
        fluid
        @value-change="changePrice($event)"
      />
      <div>/kWh</div>
    </div>
    <div class="flex-center cursor-pointer">
      <Icon name="gs-basic:delete" size="18"
        @click="deleteThisItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { transToTagList } from '~/composables/projects/useSelectTariff'

const props = defineProps<{
  curRadio: number
  groupName: string
  groupIndex: number
  sourceData: any
  color: string
  data: {
    status: 0 | 1
    value: number
    price: number | null
  }[]
}>()
const emits = defineEmits(['on-change'])

const inputPrice = ref<null | number>(null)
watch(
  () => props.data,
  (val) => {
    if (val && val.length > 0) {
      const priceArr = val.map(v => v.price)
      const p0 = priceArr[0]
      if (priceArr.every(p => p === p0)) {
        inputPrice.value = p0 as number
      }
    }
  },
  { immediate: true },
)

const taglist = computed(() => {
  return transToTagList(props.data)
})

const FixedDialogRef = inject('FixedDialogRef')
function openPeriodDialog() {
  console.log('🚀 ~ openPeriodDialog:', props.curRadio, props.groupIndex)
  const copyData = [...props.sourceData]
  FixedDialogRef?.value?.open(copyData, {
    isCustom: false,
    groupIndex: props.groupIndex,
    groupPrice: inputPrice.value,
  })
}

function changePrice(evt: number | null) {
  inputPrice.value = evt
  const newRow = props.data?.map(v => ({ ...v, price: evt })) ?? []
  const newData = mergeArrays(props.sourceData, newRow)
  // console.log('🚀 ~ changePrice:', evt, newRow, newData)

  nextTick(() => {
    emits('on-change', {
      type: 'price',
      row: newRow,
      data: newData,
    })
  })
}

function mergeArrays(arr: any[], changeItems: any[]) {
  changeItems.forEach((changeItem) => {
    const index = arr.findIndex(item => item.value === changeItem.value)
    if (index !== -1) {
      Object.assign(arr[index], changeItem)
    }
  })
  return arr
}

function onDeleteTag(item: any) {
  const newRow = item.values.map(v => ({
    price: null,
    status: 0,
    value: v,
    group: 0,
  }))
  const newData = mergeArrays(props.sourceData, newRow)
  console.log('🚀 ~ onDelete:', props.groupName, '>>>', item, newData)
  emits('on-change', {
    type: 'deleteTag',
    row: newRow,
    data: newData,
  })
}

function deleteThisItem() {
  console.log('🚀 ~ deleteThisItem:', props.data)
  inputPrice.value = null
  const newRow = props.data?.map(v => ({ ...v, status: 0, group: 0, price: null })) ?? []
  const newData = mergeArrays(props.sourceData, newRow)
  nextTick(() => {
    emits('on-change', {
      type: 'clearRow',
      row: newRow,
      data: newData,
    })
  })
}
</script>

<style scoped lang="scss">
.row-item {
  @apply p-2 grid grid-cols-[148px_1fr_148px_36px] gap-x-6 b-b-px leading-8 text-sm;
  > div {
    @apply relative;
    &::after {
      content: '';
      @apply absolute top-0 right--3 w-px h-full bg-#E5E7EB;
    }
  }
  > div:last-child {
    &::after {
      display: none;
    }
  }
}

.flex-center {
  @apply flex justify-center items-center;
}

.t-action-wrap {
  @apply flex justify-center items-center cursor-pointer;
}

.has-line::before {
  content: '';
  @apply absolute top-1/2 translate-y--1/2 left--3 w-1 h-6 rounded;
  background-color: v-bind('props.color');
}

.t-tag {
  @apply inline-flex gap-1 justify-center items-center px-1 bg-#f5f5f7 rounded;
}
</style>

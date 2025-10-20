<template>
  <div class="row-item">
    <div class="has-line flex h-8 self-center" :class="`color-${index}`">
      {{ groupNames[index] }}
    </div>
    <div class="flex flex-wrap justify-start gap-1 items-center">
      <div class="flex-1 t-tag-wrap flex gap-1 flex-wrap">
        <div v-for="(item, i) in taglist" :key="i" class="t-tag">
          <span>{{ item.label }}</span>
          <Icon
            name="material-symbols:cancel"
            size="16"
            class="text-gray"
            @click="onDelete(item)"
          />
        </div>
      </div>
      <div class="t-action-wrap" @click="openPeriodDialog('peak')">
        <Icon name="material-symbols:add" size="20" />
      </div>
    </div>
    <div class="flex h-8 self-center gap-1">
      <InputNumber
        v-model="inputPrice"
        input-class="text-sm"
        fluid
        @value-change="changePrice"
      />
      <div>/kWh</div>
    </div>
    <div class="flex-center cursor-pointer">
      <Icon name="gs-basic:delete" size="18" />
    </div>
    <SelectTimeDialog
      ref="SelectTimeDialogRef"
      @confirm="saveTimeDialog"
    />
  </div>
</template>

<script setup lang="ts">
import SelectTimeDialog from './CustomMode/CustomDialog.vue'

interface periodItem {
  id?: number
  value: number
  label: string
  status: number
}
const props = defineProps<{
  curRatio: number
  index: number
  groupNames: string[]
  sourceData: any
  data: {
    status: 0 | 1
    value: number
    price: number | null
  }[]
}>()
const emits = defineEmits(['on-change'])
const SelectTimeDialogRef = useTemplateRef('SelectTimeDialogRef')

const inputPrice = ref<null | number>(null)
// watch(
//   () => props.data.price,
//   (val) => {
//     inputPrice.value = val
//   },
//   { immediate: true },
// )

const taglist = computed(() => {
  return processArray(props.data)
})

function isThisItemUsed(item) {
  const usedItems = props.sourceData.filter(v => v.status === 1)
  return item.status
}

function processArray(arr: any[]) {
  if (arr.length === 0) {
    return []
  }

  const sortedArr = arr.sort((a, b) => a.value - b.value)
  const result: { label: string, status: number }[] = []
  let start = sortedArr[0].value
  let end = sortedArr[0].value + 1
  let status = sortedArr[0].status

  for (let i = 1; i < sortedArr.length; i++) {
    const current = sortedArr[i]
    if (start === 23 && current.value === 0) {
      end = 1
      continue
    }
    if (current.value === end) {
      end++
    }
    else {
      const label = `${String(start).padStart(2, '0')}:00-${String(end === 24 ? 0 : end).padStart(2, '0')}:00`
      result.push({ label, status })
      start = current.value
      end = current.value + 1
      status = current.status
    }
  }
  const lastLabel = `${String(start).padStart(2, '0')}:00-${String(end === 24 ? 0 : end).padStart(2, '0')}:00`
  result.push({ label: lastLabel, status })
  return result
}

function openPeriodDialog(type: string) {
  // console.log('🚀 ~ openPeriodDialog:', props.curRatio, type)
  SelectTimeDialogRef.value?.open(props.sourceData, props.groupNames[props.index])
}

function saveTimeDialog(evt) {
  console.log('🚀 ~ saveTimeDialog:', evt)
  SelectTimeDialogRef.value?.close()
  emits('on-change', evt)
}

function changePrice(evt: number | null) {
  inputPrice.value = evt
  emits('on-change', {
    ...props.data,
    price: evt,
  })
}

function onDelete(item: any) {
  console.log('🚀 ~ onDelete:', props.groupNames[props.index], '>>>', item)
  emits('on-change', props.data)
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
}
.color-0::before {
  background-color: #e57d15;
}
.color-1::before {
  background-color: #919e3d;
}
.color-2::before {
  background-color: #3ec064;
}

.t-tag {
  @apply inline-flex gap-1 justify-center items-center px-1 bg-#f5f5f7 rounded;
}
</style>

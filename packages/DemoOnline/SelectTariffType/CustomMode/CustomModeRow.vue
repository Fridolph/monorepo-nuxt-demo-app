<template>
  <div class="row-item" :class="isValidRow ? 'valid-line' : 'invalid-line'">
    <div class="group has-line flex h-8 self-center" :class="`line-${groupIndex}`">
      <InputText v-model="inputGroupName" fluid
        class="text-sm b-transparent outline-none shadow-none group-hover:b-#E2E6EC"
        @value-change="changeGroupName"
      />
    </div>
    <div class="flex flex-wrap justify-start gap-1 items-center">
      <div class="flex-1 t-tag-wrap flex gap-1 flex-wrap">
        <template v-if="Array.isArray(taglist) && taglist.length > 0">
          <div v-for="(item, i) in taglist" :key="i" class="t-tag">
            <span>{{ item.label }}</span>
            <Icon
              name="material-symbols:cancel"
              size="16"
              class="text-gray"
              @click="onDeleteTag(item)"
            />
          </div>
        </template>
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
        @value-change="changePrice"
      />
      <div>/kWh</div>
    </div>
    <div class="flex-center cursor-pointer">
      <Icon name="gs-basic:delete" size="18"
        @click="deleteThisRow" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { transToTagList } from '~/composables/projects/useSelectTariff'

interface periodItem {
  id?: number
  value: number
  label: string
  status: number
}
const props = defineProps<{
  curRadio: number
  groupIndex: number
  groupName: string
  groupPrice: number | null
  sourceData: any
  cusList: any[]
  data: {
    name: string
    period: periodItem[]
    price: number | null
  }[]
}>()
const emits = defineEmits(['change-name', 'change-price', 'delete-row', 'delete-tag'])

const inputGroupName = ref('')
const inputPrice = ref<null | number>(null)
const isValidRow = computed(() => {
  return !inputGroupName.value && inputPrice.value !== null && taglist.value.length > 0
})

watch(() => props.groupName, (val) => {
  inputGroupName.value = val
})
watch(() => props.groupPrice, (val) => {
  inputPrice.value = val
})

const taglist = computed(() => transToTagList(props.data?.period) ?? [])
const CustomDialogRef = inject('CustomDialogRef')
function openPeriodDialog() {
  console.log('🚀 ~ openPeriodDialog:', props.curRadio, props.groupIndex)
  const copyData = [...props.sourceData]
  CustomDialogRef?.value?.open(copyData, {
    cusList: props.cusList,
    isCustom: true,
    groupName: inputGroupName.value,
    groupIndex: props.groupIndex,
    groupPrice: inputPrice.value,
  })
}

function changeGroupName(evt: string) {
  inputGroupName.value = evt
  emits('change-name', evt, props.groupIndex)
}

function changePrice(evt: number | null) {
  inputPrice.value = evt
  emits('change-price', evt, props.groupIndex)
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
  emits('delete-tag', item, {
    cusRow: props.cusList[props.groupIndex],
    isCustom: true,
    groupName: inputGroupName.value,
    groupIndex: props.groupIndex,
    groupPrice: inputPrice.value,
  })
}

function deleteThisRow() {
  emits('delete-row', props.groupIndex, {
    cusRow: props.cusList[props.groupIndex],
    isCustom: true,
    groupName: inputGroupName.value,
    groupIndex: props.groupIndex,
    groupPrice: inputPrice.value,
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
}

.t-tag {
  @apply inline-flex gap-1 justify-center items-center px-1 bg-#f5f5f7 rounded;
}
.line-0::before {
  background-color: #f0c844;
}
.line-1::before {
  background-color: #919e3d;
}
.line-2::before {
  background-color: #3ec064;
}
.line-3::before {
  background-color: #e89139;
}
.line-4::before {
  background-color: #c55a93;
}
.line-5::before {
  background-color: #8bdc40;
}
.line-6::before {
  background-color: #ea7f5e;
}
.line-7::before {
  background-color: #3ad1f6;
}
.line-8::before {
  background-color: #2fbf9b;
}
.line-9::before {
  background-color: #dec0a1;
}
.line-10::before {
  background-color: #72437d;
}
.line-11::before {
  background-color: #83b27d;
}
.line-12::before {
  background-color: #4b88ce;
}
.line-13::before {
  background-color: #d76be3;
}
.line-14::before {
  background-color: #e57d15;
}
.line-15::before {
  background-color: #cae543;
}
.line-16::before {
  background-color: #189a75;
}
.line-17::before {
  background-color: #7d96c8;
}
.line-18::before {
  background-color: #814204;
}
.line-19::before {
  background-color: #65daa7;
}
.line-20::before {
  background-color: #935987;
}
.line-21::before {
  background-color: #b7af19;
}
.line-22::before {
  background-color: #d06034;
}
.line-23::before {
  background-color: #e3e693;
}
</style>

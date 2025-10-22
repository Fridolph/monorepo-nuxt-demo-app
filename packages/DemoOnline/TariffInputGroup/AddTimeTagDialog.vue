<template>
  <Dialog v-model:visible="visible" :draggable="false" style="width:840px">
    <template #header>
      <h2 class="text-18px font-600">
        Select Time-of-Use Periods
      </h2>
    </template>
    <p class="mb-4">
      curRadio: {{ curRadio }},
      groupIndex: {{ groupIndex }},
      groupName: {{ groupName }},<br>
      当前所选: {{ selectTimes.curGroup }}
      已选择时间段: {{ selectTimes.all }},
    </p>

    <ViewerEditor
      type="fixed"
      :group-number="groupIndex"
      :group-price="groupPrice"
      :source-data="workingData"
      @on-change="onChange" />

    <footer class="flex justify-end gap-x-2">
      <Button outlined size="small" label="Cancel"
        @click="close" />
      <Button size="small" label="Save"
        @click="confirm" />
    </footer>
  </Dialog>
</template>

<script setup lang="ts">
import ViewerEditor from './ViewerEditor.vue'

// SelectDialog
type TimeStatus = -1
  | 0 // 已锁定
  | 1 // 待添加
  | 2 // 已添加，可删除

interface CustomGroupData {
  groupIndex: number
  groupPrice: number | null
  groupName?: string
  isCustom?: boolean
  cusList?: any[]
}
const emits = defineEmits(['close', 'confirm'])
const curRadio = inject('curRadio')
const visible = ref(false)
const isCustom = ref(false)
const cusList = shallowRef<any[]>([])
const workingCusList = shallowRef<any[]>([])
const originData = shallowRef<any[]>([]) // 保存原始数据
const workingData = shallowRef<any[]>([]) // 用于编辑的副本
const groupName = ref<string>('')
const groupIndex = ref<number>(0)
const groupPrice = ref<number | null>(null)

function open(data: any, groupData: CustomGroupData) {
  visible.value = true
  originData.value = data
  workingData.value = JSON.parse(JSON.stringify(data))
  groupIndex.value = groupData?.groupIndex
  groupPrice.value = groupData?.groupPrice
  groupName.value = groupData?.groupName ?? ''

  if (groupData?.isCustom) {
    isCustom.value = groupData.isCustom
    cusList.value = JSON.parse(JSON.stringify(groupData.cusList))
  }
}

function close() {
  visible.value = false
  workingData.value = []
}
function confirm() {
  const values = workingData.value.filter(v => v.group === groupIndex.value).map(v => v.value)
  emits('confirm', workingData.value, {
    values,
    isCustom: isCustom.value,
    groupName: groupName.value,
    groupIndex: groupIndex.value,
    groupPrice: groupPrice.value,
  })
  close()
}

const selectTimes = computed(() => {
  const all = workingData.value.filter(v => v.status).map(v => v.value)
  const curGroup = workingData.value.filter(v => v.group === groupIndex.value && groupIndex.value !== 0).map(v => v.value)
  return {
    all, curGroup,
  }
})

function onChange(item: any, newList: any[]) {
  // console.log('🚀 ~ onChange:', item, newList)
  workingData.value = JSON.parse(JSON.stringify(newList))
}

defineExpose({
  open,
  close,
})
</script>

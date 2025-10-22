<template>
  <section>
    <TypeRadios v-model="radioType"
      :radio-options="radioOptions"
      @update:model-value="onChangeRadio" />

    <template v-if="curRadioIsOne">
      <FixedViewer
        :source-data="originPsoList"
        :names="['Peak', 'Shoulder', 'Off Peak']"
        :colors="['#e57d15', '#919e3d', '#3ec064']"
        class="mt-6"
      />
    </template>

    <template v-if="curRadioIsTwo">
      <FixedViewer
        :source-data="originPopList"
        :names="['Off Peak', 'Peak']"
        :colors="['#3ec064', '#e57d15']"
        class="mt-6"
      />
    </template>

    <template v-if="curRadioIsThree">
      <CustomViewer
        :source-data="originCustomList"
        :data="cusList"
        :names="cusList.map(v => v.name)"
        :colors="markColors"
        class="mt-6"
      />
    </template>

    <section class="mt-6 wrap max-w-204">
      <header>
        <div>{{ t('t_name') }}</div>
        <div>{{ t('period') }}</div>
        <div>{{ `${t('price')} ${t('final_price_label_tax_name', { tax_name: taxName })}` }}</div>
        <div />
      </header>

      <div class="t-body">
        <template v-if="radioType === 1">
          <FixedModeRow
            :cur-radio="radioType"
            :data="psoList?.[1]"
            group-name="Peak"
            :group-index="1"
            color="#e57d15"
            :source-data="originPsoList"
            @on-change="onChangePsoRow"
          />
          <FixedModeRow
            :cur-radio="radioType"
            :data="psoList?.[2]"
            group-name="Shoudler"
            :group-index="2"
            color="#919e3d"
            :source-data="originPsoList"
            @on-change="onChangePsoRow"
          />
          <FixedModeRow
            :cur-radio="radioType"
            :data="psoList?.[3]"
            group-name="Off-Peak"
            :group-index="3"
            color="#3ec064"
            :source-data="originPsoList"
            @on-change="onChangePsoRow"
          />
        </template>
        <template v-if="radioType === 2">
          <FixedModeRow
            :cur-radio="radioType"
            :data="popList?.[1]"
            group-name="Off-Peak"
            :group-index="1"
            color="#3ec064"
            :source-data="originPopList"
            @on-change="onChangePopRow"
          />
          <FixedModeRow
            :cur-radio="radioType"
            :data="popList?.[2]"
            group-name="Peak"
            :group-index="2"
            color="#e57d15"
            :source-data="originPopList"
            @on-change="onChangePopRow"
          />
        </template>
        <template v-if="radioType === 3">
          <CustomModeRow v-for="(row, idx) in cusList" :key="idx"
            :cur-radio="radioType"
            :data="row" :cus-list="cusList" :source-data="originCustomList"
            :color="markColors[idx]"
            :group-name="row.name" :group-index="idx" :group-price="row.price"
            @change-name="changeCustomName"
            @change-price="changeCustomPrice"
            @delete-tag="deleteCustomTag"
            @delete-row="deleteCustomRow"
          />
        </template>
      </div>

      <footer class="mt-4 flex items-center justify-between">
        <Button
          outlined
          size="small"
          :disabled="radioType !== 3 || cusList.length >= 24 || hasError"
          @click="addCustomItem">
          <div
            v-tippy="(radioType !== 3 || cusList.length >= 24) ? { content: 'All time slots are used. Edit or delete one to add more.' } : null"
            class="flex-center gap-2">
            <Icon
              name="material-symbols:add"
              size="18"
            />
            <span>Time-of-Use Rate</span>
          </div>
        </Button>
        <p v-if="shouldShowTips" class="text-xs text-error">
          {{ t('tariff_has_empty_tips') }}
        </p>
      </footer>
    </section>

    <AddTimeTagDialog ref="AddTimeTagDialogRef"
      @confirm="saveDialogData"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import FixedModeRow from './FixedModeRow.vue'
import FixedViewer from './FixedViewer.vue'
import CustomModeRow from './CustomModeRow.vue'
import CustomViewer from './CustomViewer.vue'
import useSelectTariff, { transformFixedArray } from './useSelectTariff'
import AddTimeTagDialog from './AddTimeTagDialog.vue'
import TypeRadios from './TypeRadios.vue'

const props = defineProps<{
  data: ElectricityRateData
}>()
const emits = defineEmits([
  'on-change',
])
const {
  markColors,
  originPsoList,
  originPopList,
  originCustomList,
  // curSelect,
  // tariffTypeOptions,
  radioType,
  curRadioIsOne,
  curRadioIsTwo,
  curRadioIsThree,
} = useSelectTariff()
const changeFlag = ref<number>(0)
provide('radioType', radioType)

watch(() => props.data, (vals) => {
  if (vals) initTariffData(vals)
}, { immediate: true, deep: true })

const radioOptions = computed(() => {
  return props.data.electricityRateDetails.map(v => ({
    label: v.templateName,
    value: v.templateType,
  }))
})

function initTariffData(data: ElectricityRateData) {
  console.log('🚀 ~ initTariffData:', data)

  radioType.value = data?.radioType
  originPsoList.value = data?.electricityRateDetails?.[0]?.sourceData as TariffSourceItem[]
  originPopList.value = data?.electricityRateDetails?.[1]?.sourceData as TariffSourceItem[]

  const customList = data?.electricityRateDetails?.[2]?.sourceData as TariffSourceItem[]
  originCustomList.value = customList

  const customSourceNames = data?.electricityRateDetails?.[2]?.sourceNames
  if (Array.isArray(customSourceNames) && customSourceNames.length > 0) {
    const tempList: any[] = customSourceNames.map((name) => {
      return {
        name,
        price: null,
        period: [] as any[],
      }
    })
    tempList.forEach((li, index) => {
      const list = customList.filter(v => v.group === index)
      li.period = list
      li.price = list?.[0]?.price
    })
    nextTick(() => {
      cusList.value = tempList
    })
  }
}

const psoList = computed(() => {
  if (!Array.isArray(originPsoList.value)) return []
  const retList = transformFixedArray(originPsoList.value)
  return retList // .slice(1, retList.length)
})
const popList = computed(() => {
  if (!Array.isArray(originPopList.value)) return []
  const retList = transformFixedArray(originPopList.value)
  return retList // .slice(1, retList.length)
})
const cusList = ref<any[]>([])
const gs_country = useLocalStorage('gs_country', '')
const taxName = computed(() => {
  return JSON.parse(gs_country.value)?.countryConfig?.taxName ?? 'VAT'
})

const shouldShowTips = computed(() => {
  let timeFlag = false
  let priceFlag = false
  // let nameFlag = false
  // TODO GS-2096 添加对 name 的非空判断
  if (radioType.value === 1) {
    timeFlag = originPsoList.value?.some(item => item.status === 0)
    priceFlag = originPsoList.value?.some(item => item.price === null)
  }
  else if (radioType.value === 2) {
    timeFlag = originPopList.value?.some(item => item.status === 0)
    priceFlag = originPopList.value?.some(item => item.price === null)
  }
  else if (radioType.value === 3) {
    timeFlag = originCustomList.value?.some(v => v.status === 0)
    priceFlag = originCustomList.value?.some(v => v.price === null)
  }
  return timeFlag || priceFlag
})

function onChangeRadio(val: number) {
  radioType.value = val
  emits('on-change', {
    type: 'radioType',
    radioType: val,
    value: val,
  })
}

const AddTimeTagDialogRef = ref<InstanceType<typeof AddTimeTagDialog> | null>(null)
provide('AddTimeTagDialogRef', AddTimeTagDialogRef)

function onChangePsoRow(data: any) {
  // console.log('🚀 ~ onChangePsoRow:', data)
  switch (data.type) {
    case 'name':
      emits('on-change', {
        type: 'name',
        radioType: radioType.value,
        value: data.value,
        groupIndex: data.groupIndex,
      })
      break
    case 'price':
    case 'deleteTag':
    case 'clearRow':
      originPsoList.value = data.data
      emits('on-change', {
        type: 'sourceData',
        radioType: radioType.value,
        groupIndex: data.groupIndex,
        data: data.data,
      })
      break
    default:
      break
  }
}
function onChangePopRow(data: any) {
  // console.log('🚀 ~ onChangePopRow:', data)

  switch (data.type) {
    case 'name':
      emits('on-change', {
        type: 'name',
        radioType: radioType.value,
        value: data.value,
        groupIndex: data.groupIndex,
      })
      break
    case 'price':
    case 'deleteTag':
    case 'clearRow':
      originPopList.value = data.data
      emits('on-change', {
        type: 'sourceData',
        radioType: radioType.value,
        data: data.data,
        groupIndex: data.groupIndex,
      })
      break
    default:
      break
  }
}

function changeCustomName(name: string, gIndex: number) {
  console.log('🚀 ~ changeCustomName:', name, gIndex)
  cusList.value[gIndex].name = name
  const newList = originCustomList.value.map(item => ({ ...item }))
  emits('on-change', {
    type: 'name',
    value: name,
    radioType: radioType.value,
    groupIndex: gIndex,
    data: newList,
  })
}
function changeCustomPrice(price: number | null, gIndex: number) {
  // console.log('🚀 ~ changeCustomPrice:', price, gIndex)
  const newList = originCustomList.value.map(item => ({ ...item }))
  cusList.value[gIndex].price = price
  cusList.value[gIndex].period.forEach((v: any) => {
    const index = newList.findIndex(o => o.value === v.value)
    if (index !== -1) {
      // 更新副本中的对象
      newList[index] = { ...newList[index], price }
    }
  })
  originCustomList.value = newList

  emits('on-change', {
    type: 'sourceData',
    radioType: radioType.value,
    groupIndex: gIndex,
    data: newList,
  })
}

function deleteCustomTag(item: any, groupInfos: any) {
  console.log('🚀 ~ deleteCustomTag:', item, groupInfos)
  const newList = originCustomList.value.map(item => ({ ...item }))
  const newPeriod = groupInfos.cusRow.period.filter(v => !item.values.includes(v.value))
  cusList.value[groupInfos.groupIndex].period = newPeriod

  item.values.forEach((value: number) => {
    const index = newList.findIndex(v => v.value === value)
    if (index !== -1) {
      // 更新副本中的对象
      newList[index] = {
        ...newList[index],
        price: null,
        status: 0,
        group: null,
      }
    }
  })
  originCustomList.value = newList

  emits('on-change', {
    type: 'sourceData',
    radioType: radioType.value,
    groupIndex: groupInfos.groupIndex,
    data: newList,
  })
}

function deleteCustomRow(groupIndex: number, groupInfos: any) {
  console.log('🚀 ~ deleteCustomRow:', groupIndex, groupInfos)
  const newList = originCustomList.value.map(v => ({ ...v }))
  cusList.value.splice(groupIndex, 1)
  groupInfos.cusRow.period.forEach((v: any) => {
    const index = newList.findIndex(o => o.value === v.value)
    if (index !== -1) {
      // 更新副本中的对象
      newList[index] = {
        ...newList[index],
        group: null,
        status: 0,
        price: null,
      }
    }
  })
  originCustomList.value = newList

  emits('on-change', {
    type: 'sourceData',
    radioType: radioType.value,
    groupIndex: groupInfos.groupIndex,
    data: newList,
  })
}

const hasError = computed(() => {
  if (cusList.value.length === 0) return false
  else {
    if (originCustomList.value.every(v => v.group != null)) return true
    return cusList.value.some((v) => {
      return (v.name === null || v.name === '')
        || v.price === null
        || v.period.length === 0
    })
  }
})
function addCustomItem() {
  // console.log('hasError', hasError.value)
  if (hasError.value) return
  cusList.value.push({
    name: '',
    price: null,
    period: [],
  })
}

function saveDialogData(evt: any, customInfo: any) {
  console.log('🚀 ~ saveDialogData:', evt, customInfo)
  const values = customInfo.values
  const gName = customInfo.groupName
  const gIndex = customInfo.groupIndex
  const gPrice = customInfo.groupPrice
  if (customInfo.isCustom) {
    originCustomList.value = evt
    // 只有确认后才更新原始数据
    cusList.value[gIndex].name = gName
    cusList.value[gIndex].price = gPrice
    cusList.value[gIndex].period = values.map(v => ({
      price: gPrice,
      status: 1,
      value: v,
    }))

    emits('on-change', {
      type: 'sourceData',
      radioType: radioType.value,
      groupIndex: customInfo.groupIndex,
      data: evt,
    })
  }
  else {
    if (radioType.value === 1) {
      originPsoList.value = evt
      emits('on-change', {
        type: 'sourceData',
        radioType: radioType.value,
        groupIndex: customInfo.groupIndex,
        data: evt,
      })
    }
    else if (radioType.value === 2) {
      originPopList.value = evt
      emits('on-change', {
        type: 'sourceData',
        radioType: radioType.value,
        groupIndex: customInfo.groupIndex,
        data: evt,
      })
    }
  }
}

defineExpose({
  hasError: shouldShowTips,
})
</script>

<style scoped lang="scss">
header {
  @apply grid grid-cols-[148px_1fr_148px_36px] gap-x-6 b-b-px leading-8 text-sm;
}

.flex-center {
  @apply flex justify-center items-center;
}
</style>

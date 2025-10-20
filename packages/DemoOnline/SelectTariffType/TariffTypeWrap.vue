<template>
  <section class="max-w-204 bg-white p-4">
    <div>
      <FormLabel
        class="block mb-1 text-sm"
        for="tariffType"
        name="Tariff Type"
      />
      <div class="flex gap-2 items-center">
        <Select
          v-model="curSelect"
          :options="tariffTypeOptions"
          option-label="label"
          option-value="value"
        />
      </div>
    </div>

    <div v-show="curSelect === 'timeOfUse'">
      <TypeRadios v-model="curRadio" @update:model-value="onChangeRadio" />

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
          <div>Name</div>
          <div>Period</div>
          <div>Price (incl. GST)</div>
          <div />
        </header>

        <div class="t-body">
          <template v-if="curRadio === 1">
            <!-- <FixedModeRow v-for="(item, idx) in psoList" :key="idx"
              :cur-radio="curRadio" :data="item"
              :group-names="['Peak', 'Shoudler', 'Off-Peak']" :index="idx"
              :source-data="originPeriodList"
            /> -->

            <FixedModeRow
              :cur-radio="curRadio"
              :data="psoList?.[1]"
              group-name="Peak"
              :group-index="1"
              color="#e57d15"
              :source-data="originPsoList"
              @on-change="onChangePsoRow"
            />
            <FixedModeRow
              :cur-radio="curRadio"
              :data="psoList?.[2]"
              group-name="Shoudler"
              :group-index="2"
              color="#919e3d"
              :source-data="originPsoList"
              @on-change="onChangePsoRow"
            />
            <FixedModeRow
              :cur-radio="curRadio"
              :data="psoList?.[3]"
              group-name="Off-Peak"
              :group-index="3"
              color="#3ec064"
              :source-data="originPsoList"
              @on-change="onChangePsoRow"
            />
          </template>
          <template v-if="curRadio === 2">
            <FixedModeRow
              :cur-radio="curRadio"
              :data="popList?.[1]"
              group-name="Off-Peak"
              :group-index="1"
              color="#3ec064"
              :source-data="originPopList"
              @on-change="onChangePopRow"
            />
            <FixedModeRow
              :cur-radio="curRadio"
              :data="popList?.[2]"
              group-name="Peak"
              :group-index="2"
              color="#e57d15"
              :source-data="originPopList"
              @on-change="onChangePopRow"
            />
          </template>
          <template v-if="curRadio === 3">
            <CustomModeRow v-for="(row, idx) in cusList" :key="idx"
              :cur-radio="curRadio"
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
            :disabled="curRadio !== 3 || cusList.length >= 24 || hasError"
            @click="addCustomItem"
          >
            <div
              v-tippy="(curRadio !== 3 || cusList.length >= 24) ? { content: 'All time slots are used. Edit or delete one to add more.' } : null"
              class="flex-center gap-2">
              <Icon
                name="material-symbols:add"
                size="18"
              />
              <span>Time-of-Use Rate</span>
            </div>
          </Button>
          <p v-if="shouldShowTips" class="text-xs text-error">
            Some hours are not assigned. Please complete all time slots to ensure correct rate calculation.
          </p>
        </footer>
      </section>
    </div>

    <FixedDialog ref="FixedDialogRef"
      @confirm="saveFixedData"
    />
    <CustomDialog ref="CustomDialogRef"
      @confirm="saveCustomData"
    />
  </section>
</template>

<script setup lang="ts">
import FormLabel from '~/components/Forms/FormLabel.vue'
import FixedModeRow from './FixedMode/FixedModeRow.vue'
import FixedViewer from './FixedMode/FixedViewer.vue'
import CustomModeRow from './CustomMode/CustomModeRow.vue'
import CustomViewer from './CustomMode/CustomViewer.vue'
import useSelectTariff, { transformFixedArray } from '~/composables/projects/useSelectTariff'
import CustomDialog from './CustomMode/CustomDialog.vue'
import FixedDialog from './FixedMode/FixedDialog.vue'
import TypeRadios from './TypeRadios.vue'
import { custom } from 'zod'

const {
  markColors,
  originPsoList,
  originPopList,
  originCustomList,
  curSelect,
  tariffTypeOptions,
  curRadio,
  curRadioIsOne,
  curRadioIsTwo,
  curRadioIsThree,
  fetchData,
} = useSelectTariff()

provide('curRadio', curRadio)

onMounted(() => {
  fetchData()
})

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

const shouldShowTips = computed(() => {
  let timeFlag = false
  let priceFlag = false
  if (curRadio.value === 1) {
    timeFlag = originPsoList.value.some(item => item.status === 0)
    priceFlag = originPsoList.value.some(item => item.price === null)
  }
  else if (curRadio.value === 2) {
    timeFlag = originPopList.value.some(item => item.status === 0)
    priceFlag = originPopList.value.some(item => item.price === null)
  }
  else if (curRadio.value === 3) {
    timeFlag = originCustomList.value.some(v => v.status === 0)
    priceFlag = originCustomList.value.some(v => v.price === null)
  }
  return timeFlag || priceFlag
})

function onChangeRadio(val: 1 | 2 | 3) {
  curRadio.value = val
}

const FixedDialogRef = ref<InstanceType<typeof FixedDialog> | null>(null)
provide('FixedDialogRef', FixedDialogRef)

const CustomDialogRef = ref<InstanceType<typeof CustomDialog> | null>(null)
provide('CustomDialogRef', CustomDialogRef)

function onChangePsoRow(data: any) {
  console.log('🚀 ~ onChangePsoRow:', data)

  originPsoList.value = data.data
}
function onChangePopRow(data: any) {
  console.log('🚀 ~ onChangePopRow:', data)

  originPopList.value = data.data
}

function changeCustomName(name: string, gIndex: number) {
  console.log('🚀 ~ changeCustomName:', name, gIndex)
  cusList.value[gIndex].name = name
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

function saveFixedData(evt: any) {
  if (curRadio.value === 1) {
    originPsoList.value = evt
  }
  else if (curRadio.value === 2) {
    originPopList.value = evt
  }
}
function saveCustomData(evt: any[], customInfo: any) {
  originCustomList.value = evt
  // 只有确认后才更新原始数据
  const values = customInfo.values
  const gName = customInfo.groupName
  const gIndex = customInfo.groupIndex
  const gPrice = customInfo.groupPrice
  cusList.value[gIndex].name = gName
  cusList.value[gIndex].price = gPrice
  cusList.value[gIndex].period = values.map(v => ({
    price: gPrice,
    status: 1,
    value: v,
  }))

  console.log('🚀 ~ saveCustomData:', evt, customInfo, cusList.value)
}
</script>

<style scoped lang="scss">
header {
  @apply grid grid-cols-[148px_1fr_148px_36px] gap-x-6 b-b-px leading-8 text-sm;
}

.flex-center {
  @apply flex justify-center items-center;
}
</style>

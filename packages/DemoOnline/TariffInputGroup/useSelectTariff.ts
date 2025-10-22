export default function useSelectTariff() {
  const nuxtApp = useNuxtApp()
  const t = nuxtApp.$i18n.t

  const curSelect = ref('timeOfUse')
  const tariffTypeOptions = ref([
    { label: 'Flat Rate', value: 'flatRate' },
    { label: 'Time of Use', value: 'timeOfUse' },
  ])
  const markColors = ref([
    '#f0c844', '#919e3d', '#3ec064', '#e89139', '#c55a93', '#8bdc40',
    '#ea7f5e', '#3ad1f6', '#2fbf9b', '#dec0a1', '#72437d', '#83b27d',
    '#4b88ce', '#d76be3', '#e57d15', '#cae543', '#189a75', '#7d96c8',
    '#814204', '#65daa7', '#935987', '#b7af19', '#d06034', '#e3e693',
  ])

  const radioType = ref<number>(3)
  const curRadioIsOne = computed(() => radioType.value === 1)
  const curRadioIsTwo = computed(() => radioType.value === 2)
  const curRadioIsThree = computed(() => radioType.value === 3)

  const originPsoList = ref<TariffSourceItem[]>([])
  const originPopList = ref<TariffSourceItem[]>([])
  const originCustomList = ref<TariffSourceItem[]>([])

  return {
    originPsoList, originPopList, originCustomList,
    curSelect, tariffTypeOptions, markColors,
    radioType, curRadioIsOne, curRadioIsTwo, curRadioIsThree,
  }
}

export function transformFixedArray(arr: any[]) {
  // 用于统计最大的group值，以此来确定最终二维数组的长度
  let maxGroup = 0
  arr.forEach((item) => {
    if (item.group > maxGroup) {
      maxGroup = item.group
    }
  })
  // 创建长度为 maxGroup + 1 的二维数组，以包含所有可能的 group 值
  const retArr: any[] = Array.from({ length: maxGroup + 1 }, () => [])

  arr.forEach((item) => {
    if (item.group >= 0 && item.group <= 24) {
      retArr[item.group].push({
        value: item.value,
        status: item.status,
        price: item.price,
        group: item.group,
      })
    }
  })
  return retArr
}

export function mockPeriodList() {
  const psoList = [
    { value: 0, status: 0, group: 0, price: null },
    { value: 1, status: 0, group: 0, price: null },
    { value: 2, status: 1, group: 3, price: 0.3 },
    { value: 3, status: 1, group: 3, price: 0.3 },
    { value: 4, status: 1, group: 3, price: 0.3 },
    { value: 5, status: 1, group: 3, price: 0.3 },
    { value: 6, status: 1, group: 3, price: 0.3 },
    { value: 7, status: 1, group: 3, price: 0.3 },
    { value: 8, status: 0, group: 0, price: null },
    { value: 9, status: 0, group: 0, price: null },
    { value: 10, status: 1, group: 1, price: 4 },
    { value: 11, status: 1, group: 2, price: 55 },
    { value: 12, status: 1, group: 2, price: 55 },
    { value: 13, status: 1, group: 1, price: 4 },
    { value: 14, status: 0, group: 0, price: null },
    { value: 15, status: 0, group: 0, price: null },
    { value: 16, status: 1, group: 1, price: 4 },
    { value: 17, status: 1, group: 2, price: 55 },
    { value: 18, status: 1, group: 2, price: 55 },
    { value: 19, status: 1, group: 1, price: 4 },
    { value: 20, status: 0, group: 1, price: 4 },
    { value: 21, status: 0, group: 1, price: 4 },
    { value: 22, status: 0, group: 1, price: 4 },
    { value: 23, status: 0, group: 0, price: null },
  ]

  const popList = [
    { value: 0, status: 1, group: 1, price: 2.88 },
    { value: 1, status: 0, group: 0, price: null },
    { value: 2, status: 1, group: 1, price: 0.88 },
    { value: 3, status: 1, group: 1, price: 0.88 },
    { value: 4, status: 1, group: 1, price: 0.88 },
    { value: 5, status: 1, group: 1, price: 0.88 },
    { value: 6, status: 1, group: 1, price: 0.88 },
    { value: 7, status: 1, group: 1, price: 0.88 },
    { value: 8, status: 1, group: 1, price: 0.88 },
    { value: 9, status: 0, group: 0, price: null },
    { value: 10, status: 0, group: 0, price: null },
    { value: 11, status: 1, group: 2, price: 0.033445 },
    { value: 12, status: 1, group: 2, price: 0.033445 },
    { value: 13, status: 1, group: 2, price: 0.033445 },
    { value: 14, status: 0, group: 0, price: null },
    { value: 15, status: 1, group: 1, price: null },
    { value: 16, status: 1, group: 1, price: null },
    { value: 17, status: 1, group: 1, price: null },
    { value: 18, status: 1, group: 1, price: null },
    { value: 19, status: 1, group: 1, price: null },
    { value: 20, status: 0, group: 0, price: null },
    { value: 21, status: 1, group: 1, price: null },
    { value: 22, status: 1, group: 1, price: null },
    { value: 23, status: 0, group: 0, price: null },
  ]

  const customList = [
    { value: 0, status: 0, group: null, price: null },
    { value: 1, status: 0, group: null, price: null },
    { value: 2, status: 0, group: null, price: null },
    { value: 3, status: 0, group: null, price: null },
    { value: 4, status: 0, group: null, price: null },
    { value: 5, status: 0, group: null, price: null },
    { value: 6, status: 0, group: null, price: null },
    { value: 7, status: 0, group: null, price: null },
    { value: 8, status: 0, group: null, price: null },
    { value: 9, status: 0, group: null, price: null },
    { value: 10, status: 0, group: null, price: null },
    { value: 11, status: 0, group: null, price: null },
    { value: 12, status: 0, group: null, price: null },
    { value: 13, status: 0, group: null, price: null },
    { value: 14, status: 0, group: null, price: null },
    { value: 15, status: 0, group: null, price: null },
    { value: 16, status: 0, group: null, price: null },
    { value: 17, status: 0, group: null, price: null },
    { value: 18, status: 0, group: null, price: null },
    { value: 19, status: 0, group: null, price: null },
    { value: 20, status: 0, group: null, price: null },
    { value: 21, status: 0, group: null, price: null },
    { value: 22, status: 0, group: null, price: null },
    { value: 23, status: 0, group: null, price: null },
  ]
  return {
    psoList,
    popList,
    customList,
  }
}

export function mockApiList(): ElectricityRateData {
  return {
    radioType: 1,
    changeFlag: 0,
    electricityRateDetails: [
      {
        templateType: 1,
        templateName: 'PSP',
        sourceData: [
          { value: 0, status: 0, group: 0, price: null },
          { value: 1, status: 0, group: 0, price: null },
          { value: 2, status: 1, group: 3, price: 0.3 },
          { value: 3, status: 1, group: 3, price: 0.3 },
          { value: 4, status: 0, group: 0, price: null },
          { value: 5, status: 0, group: 0, price: null },
          { value: 6, status: 0, group: 0, price: null },
          { value: 7, status: 0, group: 0, price: null },
          { value: 8, status: 0, group: 0, price: null },
          { value: 9, status: 0, group: 0, price: null },
          { value: 10, status: 1, group: 1, price: 0.4 },
          { value: 11, status: 1, group: 2, price: 0.5 },
          { value: 12, status: 1, group: 2, price: 0.5 },
          { value: 13, status: 1, group: 1, price: 0.4 },
          { value: 14, status: 0, group: 0, price: null },
          { value: 15, status: 0, group: 0, price: null },
          { value: 16, status: 1, group: 1, price: 0.4 },
          { value: 17, status: 1, group: 2, price: 0.5 },
          { value: 18, status: 1, group: 2, price: 0.5 },
          { value: 19, status: 1, group: 1, price: 0.4 },
          { value: 20, status: 0, group: 0, price: null },
          { value: 21, status: 0, group: 0, price: null },
          { value: 22, status: 0, group: 0, price: null },
          { value: 23, status: 0, group: 0, price: null },
        ],
        sourceNames: [
          'Peak',
          'Shoulder',
          'Off-Peak',
        ],
      },
      {
        templateType: 2,
        templateName: 'PO',
        sourceData: [
          { value: 0, status: 1, group: 1, price: null },
          { value: 1, status: 0, group: 0, price: null },
          { value: 2, status: 0, group: 0, price: null },
          { value: 3, status: 0, group: 0, price: null },
          { value: 4, status: 0, group: 0, price: null },
          { value: 5, status: 0, group: 0, price: null },
          { value: 6, status: 0, group: 0, price: null },
          { value: 7, status: 0, group: 0, price: null },
          { value: 8, status: 0, group: 0, price: null },
          { value: 9, status: 0, group: 0, price: null },
          { value: 10, status: 0, group: 0, price: null },
          { value: 11, status: 1, group: 2, price: 0.88 },
          { value: 12, status: 1, group: 2, price: 0.88 },
          { value: 13, status: 1, group: 2, price: 0.88 },
          { value: 14, status: 0, group: 0, price: null },
          { value: 15, status: 0, group: 0, price: null },
          { value: 16, status: 0, group: 0, price: null },
          { value: 17, status: 0, group: 0, price: null },
          { value: 18, status: 0, group: 0, price: null },
          { value: 19, status: 0, group: 0, price: null },
          { value: 20, status: 0, group: 0, price: null },
          { value: 21, status: 1, group: 1, price: null },
          { value: 22, status: 1, group: 1, price: null },
          { value: 23, status: 0, group: 0, price: null },
        ],
        sourceNames: [
          'Peak',
          'Off-Peak',
        ],
      },
      {
        templateType: 3,
        templateName: 'Customize',
        sourceData: [
          { value: 0, status: 0, group: null, price: null },
          { value: 1, status: 0, group: null, price: null },
          { value: 2, status: 0, group: null, price: null },
          { value: 3, status: 0, group: null, price: null },
          { value: 4, status: 0, group: null, price: null },
          { value: 5, status: 0, group: null, price: null },
          { value: 6, status: 0, group: null, price: null },
          { value: 7, status: 0, group: null, price: null },
          { value: 8, status: 0, group: null, price: null },
          { value: 9, status: 0, group: null, price: null },
          { value: 10, status: 0, group: null, price: null },
          { value: 11, status: 0, group: null, price: null },
          { value: 12, status: 0, group: null, price: null },
          { value: 13, status: 0, group: null, price: null },
          { value: 14, status: 0, group: null, price: null },
          { value: 15, status: 0, group: null, price: null },
          { value: 16, status: 0, group: null, price: null },
          { value: 17, status: 0, group: null, price: null },
          { value: 18, status: 0, group: null, price: null },
          { value: 19, status: 0, group: null, price: null },
          { value: 20, status: 0, group: null, price: null },
          { value: 21, status: 0, group: null, price: null },
          { value: 22, status: 0, group: null, price: null },
          { value: 23, status: 0, group: null, price: null },
        ],
        sourceNames: [],
      },
    ],
  }
}

export function transToTagList(arr: any[]) {
  if (!arr || arr?.length === 0) return []

  const sortedArr = arr.sort((a, b) => a.value - b.value)
  const result = []
  let start = sortedArr[0].value
  let end = sortedArr[0].value + 1
  let status = sortedArr[0].status
  const price = sortedArr[0].price
  const values = [sortedArr[0].value]

  for (let i = 1; i < sortedArr.length; i++) {
    const current = sortedArr[i]
    if (start === 23 && current.value === 0) {
      end = 1
      values.push(current.value)
      continue
    }
    if (current.value === end) {
      end++
      values.push(current.value)
    }
    else {
      const label = `${String(start).padStart(2, '0')}:00-${String(end === 24 ? 0 : end).padStart(2, '0')}:00`
      result.push({ label, price, status, values: values.slice() })
      start = current.value
      end = current.value + 1
      status = current.status
      values.length = 0
      values.push(current.value)
    }
  }
  const lastLabel = `${String(start).padStart(2, '0')}:00-${String(end === 24 ? 0 : end).padStart(2, '0')}:00`
  result.push({ label: lastLabel, price, status, values: values.slice() })
  return result
}

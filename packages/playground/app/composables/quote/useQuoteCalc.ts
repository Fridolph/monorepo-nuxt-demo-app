import { CalcInst } from '@/utils/$calcalator'
import { initialFixedDeductions, auDeductionKeys } from '@quote/constants/quote'
import { promiseTimeout } from '@vueuse/core'

export default function useQuotePriceCalcator() {
  const taxRate = ref(0.05)
  const setTaxRate = (value: number) => taxRate.value = value

  const keyProductList = ref<ProjectCartDTO[]>([])
  const setKeyProductList = (list: ProjectCartDTO[]) => keyProductList.value = list

  const bosList = ref<ProjectQuoteAcBosDTO[]>([])
  const setBosList = (list: ProjectQuoteAcBosDTO[]) => bosList.value = list

  const acList = ref<ProjectQuoteAcBosDTO[]>([])
  const setAcList = (list: ProjectQuoteAcBosDTO[]) => acList.value = list

  const customDeductionList = ref<DeductionItem[]>([])
  const setCustomDeductionList = (list: DeductionItem[]) => customDeductionList.value = list

  function generateObjectFromKeys(keys: string[], parsedDeductionData: AuDeductionDetails) {
    const obj = {} as Record<string, any>
    keys.forEach((key) => {
      obj[key] = parsedDeductionData[key as keyof AuDeductionDetails]
    })
    return obj
  }

  const defaultDeductions = ref<DefaultDeductions>({
    id: undefined,
    country: '',
    deduction: '{}',
    taxPrice: null,
    totalPrice: null,
  })

  // 子组件经常用到，干脆直接弄成 computed 方便获取
  const parsedDeductions = computed<ParsedDeductions>(() => {
    const initialData = initialFixedDeductions
    try {
      // 数据有效性校验
      if (!isObject(defaultDeductions.value)) {
        return {
          parsedDeductionData: initialData,
          parsedDeductionArray: [],
        }
      }

      const deductionStr = defaultDeductions.value?.deduction
      if (!isString(deductionStr)) {
        return {
          parsedDeductionData: initialData,
          parsedDeductionArray: [],
        }
      }

      const parsedData = JSON.parse(deductionStr)
      const parsedDeductionData = {
        country: defaultDeductions.value?.country ?? '',
        ...initialData,
        ...parsedData,
      }

      // 同一个数据源 map 出来 几处复用
      const parsedDeductionArray = auDeductionKeys
        .map(item => generateObjectFromKeys(item.keys, parsedDeductionData))
        .map(mapAuDecItem)
        .filter(item => item?.switch && item.support)

      return { parsedDeductionData, parsedDeductionArray }
    }
    catch (err) {
      console.error('parsedDeductions error:', err)
      return { parsedDeductionData: initialData, parsedDeductionArray: [] }
    }
  })

  const setDefaultDeductions = (deductions: DefaultDeductions) => {
    defaultDeductions.value = deductions
  }

  const finalGroup = ref<QuoteFinalGroup>({
    fixedPriceFlag: 0,
    totalCost: null,
    grossMargin: null,
    grossProfit: null,
    finalPrice: null,
  })

  const setFinalGroupField = async (key: FinalTriggerKey, value: number | null) => {
    if (value == null) return
    const finalData: Record<keyof FinalOriginData, number | null> = {
      totalCost: finalGroup.value.totalCost,
      grossMargin: finalGroup.value.grossMargin,
      grossProfit: finalGroup.value.grossProfit,
      finalPrice: finalGroup.value.finalPrice,
    }
    finalData[key] = value
    finalGroup.value[key] = value

    await promiseTimeout(60)
    // const handledFinalGroupData = computeFinalPriceWithMargin(key, value, finalData as FinalOriginData, billInfoValue.value, taxRate.value)
    asyncUpdateFinalGroup()
    // finalGroup.value.totalCost = handledFinalGroupData?.totalCost as number
    // finalGroup.value.grossMargin = handledFinalGroupData?.grossMargin as number
    // finalGroup.value.grossProfit = handledFinalGroupData?.grossProfit as number
    // finalGroup.value.finalPrice = handledFinalGroupData?.finalPrice as number
  }

  async function asyncUpdateFinalGroup() {
    await promiseTimeout(100)
    // 一口价
    const {
      fixedTotalCost,
      fixedGrossMarginExclRate,
      fixedGrossProfitExclRate,
      fixedFinalPrice,
      totalCost,
      grossMarginExclRate,
      grossProfitExclRate,
      finalPrice,
    } = billInfoValue.value

    if (finalGroup.value.fixedPriceFlag) {
      finalGroup.value.totalCost = fixedTotalCost as number
      finalGroup.value.grossMargin = fixedGrossMarginExclRate as number
      finalGroup.value.grossProfit = fixedGrossProfitExclRate as number
      finalGroup.value.finalPrice = fixedFinalPrice as number
    }
    // 非一口价
    else {
      finalGroup.value.totalCost = totalCost as number
      finalGroup.value.grossMargin = grossMarginExclRate as number
      finalGroup.value.grossProfit = grossProfitExclRate as number
      finalGroup.value.finalPrice = finalPrice as number
    }
  }

  const discountData = ref<DiscountInfos>({
    discountSwitch: 0,
    discountType: 1,
    discountAmount: null,
    discountRatio: null,
    ratioToAmount: null,
  })
  const setDiscountData = (data: DiscountInfos) => discountData.value = data
  const setDiscountItem = <K extends keyof DiscountInfos>(key: K, value: DiscountInfos[K]) => {
    discountData.value[key] = value
  }

  const billInfoValue = ref({} as BillInfo)
  /**
   * quote 主页面中相关值（任意价格参数）改变时，应实时触发计算出对应参数
   */
  const getBillInfo = () => {
    const kpInfo = computeExclRateItemPrice(keyProductList.value, taxRate.value)
    const bosInfo = computeExclRateItemPrice(bosList.value, taxRate.value)
    const acInfo = computeExclRateItemPrice(acList.value, taxRate.value)
    // 之前只有 decInfo， 现在要将 decInfo、fixedDec 一起做兼容
    const decInfo = computeCustomDeductionListPrice(customDeductionList.value, taxRate.value)
    const fixedDec = computePriceWithFixedDeductionObject(defaultDeductions.value, taxRate.value)
    const mergeDecInfo = {
      deductionRate: CalcInst.sum([decInfo.customDeductionRate, fixedDec.priceRate]),
      deductionTotalInclRate: CalcInst.sum([decInfo.customDeductionPriceInclRate, fixedDec.linePrice]),
      deductionTotalExclRate: CalcInst.sum([decInfo.customDeductionPrice, fixedDec.linePrice]),
    }
    const fixedFlag = finalGroup.value.fixedPriceFlag
    // 注1. discount 参与最终计算并影响 finalPrice 结果
    // 注2. discount 若为比例，需根据 finalPrice 动态计算并影响 systemTotal
    // 注3. discount 不区分一口价，非一口价，直接参与计算
    const discountRatio: number | null = discountData.value.discountSwitch ? discountData.value.discountRatio : null
    // 注4. 目前填的都是含税的，PRD 里的计算代入的是不含税的 discountAmount (天坑)
    let discountAmount: number | null = 0
    // 同上，下面的计算记得用这个值
    let discountAmouontExclRate: number | null = 0

    // GS-2217 计算方式改不含税
    // 改版前所有字段（没有 exclRate 后缀默认）都是以含税来计算的
    // 现在要增加 1组字段 对应和区分
    // 参考文档
    // Excel 计算公式 https://onestopwarehouse.sg.larksuite.com/sheets/PLPNsjGYOhT0UIt8AJFlCbn8gBh?sheet=qvRfRp
    // PRD 计算部分，看 1.5 计算逻辑 https://onestopwarehouse.sg.larksuite.com/docx/Eiyzd87BBogVOIxVJZQlXBq7gPc
    let systemTotalExclRate: number = 0
    let systemTotalInclRate: number = 0
    let systemTaxRate: number = 0
    let totalCost: number = 0
    let totalCostExclRate: number = 0
    let grossMargin: number = 0
    let grossMarginExclRate: number = 0
    let grossProfit: number = 0
    let grossProfitExclRate: number = 0
    let finalPrice: number = 0
    let finalPriceExclRate: number = 0
    // 再次提醒：历史数据没写 excl 都以 incl 来计
    // 不要改历史数据的计算逻辑！会影响历史数据
    let fixedSystemPrice: number = 0
    let fixedSystemTaxRate: number = 0
    let fixedSystemPriceExclRate: number = 0
    let fixedKpPrice: number = 0
    let fixedTotalCost: number = 0
    let fixedTotalCostExclRate: number = 0
    let fixedGrossMargin: number = 0
    let fixedGrossMarginExclRate: number = 0
    let fixedGrossProfit: number = 0
    let fixedGrossProfitExclRate: number = 0
    let fixedFinalPrice: number = 0
    let fixedFinalPriceExclRate: number = 0

    systemTotalExclRate = CalcInst.sum([kpInfo.linePrice, bosInfo.linePrice, acInfo.linePrice])
    systemTaxRate = $number(systemTotalExclRate).multiply(taxRate.value).value
    systemTotalInclRate = CalcInst.sum([systemTotalExclRate, systemTaxRate])
    totalCost = CalcInst.sum([kpInfo.lineCostWithRate, bosInfo.lineCostWithRate, acInfo.lineCostWithRate, (mergeDecInfo.deductionTotalInclRate * -1)])
    totalCostExclRate = CalcInst.sum([kpInfo.lineCost, bosInfo.lineCost, acInfo.lineCost, (mergeDecInfo.deductionTotalExclRate * -1)])
    const deductionExclRate = mergeDecInfo.deductionTotalExclRate

    // 非固定价模式 - 从左往右的计算逻辑
    // 一口价要展示 autoPrice，这里逻辑调整为 都计算非一口价，并区分存储对应字段
    if (discountData.value.discountSwitch) {
      if (discountData.value.discountType === 1) {
        discountAmount = discountData.value.discountAmount ?? 0
        discountAmouontExclRate = $number(discountAmount).divide(1 + taxRate.value).value
      }
      else {
        discountAmount = $number(systemTotalInclRate, { precision: 6 }).multiply(discountData.value.discountRatio || 0).divide(100).value
        discountAmouontExclRate = $number(discountAmount).divide(1 + taxRate.value).value
      }
    }
    finalPriceExclRate = $number(systemTotalExclRate)
      .subtract(deductionExclRate)
      .subtract(discountAmouontExclRate).value
    finalPrice = $number(systemTotalInclRate)
      .subtract(mergeDecInfo.deductionTotalInclRate)
      .subtract(discountAmount).value
    systemTotalExclRate = $number(finalPrice).subtract(mergeDecInfo.deductionTotalInclRate).value
    grossProfit = $number(finalPrice).subtract(totalCost).value
    grossProfitExclRate = $number(finalPriceExclRate).subtract(totalCostExclRate).value
    if (!finalPrice) {
      grossMargin = 0
      grossMarginExclRate = 0
    }
    else {
      grossMargin = $number(finalPrice, { precision: 6 }).subtract(totalCost).divide(finalPrice).multiply(100).value
      grossMarginExclRate = $number(grossProfitExclRate, { precision: 6 }).divide(finalPriceExclRate).multiply(100).value
    }

    if (fixedFlag === 0) setFinalGroupField('totalCost', totalCost)

    // 固定价模式：从 inputFinalPrice 反推算其他价格
    // 不变因子：bosPrice、acPrice、deductionTotal
    if (fixedFlag === 1) {
      if (discountData.value.discountSwitch) {
        if (discountData.value.discountType === 1) {
          discountAmount = discountData.value.discountAmount ?? 0
          discountAmouontExclRate = $number(discountAmount).divide(1 + taxRate.value).value
        }
        else {
          discountAmount = $number(fixedSystemPrice, { precision: 6 }).multiply(discountData.value.discountRatio as number).divide(100).value
          discountAmouontExclRate = $number(discountAmount).divide(1 + taxRate.value).value
        }
      }

      fixedFinalPrice = finalGroup.value.finalPrice as number
      if (discountData.value.discountType === 2) {
        const disTemp = $number(100, { precision: 6 }).subtract(discountData.value.discountRatio as number).divide(100).value
        fixedSystemPrice = $number(fixedFinalPrice).add(mergeDecInfo.deductionTotalInclRate).divide(disTemp).value
      }
      else {
        fixedSystemPrice = $number(fixedFinalPrice).add(mergeDecInfo.deductionTotalInclRate).add(discountData.value.discountAmount as number).value
      }

      fixedSystemTaxRate = CalcInst.computeRate(fixedSystemPrice, taxRate.value)
      fixedSystemPriceExclRate = $number(fixedSystemPrice).subtract(fixedSystemTaxRate).value
      fixedKpPrice = $number(fixedSystemPrice).subtract(acInfo.linePrice).subtract(bosInfo.linePrice).subtract(fixedSystemTaxRate).value
      fixedFinalPriceExclRate = $number(fixedSystemPrice)
        .subtract(fixedSystemTaxRate)
        .subtract(mergeDecInfo.deductionTotalInclRate)
        .subtract(discountAmouontExclRate).value
      fixedTotalCost = finalGroup.value.totalCost as number

      const temp = $number(1).add(taxRate.value).value
      fixedTotalCostExclRate = $number(finalGroup.value.totalCost as number).subtract(mergeDecInfo.deductionTotalExclRate)
        .divide(temp)
        .subtract(mergeDecInfo.deductionTotalExclRate).value
      fixedGrossProfit = $number(fixedFinalPrice).subtract(fixedTotalCost).value
      fixedGrossProfitExclRate = $number(fixedFinalPriceExclRate).subtract(totalCostExclRate).value
      fixedGrossMargin = $number(fixedFinalPrice, { precision: 6 }).subtract(fixedTotalCost).divide(fixedFinalPrice).multiply(100).value
      fixedGrossMarginExclRate = $number(fixedGrossProfitExclRate, { precision: 6 })
        .divide(fixedFinalPriceExclRate)
        .multiply(100).value
    }

    billInfoValue.value = {
      systemTotalInclRate,
      systemTotalExclRate,
      kpPrice: kpInfo.linePrice,
      bosPrice: bosInfo.linePrice,
      acPrice: acInfo.linePrice,
      systemTaxRate,
      discountAmount,
      discountRatio,
      discountAmouontExclRate,
      customDeductionPriceInclRate: mergeDecInfo.deductionTotalInclRate,
      customDeductionRate: mergeDecInfo.deductionRate,

      totalCost,
      totalCostExclRate,
      grossMargin,
      grossMarginExclRate,
      grossProfit,
      grossProfitExclRate,
      finalPrice,
      finalPriceExclRate,

      fixedSystemPrice,
      fixedSystemTaxRate,
      fixedSystemPriceExclRate,
      fixedKpPrice,
      fixedTotalCost,
      fixedTotalCostExclRate,
      fixedGrossMargin,
      fixedGrossMarginExclRate,
      fixedGrossProfit,
      fixedGrossProfitExclRate,
      fixedFinalPrice,
      fixedFinalPriceExclRate,
    }

    return billInfoValue.value
  }

  const setBillInfo = (newValue: Partial<Record<BillInfoKeys, number | null>>) => {
    billInfoValue.value = newValue
    if (finalGroup.value.fixedPriceFlag) {
      finalGroup.value.finalPrice = newValue.fixedFinalPrice as number
    }
    else {
      finalGroup.value.finalPrice = newValue.finalPrice as number
    }
  }

  watch(() => computeExclRateItemPrice(keyProductList.value, taxRate.value), () => setBillInfo(getBillInfo()), { immediate: true, deep: true })
  watch(() => computeExclRateItemPrice(bosList.value, taxRate.value), () => setBillInfo(getBillInfo()), { deep: true, immediate: true })
  watch(() => computeExclRateItemPrice(acList.value, taxRate.value), () => setBillInfo(getBillInfo()), { deep: true, immediate: true })
  watch(() => computeCustomDeductionListPrice(customDeductionList.value, taxRate.value), () => setBillInfo(getBillInfo()), { deep: true, immediate: true })
  watch(() => computePriceWithFixedDeductionObject(defaultDeductions.value, taxRate.value), () => setBillInfo(getBillInfo()))
  watch(() => finalGroup.value, () => setBillInfo(getBillInfo()), { deep: true, immediate: true })
  watch(() => discountData.value, () => setBillInfo(getBillInfo()), { deep: true, immediate: true })

  return {
    taxRate, setTaxRate,
    keyProductList, setKeyProductList,
    bosList, setBosList,
    acList, setAcList,
    customDeductionList, setCustomDeductionList, computePriceWithFixedDeductionObject,
    defaultDeductions, setDefaultDeductions, parsedDeductions,
    discountData, setDiscountData, setDiscountItem,
    // 右侧账单小计
    finalGroup, setFinalGroupField,
    billInfo: billInfoValue, getBillInfo, setBillInfo,
  }
}

/**
 * 传入列表，自动加总计算当前项的价格
 * @returns ItemPrice { linePrice, lineCost, lineProfit }
 */
export function computeExclRateItemPrice(list: ProjectCartDTO[] | ProjectQuoteAcBosDTO[] | DeductionItem[], taxRate: number = 0.05): ItemPrice {
  let sumLineCost: number = 0
  let sumLineCostRate: number = 0
  let sumLineCostWithRate: number = 0

  let sumLinePrice: number = 0
  let sumLinePriceRate: number = 0
  let sumLinePriceWithRate: number = 0

  const data = {
    linePrice: 0,
    linePriceWithRate: 0,
    lineCost: 0,
    lineCostWithRate: 0,
    lineProfit: 0,
  }
  if (list.length === 0) return data

  sumLineCost = (list as ProjectQuoteAcBosDTO[]).reduce((acc, val) => $number(acc).add(val?.lineCost || 0).value, 0)
  sumLineCostRate = CalcInst.computeRate(sumLineCost, taxRate, 'excl_gst')
  sumLineCostWithRate = $number(sumLineCost).add(sumLineCostRate).value
  data.lineCost = sumLineCost
  data.lineCostWithRate = sumLineCostWithRate

  sumLinePrice = (list as ProjectQuoteAcBosDTO[]).reduce((acc, val) => $number(acc).add(val?.linePrice || 0).value, 0)
  sumLinePriceRate = CalcInst.computeRate(sumLinePrice, taxRate, 'excl_gst')
  sumLinePriceWithRate = $number(sumLinePrice).add(sumLinePriceRate).value
  data.linePrice = sumLinePrice
  data.linePriceWithRate = sumLinePriceWithRate
  data.lineProfit = $number(sumLinePrice).subtract(sumLineCost).value

  return data
}

/**
 * @description 计算 Deduction
 * @description 注：1. 澳洲有独有的固定补贴，以后可能兼容多个国家，计算逻辑需单独处理
 * @description 注：2. 兼容老数据结构，有 gstType，只有选 excl 才单独计算 Cost，若无都直接加总
 * @description 注：3. 同上，每项接口只返unitPrice, 要对应计算linePrice
 * @param list 接口返的 decInfos 可能改过结构，处理后传数组
 * @param taxRate 税率
 * @returns - Object[customDeductionPrice] 不含税总价;  Object[customDeductionPriceInclRate] 含税总价，兼容澳洲数据;  Object[customDeductionRate] 税价，可能需要单独展示
 */
export function computeCustomDeductionListPrice(originList: DeductionItem[], taxRate: number = 0.05) {
  const data = {
    customDeductionPrice: 0,
    customDeductionPriceInclRate: 0,
    customDeductionRate: 0,
  }
  if (!isArray(originList) || originList.length === 0) return data
  const list = originList.filter(v => !v.isCreating)
  const exclArr = list.filter(v => v.gstType === 'excl_gst')
  const exclLineRate = exclArr.reduce((acc, cur) => {
    const currentRate = CalcInst.computeRate(cur.linePrice || 0, taxRate, 'excl_gst')
    return $number(acc).add(currentRate).value
  }, 0)
  const exclLinePriceExclRate = exclArr.reduce((acc, cur) => {
    return $number(acc).add(cur.unitPrice as number).value
  }, 0)
  const exclTotal = $number(exclLinePriceExclRate).add(exclLineRate).value

  const othersArr = list.filter(v => v.gstType !== 'excl_gst')
  const othersTotal = othersArr.reduce((acc, cur) => {
    return $number(acc).add(cur.linePrice || 0).value
  }, 0)

  data.customDeductionRate = exclLineRate
  data.customDeductionPrice = othersTotal
  data.customDeductionPriceInclRate = $number(exclTotal).add(othersTotal).value
  return data
}

/**
 * 目前这个计算方法单独针对国家为 AU 的，后续简洁封装 尽可能复用多个国家
 */
export function computePriceWithFixedDeductionObject(deductionObject: DefaultDeductions, taxRate: number = 0.05): {
  linePrice: number
  priceRate: number
} {
  const priceData = {
    linePrice: 0,
    priceRate: 0,
  }
  if (deductionObject?.deduction) {
    const parsedObj = JSON.parse(deductionObject.deduction) as AuDeductionDetails
    const stcPanelData = _calcStcPanel(parsedObj)
    const stcBatteryData = _calcStcBattery(parsedObj)
    const bess1Data = _calcBess1(parsedObj)
    const bess2Data = _calcBess2(parsedObj)
    const vicData = _calcVic(parsedObj)
    const vicPvData = _calcVicPv(parsedObj)
    const vicBatteryData = _calcVicBattery(parsedObj)

    const itemsTotalRate = CalcInst.sum([
      stcPanelData.priceRate,
      stcBatteryData.priceRate,
      bess1Data.priceRate,
      bess2Data.priceRate,
      vicData.priceRate,
      vicPvData.priceRate,
      vicBatteryData.priceRate,
    ])
    const itemsTotalInclRate = CalcInst.sum([
      stcPanelData.linePriceInclRate,
      stcBatteryData.linePriceInclRate,
      bess1Data.linePriceInclRate,
      bess2Data.linePriceInclRate,
      vicData.linePriceInclRate,
      vicPvData.linePriceInclRate,
      vicBatteryData.linePriceInclRate,
    ])
    priceData.priceRate = itemsTotalRate
    priceData.linePrice = itemsTotalInclRate
  }
  return priceData

  function _calcStcPanel({ supportStc, stcSwitch, stcGstType, stcTotalPrice }: AuDeductionDetails) {
    const data = {
      linePrice: 0,
      priceRate: 0,
      linePriceInclRate: 0,
    }
    if (!supportStc || !stcSwitch) return data

    data.linePrice = stcTotalPrice ?? 0
    data.linePriceInclRate = stcTotalPrice ?? 0

    if (stcGstType === 'excl_gst') {
      const rate = CalcInst.computeRate(stcTotalPrice || 0, taxRate, stcGstType)
      data.priceRate = rate
      data.linePriceInclRate = $number(stcTotalPrice || 0).add(rate).value
    }
    return data
  }

  function _calcStcBattery({ supportStcBattery, stcBatterySwitch, stcBatteryGstType, stcBatteryTotalPrice }: AuDeductionDetails) {
    const data = {
      linePrice: 0,
      priceRate: 0,
      linePriceInclRate: 0,
    }
    if (!supportStcBattery || !stcBatterySwitch) return data

    data.linePrice = stcBatteryTotalPrice as number
    data.linePriceInclRate = stcBatteryTotalPrice as number

    if (stcBatteryGstType === 'excl_gst') {
      const rate = CalcInst.computeRate(stcBatteryTotalPrice as number, taxRate, 'excl_gst')
      data.priceRate = rate
      data.linePriceInclRate = $number(stcBatteryTotalPrice || 0).add(rate).value
    }
    return data
  }

  function _calcBess1({ supportBess1, bess1Switch, bess1GstType, bess1TotalPrice }: AuDeductionDetails) {
    const data = {
      linePrice: 0,
      priceRate: 0,
      linePriceInclRate: 0,
    }
    if (!supportBess1 || !bess1Switch) return data

    data.linePrice = bess1TotalPrice ?? 0
    data.linePriceInclRate = bess1TotalPrice ?? 0

    if (bess1GstType === 'excl_gst') {
      const rate = CalcInst.computeRate(bess1TotalPrice || 0, taxRate, 'excl_gst')
      data.priceRate = rate
      data.linePriceInclRate = $number(bess1TotalPrice || 0).add(rate).value
    }
    return data
  }

  function _calcBess2({ supportBess2, bess2Switch, bess2GstType, bess2TotalPrice }: AuDeductionDetails) {
    const data = {
      linePrice: 0,
      priceRate: 0,
      linePriceInclRate: 0,
    }
    if (!supportBess2 || !bess2Switch) return data

    data.linePrice = bess2TotalPrice ?? 0
    data.linePriceInclRate = bess2TotalPrice ?? 0

    if (bess2GstType === 'excl_gst') {
      const rate = CalcInst.computeRate(bess2TotalPrice || 0, taxRate, 'excl_gst')
      data.priceRate = rate
      data.linePriceInclRate = $number(bess2TotalPrice || 0).add(rate).value
    }
    return data
  }

  function _calcVic({ supportVic, vicSwitch, vicGstType, vicTotalPrice }: AuDeductionDetails) {
    const data = {
      linePrice: 0,
      priceRate: 0,
      linePriceInclRate: 0,
    }
    if (!supportVic || !vicSwitch) return data

    data.linePrice = vicTotalPrice ?? 0
    data.linePriceInclRate = vicTotalPrice ?? 0

    if (vicGstType === 'excl_gst') {
      const rate = CalcInst.computeRate(vicTotalPrice || 0, taxRate, 'excl_gst')
      data.priceRate = rate
      data.linePriceInclRate = $number(vicTotalPrice || 0).add(rate).value
    }
    return data
  }

  function _calcVicPv({ supportVicPv, vicPvSwitch, vicPvGstType, vicPvTotalPrice }: AuDeductionDetails) {
    const data = {
      linePrice: 0,
      priceRate: 0,
      linePriceInclRate: 0,
    }
    if (!supportVicPv || !vicPvSwitch) return data

    data.linePrice = vicPvTotalPrice ?? 0
    data.linePriceInclRate = vicPvTotalPrice ?? 0

    if (vicPvGstType === 'excl_gst') {
      const rate = CalcInst.computeRate(vicPvTotalPrice || 0, taxRate, 'excl_gst')
      data.priceRate = rate
      data.linePriceInclRate = $number(vicPvTotalPrice || 0).add(rate).value
    }
    return data
  }

  function _calcVicBattery({ supportVicBattery, vicBatterySwitch, vicBatteryGstType, vicBatteryTotalPrice }: AuDeductionDetails) {
    const data = {
      linePrice: 0,
      priceRate: 0,
      linePriceInclRate: 0,
    }
    if (!supportVicBattery || !vicBatterySwitch) return data

    data.linePrice = vicBatteryTotalPrice ?? 0
    data.linePriceInclRate = vicBatteryTotalPrice ?? 0

    if (vicBatteryGstType === 'excl_gst') {
      const rate = CalcInst.computeRate(vicBatteryTotalPrice || 0, taxRate, 'excl_gst')
      data.priceRate = rate
      data.linePriceInclRate = $number(vicBatteryTotalPrice || 0).add(rate).value
    }
    return data
  }
}

/**
 * Quote - margin 模式 finalPrice 计算器
 * @param triggerKey
 * @param triggerValue
 * @param data
 * @returns
 */
export function computeFinalPriceWithMargin(
  triggerKey: FinalTriggerKey,
  triggerValue: number | null,
  currentInputGroup: FinalOriginData,
  billInfo: BillInfo,
  taxRate: number,
) {
  const ret: Record<string, any> = { ...currentInputGroup }
  const { fixedSystemPriceExclRate, fixedFinalPriceExclRate, customDeductionPriceInclRate, totalCostExclRate, discountAmount } = billInfo
  let marginFlag: number = 0
  let priceFlag: number = 0
  if (triggerValue == null) return
  switch (triggerKey) {
    // 顶级规则：锚定 totalCost 不变，即用户改输入框都不改 totalCost
    case 'totalCost':
      // 注：目前 trigger 的 totalCost 是 incl 含税的
      ret.totalCost = triggerValue
      // 这里算的是不含税 totalCostExclRate
      priceFlag = $number(triggerValue)
        .subtract(customDeductionPriceInclRate || 0)
        .divide(1 + taxRate)
        .subtract(customDeductionPriceInclRate || 0).value
      ret.totalCostExclRate = priceFlag
      ret.grossProfit = $number(currentInputGroup.finalPrice || 0).subtract(triggerValue || 0).value
      ret.grossProfitExclRate = $number(fixedFinalPriceExclRate || 0).subtract(triggerValue || 0).value
      ret.grossMargin = currentInputGroup.finalPrice
        ? $number(currentInputGroup.finalPrice as number, { precision: 6 }).subtract(triggerValue as number).divide(currentInputGroup.finalPrice as number).multiply(100).value
        : 0
      ret.grossMarginExclRate = currentInputGroup.finalPrice
        ? $number(ret.grossProfitExclRate).divide(fixedFinalPriceExclRate as number).value
        : 0
      break
    case 'grossProfit':
      ret.totalCost = currentInputGroup.totalCost
      ret.totalCostExclRate = totalCostExclRate
      // 注：这值代表用户修改的是为不含税的 grossProfit
      ret.grossProfit = triggerValue
      // finalPriceExclRate
      priceFlag = $number(triggerValue as number).add(totalCostExclRate as number).value
      // 现在 grossMargin 为不含税
      ret.grossMargin = $number(triggerValue, { precision: 6 }).divide(priceFlag).multiply(100).value
      // 计算 finalPriceInclRate
      priceFlag = $number(triggerValue as number).multiply(1 + taxRate).add(ret.totalCost).value
      ret.finalPrice = priceFlag
      break
    case 'grossMargin':
      // 注：这值改版后是不含税的计算值
      // 产品认为 含税不含税的margin应该是相等的
      // 但明显，含税加入分母计算，怎么可能不变？ 直接赋值相等即可不要纠结，不要内耗 :)
      ret.grossMargin = triggerValue
      ret.grossMarginExclRate = triggerValue
      marginFlag = $number(100).subtract(triggerValue).divide(100).value
      // finalPriceExclRate
      priceFlag = $number(totalCostExclRate || 0).divide(marginFlag).value
      ret.totalCost = currentInputGroup.totalCost
      ret.totalCostExclRate = totalCostExclRate
      ret.grossProfit = $number(priceFlag).subtract(totalCostExclRate || 0).value
      // 含税的finalPrice
      ret.finalPrice = $number(currentInputGroup.totalCost).divide(marginFlag).value
      break
    case 'finalPrice':
      // 注：输入框改的 finalPrice 仍然为 incl 含税
      ret.finalPrice = triggerValue
      ret.totalCost = currentInputGroup.totalCost
      // 注：该变量用于计算不含税的 totalCostExclRate
      marginFlag = $number(currentInputGroup.totalCost)
        .subtract(customDeductionPriceInclRate || 0)
        .divide(1 + taxRate)
        .subtract(customDeductionPriceInclRate || 0)
        .value
      // 该变量用于计算 finalPriceExclRate
      priceFlag = $number(fixedSystemPriceExclRate || 0)
        .subtract(discountAmount || 0)
        .subtract(customDeductionPriceInclRate || 0).value
      ret.grossProfit = $number(priceFlag).subtract(marginFlag).value
      ret.grossMargin = $number(ret.grossProfit, { precision: 6 })
        .divide(priceFlag).multiply(100).value
      break
    default:
      break
  }
  return ret
}

/**
 * AU 澳洲支持的补贴字段映射关系
 * 这样 quote -> proposal -> pdf 同一个来源生成同一个视图
 */
export const deductionFieldMappings: Array<{
  conditionField: string
  resultType: fixedAuBaseItemType
  labelKey: string
  fields: Array<{
    source: string
    target: keyof FixedAuDeductionBaseItem
  }>
}> = [
  {
    conditionField: 'supportStc',
    resultType: 'stc',
    labelKey: 'stc_panel',
    fields: [
      { source: 'supportStc', target: 'support' },
      { source: 'stcSwitch', target: 'switch' },
      { source: 'isHideStcItem', target: 'isHideItem' },
      { source: 'isHideStcPrice', target: 'isHidePrice' },
      { source: 'stcGstType', target: 'gstType' },
      { source: 'stcQuantity', target: 'quantity' },
      { source: 'stcUnitPrice', target: 'unitPrice' },
      { source: 'stcTotalPrice', target: 'linePrice' },
      { source: 'installationYear', target: 'installationYear' },
    ],
  },
  {
    conditionField: 'supportStcBattery',
    resultType: 'stcBattery',
    labelKey: 'stc_battery',
    fields: [
      { source: 'supportStcBattery', target: 'support' },
      { source: 'stcBatterySwitch', target: 'switch' },
      { source: 'isHideStcBatteryItem', target: 'isHideItem' },
      { source: 'isHideStcBatteryPrice', target: 'isHidePrice' },
      { source: 'stcBatteryGstType', target: 'gstType' },
      { source: 'stcBatteryQuantity', target: 'quantity' },
      { source: 'stcBatteryUnitPrice', target: 'unitPrice' },
      { source: 'stcBatteryTotalPrice', target: 'linePrice' },
      { source: 'installationYear', target: 'installationYear' },
    ],
  },
  {
    conditionField: 'supportVic',
    resultType: 'vic',
    labelKey: 'vic_rebate',
    fields: [
      { source: 'supportVic', target: 'support' },
      { source: 'vicSwitch', target: 'switch' },
      { source: 'isHideVicItem', target: 'isHideItem' },
      { source: 'isHideVicPrice', target: 'isHidePrice' },
      { source: 'vicGstType', target: 'gstType' },
      { source: 'vicTotalPrice', target: 'linePrice' },
    ],
  },
  {
    conditionField: 'supportVicPv',
    resultType: 'vicPv',
    labelKey: 'vic_pv_free_loan',
    fields: [
      { source: 'supportVicPv', target: 'support' },
      { source: 'vicPvSwitch', target: 'switch' },
      { source: 'isHideVicPvItem', target: 'isHideItem' },
      { source: 'isHideVicPvPrice', target: 'isHidePrice' },
      { source: 'vicPvGstType', target: 'gstType' },
      { source: 'vicPvTotalPrice', target: 'linePrice' },
    ],
  },
  {
    conditionField: 'supportVicBattery',
    resultType: 'vicBattery',
    labelKey: 'vic_bi_free_loan',
    fields: [
      { source: 'supportVicBattery', target: 'support' },
      { source: 'vicBatterySwitch', target: 'switch' },
      { source: 'isHideVicBatteryItem', target: 'isHideItem' },
      { source: 'isHideVicBatteryPrice', target: 'isHidePrice' },
      { source: 'vicBatteryGstType', target: 'gstType' },
      { source: 'vicBatteryTotalPrice', target: 'linePrice' },
    ],
  },
  {
    conditionField: 'supportBess1',
    resultType: 'bess1',
    labelKey: 'nsw_battery_rebate',
    fields: [
      { source: 'supportBess1', target: 'support' },
      { source: 'bess1Switch', target: 'switch' },
      { source: 'isHideBess1Item', target: 'isHideItem' },
      { source: 'isHideBess1Price', target: 'isHidePrice' },
      { source: 'bess1GstType', target: 'gstType' },
      { source: 'bess1Quantity', target: 'quantity' },
      { source: 'bess1UnitPrice', target: 'unitPrice' },
      { source: 'bess1TotalPrice', target: 'linePrice' },
    ],
  },
  {
    conditionField: 'supportBess2',
    resultType: 'bess2',
    labelKey: 'nsw_vpp_rebate',
    fields: [
      { source: 'supportBess2', target: 'support' },
      { source: 'bess2Switch', target: 'switch' },
      { source: 'isHideBess2Item', target: 'isHideItem' },
      { source: 'isHideBess2Price', target: 'isHidePrice' },
      { source: 'bess2GstType', target: 'gstType' },
      { source: 'bess2Quantity', target: 'quantity' },
      { source: 'bess2UnitPrice', target: 'unitPrice' },
      { source: 'bess2TotalPrice', target: 'linePrice' },
    ],
  },
]

// 辅助函数：将扣减项转换为统一格式
function mapAuDecItem(auItem: Record<string, any>): FixedAuDeductionBaseItem {
  const result: FixedAuDeductionBaseItem = {
    support: 0,
    switch: 0,
    isHideItem: 0,
    isHidePrice: 0,
    gstType: 'gst_free',
    linePrice: 0,
    type: '' as fixedAuBaseItemType,
    labelKey: '',
  }

  // 匹配字段映射配置
  const matchingMapping = deductionFieldMappings.find(mapping => mapping.conditionField in auItem)
  if (matchingMapping) {
    result.type = matchingMapping.resultType
    result.labelKey = matchingMapping.labelKey
    matchingMapping.fields.forEach((field) => {
      if (field.source in auItem) {
        result[field.target] = auItem[field.source]
      }
    })

    // 为stc和stcBattery类型设置默认安装年份
    if (result.type === 'stc' || result.type === 'stcBattery') {
      result.installationYear = result.installationYear || new Date().getFullYear()
    }
  }

  return result
}

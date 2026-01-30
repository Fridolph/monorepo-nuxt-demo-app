import { initialFixedDeductions, auDeductionKeys } from '~/constants/quote'
import { promiseTimeout } from '@vueuse/core'
import { calc_sum, calc_wrap as calc } from 'a-calc'

// ==================== 核心计算函数 ====================

// 基础计算函数 - 使用a-calc确保精度
export const calcTaxAmount = calc('basePrice * taxRate')
export const calcWithTaxRate = calc('basePrice * (1 + taxRate)')
export const calcExclRateFromInclRate = calc('priceInclRate / (1 + taxRate)')
// 删除冗余函数
// export const calcAddValues = calc('a + b + c')
// export const calcSubtract = calc('a - b - c')
export const calcPercentage = calc('value * percentage / 100')
export const calcDiscountFactor = calc('(100 - discountPercent) / 100')
export const calcReverseWithFactor = calc('(price + deduction) / factor')
export const calcGrossProfit = calc('price - cost')
export const calcMarginPercentage = calc('profit / price * 100')
export const calcSum = (items: any[], fns: () => any[]) => {
  try {
    // 去掉格式化参数 | =2，只保留 'itemPrice'，或者完全去掉第一个参数
    return calc_sum('itemPrice', fns()) || 0 // 确保返回数字
  } catch (err) {
    console.error('计算错误:', err)
    return 0 // 出错时返回 0
  }
}

/**
 * 重构版的报价计算器，采用更清晰的计算逻辑和命名约定
 * 主要改进：
 * 1. 使用a-calc替代$number确保计算精度
 * 2. 明确区分含税(InclRate)和不含税(ExclRate)金额
 * 3. 模块化计算逻辑，减少代码重复
 * 4. 优化数据流向，减少副作用
 */
export default function useQuoteCalculator() {
  // ==================== 基础状态定义 ====================
  const taxRate = ref(0.1)
  const setTaxRate = (value: number) => taxRate.value = value

  const keyProductList = ref<any[]>([])
  const setKeyProductList = (list: any[]) => {
    console.log('🚀 setKeyProductList:', list)
    console.log('Setting keyProductList:', list)
    keyProductList.value = list
    console.log('🚀 set to:', keyProductList.value)
  }

  const bosList = ref<any[]>([])
  const setBosList = (list: any[]) => bosList.value = list

  const acList = ref<any[]>([])
  const setAcList = (list: any[]) => acList.value = list

  const customDeductionList = ref<any[]>([])
  const setCustomDeductionList = (list: any[]) => customDeductionList.value = list

  const defaultDeductions = ref<Record<string, any>>({
    id: undefined,
    country: '',
    deduction: '{}',
    taxPrice: null,
    totalPrice: null
  })
  const setDefaultDeductions = (deductions: Record<string, any>) => {
    defaultDeductions.value = deductions
  }

  // 子组件经常用到，干脆直接弄成 computed 方便获取
  const parsedDeductions = computed<Record<string, any>>(() => {
    const initialData = initialFixedDeductions
    try {
      // 数据有效性校验
      if (!isObject(defaultDeductions.value)) {
        return {
          parsedDeductionData: initialData,
          parsedDeductionArray: []
        }
      }

      const deductionStr = defaultDeductions.value?.deduction
      if (!isString(deductionStr)) {
        return {
          parsedDeductionData: initialData,
          parsedDeductionArray: []
        }
      }

      const parsedData = JSON.parse(deductionStr)
      const parsedDeductionData = {
        country: defaultDeductions.value?.country ?? '',
        ...initialData,
        ...parsedData
      }

      // 同一个数据源 map 出来 几处复用
      const parsedDeductionArray = auDeductionKeys
        .map(item => generateObjectFromKeys(item.keys, parsedDeductionData))
        .map(mapAuDecItem)
        .filter(item => item?.switch && item.support)

      return { parsedDeductionData, parsedDeductionArray }
    } catch (err) {
      console.error('parsedDeductions error:', err)
      return { parsedDeductionData: initialData, parsedDeductionArray: [] }
    }
  })

  function generateObjectFromKeys(keys: string[], parsedDeductionData: Record<string, any>) {
    const obj = {} as Record<string, any>
    keys.forEach((key) => {
      obj[key] = parsedDeductionData[key as keyof Record<string, any>]
    })
    return obj
  }

  const finalGroup = ref<Record<string, any>>({
    fixedPriceFlag: 0,
    totalCost: null,
    grossMargin: null,
    grossProfit: null,
    finalPrice: null
  })

  const discountData = ref<Record<string, any>>({
    discountSwitch: 0,
    discountType: 1,
    discountAmount: null,
    discountRatio: null,
    ratioToAmount: null
  })
  const setDiscountData = (data: Record<string, any>) => discountData.value = data
  const setDiscountItem = <K extends keyof Record<string, any>>(key: K, value: Record<string, any>[K]) => {
    discountData.value[key] = value
  }

  const billInfoValue = ref<Record<string, any>>({} as Record<string, any>)

  /**
   * 计算产品组总价(不含税)
   * @param products 产品列表
   * @returns 不含税总价
   */
  function calculateProductGroupTotalExclRate(products: any[]) {
    if (!products || products.length === 0) return 0
    return calcSum(products, () => products.map((p) => {
      return { itemPrice: p?.linePrice || 0 }
    }))
  }

  /**
   * 计算产品组总成本(不含税)
   * @param products 产品列表
   * @returns 不含税总成本
   */
  function calculateProductGroupTotalCostExclRate(products: any[]) {
    if (!products || products.length === 0) return 0
    return calcSum(products, () => products.map((p) => {
      return { itemPrice: p?.lineCost || 0 }
    }))
  }

  /**
   * 计算系统总价(含税)
   * @param keyProductsExclRate 主产品不含税总价
   * @param bosExclRate BOS不含税总价
   * @param acExclRate AC不含税总价
   * @param taxRateValue 税率
   * @returns 含税系统总价
   */
  function calculateSystemTotalInclRate(
    keyProductsExclRate: number,
    bosExclRate: number,
    acExclRate: number,
    taxRateValue: number
  ) {
    const systemTotalExclRate = calc('keyProductsExclRate + bosExclRate + acExclRate')({
      keyProductsExclRate,
      bosExclRate,
      acExclRate
    })
    return calcWithTaxRate({ basePrice: systemTotalExclRate, taxRate: taxRateValue })
  }

  /**
   * 计算折扣金额(根据类型)
   * @param discountDataValue 折扣数据
   * @param systemTotalInclRate 含税系统总价
   * @param systemTotalExclRate 不含税系统总价
   * @param taxRateValue 税率
   * @returns 折扣金额(含税和不含税)
   */
  function calculateDiscountAmount(
    discountDataValue: Record<string, any>,
    systemTotalInclRate: number,
    systemTotalExclRate: number,
    taxRateValue: number
  ) {
    // 不启用折扣
    if (!discountDataValue.discountSwitch)
      return { discountAmountInclRate: 0, discountAmountExclRate: 0 }

    let discountAmountInclRate = 0
    let discountAmountExclRate = 0

    // 固定金额折扣
    if (discountDataValue.discountType === 1) {
      discountAmountInclRate = discountDataValue.discountAmount || 0
      // 计算不含税折扣
      discountAmountExclRate = calcExclRateFromInclRate({
        priceInclRate: discountAmountInclRate,
        taxRate: taxRateValue
      })
    }
    // 百分比折扣
    else {
      const percentage = discountDataValue.discountRatio || 0
      // 含税金额折扣
      discountAmountInclRate = calcPercentage({ value: systemTotalInclRate, percentage })
      // 不含税金额折扣 - 直接用不含税金额计算
      discountAmountExclRate = calcPercentage({ value: systemTotalExclRate, percentage })
    }

    return { discountAmountInclRate, discountAmountExclRate }
  }

  /**
   * 计算自定义扣减项总金额 - 区分GST类型
   * @param deductions 扣减项列表
   * @returns 扣减金额分类统计
   */
  function calculateCustomDeductionsTotalAmount(deductions: any[]) {
    if (!Array.isArray(deductions) || deductions.length === 0) {
      return { gstFreeAmount: 0, gstExclAmount: 0, gstInclAmount: 0 }
    }

    // 过滤掉正在创建的项
    const validItems = deductions.filter(item => !item.isCreating)

    // 按税类型分组
    const gstFreeItems = validItems.filter(item => item.gstType === 'gst_free')
    const exclGstItems = validItems.filter(item => item.gstType === 'excl_gst')
    const inclGstItems = validItems.filter(item =>
      item.gstType !== 'gst_free' && item.gstType !== 'excl_gst'
    )

    // 计算各组合计
    const gstFreeAmount = calcSum(gstFreeItems, () => gstFreeItems.map(item => item.linePrice || 0))

    const gstExclAmount = calcSum(exclGstItems, () => exclGstItems.map(item => item.linePrice || 0))

    const gstInclAmount = calcSum(inclGstItems, () => inclGstItems.map(item => item.linePrice || 0))

    return { gstFreeAmount, gstExclAmount, gstInclAmount }
  }

  /**
   * 计算固定扣减项总金额
   * @param deductionObject 固定扣减对象
   * @returns 扣减金额分类统计
   */
  function calculateFixedDeductionsTotalAmount(deductionObject: Record<string, any>) {
    if (!deductionObject?.deduction) {
      return { gstFreeAmount: 0, gstExclAmount: 0, gstInclAmount: 0 }
    }

    try {
      // 解析扣减数据
      const parsedData = JSON.parse(deductionObject.deduction)

      // 使用映射计算各种补贴
      const deductionItems = auDeductionKeys.map((item) => {
        // 从解析的数据中提取相关字段
        const itemData = {} as Record<string, any>
        item.keys.forEach((key) => {
          itemData[key] = parsedData[key]
        })

        // 转换为统一格式
        return mapAuDecItem(itemData)
      }).filter(item => item?.switch && item?.support)

      // 按GST类型分组
      const gstFreeItems = deductionItems.filter(item => item.gstType === 'gst_free')
      const exclGstItems = deductionItems.filter(item => item.gstType === 'excl_gst')
      const inclGstItems = deductionItems.filter(item =>
        item.gstType !== 'gst_free' && item.gstType !== 'excl_gst'
      )

      // 计算各组合计
      const gstFreeAmount = calcSum(gstFreeItems, () => gstFreeItems.map(item => item.linePrice || 0))

      const gstExclAmount = calcSum(exclGstItems, () => exclGstItems.map(item => item.linePrice || 0))

      const gstInclAmount = calcSum(inclGstItems, () => inclGstItems.map(item => item.linePrice || 0))

      return { gstFreeAmount, gstExclAmount, gstInclAmount }
    } catch (err) {
      console.error('Error calculating fixed deductions:', err)
      return { gstFreeAmount: 0, gstExclAmount: 0, gstInclAmount: 0 }
    }
  }

  /**
   * 计算最终价格(考虑免税项)
   * @param systemTotalExclRate 不含税系统总价
   * @param systemTotalInclRate 含税系统总价
   * @param deductionsGstFree 免税扣减
   * @param discountAmountExclRate 不含税折扣
   * @param discountAmountInclRate 含税折扣
   * @returns 最终价格(含税和不含税)
   */
  function calculateFinalPriceWithTaxConsideration(
    systemTotalExclRate: number,
    systemTotalInclRate: number,
    deductionsGstFree: number,
    discountAmountExclRate: number,
    discountAmountInclRate: number
  ) {
    // 含税最终价格 - 直接相加(注意扣减和折扣为负值)
    const finalPriceInclRate = calc('systemTotalInclRate - deductionsGstFree - discountAmountInclRate')({
      systemTotalInclRate,
      deductionsGstFree,
      discountAmountInclRate
    })

    // 不含税最终价格 - 按公式：不含税系统价 - 免税扣减 - 不含税折扣
    const finalPriceExclRate = calc('systemTotalExclRate - deductionsGstFree - discountAmountExclRate')({
      systemTotalExclRate,
      deductionsGstFree,
      discountAmountExclRate
    })

    return { finalPriceInclRate, finalPriceExclRate }
  }

  /**
   * 计算总成本(考虑免税项)
   * @param keyProductsCost 主产品成本
   * @param bosCost BOS成本
   * @param acCost AC成本
   * @param deductionsGstFree 免税扣减
   * @param taxRateValue 税率
   * @returns 总成本(含税和不含税)
   */
  function calculateTotalCostWithTaxConsideration(
    keyProductsCost: number,
    bosCost: number,
    acCost: number,
    deductionsGstFree: number,
    taxRateValue: number
  ) {
    // 不含税成本总和
    const lineCostsSum = calc('keyProductsCost + bosCost + acCost')({
      keyProductsCost,
      bosCost,
      acCost
    })

    // 含税总成本 - 成本总和(含税) - 免税扣减
    const totalCostInclRate = calc('costWithTax - deductionsGstFree')({
      costWithTax: calcWithTaxRate({ basePrice: lineCostsSum, taxRate: taxRateValue }),
      deductionsGstFree
    })

    // 不含税总成本 - 成本总和 - 免税扣减
    const totalCostExclRate = calc('lineCostsSum - deductionsGstFree')({
      lineCostsSum,
      deductionsGstFree
    })

    return { totalCostInclRate, totalCostExclRate, lineCostsSum }
  }

  /**
   * 计算毛利和毛利率
   * @param finalPriceExclRate 不含税最终价格
   * @param totalCostExclRate 不含税总成本
   * @returns 毛利和毛利率
   */
  function calculateProfitAndMargin(finalPriceExclRate: number, totalCostExclRate: number) {
    // 毛利(不含税)
    const grossProfitExclRate = calcGrossProfit({
      price: finalPriceExclRate,
      cost: totalCostExclRate
    })

    // 毛利率(不含税) - 避免除零错误
    let grossMarginExclRate = 0
    if (finalPriceExclRate > 0) {
      grossMarginExclRate = calcMarginPercentage({
        profit: grossProfitExclRate,
        price: finalPriceExclRate
      })
    }

    return { grossProfitExclRate, grossMarginExclRate }
  }

  /**
   * 固定价模式计算函数
   * @param fixedFinalPriceInclRate 固定的最终价格(含税)
   * @param deductionsGstFree 免税扣减
   * @param discountDataValue 折扣数据
   * @param bosTotalExclRate BOS不含税总价
   * @param acTotalExclRate AC不含税总价
   * @param taxRateValue 税率
   * @param totalCostExclRate 不含税总成本
   * @returns 固定价模式计算结果
   */
  function calculateFixedPriceMode(
    fixedFinalPriceInclRate: number,
    deductionsGstFree: number,
    discountDataValue: Record<string, any>,
    bosTotalExclRate: number,
    acTotalExclRate: number,
    taxRateValue: number,
    totalCostExclRate: number,
    totalCostInclRate: number
  ) {
    // 1. 根据折扣类型计算系统总价(含税)
    let fixedSystemTotalInclRate = 0

    if (discountDataValue.discountSwitch) {
      if (discountDataValue.discountType === 2) { // 百分比折扣
        // 计算折扣因子: (100 - 折扣百分比) / 100
        const discountFactor = calcDiscountFactor({ discountPercent: discountDataValue.discountRatio || 0 })

        // 反向计算系统总价: (最终价格 + 扣减) / 折扣因子
        fixedSystemTotalInclRate = calc('(finalPrice + deduction) / factor')({
          finalPrice: fixedFinalPriceInclRate,
          deduction: deductionsGstFree,
          factor: discountFactor
        })
      } else { // 金额折扣
        // 反向计算系统总价: 最终价格 + 扣减 + 折扣金额
        fixedSystemTotalInclRate = calc('finalPrice + deduction + discount')({
          finalPrice: fixedFinalPriceInclRate,
          deduction: deductionsGstFree,
          discount: discountDataValue.discountAmount || 0
        })
      }
    } else {
      // 无折扣: 最终价格 + 扣减
      fixedSystemTotalInclRate = calc('finalPrice + deduction')({
        finalPrice: fixedFinalPriceInclRate,
        deduction: deductionsGstFree
      })
    }

    // 2. 计算系统税额和不含税系统总价
    const fixedSystemTaxAmount = calc('price * rate / (1 + rate)')({
      price: fixedSystemTotalInclRate,
      rate: taxRateValue
    })

    const fixedSystemTotalExclRate = calc('totalPrice - taxAmount')({
      totalPrice: fixedSystemTotalInclRate,
      taxAmount: fixedSystemTaxAmount
    })

    // 3. 计算固定价模式下的主产品价格
    const fixedKeyProductsTotalExclRate = calc('systemTotal - bosTotal - acTotal')({
      systemTotal: fixedSystemTotalExclRate,
      bosTotal: bosTotalExclRate,
      acTotal: acTotalExclRate
    })

    // 4. 计算折扣金额
    let fixedDiscountAmountInclRate = 0
    let fixedDiscountAmountExclRate = 0

    if (discountDataValue.discountSwitch) {
      if (discountDataValue.discountType === 1) { // 固定金额
        fixedDiscountAmountInclRate = discountDataValue.discountAmount || 0
        fixedDiscountAmountExclRate = calcExclRateFromInclRate({
          priceInclRate: fixedDiscountAmountInclRate,
          taxRate: taxRateValue
        })
      } else { // 百分比
        const percentage = discountDataValue.discountRatio || 0
        fixedDiscountAmountInclRate = calcPercentage({
          value: fixedSystemTotalInclRate,
          percentage
        })

        fixedDiscountAmountExclRate = calcPercentage({
          value: fixedSystemTotalExclRate,
          percentage
        })
      }
    }

    // 5. 计算固定价模式下的最终价格(不含税) - 按照业务公式
    const fixedFinalPriceExclRate = calc('systemTotal - deductions - discount')({
      systemTotal: fixedSystemTotalExclRate,
      deductions: deductionsGstFree,
      discount: fixedDiscountAmountExclRate
    })

    // 6. 计算毛利和毛利率
    const fixedGrossProfitExclRate = calcGrossProfit({
      price: fixedFinalPriceExclRate,
      cost: totalCostExclRate
    })

    const fixedGrossProfitInclRate = calcGrossProfit({
      price: fixedFinalPriceInclRate,
      cost: totalCostInclRate
    })

    // 避免除零错误
    let fixedGrossMarginExclRate = 0
    if (fixedFinalPriceExclRate > 0) {
      fixedGrossMarginExclRate = calcMarginPercentage({
        profit: fixedGrossProfitExclRate,
        price: fixedFinalPriceExclRate
      })
    }

    return {
      fixedSystemTotalInclRate,
      fixedSystemTaxAmount,
      fixedSystemTotalExclRate,
      fixedKeyProductsTotalExclRate,
      fixedDiscountAmountInclRate,
      fixedDiscountAmountExclRate,
      fixedFinalPriceInclRate,
      fixedFinalPriceExclRate,
      fixedGrossProfitExclRate,
      fixedGrossProfitInclRate,
      fixedGrossMarginExclRate
    }
  }

  /**
   * 计算账单信息
   * @returns 计算结果
   */
  function calculateBillInfo() {
    // 1. 计算各产品组的总价(不含税)和总成本
    const keyProductsTotalExclRate = calculateProductGroupTotalExclRate(keyProductList.value)
    const keyProductsTotalCost = calculateProductGroupTotalCostExclRate(keyProductList.value)

    const bosTotalExclRate = calculateProductGroupTotalExclRate(bosList.value)
    const bosTotalCost = calculateProductGroupTotalCostExclRate(bosList.value)

    const acTotalExclRate = calculateProductGroupTotalExclRate(acList.value)
    const acTotalCost = calculateProductGroupTotalCostExclRate(acList.value)

    // 2. 计算系统总价(不含税和含税)
    const systemTotalExclRate = calc('kpTotal + bosTotal + acTotal')({
      kpTotal: keyProductsTotalExclRate,
      bosTotal: bosTotalExclRate,
      acTotal: acTotalExclRate
    })

    const systemTaxAmount = calcTaxAmount({
      basePrice: systemTotalExclRate,
      taxRate: taxRate.value
    })

    const systemTotalInclRate = calc('basePrice + taxAmount')({
      basePrice: systemTotalExclRate,
      taxAmount: systemTaxAmount
    })

    // 3. 计算扣减项总额
    const customDeductionsInfo = calculateCustomDeductionsTotalAmount(customDeductionList.value)
    const fixedDeductionsInfo = calculateFixedDeductionsTotalAmount(defaultDeductions.value)

    // 合并所有扣减项
    const deductionsGstFree = calc('customGstFree + fixedGstFree')({
      customGstFree: customDeductionsInfo.gstFreeAmount,
      fixedGstFree: fixedDeductionsInfo.gstFreeAmount
    })

    const deductionsGstExcl = calc('customGstExcl + fixedGstExcl')({
      customGstExcl: customDeductionsInfo.gstExclAmount,
      fixedGstExcl: fixedDeductionsInfo.gstExclAmount
    })

    const deductionsGstIncl = calc('customGstIncl + fixedGstIncl')({
      customGstIncl: customDeductionsInfo.gstInclAmount,
      fixedGstIncl: fixedDeductionsInfo.gstInclAmount
    })

    // 4. 计算折扣金额
    const { discountAmountInclRate, discountAmountExclRate } = calculateDiscountAmount(
      discountData.value,
      systemTotalInclRate,
      systemTotalExclRate,
      taxRate.value
    )

    // 5. 计算最终价格(考虑免税项)
    const { finalPriceInclRate, finalPriceExclRate } = calculateFinalPriceWithTaxConsideration(
      systemTotalExclRate,
      systemTotalInclRate,
      deductionsGstFree,
      discountAmountExclRate,
      discountAmountInclRate
    )

    // 6. 计算成本信息
    const { totalCostInclRate, totalCostExclRate, lineCostsSum } = calculateTotalCostWithTaxConsideration(
      keyProductsTotalCost,
      bosTotalCost,
      acTotalCost,
      deductionsGstFree,
      taxRate.value
    )

    // 7. 计算毛利和毛利率
    const { grossProfitExclRate, grossMarginExclRate } = calculateProfitAndMargin(
      finalPriceExclRate,
      totalCostExclRate
    )

    // 8. 构建基本结果对象
    let result: Partial<Record<string, any>> = {
      // 系统价格信息
      systemTotalExclRate,
      systemTotalInclRate,
      systemTaxRate: systemTaxAmount,

      // 产品分组信息
      kpPrice: keyProductsTotalExclRate,
      bosPrice: bosTotalExclRate,
      acPrice: acTotalExclRate,

      // 扣减信息
      customDeductionPriceInclRate: deductionsGstFree,
      customDeductionRate: 0, // 这里可能需要进一步计算

      // 折扣信息
      discountAmount: discountAmountInclRate,
      discountRatio: discountData.value.discountRatio,
      discountAmouontExclRate: discountAmountExclRate,

      // 成本信息
      totalCost: totalCostInclRate,
      totalCostExclRate,

      // 最终价格信息(非固定价模式)
      finalPrice: finalPriceInclRate,
      finalPriceExclRate,
      grossProfit: grossProfitExclRate,
      grossProfitExclRate,
      grossMargin: grossMarginExclRate,
      grossMarginExclRate
    }

    // 9. 如果是固定价模式，计算额外信息
    if (finalGroup.value.fixedPriceFlag === 1 && finalGroup.value.finalPrice !== null) {
      const fixedPriceCalculationResult = calculateFixedPriceMode(
        finalGroup.value.finalPrice as number,
        deductionsGstFree,
        discountData.value,
        bosTotalExclRate,
        acTotalExclRate,
        taxRate.value,
        totalCostExclRate,
        totalCostInclRate
      )

      // 合并固定价模式的计算结果
      result = {
        ...result,
        fixedSystemPrice: fixedPriceCalculationResult.fixedSystemTotalInclRate,
        fixedSystemTaxRate: fixedPriceCalculationResult.fixedSystemTaxAmount,
        fixedSystemPriceExclRate: fixedPriceCalculationResult.fixedSystemTotalExclRate,
        fixedKpPrice: fixedPriceCalculationResult.fixedKeyProductsTotalExclRate,
        fixedTotalCost: totalCostInclRate,
        fixedTotalCostExclRate: totalCostExclRate,
        fixedGrossMargin: fixedPriceCalculationResult.fixedGrossMarginExclRate,
        fixedGrossMarginExclRate: fixedPriceCalculationResult.fixedGrossMarginExclRate,
        fixedGrossProfit: fixedPriceCalculationResult.fixedGrossProfitInclRate,
        fixedGrossProfitExclRate: fixedPriceCalculationResult.fixedGrossProfitExclRate,
        fixedFinalPrice: fixedPriceCalculationResult.fixedFinalPriceInclRate,
        fixedFinalPriceExclRate: fixedPriceCalculationResult.fixedFinalPriceExclRate
      }
    }

    // 在返回结果前确保所有值都是数字
    for (const key in result) {
      result[key] = ensureNumber(result[key])
    }

    return result as Record<string, any>
  }

  /**
   * 获取账单信息
   * @returns 账单信息
   */
  const getBillInfo = () => {
    const result = calculateBillInfo()
    billInfoValue.value = result
    return result
  }

  /**
   * 设置账单信息
   * @param newValue 新值
   */
  const setBillInfo = (newValue: Partial<Record<BillInfoKeys, number | null>>) => {
    billInfoValue.value = newValue as Record<string, any>
    if (finalGroup.value.fixedPriceFlag) {
      finalGroup.value.finalPrice = newValue.fixedFinalPrice as number
      finalGroup.value.totalCost = newValue.fixedTotalCost as number
      finalGroup.value.grossMargin = newValue.fixedGrossMargin as number
      finalGroup.value.grossProfit = newValue.fixedGrossProfit as number
    } else {
      finalGroup.value.finalPrice = newValue.finalPrice as number
      finalGroup.value.totalCost = newValue.totalCost as number
      finalGroup.value.grossMargin = newValue.grossMargin as number
      finalGroup.value.grossProfit = newValue.grossProfit as number
    }
  }

  /**
   * 设置最终价格组的某个字段值
   * @param key 字段名
   * @param value 值
   */
  const setFinalGroupField = async (key: string, value: number | null) => {
    if (value == null) return

    finalGroup.value[key] = value

    // 给UI更新的时间
    await promiseTimeout(60)

    // 重新计算账单信息
    asyncUpdateFinalGroup()
  }

  /**
   * 异步更新最终价格组
   */
  async function asyncUpdateFinalGroup() {
    await promiseTimeout(100)

    // 重新计算并更新账单信息
    const billInfo = getBillInfo()

    // 一口价模式
    if (finalGroup.value.fixedPriceFlag) {
      finalGroup.value.totalCost = billInfo.fixedTotalCost as number
      finalGroup.value.grossMargin = billInfo.fixedGrossMarginExclRate as number
      finalGroup.value.grossProfit = billInfo.fixedGrossProfitExclRate as number
      finalGroup.value.finalPrice = billInfo.fixedFinalPrice as number
    } else {
      // 非一口价
      finalGroup.value.totalCost = billInfo.totalCost as number
      finalGroup.value.grossMargin = billInfo.grossMarginExclRate as number
      finalGroup.value.grossProfit = billInfo.grossProfitExclRate as number
      finalGroup.value.finalPrice = billInfo.finalPrice as number
    }
  }

  // ==================== 监听变化，触发计算 ====================

  // 集中管理所有会触发价格重新计算的依赖
  const priceCalculationTriggers = [
    () => keyProductList.value,
    () => bosList.value,
    () => acList.value,
    () => customDeductionList.value,
    () => defaultDeductions.value.deduction,
    () => discountData.value,
    () => finalGroup.value.fixedPriceFlag,
    () => finalGroup.value.finalPrice,
    () => taxRate.value
  ]

  // 使用单一watch处理所有计算触发
  watch(
    priceCalculationTriggers,
    () => setBillInfo(getBillInfo()),
    { deep: true, immediate: true }
  )

  return {
    // 基础状态
    taxRate, setTaxRate,
    keyProductList, setKeyProductList,
    bosList, setBosList,
    acList, setAcList,
    customDeductionList, setCustomDeductionList,
    defaultDeductions, setDefaultDeductions, parsedDeductions,
    discountData, setDiscountData, setDiscountItem,

    // 最终价格组
    finalGroup, setFinalGroupField,

    // 账单信息
    billInfo: billInfoValue, getBillInfo, setBillInfo,

    // 计算辅助函数
    computeExclRateItemPrice: calculateProductGroupTotalExclRate, // 兼容旧代码
    computeCustomDeductionListPrice: calculateCustomDeductionsTotalAmount, // 兼容旧代码
    computePriceWithFixedDeductionObject: calculateFixedDeductionsTotalAmount // 兼容旧代码
  }
}

// ==================== 辅助函数 ====================

/**
 * 将扣减项转换为统一格式
 * @param auItem 扣减项数据
 * @returns 统一格式的扣减项
 */
function mapAuDecItem(auItem: Record<string, any>): FixedAuDeductionBaseItem {
  const result: FixedAuDeductionBaseItem = {
    support: 0,
    switch: 0,
    isHideItem: 0,
    isHidePrice: 0,
    gstType: 'gst_free',
    linePrice: 0,
    type: '' as fixedAuBaseItemType,
    labelKey: ''
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

/**
 * 澳洲补贴字段映射关系
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
      { source: 'installationYear', target: 'installationYear' }
    ]
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
      { source: 'installationYear', target: 'installationYear' }
    ]
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
      { source: 'vicTotalPrice', target: 'linePrice' }
    ]
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
      { source: 'vicPvTotalPrice', target: 'linePrice' }
    ]
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
      { source: 'vicBatteryTotalPrice', target: 'linePrice' }
    ]
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
      { source: 'bess1TotalPrice', target: 'linePrice' }
    ]
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
      { source: 'bess2TotalPrice', target: 'linePrice' }
    ]
  }
]

// 添加这个辅助函数
export function ensureNumber(value: any): number {
  if (typeof value === 'string' && value === '-') return 0
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

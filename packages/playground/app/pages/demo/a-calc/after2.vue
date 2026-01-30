<script setup lang="ts">
import { ref, computed } from 'vue'
import useQuoteCalculator from '~/composables/re-quote/useQuoteCalculator'
import { mainList, secList, thirdList, decList, subtractList } from '../quote-calc/mockData'
import { fmt } from 'a-calc'

// 初始化计算器hooks
const calculator = useQuoteCalculator()
const {
  taxRate, setTaxRate,
  keyProductList, setKeyProductList,
  bosList, setBosList,
  acList, setAcList,
  customDeductionList, setCustomDeductionList,
  discountData, setDiscountData, setDiscountItem,
  finalGroup, setFinalGroupField,
  billInfo, getBillInfo,
  computeExclRateItemPrice,
  computeCustomDeductionListPrice
} = calculator

// 设置初始数据
setTaxRate(0.1) // 10%税率
setKeyProductList(mainList)
setBosList(secList)
setAcList(thirdList)

// 设置自定义扣减项
const mappedSubtractList = subtractList.map(item => ({
  ...item,
  isCreating: false
}))
setCustomDeductionList(mappedSubtractList)

// 设置折扣数据
setDiscountItem('discountSwitch', 1)
setDiscountItem('discountType', 1) // 固定金额
setDiscountItem('discountAmount', 500)

// 重新计算获取billInfo
const refreshBillInfo = () => {
  getBillInfo()
}

// 手动触发一次计算
refreshBillInfo()

// 用于控制显示的UI状态
const activeTab = ref('deductions') // deductions, final, fixed, advanced
const isCalculating = ref(false)

// 执行计算并显示加载状态
const runCalculation = async () => {
  isCalculating.value = true
  await nextTick()
  refreshBillInfo()
  await new Promise(resolve => setTimeout(resolve, 300)) // 模拟计算时间
  isCalculating.value = false
}

// 切换一口价模式
const toggleFixedPrice = async (isFixed: boolean) => {
  await setFinalGroupField('fixedPriceFlag', isFixed ? 1 : 0)
  if (isFixed) {
    await setFinalGroupField('finalPrice', 35000)
  }
  await runCalculation()
  if (isFixed) {
    activeTab.value = 'fixed'
  } else {
    activeTab.value = 'final'
  }
}

// 修改折扣类型
const changeDiscountType = async (type: number) => {
  setDiscountItem('discountType', type)
  if (type === 1) { // 固定金额
    setDiscountItem('discountAmount', 500)
    setDiscountItem('discountRatio', null)
  } else { // 百分比
    setDiscountItem('discountAmount', null)
    setDiscountItem('discountRatio', 5) // 5%
  }
  await runCalculation()
}

// 获取折扣类型（添加安全检查）
const getDiscountType = computed(() => {
  return discountData.value?.discountType || 1
})

// 获取折扣金额（添加安全检查）
const getDiscountAmount = computed(() => {
  return discountData.value?.discountAmount || 0
})

// 获取折扣比例（添加安全检查）
const getDiscountRatio = computed(() => {
  return discountData.value?.discountRatio || 0
})

// 扣减项计算代码
const deductionsCalculationCode = computed(() => {
  const deductionsResult = computeCustomDeductionListPrice(mappedSubtractList)
  return `
// 计算扣减项总金额(按GST类型分组)
const deductions = [
  { itemName: '双11平台优惠', gstType: 'free', linePrice: 333 },
  { itemName: '满减大力度折扣', gstType: 'free', linePrice: 444 }
]

function calculateCustomDeductionsTotalAmount(deductions) {
  // 按税类型分组
  const gstFreeItems = deductions.filter(item => item.gstType === 'gst_free' || item.gstType === 'free')
  const exclGstItems = deductions.filter(item => item.gstType === 'excl_gst')
  const inclGstItems = deductions.filter(item =>
    item.gstType !== 'gst_free' && item.gstType !== 'free' && item.gstType !== 'excl_gst'
  )

  // 计算各组合计
  const gstFreeAmount = calcSum({ items: gstFreeItems.map(item => item.linePrice || 0) })
  const gstExclAmount = calcSum({ items: exclGstItems.map(item => item.linePrice || 0) })
  const gstInclAmount = calcSum({ items: inclGstItems.map(item => item.linePrice || 0) })

  return { gstFreeAmount, gstExclAmount, gstInclAmount }
}

// GST免税金额: ${fmt(`${deductionsResult.gstFreeAmount || 0} | ,`)}
// 不含GST金额: ${fmt(`${deductionsResult.gstExclAmount || 0} | ,`)}
// 含GST金额: ${fmt(`${deductionsResult.gstInclAmount || 0} | ,`)}
`
})

// 最终价格计算代码
const finalPriceCalculationCode = computed(() => {
  const bill = billInfo.value || {}
  return `
// 系统总价(含税): ${fmt(`${bill.systemTotalInclRate || 0} | ,`)}
// 扣减项总额: ${fmt(`${bill.customDeductionPriceInclRate || 0} | ,`)}
// 折扣金额(含税): ${fmt(`${bill.discountAmount || 0} | ,`)}

// 最终价格(含税) = 系统总价 - 扣减项 - 折扣
const finalPriceInclRate = ${fmt(`${bill.finalPrice || 0} | ,`)}

// 成本(含税): ${fmt(`${bill.totalCost || 0} | ,`)}
// 毛利(不含税): ${fmt(`${bill.grossProfitExclRate || 0} | ,`)}
// 毛利率(不含税): ${fmt(`${bill.grossMarginExclRate || 0} | %`)}
`
})

// 一口价模式计算代码
const fixedPriceCalculationCode = computed(() => {
  const finalGroupValue = finalGroup.value || {}
  const bill = billInfo.value || {}

  if (finalGroupValue.fixedPriceFlag !== 1) {
    return '// 当前不是一口价模式'
  }

  return `
// 一口价模式 - 固定最终价格: ${fmt(`${finalGroupValue.finalPrice || 0} | ,`)}

// 反向计算系统总价
function calculateFixedPriceMode() {
  // 1. 根据折扣类型计算系统总价(含税)
  let fixedSystemTotalInclRate = 0;
  const fixedFinalPriceInclRate = ${finalGroupValue.finalPrice || 0};
  const deductionsGstFree = ${bill.customDeductionPriceInclRate || 0};

  if (discountData.discountSwitch) {
    if (discountData.discountType === 2) { // 百分比折扣
      // 计算折扣因子: (100 - 折扣百分比) / 100
      const discountFactor = (100 - ${getDiscountRatio.value}) / 100;
      // 反向计算系统总价: (最终价格 + 扣减) / 折扣因子
      fixedSystemTotalInclRate = (fixedFinalPriceInclRate + deductionsGstFree) / discountFactor;
    } else { // 金额折扣
      // 反向计算系统总价: 最终价格 + 扣减 + 折扣金额
      fixedSystemTotalInclRate = fixedFinalPriceInclRate + deductionsGstFree + ${getDiscountAmount.value};
    }
  } else {
    // 无折扣: 最终价格 + 扣减
    fixedSystemTotalInclRate = fixedFinalPriceInclRate + deductionsGstFree;
  }

  return fixedSystemTotalInclRate;
}

// 系统总价(含税): ${fmt(`${bill.fixedSystemPrice || 0} | ,`)}
// 不含税系统总价: ${fmt(`${bill.fixedSystemPriceExclRate || 0} | ,`)}
// 主商品总价(不含税): ${fmt(`${bill.fixedKpPrice || 0} | ,`)}
// 最终价格(含税): ${fmt(`${bill.fixedFinalPrice || 0} | ,`)}
// 毛利(不含税): ${fmt(`${bill.fixedGrossProfitExclRate || 0} | ,`)}
// 毛利率(不含税): ${fmt(`${bill.fixedGrossMarginExclRate || 0} | %`)}
`
})

// 完整计算结果JSON
const completeResultJson = computed(() => {
  const bill = billInfo.value || {}
  const finalGroupValue = finalGroup.value || {}

  // 选择关键字段展示，避免过长
  const result = {
    // 系统价格
    systemTotalInclRate: bill.systemTotalInclRate || 0,
    systemTotalExclRate: bill.systemTotalExclRate || 0,
    systemTaxRate: bill.systemTaxRate || 0,

    // 产品分组
    kpPrice: bill.kpPrice || 0,
    bosPrice: bill.bosPrice || 0,
    acPrice: bill.acPrice || 0,

    // 折扣信息
    discountAmount: bill.discountAmount || 0,
    discountAmouontExclRate: bill.discountAmouontExclRate || 0,

    // 扣减信息
    customDeductionPriceInclRate: bill.customDeductionPriceInclRate || 0,

    // 最终价格(非一口价)
    finalPrice: bill.finalPrice || 0,
    finalPriceExclRate: bill.finalPriceExclRate || 0,
    totalCost: bill.totalCost || 0,
    grossProfit: bill.grossProfit || 0,
    grossMargin: bill.grossMargin || 0
  }

  // 如果是一口价模式，添加一口价相关数据
  if (finalGroupValue.fixedPriceFlag === 1) {
    Object.assign(result, {
      // 一口价相关
      fixedSystemPrice: bill.fixedSystemPrice || 0,
      fixedSystemPriceExclRate: bill.fixedSystemPriceExclRate || 0,
      fixedKpPrice: bill.fixedKpPrice || 0,
      fixedFinalPrice: bill.fixedFinalPrice || 0,
      fixedFinalPriceExclRate: bill.fixedFinalPriceExclRate || 0,
      fixedTotalCost: bill.fixedTotalCost || 0,
      fixedGrossProfit: bill.fixedGrossProfit || 0,
      fixedGrossMargin: bill.fixedGrossMargin || 0
    })
  }

  return JSON.stringify(result, null, 2)
})
</script>

<template>
  <NuxtLayout name="uicomp" layout-class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold mb-6">
      重构版报价计算器验证页面 (高级篇)
    </h1>

    <!-- 功能介绍 -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-document-chart-bar" class="text-primary" />
          <h2 class="text-xl font-bold">
            高级功能验证
          </h2>
        </div>
      </template>

      <div class="space-y-4">
        <p>
          本页面验证报价计算器的高级功能，包括扣减项计算、最终价格计算、一口价模式以及完整结果对比。
        </p>

        <p>
          基础计算功能请查看 <NuxtLink to="/demo/a-calc/after1" class="text-primary underline">第一部分</NuxtLink>。
        </p>
      </div>
    </UCard>

    <!-- 控制面板 -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-cog-6-tooth" class="text-primary" />
          <h2 class="text-xl font-bold">
            测试参数
          </h2>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p class="font-semibold mb-2">
            税率设置:
          </p>
          <UInput
            v-model.number="taxRate"
            type="number"
            :step="0.01"
            :min="0"
            :max="1"
            placeholder="输入税率 (0-1)"
            @change="runCalculation">
            <template #trailing>
              <span class="text-gray-500">{{ fmt(`${taxRate} | %`) }}</span>
            </template>
          </UInput>
        </div>

        <div>
          <p class="font-semibold mb-2">
            折扣设置:
          </p>
          <URadioGroup
            v-model="getDiscountType"
            :options="[
              { label: '固定金额折扣', value: 1 },
              { label: '百分比折扣', value: 2 }
            ]"
            @change="changeDiscountType"
          />

          <div class="mt-3">
            <UInput
              v-if="getDiscountType === 1"
              v-model.number="getDiscountAmount"
              type="number"
              :min="0"
              placeholder="输入折扣金额"
              @change="runCalculation">
              <template #trailing>
                <span class="text-gray-500">元</span>
              </template>
            </UInput>

            <UInput
              v-else
              v-model.number="getDiscountRatio"
              type="number"
              :min="0"
              :max="100"
              placeholder="输入折扣比例"
              @change="runCalculation">
              <template #trailing>
                <span class="text-gray-500">%</span>
              </template>
            </UInput>
          </div>
        </div>

        <div>
          <p class="font-semibold mb-2">
            价格模式:
          </p>
          <div class="flex gap-3">
            <UButton
              :color="(finalGroup.value?.fixedPriceFlag || 0) === 0 ? 'primary' : 'gray'"
              block
              @click="toggleFixedPrice(false)">
              <UIcon name="i-heroicons-calculator" class="mr-1" />
              非一口价模式
            </UButton>

            <UButton
              :color="(finalGroup.value?.fixedPriceFlag || 0) === 1 ? 'primary' : 'gray'"
              block
              @click="toggleFixedPrice(true)">
              <UIcon name="i-heroicons-currency-yen" class="mr-1" />
              一口价模式
            </UButton>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <UButton
            color="primary"
            :loading="isCalculating"
            @click="runCalculation">
            <UIcon name="i-heroicons-arrow-path" class="mr-1" />
            重新计算
          </UButton>

          <UButton
            color="blue"
            to="/demo/a-calc/after1">
            <UIcon name="i-heroicons-arrow-left" class="mr-1" />
            返回第一部分
          </UButton>
        </div>
      </template>
    </UCard>

    <!-- 测试结果切换标签 -->
    <div class="flex gap-2">
      <UButton
        v-for="tab in [
          { id: 'deductions', label: '扣减项计算', icon: 'i-heroicons-minus-circle' },
          { id: 'final', label: '最终价格', icon: 'i-heroicons-banknotes' },
          { id: 'fixed', label: '一口价模式', icon: 'i-heroicons-currency-yen' },
          { id: 'advanced', label: '完整结果', icon: 'i-heroicons-document-chart-bar' }
        ]"
        :key="tab.id"
        :color="activeTab === tab.id ? 'primary' : 'gray'"
        variant="soft"
        @click="activeTab = tab.id">
        <UIcon :name="tab.icon" class="mr-1" /> {{ tab.label }}
      </UButton>
    </div>

    <!-- 扣减项计算 -->
    <UCard v-if="activeTab === 'deductions'">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-minus-circle" class="text-primary" />
          <h2 class="text-lg font-bold">
            扣减项计算
          </h2>
        </div>
      </template>

      <ContentsCodeViewer
        :code="deductionsCalculationCode"
        language="typescript"
        theme="material-theme-palenight"
        title="计算扣减项"
      />

      <template #footer>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">
              GST免税扣减
            </div>
            <div class="text-lg font-bold text-green-600">
              -{{ fmt(`${billInfo.customDeductionPriceInclRate || 0} | ,`) }}
            </div>
          </div>

          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">
              扣减项列表
            </div>
            <div v-for="(item, index) in customDeductionList" :key="index" class="text-sm">
              {{ item.itemName }}: {{ fmt(`${item.linePrice} | ,`) }}
            </div>
          </div>
        </div>
      </template>
    </UCard>

    <!-- 最终价格计算 -->
    <UCard v-if="activeTab === 'final'">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-banknotes" class="text-primary" />
          <h2 class="text-lg font-bold">
            最终价格计算
          </h2>
        </div>
      </template>

      <ContentsCodeViewer
        :code="finalPriceCalculationCode"
        language="typescript"
        theme="material-theme-palenight"
        title="计算最终价格"
      />

      <template #footer>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">
              最终价格(含税)
            </div>
            <div class="text-lg font-bold text-primary">
              {{ fmt(`${billInfo.finalPrice || 0} | ,`) }}
            </div>
          </div>

          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">
              总成本(含税)
            </div>
            <div class="text-lg font-bold text-orange-600">
              {{ fmt(`${billInfo.totalCost || 0} | ,`) }}
            </div>
          </div>

          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">
              毛利(不含税)
            </div>
            <div class="text-lg font-bold text-blue-600">
              {{ fmt(`${billInfo.grossProfitExclRate || 0} | ,`) }}
            </div>
          </div>

          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">
              毛利率(不含税)
            </div>
            <div class="text-lg font-bold text-blue-600">
              {{ fmt(`${billInfo.grossMarginExclRate || 0} | %`) }}
            </div>
          </div>
        </div>
      </template>
    </UCard>

    <!-- 一口价模式验证 -->
    <UCard v-if="activeTab === 'fixed'">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-currency-yen" class="text-primary" />
          <h2 class="text-lg font-bold">
            一口价模式计算
          </h2>
          <UBadge v-if="(finalGroup.value?.fixedPriceFlag || 0) !== 1" color="orange">
            未启用
          </UBadge>
          <UBadge v-else color="green">
            已启用
          </UBadge>
        </div>
      </template>

      <ContentsCodeViewer
        :code="fixedPriceCalculationCode"
        language="typescript"
        theme="material-theme-palenight"
        title="一口价模式计算"
      />

      <template v-if="(finalGroup.value?.fixedPriceFlag || 0) === 1" #footer>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">
              固定最终价格(含税)
            </div>
            <div class="text-lg font-bold text-primary">
              {{ fmt(`${billInfo.fixedFinalPrice || 0} | ,`) }}
            </div>
          </div>

          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">
              系统总价(含税)
            </div>
            <div class="text-lg font-bold text-primary">
              {{ fmt(`${billInfo.fixedSystemPrice || 0} | ,`) }}
            </div>
          </div>

          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">
              主商品总价(不含税)
            </div>
            <div class="text-lg font-bold text-primary">
              {{ fmt(`${billInfo.fixedKpPrice || 0} | ,`) }}
            </div>
          </div>

          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">
              毛利(不含税)
            </div>
            <div class="text-lg font-bold text-blue-600">
              {{ fmt(`${billInfo.fixedGrossProfitExclRate || 0} | ,`) }}
            </div>
          </div>

          <div class="p-3 bg-gray-50 rounded">
            <div class="font-semibold">
              毛利率(不含税)
            </div>
            <div class="text-lg font-bold text-blue-600">
              {{ fmt(`${billInfo.fixedGrossMarginExclRate || 0} | %`) }}
            </div>
          </div>
        </div>
      </template>
    </UCard>

    <!-- 完整结果JSON -->
    <UCard v-if="activeTab === 'advanced'">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-document-chart-bar" class="text-primary" />
          <h2 class="text-lg font-bold">
            完整计算结果
          </h2>
        </div>
      </template>

      <ContentsCodeViewer
        :code="completeResultJson"
        language="json"
        theme="material-theme-palenight"
        title="BillInfo 计算结果"
      />

      <template #footer>
        <p class="text-sm text-gray-600">
          此结果展示了计算器返回的主要字段，包括系统价格、产品分组、折扣信息、最终价格和毛利等。
          您可以对比这些结果与原始业务逻辑计算结果是否一致。
        </p>
      </template>
    </UCard>
  </NuxtLayout>
</template>

<style scoped>
/* 可以添加自定义样式 */
</style>

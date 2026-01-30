<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useQuoteCalculator from '~/composables/re-quote/useQuoteCalculator'
import { mainList, secList, thirdList, subtractList } from '../quote-calc/mockData'
import { fmt } from 'a-calc'

// 调试 mockData 格式
console.log('检查传入数据格式:')
console.log('mainList 示例:', mainList[0])
console.log('secList 示例:', secList[0])
console.log('thirdList 示例:', thirdList[0])

// 初始化计算器hooks
const {
  taxRate, setTaxRate,
  keyProductList, setKeyProductList,
  bosList, setBosList,
  acList, setAcList,
  customDeductionList, setCustomDeductionList,
  discountData, setDiscountItem,
  finalGroup, setFinalGroupField,
  billInfo, getBillInfo,
  defaultDeductions, setDefaultDeductions
} = useQuoteCalculator()

// 创建可编辑的数据引用
const editableMainList = ref([...mainList]) // 使用展开操作符创建新引用
const editableSecList = ref([...secList]) // 使用展开操作符创建新引用
const editableThirdList = ref([...thirdList])
const editableCustomDeductionList = ref([]) // 添加自定义扣减项

// 展示信息状态
const isLoading = ref(false)

// 增强版 refreshCalculation，添加详细日志
const refreshCalculation = () => {
  console.log('===== 开始计算 =====')
  console.log('当前 keyProductList:', keyProductList.value)
  console.log('当前 bosList:', bosList.value)
  console.log('当前 acList:', acList.value)
  console.log('当前 discountData:', discountData.value)
  console.log('当前 customDeductionList:', customDeductionList.value)

  const result = getBillInfo()

  console.log('计算结果:', result)
  return result
}

onMounted(() => {
  console.log('===== 组件挂载，开始初始化数据 =====')

  // 确保所有项目都有 linePrice 和 lineCost 属性，并且是数字类型
  const validMainList = mainList.map(item => ({
    ...item,
    linePrice: Number(item.linePrice || 0),
    lineCost: Number(item.lineCost || 3000) // 确保有成本数据，默认设为3000
  }))

  const validSecList = secList.map(item => ({
    ...item,
    linePrice: Number(item.linePrice || 0),
    lineCost: Number(item.lineCost || 200) // 确保有成本数据，默认设为200
  }))

  const validThirdList = thirdList.map(item => ({
    ...item,
    linePrice: Number(item.linePrice || 0),
    lineCost: Number(item.lineCost || 500) // 确保有成本数据，默认设为500
  }))

  // 使用验证后的数据
  setKeyProductList(validMainList)
  setBosList(validSecList)
  setAcList(validThirdList)

  // 设置折扣
  setDiscountItem('discountSwitch', 1) // 启用折扣
  setDiscountItem('discountType', 1)   // 固定金额折扣
  setDiscountItem('discountAmount', 500) // 折扣金额500

  // 初始化自定义扣减项列表
  setCustomDeductionList([
    // 可以添加示例扣减项
    // {
    //   linePrice: 100,
    //   gstType: 'gst_free',
    //   isCreating: false
    // }
  ])

  // 初始化默认扣减
  setDefaultDeductions({
    id: undefined,
    country: 'AU',
    deduction: '{}',
    taxPrice: null,
    totalPrice: null
  })

  // 手动刷新计算结果
  refreshCalculation()
})

// 增强版 updateMainList
const updateMainList = () => {
  isLoading.value = true
  console.log('===== 更新主商品数据 =====')
  console.log('更新前 keyProductList:', keyProductList.value)
  console.log('要设置的新数据:', editableMainList.value)

  // 确保创建新引用，并且保证有成本数据
  const updatedList = editableMainList.value.map(item => ({
    ...item,
    linePrice: Number(item.linePrice || 0),
    lineCost: Number(item.lineCost || 3000) // 确保有成本数据
  }))

  setKeyProductList(updatedList)

  console.log('设置后 keyProductList:', keyProductList.value)

  // 手动刷新计算
  const result = refreshCalculation()
  console.log('更新后计算结果:', result)

  isLoading.value = false
}

const updateSecList = () => {
  isLoading.value = true

  // 确保有成本数据
  const updatedList = editableSecList.value.map(item => ({
    ...item,
    linePrice: Number(item.linePrice || 0),
    lineCost: Number(item.lineCost || 200)
  }))

  setBosList(updatedList)
  refreshCalculation()
  isLoading.value = false
}

const updateThirdList = () => {
  isLoading.value = true

  // 确保有成本数据
  const updatedList = editableThirdList.value.map(item => ({
    ...item,
    linePrice: Number(item.linePrice || 0),
    lineCost: Number(item.lineCost || 500)
  }))

  setAcList(updatedList)
  refreshCalculation()
  isLoading.value = false
}

// 添加更新自定义扣减项函数
const updateCustomDeductionList = () => {
  isLoading.value = true
  setCustomDeductionList([...editableCustomDeductionList.value])
  refreshCalculation()
  isLoading.value = false
}
</script>

<template>
  <NuxtLayout name="uicomp" layout-class="flex flex-col gap-4">
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">
        报价计算器 MVP版本
      </h1>

      <!-- 左右两列布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧：计算结果 -->
        <div class="space-y-4">
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-bold">
                  计算结果
                </h2>
                <UButton
                  color="primary" size="sm" :loading="isLoading"
                  @click="refreshCalculation">
                  刷新计算
                </UButton>
              </div>
            </template>

            <!-- 产品价格信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  主商品总价(不含税)
                </h3>
                <p class="text-lg font-bold">
                  {{ billInfo.kpPrice?.toLocaleString() || '0' }}
                </p>
              </div>
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  服务项目总价(不含税)
                </h3>
                <p class="text-lg font-bold">
                  {{ billInfo.bosPrice?.toLocaleString() || '0' }}
                </p>
              </div>
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  附加项总价(不含税)
                </h3>
                <p class="text-lg font-bold">
                  {{ billInfo.acPrice?.toLocaleString() || '0' }}
                </p>
              </div>
            </div>

            <!-- 系统价格信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  系统总价(不含税)
                </h3>
                <p class="text-lg font-bold">
                  {{ billInfo.systemTotalExclRate?.toLocaleString() || '0' }}
                </p>
              </div>
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  系统总价(含税)
                </h3>
                <p class="text-lg font-bold">
                  {{ billInfo.systemTotalInclRate?.toLocaleString() || '0' }}
                </p>
              </div>
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  税额
                </h3>
                <p class="text-lg font-bold">
                  {{ billInfo.systemTaxRate?.toLocaleString() || '0' }}
                </p>
              </div>
            </div>

            <!-- 折扣信息 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  折扣金额(含税)
                </h3>
                <p class="text-lg font-bold text-green-600">
                  {{ billInfo.discountAmount?.toLocaleString() || '0' }}
                </p>
              </div>
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  折扣金额(不含税)
                </h3>
                <p class="text-lg font-bold text-green-600">
                  {{ fmt(`${billInfo.discountAmouontExclRate} | `) }}
                </p>
              </div>
            </div>

            <!-- 成本和毛利信息 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  总成本(含税)
                </h3>
                <p class="text-lg font-bold">
                  {{ billInfo.totalCost?.toLocaleString() || '0' }}
                </p>
              </div>
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  总成本(不含税)
                </h3>
                <p class="text-lg font-bold">
                  {{ billInfo.totalCostExclRate?.toLocaleString() || '0' }}
                </p>
              </div>
            </div>

            <!-- 最终价格信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  最终价格(含税)
                </h3>
                <p class="text-xl font-bold text-primary">
                  {{ billInfo.finalPrice?.toLocaleString() || '0' }}
                </p>
              </div>
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  最终价格(不含税)
                </h3>
                <p class="text-xl font-bold text-primary">
                  {{ billInfo.finalPriceExclRate?.toLocaleString() || '0' }}
                </p>
              </div>
              <div>
                <h3 class="font-medium text-sm text-gray-500">
                  毛利率
                </h3>
                <p class="text-xl font-bold" :class="billInfo.grossMargin > 20 ? 'text-green-600' : 'text-red-600'">
                  {{ fmt(`${billInfo.grossMargin || 0} | =2`) }}%
                </p>
              </div>
            </div>
          </UCard>

          <!-- BillInfo 完整数据 -->
          <UCard>
            <template #header>
              <h2 class="text-lg font-medium">
                BillInfo 完整数据
              </h2>
            </template>
            <div class="rounded overflow-hidden">
              <ContentsCodeViewer :code="JSON.stringify(billInfo, null, 2)" language="json" />
            </div>
          </UCard>
        </div>

        <!-- 右侧：数据编辑 -->
        <div class="space-y-4">
          <!-- 主商品数据 -->
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-medium">
                  主商品数据
                </h2>
                <UButton
                  color="primary" size="sm" :loading="isLoading"
                  @click="updateMainList">
                  更新数据
                </UButton>
              </div>
            </template>

            <ContentsJsonEditor
              v-model="editableMainList"
              :height="180"
              title="主商品数据 (keyProductList)"
            />
          </UCard>

          <!-- BOS数据 -->
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-medium">
                  服务项目数据
                </h2>
                <UButton
                  color="primary" size="sm" :loading="isLoading"
                  @click="updateSecList">
                  更新数据
                </UButton>
              </div>
            </template>

            <ContentsJsonEditor
              v-model="editableSecList"
              :height="180"
              title="服务项目数据 (bosList)"
            />
          </UCard>

          <!-- AC数据 -->
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-medium">
                  附加项数据
                </h2>
                <UButton
                  color="primary" size="sm" :loading="isLoading"
                  @click="updateThirdList">
                  更新数据
                </UButton>
              </div>
            </template>

            <ContentsJsonEditor
              v-model="editableThirdList"
              :height="180"
              title="附加项数据 (acList)"
            />
          </UCard>

          <!-- 自定义扣减项数据 -->
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-medium">
                  自定义扣减项
                </h2>
                <UButton
                  color="primary" size="sm" :loading="isLoading"
                  @click="updateCustomDeductionList">
                  更新扣减项
                </UButton>
              </div>
            </template>

            <ContentsJsonEditor
              v-model="editableCustomDeductionList"
              :height="150"
              title="自定义扣减项数据 (customDeductionList)"
            />
          </UCard>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

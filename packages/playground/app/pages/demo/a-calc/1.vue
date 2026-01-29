<script setup lang="ts">
import { calc, calc_wrap } from 'a-calc'

// 只保留业务逻辑重构示例
const businessExample = {
  id: 'business-logic',
  title: '业务逻辑重构',
  description: '使用 a-calc 重构现有的业务计算逻辑',
  code: `import { calc, calc_wrap } from 'a-calc'

/**
 * 原始版本: 使用 $number 链式调用
 */
function computeExclRateItemPrice(list, taxRate = 0.05) {
  let sumLineCost = 0
  let sumLineCostRate = 0
  let sumLineCostWithRate = 0
  let sumLinePrice = 0
  let sumLinePriceRate = 0
  let sumLinePriceWithRate = 0

  const data = {
    linePrice: 0,
    linePriceWithRate: 0,
    lineCost: 0,
    lineCostWithRate: 0,
    lineProfit: 0,
  }

  if (list.length === 0) return data

  // 计算总成本
  sumLineCost = list.reduce((acc, val) => $number(acc).add(val?.lineCost || 0).value, 0)
  sumLineCostRate = CalcInst.computeRate(sumLineCost, taxRate, 'excl_gst')
  sumLineCostWithRate = $number(sumLineCost).add(sumLineCostRate).value

  data.lineCost = sumLineCost
  data.lineCostWithRate = sumLineCostWithRate

  // 计算总价格
  sumLinePrice = list.reduce((acc, val) => $number(acc).add(val?.linePrice || 0).value, 0)
  sumLinePriceRate = CalcInst.computeRate(sumLinePrice, taxRate, 'excl_gst')
  sumLinePriceWithRate = $number(sumLinePrice).add(sumLinePriceRate).value

  data.linePrice = sumLinePrice
  data.linePriceWithRate = sumLinePriceWithRate
  data.lineProfit = $number(sumLinePrice).subtract(sumLineCost).value

  return data
}

/**
 * 使用 a-calc 重构后的版本
 */
function computeExclRateItemPriceWithACalc(list, taxRate = 0.05) {
  const data = {
    linePrice: 0,
    linePriceWithRate: 0,
    lineCost: 0,
    lineCostWithRate: 0,
    lineProfit: 0,
  }

  if (list.length === 0) return data

  // 创建计算函数
  const calcTax = calc_wrap('value * rate')
  const calcWithTax = calc_wrap('value + tax')
  const calcProfit = calc_wrap('price - cost')

  // 计算总成本和税率
  let sumLineCost = 0
  for (const item of list) {
    sumLineCost = Number(calc(\`\${sumLineCost} + \${item?.lineCost || 0}\`))
  }

  // 计算成本税率和含税成本
  const sumLineCostRate = Number(calcTax({ value: sumLineCost, rate: taxRate }))
  const sumLineCostWithRate = Number(calcWithTax({ value: sumLineCost, tax: sumLineCostRate }))

  data.lineCost = sumLineCost
  data.lineCostWithRate = sumLineCostWithRate

  // 计算总价格和税率
  let sumLinePrice = 0
  for (const item of list) {
    sumLinePrice = Number(calc(\`\${sumLinePrice} + \${item?.linePrice || 0}\`))
  }

  // 计算价格税率和含税价格
  const sumLinePriceRate = Number(calcTax({ value: sumLinePrice, rate: taxRate }))
  const sumLinePriceWithRate = Number(calcWithTax({ value: sumLinePrice, tax: sumLinePriceRate }))

  data.linePrice = sumLinePrice
  data.linePriceWithRate = sumLinePriceWithRate

  // 计算利润
  data.lineProfit = Number(calcProfit({ price: sumLinePrice, cost: sumLineCost }))

  return data
}`,
  results: [
    { expression: '示例数据:', result: '商品列表和税率' },
    {
      expression: 'const list = [{ lineCost: 10.1, linePrice: 15.5 }, { lineCost: 5.2, linePrice: 8.9 }]',
      result: '数组包含两个商品，每个有成本和价格'
    },
    {
      expression: 'computeExclRateItemPriceWithACalc(list, 0.05)',
      result: '使用 a-calc 计算得到的结果对象包含:'
    },
    { expression: 'lineCost (总成本):', result: '15.3' },
    { expression: 'lineCostWithRate (含税成本):', result: '16.065' },
    { expression: 'linePrice (总价格):', result: '24.4' },
    { expression: 'linePriceWithRate (含税价格):', result: '25.62' },
    { expression: 'lineProfit (利润):', result: '9.1' }
  ]
}

// 测试函数，用于实际计算并展示结果
function testBusinessLogic() {
  const list = [
    { lineCost: 10.1, linePrice: 15.5 },
    { lineCost: 5.2, linePrice: 8.9 }
  ]
  const taxRate = 0.05

  // 创建计算函数
  const calcTax = calc_wrap('value * rate')
  const calcWithTax = calc_wrap('value + tax')
  const calcProfit = calc_wrap('price - cost')

  // 计算总成本和税率
  let sumLineCost = 0
  for (const item of list) {
    sumLineCost = Number(calc(`${sumLineCost} + ${item?.lineCost || 0}`))
  }

  // 计算成本税率和含税成本
  const sumLineCostRate = Number(calcTax({ value: sumLineCost, rate: taxRate }))
  const sumLineCostWithRate = Number(calcWithTax({ value: sumLineCost, tax: sumLineCostRate }))

  // 计算总价格和税率
  let sumLinePrice = 0
  for (const item of list) {
    sumLinePrice = Number(calc(`${sumLinePrice} + ${item?.linePrice || 0}`))
  }

  // 计算价格税率和含税价格
  const sumLinePriceRate = Number(calcTax({ value: sumLinePrice, rate: taxRate }))
  const sumLinePriceWithRate = Number(calcWithTax({ value: sumLinePrice, tax: sumLinePriceRate }))

  // 计算利润
  const lineProfit = Number(calcProfit({ price: sumLinePrice, cost: sumLineCost }))

  return {
    lineCost: sumLineCost,
    lineCostWithRate: sumLineCostWithRate,
    linePrice: sumLinePrice,
    linePriceWithRate: sumLinePriceWithRate,
    lineProfit: lineProfit
  }
}

// 执行测试，获取实际计算结果
const businessResult = testBusinessLogic()
</script>

<template>
  <NuxtLayout name="blank">
    <UContainer class="py-6">
      <UPageHeader
        title="a-calc 业务逻辑重构演示"
        description="使用 a-calc 重构现有的业务计算逻辑">
        <template #icon>
          <UIcon name="i-lucide-calculator" class="w-8 h-8" />
        </template>
        <template #right>
          <UButton
            color="gray"
            variant="ghost"
            to="/demo/a-calc"
            icon="i-lucide-arrow-left"
            label="返回基础示例"
          />
        </template>
      </UPageHeader>

      <!-- 功能介绍 -->
      <UCard class="my-6">
        <div class="space-y-4">
          <p>
            <strong>业务逻辑重构</strong> - 本示例展示如何使用 a-calc 库重构现有的业务计算逻辑：
          </p>
          <ul class="list-disc list-inside space-y-1">
            <li>将 <code>$number</code> 链式调用方法转换为 a-calc 表达式</li>
            <li>使用 <code>calc_wrap</code> 创建可复用的计算函数</li>
            <li>确保计算精度和一致性</li>
            <li>提高代码可读性和可维护性</li>
          </ul>
        </div>
      </UCard>

      <!-- 业务逻辑重构示例 -->
      <div class="my-8">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-code" class="text-primary" />
              <h2 class="text-lg font-medium">
                {{ businessExample.title }}
              </h2>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              {{ businessExample.description }}
            </p>
          </template>

          <!-- 代码示例和结果 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 左侧：代码示例 -->
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                代码示例
              </p>
              <ContentsCodeViewer
                :code="businessExample.code"
                language="javascript"
              />
            </div>

            <!-- 右侧：计算结果 -->
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                计算结果
              </p>
              <UCard class="bg-gray-50 dark:bg-gray-800">
                <div class="space-y-4">
                  <div v-for="(item, index) in businessExample.results" :key="index" class="pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-mono mb-1">
                      {{ item.expression }}
                    </div>
                    <div class="font-medium font-mono text-primary-600 dark:text-primary-400">
                      {{ typeof item.result === 'string' ? `"${item.result}"` : item.result }}
                    </div>
                  </div>
                </div>
              </UCard>

              <!-- 实际计算结果 -->
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 my-2 mt-4">
                实际计算结果
              </p>
              <UCard class="bg-gray-50 dark:bg-gray-800">
                <div class="space-y-2">
                  <div v-for="(value, key) in businessResult" :key="key" class="grid grid-cols-2">
                    <span class="font-mono text-gray-500">{{ key }}:</span>
                    <span class="font-mono font-medium">{{ value }}</span>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </NuxtLayout>
</template>

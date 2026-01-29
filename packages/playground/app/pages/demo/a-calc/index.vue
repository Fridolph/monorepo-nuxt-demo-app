<script setup lang="ts">
import { calc_wrap, calc } from 'a-calc'

// 定义代码示例和预先计算的结果
const examples = [
  {
    id: 'basic',
    title: '基础计算',
    description: '解决 JavaScript 浮点数精度问题',
    code: `import { calc } from 'a-calc'

// 基础计算 - 解决浮点数精度问题
calc('0.1 + 0.2') // "0.3"

// 普通 JavaScript 计算会导致精度问题
0.1 + 0.2 // 0.30000000000000004

// 复杂表达式
calc('0.1 + 0.2 * 0.3 / 0.4 * (0.5 + 0.6)') // "0.265"

// 科学计数法
calc('-2e2 + 3e+2') // "100"`,
    results: [
      { expression: 'calc(\'0.1 + 0.2\')', result: calc('0.1 + 0.2') },
      { expression: 'JavaScript: 0.1 + 0.2', result: 0.1 + 0.2 },
      { expression: 'calc(\'0.1 + 0.2 * 0.3 / 0.4 * (0.5 + 0.6)\')', result: calc('0.1 + 0.2 * 0.3 / 0.4 * (0.5 + 0.6)') },
      { expression: 'calc(\'-2e2 + 3e+2\')', result: calc('-2e2 + 3e+2') }
    ]
  },
  {
    id: 'formatting',
    title: '格式化功能',
    description: 'a-calc 提供多种格式化选项',
    code: `import { calc } from 'a-calc'

// 保留2位小数
calc('0.1 + 0.2 | =2') // "0.30"

// 千分位分隔
calc('1000000 + 2000000 | ,') // "3,000,000"

// 限制小数位数
calc('0.11111 + 0.11111 | <=4') // "0.2222"

// 带正号
calc('1 + 1 | +') // "+2"

// 百分比
calc('0.5 + 0.25 | %') // "75%"

// 科学计数法
calc('1000000 + 2000000 | !e') // "3e+6"

// 组合格式化(正号+千分位+2位小数)
calc('10000000 + 100000000 | +,=2') // "+110,000,000.00"`,
    results: [
      { expression: 'calc(\'0.1 + 0.2 | =2\')', result: calc('0.1 + 0.2 | =2') },
      { expression: 'calc(\'1000000 + 2000000 | ,\')', result: calc('1000000 + 2000000 | ,') },
      { expression: 'calc(\'0.11111 + 0.11111 | <=4\')', result: calc('0.11111 + 0.11111 | <=4') },
      { expression: 'calc(\'1 + 1 | +\')', result: calc('1 + 1 | +') },
      { expression: 'calc(\'0.5 + 0.25 | %\')', result: calc('0.5 + 0.25 | %') },
      { expression: 'calc(\'1000000 + 2000000 | !e\')', result: calc('1000000 + 2000000 | !e') },
      { expression: 'calc(\'10000000 + 100000000 | +,=2\')', result: calc('10000000 + 100000000 | +,=2') }
    ]
  },
  {
    id: 'variables',
    title: '变量计算',
    description: '使用变量进行计算',
    code: `import { calc } from 'a-calc'

// 定义变量
const state = { a: 1, b: 2, c: 3 }

// 使用变量计算
calc('(a + b) * c', state) // "9"

// 二次封装用法
const fn = calc('(a + b) * c')
fn(state) // "9"

// 嵌套对象变量
const data = {
  user: { score: 85 },
  bonus: 15
}
calc('user.score + bonus', data) // "100"`,
    results: [
      { expression: 'calc(\'(a + b) * c\', { a: 1, b: 2, c: 3 })', result: calc_wrap('(a + b) * c', { a: 1, b: 2, c: 3 }) },
      {
        expression: 'const fn = calc(\'(a + b) * c\'); fn({ a: 1, b: 2, c: 3 })',
        result: calc_wrap('(a + b) * c')({ a: 1, b: 2, c: 3 })
      },
      {
        expression: 'calc(\'user.score + bonus\', { user: { score: 85 }, bonus: 15 })',
        result: calc_wrap('user.score + bonus', { user: { score: 85 }, bonus: 15 })
      }
    ]
  },
  {
    id: 'rounding',
    title: '舍入规则',
    description: '支持多种舍入策略',
    code: `import { calc } from 'a-calc'

// 去尾（默认）
calc('0.11 + 0.22 | =1 ~-') // "0.3"

// 进一
calc('0.11 + 0.22 | =1 ~+') // "0.4"

// 四舍五入
calc('0.55 | =1 ~5') // "0.6"
calc('0.44 | =1 ~5') // "0.4"

// 四舍六入（银行家舍入法）
calc('0.65 | =1 ~6') // "0.6"
calc('0.75 | =1 ~6') // "0.8"`,
    results: [
      { expression: 'calc(\'0.11 + 0.22 | =1 ~-\')', result: calc('0.11 + 0.22 | =1 ~-') },
      { expression: 'calc(\'0.11 + 0.22 | =1 ~+\')', result: calc('0.11 + 0.22 | =1 ~+') },
      { expression: 'calc(\'0.55 | =1 ~5\')', result: calc('0.55 | =1 ~5') },
      { expression: 'calc(\'0.44 | =1 ~5\')', result: calc('0.44 | =1 ~5') },
      { expression: 'calc(\'0.65 | =1 ~6\')', result: calc('0.65 | =1 ~6') },
      { expression: 'calc(\'0.75 | =1 ~6\')', result: calc('0.75 | =1 ~6') }
    ]
  }
]
</script>

<template>
  <NuxtLayout name="blank">
    <UContainer class="py-6">
      <UPageHeader
        title="a-calc 演示"
        description="高性能、易用的 JavaScript 精确计算和格式化库">
        <template #icon>
          <UIcon name="i-lucide-calculator" class="w-8 h-8" />
        </template>
        <template #right>
          <UButton
            color="gray"
            variant="ghost"
            to="https://www.npmjs.com/package/a-calc"
            target="_blank"
            icon="i-lucide-external-link"
            label="NPM文档"
          />
        </template>
      </UPageHeader>

      <!-- 功能介绍 -->
      <UCard class="my-6">
        <div class="space-y-4">
          <p>
            <strong>a-calc</strong> 是一个高性能、易用的 JavaScript 精确计算和格式化库，主要解决以下问题：
          </p>
          <ul class="list-disc list-inside space-y-1">
            <li>JavaScript 浮点数计算精度问题（如 <code>0.1 + 0.2 = 0.30000000000000004</code>）</li>
            <li>支持复杂数学表达式计算</li>
            <li>提供丰富的数字格式化功能</li>
            <li>支持变量计算和二次封装</li>
            <li>自定义舍入规则</li>
          </ul>
        </div>
      </UCard>

      <!-- 基础计算示例 -->
      <div v-for="example in examples" :key="example.id" class="my-8">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-code" class="text-primary" />
              <h2 class="text-lg font-medium">
                {{ example.title }}
              </h2>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              {{ example.description }}
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
                :code="example.code"
                language="javascript"
              />
            </div>

            <!-- 右侧：计算结果 -->
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                计算结果
              </p>
              <UCard
                class="bg-gray-50 dark:bg-gray-800">
                <div class="space-y-4">
                  <div v-for="(item, index) in example.results" :key="index" class="pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-mono mb-1">
                      {{ item.expression }}
                    </div>
                    <div class="font-medium font-mono text-primary-600 dark:text-primary-400">
                      {{ typeof item.result === 'string' ? `"${item.result}"` : item.result }}
                    </div>
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

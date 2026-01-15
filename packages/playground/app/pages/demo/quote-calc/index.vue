<script setup lang="ts">
// import { mainList, secList, thirdList, decList, subtractList } from './mockData'

const initialData = ref([
  {
    id: 1,
    name: '商品一',
    price: 100,
    inStock: true,
    tags: ['热门', '新品']
  },
  {
    id: 2,
    name: '商品二',
    price: 200,
    inStock: false,
    tags: ['热门', '促销']
  },
  {
    id: 3,
    name: '商品三',
    price: 150,
    inStock: true,
    tags: ['新品']
  }
])

// 错误状态
const hasError = ref(false)
const handleError = (error: Error | null) => {
  hasError.value = !!error
}
</script>

<template>
  <NuxtLayout name="uicomp" layout-class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold mb-6">
      JSON编辑器示例
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 编辑器区域 -->
      <div>
        <h2 class="text-xl font-semibold mb-4">
          编辑JSON数据
        </h2>
        <JsonEditor
          v-model="initialData"
          title="商品数据"
          description="编辑商品列表数据，格式必须是有效的JSON数组"
          height="400px"
          @error="handleError"
        />
      </div>

      <!-- 预览区域 -->
      <div>
        <h2 class="text-xl font-semibold mb-4">
          数据预览
        </h2>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">
                商品列表
              </h3>
              <UBadge v-if="hasError" color="red">
                数据格式错误
              </UBadge>
            </div>
          </template>

          <div v-if="!hasError">
            <UTable :columns="tableColumns" :rows="initialData">
              <template #inStock-data="{ row }">
                <UBadge :color="row.inStock ? 'green' : 'red'">
                  {{ row.inStock ? '有货' : '缺货' }}
                </UBadge>
              </template>

              <template #tags-data="{ row }">
                <div class="flex gap-1">
                  <UBadge
                    v-for="tag in row.tags" :key="tag" color="blue"
                    variant="subtle">
                    {{ tag }}
                  </UBadge>
                </div>
              </template>
            </UTable>
          </div>

          <div v-else class="p-4 text-center text-red-500">
            <UIcon name="i-lucide-alert-triangle" class="text-2xl" />
            <p class="mt-2">
              请修复JSON格式错误后查看数据
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </nuxtlayout>
</template>

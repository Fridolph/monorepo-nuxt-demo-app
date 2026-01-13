<script setup lang="ts">
import { withInteractionLog } from '~/composables/global/useInteractionLog'

const props = defineProps({
  /**
   * 组件标题
   */
  title: {
    type: String,
    default: '组件预览'
  },
  /**
   * 组件描述
   */
  description: {
    type: String,
    default: ''
  },
  /**
   * 代码示例
   */
  code: {
    type: String,
    required: true
  },
  /**
   * 是否默认展开代码
   */
  defaultExpanded: {
    type: Boolean,
    default: false
  }
})

// 控制代码示例是否可见
const isCodeVisible = ref(props.defaultExpanded)

// 切换代码可见性
const toggleCode = withInteractionLog(() => {
  isCodeVisible.value = !isCodeVisible.value
}, {
  title: () => `${isCodeVisible.value ? '隐藏' : '显示'}代码示例`,
  description: () => `点击${isCodeVisible.value ? '隐藏' : '显示'}代码示例面板`,
  icon: 'i-lucide-code'
})

// 复制代码到剪贴板
const copyCode = withInteractionLog(async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    showCopiedToast()
  } catch (err) {
    console.error('复制失败:', err)
  }
}, {
  title: '复制代码',
  description: '将代码示例复制到剪贴板',
  icon: 'i-lucide-copy'
})

// 显示复制成功的提示
const toast = useToast()
const showCopiedToast = () => {
  toast.add({
    title: '复制成功',
    description: '代码已复制到剪贴板',
    icon: 'i-lucide-check',
    color: 'primary'
  })
}
</script>

<template>
  <div class="component-demo space-y-4">
    <!-- 标题和描述 -->
    <div v-if="title || description">
      <h3 v-if="title" class="text-lg font-medium">{{ title }}</h3>
      <p v-if="description" class="text-gray-500 dark:text-gray-400 mt-1">{{ description }}</p>
    </div>

    <!-- 预览区域 -->
    <div class="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="preview-area">
        <slot></slot>
      </div>
    </div>

    <!-- 代码示例面板 -->
    <div class="code-panel bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
      <!-- 代码面板头部 -->
      <div
        class="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        @click="toggleCode"
      >
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-code" class="text-gray-500" />
          <span class="text-sm font-medium">代码示例</span>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            v-if="isCodeVisible"
            color="gray"
            variant="ghost"
            icon="i-lucide-copy"
            size="xs"
            @click.stop="copyCode"
          />
          <UIcon
            :name="isCodeVisible ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            class="text-gray-500"
          />
        </div>
      </div>

      <!-- 代码内容 -->
      <div v-show="isCodeVisible" class="p-4 border-t border-gray-200 dark:border-gray-700">
        <UCard class="bg-gray-900 dark:bg-gray-950">
          <pre class="text-xs text-white p-2 overflow-x-auto"><code>{{ code }}</code></pre>
        </UCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.component-demo {
  @apply w-full;
}

.preview-area {
  @apply min-h-[100px];
}
</style>

<script setup lang="ts">
import { withInteractionLog } from '~/composables/global/useInteractionLog'

const props = defineProps({
  /**
   * 组件标题
   */
  title: {
    type: String,
    default: ''
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
  defaultOpen: {
    type: Boolean,
    default: false
  },
  /**
   * 预览区域的样式
   */
  previewClass: {
    type: String,
    default: ''
  },
  /**
   * 是否显示复制按钮
   */
  showCopy: {
    type: Boolean,
    default: true
  },
  /**
   * 代码语言
   */
  language: {
    type: String,
    default: 'html'
  }
})

// 控制代码示例是否可见
const isOpen = ref(props.defaultOpen)

// 切换代码可见性
const toggleCode = withInteractionLog(() => {
  isOpen.value = !isOpen.value
}, {
  title: () => `${isOpen.value ? '展开' : '收起'}代码示例`,
  description: () => `点击${isOpen.value ? '展开' : '收起'}代码示例面板`,
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
    color: 'success',
    duration: 2000
  })
}
</script>

<template>
  <div class="show-coder mb-8 border-1 border-gray-200 rounded overflow-hidden">
    <header v-if="title || description" class="mb-3 p-4">
      <h3 v-if="title" class="text-lg font-medium mb-1">
        {{ title }}
      </h3>
      <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400">
        {{ description }}
      </p>
    </header>
    <!-- 预览区域 -->
    <slot></slot>

    <UCollapsible v-model:open="isOpen" class="code-collapsible">
      <div class="w-full h-8 bg-gray-100 flex w-full items-center gap-2">
        <UIcon name="i-lucide-code" class="text-gray-500" />
        <span class="text-sm font-medium">代码示例</span>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          v-if="showCopy && isOpen"
          color="info"
          variant="ghost"
          icon="i-lucide-copy"
          size="xs"
          aria-label="复制代码"
          @click.stop="copyCode"
        />
        <UIcon
          :name="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          class="text-gray-500 transition-transform"
        />
        <p><UIcon name="mdi:menu-down-outline" class="size-4" /></p>
      </div>
      <template #content>
        <!-- 折叠内容：代码示例区域 -->
        <div class="bg-gray-900 dark:bg-gray-950 overflow-hidden">
          <pre class="text-xs text-white p-2 overflow-x-auto"><code>{{ code }}</code></pre>
        </div>
      </template>
    </UCollapsible>
  </div>
</template>

<style scoped lang="postcss">
.show-coder {
  @apply w-full;
}

.preview-area {
  @apply min-h-[100px];
}

.code-collapsible :deep(.collapse-content) {
  @apply p-0;
}

.code-collapsible :deep(.collapse-content-inner) {
  @apply p-0;
}
</style>

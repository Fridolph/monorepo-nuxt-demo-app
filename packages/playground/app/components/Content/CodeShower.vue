<script setup lang="ts">
import { withInteractionLog } from '~/composables/useInteractionLog'
import { useCodeHighlighter } from '~/composables/content/useCodeHighlighter'
// 使用 shiki 的正确导入方式
import { createHighlighter } from 'shiki'

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
   * 代码语言
   */
  language: {
    type: String,
    default: 'html'
  },
  /**
   * 是否默认展开代码
   */
  defaultOpen: {
    type: Boolean,
    default: false
  },
  /**
   * 预览区域的自定义类名
   */
  previewClass: {
    type: String,
    default: ''
  }
})

// 获取颜色模式
const colorMode = useColorMode()

// 根据颜色模式选择主题
const currentTheme = computed(() => {
  // 亮色模式使用 github-light (清晰易读的亮色主题)
  // 暗色模式使用 github-dark (比 monokai 更现代、对比度更好的暗色主题)
  return colorMode.value === 'light' ? 'github-light' : 'github-dark'
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
const toast = useToast()
const { onCopy, isSupported } = useCopyToClipboard()
const copyCode = async () => {
  if (!isSupported.value) {
    toast.add({
      title: '复制失败',
      description: '当前环境不支持复制功能',
      icon: 'i-lucide-alert-triangle',
      color: 'warning',
      duration: 2000
    })
  }
  const isSucc = await onCopy(props.code)
  if (isSucc) {
    toast.add({
      title: '复制成功',
      description: '代码已复制到剪贴板',
      icon: 'i-lucide-check',
      color: 'success',
      duration: 2000
    })
  }
}

// 使用 shiki 高亮代码
const highlightedCode = ref('')
const isHighlighterLoaded = ref(false)
let highlighter: any = null

// 初始化 shiki 并高亮代码
onMounted(async () => {
  try {
    // 同时加载亮色和暗色主题，以便切换
    highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: [props.language]
    })

    updateHighlightedCode()
    isHighlighterLoaded.value = true
  } catch (error) {
    console.error('Shiki 初始化失败:', error)
  }
})

// 更新高亮代码的方法
const updateHighlightedCode = () => {
  if (highlighter) {
    highlightedCode.value = highlighter.codeToHtml(props.code, {
      lang: props.language,
      theme: currentTheme.value
    })
  }
}

// 监听代码和语言变化，重新高亮
watch([() => props.code, () => props.language], () => {
  if (isHighlighterLoaded.value) {
    updateHighlightedCode()
  }
})

// 监听主题变化，重新高亮
watch(() => currentTheme.value, () => {
  if (isHighlighterLoaded.value) {
    updateHighlightedCode()
  }
})
</script>

<template>
  <div class="content-code-demo w-full flex flex-col gap-2 dark:border-gray-700">
    <!-- 标题和描述 -->
    <div v-if="title || description" class=" ">
      <h3 v-if="title" class="text-lg font-medium">
        {{ title }}
      </h3>
      <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ description }}
      </p>
    </div>

    <!-- 预览区域 -->
    <div
      class="demo-wrapper min-h-[100px] bg-white dark:bg-gray-900"
      :class="previewClass">
      <slot />
    </div>

    <!-- 代码区域 -->
    <div class="code-wrapper">
      <!-- 代码标题栏 -->
      <div
        class="code-header flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 cursor-pointer"
        @click="toggleCode">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-code" class="text-gray-500" />
          <span class="text-sm font-medium">{{ language.toUpperCase() }}</span>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            v-if="isOpen"
            color="primary"
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
        </div>
      </div>

      <!-- 代码内容 - 使用 Shiki 替换原来的 ContentRenderer -->
      <div v-show="isOpen" class="code-content bg-gray-100">
        <div v-if="!isHighlighterLoaded" class="p-4 text-center text-gray-500">
          <UIcon name="i-lucide-loader" class="animate-spin mr-2" />
          代码高亮加载中...
        </div>
        <div else class="shiki-wrapper bg-gray-50 p-2" v-html="highlightedCode" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Shiki 样式调整 */
::deep(.shiki-wrapper) {
  padding: 0;
  margin: 0;

  /* 调整 shiki 生成的代码样式 */
  pre {
    margin: 0 !important;
    border-radius: 0 !important;
    border: none !important;
    font-size: 0.825rem;
  }
  code {
    width: 100%;
    font-size: 14px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
}

:deep(.shiki) {
  background-color: transparent !important;
}
</style>

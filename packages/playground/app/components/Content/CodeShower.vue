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

// 构建用于 ContentRendererMarkdown 的 markdown 对象
const markdownContent = computed(() => {
  return {
    body: {
      type: 'root',
      children: [
        {
          type: 'element',
          tag: 'pre',
          props: {
            class: `language-${props.language}`
          },
          children: [
            {
              type: 'element',
              tag: 'code',
              props: {
                class: `language-${props.language}`
              },
              children: [
                { type: 'text', value: props.code }
              ]
            }
          ]
        }
      ]
    }
  }
})
</script>

<template>
  <div class="content-code-demo w-full my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <!-- 标题和描述 -->
    <div v-if="title || description" class="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 v-if="title" class="text-lg font-medium">{{ title }}</h3>
      <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ description }}</p>
    </div>

    <!-- 预览区域 -->
    <div
      class="demo-wrapper min-h-[100px] bg-white dark:bg-gray-900 p-6"
      :class="previewClass"
    >
      <slot></slot>
    </div>

    <!-- 代码区域 -->
    <div class="code-wrapper">
      <!-- 代码标题栏 -->
      <div
        class="code-header flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 cursor-pointer"
        @click="toggleCode"
      >
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
            @click.stop="copyCode"
            aria-label="复制代码"
          />
          <UIcon
            :name="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            class="text-gray-500 transition-transform"
          />
        </div>
      </div>

      <!-- 代码内容 -->
      <div v-show="isOpen" class="code-content">
        <ContentRenderer :value="markdownContent">
          <ContentRendererMarkdown :value="markdownContent" />
        </ContentRenderer>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 覆盖 ContentRendererMarkdown 的默认样式 */
::deep(.code-content) {
  /* pre {
    margin: 0;
    border-radius: 0;
    border: none;
  } */
  code {
    font-size: 0.825rem;
    width: 100%;
  }
}
</style>


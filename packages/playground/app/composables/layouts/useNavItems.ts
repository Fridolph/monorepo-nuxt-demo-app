export default function useNavItems() {
  const items = ref([
    {
      label: 'UI Component',
      icon: 'i-lucide-layers', // Nuxt UI默认支持的Lucide图标
      description: 'Nuxt UI Component',
      children: [
      // 子项1：Element
        {
          label: 'Element',
          icon: 'i-lucide-box',
          description: '基础UI元素',
          to: '/nuxt-ui/element'
        },
        // 子项2：Form
        {
          label: 'Forms',
          icon: 'i-lucide-file-text',
          description: '表单组件',
          to: '/nuxt-ui/forms'
        },
        // 子项3：Data
        {
          label: 'Data',
          icon: 'i-lucide-table-2',
          description: '数据展示组件',
          to: '/nuxt-ui/data'
        },
        // 子项4：Navigation
        {
          label: 'Navigation',
          icon: 'i-lucide-navigation',
          description: '导航组件',
          to: '/nuxt-ui/navigation'
        },
        // 子项5：Overlay
        {
          label: 'Overlay',
          icon: 'i-lucide-square-pen',
          description: '弹窗/覆盖层组件',
          to: '/nuxt-ui/overlay'
        },
        // 子项6：Page
        {
          label: 'Page',
          icon: 'i-lucide-file',
          description: '页面布局组件',
          to: '/nuxt-ui/page'
        },
        // 子项7：Dashboard
        {
          label: 'Dashboard',
          icon: 'mdi:monitor-dashboard',
          description: '仪表盘组件',
          to: '/nuxt-ui/dashboard'
        },
        // 子项8：Chat
        {
          label: 'AI Chat',
          icon: 'i-lucide-message-square',
          description: 'AI聊天/消息组件',
          to: '/nuxt-ui/ai-chat'
        },
        // 子项9：Editor
        {
          label: 'Editor',
          icon: 'i-lucide-pencil-line',
          description: '富文本编辑器',
          to: '/nuxt-ui/editor'
        },
        // 子项10：Content
        {
          label: 'Content',
          icon: 'i-lucide-book-open',
          description: '内容展示组件',
          to: '/nuxt-ui/content'
        },
        // 子项11：Color
        {
          label: 'Color Mode',
          icon: 'i-lucide-palette',
          description: '颜色系统',
          to: '/nuxt-ui/color'
        },
        // 子项12：i18n
        {
          label: 'i18n',
          icon: 'mdi:sort-alphabetical-ascending-variant',
          description: '国际化组件',
          to: '/nuxt-ui/i18n'
        }
      ]
    },
    {
      label: 'Demo',
      icon: 'i-lucide-layers',
      description: '组合式 Demo',
      to: '/demo'
    },
    {
      label: 'Idea',
      icon: 'mdi:head-lightbulb-outline',
      description: '不负责的脑洞，慎入',
      to: '/idea'
    }
  ])

  return {
    items
  }
}

/**
 * 导航项组合式函数
 * 提供应用导航菜单结构
 */

// 定义导航项类型
export interface NavChildItem {
  label: string
  icon: string
  description: string
  to: string
  disabled?: boolean
  badge?: string | number
}

export interface NavParentItem {
  label: string
  icon: string
  description: string
  to?: string
  children?: NavChildItem[]
  disabled?: boolean
  badge?: string | number
}

export type NavItem = NavParentItem

/**
 * UI组件子菜单项配置
 */
const UI_COMPONENT_CHILDREN: NavChildItem[] = [
  {
    label: 'Element',
    icon: 'i-lucide-box',
    description: '基础UI元素',
    to: '/nuxt-ui/element'
  },
  {
    label: 'Forms',
    icon: 'i-lucide-file-text',
    description: '表单组件',
    to: '/nuxt-ui/forms'
  },
  {
    label: 'Data',
    icon: 'i-lucide-table-2',
    description: '数据展示组件',
    to: '/nuxt-ui/data'
  },
  {
    label: 'Navigation',
    icon: 'i-lucide-navigation',
    description: '导航组件',
    to: '/nuxt-ui/navigation'
  },
  {
    label: 'Overlay',
    icon: 'i-lucide-square-pen',
    description: '弹窗/覆盖层组件',
    to: '/nuxt-ui/overlay'
  },
  {
    label: 'Page',
    icon: 'i-lucide-file',
    description: '页面布局组件',
    to: '/nuxt-ui/page'
  },
  {
    label: 'Dashboard',
    icon: 'mdi:monitor-dashboard',
    description: '仪表盘组件',
    to: '/nuxt-ui/dashboard'
  },
  {
    label: 'AI Chat',
    icon: 'i-lucide-message-square',
    description: 'AI聊天/消息组件',
    to: '/nuxt-ui/ai-chat'
  },
  {
    label: 'Editor',
    icon: 'i-lucide-pencil-line',
    description: '富文本编辑器',
    to: '/nuxt-ui/editor'
  },
  {
    label: 'Content',
    icon: 'i-lucide-book-open',
    description: '内容展示组件',
    to: '/nuxt-ui/content'
  },
  {
    label: 'Color Mode',
    icon: 'i-lucide-palette',
    description: '颜色系统',
    to: '/nuxt-ui/color'
  },
  {
    label: 'i18n',
    icon: 'mdi:sort-alphabetical-ascending-variant',
    description: '国际化组件',
    to: '/nuxt-ui/i18n'
  }
]

/**
 * 导航菜单项组合式函数
 * @returns 导航菜单项数据
 */
export default function useNavItems() {
  // 使用 shallowRef 提高性能，因为菜单项是复杂对象且不需要深层响应性
  const items = shallowRef<NavItem[]>([
    {
      label: 'UI Component',
      icon: 'i-lucide-layers',
      description: 'Nuxt UI Component',
      children: UI_COMPONENT_CHILDREN
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

  /**
   * 获取特定路径的导航项
   * @param path 路径
   * @returns 匹配的导航项或undefined
   */
  const getNavItemByPath = (path: string): NavItem | NavChildItem | undefined => {
    // 检查顶级导航项
    const topLevelItem = items.value.find(item => item.to === path)
    if (topLevelItem) return topLevelItem

    // 检查子导航项
    for (const item of items.value) {
      if (item.children) {
        const childItem = item.children.find(child => child.to === path)
        if (childItem) return childItem
      }
    }

    return undefined
  }

  /**
   * 动态添加新的导航项
   * @param newItem 新的导航项
   * @param index 可选的插入位置索引
   */
  const addNavItem = (newItem: NavItem, index?: number): void => {
    const newItems = [...items.value]

    if (index !== undefined && index >= 0 && index <= newItems.length) {
      newItems.splice(index, 0, newItem)
    } else {
      newItems.push(newItem)
    }

    items.value = newItems
  }

  /**
   * 更新现有导航项
   * @param label 要更新的导航项标签
   * @param updates 更新的属性
   */
  const updateNavItem = (label: string, updates: Partial<NavItem>): void => {
    const newItems = items.value.map((item) => {
      if (item.label === label) {
        return { ...item, ...updates }
      }
      return item
    })

    items.value = newItems
  }

  return {
    items,
    getNavItemByPath,
    addNavItem,
    updateNavItem
  }
}

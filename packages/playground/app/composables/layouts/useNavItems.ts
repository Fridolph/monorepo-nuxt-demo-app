/**
 * 导航项组合式函数
 * 提供应用导航菜单结构
 */

// 定义导航项类型
export interface NavItem {
  label: string
  icon: string
  description: string
  to: string
  disabled?: boolean
  badge?: string | number
  isNew?: boolean
  children?: NavItem[]
}

// 获取BaseItem类型，用于基础导航项
type BaseItem = {
  label: string
  icon: string
  description: string
  to: string
  disabled?: boolean
  badge?: string | number
  isNew?: boolean
  children?: BaseItem[]
}

/**
 * 导航菜单项组合式函数
 * @returns 导航菜单项数据
 */
export default function useNavItems() {
  const { t } = useI18n()

  // 基础导航项数据源
  const baseItems = ref([
    {
      label: 'nav.nuxt_comp',
      icon: 'i-lucide-layers',
      description: 'nav.nuxt_comp_desc',
      to: '/nuxt-ui'
      // children: UI_COMPONENT_CHILDREN
    },
    {
      label: 'nav.demo',
      icon: 'i-lucide-layers',
      description: 'nav.demo_desc',
      to: '/demo'
    },
    {
      label: 'nav.idea',
      icon: 'mdi:head-lightbulb-outline',
      description: 'nav.idea_desc',
      to: '/idea'
    }
  ])

  // 将基础数据源转换为计算属性，实现国际化
  const items = computed<NavItem[]>(() => baseItems.value.map(item => ({
    ...item,
    label: t(item.label),
    description: t(item.description)
  })))

  /**
   * 获取特定路径的导航项
   * @param path 路径
   * @returns 匹配的导航项或undefined
   */
  const getNavItemByPath = (path: string): NavItem | undefined => {
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
   */
  const dynamicNavItems = ref<NavItem[]>([])

  const addNavItem = (newItem: NavItem, index?: number): void => {
    if (index !== undefined && index >= 0 && index <= dynamicNavItems.value.length) {
      dynamicNavItems.value.splice(index, 0, newItem)
    } else {
      dynamicNavItems.value.push(newItem)
    }
  }

  /**
   * 更新导航项
   * @param label 要更新的导航项的标签
   * @param updates 要应用的更新
   * @param isBaseItem 是否更新基础导航项（true）或动态导航项（false）
   */
  const updateNavItem = (label: string, updates: Partial<NavItem>, isBaseItem: boolean = false): void => {
    if (isBaseItem) {
      // 更新基础导航项
      const index = baseItems.value.findIndex(item => t(item.label) === label)
      if (index !== -1) {
        const original = baseItems.value[index]

        // 特殊处理国际化键
        const translationUpdates: Partial<BaseItem> = {}
        if ('label' in updates && updates.label) {
          translationUpdates.label = updates.label
        }
        if ('description' in updates && updates.description) {
          translationUpdates.description = updates.description
        }

        // 使用类型断言确保TypeScript不报错
        baseItems.value[index] = {
          ...original,
          ...updates,
          ...translationUpdates
        } as BaseItem
      }
    } else {
      // 更新动态导航项
      const index = dynamicNavItems.value.findIndex(item => item.label === label)
      if (index !== -1) {
        // 使用类型断言确保TypeScript不报错
        dynamicNavItems.value[index] = {
          ...dynamicNavItems.value[index],
          ...updates
        } as NavItem
      }
    }
  }

  // 返回合并后的导航项（固定项 + 动态添加的项）
  const allItems = computed(() => [...items.value, ...dynamicNavItems.value])

  return {
    items: allItems,
    getNavItemByPath,
    addNavItem,
    updateNavItem
  }
}

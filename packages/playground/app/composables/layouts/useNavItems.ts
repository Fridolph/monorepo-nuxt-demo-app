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

/**
 * 导航菜单项组合式函数
 * @returns 导航菜单项数据
 */
export default function useNavItems() {
  const { t, locale } = useI18n()

  // 基础导航项数据源 - 修正：仅存储键名，不立即翻译
  const baseItems = ref([
    {
      labelKey: 'nav.nuxt_comp', // 修改：存储键名而非翻译后的值
      icon: 'i-lucide-layers',
      descriptionKey: 'nav.nuxt_comp_desc', // 修改：存储键名而非翻译后的值
      to: '/nuxt-ui'
      // children: UI_COMPONENT_CHILDREN
    },
    {
      labelKey: 'nav.demo', // 修改：存储键名而非翻译后的值
      icon: 'i-lucide-layers',
      descriptionKey: 'nav.demo_desc', // 修改：存储键名而非翻译后的值
      to: '/demo'
    },
    {
      labelKey: 'nav.idea', // 修改：存储键名而非翻译后的值
      icon: 'mdi:head-lightbulb-outline',
      descriptionKey: 'nav.idea_desc', // 修改：存储键名而非翻译后的值
      to: '/idea'
    }
  ])

  // 关键修改：明确依赖locale，确保语言切换时重新计算
  const items = computed<NavItem[]>(() => {
    // 显式引用locale.value以创建依赖
    const currentLocale = locale.value

    return baseItems.value.map(item => ({
      // 使用回退值，确保当翻译不存在时显示友好文本
      label: t(item.labelKey) || item.labelKey.split('.').pop() || item.labelKey,
      icon: item.icon,
      description: t(item.descriptionKey) || item.descriptionKey.split('.').pop() || item.descriptionKey,
      to: item.to,
      disabled: item.disabled,
      badge: item.badge,
      isNew: item.isNew,
      children: item.children
    }))
  })

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
      // 找到原始项
      const index = baseItems.value.findIndex((item) => {
        const translatedLabel = t(item.labelKey) || item.labelKey
        return translatedLabel === label
      })

      if (index !== -1) {
        const original = baseItems.value[index]
        const updatedItem = { ...original }

        // 更新非国际化属性
        if (updates.icon !== undefined) updatedItem.icon = updates.icon
        if (updates.to !== undefined) updatedItem.to = updates.to
        if (updates.disabled !== undefined) updatedItem.disabled = updates.disabled
        if (updates.badge !== undefined) updatedItem.badge = updates.badge
        if (updates.isNew !== undefined) updatedItem.isNew = updates.isNew

        // 更新国际化相关属性需谨慎，这里仅作示例
        if (updates.label !== undefined) {
          console.warn('直接更新label会导致失去i18n功能，建议更新i18n文件')
        }

        if (updates.description !== undefined) {
          console.warn('直接更新description会导致失去i18n功能，建议更新i18n文件')
        }

        // 应用更新
        baseItems.value[index] = updatedItem
      }
    } else {
      // 更新动态导航项
      const index = dynamicNavItems.value.findIndex(item => item.label === label)
      if (index !== -1) {
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

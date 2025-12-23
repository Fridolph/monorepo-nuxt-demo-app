<template>
  <div class="flex gap-x-2 p-2 bg-gray-100 rounded-lg">
    <!-- 用Button替代NuxtLink：解决默认跳转拦截问题 -->
    <!-- 拦截点击事件，:class 手动添加高亮 -->
    <button
      v-for="nav in projectNavs"
      :key="nav.label"
      severity="secondary"
      class="group flex items-center gap-x-1 p-2 rounded-md text-sm cursor-pointer"
      :class="{ 'bg-white font-semibold': isNavActive(nav) }"
      :disabled="nav.disabled"
      @click="handleNavClick(nav, $event)"
    >
      <!-- <Icon
        :icon="nav.icon"
        size="1rem"
        class="shrink-0"
        :class="nav.disabled ? '' : nav.iconClass"
      /> -->
      <!-- <UIcon
        :name="IconLightbulb"
        class="shrink-0"
        :class="nav.disabled ? '' : nav.iconClass"
      /> -->
      <span class="opacity-60 group:hover:opacity-100">{{ nav.label }}</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
// import IconLightbulb from '~icons/lucide/lightbulb'
// 引入Store
// import { useApiStacksStore } from '~/stores/apiStacksStore'
// import { useProjectStore } from '~/stores/projectStore'

// 定义导航项类型
interface NavItem {
  label: string
  targetPage: string
  icon: string
  iconClass: string
  disabled: boolean
  route: { name: string, query: Record<string, string> }
}

// Props：接收项目详情（可选）
defineProps<{ projectDetail?: any }>()

// 依赖注入
const route = useRoute()
const { $mitt } = useNuxtApp() // 埋点工具（PostHog）可选

// Store状态映射
const apiStackStore = useApiStacksStore()
const { isSyncingPage1, isSyncingPage2, isSyncingPage3 } = storeToRefs(apiStackStore)

// 计算属性：导航项配置（动态生成路由）
const projectNavs = computed(() => {
  const query = { ...route.query } // 继承当前路由参数
  return [
    {
      label: '页面1',
      targetPage: 'design',
      icon: 'gs-design:compasses-line',
      iconClass: 'text-blue',
      disabled: false,
      route: { name: 'page1', query }
    },
    {
      label: '页面2',
      targetPage: 'quote',
      icon: 'gs-design:hand-coin',
      iconClass: 'text-[#fc9b33]',
      disabled: false,
      route: { name: 'page2', query }
    },
    {
      label: '页面3',
      targetPage: 'proposal',
      icon: 'gs-basic:send-plane',
      iconClass: 'text-green',
      disabled: false,
      route: { name: 'page3', query }
    }
  ] as NavItem[]
})

// 判断导航项是否激活（当前路由匹配）
const isNavActive = (nav: NavItem) => {
  return route.path.includes(nav.targetPage)
}

// 导航点击处理逻辑
async function handleNavClick(nav: NavItem, $event: Event) {
  $event.preventDefault() // 阻止Button默认行为（如表单提交）
  if (nav.disabled) return // 禁用状态直接返回

  // 1. 埋点：记录用户点击行为（Project ID、目标页面等）

  // 2. 延迟300ms：等待表单异步同步的修改 （如用户 focus 在控件上，直接点跳转 ORZ）
  await promiseTimeout(300)

  // 3. 计算目标路径（多语言支持）
  const targetPath = nav.route
  // 4. 检查同步状态：设计/报价模块是否正在同步
  const isSyncing = isSyncingPage1.value || isSyncingPage2.value || isSyncingPage3.value

  if (isSyncing) {
    // 同步中：触发对应模块的弹窗事件
    if (isSyncingPage1.value) {
      $mitt.emit('page1:sync-start', targetPath) // 设计模块同步
    }
    if (isSyncingPage2.value) {
      $mitt.emit('page2:sync-start', targetPath) // 报价模块同步
    }
  } else {
    // 无同步：直接跳转至目标页面
    await navigateTo(targetPath)
  }
}
</script>

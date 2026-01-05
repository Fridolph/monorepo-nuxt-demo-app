<script setup lang="ts">
interface CompItem {
  title: string
  icon?: string
  route: string
  description: string
  children?: CompItem[]
}

const comps = ref<CompItem[]>([
  { title: 'Layout', icon: '', route: '', description: '布局相关', children: [] },
  { title: 'Element', icon: '', route: '', description: '元素，独立使用',
    children: [
      { title: 'Alert', icon: '', route: 'alert', description: `A callout to draw user's attention.` },
      { title: 'Avatar', icon: '', route: 'avatar', description: `An img element with fallback and Nuxt Image support.` },
      { title: 'Badge', icon: '', route: 'badge', description: `A short text to represent a status or a category.` },
      { title: 'Banner', icon: '', route: 'banner', description: `Display a banner at the top of your website to inform users about important information.` },
      { title: 'Button', icon: '', route: 'button', description: `A button element that can act as a link or trigger an action.` },
      { title: 'Calendar', icon: '', route: 'calendar', description: `A calendar component for selecting single dates, multiple dates or date ranges.` },
      { title: 'Card', icon: '', route: 'card', description: `Display content in a card with a header, body and footer.` }
    ]
  },
  { title: 'Form', icon: '', route: '', description: '表单控件', children: [] },
  { title: 'Data', icon: '', route: '', description: '数据处理与展示', children: [] },
  { title: 'Navigation', icon: '', route: '', description: '导航', children: [] },
  { title: 'Overlay', icon: '', route: '', description: '叠层', children: [] },
  { title: 'Page', icon: '', route: '', description: '页面元素', children: [] },
  { title: 'Dashboard', icon: '', route: '', description: '仪表盘', children: [] },
  { title: 'AI Chat', icon: '', route: '', description: '人机交互', children: [] },
  { title: 'Editor', icon: '', route: '', description: '编辑器', children: [] },
  { title: 'Content', icon: '', route: '', description: '内容管理，文字，搜索等', children: [] },
  { title: 'Color Mode', icon: '', route: '', description: '色彩模式', children: [] },
  { title: 'i18n', icon: '', route: '', description: '国际化 & 多语言', children: [] }
])

const routePage = (item: CompItem) => {
  console.log('🚀 ~ routePage:', item)
  if (item.route) navigateTo(`/nuxt-ui/${item.route}`)
}
</script>

<template>
  <NuxtLayout name="onlyheader">
    <section class="w-full p-4 gap-4">
      <section class="flex flex-col gap-4">
        <section
          v-for="item in comps" :key="item.title"
          class="flex flex-col gap-2 mb-4">
          <h2 class="text-lg font-semibold">
            {{ item.title }}
          </h2>
          <template v-if="!item.children || !item.children.length">
            <USkeleton class="w-full h-10" />
          </template>
          <section v-else class="grid grid-cols-3 gap-4 lg:grid-cols-4 2xl:grid-cols-6">
            <UCard
              v-for="child in item.children" :key="child.title"
              class="transition-all duration-300 hover:shadow-xl cursor-pointer"
              :clickable="true"
              :ripple="true"
              @click="routePage(child)">
              <template #header>
                <strong>{{ child.title }}</strong>
              </template>
              {{ child.description }}
            </UCard>
          </section>
        </section>
      </section>
    </section>
  </NuxtLayout>
</template>

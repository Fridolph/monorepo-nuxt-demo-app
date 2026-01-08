<script setup lang="ts">
const demoItems = ref<CardItem[]>([
  {
    title: 'Quote 实时报价',
    desc: '多表单交互场景，支持用户对已添加项进行添加、修改、排序，删除，最终',
    to: 'quote'
  },
  {
    title: 'Forms & Zod Validate',
    desc: '测试表单校验 & Zod Schema 自定义表单，嵌套表单及复杂表单场景'
  },
  {
    title: '支持滚动的虚拟列表 & 容器 Demo',
    desc: '展示如何使用虚拟列表和容器组件来实现高效的滚动性能',
    to: 'scroll-area'
  },
  {
    title: 'Table & 综合展示 及 交互模拟',
    desc: '展示如何使用 nuxt-ui 表格组件进行数据展示和交互。添加常见 翻译，操作，弹窗，抽屉等更多功能，加深印象',
    to: 'table-display'
  }
])

const routeTo = (to?: string) => {
  if (to) {
    return navigateTo(`/demo/${to}`)
  }
}
</script>

<template>
  <NuxtLayout name="onlyheader">
    <section class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <UCard
        v-for="item in demoItems" :key="item.title"
        variant="subtle" title="Quote"
        :ui="{
          root: `${!!item.to ? 'bg-white' : 'bg-gray-100'}`,
          header: `${!!item.to ? 'use-trans cursor-pointer text-black-500 hover:underline hover:text-blue-500' : 'text-gray-400'}`
        }"
        @click="routeTo(item?.to)">
        <template #header>
          <h3 v-text="item.title" />
        </template>
        <NuxtImg v-if="item?.imgUrl" :src="item.imgUrl" />
        <p class="text-sm" v-text="item.desc" />
      </UCard>
    </section>
  </NuxtLayout>
</template>

<style scoped>

</style>

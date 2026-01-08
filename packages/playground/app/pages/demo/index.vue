<script setup lang="ts">
const demoItems = ref<CardItem[]>([
  {
    title: 'Quote 实时报价',
    desc: '多表单交互场景，支持用户对已添加项进行添加、修改、排序，删除，最终'
  },
  {
    title: 'Forms & Zod Validate',
    desc: '测试表单校验 & Zod Schema 自定义表单，嵌套表单及复杂表单场景'
  }
])

const routeTo = (to?: string) => {
  if (to) {
    return navigateTo('/demo/quote')
  }
}
</script>

<template>
  <NuxtLayout name="onlyheader">
    <section class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <UCard
        v-for="item in demoItems" :key="item.title"
        class="cursor-pointer"
        variant="subtle" title="Quote"
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

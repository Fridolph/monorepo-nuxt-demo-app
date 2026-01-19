<script setup lang="ts">
const { t } = useI18n()

const cards = computed(() => ([
  { title: t('nav.nuxt_comp'), icon: 'material-symbols:component-exchange', route: '/nuxt-ui', description: t('nav.nuxt_comp_desc') },
  { title: t('nav.demo'), icon: 'material-symbols:queue-play-next-outline-sharp', route: '/demo', description: t('nav.demo_desc') },
  { title: t('nav.idea'), icon: 'ph:projector-screen-chart-fill', route: '/idea', description: t('nav.idea_desc') }
]))
</script>

<template>
  <NuxtLayout name="common">
    <h1 class="mb-4">
      Home Page
    </h1>

    <section class="grid grid-cols-3 gap-4">
      <UCard v-for="card in cards" :key="card.title">
        <template #header>
          <NuxtLink class="group flex justify-between" :to="card.route">
            <span class="text-lg font-bold group-hover:text-blue-500">{{ card.title }}</span>
            <UIcon :name="card.icon" class="size-5 group-hover:text-blue-500" />
          </NuxtLink>
        </template>

        {{ card.description }}
      </UCard>
    </section>
  </NuxtLayout>
</template>

<style scoped></style>

<script setup lang="ts">
const cards = ref([
  { title: 'Nuxt UI', icon: 'material-symbols:component-exchange', route: '/nuxt-ui', description: 'Nuxt UI Component Demo' },
  { title: 'Simple Demo', icon: 'material-symbols:queue-play-next-outline-sharp', route: '/demo', description: 'Demo examples for different scenarios and subsequent logical derivation' },
  { title: 'Example', icon: 'ph:projector-screen-chart-fill', route: '/example', description: 'Accompanied by a demo of the business scenario, there will be a process' }
])
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

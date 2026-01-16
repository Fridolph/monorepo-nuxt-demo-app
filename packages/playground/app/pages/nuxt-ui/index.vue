<script setup lang="ts">
import { UI_COMPONENT_CHILDREN } from '~/composables/layouts/useNavItems'

const comps = computed(() => {
  return UI_COMPONENT_CHILDREN
})

const routePage = (to: string) => {
  console.log('🚀 ~ :11 ~ routePage:', to)
  return navigateTo({
    path: to
  })
}
</script>

<template>
  <NuxtLayout name="onlyheader">
    <section class="w-full grid grid-cols-4 p-4 gap-4">
      <UCard
        v-for="item in comps"
        :key="item.label"
        class="transition-all duration-300 hover:shadow-xl"
        :clickable="true"
        :ripple="true"
        :ui="{ header: 'p-0!' }">
        <template #header>
          <h3
            class="relative p-3 cursor-pointer hover:bg-blue-50"
            :class="{ 'opacity-80 bg-gray-50 hover:bg-transparent text-gray-300': item.disabled }"
            @click="!item.disabled && routePage(item.to)">
            <span>{{ item.label }}</span>
            <small class="ml-1 text-gray font-normal">{{ item.description }}</small>
            <UBadge
              v-if="item.isNew"
              label="New" size="xs"
              class="rounded-full absolute right-0 top-0"
            />
          </h3>
        </template>
        <!-- <p>to: {{ item.to }}</p> -->
      </UCard>
    </section>
  </NuxtLayout>
</template>

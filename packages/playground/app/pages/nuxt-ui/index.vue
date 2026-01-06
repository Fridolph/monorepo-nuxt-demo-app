<script setup lang="ts">
import useNavItems from '~/composables/layouts/useNavItems'

const { items } = useNavItems()
const comps = computed(() => {
  const item = items.value.find(v => v.label === 'UI Component')
  if (Array.isArray(item?.children)) {
    return item.children
  }
  return []
})
</script>

<template>
  <NuxtLayout name="onlyheader">
    <section class="w-full p-4 gap-4">
      <section class="flex flex-col gap-4">
        <section
          v-for="item in comps" :key="item.label"
          class="flex flex-col gap-2 mb-4">
          <h2 class="text-lg font-semibold">
            {{ item.label }}
          </h2>
          <section class="grid grid-cols-3 gap-4 lg:grid-cols-4 2xl:grid-cols-6">
            <!-- <UCard
              v-for="child in item.children" :key="child.title"
              class="transition-all duration-300 hover:shadow-xl cursor-pointer"
              :clickable="true"
              :ripple="true"
              @click="routePage(child)">
              <template #header>
                <strong>{{ child.title }}</strong>
              </template>
              {{ child.description }}
            </UCard> -->
          </section>
        </section>
      </section>
    </section>
  </NuxtLayout>
</template>

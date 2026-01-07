<script setup lang="ts">
defineProps<{
  layoutClass?: string
}>()
const router = useRouter()
const back = () => {
  router.back()
}
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>

        <TemplateMenu />

        <UButton
          variant="outline" size="xs"
          class="text-xs cursor-pointer absolute left-4 top-5"
          @click="back">
          <UIcon name="mdi:arrow-left" class="size-4" />
          Prev
        </UButton>
      </template>

      <HeaderNav />

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain class="p-4">
      <section class="flex flex-col gap-4">
        <div class="grid grid-cols-3 gap-6">
          <div class="col-span-2" :class="layoutClass">
            <slot />
          </div>
          <InteractionLog class="self-start" />
        </div>
      </section>
    </UMain>
  </UApp>
</template>

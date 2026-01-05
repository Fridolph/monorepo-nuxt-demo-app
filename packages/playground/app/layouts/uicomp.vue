<script setup lang="ts">
const props = defineProps<{
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
      </template>

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
      <div class="mb-4">
        <UButton
          color="secondary" class="text-sm cursor-pointer"
          @click="back">
          回到上一页
        </UButton>
        <Divider />
      </div>

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

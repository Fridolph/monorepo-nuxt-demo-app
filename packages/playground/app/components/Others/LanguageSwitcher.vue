<script setup lang="ts">
// 使用 Nuxt i18n 的组合式API
const { locale, locales } = useI18n()

// 将 locales 对象转换为下拉菜单选项格式
const languageOptions = computed(() => {
  return (locales.value as any[]).map(l => ({
    label: l.name,
    value: l.code,
    icon: getLanguageIcon(l.code)
  }))
})

// 当前选择的语言
const selectedLanguage = computed({
  get: () => locale.value,
  set: (value) => {
    locale.value = value
    // 可选：保存用户语言选择到本地存储
    localStorage.setItem('user-locale', value)
  }
})

// 根据语言代码获取对应的图标
function getLanguageIcon(code: string): string {
  switch (code) {
    case 'zh':
      return 'i-emojione-flag-for-china'
    case 'en':
      return 'i-emojione-flag-for-united-states'
    case 'ja':
      return 'i-emojione-flag-for-japan'
    default:
      return 'i-heroicons-language'
  }
}
</script>

<template>
  <div class="language-switcher">
    <UPopover
      :ui="{
        content: 'w-48'
      }">
      <UButton
        color="neutral"
        variant="ghost"
        :icon="getLanguageIcon(selectedLanguage)">
        <span class="hidden sm:inline">{{ (locales.find(l => l.code === selectedLanguage) as any)?.name }}</span>
        <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4 ml-1" />
      </UButton>

      <template #content>
        <div class="p-1">
          <UButton
            v-for="option in languageOptions"
            :key="option.value"
            block
            variant="ghost"
            :class="{ 'bg-gray-100 dark:bg-gray-800': option.value === selectedLanguage }"
            @click="selectedLanguage = option.value">
            <template #leading>
              <UIcon :name="option.icon" class="w-5 h-5 shrink-0" />
            </template>
            {{ option.label }}
          </UButton>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
}
</style>

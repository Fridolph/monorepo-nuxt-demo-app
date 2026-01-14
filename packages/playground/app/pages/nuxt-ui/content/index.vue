<script setup lang="ts">
import ShowCoder from '~/components/Content/ShowCoder.vue';

const buttonVariants = ['solid', 'outline', 'soft', 'ghost', 'link'] as const
const selectedVariant = ref('solid')

const buttonCode = computed(() => {
  return `<UButton
  color="primary"
  variant="${selectedVariant.value}"
>
  按钮
</UButton>`
})
</script>

<template>
  <NuxtLayout name="uicomp" layout-class="flex flex-col gap-4">
    <!-- TODO 逐步完善 Content 模块里的内容 -->
    <div>
      <h2 class="text-xl font-bold mb-6">
        按钮组件示例
      </h2>

      <!-- 变体选择 -->
      <div class="mb-6">
        <p class="text-sm mb-2">
          选择按钮变体:
        </p>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="variant in buttonVariants"
            :key="variant"
            :variant="variant === selectedVariant ? 'solid' : 'outline'"
            size="sm"
            @click="selectedVariant = variant">
            {{ variant }}
          </UButton>
        </div>
      </div>

      <!-- 使用 ShowCoder 组件 -->
      <ShowCoder
        title="基础按钮"
        description="基础按钮组件，可以设置不同的变体样式。"
        :code="buttonCode">
        <div class="flex gap-4">
          <UButton
            color="primary"
            :variant="selectedVariant">
            按钮
          </UButton>
        </div>
      </ShowCoder>

      <!-- 另一个示例 -->
      <!-- <ShowCoder
        title="带图标的按钮"
        description="按钮可以包含图标，增强视觉效果。"
        code="sdkfjsdkfjsdlfk"
        :default-open="true">
        <div class="flex gap-4">
          <UButton
            color="primary"
            :variant="selectedVariant"
            icon="i-lucide-heart">
            喜欢
          </UButton>
        </div>
      </ShowCoder> -->
    </div>
  </NuxtLayout>
</template>

<style scoped>

</style>

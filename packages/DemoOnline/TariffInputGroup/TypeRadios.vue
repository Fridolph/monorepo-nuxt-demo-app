<template>
  <div class="mt-2 flex gap-x-2">
    <div v-for="item in radioOptions" :key="item.value"
      class="radio-item"
      :class="{ active: isActive(item) }"
      @click="onChangeRadio(item.value)">
      <Icon
        v-show="isActive(item)"
        name="material-symbols:check-circle"
        size="20"
        class="color-green"
      />
      <Icon
        v-show="!isActive(item)"
        name="mdi:circle-outline"
        size="20"
        class="text-gray"
      />
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  radioOptions: any[]
}>()

const modelValue = defineModel<number>({ default: 1 })

function isActive(item: { label: string, value: number }) {
  return item.value === modelValue.value
}

function onChangeRadio(type: number) {
  modelValue.value = type
}
</script>

<style scoped lang="scss">
.radio-item {
  @apply px-3 py-2 rounded b-1px b-#E2E6EC flex items-center gap-x-1 text-sm cursor-pointer;
  &.active {
    @apply b-green;
  }
}
</style>

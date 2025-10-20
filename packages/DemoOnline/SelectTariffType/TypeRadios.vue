<template>
  <div class="mt-4 flex gap-x-2">
    <div
      class="radio-item"
      :class="{ active: curRadioIsOne }"
      @click="onChangeRadio(1)">
      <Icon
        v-show="curRadioIsOne"
        name="material-symbols:check-circle"
        size="20"
        class="color-green"
      />
      <Icon
        v-show="!curRadioIsOne"
        name="mdi:circle-outline"
        size="20"
        class="text-gray"
      />
      <span class="select-none">Peak - Shoulder - Off-Peak</span>
    </div>
    <div
      class="radio-item"
      :class="{ active: curRadioIsTwo }"
      @click="onChangeRadio(2)">
      <Icon
        v-show="curRadioIsTwo"
        name="material-symbols:check-circle"
        size="20"
        class="color-green"
      />
      <Icon
        v-show="!curRadioIsTwo"
        name="mdi:circle-outline"
        size="20"
        class="text-gray"
      />
      <span>Peak - Off-Peak</span>
    </div>
    <div
      class="radio-item"
      :class="{ active: curRadioIsThree }"
      @click="onChangeRadio(3)">
      <Icon
        v-show="curRadioIsThree"
        name="material-symbols:check-circle"
        size="20"
        class="color-green"
      />
      <Icon
        v-show="!curRadioIsThree"
        name="mdi:circle-outline"
        size="20"
        class="text-gray"
      />
      <span>Customize</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<1 | 2 | 3>({ default: 1 })

const curRadioIsOne = computed(() => modelValue.value === 1)
const curRadioIsTwo = computed(() => modelValue.value === 2)
const curRadioIsThree = computed(() => modelValue.value === 3)

function onChangeRadio(type: 1 | 2 | 3) {
  // console.log('🚀 ~ onChangeRadio:', onChangeRadio)
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

<template>
  <div class="flex flex-col gap-4">
    <div>
      <UButton
        color="neutral"
        :ui="{ base: ' w-auto max-w-full' }"
        @click="isShowAlert = true"
      >
        show alert
      </UButton>
    </div>

    <UAlert
      v-show="isShowAlert"
      title="UAlert -> 可配置"
      description="You can change the primary color in your app config."
      color="neutral"
      variant="outline"
      :close="{
        color: 'primary',
        class: 'rounded-full',
        onClick: () => closeAlert()
      }"
      :actions="[
        {
          label: 'Action 1',
          onClick: () => console.log('Action 1')
        },
        {
          label: 'Action 2',
          color: 'neutral',
          variant: 'subtle',
          onClick: () => console.log('Action 2')
        }
      ]"
    />
  </div>
</template>

<script setup lang="ts">
const isShowAlert = ref(true)
const closeAlert = () => isShowAlert.value = false
</script>

<style scoped>

</style>

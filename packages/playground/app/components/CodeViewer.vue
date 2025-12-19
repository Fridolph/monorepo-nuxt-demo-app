<template>
  <div
    class="overflow-auto max-h-100 border-2 border-gray-200 rounded p-4 bg-gray-100"
    :contenteditable="true"
  >
    <pre
      class="break-all text-xs"
      v-text="code"
    />
  </div>
</template>

<script setup lang="ts">
const code = defineModel<string>('code', { default: '' })
</script>

<style scoped>

</style>

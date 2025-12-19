<template>
  <NuxtLayout name="onlyheader">
    <h1>Quote Page</h1>

    <section class="grid grid-cols-3 gap-6">
      <CodeViewer v-model:code="code" />
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
const code = ref(`{}`)
</script>

<style scoped>

</style>

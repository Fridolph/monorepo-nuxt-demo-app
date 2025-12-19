<template>
  <NuxtLayout name="onlyheader">
    <section class="w-full p-4 grid grid-cols-3 gap-4">
      <Alert />
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
const isShowAlert = ref(true)
const closeAlert = () => isShowAlert.value = false
</script>

<style scoped>

</style>

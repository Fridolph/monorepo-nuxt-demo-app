<script setup lang="ts"></script>

<template>
  <NuxtLayout name="common">
    <h1>Home Page</h1>

    <nav class="flex gap-4">
      <NuxtLink
        class="text-blue-400"
        to="/quote"
      >Quote</NuxtLink>
      <NuxtLink
        class="text-blue-400"
        to="/nuxt-ui"
      >Nuxt UI</NuxtLink>
    </nav>
  </NuxtLayout>
</template>

<style scoped></style>

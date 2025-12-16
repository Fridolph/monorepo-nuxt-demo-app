<template>
  <div class="gs-app">
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />

    <header class="navigation">
      <ul>
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/demo">Demo</NuxtLink></li>
        <li><NuxtLink to="/test">Test</NuxtLink></li>
      </ul>
    </header>

    <main class="page-content">
      <NuxtPage />
    </main>
  </div>
</template>

<script lang="ts" setup>
console.log('Nuxt app start...')
</script>

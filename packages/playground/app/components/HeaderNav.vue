<script setup lang="ts">
import useNavItems from '~/composables/layouts/useNavItems'

const { items } = useNavItems()
</script>

<template>
  <UNavigationMenu :items="items" />
</template>

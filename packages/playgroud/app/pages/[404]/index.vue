<script setup lang="ts">
const back = () => navigateTo('/')
</script>

<template>
  <div class="w-full min-h-100vh flex-center">
    我是404
    <div>
      <Button size="small"
        @click="back">
        回到首页
      </Button>
    </div>
  </div>
</template>

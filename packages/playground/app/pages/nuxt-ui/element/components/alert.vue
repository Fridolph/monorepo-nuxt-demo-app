<script setup lang="ts">
const isShowAlert = ref(true)
const logStore = useInteractionLogStore()

// 关闭 alert 日志
function closeAlert() {
  isShowAlert.value = false
  logStore.addLog(
    'element',
    '点击 Alert Close Icon',
    '关闭告警弹窗'
  )
}

// 显示 alert 按钮日志
const handleShowAlert = async () => {
  isShowAlert.value = true
  logStore.addLog(
    'element',
    `点击 show alert 按钮`,
    '打开告警弹窗'
  )
}

// 告警 Actions 日志
const handleAction1 = () => {
  logStore.addLog(
    'element',
    '点击 Action 1'
  )
}

const handleAction2 = () => {
  logStore.addLog(
    'element',
    '点击 Action 2'
  )
}
</script>

<template>
  <div>
    <UButton
      color="neutral"
      :ui="{ base: 'w-auto max-w-full cursor-pointer' }"
      @click="handleShowAlert">
      show alert
    </UButton>
  </div>

  <div class="grid grid-cols-2 gap-6">
    <USkeleton v-if="!isShowAlert" class="self-start h-50" />
    <div v-else class="align-self-start">
      <UAlert
        title="UAlert -> 可配置"
        description="You can change the primary color in your app config."
        color="neutral"
        variant="outline"
        :close="{
          color: 'primary',
          class: 'rounded-full cursor-pointer',
          onClick: closeAlert
        }"
        :actions="[
          { label: 'Action 1', class: 'cursor-pointer', onClick: handleAction1 },
          {
            label: 'Action 2',
            color: 'neutral',
            class: 'cursor-pointer',
            variant: 'subtle',
            onClick: handleAction2
          }
        ]"
      />
    </div>
    <!-- 全局日志组件 -->
  </div>
</template>

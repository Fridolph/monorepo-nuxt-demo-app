<script setup lang="ts">
const isShowAlert = ref(true)
const logStore = useInteractionLogStore()

// 关闭 alert 日志
function closeAlert() {
  isShowAlert.value = false
  logStore.addLog(
    'alert',
    '关闭告警弹窗',
    '组件：UAlert | 类型：outline | 颜色：neutral'
  )
}

// 显示 alert 按钮日志
const handleShowAlert = () => {
  isShowAlert.value = true
  logStore.addLog(
    'alert',
    '点击显示告警按钮',
    '组件：UButton | 颜色：neutral'
  )
}

// 告警 Actions 日志
const handleAction1 = () => {
  console.log('Action 1')
  logStore.addLog(
    'alert',
    '点击告警操作：Action 1',
    '组件：UAlert.Action'
  )
}

const handleAction2 = () => {
  console.log('Action 2')
  logStore.addLog(
    'alert',
    '点击告警操作：Action 2',
    '组件：UAlert.Action | 类型：subtle'
  )
}
</script>

<template>
  <NuxtLayout name="uicomp" layout-class="flex flex-col gap-4">
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
  </NuxtLayout>
</template>

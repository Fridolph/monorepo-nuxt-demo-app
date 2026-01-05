<script setup lang="ts">
import type { LogItem } from '~/stores/interactionLog.store'

const logStore = useInteractionLogStore()
const { deleteLog } = logStore
const { logs } = storeToRefs(logStore)

// 类型断言：确保TS识别logs包含id属性
const typedLogs = computed(() => logs.value.alert as LogItem[])
</script>

<template>
  <div class="border border-gray-200 rounded-lg p-4 bg-white shadow-xs hover:shadow-lg use-trans">
    <h3 class="text-lg font-semibold mb-4 text-gray-800">
      交互日志
    </h3>
    <UTimeline
      color="neutral"
      :items="logs.alert"
      class="w-full">
      <template #title="{ item }">
        {{ item.title }}
        <UIcon
          name="i-lucide-x"
          class="absolute right-0 top-2 size-5 text-gray-500 cursor-pointer hover:text-red-500 transition-colors"
          @click="deleteLog('alert', item.id)"
        />
      </template>
    </UTimeline>
  </div>
</template>

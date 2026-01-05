<script setup lang="ts">
const items = ref([
  {
    label: 'Page 1',
    icon: 'mdi:order-alphabetical-descending',
    tooltip: {
      text: '测试下 page 1'
    },
    to: '/page1'
  },
  {
    label: 'Page 2',
    icon: 'mdi:music-note-plus',
    tooltip: {
      text: '测试下 page 2'
    },
    to: '/page2'
  },
  {
    label: 'Page 3',
    icon: 'mdi:chart-box-outline',
    tooltip: {
      text: '测试下 page 3'
    },
    to: '/page3'
  }
  // {
  //   label: 'Components',
  //   icon: 'i-lucide-box',
  //   to: '/docs/components',
  //   active: true,
  //   children: [
  //     {
  //       label: 'Link',
  //       icon: 'i-lucide-file-text',
  //       description: 'Use NuxtLink with superpowers.',
  //       to: '/docs/components/link'
  //     },
  //     {
  //       label: 'Modal',
  //       icon: 'i-lucide-file-text',
  //       description: 'Display a modal within your application.',
  //       to: '/docs/components/modal'
  //     },
  //     {
  //       label: 'NavigationMenu',
  //       icon: 'i-lucide-file-text',
  //       description: 'Display a list of links.',
  //       to: '/docs/components/navigation-menu'
  //     },
  //     {
  //       label: 'Pagination',
  //       icon: 'i-lucide-file-text',
  //       description: 'Display a list of pages.',
  //       to: '/docs/components/pagination'
  //     },
  //     {
  //       label: 'Popover',
  //       icon: 'i-lucide-file-text',
  //       description: 'Display a non-modal dialog that floats around a trigger element.',
  //       to: '/docs/components/popover'
  //     },
  //     {
  //       label: 'Progress',
  //       icon: 'i-lucide-file-text',
  //       description: 'Show a horizontal bar to indicate task progression.',
  //       to: '/docs/components/progress'
  //     }
  //   ]
  // },
  // {
  //   label: 'GitHub',
  //   icon: 'i-simple-icons-github',
  //   badge: '3.8k',
  //   to: 'https://github.com/nuxt/ui',
  //   target: '_blank'
  // },
  // {
  //   label: 'Help',
  //   icon: 'i-lucide-circle-help',
  //   disabled: true
  // }
])
</script>

<template>
  <UNavigationMenu tooltip :items="items" />
</template>

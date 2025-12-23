// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'dayjs-nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  ui: {
    fonts: false
  },

  routeRules: {
    '/': { prerender: true }
  },

  devServer: {
    host: '0.0.0.0',
    port: 5945
  },

  compatibilityDate: '2025-01-15',

  // 确保生成类型声明
  typescript: {
    shim: false,
    strict: true,
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
        types: [
          '@nuxt/types',
          '@nuxt/ui',
          'nuxt/auto-imports',
          'nuxt'
        ]
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})

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
    'pinia-plugin-persistedstate'
  ],

  imports: {
    autoImport: true,
    presets: ['vue'] // 自动导入 Vue 的 ref/onMounted 等 API
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  app: {
    head: {
      // htmlAttrs: { lang: 'en' },
      // title: 'GreenSketch | Sketching a Greener Future',
      meta: [
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' }
      ],
      script: []
    }
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
          'nuxt',
          'pinia'
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

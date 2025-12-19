// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/image'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

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

  // 添加以下自动导入配置
  autoImports: {
    vue: true,
    nuxt: true,
    imports: [
      'ref', 'reactive', 'computed', 'watch', 'onMounted',
      'useNuxtApp', 'useRouter', 'useRoute', 'useState'
    ]
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

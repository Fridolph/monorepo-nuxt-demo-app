import dotenv from 'dotenv'
import baseConfig from './configs'
import runtimeConfig from './configs/runtime'
import routeRules from './configs/routeRules'

const DOT_ENV_INFO: any = dotenv.config().parsed

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ...baseConfig,

  ...runtimeConfig,

  ...routeRules,
  
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  vite: {
    server: {
      hmr: {
        protocol: 'wss',
        port: 22300,
        clientPort: 443,
        path: 'hmr/',
        timeout: 3,
      },
    },
  },

  app: {
    head: {
      title: 'Nuxt Demo App',
      meta: [
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      ],
      script: [],
    },
  },
})


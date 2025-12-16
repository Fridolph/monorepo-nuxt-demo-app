import TurboConsole from 'unplugin-turbo-console/vite'
import type { NuxtConfig } from 'nuxt/config'

const base: NuxtConfig = {
  devServer: {
    host: '0.0.0.0',
    port: 5945,
  },

  // devProxy: {
  //   '/api': {
  //     target: 'http://192.168.2.152:8080',
  //     changeOrigin: true,
  //   },
  // },

  pages: {
    // Filter specific files or directories
    pattern: [
      '**/*.vue',
      '!**/@components/**/*.vue',
    ],
  },

  imports: {
    dirs: ['stores'],
  },

  css: [
    '@/assets/styles/app.css',
  ],

  postcss: {
    // plugins: {
    //   'postcss-import': {},
    //   'autoprefixer': {},
    // },
  },

  build: {
  },

  sourcemap: {
    
  },

  // $development: {
  //   vite: {
  //     plugins: [
  //       TurboConsole({
  //         launchEditor: false,
  //       }),
  //     ],
  //   },
  // },

  // $production: {
  //   vite: {
  //     build: {
  //       minify: 'esbuild',
  //       chuckSizeWarningLimit: 1024,
  //       cssCodeSplit: true,
  //       target: 'es2015',
  //     },
  //     esbuild: {
  //       drop: ['console', 'debugger'],
  //     },
  //   },
  // },
}

export default base
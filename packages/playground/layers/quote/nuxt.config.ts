import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  alias: {
    '@quote': fileURLToPath(new URL('../../layers/quote', import.meta.url))
  }
})

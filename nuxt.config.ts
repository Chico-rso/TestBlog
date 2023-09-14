// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: {enabled: true},
	head: {
		title: 'Test Blog',
		htmlAttrs: {
			lang: 'ru',
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width,initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' },
		],
	},
	components:[
		{
			path: '~/components',
			pathPrefix: false
		}
	],
	modules: [
    '@pinia/nuxt',
  ],
	pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
	css: ['@/assets/scss/main.scss'],
	 vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/base/variables.scss" as *;'
        }
      }
    }
  }
})

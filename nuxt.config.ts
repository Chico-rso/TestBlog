// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: {enabled: true},
	app: {
		head: {
			title: 'Амиран Бестаев — Frontend-разработчик',
			htmlAttrs: {
				lang: 'ru',
			},
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width,initial-scale=1' },
				{ name: 'description', content: 'Frontend-разработчик. Vue/Nuxt/TypeScript, сложные интерфейсы и анимации.' },
				{ name: 'author', content: 'Amiran Bestaev' },
				{ name: 'robots', content: 'index,follow' },
				{ name: 'theme-color', content: '#f8f5f0' },
				{ property: 'og:image', content: '/og-image.png' },
				{ property: 'og:site_name', content: 'Amiran Bestaev' },
				{ name: 'twitter:card', content: 'summary_large_image' },
				{ name: 'twitter:image', content: '/og-image.png' }
			],
			link: [
				{ rel: 'icon', href: '/favicon.ico' },
				{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
				{ rel: 'manifest', href: '/site.webmanifest' }
			]
		}
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

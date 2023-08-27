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

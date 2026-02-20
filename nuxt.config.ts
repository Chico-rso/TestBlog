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
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width,initial-scale=1'},
                {
                    name: 'description',
                    content: 'Frontend-разработчик. Vue/Nuxt/TypeScript, сложные интерфейсы и анимации.'
                },
                {name: 'author', content: 'Amiran Bestaev'},
                {name: 'robots', content: 'index,follow'},
                {name: 'theme-color', content: '#f2f4ff'},
                {property: 'og:image', content: '/og-image.png'},
                {property: 'og:site_name', content: 'Amiran Bestaev'},
                {name: 'twitter:card', content: 'summary_large_image'},
                {name: 'twitter:image', content: '/og-image.png'}
            ],
            link: [
                {rel: 'icon', href: '/favicon.ico'},
                {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
                {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png'},
                {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png'},
                {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
                {rel: 'manifest', href: '/site.webmanifest'}
            ],
            script: [
                {
                    key: 'yandex-metrika',
                    type: 'text/javascript',
                    innerHTML: `
(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106719755', 'ym');

ym(106719755, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true
});
                    `.trim()
                }
            ],
            noscript: [
                {
                    key: 'yandex-metrika-noscript',
                    tagPosition: 'bodyOpen',
                    innerHTML: '<div><img src="https://mc.yandex.ru/watch/106719755" style="position:absolute; left:-9999px;" alt="" /></div>'
                }
            ]
        }
    },
    components: [
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

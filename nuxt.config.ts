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
                {name: 'author', content: 'Amiran Bestaev'},
                {name: 'robots', content: 'index,follow'},
                {name: 'application-name', content: 'Amiran Bestaev'},
                {name: 'apple-mobile-web-app-title', content: 'Amiran Bestaev'},
                {name: 'theme-color', content: '#f2f4ff'}
            ],
            link: [
                {
                    rel: 'preload',
                    href: '/fonts/Montserrat-VariableFont_wght.woff2',
                    as: 'font',
                    type: 'font/woff2',
                    crossorigin: 'anonymous'
                },
                {rel: 'icon', href: '/favicon.ico'},
                {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
                {rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png'},
                {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png'},
                {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png'},
                {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
                {rel: 'manifest', href: '/site.webmanifest'}
            ]
        }
    },
    nitro: {
        prerender: {
            routes: ['/', '/en', '/projects/u2', '/en/projects/u2'],
        },
    },
    routeRules: {
        '/_nuxt/**': {
            headers: {'cache-control': 'public, max-age=31536000, immutable'},
        },
        '/fonts/**': {
            headers: {'cache-control': 'public, max-age=86400, must-revalidate'},
        },
        '/**': {
            headers: {
                'cache-control': 'public, max-age=0, must-revalidate',
                'strict-transport-security': 'max-age=31536000; includeSubDomains',
                'x-content-type-options': 'nosniff',
                'referrer-policy': 'strict-origin-when-cross-origin',
                'permissions-policy': 'camera=(), microphone=(), geolocation=()',
                'content-security-policy-report-only': "default-src 'self'; script-src 'self' 'unsafe-inline' https://mc.yandex.ru; connect-src 'self' https://mc.yandex.ru https://mc.yandex.com; img-src 'self' data: https://mc.yandex.ru https://mc.yandex.com; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self' mailto: https://t.me",
            },
        },
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

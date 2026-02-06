export const portfolioCopy = {
    ru: {
        meta: {
            title: 'Амиран Бестаев — Frontend-разработчик (Vue/Nuxt)',
            description:
                'Frontend-разработчик с 5+ лет коммерческого опыта. Vue/Nuxt/TypeScript, сложные интерфейсы, GSAP-анимации, e2e-тесты.'
        },
        labels: {
            website: 'Сайт',
            nda: 'NDA'
        },
        nav: {
            work: 'Проекты',
            experience: 'Опыт',
            skills: 'Навыки',
            about: 'Обо мне',
            contact: 'Контакты'
        },
        hero: {
            eyebrow: 'Frontend · Vue/Nuxt · TypeScript',
            name: 'Амиран Бестаев',
            role: 'Frontend-разработчик',
            subtitle:
                'Делаю быстрые, выразительные интерфейсы для продуктов с картой, каталогом и сложной бизнес-логикой.',
            status: 'Открыт к предложениям: удаленно, гибрид, офис',
            location: 'Москва',
            ctaPrimary: 'Написать',
            ctaSecondary: 'Telegram',
            ctaCv: 'Скачать CV'
        },
        stats: [
            {value: '5+', label: 'лет коммерческой разработки'},
            {value: 'Vue/Nuxt', label: 'опыт 2/3 поколений'},
            {value: 'GSAP', label: 'сложные анимации и интерактив'}
        ],
        sections: {
            work: {
                title: 'Избранные проекты',
                subtitle: 'Проекты из e-commerce, доставки и недвижимости с живыми интерфейсами и сложной логикой.'
            },
            experience: {
                title: 'Опыт',
                subtitle: 'Фокус на Vue/Nuxt, TypeScript, производительность и стабильность в продакшене.'
            },
            skills: {
                title: 'Навыки',
                subtitle: 'Стек, с которым я работаю ежедневно.'
            },
            about: {
                title: 'Обо мне',
                subtitle:
                    'Frontend-разработчик с 5+ годами коммерческого опыта. Специализируюсь на Vue.js и Nuxt.js (Vue 2/3, Nuxt 2/3) с использованием TypeScript. Работал с legacy-кодом, архитектурой SPA/SSR-приложений, внедрял тестирование. Ценю чистый код, понятную архитектуру и продуктовый подход.'
            }
        },
        projects: [
      {
        name: 'FoodMap Delivery',
        type: 'Сервис заказа и доставки еды по карте',
        description:
          'Карта с поиском и фильтрами, быстрый подбор ресторанов и курьеров, интерактивные состояния для пользователей.',
        tags: ['Vue', 'Nuxt', 'Maps', 'GSAP'],
        links: [
          { label: 'Сайт', url: 'https://vkusnoibistro.com/application/' }
        ]
      },
            {
                name: 'Вкусно и Быстро',
                type: 'Сервис доставки еды',
                description:
                    'Анимированные UI-компоненты, улучшение пользовательского пути и стабильность в продакшене.',
                tags: ['Vue 2/3', 'GSAP', 'TypeScript'],
                links: [
                    {label: 'Сайт', url: 'https://vkusnoibistro.com/application/'}
                ]
            },
            {
                name: 'Цвет Диванов',
                type: 'Интернет-магазин мебели',
                description:
                    'Каталог, фильтры и карточки товаров с оптимизацией скорости и удобства выбора.',
                tags: ['Nuxt', 'SSR', 'E-commerce'],
                links: [
                    {label: 'Сайт', url: 'https://zvet.ru/'}
                ]
            },
            {
                name: 'Фордевинд',
                type: 'Корпоративный сайт и продуктовые страницы',
                description:
                    'Сборка интерфейса с акцентом на визуальные блоки, адаптив и читаемость контента.',
                tags: ['Vue', 'SCSS', 'Responsive'],
                links: [
                    {label: 'Сайт', url: 'https://fordewind.fsk.ru/'}
                ]
            },
            {
                name: 'U2',
                type: 'Продажи недвижимости',
                description:
                    'Витрина объектов, фильтры и интерактивные сценарии выбора.',
                tags: ['Nuxt', 'TypeScript', 'Filters'],
                links: [
                    {label: 'Сайт', url: 'https://u2.moscow/'}
                ]
            },
            {
                name: 'Массандра Парк',
                type: 'Продажи недвижимости',
                description:
                    'Каталог объектов, акцент на визуальные блоки и понятную навигацию.',
                tags: ['Nuxt', 'UI', 'Performance'],
                links: [
                    {label: 'Сайт', url: 'https://massandrapark.ru/'}
                ]
            },
            {
                name: 'Макс',
                type: 'Продажи недвижимости',
                description:
                    'Промо и витрина объекта с упором на эстетичный интерфейс.',
                tags: ['Vue', 'SSR', 'Landing'],
                links: [
                    {label: 'Сайт', url: 'https://xn--80auew.xn--p1ai/'}
                ]
            }
        ],
        experience: [
            {
                company: 'IdaProject',
                role: 'Frontend-разработчик',
                period: 'Июль 2024 — настоящее время',
                stack: 'Vue 2/3, Nuxt 2/3, TypeScript',
                bullets: [
                    'Спроектировал фильтр с иерархией «очередь → корпус → секция» и выделил логику в переиспользуемый composable.',
                    'Создал универсальный калькулятор (ипотека/рассрочка) с типизацией и расширяемой архитектурой.',
                    'Разработал сложную GSAP-анимацию для картографического интерфейса с кастомными пинами.'
                ]
            },
            {
                company: 'O2',
                role: 'Frontend-разработчик',
                period: 'Февраль 2021 — Июль 2024',
                stack: 'Nuxt 2, Vue 3, TypeScript',
                bullets: [
                    'Перевел ключевые модули с Vue 2 на Vue 3 и TypeScript, уменьшив клиентский бандл.',
                    'Внедрил e2e-тестирование (Cypress) и практику code review.',
                    'Интегрировал карты и оптимизировал страницы с lazy loading через Intersection Observer.'
                ]
            }
        ],
        skills: [
            {
                group: 'Frontend',
                items: ['Vue.js 2/3', 'Nuxt.js 2/3', 'TypeScript', 'JavaScript (ES6+)']
            },
            {group: 'State', items: ['Pinia', 'Vuex']},
            {
                group: 'Styling',
                items: ['SCSS/Sass', 'BEM', 'Адаптивная верстка', 'Кроссбраузерность']
            },
            {group: 'Tooling', items: ['Vite', 'Webpack', 'Gulp', 'Git']},
            {group: 'Testing', items: ['Vitest', '@nuxt/test-utils', 'Cypress']},
            {group: 'Other', items: ['SSR', 'REST API', 'Axios', 'GSAP', 'Maps']}
        ],
        footer: {
            title: 'Давайте сделаем сильный интерфейс',
            subtitle: 'Открыт к предложениям. Быстро подключаюсь и довожу задачу до релиза.',
            emailLabel: 'Email',
            telegramLabel: 'Telegram',
            locationLabel: 'Локация'
        }
    },
    en: {
        meta: {
            title: 'Amiran Bestaev — Frontend Developer (Vue/Nuxt)',
            description:
                'Frontend developer with 5+ years of experience. Vue/Nuxt/TypeScript, complex UIs, GSAP animations, e2e testing.'
        },
        labels: {
            website: 'Website',
            nda: 'Private'
        },
        nav: {
            work: 'Work',
            experience: 'Experience',
            skills: 'Skills',
            about: 'About',
            contact: 'Contact'
        },
        hero: {
            eyebrow: 'Frontend · Vue/Nuxt · TypeScript',
            name: 'Amiran Bestaev',
            role: 'Frontend Developer',
            subtitle:
                'I build fast, expressive interfaces for products with maps, catalogs, and complex business logic.',
            status: 'Open to opportunities: remote, hybrid, on-site',
            location: 'Moscow',
            ctaPrimary: 'Contact',
            ctaSecondary: 'Telegram',
            ctaCv: 'Download CV'
        },
        stats: [
            {value: '5+', label: 'years of commercial experience'},
            {value: 'Vue/Nuxt', label: '2/3 generations'},
            {value: 'GSAP', label: 'advanced motion & interaction'}
        ],
        sections: {
            work: {
                title: 'Selected Work',
                subtitle: 'Projects in e-commerce, delivery, and real estate with rich UI and complex logic.'
            },
            experience: {
                title: 'Experience',
                subtitle: 'Focused on Vue/Nuxt, TypeScript, performance, and production stability.'
            },
            skills: {
                title: 'Skills',
                subtitle: 'My everyday stack.'
            },
            about: {
                title: 'About',
                subtitle:
                    'Frontend developer with 5+ years of commercial experience. Specializing in Vue.js and Nuxt.js (Vue 2/3, Nuxt 2/3) with TypeScript. I worked on legacy codebases, SPA/SSR architecture, and introduced testing. I value clean code, clear architecture, and product thinking.'
            }
        },
        projects: [
      {
        name: 'FoodMap Delivery',
        type: 'Map-based food ordering and delivery',
        description:
          'Map search and filters, fast selection of restaurants and couriers, interactive states for users.',
        tags: ['Vue', 'Nuxt', 'Maps', 'GSAP'],
        links: [
          { label: 'Website', url: 'https://vkusnoibistro.com/application/' }
        ]
      },
            {
                name: 'Vkusno i Bystro',
                type: 'Food delivery service',
                description:
                    'Animated UI components, improved user flow, and stable production performance.',
                tags: ['Vue 2/3', 'GSAP', 'TypeScript'],
                links: [
                    {label: 'Website', url: 'https://vkusnoibistro.com/application/'}
                ]
            },
            {
                name: 'Tsvet Divanov',
                type: 'Furniture e-commerce',
                description:
                    'Catalog, filters, and product cards optimized for speed and easy selection.',
                tags: ['Nuxt', 'SSR', 'E-commerce'],
                links: [
                    {label: 'Website', url: 'https://zvet.ru/'}
                ]
            },
            {
                name: 'Fordewind',
                type: 'Corporate website & product pages',
                description:
                    'UI build with a focus on visual storytelling, responsive layout, and readability.',
                tags: ['Vue', 'SCSS', 'Responsive'],
                links: [
                    {label: 'Website', url: 'https://fordewind.fsk.ru/'}
                ]
            },
            {
                name: 'U2',
                type: 'Real estate sales platform',
                description:
                    'Property showcase, filters, and interactive selection scenarios.',
                tags: ['Nuxt', 'TypeScript', 'Filters'],
                links: [
                    {label: 'Website', url: 'https://u2.moscow/'}
                ]
            },
            {
                name: 'Massandra Park',
                type: 'Real estate sales platform',
                description:
                    'Property catalog with strong visuals and clear navigation.',
                tags: ['Nuxt', 'UI', 'Performance'],
                links: [
                    {label: 'Website', url: 'https://massandrapark.ru/'}
                ]
            },
            {
                name: 'Maks',
                type: 'Real estate sales platform',
                description:
                    'Promo and property showcase with an emphasis on premium UI.',
                tags: ['Vue', 'SSR', 'Landing'],
                links: [
                    {label: 'Website', url: 'https://xn--80auew.xn--p1ai/'}
                ]
            }
        ],
        experience: [
            {
                company: 'IdaProject',
                role: 'Frontend Developer',
                period: 'July 2024 — Present',
                stack: 'Vue 2/3, Nuxt 2/3, TypeScript',
                bullets: [
                    'Designed a multi-level filter (“queue → building → section”) and extracted logic into a reusable composable.',
                    'Built a universal calculator (mortgage/installments) with strong typing and extensible architecture.',
                    'Delivered advanced GSAP animations for a map interface with custom pins.'
                ]
            },
            {
                company: 'O2',
                role: 'Frontend Developer',
                period: 'February 2021 — July 2024',
                stack: 'Nuxt 2, Vue 3, TypeScript',
                bullets: [
                    'Migrated key modules from Vue 2 to Vue 3 + TypeScript and reduced client bundle size.',
                    'Introduced e2e testing (Cypress) and code review practices.',
                    'Integrated maps and optimized pages with lazy loading via Intersection Observer.'
                ]
            }
        ],
        skills: [
            {
                group: 'Frontend',
                items: ['Vue.js 2/3', 'Nuxt.js 2/3', 'TypeScript', 'JavaScript (ES6+)']
            },
            {group: 'State', items: ['Pinia', 'Vuex']},
            {
                group: 'Styling',
                items: ['SCSS/Sass', 'BEM', 'Responsive layout', 'Cross-browser']
            },
            {group: 'Tooling', items: ['Vite', 'Webpack', 'Gulp', 'Git']},
            {group: 'Testing', items: ['Vitest', '@nuxt/test-utils', 'Cypress']},
            {group: 'Other', items: ['SSR', 'REST API', 'Axios', 'GSAP', 'Maps']}
        ],
        footer: {
            title: "Let's build a strong interface",
            subtitle: 'Open to opportunities. I can quickly join a team and deliver to release.',
            emailLabel: 'Email',
            telegramLabel: 'Telegram',
            locationLabel: 'Location'
        }
    }
};

export const systemSections = {
    ru: {
        hero: {
            boot: [
                '> инициализация фронтенд-инженера...',
                '> загрузка экосистемы vue...',
                '> запуск nuxt-рантайма...',
                '> подключение typescript-компилятора...',
                '> система готова.',
            ],
            title: 'ФРОНТЕНД-ИНЖЕНЕР',
            lead: 'Проектирую масштабируемые интерфейсы.',
            stack: 'Vue / Nuxt / TypeScript / Производительность / Архитектура',
            ctaPrimary: 'Смотреть проекты',
            ctaSecondary: 'Связаться',
            commandHint: '⌘/Ctrl + K — навигация по разделам',
        },
        profile: {
            title: 'ПРОФИЛЬ ИНЖЕНЕРА',
            intro: 'Проектирую SPA и SSR-интерфейсы как масштабируемые системы: от архитектуры модулей до устойчивой разработки в продакшене.',
            cards: [
                {label: 'СПЕЦИАЛИЗАЦИЯ', value: 'SPA / SSR / Архитектура фронтенда'},
                {label: 'ПОДХОД', value: 'Сначала системный дизайн'},
                {label: 'ФОКУС', value: 'Производительность, масштабируемость, поддерживаемость'},
                {label: 'ОПЫТ', value: 'Коммерческая разработка в продуктовых командах'},
            ],
        },
        approach: {
            title: 'СИСТЕМНЫЙ ПОДХОД',
            items: [
                {
                    step: '01',
                    title: 'Сначала архитектура',
                    short: 'Сначала схема модулей, границы ответственности и контракт данных.',
                    full: 'До написания UI выделяю домены, сценарии и зависимости между слоями, чтобы код оставался предсказуемым при росте продукта.',
                },
                {
                    step: '02',
                    title: 'Сильная типизация везде',
                    short: 'Типизация на уровне API, composables и критичных UI-сценариев.',
                    full: 'TypeScript использую как инструмент проектирования: типы не только ловят ошибки, но и документируют систему для команды.',
                },
                {
                    step: '03',
                    title: 'Производительность как фича',
                    short: 'Оптимизация загрузки и рендера закладывается в архитектуру.',
                    full: 'Работаю с lazy loading, разбивкой бандла, управлением состоянием и оптимизацией вычислений, чтобы UI был быстрым под реальной нагрузкой.',
                },
                {
                    step: '04',
                    title: 'Чистый масштабируемый код',
                    short: 'Читаемость и поддерживаемость важнее временных хакающих решений.',
                    full: 'Выношу повторяемую бизнес-логику в composables, держу структуру модулей плоской и понятной, минимизирую технический долг.',
                },
            ],
        },
        cases: {
            title: 'ПРОДАКШН-КЕЙСЫ',
            subtitle: 'Реальные интерфейсы в электронной коммерции, доставке и продуктах недвижимости.',
            projectPrefix: 'ПРОЕКТ',
            statusLabel: 'СТАТУС',
            roleLabel: 'РОЛЬ',
            stackLabel: 'СТЕК',
            resultLabel: 'РЕЗУЛЬТАТ',
            status: 'в продакшне',
            role: 'фронтенд-инженер',
            result: 'релиз и стабильная поддержка',
            impactValue: 'Запущено, используется и развивается в рабочем цикле команды.',
            problem: 'Задача',
            solution: 'Решение',
            impact: 'Итог',
        },
        stack: {
            title: 'ТЕХНОЛОГИЧЕСКИЙ СТЕК',
            groups: [
                {
                    title: 'Ядро',
                    items: ['Vue', 'Nuxt', 'TypeScript', 'JavaScript'],
                },
                {
                    title: 'Инфраструктура',
                    items: ['Управление состоянием', 'Интеграция API', 'SSR / маршрутизация', 'Оптимизация производительности'],
                },
                {
                    title: 'Качество',
                    items: ['Ревью кода', 'Рефакторинг', 'Тестирование', 'Удобство разработки (DX)'],
                },
            ],
        },
        principles: {
            title: 'ИНЖЕНЕРНЫЕ ПРИНЦИПЫ',
            items: [
                'Система важнее хака',
                'Читаемость важнее трюков',
                'Производительность имеет значение',
                'Удобство разработки важно',
                'Поддерживаемость в приоритете',
            ],
        },
        build: {
            title: 'СОБЕРЁМ МАСШТАБИРУЕМЫЙ ПРОДУКТ.',
            subtitle: 'Открыт к фронтенд-ролям и командам с долгим жизненным циклом продукта.',
        },
    },
    en: {
        hero: {
            boot: [
                '> initializing frontend engineer...',
                '> loading vue ecosystem...',
                '> loading nuxt runtime...',
                '> loading typescript compiler...',
                '> system ready.',
            ],
            title: 'FRONTEND ENGINEER',
            lead: 'Architecting scalable interfaces.',
            stack: 'Vue / Nuxt / TypeScript / Performance / Architecture',
            ctaPrimary: 'View Projects',
            ctaSecondary: 'Contact',
            commandHint: '⌘/Ctrl + K for quick navigation',
        },
        profile: {
            title: 'ENGINEER_PROFILE',
            intro: 'I build SPA and SSR interfaces as scalable systems, from module architecture to predictable production delivery.',
            cards: [
                {label: 'SPECIALIZATION', value: 'SPA / SSR / Frontend Architecture'},
                {label: 'APPROACH', value: 'System design first'},
                {label: 'FOCUS', value: 'Performance, scalability, maintainability'},
                {label: 'EXPERIENCE', value: '5+ years in production teams'},
            ],
        },
        approach: {
            title: 'SYSTEM_APPROACH',
            items: [
                {
                    step: '01',
                    title: 'Architecture first',
                    short: 'Start with module boundaries, responsibility map, and data contracts.',
                    full: 'Before writing UI, I model domains, user flows, and dependencies so the codebase remains stable while product complexity grows.',
                },
                {
                    step: '02',
                    title: 'Strong typing everywhere',
                    short: 'Typed contracts for API, composables, and critical interaction paths.',
                    full: 'TypeScript is a design tool: types prevent runtime errors and serve as living documentation for the team.',
                },
                {
                    step: '03',
                    title: 'Performance is a feature',
                    short: 'Rendering and loading speed are architectural concerns, not polish.',
                    full: 'I optimize with lazy loading, bundle strategy, state design, and render control to keep UX responsive in real workloads.',
                },
                {
                    step: '04',
                    title: 'Clean, scalable code',
                    short: 'Readable and maintainable code wins over short-term hacks.',
                    full: 'I extract repeated business logic into composables, keep modules explicit, and reduce long-term maintenance costs.',
                },
            ],
        },
        cases: {
            title: 'PRODUCTION_CASES',
            subtitle: 'Shipped interfaces across e-commerce, delivery, and real-estate products.',
            projectPrefix: 'PROJECT',
            statusLabel: 'STATUS',
            roleLabel: 'ROLE',
            stackLabel: 'STACK',
            resultLabel: 'RESULT',
            status: 'production',
            role: 'frontend engineer',
            result: 'live release, maintained in production',
            impactValue: 'Released, used by real users, and maintained in long-term production.',
            problem: 'Problem',
            solution: 'Solution',
            impact: 'Impact',
        },
        stack: {
            title: 'TECH_STACK',
            groups: [
                {
                    title: 'Core',
                    items: ['Vue', 'Nuxt', 'TypeScript', 'JavaScript'],
                },
                {
                    title: 'Infrastructure',
                    items: ['State management', 'API integration', 'SSR / routing', 'Performance optimization'],
                },
                {
                    title: 'Quality',
                    items: ['Code review', 'Refactoring', 'Testing', 'Developer Experience'],
                },
            ],
        },
        principles: {
            title: 'PRINCIPLES',
            items: [
                'Systems over hacks',
                'Readability over cleverness',
                'Performance matters',
                'DX matters',
                'Maintainability first',
            ],
        },
        build: {
            title: "LET'S BUILD SOMETHING SCALABLE.",
            subtitle: 'Open to frontend roles and long-lifecycle product teams.',
        },
    },
};

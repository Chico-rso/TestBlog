# Amiran Portfolio Redesign

## Summary

Перепроектировать личный сайт Амирaна Бестаева в сильную, функциональную и продающую визитку специалиста. Сайт должен быстро объяснять позиционирование, подтверждать опыт фактами из резюме и GitHub, хорошо смотреться на мобильных и десктопе, быть быстрым, доступным и визуально цельным.

Основной бренд: Frontend engineer с фокусом на Vue, Nuxt, TypeScript, SSR, производительность, архитектуру и тестирование.

Дополнительный плюс для рынка: React / Next.js как вторичная компетенция, не размывающая основной месседж.

## Inputs Used

- Текущий сайт: `pages/index.vue`, `app.vue`, `components/sections/*`, `assets/scss/portfolio.scss`
- Текущее резюме: `/Users/amiran/idaProjects/Bestaev Amiran (4).pdf`
- Публичный GitHub: `https://github.com/Chico-rso`
- Рынок труда, апрель 2026:
  - вакансии Vue/Nuxt чаще всего ожидают `TypeScript`, `Vue 3`, `Nuxt 3`, `Pinia`, `Composition API`, `SSR`, `SEO`, `unit/e2e`, `performance`, `teamwork`
  - вакансии React/Next.js остаются массовыми, поэтому React должен быть видимым как дополнительная компетенция

## Problem Statement

Текущая версия сайта уже показывает инженерный вкус и неплохую анимацию, но как визитка она слишком долго подводит к сути. В ней много абстрактных формулировок, длинных текстовых блоков и слишком много общего "инженерного" тона, при этом мало быстро считываемых доказательств:

- не хватает акцента на измеримые результаты из резюме
- React как плюс почти не представлен
- GitHub-пруф не используется как часть истории
- homepage перегружен длинными секциями вместо плотного recruiter-first сценария
- визуальная система интересная, но ей не хватает ясной иерархии и более премиальной подачи

## Goals

1. Сделать сайт похожим на сильную личную визитку, а не на абстрактный арт-портфолио.
2. За 5-10 секунд объяснять, кто ты, чем полезен и почему тебе стоит написать.
3. Показать конкретные подтверждения ценности:
   - 5+ лет опыта
   - Vue / Nuxt / TypeScript как ядро
   - React как дополнительный плюс
   - метрики из резюме: ускорение загрузки, сокращение bundle size, снижение багов, e2e testing
   - публичный GitHub как proof of work
4. Сохранить премиальный визуальный стиль, но сделать его легче для чтения.
5. Сохранить высокую производительность, доступность и поддержку reduced motion.

## Non-Goals

- Не превращать сайт в блог или контент-хаб.
- Не добавлять сложный CMS, авторизацию, формы с бэкендом или лишние страницы.
- Не выдумывать достижения, которых нет в резюме.
- Не делать React главным брендом страницы.
- Не раздувать количество анимаций ради вау-эффекта.
- Не делать командную палитру или блоговую часть основным способом навигации по сайту.

## Positioning

### Primary message

`Frontend Engineer | Vue / Nuxt / TypeScript`

### Secondary message

`React as a plus for broader market fit`

### Tone

- уверенный
- спокойный
- профессиональный
- доказательный
- без лишнего пафоса

### Copy rules

- короткие заголовки
- факты вместо общих фраз
- цифры и результаты вместо "люблю делать качественно"
- русская версия как основная, английская как поддерживающая

## Audience

1. Рекрутеры и hiring managers на российском рынке
2. Продуктовые команды, которые ищут frontend engineer на Vue/Nuxt
3. Команды, где React/Next.js важны как дополнительный плюс
4. Люди, которые быстро просматривают портфолио на телефоне

## Content Strategy

Сайт должен собирать контент вокруг реальных сильных сторон из резюме:

- 5+ лет коммерческого опыта
- Vue 2/3, Nuxt 2/3, TypeScript
- SSR, Composition API, Pinia, state management
- тестирование: Vitest, Cypress, Playwright, `@nuxt/test-utils`
- производительность: bundle size -25%, first render +40%, load time 5 -> 2 sec, production bugs -25%
- сложные сценарии: фильтры, карты, калькуляторы, личный кабинет, авторизация, e-commerce, real estate, delivery
- GSAP как прикладная motion-компетенция, а не декоративная надстройка
- GitHub как подтверждение публичной инженерной активности

Контент должен быть компактнее текущего. Вместо длинных абстрактных абзацев - короткие блоки с доказательствами, цифрами и outcomes.

## Information Architecture

### 1. Hero

- имя и роль
- короткий value proposition
- 3-4 proof chips
- primary CTA: Telegram / Contact
- secondary CTA: CV / Resume
- optional tertiary CTA: GitHub
- short status line: open for work, location, work mode

### 2. Proof strip

- 3-4 ключевые метрики
- пример:
  - `5+ years`
  - `-25% bundle size`
  - `+40% first render`
  - `-25% production bugs`

### 3. Experience / Impact

- timeline или compact cards
- каждый блок должен иметь:
  - компания
  - период
  - стек
  - 2-4 bullets с результатами
- bullets должны быть переписаны в более лаконичную и сильную форму

### 4. Selected Work

- оставить 4-5 лучших кейсов, а не все сразу
- для каждого кейса показать:
  - тип проекта
  - роль
  - стек
  - конкретный результат или ценность
  - ссылку на сайт, если публично доступен
- кейсы должны быть упорядочены по релевантности к рынку и силе истории

### 5. Skills Matrix

- разделить стек на:
  - Core: Vue, Nuxt, TypeScript, JavaScript
  - Product / Delivery: Pinia, SSR, API integration, routing, optimization
  - Quality: testing, refactoring, code review
  - Secondary: React, Next.js
- React должен быть видим как рабочая дополнительная компетенция, но не как замена Vue

### 6. GitHub Proof

- отдельный небольшой блок с:
  - ссылкой на GitHub профиль
  - 2-3 публичных репозитория или pinned projects
  - кратким объяснением, что профиль подтверждает публичный код и активность
- не использовать хрупкие "магические" цифры в копии, если они будут часто устаревать

### 7. Contact

- Telegram
- email
- download CV
- location
- optional quick copy actions

## Visual Direction

### Overall style

- premium editorial
- light-first foundation
- аккуратная тёмная тема как mirror mode, а не как отдельный дизайн
- мягкие градиенты, но не "пустые" фоны
- ощущение дорогой, но спокойной технологичной визитки

### Typography

- крупный, уверенный display typography
- хорошая читаемость body copy
- не делать текст слишком декоративным
- избегать визуального шума в заголовках

### Color

- основной акцент: холодный синий / azure / slate
- фон: светлый с мягкими холодными градиентами
- cards/surfaces: чистые, с небольшой глубиной и border separation
- контраст должен быть пригоден для чтения на первом экране и в длинных блоках

### Layout

- более компактный hero, чем сейчас
- меньше пустых вертикальных дыр
- контент строится в плотные, хорошо сканируемые блоки
- на мобильных - одна колонка, без перегруза

### Motion

- использовать motion точечно:
  - hero entrance
  - section reveals
  - micro-interactions on buttons/cards
- вся анимация должна уважать `prefers-reduced-motion`
- GSAP можно оставить, но подключать только на клиенте и только для того, что действительно усиливает восприятие

## Accessibility Requirements

- semantic landmarks
- visible focus states
- keyboard navigation for menus and interactive cards
- skip link should remain
- good color contrast in both themes
- reduced motion fallback
- interactive elements must remain usable without hover

## Performance Requirements

- keep homepage lightweight
- no heavy always-on animations
- dynamic import for animation libs
- avoid loading unnecessary blog/article UI on the homepage
- keep legacy article/blog routes out of the primary homepage story unless they directly support the portfolio
- use static or SSR-friendly content delivery
- minimize layout shift
- keep first-screen content fast and stable on mobile networks

Target: the site should feel instant and remain readable on a mid-range phone connection.

## SEO Requirements

- strong title and description per language
- Open Graph and Twitter card metadata
- canonical-friendly structure
- Person schema is recommended for the homepage
- CV download and GitHub should be discoverable by crawlers and users

## Data Model

The content can stay in local files, but the structure should be more deliberate:

- one source for navigation and section metadata
- one source for bilingual copy
- one source for projects and experience
- one source for external links and contact data

This keeps the site simple, avoids CMS overhead, and makes future updates low-risk.

## Implementation Scope

### In scope

- redesign homepage sections
- rewrite copy for stronger positioning and better recruiter fit
- add React as secondary skill
- improve hero, proof hierarchy, and case presentation
- surface GitHub proof
- polish motion, accessibility, and responsive behavior
- keep bilingual RU/EN support

### Out of scope

- blog rebuild
- multi-page content platform
- CMS integration
- authentication
- complicated backend services
- public comments / newsletter / subscriptions

## Acceptance Criteria

1. The first screen clearly states the role and main value proposition.
2. Vue/Nuxt/TypeScript are the core brand of the site.
3. React is visible as a secondary plus, not hidden.
4. Resume metrics are represented accurately and tastefully.
5. GitHub is part of the trust story.
6. The homepage feels premium, functional, and easy to scan.
7. The site is usable on mobile, keyboard-only, and with reduced motion enabled.
8. The page loads fast and does not feel heavy.
9. The design reads as a serious professional business card, not a generic portfolio template.

## Risks and Trade-offs

- Adding too many metrics can make the page feel crowded. Keep only the strongest evidence.
- Over-emphasizing React could weaken the Vue/Nuxt authority. Use React only as a secondary signal.
- Motion can make the site feel premium, but if overused it will hurt performance and clarity.
- Too much content from the CV can become a wall of text. Keep each section short and scannable.
- Exact public GitHub counts can drift over time, so the GitHub block should focus on durable signals.

## Recommended Shape of the Final Experience

The final site should feel like:

1. A sharp, premium homepage that instantly communicates role and strength.
2. A compact proof-driven portfolio that uses metrics, case studies, and public code.
3. A recruiter-friendly page that is easy to scan and easy to trust.

## Suggested Delivery Order

1. Restructure content and positioning.
2. Rebuild the hero, proof strip, and contact block.
3. Rewrite experience and projects around measurable outcomes.
4. Add the skills matrix with React as a secondary plus.
5. Layer in motion, accessibility, SEO, and polish.
6. Review visually on desktop and mobile, then iterate.

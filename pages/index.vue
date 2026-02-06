<template>
    <div ref="root" class="portfolio" id="top">
        <section class="hero">
            <div class="hero__glow"></div>
            <div class="hero__grid"></div>
            <div class="container hero__inner">
                <div class="hero__content">
                    <p class="hero__eyebrow">{{ t.hero.eyebrow }}</p>
                    <h1 class="hero__title">
                        <span>{{ t.hero.name }}</span>
                        <em>{{ t.hero.role }}</em>
                    </h1>
                    <p class="hero__subtitle">{{ t.hero.subtitle }}</p>
                    <div class="hero__meta">
                        <span>{{ t.hero.location }}</span>
                        <span>{{ t.hero.status }}</span>
                    </div>
                    <div class="hero__cta">
                        <a class="btn btn--primary" :href="`mailto:${email}`">{{ t.hero.ctaPrimary }}</a>
                        <a
                            class="btn btn--ghost"
                            :href="`https://t.me/${telegram}`"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {{ t.hero.ctaSecondary }}
                        </a>
                        <a class="btn btn--ghost btn--download" href="/cv-amiran-bestaev.pdf" download>
                            {{ t.hero.ctaCv }}
                        </a>
                    </div>
                </div>
                <div class="hero__stats">
                    <div v-for="stat in t.stats" :key="stat.label" class="stat-card">
                        <div class="stat-card__value">{{ stat.value }}</div>
                        <div class="stat-card__label">{{ stat.label }}</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section section--work" id="work">
            <div class="container">
                <div class="section__head reveal">
                    <h2>{{ t.sections.work.title }}</h2>
                    <p>{{ t.sections.work.subtitle }}</p>
                </div>
                <div class="work-grid">
                    <article v-for="project in t.projects" :key="project.name" class="work-card reveal">
                        <div class="work-card__top">
                            <h3>{{ project.name }}</h3>
                            <span>{{ project.type }}</span>
                        </div>
                        <p class="work-card__desc">{{ project.description }}</p>
                        <ul class="work-card__tags">
                            <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
                        </ul>
                        <div class="work-card__links">
                            <template v-if="project.links.length">
                                <a
                                    v-for="link in project.links"
                                    :key="link.url"
                                    :href="link.url"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {{ link.label }}
                                </a>
                            </template>
                            <span v-else class="work-card__nda">{{ t.labels.nda }}</span>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="section section--experience" id="experience">
            <div class="container">
                <div class="section__head reveal">
                    <h2>{{ t.sections.experience.title }}</h2>
                    <p>{{ t.sections.experience.subtitle }}</p>
                </div>
                <div class="timeline">
                    <article v-for="item in t.experience" :key="item.company" class="timeline__item reveal">
                        <div class="timeline__meta">
                            <h3>{{ item.company }}</h3>
                            <span>{{ item.period }}</span>
                        </div>
                        <div class="timeline__body">
                            <p class="timeline__role">{{ item.role }}</p>
                            <p class="timeline__stack">{{ item.stack }}</p>
                            <ul>
                                <li v-for="point in item.bullets" :key="point">{{ point }}</li>
                            </ul>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="section section--skills" id="skills">
            <div class="container">
                <div class="section__head reveal">
                    <h2>{{ t.sections.skills.title }}</h2>
                    <p>{{ t.sections.skills.subtitle }}</p>
                </div>
                <div class="skills-grid">
                    <div v-for="skill in t.skills" :key="skill.group" class="skill-card reveal">
                        <h3>{{ skill.group }}</h3>
                        <ul>
                            <li v-for="item in skill.items" :key="item">{{ item }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="section section--about" id="about">
            <div class="container">
                <div class="about-card reveal">
                    <div>
                        <h2>{{ t.sections.about.title }}</h2>
                        <p>{{ t.sections.about.subtitle }}</p>
                    </div>
                    <div class="about-card__details">
                        <div>
                            <span>Email</span>
                            <a :href="`mailto:${email}`">{{ email }}</a>
                        </div>
                        <div>
                            <span>Telegram</span>
                            <a :href="`https://t.me/${telegram}`" target="_blank" rel="noreferrer">@{{ telegram }}</a>
                        </div>
                        <div>
                            <span>{{ t.footer.locationLabel }}</span>
                            <strong>{{ t.hero.location }}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { portfolioCopy } from '~/data/portfolioCopy.js';

const root = ref(null);
const email = 'amiranbestaev@gmail.ru';
const telegram = 'AmiranBestaev';

const lang = useState('lang', () => 'ru');
const t = computed(() => portfolioCopy[lang.value]);
let gsapContext;

useHead(() => ({
    title: t.value.meta.title,
    htmlAttrs: {
        lang: lang.value,
    },
    meta: [
        {key: 'description', name: 'description', content: t.value.meta.description},
        {key: 'og:title', property: 'og:title', content: t.value.meta.title},
        {key: 'og:description', property: 'og:description', content: t.value.meta.description},
        {key: 'og:type', property: 'og:type', content: 'website'},
        {key: 'og:locale', property: 'og:locale', content: lang.value === 'ru' ? 'ru_RU' : 'en_US'},
        {key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image'},
        {key: 'twitter:title', name: 'twitter:title', content: t.value.meta.title},
        {key: 'twitter:description', name: 'twitter:description', content: t.value.meta.description},
    ],
}));

onMounted(async () => {
    const saved = localStorage.getItem('lang');
    if (saved === 'ru' || saved === 'en') {
        lang.value = saved;
    }

    const {gsap} = await import('gsap');
    const {ScrollTrigger} = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    gsapContext = gsap.context(() => {
        gsap.from('.hero__eyebrow', {opacity: 0, y: 20, duration: 0.6, ease: 'power3.out'});
        gsap.from('.hero__title span', {opacity: 0, y: 30, duration: 0.7, delay: 0.05, ease: 'power3.out'});
        gsap.from('.hero__title em', {opacity: 0, y: 30, duration: 0.7, delay: 0.15, ease: 'power3.out'});
        gsap.from('.hero__subtitle', {opacity: 0, y: 24, duration: 0.6, delay: 0.2, ease: 'power3.out'});
        gsap.from('.hero__meta', {opacity: 0, y: 20, duration: 0.6, delay: 0.3, ease: 'power3.out'});
        gsap.from('.hero__cta .btn', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            delay: 0.35,
            stagger: 0.1,
            ease: 'power3.out',
        });
        gsap.from('.stat-card', {
            opacity: 0,
            y: 20,
            duration: 0.5,
            delay: 0.45,
            stagger: 0.12,
            ease: 'power3.out',
        });

        gsap.to('.hero__glow', {
            yPercent: 15,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
        });

        gsap.utils.toArray('.reveal').forEach((el) => {
            gsap.from(el, {
                opacity: 0,
                y: 36,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                },
            });
        });
    }, root);
});

watch(lang, (value) => {
    if (process.client) {
        localStorage.setItem('lang', value);
    }
});

onBeforeUnmount(() => {
    if (gsapContext) {
        gsapContext.revert();
    }
});
</script>

<style lang="scss" scoped>
:global(:root) {
    --portfolio-bg: #f8f5f0;
    --portfolio-text: #1c1c1f;
    --portfolio-muted: #6f6f76;
    --portfolio-accent: #2f5ef4;
    --portfolio-accent-2: #ff6a3d;
    --portfolio-surface: #ffffff;
    --portfolio-border: rgba(28, 28, 31, 0.12);
}

:global(body) {
    background: var(--portfolio-bg);
    color: var(--portfolio-text);
    font-weight: 500;
}

.portfolio {
    overflow: hidden;
}

.hero {
    position: relative;
    padding: 110px 0 80px;
    min-height: 85vh;
    display: flex;
    align-items: center;
    background: radial-gradient(circle at top right, rgba(47, 94, 244, 0.14), transparent 55%),
    radial-gradient(circle at 10% 20%, rgba(255, 106, 61, 0.12), transparent 45%);
}

.hero__glow {
    position: absolute;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(47, 94, 244, 0.25) 0%, rgba(47, 94, 244, 0) 70%);
    top: -120px;
    right: -120px;
    filter: blur(6px);
    pointer-events: none;
}

.hero__grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(28, 28, 31, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(28, 28, 31, 0.04) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(circle at 20% 10%, rgba(0, 0, 0, 0.9), transparent 70%);
    pointer-events: none;
}

.hero__inner {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 40px;
    align-items: center;
    @media (min-width: $tablet) {
        grid-template-columns: 1.2fr 0.8fr;
    }
}

.hero__content {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.hero__eyebrow {
    font-size: 14px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--portfolio-muted);
}

.hero__title {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 700;
    line-height: 1.05;
    margin: 0;

    span {
        font-weight: 700;
    }

    em {
        font-style: normal;
        color: var(--portfolio-accent);
        font-weight: 600;
    }
}

.hero__subtitle {
    font-size: 18px;
    line-height: 1.6;
    max-width: 520px;
    color: var(--portfolio-text);
}

.hero__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 14px;
    color: var(--portfolio-muted);

    span {
        padding: 6px 12px;
        border-radius: 999px;
        border: 1px solid var(--portfolio-border);
        background: rgba(255, 255, 255, 0.6);
    }
}

.hero__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 22px;
    border-radius: 999px;
    font-weight: 600;
    border: 1px solid transparent;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

    &--primary {
        background: var(--portfolio-accent);
        color: #fff;
        box-shadow: 0 18px 40px rgba(47, 94, 244, 0.25);
    }

    &--ghost {
        background: transparent;
        border-color: var(--portfolio-border);
    }

    &--download {
        border-color: rgba(47, 94, 244, 0.35);
        color: var(--portfolio-accent);
        background: rgba(47, 94, 244, 0.08);
    }

    &:hover {
        transform: translateY(-2px);
    }
}

.hero__stats {
    display: grid;
    gap: 18px;
}

.stat-card {
    padding: 18px 20px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 20px 40px rgba(28, 28, 31, 0.08);
}

.stat-card__value {
    font-size: 24px;
    font-weight: 700;
}

.stat-card__label {
    font-size: 14px;
    color: var(--portfolio-muted);
    margin-top: 6px;
}

.section {
  padding: 80px 0;
  scroll-margin-top: 90px;
}

.section__head {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;

    h2 {
        font-size: clamp(28px, 3vw, 40px);
        margin: 0;
    }

    p {
        margin: 0;
        color: var(--portfolio-muted);
        max-width: 640px;
    }
}

.work-grid {
    display: grid;
    gap: 22px;
    @media (min-width: $tablet) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

.work-card {
    background: var(--portfolio-surface);
    border-radius: 20px;
    padding: 22px;
    border: 1px solid var(--portfolio-border);
    box-shadow: 0 20px 40px rgba(28, 28, 31, 0.06);
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.work-card__top {
    display: flex;
    flex-direction: column;
    gap: 8px;

    h3 {
        margin: 0;
        font-size: 20px;
    }

    span {
        color: var(--portfolio-muted);
        font-size: 14px;
    }
}

.work-card__desc {
    color: var(--portfolio-text);
    line-height: 1.6;
}

.work-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    li {
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(47, 94, 244, 0.1);
        color: var(--portfolio-accent);
        font-size: 12px;
        font-weight: 600;
    }
}

.work-card__links {
    display: flex;
    align-items: center;
    gap: 10px;

    a {
        font-size: 13px;
        font-weight: 600;
        color: var(--portfolio-accent);
        border-bottom: 1px solid rgba(47, 94, 244, 0.3);
    }
}

.work-card__nda {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(28, 28, 31, 0.08);
    color: var(--portfolio-muted);
}

.timeline {
    display: grid;
    gap: 28px;
}

.timeline__item {
    display: grid;
    gap: 16px;
    padding: 24px;
    border-radius: 24px;
    background: var(--portfolio-surface);
    border: 1px solid var(--portfolio-border);
    box-shadow: 0 20px 40px rgba(28, 28, 31, 0.06);
    @media (min-width: $tablet) {
        grid-template-columns: 0.4fr 0.6fr;
    }
}

.timeline__meta {
    h3 {
        margin: 0 0 6px 0;
    }

    span {
        color: var(--portfolio-muted);
        font-size: 14px;
    }
}

.timeline__role {
    margin: 0 0 6px 0;
    font-weight: 600;
}

.timeline__stack {
    color: var(--portfolio-muted);
    margin-bottom: 10px;
    font-size: 14px;
}

.timeline__body ul {
    display: grid;
    gap: 8px;
    padding-left: 18px;
    list-style: disc;
    color: var(--portfolio-text);
}

.skills-grid {
    display: grid;
    gap: 22px;
    @media (min-width: $tablet) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

.skill-card {
    padding: 20px;
    border-radius: 18px;
    background: var(--portfolio-surface);
    border: 1px solid var(--portfolio-border);
    box-shadow: 0 18px 34px rgba(28, 28, 31, 0.05);

    h3 {
        margin-top: 0;
    }

    ul {
        display: grid;
        gap: 6px;
        padding-left: 16px;
        list-style: disc;
        color: var(--portfolio-muted);
    }
}

.section--about {
    padding-bottom: 120px;
}

.about-card {
    display: grid;
    gap: 30px;
    padding: 32px;
    border-radius: 28px;
    background: linear-gradient(140deg, rgba(47, 94, 244, 0.08), rgba(255, 106, 61, 0.08));
    border: 1px solid rgba(47, 94, 244, 0.2);
    @media (min-width: $tablet) {
        grid-template-columns: 1.2fr 0.8fr;
        align-items: center;
    }
}

.about-card__details {
    display: grid;
    gap: 16px;

    div {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    span {
        font-size: 12px;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--portfolio-muted);
    }

    a {
        font-weight: 600;
    }
}

@media (max-width: 720px) {
    .hero {
        padding: 90px 0 70px;
    }
}
</style>

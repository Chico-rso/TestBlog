<template>
    <footer class="site-footer" id="contact">
        <div class="container site-footer__inner">
            <div class="site-footer__copy">
                <h2>{{ system.build.title }}</h2>
                <p>{{ system.build.subtitle }}</p>
            </div>
            <address class="site-footer__links">
                <div>
                    <span>TELEGRAM</span>
                    <a :href="`https://t.me/${telegram}`" target="_blank" rel="noreferrer">@{{ telegram }}</a>
                </div>
                <div>
                    <span>EMAIL</span>
                    <a :href="`mailto:${email}`">{{ email }}</a>
                </div>
                <div>
                    <span>LOCATION</span>
                    <strong>{{ t.hero.location }}</strong>
                </div>
            </address>
            <div class="site-footer__meta">© {{ year }} Amiran Bestaev</div>
        </div>
    </footer>
</template>

<script setup>
import { portfolioConfig } from '~/data/portfolioConfig.js';
import { systemSections } from '~/data/systemSections.js';

const {t, lang} = useLanguage();
const year = new Date().getFullYear();
const {email, telegram} = portfolioConfig;
const system = computed(() => systemSections[lang.value] || systemSections.en);
</script>

<style lang="scss" scoped>
.site-footer {
    padding: 80px 0 50px;
    background: linear-gradient(180deg, color-mix(in srgb, var(--portfolio-bg-soft) 84%, #02060a), color-mix(in srgb, var(--portfolio-bg) 68%, #010409));
    color: var(--portfolio-text);
    border-top: 1px solid var(--portfolio-border);
}

.site-footer__inner {
    display: grid;
    gap: 30px;
}

.site-footer__copy {
    h2 {
        margin: 0 0 12px 0;
        font-size: clamp(26px, 3vw, 40px);
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--portfolio-title);
    }

    p {
        margin: 0;
        color: var(--portfolio-muted);
        max-width: 520px;
    }
}

.site-footer__links {
    display: grid;
    gap: 16px;

    div {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    span {
        font-size: 12px;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--portfolio-muted);
        font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    }

    a,
    strong {
        color: var(--portfolio-title);
        font-weight: 700;
    }
}

.site-footer__meta {
    font-size: 12px;
    color: var(--portfolio-muted);
}

@media (min-width: $tablet) {
    .site-footer__inner {
        grid-template-columns: 1.2fr 0.8fr;
        align-items: center;
    }
    .site-footer__meta {
        grid-column: 1 / -1;
    }
}
</style>

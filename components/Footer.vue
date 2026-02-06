<template>
    <footer class="site-footer" id="contact">
        <div class="container site-footer__inner">
            <div class="site-footer__copy">
                <h2>{{ t.footer.title }}</h2>
                <p>{{ t.footer.subtitle }}</p>
            </div>
            <div class="site-footer__links">
                <div>
                    <span>{{ t.footer.emailLabel }}</span>
                    <a :href="`mailto:${email}`">{{ email }}</a>
                </div>
                <div>
                    <span>{{ t.footer.telegramLabel }}</span>
                    <a :href="`https://t.me/${telegram}`" target="_blank" rel="noreferrer">@{{ telegram }}</a>
                </div>
                <div>
                    <span>{{ t.footer.locationLabel }}</span>
                    <strong>{{ t.hero.location }}</strong>
                </div>
            </div>
            <div class="site-footer__meta">© {{ year }} Amiran Bestaev</div>
        </div>
    </footer>
</template>

<script setup>
import { portfolioCopy } from '~/data/portfolioCopy.js';

const email = 'amiranbestaev@gmail.ru';
const telegram = 'AmiranBestaev';
const year = new Date().getFullYear();

const lang = useState('lang', () => 'ru');
const t = computed(() => portfolioCopy[lang.value]);
</script>

<style lang="scss" scoped>
.site-footer {
    padding: 80px 0 50px;
    background: #151518;
    color: #f4f4f6;
}

.site-footer__inner {
    display: grid;
    gap: 30px;
}

.site-footer__copy {
    h2 {
        margin: 0 0 12px 0;
        font-size: clamp(26px, 3vw, 40px);
    }

    p {
        margin: 0;
        color: rgba(244, 244, 246, 0.7);
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
        color: rgba(244, 244, 246, 0.6);
    }

    a,
    strong {
        color: #fff;
        font-weight: 600;
    }
}

.site-footer__meta {
    font-size: 12px;
    color: rgba(244, 244, 246, 0.5);
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

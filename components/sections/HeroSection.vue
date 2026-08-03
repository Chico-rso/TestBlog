<template>
    <section class="hero" aria-labelledby="hero-title">
        <div class="hero__glow" aria-hidden="true"></div>
        <div class="hero__grid" aria-hidden="true"></div>
        <div class="container hero__inner">
            <div class="hero__content">
                <div class="hero__boot">
                    <p>&gt; {{ copy.hero.eyebrow }}</p>
                </div>
                <h1 id="hero-title" class="hero__title" data-hero-identity>
                    <span class="hero__title-reveal">
                        <span class="hero__title-main">{{ copy.hero.name }}</span>
                    </span>
                </h1>
                <p class="hero__title-reveal">
                    <strong class="hero__title-role" data-hero-role>{{ copy.hero.role }}</strong>
                </p>
                <p class="hero__subtitle">{{ copy.hero.subtitle }}</p>
                <div class="hero__meta">
                    <span>{{ copy.hero.location }}</span>
                    <span>{{ copy.hero.status }}</span>
                </div>
                <div class="hero__cta">
                    <NuxtLink class="btn btn--primary" :to="featuredProject.casePath" data-hero-cta>
                        {{ copy.hero.ctaPrimary }}
                    </NuxtLink>
                    <a class="btn btn--ghost" :href="resumeUrl" download data-hero-cta>{{ copy.hero.ctaCv }}</a>
                    <a class="btn btn--ghost" href="#contact" data-hero-cta>{{ copy.hero.ctaSecondary }}</a>
                </div>
            </div>
            <div class="hero__visual" aria-hidden="true">
                <div class="hero__orb hero__orb--main"></div>
                <div class="hero__orb hero__orb--accent"></div>
                <div class="hero__ring hero__ring--one"></div>
                <div class="hero__ring hero__ring--two"></div>
                <div class="hero__signal hero__signal--one"></div>
                <div class="hero__signal hero__signal--two"></div>
                <div class="hero__visual-card">
                    <span>{{ copy.stats[1].value }}</span>
                    <span>{{ copy.stats[2].value }}</span>
                </div>
            </div>
            <div class="hero__stats">
                <div v-for="stat in copy.stats" :key="stat.label" class="stat-card">
                    <div class="stat-card__value">{{ stat.value }}</div>
                    <div class="stat-card__label">{{ stat.label }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { portfolioConfig } from '~/data/portfolioConfig.js';

defineProps({
    copy: {type: Object, required: true},
    featuredProject: {type: Object, required: true},
});

const {resumeUrl} = portfolioConfig;
</script>

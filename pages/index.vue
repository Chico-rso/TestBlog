<template>
    <div ref="root" class="portfolio" id="top">
        <HeroSection
            :copy="t"
            :email="config.email"
            :telegram="config.telegram"
            :resume-url="config.resumeUrl"
        />
        <WorkSection id="work" :copy="t"/>
        <ExperienceSection id="experience" :copy="t"/>
        <SkillsSection id="skills" :copy="t"/>
        <AboutSection id="about" :copy="t" :email="config.email" :telegram="config.telegram"/>
    </div>
</template>

<script setup>
import { portfolioConfig } from '~/data/portfolioConfig.js';

const root = ref(null);
const {t} = useLanguage();

usePortfolioHead();
usePortfolioAnimations(root);

const config = portfolioConfig;
</script>

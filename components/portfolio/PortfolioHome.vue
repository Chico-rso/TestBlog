<template>
    <div ref="root" class="portfolio" id="top">
        <HeroSection
            :copy="t"
            :system="system.hero"
        />
        <AboutSection id="profile" :system="system.profile"/>
        <ExperienceSection id="approach" :system="system.approach"/>
        <WorkSection id="work" :copy="t" :system="system.cases"/>
        <SkillsSection id="stack" :system="system.stack"/>
        <PrinciplesSection id="principles" :system="system.principles"/>
    </div>
</template>

<script setup>
import { systemSections } from '~/data/systemSections.js';

const root = ref(null);
const {t, lang} = useLanguage();

usePortfolioHead();
usePortfolioAnimations(root);

const system = computed(() => systemSections[lang.value] || systemSections.en);
</script>

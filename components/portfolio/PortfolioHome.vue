<template>
    <div ref="root" class="portfolio" id="top">
        <HeroSection :copy="t" :featured-project="featuredProject"/>
        <FeaturedCaseSection id="u2" :project="featuredProject" :section="t.sections.featured"/>
        <CareerSection id="experience" :items="t.experience" :section="t.sections.experience"/>
        <WorkSection id="projects" :copy="t"/>
        <SkillsSection id="stack" :copy="t"/>
        <PrinciplesSection id="principles" :copy="t"/>
    </div>
</template>

<script setup>
const root = ref(null);
const {t} = useLanguage();
const featuredProject = computed(() => t.value.projects.find(({featured}) => featured));

usePortfolioHead('home');
usePortfolioAnimations(root);
</script>

<template>
    <section class="section section--principles" aria-labelledby="principles-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="principles-title">{{ copy.sections.principles.title }}</h2>
                <p>{{ copy.sections.principles.subtitle }}</p>
            </div>
            <ul class="principles-grid" role="list">
                <li v-for="item in system.items" :key="item" class="principle-card reveal">
                    <span class="principle-card__mark">::</span>
                    <p>{{ item }}</p>
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup>
import { systemSections } from '~/data/systemSections.js';

defineProps({
    copy: {type: Object, required: true},
});

const {lang} = useLanguage();
const system = computed(() => (systemSections[lang.value] || systemSections.en).principles);
</script>

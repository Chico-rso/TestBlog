<template>
    <section class="section section--experience" aria-labelledby="experience-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="experience-title">{{ copy.sections.experience.title }}</h2>
                <p>{{ copy.sections.experience.subtitle }}</p>
            </div>
            <ol class="timeline" role="list">
                <li v-for="item in copy.experience" :key="item.company" class="timeline__item reveal">
                    <div class="timeline__meta">
                        <h3>{{ item.company }}</h3>
                        <span>{{ item.period }}</span>
                    </div>
                    <div class="timeline__body">
                        <p class="timeline__role">{{ item.role }}</p>
                        <p class="timeline__stack">{{ item.stack }}</p>
                        <ul role="list">
                            <li v-for="point in item.bullets" :key="point">{{ point }}</li>
                        </ul>
                    </div>
                </li>
            </ol>
        </div>
    </section>
</template>

<script setup>
defineProps({
    copy: {type: Object, required: true},
});
</script>

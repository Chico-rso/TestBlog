<template>
    <section class="section section--skills" aria-labelledby="skills-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="skills-title">{{ copy.sections.skills.title }}</h2>
                <p>{{ copy.sections.skills.subtitle }}</p>
            </div>
            <ul class="skills-grid" role="list">
                <li v-for="skill in copy.skills" :key="skill.group" class="skill-card reveal">
                    <h3>{{ skill.group }}</h3>
                    <ul role="list">
                        <li v-for="item in skill.items" :key="item">{{ item }}</li>
                    </ul>
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup>
defineProps({
    copy: {type: Object, required: true},
});
</script>

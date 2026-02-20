<template>
    <section class="section section--skills" aria-labelledby="skills-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="skills-title">{{ system.title }}</h2>
            </div>
            <ul class="skills-grid" role="list">
                <li v-for="group in system.groups" :key="group.title" class="skill-card reveal">
                    <h3>{{ group.title }}</h3>
                    <ul role="list">
                        <li v-for="item in group.items" :key="item">{{ item }}</li>
                    </ul>
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup>
defineProps({
    system: {type: Object, required: true},
});
</script>

<template>
    <section class="section section--about" aria-labelledby="about-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="about-title">{{ system.title }}</h2>
                <p>{{ system.intro }}</p>
            </div>
            <div class="profile-grid">
                <article v-for="card in system.cards" :key="card.label" class="profile-card reveal">
                    <span>{{ card.label }}</span>
                    <p>{{ card.value }}</p>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    system: {type: Object, required: true},
});
</script>

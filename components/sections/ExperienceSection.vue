<template>
    <section class="section section--experience" aria-labelledby="experience-title">
        <div class="container">
            <div class="section__head reveal">
                <h2 id="experience-title">{{ system.title }}</h2>
            </div>
            <ol class="approach-timeline" role="list">
                <li v-for="(item, index) in system.items" :key="item.step" class="approach-item reveal"
                    :class="{ 'is-active': activeStep === index }">
                    <button class="approach-item__head" type="button" @click="activeStep = index"
                            :aria-expanded="activeStep === index">
                        <span class="approach-item__step">{{ item.step }}</span>
                        <span class="approach-item__title">{{ item.title }}</span>
                        <span class="approach-item__plus" aria-hidden="true">+</span>
                    </button>
                    <p class="approach-item__short">{{ item.short }}</p>
                    <div class="approach-item__details" :aria-hidden="activeStep !== index">
                        <p>{{ item.full }}</p>
                    </div>
                </li>
            </ol>
        </div>
    </section>
</template>

<script setup>
const activeStep = ref(0);

defineProps({
    system: {type: Object, required: true},
});
</script>

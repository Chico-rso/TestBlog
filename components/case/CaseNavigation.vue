<template>
	<nav class="case-navigation container reveal" :aria-label="project.name">
		<NuxtLink :to="homePath">{{ caseData.backLabel }}</NuxtLink>
		<a :href="publicUrl" target="_blank" rel="noreferrer">
			{{ caseData.externalLabel }}
		</a>
		<a :href="nextProjectUrl" target="_blank" rel="noreferrer">
			{{ caseData.nextLabel }}
		</a>
	</nav>
</template>

<script setup>
defineProps({
	caseData: {type: Object, required: true},
	project: {type: Object, required: true},
	homePath: {type: String, required: true},
	publicUrl: {type: String, required: true},
	nextProjectUrl: {
		type: String,
		required: true,
		validator: (value) => value === 'https://novaya.ru/',
	},
});
</script>

<style scoped lang="scss">
.case-navigation {
	display: flex;
	flex-wrap: wrap;
	gap: 12px 20px;
}
</style>

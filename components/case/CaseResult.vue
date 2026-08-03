<template>
	<section class="case-result container reveal" aria-labelledby="case-result-title" data-case-result>
		<h2 id="case-result-title">{{ heading }}</h2>
		<p>{{ result }}</p>
		<ul class="case-result__technologies" role="list">
			<li v-for="technology in technologies" :key="technology">{{ technology }}</li>
		</ul>
	</section>
</template>

<script setup>
defineProps({
	heading: {type: String, required: true},
	result: {type: String, required: true},
	technologies: {type: Array, required: true},
});
</script>

<style scoped lang="scss">
.case-result {
	display: grid;
	gap: 16px;

	h2,
	p {
		margin: 0;
	}
}

.case-result__technologies {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin: 0;
	padding: 0;
	list-style: none;
}
</style>

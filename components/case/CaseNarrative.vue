<template>
	<section class="case-narrative container">
		<article
			v-for="item in items"
			:key="item.id"
			:id="`case-${item.id}`"
			class="case-narrative__item reveal"
			data-case-narrative
		>
			<h2>{{ item.title }}</h2>
			<p>{{ item.text }}</p>
		</article>
	</section>
</template>

<script setup>
defineProps({
	items: {type: Array, required: true},
});
</script>

<style scoped lang="scss">
.case-narrative {
	display: grid;
	gap: 28px;
}

.case-narrative__item {
	display: grid;
	gap: 10px;

	h2,
	p {
		margin: 0;
	}
}
</style>

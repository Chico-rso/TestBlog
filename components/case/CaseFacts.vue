<template>
	<dl class="case-facts container reveal">
		<div v-for="fact in facts" :key="fact.label" class="case-fact" data-case-fact>
			<dt>{{ fact.label }}</dt>
			<dd>{{ fact.value }}</dd>
		</div>
	</dl>
</template>

<script setup>
defineProps({
	facts: {type: Array, required: true},
});
</script>

<style scoped lang="scss">
.case-facts {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 16px;
	margin-block: 0;
}

.case-fact {
	min-width: 0;

	dd {
		margin: 6px 0 0;
	}
}
</style>

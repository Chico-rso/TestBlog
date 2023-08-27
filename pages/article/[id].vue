<template>
	<div>
		<p>{{ $route.params.id }}</p>
	</div>
</template>

<script setup>
import {useRoute} from "#app";

const route = useRoute();

if (!route.params.id) {
  console.log('Warning! Make sure user is authenticated!')
}

</script>

<style lang="scss" scoped>

</style>

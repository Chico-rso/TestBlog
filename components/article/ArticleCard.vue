<template>
	<div class="article">
		<div class="article__img">
			<img alt="" src="">
		</div>
		<p></p>
		<Button custom-class="black" custom-width="164px" text-value="Читать"></Button>
	</div>
</template>

<script setup>

const props = defineProps({
	Img:
		{
			type: String,
			default: "",
		},
	text:
		{
			type: String,
			default: "",
		},

});
</script>

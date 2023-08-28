<template>
	<div class="input__form">
		<input
			class="input__text"
			:type="type"
			:name="name"
			:id="name"
			:placeholder="placeholder"
			:label="label"
		>
		<label :for="name" class="input__label">{{label}}</label>
	</div>
</template>

<script setup>
const props = defineProps({
	name:
		{
			type: String,
			default: "",
		},
	type:
		{
			type: String,
			default: "text",
		},
	label:
		{
			type: String,
			required: true,
		},
	width:
		{
			type: String,
			default: "300px",
		},
	placeholder:
		{
			type: String,
			default: "Placeholder",
		},
});
</script>
<style lang="scss" scoped>
.input__text
{
	border: none;
	border-bottom: 1px #8D959C solid;
}
</style>

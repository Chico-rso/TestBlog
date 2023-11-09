<template>
	<button
		:class="['btn', 'btn--' + customClass]"
		:style="{maxWidth: customWidth}"
	>
		{{ textValue }}
	</button>
</template>

<script setup>

const props = defineProps({
	textValue:
	{
		type: String,
		default: ''
	},
	customClass:
	{
		type: String,
		default: '',
		required: false
	},
	customWidth:
	{
		type: String,
		default: ''
	}
});
</script>

<style lang="scss">
.btn
{
	border: none;
	padding: 0 50px;
	cursor: pointer;
	color: #ffffff;
	font-size: 18px;
	font-style: normal;
	font-weight: 400;
	line-height: 46px;
	transition: all .3s ease;
	&--blue
	{
		background-color: #3657D3;
		outline: 1px solid #3657D3;
		&:hover
		{
			background-color: transparent;
			outline: 1px solid #3657D3;
		}
	}
	&--black
	{
		background-color: #1B1B1B;
		&:hover{background-color: #3657D3;}
	}
}
</style>

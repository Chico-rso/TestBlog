<template>
	<div class="subscribe">
		<span>Подпишись на рассылку</span>
		<div>
			<Input
				name="email"
				placeholder="Email"
				customWidth="353px"
			/>
			<Button
				textValue="Подписаться"
				customWidth="223px"
				customClass="blue"
			/>
		</div>
	</div>
</template>

<script>
</script>

<style lang="scss">
.subscribe
{
	display: flex;
	justify-content: space-between;
	border-radius: 2px;
	background: var(--text, #1B1B1B);
	padding: 27px 30px;
	span
	{
		color: #FEFEFE;
		font-size: 22px;
		font-style: normal;
		font-weight: 800;
		line-height: 30px;
	}
}
</style>

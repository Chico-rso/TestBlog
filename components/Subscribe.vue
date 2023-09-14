<template>
	<div class="subscribe">
		<h3>Подпишись на рассылку</h3>
		<div class="subscribe__form">
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
	flex-direction: column;
	border-radius: 2px;
	background: var(--text, #1B1B1B);
	padding: 27px 30px;
	h3
	{
		color: #FEFEFE;
		font-size: 18px;
		font-style: normal;
		font-weight: 800;
		line-height: 30px;
	}
	@media (min-width: $tablet)
	{
		flex-direction: row;
		align-items: center;
		h3{margin: 0;}
	}
}
.subscribe__form
{
	text-align: center;
	input{margin-bottom: 10px;}
	@media (min-width: $tablet)
	{
		display: flex;
		gap: 20px;
		align-items: center;
		flex-basis: 45%;
		input{margin-bottom: 0;}
	}
}
</style>

<script>
	export let h1_text = ''
	export let p_text = ''
</script>

<div class="banner-div">
	<div class="banner" id="bannerID">
		<h1>{h1_text}</h1>

		<p>{p_text}</p>
	</div>
</div>

<style lang="scss">
	.banner-div {
		padding-top: 1rem;
		position: initial;
		max-width: 1300px;
		margin-inline: auto;
	}
	#bannerID > * {
		transform: translate(50px, 30px);

        @media only screen and (max-width: 1100px) {
            transform: unset;
        }
	}
	.banner {
		position: relative;
	}
</style>

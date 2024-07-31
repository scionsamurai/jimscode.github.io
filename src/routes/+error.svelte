<script>
	import * as config from '$lib/config'
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>{config.siteName} - privacy policy</title>
</svelte:head>

<div class="main">
	<br />
	<h1 class="brand">{$page.status}: {$page.error?.message}</h1>
	<br />
	<h2 class="brand">Sorry, the page you are looking for was not found.</h2>
	<br />
	<picture class="404_picture">
		<source srcset="/images/404-image.webp" type="image/webp" />
		<source srcset="/images/404-image.png" type="image/png" />
		<img
			src="/images/404-image.png"
			alt="Image of male librarian surrounded by books, with the ones directly in front of him being opened. The librarian has an unsure look on his face."
			class="fourOhfour-image"
		/>
	</picture>
</div>

<style>
	.brand {
		color: var(--brand);
	}

	.fourOhfour-image {
		max-width: 100%;
	}
	.main {
		margin-inline: auto;
		width: 80%;

		background: linear-gradient(
			25deg,
			var(--background-color-second) 75%,
			rgba(255, 255, 255, 0) 87%
		) !important;
		padding: 0 3rem;
		margin-bottom: 1rem;
	}
</style>

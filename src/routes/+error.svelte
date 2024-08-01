<script>
	import * as config from '$lib/config'
	import { page } from '$app/stores'
	const alt_404 = "Image of male librarian surrounded by books, with the ones directly in front of him being opened. The librarian has an unsure look on his face."
</script>

<svelte:head>
	<title>{config.siteName} - privacy policy</title>
</svelte:head>

<div class="main singlePage">
	<br />
	<h1 class="brand">{$page.status}: {$page.error?.message}</h1>
	<br />
	<h2 class="brand">Sorry, the page you are looking for was not found.</h2>
	<br />
	<picture class="404_picture">
		<source srcset="/images/404-image.webp" type="image/webp" />
		<source srcset="/images/404-image.png" type="image/png" />
		<img
			src=""
			alt={alt_404}
			class="fourOhfour-image" />
	</picture>
</div>


<style lang='scss'>
	@import 'src/styles/SinglePage.scss';

	.brand {
		color: var(--brand);
	}

	.fourOhfour-image {
		max-width: 100%;
	}
</style>

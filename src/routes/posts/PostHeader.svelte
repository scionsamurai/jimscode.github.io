<script>
	import { formatDate } from '$lib/utils'
	export let meta
</script>

<hgroup>
	<h1 class="header" id="title">{meta.title}</h1>
</hgroup>
<picture class="banner_picture">
	<source srcset={meta.webp_image} type="image/webp" class="banner-image" />
	<source srcset={meta.image} type="image/png" class="banner-image" />
	<img src="" alt={meta.banner_alt} class="banner-image" />
</picture>
<p>Published: {formatDate(meta.date)}</p>
<div class="categories" data-sveltekit-preload-data="false">
	{#each meta.categories as category}
		<a class="surface-4" href="/categories/{category}">#{category}</a>
	{/each}
</div>

<style lang="scss">
	@import 'src/styles/PostHeader.scss';
</style>

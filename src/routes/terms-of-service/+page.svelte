<script>
	import * as config from '$lib/config'
	import SEO from '../posts/SEO.svelte'
	export let data
</script>


<svelte:head>
	<title>{config.siteName} - terms of service</title>
</svelte:head>


<SEO {data} />

<div role="main" class="singlePage">
	<svelte:component this={data.content} slug={data.slug} />
</div>

<style lang='scss'>
	@import 'src/styles/SinglePage.scss';
</style>

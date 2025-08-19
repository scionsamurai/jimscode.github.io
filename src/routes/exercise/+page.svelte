<script>
	import * as config from '$lib/config'
	export let data
</script>


<svelte:head>
	<title>{config.siteName} - terms of service</title>
</svelte:head>

<iframe src="https://claude.site/public/artifacts/ae995591-1ed4-4a01-9ff2-5c6ef47ab163/embed" title="Claude Artifact" width="100%" height="800px" frameborder="0" allow="clipboard-write" allowfullscreen></iframe>

<div role="main" class="singlePage">
	<svelte:component this={data.content} slug={data.slug} />
</div>

<style lang='scss'>
	@import 'src/styles/SinglePage.scss';
</style>

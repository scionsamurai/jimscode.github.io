<script>
	import * as config from '$lib/config'
	export let data
</script>

<svelte:head>
	{#if data.meta.title}
		<title>{data.meta.title}</title>
	{:else}
		<title>{data.url.substring(1)}</title>
	{/if}
	{#if data.author}
		<meta name="author" content={data.author.name} />
	{/if}
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta property="og:type" content="article" />
	{#if data.meta.title}
		<meta property="og:title" content={data.meta.title} />
	{/if}
	<meta property="og:locale" content="en_US" />
	{#if data.meta.description}
		<meta content={data.meta.description} name="description" />
		<meta content={data.meta.description} property="og:description" />
	{/if}
	<meta content={config.siteName} property="og:site_name" />
	<meta content={config.url} property="og:url" />
	{#if data.meta.image}
		<meta content={config.url + data.meta.image.substring(1)} property="og:image" />
	{/if}
</svelte:head>

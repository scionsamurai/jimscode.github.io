<script lang="ts">
	import * as config from '$lib/config'
	import Banner from '$lib/ui/banner.svelte'
	import PostSection from '$lib/ui/post_section/section.svelte'
    import Pagination from '$lib/ui/Pagination.svelte';

	export let data
    const { pagination } = data;

</script>

<svelte:head>
	<title>{config.siteName} - {data.category}</title>
</svelte:head>

<Banner h1_text="Learn more about {data.category}?", p_text="All posts with that category can be found here!" />

 <PostSection posts={data.posts} />

 <Pagination currentUrl={data.url} page={pagination.page} totalPages={pagination.totalPages} />

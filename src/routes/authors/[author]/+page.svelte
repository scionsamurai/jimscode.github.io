<script lang="ts">
    import * as config from '$lib/config';
    import Banner from '$lib/ui/banner.svelte';
    import PostSection from '$lib/ui/post_section/section.svelte';
    import Pagination from '$lib/ui/Pagination.svelte';

    export let data;
    const { posts, pagination } = data;
</script>

<svelte:head>
	<title>{config.siteName} - {data.author.name}</title>
</svelte:head>

<Banner h1_text="Learn more with {data.author.name}?" p_text="All posts with that author can be found here!" />
<!-- Posts -->
<PostSection posts={data.posts} />

<Pagination currentUrl={data.url} page={pagination.page} totalPages={pagination.totalPages} />

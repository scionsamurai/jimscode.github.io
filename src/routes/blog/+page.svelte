<script lang="ts">
	import * as config from '$lib/config'
	import Banner from '$lib/ui/banner.svelte'
	import PostSection from '$lib/ui/post_section/section.svelte'
    import Pagination from '$lib/ui/Pagination.svelte';

	export let data;
    const { posts, pagination } = data;
</script>

<svelte:head>
	<title>{config.siteName}</title>
</svelte:head>

<Banner style="padding-top: 1rem;position: initial;max-width: 1300px;margin-inline: auto;">
	<div class="banner" id="bannerID">
		<h1>Welcome!</h1>

		<p>Discover tips and tricks to aid you on your coding adventure!</p>
	</div>
</Banner>
<!-- Posts -->
 <PostSection posts={data.posts} />

 <Pagination currentUrl={data.url} page={pagination.page} totalPages={pagination.totalPages} />

<style>
	#bannerID > * {
		transform: translate(50px, 30px);
	}

</style>

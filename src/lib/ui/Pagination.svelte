<script lang="ts">
	import { goto } from '$app/navigation'
	export let page: number
	export let totalPages: number
	export let currentUrl: string

	function getHref(newPage: number) {
		let path = currentUrl

		if (path === '/blog' && newPage === 1) {
			return '/' // Navigate to the home page
		} else if ((path === '/blog' && newPage > 1) || (path === '/' && newPage === 2)) {
			return `blog?page=${newPage}`
		} else if (path.includes('/authors/') || path.includes('/categories/')) {
			return `${path}?page=${newPage}`
		}

		return `${path}?page=${newPage}`
	}
	async function changePage(newPage: number) {
		const href = getHref(newPage)
		await goto(href, { replaceState: true })
		page = newPage
	}
</script>

{#if totalPages > 1}
	<div class="pagination">
		{#if page > 1}
			<a href={getHref(page - 1)} on:click|preventDefault={() => changePage(page - 1)}>Previous</a>
		{/if}

		<span>Page {page} of {totalPages}</span>

		{#if page < totalPages}
			<a href={getHref(page + 1)} on:click|preventDefault={() => changePage(page + 1)}>Next</a>
		{/if}
	</div>
{/if}

<style>
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		width: fit-content;
		margin-inline: auto;
		padding: 1rem;
		border: 1px solid var(--brand);
		border-radius: var(--radius-4);
		margin-bottom: 1.5rem;
	}
	.pagination a {
		text-decoration: none;
		cursor: pointer;
	}
	.pagination span {
		font-weight: bold;
	}
</style>

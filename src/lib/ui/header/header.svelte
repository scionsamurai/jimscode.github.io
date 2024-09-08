<script lang="ts">
	import Toggle from '$lib/ui/theme-toggle.svelte'
	import * as config from '$lib/config'
	import { onMount } from 'svelte'

	import Search from '$lib/ui/header/search/search.svelte'

	export let url

	onMount(() => {
		const searchArea = document.getElementById('search_area')
		if (searchArea) {
			searchArea.innerHTML = ''
			const searchComponent = new Search({
				target: searchArea
			})
		}
	})
</script>

<nav class="navbar">
	<div class="name-and-icon">
		{#if url == '/'}
			<b>{config.siteName}</b>
		{:else}
			<a href="/" class="name">
				<b>{config.siteName}</b>
			</a>
		{/if}
	</div>
	<div role="search" class="navbar_right" id="search_area">
		<form method="get" action="http://www.google.com/search" class="no-js-search">
			<input type="text" name="q" size="15" placeholder="Search" class="no-js-search__input" />
			<button type="submit" value="Search" class="no-js-search__button">Search</button>
			<input
				type="checkbox"
				name="sitesearch"
				class="nodisplay no-js-search__checkbox"
				value={config.url.includes('www.') ? config.url.split('www.')[1] : config.url}
			/>
		</form>
	</div>
</nav>
<Toggle />

<div class="corner-color"></div>

<style lang="scss">
	b {
		-webkit-user-select: none; /* Safari */
		-ms-user-select: none; /* IE 10 and IE 11 */
		user-select: none; /* Standard syntax */
		font-size: var(--size-9);
		padding-left: 1rem;
		text-shadow: 2px 2px black;
		color: var(--link-color);
	}
	b:hover {
		text-shadow: 3px 3px black;
	}
	b:active {
		text-shadow: 1px 1px black;
	}
	.corner-color {
		min-height: 20rem;
		width: 100%;
		z-index: 0;
		position: absolute;
		top: 0;
		left: 0;
		background: linear-gradient(25deg, rgba(255, 255, 255, 0) 75%, var(--font-color) 100%);
	}
	nav {
		width: 90%;
		max-width: 1550px;
		margin-inline: auto;
		padding: 1rem;
		border-radius: 1rem;
		z-index: 2;
    	position: relative;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		background: linear-gradient( 25deg, var(--off-brand) 25%, rgba(255, 255, 255, 0) 87% ) !important;
		@media only screen and (max-width: 1100px) {
			width: 92%;
		}
	}
	a {
		color: inherit;
		text-decoration: none;
	}

	@media (min-width: 768px) {
		nav {
			display: flex;
			justify-content: space-between;
		}
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte'
	import Footer from '../lib/ui/footer.svelte'
	import Header from '../lib/ui/header/header.svelte'
	import PageTransition from '$lib/ui/transition.svelte'

	import '../app.scss'

	export let data

	onMount(() => {
		const arrowDiv = document.getElementById('arrow-div-id')
		arrowDiv.classList.add('nodisplay')
		window.addEventListener('scroll', () => {
			if (window.scrollY < 500) {
				// add noDisplay class to hide arrow
				arrowDiv.classList.add('nodisplay')
			} else {
				arrowDiv.classList.remove('nodisplay')
			}
		})
	})
</script>

<div class="layout">
	<!-- Header -->
	<Header url={data.url} />
	<a
		href="#top-of-site"
		class="pointer"
		id="arrow-div-id"
		aria-label="Scroll to top"
		onkeypress={(event) => {
			if (event.keyCode === 13) window.scrollTo(0, 0)
		}}
		tabindex="0"
		on:click={() => window.scrollTo(0,0)}
	>
		<div class="up arrow" id="backToTopArrow"></div>
		<p id="TopArrowText">Back to top</p>
	</a>
	<main>
		<PageTransition url={data.url}>
			<slot />
		</PageTransition>
	</main>

	<!-- Footer -->
	<Footer />
</div>

<noscript>
	<link rel="stylesheet" href="/NoJS.css" />
</noscript>

<style>
	main {
		z-index: 1;
  		position: relative; 
		/* otherwise the about-us and other pages get top section overlapped by corner-color */
	}
	.up {
		transform: rotate(-135deg);
		-webkit-transform: rotate(-135deg);
	}
	.arrow {
		display: inline-block;
		padding: 3px;
	}
	#TopArrowText {
		line-height: 1;
		position: relative;
		width: 8rem;
		left: -20px;
		top: 8px;
		display: none;
		color: var(--brand);
	}
	a:hover #TopArrowText {
		display: block;
	}
	#arrow-div-id {
		background: var(--font-color);
		position: fixed;
		bottom: 3rem;
		left: 2rem;
		height: 3rem;
		width: 3rem;
		border-radius: 5rem;
		text-align: center;
		z-index: 4;
	}
	#backToTopArrow {
		width: 1rem;
		height: 1rem;
		border: solid var(--brand);
		border-width: 0 3px 3px 0;
		margin-top: 1rem;
	}


	@media (min-width: 1440px) {
		.layout {
			padding-inline: 0;
		}
	}
</style>

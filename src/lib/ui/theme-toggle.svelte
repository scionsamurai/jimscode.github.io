<script lang="ts">
	import { fly } from 'svelte/transition'
	import { theme, toggleTheme } from '$lib/theme'
</script>

<div class="color-pallete" on:click={toggleTheme} role="presentation">
	<label for="night"></label>
	<!-- 🌙 -->
	<label for="day"></label>
	<!-- ☀️ -->
</div>

<style>
	label {
		z-index: 100;
	}

	[for='day'],
	[for='night'] {
		width: 90px;
		height: 60px;
		position: absolute;
		top: 60px;
		right: 2rem;
		background: transparent url('/images/colormodebutton.png') no-repeat;
	}

	/* Add padding to increase the clickable area */
	[for='day'] {
		background-position: 94% 50%;
	}

	[for='night'] {
		background-position: 6% 50%;
	}

	[for='day'],
	[for='night'] {
		cursor: pointer;
	}

	@media (max-width: 767px) {
		/* p {
		  font-size: 0.9rem;
	  } */
		[for='day'],
		[for='night'] {
			top: 25px;
		}
	}
</style>

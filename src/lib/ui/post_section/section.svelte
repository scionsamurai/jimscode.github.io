<script>
	import Post from '$lib/ui/flipcard/post.svelte'

	export let posts = []
</script>

<section>
	<ul class="posts">
		{#each posts as post}
			<li class="post">
				<Post {post} />
			</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	section {
		min-height: 30rem;
		max-width: 100%;
		min-width: 60vw;
		padding-bottom: 2rem;
		max-inline-size: 1440px;
		margin-inline: auto;
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		padding: 0;
		list-style: none;
		width: 100%;

		@media only screen and (max-width: 1100px) {
			display: block;
			max-width: 85vw;
			margin-inline: auto;
		}

		@media only screen and (max-width: 800px) {
			display: block;
			max-width: 100%;
		}

		li {
			width: 50%;
			max-width: 865px;

			&:nth-child(odd) {
				margin-top: 7rem;
				@media only screen and (max-width: 1100px) {
					margin-top: 1rem;
					margin-right: 10rem;
				}

				@media screen and (max-width: 768px) {
					margin-top: 1rem;
					margin-right: 0;
				}
			}
			&:nth-child(even) {
				margin-top: 1rem;
				@media only screen and (max-width: 1100px) {
					margin-top: 1rem;
					margin-left: 10rem;
				}

				@media screen and (max-width: 768px) {
					margin-top: 1rem;
					margin-left: 0;
				}
			}

			&:nth-child(1) {
				@media only screen and (max-width: 1100px) {
					margin-top: 4rem;
				}

				@media screen and (max-width: 768px) {
					margin-top: 4rem;
				}
			}
			&:nth-child(2) {
				margin-top: 0;
				@media only screen and (max-width: 1100px) {
					margin-top: 1rem;
				}
			}

			@media only screen and (max-width: 1100px) {
				width: unset;
				margin-top: 2rem;
			}

			@media screen and (max-width: 768px) {
				width: 100%;
			}
		}
	}
</style>

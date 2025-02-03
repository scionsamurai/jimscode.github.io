<script>
	import { formatDate } from '$lib/utils'
	export let post
</script>

<article>
	<div class="postDiv_main_content">
		<input type="checkbox" id="checkbox_{post.slug}" tabindex="0" style="display: none;" />
		<label for="checkbox_{post.slug}" aria-label="Toggle Card" class="container">
			<span class="card-front">
				<div class="card front">
					<a href="/posts/{post.slug}" class="btn-link">
						<h2>{post.title}</h2>
					</a> <img src={post.image_thumb} alt={post.banner_alt} class="image" />
					<p>Click for more info, click title to go to post.</p>
				</div>
			</span>
			<span class="card-back">
				<div class="card back">
					<div class="flex-between">
						<p>By: <a class="abtn" href="/authors/jimmy-ruikka">Jimmy Ruikka</a></p>
						<p>{formatDate(post.date)}</p>
					</div>
					<p>
						{post.description}
					</p>
					<p>
						Categories:
						{#each post.categories as category}
							<a class="abtn" href="/categories/{category}">{category}</a>
						{/each}
					</p>
					<br />
					<div class="flex-between">
						<p style="text-align: end;">Click for front of card</p>
						<a href="/posts/{post.slug}" class="post-link btn-cta">Go to post→</a>
					</div>
				</div>
			</span>
			<span class="additional-text">
				<p>
					This is a card element with general information/links about the post on the front and a
					description of the post on the back. You can click to flip this card.
				</p>
			</span>
		</label>
	</div>
</article>

<style lang="scss">
	img {
		max-width: 100%;
	}
	.abtn {
		padding: 0 0.5rem !important;
	}
	.postDiv_main_content {
		flex-grow: 1;
		min-height: 8rem;
		display: flex;
		flex-flow: column;
		justify-content: space-around;
		width: 100%;
	}
	.card-front {
		display: flex;
	}
	.front {
		background: var(--background-color-second);
		max-width: 460px;
		padding: 1rem;
	}
	.btn-link {
		min-height: 40px;
		display: block;
	}
	a {
		text-decoration: none;

	}
	a:hover {
		text-decoration: underline;
	}
	.btn-link h2 {
		text-align: center;
	}
	.card-back {
		background: var(--background-color-second);
		height: fit-content;
		min-height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
	.flex-between {
		display: flex;
		justify-content: space-between;
	}

	.container {
		display: block;
		perspective: 600px;
		position: relative;
		transition: transform 0.1s ease-out;
		will-change: transform;
		transition-duration: 0.4s;
	}
	.card {
		cursor: pointer;
		position: absolute;
		/* background: yellow; */
		top: 0;
		left: 0;
		backface-visibility: hidden;
		transform-style: preserve-3d;
		transition:
			transform 0.4s ease-in-out,
			box-shadow 0.4s ease-in-out;
		will-change: transform, box-shadow;
		transition-duration: 0.6s;
	}

	.front {
		background-size: cover;
		position: relative;
		transform: rotateX(0deg) rotateY(0deg);
	}

	.back {
		background: rgba(0, 0, 0, 0.1);
		transform: rotateY(-180deg);
		width: 100%;
		height: 100%;
		background: var(--background-color-second);
		height: fit-content;
		min-height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
	.back > * {
		padding: 0 1rem;
	}
	.back :nth-child(2) {
		padding: 0 2rem;
	}

	input[type='checkbox']:checked ~ .container .card {
		transform: rotateY(180deg);
	}

	input[type='checkbox']:checked ~ .container .back {
		visibility: visible;
		transform: rotateX(0deg) rotateY(0deg);
		animation: none;
		position: absolute;
	}

	.container,
	.card {
		transition-property: transform;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		margin: auto;
		width: 100%;
	}

	.card {
		transition-duration: 0.6s;
		box-shadow: 0 0 20px var(--background-color-dark);
	}

	.card:hover {
		box-shadow: 0 0 35px var(--background-color-dark);
	}

	input[type='checkbox']:checked ~ .container .card {
		animation: none;
	}

	input[type='checkbox']:checked ~ .container .back {
		animation: none;
	}

	.additional-text {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
</style>

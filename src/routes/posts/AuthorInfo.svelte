<script>
	export let author
</script>

<div class="about-me">
	<div class="avatar-container">
		<img src={author.gravatar} alt="Avatar" class="lazyload profile-picture" />
	</div>
	About:<a href="/authors/{author.slug}" class="author-link">{author.name}</a>
	<hr />
	<p>{author.bio_short}</p>
</div>


<style lang="scss">
	@import 'src/styles/AuthorInfo.scss';
</style>

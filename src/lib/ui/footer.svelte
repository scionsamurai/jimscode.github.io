<script lang="ts">
	import * as config from '$lib/config'
</script>

<!-- Footer -->
<footer>
	<div class="footer-content">
		<div class="footer-section">
			<h4 class="dont-link">About</h4>
			<p>
				Embark on a coding journey with Jims Code Blog - your go-to destination for insightful
				tutorials, innovative projects, and the latest trends in the dynamic world of software
				development.
			</p>
		</div>
		<div class="footer-section">
			<h4 class="dont-link">Contact</h4>
			<a href={`mailto:${config.email}`}>{config.email}</a>
		</div>
		<ul class="footer-section">
			<li><a href="/rss.xml" target="_blank">RSS</a></li>
			<li><a href="/sitemap">Sitemap</a></li>
			<li><a href="/about-us">About Us</a></li>
			<li><a href="/privacy-policy">Privacy Policy</a></li>
			<li><a href="/terms-of-service">Terms of Service</a></li>
		</ul>
		<p class="footer-disclaimer">
			<strong>Disclaimer:</strong> The information provided on this blog is for educational and informational
			purposes related to coding and software development. We do not guarantee the accuracy, completeness,
			or reliability of any information presented. Readers are encouraged to conduct their own research,
			practice due diligence, and consult with professionals for coding-related decisions and implementation.
		</p>

		<p class="footer-bottom">{config.siteName} &copy {new Date().getFullYear()}</p>
	</div>
</footer>

<style>
	footer {
		padding-block: var(--size-7);
	}

	p {
		color: var(--text-2);
	}
	/* Common styles */
	footer {
		background: var(--background-color-second);
		position: relative;
		z-index: 2;
		padding: 20px;
		text-align: center;
		border-radius: var(--radius-8) var(--radius-8) 0 0;
	}

	.footer-content {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}

	.footer-section {
		flex-basis: 25%;
		padding: 10px;
	}

	.footer-section h4 {
		font-size: 16px;
		margin-bottom: 10px;
	}

	.footer-bottom {
		font-size: 14px;
	}

	.footer-bottom:before {
		display: inline-block;
		margin-right: 5px;
	}

	a {
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	/* Responsive styles */
	@media screen and (max-width: 768px) {
		.footer-section {
			flex-basis: 50%;
		}
	}
	@media screen and (max-width: 480px) {
		.footer-section {
			flex-basis: 100%;
		}
	}
</style>

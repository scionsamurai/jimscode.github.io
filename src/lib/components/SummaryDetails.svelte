<script>
	export let summary

	function toggleExpanded() {
		var summary = event.target
		var expanded = summary.getAttribute('aria-expanded') === 'true' || false
		summary.setAttribute('aria-expanded', !expanded)
	}
</script>

<details role="group">
	<summary role="button" aria-expanded="false" on:click={toggleExpanded}>
		{summary}
	</summary>
	<slot />
</details>

<style>
	details,
	details[open] {
		border-radius: 5px;
		padding: 10px;
		color: var(--font-color);
		margin-bottom: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: var(--background-color-second);
	}

	summary {
		font-weight: bold;
		cursor: pointer;
		user-select: none;
		text-decoration: underline;
		text-underline-offset: 5px;
		position: relative;
		padding: 0 0 0 25px;
		margin-bottom: 8px;
		line-height: 1.5em;
		display: flex;
	}

	summary::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 20px;
		height: 20px;
		margin-right: 10px;
		text-align: center;
		border-radius: 50%;
		background-color: var(--opposite-font-color);
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	}

	summary:hover::before {
		background-color: var(--font-color);
	}

	details[open] > summary::after {
		content: '\2714';
		position: absolute;
		color: var(--brand);
		left: 0;
		top: -1px;
		font-size: 24px;
	}

	details summary::after {
		content: '';
	}
	details summary {
		color: var(--brand);
	}

	details[open] summary {
		color: var(--off-brand);
	}
</style>

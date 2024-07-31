<script>
	export let label
	export let group_name
	export let checked = false
	const id = 'tab-' + Math.random().toString(36).substr(2, 9)
</script>

<div class="tab" role="tab">
	<input
		type="radio"
		{id}
		name={group_name}
		role="tab"
		tabindex="0"
		aria-selected="true"
		{checked}
	/>
	<label for={id} style="outline: none;">
		{label}
	</label>
	<div class="content" role="tabpanel" aria-labelledby={id}>
		<slot />
	</div>
</div>

<style>
	.tab {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.tab label {
		background: #eee;
		padding: 10px;
		border: 1px solid #ccc;
		cursor: pointer;
		flex-shrink: 0;
	}
	.tab [type='radio'] {
		display: none;
	}
	.content {
		display: none;
		padding: 20px;
		border: 1px solid #ccc;
		flex-grow: 1;
		overflow-y: auto;
	}
	[type='radio']:checked + label {
		background: var(--background-color-second);
		border-bottom: 1px solid white;
		z-index: 2;
		cursor: unset;
	}
	[type='radio']:not(:checked) + label {
		background: var(--background);
		color: var(--brand);
		border-bottom: 1px solid white;
		z-index: 2;
	}
	[type='radio']:checked + label + .content {
		display: block;
	}
</style>

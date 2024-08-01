<script>
	import { onMount } from 'svelte'

	export let fileList = []
	export let containerId = 'fileList'
	export let slug

	let htmlCode = ''
	let cssCode = ''
	let jsCode = ''
	let filesLoaded = []
	let showEditorType = 'html'

	const fetchFileContent = async (fileHref, index) => {
		const response = await fetch(`/examples/${slug}/${fileHref}`)
		const data = await response.text()
		if (fileHref.toLowerCase().endsWith('css')) {
			cssCode += data
		} else if (fileHref.toLowerCase().endsWith('html')) {
			htmlCode += data
		} else if (fileHref.toLowerCase().endsWith('js')) {
			jsCode += data
		}
		filesLoaded[index] = true
	}

	const loadFiles = async () => {
		filesLoaded = Array(fileList.length).fill(false)
		const promises = fileList.map((fileHref, index) => fetchFileContent(fileHref, index))
		await Promise.all(promises)
	}

	const popOut = (html, css, js) => {
		const popOutWindow = window.open(
			'',
			'_blank',
			'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600'
		)
		popOutWindow.document.open()
		popOutWindow.document.write(
			`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css}</style></head><body>${html}<script>${js}</scr${'ipt>'}</body></html>`
		)
		popOutWindow.document.close()
	}

	const compileAndRun = (html, css, js) => {
        showEditorType = ''
		const resultHTML = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}</scr${'ipt>'}</body></html>`
		const iframe = document.getElementById('result-container')
		iframe.srcdoc = resultHTML
	}

	const downloadAsHTML = (html, css, js) => {
		const resultHTML = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}</scr${'ipt>'}</body></html>`
		const blob = new Blob([resultHTML], { type: 'text/html' })
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = 'index.html'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	onMount(async () => {
		await loadFiles()
		compileAndRun(htmlCode, cssCode, jsCode)
	})

	const showEditor = (type) => {
		showEditorType = type
	}
</script>

<div id={containerId}>
	{#if filesLoaded.every((v) => v === true)}
		<div id="snippetEditor-container">
			<div id="snippetEditor-buttons" style="display: flex; justify-content: space-between;">
				<div>
					<button on:click={() => showEditor('html')} class="btn-cta">HTML</button>
					<button on:click={() => showEditor('css')} class="btn-cta">CSS</button>
					<button on:click={() => showEditor('js')} class="btn-cta">JS</button>
				</div>
				<div>
					<button on:click={() => popOut(htmlCode, cssCode, jsCode)} class="btn-cta">pop out</button
					>
					<button on:click={() => downloadAsHTML(htmlCode, cssCode, jsCode)} class="btn-cta"
						>Download</button
					>
					<button on:click={() => compileAndRun(htmlCode, cssCode, jsCode)} class="btn-cta"
						>Run</button
					>
				</div>
			</div>
			{#if showEditorType === 'html'}
				<textarea bind:value={htmlCode} class="snippetEditor" spellcheck="false" style="display: {!showEditorType ? 'none' : 'block'};"></textarea>
			{/if}
			{#if showEditorType === 'css'}
				<textarea bind:value={cssCode} class="snippetEditor" spellcheck="false" style="display: {!showEditorType ? 'none' : 'block'};"></textarea>
			{/if}
			{#if showEditorType === 'js'}
				<textarea bind:value={jsCode} class="snippetEditor" spellcheck="false" style="display: {!showEditorType ? 'none' : 'block'};"></textarea>
			{/if}
			<iframe id="result-container" title="Code Editor" style="display: {showEditorType ? 'none' : 'block'};"></iframe>
		</div>
	{/if}
</div>

<style>
	#snippetEditor-container {
		height: 100vh !important;
		background-color: var(--background-color-second);
	}

	#snippetEditor-container iframe {
		width: 99% !important;
	}

	textarea,
	iframe {
		height: 80vh !important;
	}
	#snippetEditor-container {
		height: 20rem;
		position: inherit;
		width: 100%;
	}
	#snippetEditor-container iframe {
		width: 97%;
		height: 16rem;
		margin: 0 auto;
	}
	#snippetEditor-container textarea {
		white-space: pre;
		overflow-x: scroll;
	}

	#snippetEditor-buttons {
		background-color: var(--background-color-second);
		padding: 10px;
		align-items: center;
	}

	#snippetEditor-buttons button {
		margin: 5px;
	}

	#result-container {
		border: none;
		width: 99%;
		height: 100%;
	}

	.snippetEditor {
		display: none;
		width: 97%;
		height: 16rem;
		margin: 0 auto;
	}
</style>

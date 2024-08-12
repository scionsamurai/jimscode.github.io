<script>
	import TableOfContents from '$lib/components/TableOfContents.svelte'

	let contentEditable
	let editedContentEditable

	function getInnerTextFromHtmlString(htmlString) {
		// Create a temporary DOM element
		const tempElement = document.createElement('div')

		// Set the innerHTML of the temporary element to the HTML string
		tempElement.innerHTML = htmlString

		// Function to recursively extract text with newlines
		function extractTextWithNewlines(element) {
			let text = ''
			element.childNodes.forEach((node) => {
				if (node.nodeType === Node.TEXT_NODE) {
					text += node.textContent
				} else if (node.nodeType === Node.ELEMENT_NODE) {
					if (node.tagName === 'BR') {
						text += '\n'
					} else {
						text += extractTextWithNewlines(node)
						if (['P', 'DIV', 'SECTION', 'ARTICLE'].includes(node.tagName)) {
							text += '\n'
						}
					}
				}
			})
			return text
		}

		// Retrieve and return the formatted text
		return extractTextWithNewlines(tempElement).trim()
	}
	$: {
		if (contentEditable) {
			populateHeaders(contentEditable)

			// Create editedContentEditable with ids
			const tempDiv = document.createElement('div')
			tempDiv.innerHTML = contentEditable

			let headerCounter = 0
			tempDiv.querySelectorAll('*').forEach((element) => {
				const text = element.textContent.trim()
				if (text.startsWith('## ') || text.startsWith('### ')) {
					headerCounter++
					const level = text.startsWith('## ') ? 2 : 3
					const headerText = text.replace(/^#+\s/, '').trim()
					const id = generateId(headerText, headerCounter)
					element.id = id
				}
			})

			editedContentEditable = tempDiv.innerHTML
		} else {
			editedContentEditable = ''
		}
	}
	const generateId = (text, index) => {
		let id = text.toLowerCase().replace(/\s+/g, '-')
		id = id.replace(/[^a-z0-9_-]/g, '')
		id = id.replace(/^[0-9-]/, '')
		id += `-${index}`
		return id || `header-${index}`
	}
	let headers = []

	function populateHeaders(content) {
		if (!content) return

		const lines = getInnerTextFromHtmlString(content).split('\n')
		headers = []
		let currentH2 = null
		let headerCounter = 0

		for (const line of lines) {
			if (line.startsWith('## ') || line.startsWith('### ')) {
				headerCounter++
				const level = line.startsWith('## ') ? 2 : 3
				const text = line.replace(/^#+\s/, '').trim()
				const id = generateId(text, headerCounter)

				if (level === 2) {
					currentH2 = { text, id, children: [] }
					headers.push(currentH2)
				} else if (level === 3 && currentH2) {
					currentH2.children.push({ text, id })
				}
			}
		}
	}
</script>

<div role="main" class="singlePage">
	<div class="instructions">
		<br />
		<h2>Using Grammarly with VSCode</h2>
		<p>
			This page provides a simple yet effective trick to use Grammarly to check your Markdown files
			from VSCode. Follow these steps:
		</p>
		<div class="note">
			<strong>Note:</strong> You need to have the Grammarly web browser plugin installed and activated
			for this to work.
		</div>
		<ol>
			<li>Open your Markdown file in VSCode.</li>
			<li>Copy all the Markdown content from your file.</li>
			<li>
				Paste the copied content into the input box below. See your theme highlighted copy over,
				too? How exciting!
			</li>
			<li>
				Grammarly will automatically start checking the text, and you can make corrections directly
				within the input box.
			</li>
			<li>Once you're done with the corrections, copy the updated Markdown from the input box.</li>
			<li>Paste the corrected Markdown back into your Markdown file in VSCode.</li>
		</ol>
		<p>Use the input box below to paste and edit your Markdown content:</p>
	</div>
	<div class="split">
		<div class="content">
			<div bind:innerHTML={contentEditable} contenteditable="true" class="contenteditable"></div>
			<div
				bind:innerHTML={editedContentEditable}
				contenteditable="true"
				class="shadow contenteditable"
			></div>
			<p>Copy the corrected text back to your Markdown file in VSCode once you're done.</p>
		</div>
		<aside class="sidebar">
			{#if headers.length}
				<TableOfContents {headers} />
			{/if}
		</aside>
	</div>
</div>

<style lang="scss">
	.sidebar {
		min-width: 20rem;
	}
	.singlePage {
		display: flex;
		flex-direction: column;
		width: 80%;
		margin-inline: auto;
	}
	.content {
		width: 100%;
		position: relative;
	}
	.split {
		flex-grow: 1;
		width: 100%;
		max-width: 1200px;
		display: flex;
	}
  .split:not(:has(.contenteditable div)) {
    max-width: 100%;
    margin-left: 5rem;
  }
	div[contenteditable] {
		border: 1px solid #ccc;
		padding: 10px;
		min-height: 200px;
		margin-top: 20px;
		font-family: monospace;
		white-space: pre-wrap;

		& > div {
			overflow-x: scroll;
		}
	}
	.shadow {
		position: absolute;
		top: 0;
		width: 100%;
		visibility: hidden;
	}
	.instructions {
		font-family: Arial, sans-serif;
		margin-bottom: 20px;
		width: 80%;
		margin-inline: auto;
	}

	.instructions h2 {
		margin-top: 0;
	}

	.instructions p {
		margin: 5px 0;
	}

	.instructions ol {
		margin: 15px 0;
	}

	.instructions pre {
		padding: 10px;
		border-radius: 5px;
		overflow-x: auto;
	}

	.note {
		padding: 10px;
		border-left: 5px solid #ffeeba;
		margin-bottom: 20px;
	}

	#toc {
		background-color: #f8f8f8;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 10px;
		margin-bottom: 20px;
	}

	#toc h2 {
		margin-top: 0;
	}

	#toc ul {
		list-style-type: none;
		padding-left: 0;
	}

	#toc li {
		margin-bottom: 5px;
	}

	.toc-level-2 {
		margin-left: 0;
	}

	.toc-level-3 {
		margin-left: 20px;
	}
</style>

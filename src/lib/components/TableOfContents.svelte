<script>
	import { onMount } from 'svelte'
	export let headers

	
	let activeHeader = ''
	let tocElement
	let progress = 0
	let progressBarElement

	$: flattenedHeaders = headers.flatMap((header) => [header, ...(header.children || [])])

	function addHeaderListeners() {
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener('click', function (e) {
				e.preventDefault()
				const target = document.querySelector(this.getAttribute('href'))
				if (target) {
					// uncheckCheckboxById('sidebar_checkbox');
					// console log somehting
					
					smoothScrollTo(target)
					const toc = document.getElementById('toggle_sidebar_on_mobile')
					if (toc.checked) toc.checked = false
				}
			})
		})
	}

	let isSmoothScrolling = false
	function smoothScrollTo(target) {
		isSmoothScrolling = true

		target.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		})

		setTimeout(() => {
			isSmoothScrolling = false
		}, 500)
	}

	function scrollTocToActiveHeader() {
		if (isSmoothScrolling) return
		if (tocElement && activeHeader) {
			const activeElement = tocElement.querySelector(`a[href="#${activeHeader}"]`)
			if (activeElement) {
				tocElement.scrollTop = activeElement.offsetTop - 40 - tocElement.offsetTop
			}
		}
	}
	onMount(() => {
		addProgressBar()
		addHeaderListeners()
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeHeader = entry.target.id
						updateProgress()
						scrollTocToActiveHeader()
					}
				})
			},
			{ rootMargin: '-100px 0px -66%' }
		)

		flattenedHeaders.forEach((header) => {
			const element = document.getElementById(header.id)
			if (element) observer.observe(element)
		})

		return () => {
			observer.disconnect()
		}
	})

	function updateProgress() {
		const currentIndex = flattenedHeaders.findIndex((header) => header.id === activeHeader)
		progress = ((currentIndex + 1) / flattenedHeaders.length) * 100
		if (progressBarElement) {
			progressBarElement.querySelector('.toc-progress').style.width = `${progress}%`
		}
	}

	function addProgressBar() {
		const tocElement = document.getElementById('toc')
		progressBarElement = document.createElement('div')
		progressBarElement.className = 'toc-progress-bar'
		progressBarElement.innerHTML = '<div class="toc-progress"></div>'
		tocElement.appendChild(progressBarElement)
	}
</script>

<label for="toggle_sidebar_on_mobile" class="mobile-toc-button">Table of Contents</label>
<input type="checkbox" id="toggle_sidebar_on_mobile" class="nodisplay" />
<input type="checkbox" id="sidebar_checkbox" class="nodisplay" />
<div class="headers">
	<div role="navigation" id="toc">
		<div class="flex space-around toc-top">
			<h3 class="dont-link">In this article</h3>
			<label for="sidebar_checkbox" class="sidebar_button pointer">
				<div class="sidebar_checkbox__arrow"></div>
			</label>
		</div>
		<hr />
		<nav class="table-of-contents" bind:this={tocElement}>
			<ul>
				{#each headers as header}
					<li class:active={activeHeader === header.id}>
						<a href="#{header.id}">{header.text}</a>
						{#if header.children.length > 0}
							<ul>
								{#each header.children as childHeader}
									<li class:active={activeHeader === childHeader.id}>
										<a href="#{childHeader.id}">{childHeader.text}</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>
	</div>
	<slot />
</div>

<style lang="scss">
	@import 'src/styles/TableOfContents.scss';
</style>

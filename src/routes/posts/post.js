function fallbackCopyTextToClipboard(text) {
	const textArea = document.createElement('textarea')
	textArea.value = text
	document.body.appendChild(textArea)
	textArea.select()
	document.execCommand('copy')
	document.body.removeChild(textArea)
	console.log('Code copied successfully! (using fallback)')
}

export async function updateCopyLinks() {
	// Select all pre elements
	const codeBlocks = document.querySelectorAll('pre')

	// Loop through each pre element
	for (const codeBlock of codeBlocks) {
		// Get the language from the data-lang attribute
		const lang = codeBlock.getAttribute('data-lang')
		if (lang !== 'null') {
			// Create the new span element
			const linkAndCopySpan = document.createElement('span')
			linkAndCopySpan.className = 'hljs__link_and_copy'

			// Create and set up the copy link
			const copyLink = document.createElement('span')
			copyLink.className = 'link_and_copy__copy_link pointer'
			copyLink.innerHTML = '&#x2398;&nbsp;'

			// Create and set up the language text
			const langText = document.createElement('span')
			langText.className = 'link_and_copy__text'
			langText.textContent = lang

			// Append the copy link and language text to the main span
			linkAndCopySpan.appendChild(copyLink)
			linkAndCopySpan.appendChild(langText)

			// Append the main span to the pre element
			codeBlock.appendChild(linkAndCopySpan)

			// Add click event listener to the copy link
			copyLink.addEventListener('click', function handleClick(event) {
				event.preventDefault()

				// Get the code content (excluding the newly added span)
				const codeContent = codeBlock.cloneNode(true)
				const linkAndCopySpan = codeContent.querySelector('.hljs__link_and_copy')
				if (linkAndCopySpan) {
					linkAndCopySpan.remove()
				}
				const cleanCodeContent = codeContent.textContent.trim()

				// Copy the content to the clipboard
				if (navigator.clipboard) {
					navigator.clipboard.writeText(cleanCodeContent).then(
						() => console.log('Code copied successfully!'),
						(error) => {
							console.error('Error copying code:', error)
							fallbackCopyTextToClipboard(cleanCodeContent)
						}
					)
				} else {
					// Fallback for browsers that do not support navigator.clipboard
					fallbackCopyTextToClipboard(cleanCodeContent)
				}

				copyLink.innerHTML = '&#x2713;&nbsp;'
				setTimeout(() => (copyLink.innerHTML = '&#x2398;&nbsp;'), 2000)
			})
		}
	}
}

export function closeShareLinks() {
	const shareToggle = document.getElementById('share-toggle')
	const shareLinks = document.getElementById('share-links')
	const shareBtn = document.getElementById('share-btn')

	document.addEventListener('click', function (event) {
		const target = event.target
		if (
			shareToggle.checked == true &&
			target != shareBtn &&
			target != shareToggle &&
			!shareLinks.contains(target)
		)
			shareToggle.checked = false
	})
}
export function closeMobileTableOfContents() {
    const tocToggle = document.getElementById('toggle_sidebar_on_mobile');
    const toc = document.getElementById('toc');
    const tocButton = document.querySelector('.mobile-toc-button');

    document.addEventListener('click', function(event) {
        const target = event.target;
        if (
            tocToggle.checked === true &&
            target !== tocButton &&
            target !== tocToggle &&
            !toc.contains(target)
        ) {
            tocToggle.checked = false;
        }
    });
}

export function changeGiscusTheme() {
    const nightRadioButton = document.getElementById('night');
    const isNightTheme = nightRadioButton.checked;

    // Determine the Giscus theme based on the state of the radio button
    const theme = isNightTheme ? 'noborder_gray' : 'noborder_light';

    function sendMessage(message) {
        const iframe = document.querySelector('iframe.giscus-frame');
        if (!iframe) return;
        iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
    }

    sendMessage({
        setConfig: {
        theme: theme
        }
    });


}
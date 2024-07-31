import { writable } from 'svelte/store'
import { browser } from '$app/environment'

type Theme = 'light' | 'dark'

// we set the theme in `app.html` to prevent flashing
const userTheme = browser && localStorage.getItem('color-scheme')

// create the store
export const theme = writable(userTheme ?? 'dark')

// update the theme
export function toggleTheme() {
	if (document.body.classList.contains('initial-load')) {
		document.body.classList.remove('initial-load');
	}
	theme.update((currentTheme) => {
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

		if (newTheme == 'dark') {
			(document.getElementById('night') as HTMLInputElement).checked = true;
		} else {
			(document.getElementById('day') as HTMLInputElement).checked = true;
		}
		localStorage.setItem('color-scheme', newTheme)

		return newTheme
	})
}

// set the theme
export function setTheme(newTheme: Theme) {
	theme.set(newTheme)
}
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import { mdsvex, escapeSvelte } from 'mdsvex'
import { getSingletonHighlighter } from 'shiki'

import { remarkExtractHeaders } from './remark-extract-headers.js';
import { emptyLinesToBr } from './remark-empty-lines.js'

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	remarkPlugins: [[remarkExtractHeaders, {debug: true}], emptyLinesToBr],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await getSingletonHighlighter({
				themes: ['monokai', 'light-plus'],
				langs: ['javascript', 'sql', 'typescript', 'html', 'css', 'markdown', 'svelte', 'rust', 'c', 'java', 'toml']
			})
			await highlighter.loadLanguage('javascript', 'sql', 'typescript', 'html', 'css', 'markdown', 'svelte', 'rust', 'c', 'java', 'toml')
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, themes: { dark: 'monokai', light: 'light-plus'}, defaultColor: 'dark' }))
			const modifiedHtml = html.replace('<pre ', `<pre data-lang="${lang}" `);
			return `{@html \`${modifiedHtml}\` }`
		}
	},
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	layout: {
		_: './src/mdsvex.svelte'
	},
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter()
	}
}

export default config;

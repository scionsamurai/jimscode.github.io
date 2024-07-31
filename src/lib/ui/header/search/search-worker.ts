import { createPostsIndex, searchPostsIndex } from './search'

addEventListener('message', async (e) => {
    const { type, payload } = e.data

    if (type === 'load') {
        try {
            const posts = await fetch('/api/search').then((res) => res.json())
            createPostsIndex(posts)
            postMessage({ type: 'ready' })
        } catch (error) {
            postMessage({ type: 'error', payload: { message: error.message } })
        }
    }

    if (type === 'search') {
        try {
            const searchTerm = payload.searchTerm
            const results = searchPostsIndex(searchTerm)
            postMessage({ type: 'results', payload: { results, searchTerm } })
        } catch (error) {
            postMessage({ type: 'error', payload: { message: error.message } })
        }
    }
})

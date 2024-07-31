import { error } from '@sveltejs/kit';

export async function load(data) {
    try {
        // Load the post
        const post = await import(`./terms-of-service.md`);

        return {
            content: post.default,
            slug: data.url.pathname,
            meta: {
                ...post.metadata
            }
        };
    } catch (e) {
        console.error(e);
        throw error(404, `Could not find ${data.url.pathname}`);
    }
}
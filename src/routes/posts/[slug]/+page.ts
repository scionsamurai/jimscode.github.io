import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        // Load the post
        const post = await import(`../../../posts/${params.slug}/${params.slug}.md`);

        // Load the authors data
        const authorsModule = await import('../../../lib/authors.json');
        const authors: { [key: string]: { name: string; slug: string; gravatar: string; bio: string; short_bio: string; } } = authorsModule.default;

        // Get the author for this post
        const author = authors[post.metadata.author_id];

        if (!author) {
            throw new Error(`Author not found for id: ${post.metadata.author_id}. Check if a top-matter item needs parenthesis`);
        }

        return {
            content: post.default,
            slug: params.slug,
            meta: {
                ...post.metadata
            },
            author
        };
    } catch (e) {
        console.error(e);
        throw error(404, `Could not find ${params.slug}`);
    }
}
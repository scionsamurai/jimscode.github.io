import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        
        // First try to find the post in a direct path
        let post;
        let postGroups;
        try {
            post = await import(`../../../posts/${params.slug}/${params.slug}.md`);
        } catch {
            // If not found, search through group folders
            // You'll need to maintain a mapping of posts to their groups
            postGroups = await import('../../../lib/post-groups.json');

            const groupName = postGroups?.default[params.slug]?.group;
            
            if (!groupName) {
                throw new Error(404, `Could not find group for ${params.slug}`);
            }
            
            post = await import(`../../../posts/${groupName}/${params.slug}/${params.slug}.md`);
        }

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
                ...post.metadata,
                group: postGroups?.default[params.slug]?.group // Include the group in metadata if needed
            },
            author
        };
    } catch (e) {
        console.error(e);
        throw new Error(404, `Could not find ${params.slug}`);
    }
}
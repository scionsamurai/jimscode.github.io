import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        // Load the authors data
        const authorsModule = await import('../../../lib/authors.json');
        const authors: { [key: string]: { name: string; slug: string; gravatar: string; bio: string; short_bio: string; } } = authorsModule.default;
        

        
        // Find the author and their key based on the slug
        const authorEntry = Object.entries(authors).find(([_, author]) => author.slug === params.author);
        
        if (!authorEntry) {
            throw error(404, `Author not found for slug: ${params.author}`);
        }
        
        const [authorKey, author] = authorEntry;

        return {
            authorKey,
            author
        };
    } catch (e) {
        console.error(e);
        throw error(404, `Could not find ${params.author}`);
    }
}
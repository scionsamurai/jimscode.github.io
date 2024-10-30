import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Post } from '$lib/types';

async function getPosts() {
    let posts: Post[] = [];

    const paths = import.meta.glob('/src/posts/*/*/*.md', { eager: true });

    for (const path in paths) {
        const file = paths[path];
        const slug = path.split('/').at(-1)?.replace('.md', '');

        if (file && typeof file === 'object' && 'metadata' in file && slug) {
            const metadata = file.metadata as Omit<Post, 'slug'>;
            const post = { ...metadata, slug } satisfies Post;
            post.published && posts.push(post);
        }
    }

    posts = posts.sort((first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime()
    );

    return posts;
}


export const GET: RequestHandler = async ({ url }) => {
    const authorKey = url.searchParams.get('author');
    const categoryKey = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    let posts = await getPosts();

    // Filter by author if an author key is provided
    if (authorKey) {
        posts = posts.filter(post => post.author_id == authorKey);
    }

    // Filter by category if a category key is provided
    if (categoryKey) {
        posts = posts.filter(post => post.categories.includes(categoryKey));
    }

    // Calculate pagination
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const offset = (page - 1) * limit;
    const paginatedPosts = posts.slice(offset, offset + limit);


    return json({
        posts: paginatedPosts,
        pagination: {
            page,
            limit,
            totalPosts,
            totalPages
        }
    });
};
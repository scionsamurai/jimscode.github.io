import type { Post } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async (data) => {
    const page = data.url.searchParams.get('page') || '1';
    const limit = '10'; // You can make this dynamic if needed

    // Fetch posts for the author with pagination
    const response = await data.fetch(`/api/posts`);
    const { posts, pagination } = await response.json();

    return {
        category: data.params.category,
        posts,
        pagination
    };
};
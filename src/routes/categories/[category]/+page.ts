import type { PageLoad } from './$types';

export const load: PageLoad = async ({params, fetch, url}) => {
    const page = url.searchParams.get('page') || '1';
    const limit = '10'; // You can make this dynamic if needed

    // Fetch posts for the author with pagination
    const response = await fetch(`/api/posts?category=${params.category}&page=${page}&limit=${limit}`);
    const { posts, pagination } = await response.json();
    return {
        category: params.category,
        posts,
        pagination
    };
};



import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch, url }) => {
    const { authorKey, author } = data;
    const page = url.searchParams.get('page') || '1';
    const limit = '10'; 

    // Fetch posts for the author with pagination
    const response = await fetch(`/api/posts?author=${authorKey}&page=${page}&limit=${limit}`);
    const { posts, pagination } = await response.json();

    return {
        authorKey,
        author,
        posts,
        pagination
    };
};

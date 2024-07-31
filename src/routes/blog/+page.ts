import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url, data }) => {
    const page = url.searchParams.get('page') || '1';
    const limit = '10'; // Number of posts per page

    // Fetch posts with pagination
    const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
    const { posts, pagination } = await response.json();

    return {
        posts,
        pagination
    };
};


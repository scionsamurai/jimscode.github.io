import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
    const page = parseInt(url.searchParams.get('page') || '1');

    if (isNaN(page) || page <= 1) {
        throw redirect(302, '/'); // Redirect to home if the page parameter is missing or invalid
    }

    // Pass the valid page number to the client-side load function
    return {
        props: {
            page
        }
    };
};

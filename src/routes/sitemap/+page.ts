import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const limit = '10000'; 

    // Fetch posts for the author with pagination
    const response = await fetch(`/api/posts?limit=${limit}`);
    const { posts } = await response.json();

    const categories = [...new Set(posts.flatMap(post => post.categories))]

    const staticPages = [
        { url: '/', title: 'Home' },
        { url: '/about-us', title: 'About Us' },
        { url: '/terms-of-service', title: 'Terms of Service' },
        { url: '/privacy-policy', title: 'Privacy Policy' },
        { url: '/grammarly-hack', title: 'Grammarly Trick'}
    ]

    const categoryPages = categories.map(category => ({
        url: `/categories/${encodeURIComponent(category)}`,
        title: `Category: ${category}`,
        type: 'category'
    }))

    const sitemapData = [
        ...staticPages,
        ...categoryPages,
        ...posts.map(post => ({
            url: post.slug,
            title: post.title,
            date: post.date,
            type: 'post',
            categories: post.categories
        }))
    ]
    return {
        sitemapData
    };
};



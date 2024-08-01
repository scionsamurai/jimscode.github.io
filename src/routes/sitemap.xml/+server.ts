import * as config from '$lib/config'
import type { Post } from '$lib/types'

function convertDateFormat(inputDate) {
    // Parse the input date string
    const date = new Date(inputDate);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }
    
    // Get year, month, and day
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = date.getUTCDate().toString().padStart(2, '0');
    
    // Return the formatted date string
    return `${year}-${month}-${day}`;
}

export async function GET({ fetch }) {
    const response = await fetch('api/posts?limit=10000')
    const { posts }: { posts: Post[] } = await response.json()

    const categories = [...new Set(posts.flatMap(post => post.categories))]

    const staticPages = [
        'about-us',
        'terms-of-service',
        'privacy-policy',
    ]

    const headers = { 'Content-Type': 'application/xml' }

    const xml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>${config.url}</loc>
                <changefreq>daily</changefreq>
                <priority>1.0</priority>
            </url>
            <url>
                <loc>${config.url}blog</loc>
                <changefreq>daily</changefreq>
                <priority>1.0</priority>
            </url>
            ${staticPages.map(page => `
                <url>
                    <loc>${config.url}${page}</loc>
                    <changefreq>monthly</changefreq>
                    <priority>0.8</priority>
                </url>
            `).join('')}
            ${categories.map(category => `
                <url>
                    <loc>${config.url}/categories/${encodeURIComponent(category.substring(1))}</loc>
                    <changefreq>weekly</changefreq>
                    <priority>0.7</priority>
                </url>
            `).join('')}
            ${posts.map(post => `
                <url>
                    <loc>${config.url}/posts/${post.slug}</loc>
                    <lastmod>${convertDateFormat(post.date)}</lastmod>
                    <changefreq>weekly</changefreq>
                    <priority>0.6</priority>
                </url>
            `).join('')}
        </urlset>
    `.trim()

    return new Response(xml, { headers })
}

import * as config from '$lib/config'
import type { Post } from '$lib/types'

export async function GET({ fetch }) {
    const response = await fetch('/api/posts?limit=10000')
    const { posts }: { posts: Post[] } = await response.json()

    const categories = [...new Set(posts.flatMap(post => post.categories))]

    const staticPages = [
        { url: '/', title: 'Home' },
        { url: '/about-us', title: 'About Us' },
        { url: '/terms-of-service', title: 'Terms of Service' },
        { url: '/privacy-policy', title: 'Privacy Policy' }
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

    return new Response(JSON.stringify(sitemapData), {
        headers: { 'Content-Type': 'application/json' }
    })
}

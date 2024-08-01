<script lang="ts">
    import { onMount } from 'svelte';

    let sitemapData = [];

    onMount(async () => {
        const response = await fetch('/api/sitemap');
        sitemapData = await response.json();
    });

    $: categories = sitemapData.filter(item => item.title.startsWith('Category:'));
    $: posts = sitemapData.filter(item => item.date);
    $: pages = sitemapData.filter(item => !item.title.startsWith('Category:') && !item.date);
</script>
<div class="singlePage">
    <h1>Sitemap</h1>
    <p>Here is a list of all the pages, categories and posts on this site.</p>
    <p>Looking for the xml versions? It can be found <a href="sitemap.xml" target="_blank">here!</a></p>
    
    <section>
        <h2>Pages</h2>
        <ul class="pages">
            {#each pages as item}
                <a href={item.url}>
                    <li class="btn-cta">
                        {item.title}
                    </li>
                </a>
            {/each}
        </ul>
    </section>
    
    <section>
        <h2>Categories</h2>
        <ul class="categories">
            {#each categories as item}
                <a href={item.url}>
                    <li class="btn-cta">
                        {item.title.replace('Category: ', '')}
                    </li>
                </a>
            {/each}
        </ul>
    </section>
    
    <section>
        <h2>Posts</h2>
        <ul class="posts">
            {#each posts as item}
                <li>
                    <a href={item.url}>{item.title}</a>
                    <span class="date">Last updated: {new Date(item.date).toLocaleDateString()}</span>
                </li>
            {/each}
        </ul>
    </section>    

</div>

<style lang="scss">
	@import 'src/styles/SinglePage.scss';
    h1 {
        font-size: 2.5rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid #eee;
        padding-bottom: 0.5rem;
    }

    h2 {
        font-size: 1.8rem;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    section {
        margin-bottom: 2rem;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    a {
        text-decoration: none;
        transition: color 0.3s;
    }

    a:hover {
        text-decoration: underline;
    }


    .categories {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
    }
    .btn-cta {
        padding: 5px;
    }


    .date {
        display: block;
        font-size: 0.8em;
        margin-top: 0.3rem;
    }
</style>

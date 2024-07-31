<script>
    import { url, createSlug } from '$lib/config';
    export let post_title;
    export let image_path;
    export let post_slug;

    const post_url = url + 'posts/' + post_slug;
</script>

<div class="mobile-share-links">
    <h3 class="dont-link">Share this post</h3>
    <div class="share-buttons">
        <a href="https://www.facebook.com/sharer/sharer.php?u={post_url}" target="_blank" class="share-button facebook">
            <span class="icon">f</span>
            <span class="text">Facebook</span>
        </a>
        <a href="https://twitter.com/intent/tweet?url={post_url}" target="_blank" class="share-button twitter">
            <span class="icon">t</span>
            <span class="text">Twitter</span>
        </a>
        <a href="https://www.linkedin.com/shareArticle?url={post_url}" target="_blank" class="share-button linkedin">
            <span class="icon">in</span>
            <span class="text">LinkedIn</span>
        </a>
        <a href="https://pinterest.com/pin/create/button/?url={post_url}&media={url.substring(0, url.length - 1) + image_path}&description={createSlug(post_title)}" target="_blank" class="share-button pinterest">
            <span class="icon">p</span>
            <span class="text">Pinterest</span>
        </a>
        <a href="https://www.reddit.com/submit?url={post_url}" target="_blank" class="share-button reddit">
            <span class="icon">r</span>
            <span class="text">Reddit</span>
        </a>
        <a href="whatsapp://send?text={post_url}" target="_blank" class="share-button whatsapp">
            <span class="icon">w</span>
            <span class="text">WhatsApp</span>
        </a>
        <a href="mailto:?subject={createSlug(post_title)}&body={post_url}" target="_blank" class="share-button email">
            <span class="icon">@</span>
            <span class="text">Email</span>
        </a>
        <a href="https://www.instagram.com/share?url={post_url}" target="_blank" class="share-button instagram">
            <span class="icon">ig</span>
            <span class="text">Instagram</span>
        </a>
    </div>
</div>

<style lang="scss">
    .mobile-share-links {
        display: none;
        margin-top: 2rem;
        padding: 1rem;
        border-radius: 8px;

        h3 {
            margin-bottom: 1rem;
            text-align: center;
            font-size: 1.2rem;
        }

        .share-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem;

            .share-button {
                display: flex;
                align-items: center;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                text-decoration: none;
                color: white;
                font-weight: bold;
                transition: opacity 0.3s ease;
                & > * {
                    color: white;
                }

                &:hover {
                    opacity: 0.8;
                }

                .icon {
                    margin-right: 0.5rem;
                    font-size: 1.2rem;
                }

                &.facebook { background-color: #3b5998; }
                &.twitter { background-color: #1da1f2; }
                &.linkedin { background-color: #0077b5; }
                &.pinterest { background-color: #bd081c; }
                &.reddit { background-color: #ff4500; }
                &.whatsapp { background-color: #25d366; }
                &.email { background-color: #7d7d7d; }
                &.instagram { background-color: #c13584; }
            }
        }
    }

    @media (max-width: 768px) {
        .mobile-share-links {
            display: block;
        }
    }
</style>
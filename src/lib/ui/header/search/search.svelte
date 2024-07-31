<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import SearchWorker from './search-worker?worker';

    type SearchState = 'idle' | 'load' | 'ready';
    type Result = { slug: string; title: string; content: string };

    let search: SearchState = 'idle';
    let searchTerm = '';
    let results: Result[] = [];
    let searchWorker: Worker;
    let isInputFocused = false;

    onMount(() => {
        searchWorker = new SearchWorker();
        searchWorker.addEventListener('message', (e: MessageEvent) => {
            const { type, payload } = e.data;
            if (type === 'ready') search = 'ready';
            if (type === 'results') results = payload.results;
            if (type === 'error') console.error('Worker error:', payload.message);
        });
    });

    onDestroy(() => {
        if (searchWorker) {
            searchWorker.terminate();
        }
    });

    const initializeSearch = () => {
        if (search === 'idle') {
            search = 'load';
            searchWorker.postMessage({ type: 'load' });
        }
    };

    $: if (search === 'ready' && searchTerm) {
        searchWorker.postMessage({ type: 'search', payload: { searchTerm } });
    }

    const resetSearch = () => {
        searchTerm = '';
        results = [];
    };

    const handleFocus = () => {
        isInputFocused = true;
        initializeSearch();
    };

    const handleBlur = () => {
        setTimeout(() => {
            isInputFocused = false;
        }, 200);
    };
</script>

<div class="search">
    <div class="search-container" class:focused={isInputFocused}>
        <span class="search-icon">🔍</span>
        <input
            bind:value={searchTerm}
            placeholder="Search"
            autocomplete="off"
            spellcheck="false"
            type="text"
            class="search-input"
            on:focus={handleFocus}
            on:blur={handleBlur}
        />
    </div>

    {#if isInputFocused && results.length > 0}
        <div class="results">
            <ul>
                {#each results as result}
                    <li>
                        <a href="/posts/{result.slug}" on:click={resetSearch}>
                            {@html result.title}
                        </a>
                        <p>{@html result.content}</p>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>

<style>
	.search {
		position: relative;
		width: 240px;
	}

	.search-container {
		display: flex;
		align-items: center;
		background-color: var(--background);
		border-radius: var(--radius-round);
		padding: 6px 10px;
		box-shadow: 0 0 20px var(--background-color-dark);
		transition: box-shadow 0.3s ease;
	}

	.search-container.focused {
		box-shadow: 0 0 35px var(--background);
	}

	.search-icon {
		color: #888;
		font-size: var(--size-5);
		margin-right: 8px;
	}

	.search-input {
		background: transparent;
		border: none;
		color: var(--font-color);
		font-size: var(--size-5);
		outline: none;
		width: 100%;
	}

	.results {
		position: absolute;
		top: 100%;
		left: 50%;
		width: 360px; /* 50% wider than the search input */
		transform: translateX(-65%);
		margin-top: 10px;
		background: var(--background);
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		max-height: 300px;
		overflow-y: auto;
		z-index: 1001;
	}
	@media (max-width: 768px) {
		.results {
			transform: translateX(-35%);
		}
	}

	ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	li {
		padding: 10px;
		border-bottom: 1px solid var(--background-color-second);
	}

	li:last-child {
		border-bottom: none;
	}

	li a {
		color: var(--font-color);
		text-decoration: none;
		font-weight: bold;
	}

	li p {
		margin: 5px 0 0;
		font-size: var(--size-4);
		color: var(--font-color-muted);
	}
</style>

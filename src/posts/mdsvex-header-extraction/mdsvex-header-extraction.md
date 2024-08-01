---
title: "Extracting Headers from Markdown in SvelteKit with mdsvex"
description: Learn how to create a custom remark plugin for SvelteKit that automatically extracts headers from your Markdown files, enabling dynamic table of contents and improved content navigation.
date: 'Sun, 28 Jul 2024 22:39:58'
categories:
  - svelte
  - sveltekit
  - webdev
  - markdown
author_id: 1
image: /images/mdsvex-header-extraction-banner-png.png
webp_image: /images/mdsvex-header-extraction-banner.webp
image_thumb: /images/mdsvex-header-extraction-banner-png_thumb.png
banner_alt: "Image of type writer sitting on a paint splotch."
show_banner: true
comments: true
published: true
---

## Introduction

Are you building a content-rich website with SvelteKit and Markdown? If so, you've probably wished for an easy way to generate a table of contents or navigation based on your article headers. This can be especially tricky when using mdsvex, the popular Markdown preprocessor for Svelte.

But fear not! In this post, we'll walk through a powerful solution: creating a custom remark plugin that automatically extracts headers from your Markdown files in a SvelteKit project using mdsvex.

The completed code can be viewed on [github](https://github.com/scionsamurai/remark-extract-headers-sveltekit).

### Why Extract Headers?

Extracting headers from your Markdown content opens up a world of possibilities:

- Create dynamic tables of contents
- Build navigation sidebars for long-form content
- Implement "jump to section" functionality
- Improve SEO with clear content structure
- Enhance accessibility through better document outlines

### What We'll Cover

In this tutorial, we'll:

1. Create a custom remark plugin to extract headers
2. Configure the plugin with mdsvex and SvelteKit
3. Use the extracted headers in Svelte components

By the end, you'll have a powerful tool in your SvelteKit toolbox, whether you're building a blog, documentation site, or any content-heavy application.

Let's dive in and start structuring our content like pros!

## Prerequisites

Before we dive into the code, let's make sure we have everything set up correctly. This tutorial assumes you have some familiarity with SvelteKit and Markdown. If you're new to these technologies, don't worry – we'll provide resources to help you get up to speed.

### Knowledge Check

Before proceeding, make sure you're comfortable with:

- Basic SvelteKit concepts (routing, layouts, etc.)
- Writing Markdown content
- JavaScript/TypeScript fundamentals

If you need a refresher, here are some helpful resources:

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [mdsvex Documentation](https://mdsvex.com/)
- [Markdown Guide](https://www.markdownguide.org/)

### Project Setup

1. **SvelteKit Project**: Ensure you have a SvelteKit project ready. If not, you can create one using:

   ```
   npm create svelte@latest my-sveltekit-blog
   cd my-sveltekit-blog
   npm install
   ```

2. **mdsvex**: We'll be using mdsvex to process our Markdown files. Install it with:

   ```
   npm install mdsvex
   ```

3. **Additional Dependencies**: For our custom remark plugin, we'll need two more packages:

   ```
   npm install unist-util-visit mdast-util-to-string
   ```

### Configuration Check

Make sure your `svelte.config.js` file is set up to use mdsvex. It should look something like this:

```javascript
import { mdsvex } from 'mdsvex';

const config = {
    extensions: ['.svelte', '.md'],
    preprocess: [vitePreprocess(), mdsvex({
        extensions: ['.md']
    })],
  // ... other SvelteKit config
};

export default config;
```

### Testing Our Configuration

Want to make sure everything's hooked up correctly? Let's do a quick test:

1. Create a new Markdown file called `+page.md` in the `src/routes/test` directory.
2. Add some content with a few headers:

   ```markdown
   # My Test Post

   ## First Section

   Some content here.

   ## Second Section

   More fascinating content!
   ```
   
3. Start the SvelteKit dev server by running the following command in your project directory:

    ```
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:5173/test` (or the appropriate port displayed after running `npm run dev`) to see your Markdown content rendered.

### File Structure

Your project structure should look similar to this:

```
my-sveltekit-blog/
├── src/
│   ├── routes/
│   │   └── blog/
│   │       └── [slug]/
│   │           ├── +page.svelte
│   │           └── +page.ts
│   └── posts/
│       ├── post1.md
│       └── post2.md
├── static/
├── svelte.config.js
└── package.json
```

With everything set up, we're ready to create our custom remark plugin and start extracting those headers!

## Creating the Remark Plugin

Alright, fellow developers, it's time to roll up our sleeves and create some magic! We're about to craft a custom remark plugin that will extract headers from our Markdown files like a pro. Let's break it down step by step.

### What's a Remark Plugin?

First things first: a remark plugin is a function that transforms the abstract syntax tree (AST) of our Markdown content. Think of it as a superpower that lets us manipulate our Markdown before it becomes HTML.

### The Code

Let's create a new file called `remark-extract-headers.js` in the root of our project. Here's the code that'll do the heavy lifting:

```javascript
import { visit } from 'unist-util-visit';

export function remarkExtractHeaders() {
    return (tree, file) => {
        file.data.headers = [];
    
        visit(tree, 'heading', (node) => {
            if (node.depth === 2) // 2 is the depth of the headers we want to extract
                file.data.headers.push(node.children[0].value); // add the header text to the file.data.headers array
        });
        // Attach the headers to the `file` object
        if (!file.data.fm) file.data.fm = {};
        file.data.fm.headers = file.data.headers;
    };
}
```

### Breaking It Down

Let's dissect this code like curious scientists:

1. **Import `visit`**: We're using the `visit` function from `unist-util-visit`. This nifty tool helps us traverse the AST.

2. **Export the Plugin**: Our `remarkExtractHeaders` function is the star of the show. It returns another function that does the actual work.

3. **Initialize Headers Array**: We create an empty array to store our extracted headers.

4. **Visit Heading Nodes**: The `visit` function looks for all 'heading' nodes in our AST.

5. **Check Heading Depth**: We're focusing on h2 headers (depth 2). Feel free to adjust this if you want different heading levels!

6. **Extract and Store**: When we find an h2, we grab its text content and add it to our headers array.

7. **Attach to File Object**: Finally, we attach our headers to the `file.data.fm` object. This makes our headers accessible in SvelteKit land!

### The Magic of `unist-util-visit`

Wonder why we're using `unist-util-visit`? It's like having a GPS for our AST. Instead of manually navigating the tree structure, `visit` does the heavy lifting, finding all the 'heading' nodes for us. Efficiency at its finest!

### Customization Options

Want to extract more than just h2s? Easy peasy! Modify the condition in the `visit` callback:

```javascript
visit(tree, 'heading', (node) => {
    if (node.depth <= 3) // This will extract h1, h2, and h3
        file.data.headers.push({ depth: node.depth, text: node.children[0].value });
});
```

Now we're extracting headers with their depth. The sky's the limit!

### What's Next?

With our shiny new remark plugin ready to go, we're one step closer to header extraction nirvana. In the next section, we'll see how to integrate this plugin into our SvelteKit and mdsvex configuration. Get ready to level up your Markdown game!

## Configuring SvelteKit and mdsvex

Alright, header hunters! We've got our shiny new remark plugin ready to rock. Now it's time to introduce it to SvelteKit and mdsvex. Let's make these technologies play together like a well-oiled machine!

### Updating svelte.config.js

First stop: our `svelte.config.js` file. This is where the magic happens. We're going to tell SvelteKit and mdsvex about our awesome new plugin. Check it out:

```javascript
import { mdsvex } from 'mdsvex';
import { remarkExtractHeaders } from './remark-extract-headers.js';

const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    mdsvex({
      extensions: ['.md'],
      remarkPlugins: [remarkExtractHeaders],
      // ... other mdsvex options
    })
  ],
  // ... other SvelteKit config
};

export default config;
```

### What's Happening Here?

Let's break it down:

1. **Import the Plugin**: We're bringing in our `remarkExtractHeaders` function from the file we just created.

2. **Add to mdsvex Config**: We slip our plugin into the `remarkPlugins` array. This tells mdsvex, "Hey, use this cool plugin when processing Markdown!"

3. **Extensions**: We're telling SvelteKit to treat `.md` files as special. They're not just plain text anymore - they're potential blog posts!

### The Power of Preprocessing

By adding our plugin to the `remarkPlugins` array, we're essentially saying, "Before you turn this Markdown into HTML, do this cool header extraction thing." It's like having a personal assistant for your Markdown files!

### What's Next?

With our configuration in place, we're ready to start using our extracted headers throughout our SvelteKit app. In the next section, we'll dive into implementing this solution in our actual pages and components. Get ready to create some killer navigation for your Markdown content!

## Implementing the Solution in SvelteKit

Alright, SvelteKit superstars! We've got our plugin configured and ready to roll. Now, let's put it to work in our actual SvelteKit app. We're going to import our Markdown posts as modules and render them as Svelte components.

### Setting Up the Route

First, let's set up a dynamic route to handle our blog posts. Create a new directory structure in your `src/routes` folder like this:

```
src/routes/blog/[slug]/
├── +page.svelte
└── +page.ts
```

### The Magic of `+page.ts`

In your `+page.ts` file, we're going to dynamically import our Markdown files. Check out this code:

```typescript
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        // Load the post
        const post = await import(`../../../posts/${params.slug}.md`);

        return {
            content: post.default,
            meta: {
                ...post.metadata,
                slug: params.slug
            },
        };
    } catch (e) {
        console.error(e);
        throw error(404, `Could not find ${params.slug}`);
    }
}
```

What's happening here?

1. We're using dynamic `import()` to load our Markdown file based on the slug.
2. The imported module gives us the default export (our content) and metadata (including our extracted headers).
3. We return an object with the content and metadata, ready for our Svelte component to use.

### Bringing It All Together in `+page.svelte`

Now, let's create our `+page.svelte` file to display our post and use those extracted headers:

```svelte
<script>
    export let data;
</script>

<article>
    <h1>{data.meta.title}</h1>
    <p>{data.meta.slug}</p>
    
    <nav class="table-of-contents">
        <h2>Table of Contents</h2>
        <ul>
            {#each data.meta.headers as header}
                <li><a href="#{header}">{header}</a></li>
            {/each}
        </ul>
    </nav>

    <div class="content">
        <svelte:component this={data.content} />
    </div>
</article>

<style>
    .table-of-contents {
        background-color: #f0f0f0;
        padding: 1rem;
        margin-bottom: 2rem;
    }
    .content {
        max-width: 800px;
        margin: 0 auto;
    }
</style>
```

Let's break down this awesomeness:

1. We're using `data.meta.title` to display the post title.
2. We've created a slick "Table of Contents" using our extracted headers.
3. The actual post content is rendered using `<svelte:component this={data.content} />`.

Finally add a bit of markdown to our `post1.md` file.

   ```markdown
   ---
   title: My Test Post
   ---

   ## First Section

   Some content here.

   ## Second Section

   More fascinating content!
   ```
   
### The Result

With this setup, when you navigate to `/blog/post1`, you'll see:

1. The post title
2. A table of contents with links to each section
3. The full post content

And the best part? It's all generated automatically from your Markdown files! Now your readers can smoothly glide through your content like butter on a hot pancake!

### Bonus: Smooth Scrolling (Now with Auto-IDs!)

Hold onto your keyboards, folks, because we're about to turbocharge our plugin! We're not just extracting headers anymore - we're giving them superpowers with automatic IDs! Check out this souped-up version of our `remarkExtractHeaders` function:

```javascript
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';

export function remarkExtractHeaders() {
    return (tree, file) => {
        file.data.headers = [];
        let headerCounter = 0; // keep track of number of headers passed

        const generateId = (text, index) => {
            // Convert to lowercase and replace spaces with hyphens
            let id = text.toLowerCase().replace(/\s+/g, '-');
            
            // Remove any characters that are not alphanumeric, underscore, or hyphen
            id = id.replace(/[^a-z0-9_-]/g, '');
            
            // Ensure the ID doesn't start with a number or hyphen
            id = id.replace(/^[0-9-]/, '');
            
            // Add the index
            id += `-${index}`;
            
            // Ensure the ID is not empty
            if (id === '') {
                id = `header-${index}`;
            }
            
            return id;
        };

        const getHeaderText = (node) => {
            return toString(node);
        };


        // Function to add an ID to a node
        const addIdToNode = (node, id) => {
            node.data = node.data || {};
            node.data.hProperties = node.data.hProperties || {};
            node.data.hProperties.id = id;
        };

    
        visit(tree, 'heading', (node) => {
            if (node.depth === 2) {
                const headerText = getHeaderText(node);
                headerCounter++
                
                const headerId = generateId(headerText, headerCounter)
                // Push object container header data instead of just string to file.data.headers
                file.data.headers.push({ text: headerText, id: headerId });
                // Add an `id` property to the heading node
                addIdToNode(node, headerId);
            }
        });
        
        // Attach the headers to the `file` object
        if (!file.data.fm) file.data.fm = {};
        file.data.fm.headers = file.data.headers;
    };
}
```

What's new? We're not just pushing header text anymore - we're creating a slick object with both the text and a shiny new ID! Plus, we're adding that ID directly to the heading node. It's like giving each header its own VIP backstage pass!

Now, let's update our smooth scrolling code to use these fabulous new IDs:

```svelte
<script>
    export let data;

    function scrollToHeader(event) {
        event.preventDefault();
        const id = event.target.getAttribute('href').slice(1);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
</script>

<!-- In your table of contents -->
<ul>
    {#each data.meta.headers as header}
        <li><a href="#{header.id}" on:click={scrollToHeader}>{header.text}</a></li>
    {/each}
</ul>
```

With this turbocharged setup, your readers won't just glide through your content like butter on a hot pancake - they'll zoom through it like a greased-up cheetah on a rocket sled! 🚀🐆

Remember to update your content component to use these new IDs too. Your headers will be automatically equipped with their shiny new IDs, ready for all that smooth scrolling action!

### What's Next?

You've now got a fully functional blog post with automatically generated tables of contents. In the next section, we'll explore some advanced techniques to take your content structure to the next level. Ready to become a SvelteKit content wizard? Let's go!

## Using the Extracted Headers

Alright, content wizards! We've got our headers extracted and a basic table of contents set up. But why stop there? Let's explore some advanced techniques to really make your SvelteKit blog shine!

### 1. Nested Table of Contents

Our current solution works great for flat structures, but what if your content has subsections? Let's level up our table of contents to handle grabbing the h3's associated with h2's and nesting them appropriately.

Here are the updated code examples to achieve this:

#### Updated Remark Plugin: `remark-extract-headers.js`
First, we need to modify our remark plugin to capture h3 headers and nest them under their respective h2 headers.

```javascript
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';

export function remarkExtractHeaders() {
  return (tree, file) => {
    file.data.headers = [];
    let currentHeader = null; // Keep track of the current header object
    let headerCounter = 0;

    const generateId = (text, index) => {
        let id = text.toLowerCase().replace(/\s+/g, '-');
        id = id.replace(/[^a-z0-9_-]/g, '');
        id = id.replace(/^[0-9-]/, '');
        id += `-${index}`;
        if (id === '') {
            id = `header-${index}`;
        }

        return id;
    };

    const getHeaderText = (node) => {
        return toString(node);
    };

    // Function to add an ID to a node
    const addIdToNode = (node, id) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.id = id;
    };

    // Visit each heading node in the tree
    visit(tree, 'heading', (node) => {
      const headerText = getHeaderText(node);
      headerCounter++
      const headerId = generateId(headerText, headerCounter); // Generate a unique ID for the header

      // Check if the heading is an h2 or higher level
      if (node.depth <= 2) {
        currentHeader = {
          text: headerText,
          id: headerId,
          depth: node.depth,
          children: [], // Initialize an empty array for potential h3 children
        };

        file.data.headers.push(currentHeader); // Add the current header to the headers array
        addIdToNode(node, headerId); // Add the ID to the heading node
      } else if (node.depth === 3 && currentHeader) { // Check if the heading is an h3 and there is a current header
        const childText = headerText;
        const childId = generateId(childText, headerCounter); // Generate a unique ID for the h3 header

        currentHeader.children.push({
          text: childText,
          id: childId,
          depth: node.depth,
        });

        addIdToNode(node, childId); // Add the ID to the h3 node
      }
    });

    // Attach the headers to the `file` object
    if (!file.data.fm) file.data.fm = {};
    file.data.fm.headers = file.data.headers;
  };
}

```

#### Updated Svelte Component: `+page.svelte`
Next, we update the Svelte component to render the nested table of contents.

```svelte
<!-- Your updated table of contents -->
<nav class="table-of-contents">
    <h2>Table of Contents</h2>
    <ul>
        {#each data.meta.headers as header}
            <li>
                <a href="#{header.id}" on:click={scrollToHeader}>{header.text}</a>
                {#if header.children.length > 0}
                    <ul>
                        {#each header.children as child}
                            <li><a href="#{child.id}" on:click={scrollToHeader}>{child.text}</a></li>
                        {/each}
                    </ul>
                {/if}
            </li>
        {/each}
    </ul>
</nav>
```

This updated approach creates a beautifully nested structure that respects your content's hierarchy! It's like a flock of geese flying in perfect V-formation – each header knows its place, guiding readers through your content with the grace and precision of a well-coordinated migration. Your table of contents is ready to take flight! 🪿

### 2. Floating Table of Contents

To make our table of contents float alongside the content for easy access add the css below to the style tags in your `+page.svelte` file.

```css
    nav {
        max-height: 30rem;
        overflow: scroll;
        width: fit-content;
        position: fixed;
        right: 0;
    }
```

### 3. Active Section Highlighting

Want to show your readers exactly where they are in your content? Let's add some scroll-spy functionality:

```svelte
<script>
    import { onMount } from 'svelte';
    export let data;

    let activeHeader = '';

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activeHeader = entry.target.id;
                }
            });
        }, { rootMargin: '-100px 0px -66%' });

        // Observe both h2 and h3 headers
        data.meta.headers.forEach(header => {
            const element = document.getElementById(header.id);
            if (element) observer.observe(element);
            
            // Observe h3 children if any
            header.children.forEach(childHeader => {
                const childElement = document.getElementById(childHeader.id);
                if (childElement) observer.observe(childElement);
            });
        });

        return () => observer.disconnect();
    });
</script>

<!-- In your table of contents -->
<ul>
    {#each data.meta.headers as header}
        <li class:active={activeHeader === header.id}>
            <a href="#{header.id}">{header.text}</a>
            {#if header.children.length > 0}
                <ul>
                    {#each header.children as childHeader}
                        <li class:active={activeHeader === childHeader.id}>
                            <a href="#{childHeader.id}">{childHeader.text}</a>
                        </li>
                    {/each}
                </ul>
            {/if}
        </li>
    {/each}
</ul>

<style>
    .active {
        font-weight: bold;
        color: #ff3e00; /* Svelte's orange */
    }
    .active li {
		font-weight: initial;
		color: initial;
	}
</style>
```

Now your table of contents will highlight the current section as the user scrolls!

### 4. Header Permalinks

Make it easy for your readers to share specific sections by adding permalink buttons to your headers:

```svelte
<script>
    import { onMount } from 'svelte';

    onMount(() => {
        // add to onMount if you also utilized the active section highlighting code
        document.querySelectorAll('h2, h3, h4, h5, h6').forEach(header => {
            const link = document.createElement('a');
            link.className = 'header-link';
            link.innerHTML = '#';
            link.href = `#${header.id}`;
            header.appendChild(link);
        });
    });
</script>

<style>
    :global(.header-link) {
        opacity: 0;
        transition: opacity 0.2s;
        margin-left: 0.5em;
    }
    :global(h2:hover .header-link, h3:hover .header-link, h4:hover .header-link, h5:hover .header-link, h6:hover .header-link) {
        opacity: 1;
    }
</style>
```

### 5. Scrolling Table of Contents

If you would prefer your table of contents to take up less space and scroll with your content, consider implementing the following adjustments:

```svelte
<script>
    import { onMount } from 'svelte';
    export let data;

    let activeHeader = '';
    let tocElement; // added variable here

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activeHeader = entry.target.id;
                    scrollTocToActiveHeader(); // added function here
                }
            });
        }, { rootMargin: '-100px 0px -66%' });

        // Observe both h2 and h3 headers
        data.meta.headers.forEach(header => {
            const element = document.getElementById(header.id);
            if (element) observer.observe(element);
            
            header.children.forEach(childHeader => {
                const childElement = document.getElementById(childHeader.id);
                if (childElement) observer.observe(childElement);
            });
        });

        return () => observer.disconnect();
    });

    function scrollTocToActiveHeader() { // added code for function here
        if (tocElement && activeHeader) {
            const activeElement = tocElement.querySelector(`a[href="#${activeHeader}"]`);
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }
</script>

<nav class="table-of-contents" bind:this={tocElement}> <!-- added bind here -->
    <h2>Table of Contents</h2>
    <ul>
        {#each data.meta.headers as header}
            <li class:active={activeHeader === header.id}>
                <a href="#{header.id}">{header.text}</a>
                {#if header.children.length > 0}
                    <ul>
                        {#each header.children as childHeader}
                            <li class:active={activeHeader === childHeader.id}>
                                <a href="#{childHeader.id}">{childHeader.text}</a>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </li>
        {/each}
    </ul>
</nav>

<style>
    .table-of-contents {
        max-height: 10rem;
        overflow: scroll;
        width: fit-content;
        position: fixed;
        right: 0;
        background-color: #f0f0f0;
        padding: 1rem;
    }
    nav {
		max-height: 10rem; /* updated size */
		overflow: scroll;
		width: fit-content;
		position: fixed;
		right: 0;
	}
</style>
```

With these advanced techniques, you've transformed your SvelteKit blog into a content powerhouse! Your readers will love the improved navigation, interactivity, and performance. Remember, the key to great UX is continuous improvement, so keep experimenting and refining your approach. Happy coding, content wizards!

## Conclusion

Congratulations, SvelteKit savants! You've just leveled up your content game by creating a custom remark plugin to extract headers from your Markdown files. Let's recap the awesomeness we've achieved:

1. We built a custom remark plugin that extracts headers from Markdown.
2. We integrated this plugin seamlessly with mdsvex and SvelteKit.
3. We implemented a dynamic route that imports Markdown files as modules.
4. We created a slick table of contents with smooth scrolling.

By implementing this solution, you've unlocked a world of possibilities for your SvelteKit projects:

- **Improved User Experience**: Readers can now easily navigate your long-form content.
- **SEO Boost**: Search engines love well-structured content with clear headings.
- **Flexibility**: This approach works for blogs, documentation sites, and any content-heavy application.
- **Maintainability**: Your content structure is now automatically generated, reducing manual work.

Remember, this is just the beginning! You can extend this concept to create more advanced features like nested table of contents, dynamic sidebars, or even a full-fledged documentation system.

So go forth and create amazing, well-structured content with SvelteKit. Your readers (and future you) will thank you!

## Additional Resources

Want to dive deeper into the world of SvelteKit, mdsvex, and content structuring? Check out these fantastic resources:

1. **SvelteKit Documentation**: 
   [https://kit.svelte.dev/docs](https://kit.svelte.dev/docs)
   Your go-to guide for all things SvelteKit.

2. **mdsvex Documentation**: 
   [https://mdsvex.com/docs](https://mdsvex.com/docs)
   Master the art of mixing Markdown and Svelte.

3. **Remark Official Site**: 
   [https://remark.js.org/](https://remark.js.org/)
   Dive deep into the ecosystem that powers our plugin.

4. **unist-util-visit Documentation**: 
   [https://unifiedjs.com/explore/package/unist-util-visit/](https://unifiedjs.com/explore/package/unist-util-visit/)
   Learn more about traversing Abstract Syntax Trees.

5. **Markdown Guide**: 
   [https://www.markdownguide.org/](https://www.markdownguide.org/)
   Sharpen your Markdown skills.

6. **Svelte Society**: 
   [https://sveltesociety.dev/](https://sveltesociety.dev/)
   Join the community and discover more Svelte recipes and patterns.

7. **"Awesome Svelte" Resources**: 
   [https://github.com/TheComputerM/awesome-svelte](https://github.com/TheComputerM/awesome-svelte)
   A curated list of awesome Svelte resources.

8. **"Joy of Code: Build a Sveltekit Markdown Blog**: 
[https://joyofcode.xyz/sveltekit-markdown-blog](https://joyofcode.xyz/sveltekit-markdown-blog) is an excellent tutorial that motivated me to migrate my blog to SvelteKit.

Remember, the key to mastery is continuous learning and experimentation. Don't be afraid to tweak the plugin, try new ideas, and push the boundaries of what's possible with SvelteKit and Markdown!

Happy coding, and may your content always be well-structured and your headers perfectly extracted!
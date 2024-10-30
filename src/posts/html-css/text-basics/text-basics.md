---
title: Mastering Text Basics on Websites - A Guide for New Developers
description: Learn HTML text fundamentals - proper formatting and structure techniques for headings, lists, text styles, special characters, and more. Essential skills for web developers.
date: 'Sat, 23 Dec 2023 12:37:01 GMT'
categories:
  - html
  - web dev
author_id: 1
image: /images/text-basics-banner-png.png
webp_image: /images/text-basics-banner.webp
image_thumb: /images/text-basics-banner-png_thumb.png
banner_alt: A creative depiction of HTML as the bedrock, resembling the initial phases of a house construction site. Visualize the digital landscape with HTML forming a robust foundation, seamlessly intertwining with architectural elements. Experience the metaphorical construction of a website, where unfinished walls signify the ongoing development. This dynamic image vividly captures the integral role of HTML in shaping the evolving web development panorama.
show_banner: true
comments: true
published: true
---

As a new web developer, getting a solid grasp of how to structure and style text on webpages is an essential skill. Properly formatting text makes the content on your sites easier to read and understand for users. It also helps organize information in a clear way. 

In this post, we'll cover some key text fundamentals that every aspiring web dev should know. We'll look at headings, lists, formatting, and special characters. Learn these basics well and you'll be on your way to creating polished sites!

## Headings - The Signposts of Your Content

Headings act like signposts that orient users and provide an outline for your content. 

They establish a hierarchy that breaks up text into logical sections. Pages become skimmable and readers can quickly find what they're looking for.

For example, the headings in this post make it easy to jump to different topics.

In HTML, you can have six levels of headings, `&lt;h1&gt;` to `&lt;h6&gt;`, to segment your content.

```html
&lt;h1&gt;Heading Level 1&lt;/h1&gt;
&lt;h2&gt;Heading Level 2&lt;/h2&gt; 
```

Use `&lt;h1&gt;` for your main page heading, and lower levels for subsections. Don't skip levels just to make text bigger.

With CSS you can customize their appearance:

```css
h1, h2 {
    font-size: 32px;
    font-weight: bold;
}

``` 

Headings help structure your content in a meaningful way for users.

## Lists - Organizing Information Visually

Lists neatly present information in scannable vertical stacks. They come in two main flavors:

### Ordered Lists

Ordered lists are numbered sequences, like step-by-step instructions:

1. Mix cake ingredients
2. Pour batter into pan
3. Bake at 350°F 

You create them in HTML with the `&lt;ol&gt;` tag:

```html
&lt;ol&gt;
    &lt;li&gt;Sign up for web hosting&lt;/li&gt;
    &lt;li&gt;Install WordPress&lt;/li&gt;
    &lt;li&gt;Choose a theme&lt;/li&gt;
    &lt;li&gt;Customize your site&lt;/li&gt;
&lt;/ol&gt;
```

### Unordered Lists

Unordered lists use bullets to mark non-sequential items, like shopping lists:

- Milk  
- Eggs
- Bread

These are defined with the `&lt;ul&gt;` tag:

```html  
&lt;ul&gt;
    &lt;li&gt;HTML&lt;/li&gt;
    &lt;li&gt;CSS&lt;/li&gt;
    &lt;li&gt;JavaScript&lt;/li&gt;
&lt;/ul&gt;
```

Lists can be nested inside each other to convey hierarchy...

## **Formatting** - Making Text *Stand* Out

**Bold** and *italic* text help emphasize important points or phrases.

In HTML, use the `&lt;strong&gt;` and `&lt;em&gt;` tags instead of `&lt;b&gt;` and `&lt;i&gt;`:

```html
&lt;strong&gt;This text is bold.&lt;/strong&gt;

&lt;em&gt;This text is italicized.&lt;/em&gt; 
```

Formatting text appropriately aids readability and draws attention to key messages.

## Special Characters - Enhancing Text

Special characters like © ® TM ¶ § ☺ let you add non-standard symbols to your pages.

To include them, use HTML entity codes like `&amp;copy;` for © and `&amp;trade;` for TM.

```html
&amp;copy; - copyright symbol
&amp;trade; - trademark 

``` 

You can also put special characters directly into CSS:

```css
p::before {
    content: '&hearts; '; 
}
```

Special characters provide useful shorthand like © and fun icons like ☺️. But use them in moderation.

## Accessibility Considerations

When structuring and formatting text on webpages, it's important to consider accessibility. We want to ensure content is perceivable, operable, understandable, and robust for all users.

Some key guidelines include:

### Writing Semantic HTML 

Use HTML elements for their intended meaning, not just presentation. For example, use headings to communicate document structure rather than to make text bigger. Screen readers rely on proper tag usage.

```html
&lt;h1&gt;Heading Level 1&lt;/h1&gt;

&lt;p&gt;Paragraph text...&lt;/p&gt; 
```

### Add Alternative Text

Images should have descriptive alt text through the `alt` attribute. Assistive technologies like screen readers use this.

```html
&lt;img src='graphic.png' alt='Flowchart showing web dev process'&gt;

``` 

### Contrast and Readability

Ensure sufficient color contrast between text and backgrounds. Avoid walls of italicized or justified text which are hard to decipher. Break content into manageable chunks.

### Focus Indicators

Use CSS to style visible keyboard focus indicators on interactive elements to help sighted keyboard users.

There are many other considerations like captions, ARIA roles, semantic CSS selectors, and more we could dive into as well. But following basic semantic structure, alt text, contrast, focus, and good document flow goes a long way!


## Commonly Asked Questions
<script>
    import SummaryDetails from '$lib/components/SummaryDetails.svelte'
    import CodeEditor from '$lib/components/CodeEditor.svelte'
    const files = [
        `index.html`,
        `styles.css`
    ];
    export let slug
</script>

<SummaryDetails summary="How to display HTML code as plain text in a browser?">

You can use HTML entities to display HTML code as plain text on a webpage. These special characters begin with '&' and end with ';', which display reserved characters or special characters as plain text. 

For example, to display closing script tags without actually closing a script on the page:

```html
&amp;lt;/script&amp;gt;
```

The `&amp;lt;` entity will display a literal `&lt;` character instead of being interpreted as the start of a tag. And `&amp;gt;` will display a literal `&gt;` rather than the end of a tag.

So this code snippet will simply show `&lt;/script&gt;` as text on the page rather than causing errors by prematurely closing an actual script element. The HTML entities prevent the browser from parsing the characters as real markup.

</SummaryDetails>
<SummaryDetails summary="Is HTML considered text or plain text?">

HTML includes formatting, images, and other rich content, whereas plain text does not have any formatting or images. So HTML is not considered plain text.

</SummaryDetails>
<SummaryDetails summary="How can text be edited in HTML?">

Text in HTML can be edited directly in the HTML source code in the browser. When you double-click on text on a webpage, it allows you to edit just that content. Making changes this way and pressing enter will update the text on the page immediately. 

However, these changes only happen locally on your machine, in the browser. To make the changes persist for all users, you need to update the actual HTML source code that serves the webpage. Typically this HTML file lives on a web server. So text edits made directly in the browser are temporary and only visible to you.

Updating the raw HTML document on the server and reloading the page is how the changes can be persisted and seen by all visitors. So while quick text edits are possible right in the browser, to make them 'stick' long-term requires modifying the source HTML file that generates the page.

</SummaryDetails>
<SummaryDetails summary="What distinguishes HTML from CSS?">

HTML is used to structure the actual content of a web page, like text, images, videos etc. CSS is used to control the style and layout - fonts, colors, positioning etc.

</SummaryDetails>
<SummaryDetails summary="What is a hyperlink in HTML?">

The `&lt;a&gt;` anchor tag defines a hyperlink in HTML, allowing users to click and navigate from one page to another. The key `href` attribute specifies the destination of the link.

</SummaryDetails>
<SummaryDetails summary="How can text be displayed verbatim in HTML?">

The `&lt;pre&gt;` HTML tag represents preformatted text that is displayed exactly as written in the source code, respecting whitespace and line breaks. It uses a fixed-width font by default.

</SummaryDetails>
<SummaryDetails summary="What constitutes basic text formatting in HTML?">

Basic text formatting includes making text bold with `&lt;b&gt;`, italicized with `&lt;i&gt;`, underlined using `&lt;u&gt;`, different font sizes and colors, subscript and superscript, and more. This allows styling text easily.

</SummaryDetails>
<SummaryDetails summary="What are some key HTML text fundamentals?">

Key HTML text fundamentals include headings using tags like `&lt;h1&gt;` through `&lt;h6&gt;`, paragraphs with `&lt;p&gt;`, emphasized text with `&lt;em&gt;`, strong importance with `&lt;strong&gt;`, lists using `&lt;ul&gt;`, `&lt;ol&gt;` and `&lt;li&gt;`, displaying preformatted text as-is with `&lt;pre&gt;`, and hyperlinks using anchor `&lt;a&gt;` tags.

</SummaryDetails>

## Keep Practicing!

With these fundamentals under your belt, you're ready to start honing your text skills on real web projects. Keep experimenting and learning - happy coding!


<CodeEditor fileList={files} slug={slug} />

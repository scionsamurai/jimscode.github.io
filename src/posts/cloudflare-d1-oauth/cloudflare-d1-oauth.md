---
title: Setting Up SvelteKit with Cloudflare Pages, D1 Storage, and OAuth
description: Dive into the world of SvelteKit and discover how to deploy your applications effortlessly using Cloudflare Pages. In this detailed blog post, we cover everything from creating a new SvelteKit project to configuring D1 storage and setting up GitHub OAuth authentication. Follow along with our step-by-step instructions and elevate your web development skills with this powerful tech stack.
date: 'Sat, 04 Aug 2024 12:37:03 GMT'
categories:
  - sveltekit
  - oauth
  - cloudflare
author_id: 1
image: /images/cloudflare-d1-oauth-banner-png.png
webp_image: /images/cloudflare-d1-oauth-banner.webp
image_thumb: /images/cloudflare-d1-oauth-banner-png_thumb.png
banner_alt: unset
show_banner: true
comments: true
published: true
---
## Introduction

In today's rapidly evolving web development landscape, choosing the right tools and services can significantly impact your application's efficiency and performance. This guide will walk you through setting up a powerful and modern web application stack using SvelteKit, Cloudflare Pages, D1 storage, and OAuth authentication.

The completed code can be viewed on [github](https://github.com/scionsamurai/auth-sveltekit-cloudflare-pages).

### The Tech Stack

Let's break down the key components of our stack:

1. **SvelteKit**: A framework for building scalable web applications with a focus on speed and simplicity.
2. **Cloudflare Pages**: A JAMstack platform offering fast, secure hosting with continuous deployment from Git.
3. **Cloudflare D1**: A serverless SQL database running on Cloudflare's global network.
4. **OAuth**: An open standard for secure authentication, which we'll implement using GitHub as the provider.

### Why This Stack?

You might be wondering, "Why should I use this particular combination?" Here are some compelling reasons:

- **Lightning-Fast Performance**: SvelteKit's lean approach, combined with Cloudflare's global CDN, ensures your app loads in the blink of an eye.
- **Effortless Scalability**: From small projects to large-scale applications, Cloudflare Pages and D1 scale without breaking a sweat.
- **Developer-Friendly**: SvelteKit's intuitive model and Cloudflare's streamlined tools make development a breeze.
- **Rock-Solid Security**: OAuth authentication and Cloudflare's robust security features keep your app and user data safe.
- **Cost-Effective**: Pay only for what you use, thanks to the serverless nature of this stack.

### What You'll Learn

By the end of this tutorial, you'll know how to:

1. Set up a SvelteKit project with Cloudflare Pages
2. Configure and use Cloudflare D1 for data storage
3. Implement OAuth authentication with GitHub
4. Connect authentication to D1 for user management
5. Deploy your application to Cloudflare Pages

Whether you're building a personal project or a large-scale application, this stack provides a solid foundation for modern, performant web development. Let's dive in and start building!

## Prerequisites

Before we dive into the nitty-gritty of setting up our SvelteKit application with Cloudflare Pages, D1 storage, and OAuth, let's ensure you have everything you need to follow along smoothly.

### Required Accounts

To get started, you'll need to set up the following accounts:

1. **Cloudflare Account**: If you don't already have one, head over to [Cloudflare's website](https://www.cloudflare.com/) and sign up for a free account.

2. **GitHub Account**: We'll be using GitHub for OAuth authentication, so make sure you have a GitHub account. If you don't, you can create one at [GitHub's signup page](https://github.com/join).

### Essential Tools

Ensure you have the following tools installed on your local machine:

1. **Node.js and npm**: Our project relies on Node.js and npm (Node Package Manager). Install the latest LTS version from the [official Node.js website](https://nodejs.org/).

   To verify your installation, open your terminal and run:
   ```
   node --version
   npm --version
   ```

2. **Wrangler CLI**: Wrangler is Cloudflare's command-line tool for managing Workers and Pages projects. Install it globally using npm:
   ```
   npm install -g wrangler
   ```

   After installation, verify it's working:
   ```
   wrangler --version
   ```

### Development Environment

While not strictly necessary, we recommend using a code editor with good TypeScript and Svelte support. Some popular options include:

- [Visual Studio Code](https://code.visualstudio.com/) with the [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) extension
- [WebStorm](https://www.jetbrains.com/webstorm/)
- [Sublime Text](https://www.sublimetext.com/) with the [Svelte plugin](https://packagecontrol.io/packages/Svelte)

### GitHub OAuth Setup

We'll need to create a new OAuth application in GitHub:

1. Go to your GitHub account settings.
2. Navigate to "Developer settings" > "OAuth Apps" > "New OAuth App".
3. Fill in the application details:
   - Application name: Choose a name (e.g., "My SvelteKit App")
   - Homepage URL: For now, use `http://localhost:5173`
   - Authorization callback URL: Set this to `http://localhost:5173/auth/callback/github`
4. Click "Register application".
5. You'll see your Client ID. Click "Generate a new client secret".
6. Save both the Client ID and Client Secret - we'll need these later.

### Ready to Go!

With these prerequisites in place, you're all set to embark on your journey of building a modern web application with SvelteKit, Cloudflare Pages, D1 storage, and OAuth authentication. In the next section, we'll start by setting up our SvelteKit project and configuring it for Cloudflare Pages deployment.

Remember, if you encounter any issues during setup, don't hesitate to consult the official documentation for each tool or reach out to their respective community forums for support.

## Setting up the SvelteKit Project with Cloudflare

Alright, folks! It's time to roll up our sleeves and dive into the exciting part - setting up our SvelteKit project with Cloudflare. Let's turn those prerequisites into a real, living, breathing web application!

### Creating the Project

First things first, let's create our SvelteKit project using Cloudflare's handy CLI tool. Open up your terminal and let's get cookin'!

1. Run the following command:
   ```
   npm create cloudflare@latest my-sveltekit-app
   ```

2. When prompted, choose "SvelteKit" from the "Framework Starter" options. It should look something like this:
   ```
   ? What would you like to start with
     └─○ Framework Starter
   ```

   ```
   ? Which development framework do you want to use?
     └─○ Svelte
   ```

3. Follow the prompts to customize your SvelteKit project. Feel free to accept the defaults for now - we can always tweak things later.

4. Once the setup is complete, navigate to your new project directory:
   ```
   cd my-sveltekit-app
   ```

### Project Structure Deep Dive

Now that we've got our project set up, let's take a quick tour of what we're working with. Here's a bird's-eye view of our project structure:

```
my-sveltekit-app/
├── src/
│   ├── routes/
│   │   └── +page.svelte
│   ├── app.html
│   └── app.d.ts
├── static/
├── tests/
├── package.json
├── svelte.config.js
├── tsconfig.json
└── wrangler.toml
```

Let's break down some key files:

- `src/routes/+page.svelte`: This is your main page component. SvelteKit uses file-based routing, so this file represents your home page.
- `src/app.html`: The HTML template for your entire app.
- `svelte.config.js`: Configuration for SvelteKit and its adapter.
- `wrangler.toml`: Configuration for Cloudflare Workers and Pages.

### Cloudflare Configuration

Now, let's make sure our project is properly configured for Cloudflare:

1. Install adapter and open `svelte.config.js` to ensure it's using the Cloudflare adapter:
   ```
   npm install -D @sveltejs/adapter-cloudflare
   ```

   ```javascript
    import adapter from '@sveltejs/adapter-cloudflare';
    import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

    /** @type {import('@sveltejs/kit').Config} */
    const config = {

        preprocess: vitePreprocess(),

        kit: {

            adapter: adapter({
                routes: {
                    include: ['/*'],
                    exclude: ['<all>']
                }
            })
        }
    };

    export default config;
   ```

2. Check your `wrangler.toml` file. It should look something like this:

   ```toml
   name = "my-sveltekit-app"
   compatibility_date = "2023-03-14"

   [site]
   bucket = "./build"
   ```

   Don't worry if some details are different - Cloudflare's CLI tool should have set this up correctly for you.

### Taking It for a Spin

Let's make sure everything's working as expected:

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`. Ideally we haven't broken anything yet and we can keep on rolling!

### Logging into Wrangler

Before we can deploy our app, we need to log in to Wrangler:

1. Run the following command:
   ```
   npx wrangler login
   ```

2. This will open a browser window. Follow the prompts to log in to your Cloudflare account.

3. Once logged in, you'll see a success message in your terminal.

Absolutely! Let's include a step for creating the GitHub repository before pushing your SvelteKit application. Here’s the revised version:

## Deploying Your SvelteKit App to Cloudflare Pages

Let's deploy our SvelteKit app to Cloudflare Pages using GitHub. Follow these steps:

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in to your account.
2. Click on the "+" icon in the top right corner and select "New repository".
3. Enter a name for your repository (e.g., `your-repo-name`).
4. Optionally, add a description and choose whether to make it public or private.
5. Click "Create repository".

### Step 2: Push Your Project to GitHub

Now that you have a repository, you can push your SvelteKit project to it:

1. Open your terminal and navigate to your SvelteKit project directory.
2. Initialize a new Git repository and push your code:

   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

Certainly! Here's the revised section with the bonus tip added:

### Step 3: Deploy to Cloudflare Pages

1. Log in to your Cloudflare account and navigate to the "Workers & Pages" section.
2. Click "Create" and switch to the "Pages" tab.
3. Select "Connect to Git" and choose GitHub as your Git provider and authorize Cloudflare to access your repositories.
4. Select the repository you just created for your SvelteKit app.
5. Configure your build settings:
   - **Framework preset**: `SvelteKit`
   - **Build command**: `npm run build`
   - **Build output directory**: `.svelte-kit/cloudflare`
   - **Environment variables**: Add `NODE_VERSION` with a value of `20.13.1` (or your preferred Node.js version).
6. Click "Save and Deploy".

Cloudflare Pages will now build and deploy your application. Once the deployment is complete, you'll receive a URL where your app is live.

<script>
    import SummaryDetails from '$lib/components/SummaryDetails.svelte'
</script>
<SummaryDetails summary="HELP! My build fails due to a Node.js version incompatibility error!">

An example of this error is below.

```
npm ERR! code EBADENGINE
npm ERR! engine Unsupported engine
npm ERR! engine Not compatible with your version of node/npm: @eslint/config-array@0.17.1
npm ERR! notsup Not compatible with your version of node/npm: @eslint/config-array@0.17.1
npm ERR! notsup Required: {"node":"^18.18.0 || ^20.9.0 || >=21.1.0"}
npm ERR! notsup Actual:   {"npm":"9.6.7","node":"v18.17.1"}
```

Follow these steps to resolve it:

1. Go to the "Settings" page of your Cloudflare Pages project.
2. Scroll down to the "Environment variables" section.
3. Click on "Edit variables" for both "Production" and "Preview" environments.
4. Find the `NODE_VERSION` variable and update its value to a compatible version (e.g., `20.9.0` or higher).
5. Make sure to click the "Encrypt" checkbox next to the `NODE_VERSION` variable.
6. Save your changes.

</SummaryDetails>

### Step 4: Update Your App

Whenever you make changes to your project, follow these steps to update your app:

1. Commit and push your changes to GitHub:

   ```
   git add .
   git commit -m "Update app"
   git push
   ```

2. Cloudflare Pages will automatically detect the new commit and redeploy your app.

And there you have it! Your SvelteKit app is now live on Cloudflare Pages. In the next section, we'll set up our Cloudflare D1 database to add data persistence to our application. Keep up the great work!

## Configuring Cloudflare D1 Database

Alright, data enthusiasts! It's time to add some persistence to our SvelteKit app with Cloudflare D1. Buckle up, because we're about to turn our application into a data-driven powerhouse!

### What's D1, Anyway?

Before we dive in, let's quickly recap: D1 is Cloudflare's serverless SQL database. It's like having a turbo-charged SQLite database that lives on the edge. Cool, right?

### Creating Our D1 Database

First things first, let's create our database:

1. Log into your Cloudflare dashboard (if you haven't already).
2. Navigate to the "Workers & Pages" section.
3. Click on the "D1" tab.
4. Hit that "Create database" button!
5. Give your database a snazzy name. How about "my_sveltekit_db"?
6. Click "Create" and watch the magic happen!

### Setting Up Tables

Now that we have our database, let's give it some structure. We'll create a simple "users" table to store our authenticated users. If you want to run any of these commands on the remote server (non-dev) you can add the "--remote" flag to the commands.

1. In your terminal, run this command:

   ```
   npx wrangler d1 execute my_db --command "CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, name TEXT, image TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"

   ```

2. If all goes well, you should see a success message. Let's verify by checking our table:

   ```
   npx wrangler d1 execute my_sveltekit_db --command "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
   ```

   You should see your "users" table listed. High five! ✋

### Connecting D1 to Our SvelteKit Project

Now comes the fun part - linking our shiny new database to our SvelteKit app.

1. Open your `wrangler.toml` file and add the following:

   ```toml
   [[d1_databases]]
   binding = "DB" # i.e. available in your Worker on env.DB
   database_name = "my_sveltekit_db"
   database_id = "<your-database-id>"
   ```

   Replace `<your-database-id>` with the actual ID from your Cloudflare dashboard.


2. Now, let's update our `src/app.d.ts` to include our database type:

   ```typescript
   /// <reference types="@cloudflare/workers-types" />

   // See https://kit.svelte.dev/docs/types#app
   // for information about these interfaces
   declare global {
     namespace App {
       // interface Error {}
       // interface Locals {}
       // interface PageData {}
       // interface Platform {}
       interface Platform {
         env: {
           DB: D1Database;
         };
       }
     }
   }

   export {};
   ```

### Testing Our Database Connection

Let's make sure everything's connected properly by creating a simple API route to fetch users.

1. Create a new file `src/routes/api/users/+server.ts`:

   ```typescript
    import type { RequestHandler } from "@sveltejs/kit";

    /** @type {import('@sveltejs/kit').RequestHandler} */
    export async function GET({ request, platform }) {
    let result = await platform.env.DB.prepare(
        "SELECT * FROM users LIMIT 5"
    ).run();
    return new Response(JSON.stringify(result));
    }
   ```

2. Start your development server:

   ```
   npm run dev
   ```

3. Visit `http://localhost:5173/api/users` in your browser. You should see an empty array `[]` (since we haven't added any users yet), but no errors. That means we're connected!

## Implementing OAuth Authentication

Alright, security squad! It's time to add some street cred to our app with OAuth authentication. We're going to use GitHub as our OAuth provider, because who doesn't love a little social coding flair? Let's dive in and make our app as secure as Fort Knox, but way cooler!

### Setting Up GitHub OAuth

First things first, let's get our GitHub OAuth credentials in order:

1. Head over to your GitHub account and navigate to Settings > Developer settings > OAuth Apps.
2. Click on "New OAuth App" (or use the one we created in the prerequisites).
3. Fill in the details:
   - Application name: "My Awesome SvelteKit App" (or whatever floats your boat)
   - Homepage URL: `http://localhost:5173` (we'll change this later for production)
   - Authorization callback URL: `http://localhost:5173/auth/callback/github`
4. Click "Register application".
5. You'll see your Client ID. Click "Generate a new client secret".
6. Keep this page open, we'll need these credentials in a bit!

### Installing the Auth Packages

Time to beef up our project with some authentication muscle:

```
npm install @auth/core @auth/sveltekit
npm install -D dotenv
```

### Setting Up Environment Variables

Let's keep our secrets secret:

1. Create a `.env` file in your project root:

   ```
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   AUTH_SECRET=your_random_secret_here
   ```

   Replace `your_github_client_id` and `your_github_client_secret` with the values from GitHub. For `AUTH_SECRET`, use a random string (you can generate one with `openssl rand -base64 32`).

2. Add `.env` to your `.gitignore` file to keep your secrets out of version control.

When deploying to Cloudflare Pages, you can add these environment variables in the Cloudflare dashboard under your project's settings. Alternatively, you can add these variables to the `wrangler.toml` file, and they will be available during deployment. Please exercise caution when adding variables to the `wrangler.toml` file as they will be publicly visible if your GitHub repository is set to public. Consider setting your repository to private if you choose this route. Here’s how to add them to the `wrangler.toml` file:

```toml
[vars]
AUTH_SECRET = "github_auth_secret"
AUTH_TRUST_HOST = "true"
GITHUB_ID = "github_id_generated_for_oauth"
GITHUB_SECRET = "secret_generated_with_id"
```

### Configuring Authentication

Now, let's set up our authentication logic. We'll start with the basic GitHub OAuth setup and then add user-saving functionality later.

1. Create a new file `src/auth.ts`:

   ```typescript
   import { SvelteKitAuth } from '@auth/sveltekit';
   import GitHub from '@auth/sveltekit/providers/github';
   import dotenv from 'dotenv';

   // Load environment variables from .env file during development
   if (process.env.NODE_ENV !== 'production') {
       dotenv.config();
   }

   export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
       const dev = process.env.NODE_ENV !== 'production';
       const authOptions = {
           providers: [
               GitHub({
                   clientId: dev ? process.env.GITHUB_ID : event.platform?.env?.GITHUB_ID,
                   clientSecret: dev ? process.env.GITHUB_SECRET : event.platform?.env?.GITHUB_SECRET
               })
           ],
           secret: dev ? process.env.AUTH_SECRET : event.platform?.env?.AUTH_SECRET,
           trustHost: true
       };
       return authOptions;
   });
   ```

   This file sets up the core authentication logic using SvelteKitAuth. It configures GitHub as the OAuth provider and handles environment variables for both development and production environments.

2. Update `src/hooks.server.ts`:

   ```typescript
   export { handle } from "./auth";
   ```

   This file exports the `handle` function from our auth configuration, which SvelteKit will use to process authentication for each request.

3. Create `src/routes/+layout.server.ts`:

   ```typescript
   import type { LayoutServerLoad } from './$types';

   export const load: LayoutServerLoad = async (event) => {
       const dev = process.env.NODE_ENV !== 'production';
       return {
           session: await event.locals.auth(),
           authProviders: {
               github: {
                   clientId: dev ? process.env.GITHUB_ID : event.platform?.env?.GITHUB_ID
               }
           }
       };
   };
   ```

   This layout server load function provides the session data and GitHub client ID to all routes in your app. It ensures that authentication state is available throughout your application.

4. Update `src/routes/+layout.svelte` to include login/logout buttons:

   ```svelte
   <script lang="ts">
     import { signIn, signOut } from "@auth/sveltekit/client";
     import { page } from "$app/stores";

     $: ({ session, authProviders } = $page.data);
   </script>

   <nav>
     {#if session}
       <span>Welcome, {session.user?.name}!</span>
       <button on:click={() => signOut()}>Sign out</button>
     {:else}
       <button on:click={() => signIn("github")}>Sign in with GitHub</button>
     {/if}
   </nav>

   <slot />
   ```

   This layout component provides a simple UI for signing in and out. It displays a welcome message and sign-out button when the user is authenticated, or a sign-in button when they're not.

Now, let's test our GitHub authentication:

1. Start your development server:
   ```
   npm run dev
   ```

2. Visit `http://localhost:5173` and try logging in with GitHub. You should be able to authenticate successfully.

3. After logging in, you should see your GitHub name displayed and a sign-out button.

Great! Now that we've confirmed our basic authentication is working, let's add the user-saving functionality.

5. Update `src/auth.ts` to include callbacks:

   ```typescript
   // ... previous imports ...

   async function saveUser(event, user) {
       const response = await event.fetch('/api/save-user', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(user)
       });
       if (!response.ok) {
           throw new Error('Failed to save user');
       }
   }

   export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
       // ... previous configuration ...
       const authOptions = {
           // ... previous options ...
           callbacks: {
               async signIn({ user }) {
                   await saveUser(event, user);
                   return true;
               },
               async session({ session }) {
                   const { user } = session;
                   if (session?.user) {
                       session.user.id = user.id;
                   }
                   return session;
               }
           }
       };
       return authOptions;
   });
   ```

6. Create a new file `src/routes/api/save-user/+server.ts`:

   ```typescript
    import type { RequestHandler } from '@sveltejs/kit';

    export const POST: RequestHandler = async ({ request, platform }) => {
        try {
            const user = await request.json();
            const results = await saveUserToDatabase(platform?.env, user);
            return new Response(JSON.stringify(results), { status: 201 });
        } catch (error) {
            console.error('Error saving user:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    };

    async function saveUserToDatabase(env, user) {
        try {
            // Check if the user already exists by email
            const existingUser = await env.DB.prepare('SELECT name, image FROM users WHERE email = ?')
                .bind(user.email)
                .first();

            if (existingUser) {
                // User exists, update only if name or image has changed
                let updateNeeded = false;
                const updateFields = [];

                if (existingUser.name !== user.name) {
                    updateFields.push('name = ?');
                    updateFields.push(user.name);
                    updateNeeded = true;
                }

                if (existingUser.image !== user.image) {
                    updateFields.push('image = ?');
                    updateFields.push(user.image);
                    updateNeeded = true;
                }

                if (updateNeeded) {
                    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE email = ?`;
                    const updateResult = await env.DB.prepare(updateQuery)
                        .bind(...updateFields, user.email)
                        .run();
                    return { status: 'updated', results: updateResult };
                }

                return { status: 'no-change', results: null };
            } else {
                // User does not exist, insert a new record
                const insertResult = await env.DB.prepare(
                    'INSERT INTO users (name, email, image) VALUES (?, ?, ?)'
                )
                    .bind(user.name, user.email, user.image)
                    .run();
                return { status: 'created', results: insertResult };
            }
        } catch (error) {
            console.error('Error saving user to database:', error);
            throw new Error('Database operation failed');
        }
    }
   ```

   This endpoint handles saving the user data to your database. Make sure you've implemented the `saveUserToDatabase` function in your `$lib/db.ts` file as discussed in previous sections.

With these additions, your app will now attempt to save user data to the database upon successful authentication. To test this functionality:

1. Log out of your application if you're currently logged in.
2. Log in again using GitHub authentication.
3. If no errors appear during this process, it's a good sign that things are working as expected.
4. To further verify, navigate to `localhost:5173/api/users` in your browser.
5. You should see your user information displayed, confirming that the data was successfully saved to the database.

Remember to thoroughly test this functionality and handle any potential errors that may occur during the save process. If you encounter any issues, review your code and database configuration to ensure everything is set up correctly.

### Protecting Routes

Want to keep some pages for authenticated users only? No problemo!

Create `src/routes/protected/+page.server.ts`:

```typescript
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.auth();
  if (!session?.user) throw redirect(303, '/');
  return { user: session.user };
};
```

And `src/routes/protected/+page.svelte`:

```svelte
<script lang="ts">
  export let data;
</script>

<h1>Top Secret Area</h1>
<p>Welcome to the cool kids club, {data.user.name}!</p>
```

### Testing Our Authentication

1. Start your development server:

   ```
   npm run dev
   ```

2. Visit `http://localhost:5173` and try logging in with GitHub.
3. After logging in, check your D1 database:

   ```
   npx wrangler d1 execute my_sveltekit_db --command "SELECT * FROM users"
   ```

   You should see your user info stored in the database. How cool is that?

## Saving Authenticated Users in the Database

Let's dive into the nitty-gritty of saving our authenticated users to our D1 database. This is where the magic of persistence meets the power of authentication!

### Updating Our User Schema

Let's ensure our `users` table can handle all the information we want to store:

1. Create a new SQL file (e.g., `update_users_schema.sql`) in your project directory and add the following SQL command:

   ```sql
   DROP TABLE IF EXISTS users;
   CREATE TABLE IF NOT EXISTS users (
     email TEXT PRIMARY KEY,
     name TEXT,
     image TEXT,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     last_login DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. Save the file and then run the following command using Wrangler to execute the SQL file:

   ```
   npx wrangler d1 execute my_sveltekit_db --file update_users_schema.sql
   ```

This approach allows you to keep your SQL commands organized in a file and makes it easier to manage and update your database schema.

### Adding a User Profile Page

Let's create a profile page to display the user's information:

Create `src/routes/profile/+page.server.ts`:

```typescript
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.auth();
  if (!session?.user) throw redirect(303, '/');
  return { user: session.user };
};
```

And `src/routes/profile/+page.svelte`:

```svelte
<script lang="ts">
  export let data;
  const { user } = data;
</script>

<h1>User Profile</h1>
<img src={user.image} alt={user.name} style="width: 100px; height: 100px; border-radius: 50%;" />
<p>Name: {user.name}</p>
<p>Email: {user.email}</p>
```

### Testing Our User Saving Functionality

1. Start your development server:
   ```
   npm run dev
   ```

2. Visit `http://localhost:5173` and log in with GitHub.

3. After logging in, visit `http://localhost:5173/profile`. You should see your profile information, including the last login time.

## Conclusion: Your SvelteKit App is Ready to Conquer the Web!

Well, folks, we've been on quite the journey together! From setting up our SvelteKit project to implementing OAuth, and wrangling our D1 database. Let's take a moment to bask in the glory of what we've accomplished:

1. We've set up a blazing-fast SvelteKit application
2. Implemented secure OAuth authentication with GitHub
3. Stored and managed user data with Cloudflare's D1 database

### What's Next?

The sky's the limit! Here are some ideas to take your app to the next level:

- Implement additional OAuth providers (Google, Facebook, Twitter, etc.)
- Create a user dashboard with personalized content
- Add more real-time features like live chat or collaborative editing
- Implement server-side rendering (SSR) for improved SEO
- Optimize your app's performance using Cloudflare's analytics

### Final Thoughts

Building modern web applications doesn't have to be a headache. With SvelteKit, Cloudflare Pages, D1, and Durable Objects, we've created a powerful, scalable, and real-time capable application without breaking a sweat (okay, maybe a little sweat, but it was worth it!).

Remember, the best apps are those that continue to evolve. Keep learning, keep experimenting, and most importantly, keep having fun with it!

You've now got a solid foundation in some of the most exciting web technologies out there. So go forth and build amazing things! Who knows? Your next project could be the next big thing on the web.

### Additional Resources

To help you continue your journey and dive deeper into the technologies we've used, here are some valuable resources:

1. **[SvelteKit Documentation](https://kit.svelte.dev/docs)**: The official docs are your best friend for all things SvelteKit.

2. **[Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)**: Learn more about deploying and optimizing your sites on Cloudflare Pages.

3. **[Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)**: Dive deeper into D1's capabilities and advanced querying techniques.

4. **[Durable Objects Documentation](https://developers.cloudflare.com/workers/learning/using-durable-objects/)**: Explore more ways to leverage Durable Objects for stateful applications.

5. **[Auth.js Documentation](https://authjs.dev/)**: Discover more authentication providers and advanced configurations.

6. **[Svelte Society](https://sveltesociety.dev/)**: Join the Svelte community, find resources, and stay updated with the latest in Svelte ecosystem.

7. **[Cloudflare Workers Discord](https://discord.gg/cloudflaredev)**: Connect with other developers and get help with Cloudflare-specific questions.


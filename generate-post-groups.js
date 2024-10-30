import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDir = path.join(__dirname, 'src', 'posts');
const outputFile = path.join(__dirname, 'src', 'lib', 'post-groups.json');

async function generatePostGroups() {
    const postGroups = {};

    try {
        // Read the posts directory
        const groupDirs = await fs.readdir(postsDir, { withFileTypes: true });

        for (const groupDir of groupDirs) {
            if (!groupDir.isDirectory()) continue;

            const groupPath = path.join(postsDir, groupDir.name);
            const postDirs = await fs.readdir(groupPath, { withFileTypes: true });

            for (const postDir of postDirs) {
                if (!postDir.isDirectory()) continue;

                const postPath = path.join(groupPath, postDir.name);
                const postFiles = await fs.readdir(postPath);

                // Check if there's a markdown file with the same name as the directory
                const matchingMdFile = postFiles.find(
                    file => file === `${postDir.name}.md`
                );

                if (matchingMdFile) {
                    postGroups[postDir.name] = {
                        group: groupDir.name
                    };
                }
            }
        }

        // Create lib directory if it doesn't exist
        const libDir = path.dirname(outputFile);
        await fs.mkdir(libDir, { recursive: true });

        // Write the mapping to post-groups.json
        await fs.writeFile(
            outputFile,
            JSON.stringify(postGroups, null, 2)
        );

        console.log('Generated post-groups.json successfully');
    } catch (error) {
        console.error('Error generating post-groups.json:', error);
        process.exit(1);
    }
}

generatePostGroups();
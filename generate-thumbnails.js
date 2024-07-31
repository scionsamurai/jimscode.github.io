const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const sourceDir = './static/images';
const thumbnailSuffix = '_thumb';
const exclusionList = ['stars.png', 'colormodebutton.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png', 'apple-touch-icon.png', 'favicon-16x16.png', 'favicon-32x32.png', 'mstile-150x150.png'];

async function generateThumbnail(imagePath) {
    const dir = path.dirname(imagePath);
    const filename = path.basename(imagePath);
    const [name, ext] = filename.split('.');

    if (name.endsWith(thumbnailSuffix) || exclusionList.includes(filename)) {
        console.log(`Skipping '${filename}' - excluded or already a thumbnail`);
        return;
    }

    const thumbnailName = `${name}${thumbnailSuffix}.${ext}`;
    const thumbnailPath = path.join(dir, thumbnailName);

    // Check if thumbnail already exists
    try {
        await fs.access(thumbnailPath);
        console.log(`Skipping '${filename}' - thumbnail already exists`);
        return;
    } catch (error) {
        // Thumbnail doesn't exist, proceed with generation
    }

    try {
        await sharp(imagePath)
            .resize(460, 276, { fit: 'inside', withoutEnlargement: true })
            .toFile(thumbnailPath);
        console.log(`Generated thumbnail for '${filename}'`);
    } catch (error) {
        console.error(`Failed to generate thumbnail for '${filename}':`, error);
    }
}

async function traverseFolder(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await traverseFolder(fullPath);
        } else if (entry.isFile() && /\.(jpg|jpeg|png)$/i.test(entry.name)) {
            await generateThumbnail(fullPath);
        }
    }
}

traverseFolder(sourceDir).catch(console.error);
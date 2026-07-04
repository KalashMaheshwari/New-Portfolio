const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicImagesDir = path.join(__dirname, 'public/images');
const certificatesDir = path.join(__dirname, 'public/images/Certificates');
const mamasCakesDir = path.join(__dirname, 'public/images/mamas-cakes');

const processDirectory = (directory) => {
    if (!fs.existsSync(directory)) {
        console.log(`Directory does not exist: ${directory}`);
        return;
    }

    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        // If it's a file and an image
        if (stat.isFile() && file.match(/\.(jpe?g|png|webp|tif)$/i)) {
            const parsedPath = path.parse(file);
            const avifPath = path.join(directory, `${parsedPath.name}.avif`);
            
            if (!fs.existsSync(avifPath)) {
                sharp(fullPath)
                    .avif({ quality: 80 })
                    .toFile(avifPath)
                    .then(() => console.log(`Optimized: ${path.relative(__dirname, fullPath)} -> ${parsedPath.name}.avif`))
                    .catch(err => console.error(`Error processing ${file}:`, err));
            }
        }
    });
};

console.log("Processing public/images...");
processDirectory(publicImagesDir);
console.log("Processing public/images/Certificates...");
processDirectory(certificatesDir);
console.log("Processing public/images/Mummascakesbymahek...");
processDirectory(path.join(__dirname, 'public/images/Mummascakesbymahek'));

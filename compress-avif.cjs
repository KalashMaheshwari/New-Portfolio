const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public/images/journey');
const outputDir = inputDir; // We'll put them in the same directory

const files = fs.readdirSync(inputDir);

files.forEach(file => {
    if (file.match(/^(bust|Hbust).*\.(jpe?g|png)$/i)) {
        const parsedPath = path.parse(file);
        sharp(path.join(inputDir, file))
            .avif({ quality: 80 })
            .toFile(path.join(outputDir, `${parsedPath.name}.avif`))
            .then(() => console.log(`Optimized: ${file} -> ${parsedPath.name}.avif`))
            .catch(err => console.error(`Error processing ${file}:`, err));
    }
});

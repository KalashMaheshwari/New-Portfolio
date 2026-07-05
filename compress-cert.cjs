const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/images/Certificates');

fs.readdirSync(dir).forEach(file => {
    if (file.match(/\.(jpe?g|png)$/i)) {
        sharp(path.join(dir, file))
            .webp({ quality: 60 })
            .toFile(path.join(dir, `${path.parse(file).name}.webp`))
            .then(() => console.log(`Optimized: ${file} -> .webp`))
            .catch(err => console.error(`Error processing ${file}:`, err));
    }
});

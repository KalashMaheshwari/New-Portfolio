const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.log('Installing sharp dependency...');
  execSync('npm install sharp --no-save', { stdio: 'inherit' });
}

const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'public', 'images');

function getFiles(dir, files_ = []) {
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = path.join(dir, files[i]);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

async function compressImages() {
  if (!fs.existsSync(imagesDir)) {
    console.error('Images directory not found:', imagesDir);
    return;
  }

  const files = getFiles(imagesDir);
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.avif'];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExtensions.includes(ext)) continue;

    const baseName = path.basename(file, ext);
    const dirName = path.dirname(file);
    const outputPath = path.join(dirName, `${baseName}.webp`);

    try {
      console.log(`Compressing and converting: ${file} -> ${outputPath}`);
      await sharp(file)
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath + '.tmp');

      // Rename tmp to actual file
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      fs.renameSync(outputPath + '.tmp', outputPath);

      // Delete original if it wasn't webp
      if (ext !== '.webp') {
        fs.unlinkSync(file);
        console.log(`Deleted original non-webp: ${file}`);
      }
    } catch (err) {
      console.error(`Failed to process ${file}:`, err.message);
    }
  }
}

compressImages().then(() => console.log('Image compression completed.'));

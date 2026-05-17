const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

// Check if ffmpeg is available
try {
  execSync(`"${ffmpeg}" -version`, { stdio: 'ignore' });
} catch (e) {

  console.error('CRITICAL ERROR: ffmpeg command is not found on this system.');
  console.error('Please ensure ffmpeg is installed and added to your system PATH.');
  process.exit(1);
}

const publicDir = path.join(__dirname, 'public');

function getFiles(dir, files_ = []) {
  if (!fs.existsSync(dir)) return files_;
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

function compressVideos() {
  const files = getFiles(publicDir);
  const videoExtensions = ['.mp4', '.mov', '.avi'];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!videoExtensions.includes(ext)) continue;

    const dirName = path.dirname(file);
    const baseName = path.basename(file, ext);
    const webmPath = path.join(dirName, `${baseName}.webm`);
    const mp4CompressedPath = path.join(dirName, `${baseName}_compressed.mp4`);
    const finalMp4Path = path.join(dirName, `${baseName}.mp4`);

    try {
      console.log(`--- Processing: ${baseName} ---`);
      
      // 1. Generate WebM
      console.log(`Compressing to WebM: ${file} -> ${webmPath}`);
      execSync(`"${ffmpeg}" -y -i "${file}" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 128k "${webmPath}"`, { stdio: 'inherit' });

      // 2. Generate Compressed MP4
      console.log(`Compressing to MP4 Fallback: ${file} -> ${mp4CompressedPath}`);
      execSync(`"${ffmpeg}" -y -i "${file}" -c:v libx264 -crf 28 -preset faster -acodec aac -b:a 128k "${mp4CompressedPath}"`, { stdio: 'inherit' });


      // 3. Cleanup & Replace
      // Rename original to a temp name if it's the target mp4 path
      const tempOriginal = file + '.original.bak';
      fs.renameSync(file, tempOriginal);
      
      // Move compressed mp4 to final path
      fs.renameSync(mp4CompressedPath, finalMp4Path);
      
      // Delete backup original
      fs.unlinkSync(tempOriginal);
      
      console.log(`Successfully processed: ${baseName}\n`);
    } catch (err) {
      console.error(`Failed to process video ${file}:`, err.message);
      // Try to recover original if possible
      const tempOriginal = file + '.original.bak';
      if (fs.existsSync(tempOriginal) && !fs.existsSync(file)) {
          fs.renameSync(tempOriginal, file);
      }
    }
  }
}

compressVideos();
console.log('Video compression pipeline finished.');

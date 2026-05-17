/**
 * compress_skill_videos.cjs
 * Downscales all skill videos to 480p using ffmpeg-static.
 * Processes both .mp4 and .webm versions.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

let ffmpegPath;
try {
  ffmpegPath = require('ffmpeg-static');
} catch {
  console.error('ffmpeg-static not found. Run: npm install ffmpeg-static');
  process.exit(1);
}

const VIDEOS_DIR = path.join(__dirname, 'public', 'videos');

// Only skill videos (not hero/footer videos)
const SKILL_VIDEOS = [
  'Brand Identity',
  'Creative Development',
  'Full Stack',
  'Motion & Animation',
  'Problem Solving',
  'SEO',
  'System Progrmming',
  'UI UX Design',
];

const FORMATS = [
  { ext: '.mp4', codec: '-c:v libx264 -preset fast -crf 28' },
  { ext: '.webm', codec: '-c:v libvpx-vp9 -crf 35 -b:v 0' },
];

console.log('═══════════════════════════════════════════');
console.log('  Skill Video Compressor → 480p');
console.log('═══════════════════════════════════════════\n');

let processed = 0;
let skipped = 0;

for (const name of SKILL_VIDEOS) {
  for (const fmt of FORMATS) {
    const inputFile = path.join(VIDEOS_DIR, `${name}${fmt.ext}`);

    if (!fs.existsSync(inputFile)) {
      console.log(`  ⏭  SKIP (not found): ${name}${fmt.ext}`);
      skipped++;
      continue;
    }

    const origSize = (fs.statSync(inputFile).size / 1024).toFixed(0);
    const tmpFile = path.join(VIDEOS_DIR, `${name}_480p_tmp${fmt.ext}`);

    console.log(`  🎬 Processing: ${name}${fmt.ext} (${origSize} KB)`);

    try {
      // Scale to 480p height, maintain aspect ratio (width divisible by 2)
      const cmd = `"${ffmpegPath}" -i "${inputFile}" -vf "scale=-2:480" ${fmt.codec} -an -y "${tmpFile}"`;
      execSync(cmd, { stdio: 'pipe', timeout: 120000 });

      // Replace original with compressed version
      const newSize = (fs.statSync(tmpFile).size / 1024).toFixed(0);
      const savings = (((origSize - newSize) / origSize) * 100).toFixed(1);

      fs.unlinkSync(inputFile);
      fs.renameSync(tmpFile, inputFile);

      console.log(`  ✅ Done: ${origSize} KB → ${newSize} KB (${savings}% smaller)\n`);
      processed++;
    } catch (err) {
      console.error(`  ❌ Failed: ${name}${fmt.ext} — ${err.message}\n`);
      // Clean up temp file if it exists
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  }
}

console.log('═══════════════════════════════════════════');
console.log(`  Done! ${processed} compressed, ${skipped} skipped.`);
console.log('═══════════════════════════════════════════');

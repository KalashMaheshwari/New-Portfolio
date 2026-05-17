
---

# Project Analysis & Optimization Roadmap: `gemini.md`

## 1. Executive Summary & Root Cause Analysis
Current performance issues (browser hanging) are likely caused by **Main Thread Blocking**. When the CPU is busy calculating complex animations or decoding massive 4K videos/images, it cannot handle user input, leading to a "frozen" UI.

| Issue | Impact | Fix Strategy |
| :--- | :--- | :--- |
| **Laggy UI/Hanging** | High | Implement `will-change` CSS properties, optimize GSAP tickers, and use Web Workers for heavy logic. |
| **Useless Preloader** | Medium | Convert to a **Promise-based loader** that tracks `window.onload` and asset buffer states. |
| **Heavy Assets** | Critical | Batch convert all imagery to `.webp` and transcode videos to `.webm` with lower bitrates. |
| **Script Bloat** | Medium | Audit brackets and loops. Replace nested `forEach` with optimized `for` loops where performance is key. |

---

## 2. Codebase "Tip-Toe" Optimization

### GSAP & Animation Performance
If you are using high-end motion libraries, ensure you aren't animating properties that trigger **Layout Thrashing** (like `top`, `left`, or `margin`). 
* **Fix:** Only animate `transform` (x, y, scale, rotation) and `opacity`.
* **Optimization:** Use `force3D: true` in GSAP to offload rendering to the GPU.

### The "Useful" Preloader Logic
Instead of a simple `setTimeout`, use the **Resource Selection API**.
```javascript
// Optimized Preloader Logic
const preloader = document.querySelector('.preloader');
const startLoading = Date.now();

window.addEventListener('load', () => {
    const elapsed = Date.now() - startLoading;
    const minimumDisplayTime = 2000; // Ensure branding is seen
    const remainingTime = Math.max(0, minimumDisplayTime - elapsed);

    setTimeout(() => {
        preloader.classList.add('fade-out');
        // Trigger your GSAP "In-Intro" here
    }, remainingTime);
});
```

---

## 3. Automated Asset Compression Scripts

To fix the "lag," we must reduce the payload. Run these scripts in your terminal (requires Node.js and FFmpeg installed).

### A. Image Compression (To WebP)
Create a file named `compress-images.js`:
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './src/assets/raw-images';
const outputDir = './public/images';

fs.readdirSync(inputDir).forEach(file => {
    if (file.match(/\.(jpe?g|png|tif)$/i)) {
        sharp(`${inputDir}/${file}`)
            .webp({ quality: 80 })
            .toFile(`${outputDir}/${path.parse(file).name}.webp`)
            .then(() => console.log(`Optimized: ${file}`))
            .catch(err => console.error(err));
    }
});
```

### B. Video Compression (FFmpeg Bash Script)
Create a file named `compress-video.sh`:
```bash
#!/bin/bash
# Compresses all mp4s in a folder to optimized webm
for f in ./src/assets/videos/*.mp4; do
    ffmpeg -i "$f" -vcodec libvpx-vp9 -crf 30 -b:v 0 -an "${f%.mp4}.webm"
done
```

---

## 4. The "Small Bracket" Audit
* **Memory Leaks:** Check for event listeners added inside loops or `requestAnimationFrame` without a cleanup function.
* **Micro-fixes:** * Ensure all `<img>` tags have `loading="lazy"` except for the hero image.
    * Replace `StringTune.js` or `Anime.js` instances that are running in the background while the user is on a different tab using the `Page Visibility API`.

---

## 5. Implementation Checklist
1.  [ ] **Run Compression:** Convert all assets and update code references to `.webp` and `.webm`.
2.  [ ] **CSS Audit:** Add `contain: paint;` to sections that don't need to interact with the rest of the layout.
3.  [ ] **JS Cleanup:** Wrap GSAP animations in `gsap.context()` to ensure proper memory management.
4.  [ ] **Test:** Use Chrome DevTools **Lighthouse** to verify the "Performance" score is above 90.

How many video files are we currently dealing with, and what is the total size of your assets folder?
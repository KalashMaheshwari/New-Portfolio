import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderCircleRef = useRef<SVGCircleElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const overlay = overlayRef.current;
    const character = characterRef.current;
    const video = videoRef.current;
    const percentEl = percentRef.current;
    const loader = loaderRef.current;
    const circle = loaderCircleRef.current;

    if (!overlay || !character || !video || !percentEl || !loader || !circle) return;

    const startLoading = Date.now();
    let isLoaded = false;

    const handleVideoEnd = () => {
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => { });
        }
      }, 1000);
    };

    video.addEventListener('ended', handleVideoEnd);
    video.play().catch(() => { });

    // SVG Circle setup
    const circumference = 2 * Math.PI * 20;
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    // ── Real Asset Tracking ──────────────────────────────────────
    // Track actual loading: fonts, images, and the hero video.
    // The counter reflects REAL progress instead of a fake tween.
    let realProgress = 0;
    const totalAssets = 3; // fonts, images batch, readyState
    let loadedAssets = 0;

    const updateProgress = (target: number) => {
      // Smoothly tween the counter toward the real progress
      gsap.to({ val: realProgress }, {
        val: Math.min(target, 100),
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: function () {
          const currentVal = Math.floor(this.targets()[0].val);
          realProgress = currentVal;
          setPercent(currentVal);
          const offset = circumference - (currentVal / 100) * circumference;
          circle.style.strokeDashoffset = String(offset);
        },
      });
    };

    // Track font loading
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        loadedAssets++;
        updateProgress(Math.floor((loadedAssets / totalAssets) * 90));
      });
    } else {
      loadedAssets++;
    }

    // Track critical images (any in the viewport)
    const allImages = Array.from(document.querySelectorAll('img'));
    if (allImages.length > 0) {
      let imagesLoaded = 0;
      const checkAllImages = () => {
        imagesLoaded++;
        if (imagesLoaded >= allImages.length) {
          loadedAssets++;
          updateProgress(Math.floor((loadedAssets / totalAssets) * 90));
        }
      };
      allImages.forEach((img) => {
        if (img.complete) {
          checkAllImages();
        } else {
          img.addEventListener('load', checkAllImages, { once: true });
          img.addEventListener('error', checkAllImages, { once: true });
        }
      });
    } else {
      loadedAssets++;
      updateProgress(Math.floor((loadedAssets / totalAssets) * 90));
    }

    // Track window.load (all sub-resources)
    const onWindowLoad = () => {
      loadedAssets++;
      updateProgress(Math.floor((loadedAssets / totalAssets) * 90));
    };

    if (document.readyState === 'complete') {
      onWindowLoad();
    } else {
      window.addEventListener('load', onWindowLoad, { once: true });
    }

    // ── Finish Loading ───────────────────────────────────────────
    const finishLoading = () => {
      if (isLoaded) return;
      isLoaded = true;

      const elapsed = Date.now() - startLoading;
      const minimumDisplayTime = 2000;
      const remainingTime = Math.max(0, minimumDisplayTime - elapsed);

      setTimeout(() => {
        // Smoothly complete the counter to 100
        gsap.to({ val: realProgress }, {
          val: 100,
          duration: 0.6,
          ease: 'power3.out',
          onUpdate: function () {
            const currentVal = Math.floor(this.targets()[0].val);
            setPercent(currentVal);
            const offset = circumference - (currentVal / 100) * circumference;
            circle.style.strokeDashoffset = String(offset);
          },
          onComplete: () => {
            // ── EXIT ANIMATION ─────────────────────────────────
            // Smooth sequence: content fades out first, THEN overlay slides away.
            // The overlay slide waits for content to fully disappear — no jitter.
            const exitTl = gsap.timeline({
              onComplete: () => {
                document.body.style.overflow = '';
                document.body.style.touchAction = '';
                onComplete();
              },
            });

            // Step 1: Fade out all content elements simultaneously
            exitTl.to(character, {
              yPercent: 50,
              scale: 0.92,
              opacity: 0,
              duration: 0.5,
              ease: 'power3.in',
            }, 0);

            exitTl.to([percentEl, loader], {
              opacity: 0,
              y: 15,
              duration: 0.35,
              ease: 'power2.in',
              stagger: 0.03,
            }, 0);

            // Step 2: Overlay slides away AFTER content is gone (0.45s delay)
            exitTl.to(overlay, {
              yPercent: -100,
              duration: 0.9,
              ease: 'expo.inOut',
            }, 0.45);
          },
        });
      }, remainingTime);
    };

    // Trigger finish when window is fully loaded
    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      window.addEventListener('load', finishLoading);
    }

    // Phase 1: Elegant fade-in for the character
    gsap.fromTo(
      character,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.0, ease: 'power4.out', delay: 0.3 }
    );

    // Subtle fade for the loader
    gsap.fromTo(
      loader,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.5 }
    );

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      video.removeEventListener('ended', handleVideoEnd);
      window.removeEventListener('load', finishLoading);
      window.removeEventListener('load', onWindowLoad);
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#000000] overflow-hidden"
    >
      {/* Top-left decorative 3D loop */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-16 h-16 pointer-events-none opacity-30 z-10">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          disablePictureInPicture
          controls={false}
          className="w-full h-full object-contain contain-paint-transform"
        >
          <source src="/videos/3d-hologram.webm" type="video/webm" />
          <source src="/videos/3d-hologram.mp4" type="video/mp4" />
        </video>
      </div>
      {/* Subtle Grain Texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Center Container - Stacked for perfect centering */}
      <div className="relative flex items-center justify-center z-10 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px]">

        {/* Video Layer */}
        <video
          ref={videoRef}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain mix-blend-lighten"
        >
          <source src="/slash.webm" type="video/webm" />
          <source src="/slash.mp4" type="video/mp4" />
        </video>

        {/* Japanese Character - Dead Center over Video */}
        <div className="relative z-10 overflow-hidden flex items-center justify-center" style={{ transform: 'translate3d(0,0,0)' }}>
          <div
            ref={characterRef}
            className="relative z-10 select-none pointer-events-none"
            style={{
              fontSize: 'clamp(5rem, 14vw, 8rem)',
              fontFamily: '"Noto Serif JP", serif',
              color: '#E8E8EF',
              fontWeight: 900,
              lineHeight: 1,
              willChange: 'transform, opacity',
              opacity: 0, // Initial state for GSAP
              textShadow: '0 0 30px rgba(46, 46, 56, 0.8)' // Subtle depth to lift it off the video
            }}
          >
            創
          </div>
        </div>
      </div>

      {/* Percentage Loading Text - Clean & Structured */}
      <div
        ref={percentRef}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex flex-col items-end z-10 gap-2"
      >
        {/* Label */}
        <span
          className="tracking-[0.4em] text-[0.6rem] font-medium uppercase"
          style={{ color: '#8A8A9A' }}
        >
          Loading
        </span>

        {/* Counter */}
        <div className="flex items-baseline">
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(4rem, 8vw, 6.5rem)',
              lineHeight: 0.85,
              color: '#E8E8EF',
              letterSpacing: '-0.05em',
              fontVariantNumeric: 'tabular-nums',
              fontFeatureSettings: '"tnum"',
            }}
          >
            {String(percent).padStart(3, '0')}
          </span>
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: '1.5rem',
              color: '#8A8A9A',
              marginLeft: '0.1em',
              alignSelf: 'flex-start',
              marginTop: '0.5em'
            }}
          >
            %
          </span>
        </div>
      </div>

      {/* Circular Progress Loader - Bottom Left Corner */}
      <div
        ref={loaderRef}
        className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-8 h-8 flex items-center justify-center z-10"
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
          {/* Track */}
          <circle
            cx="25" cy="25" r="20"
            fill="none"
            stroke="#3D3D4A"
            strokeWidth="3"
          />
          {/* Progress */}
          <circle
            ref={loaderCircleRef}
            cx="25" cy="25" r="20"
            fill="none"
            stroke="#E8E8EF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
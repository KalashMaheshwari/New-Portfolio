import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { LiquidGlass } from './ui/LiquidGlass';

export default function Landing() {
  const [videoReady, setVideoReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const line3 = line3Ref.current;

    if (!line1 || !line2 || !line3) return;

    // Text & Sparkle Reveal
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to(line1, { y: '0%', duration: 1.4, delay: 0.5 })
      .to(line2, { y: '0%', duration: 1.4 }, '-=1.15')
      .to(line3, { y: '0%', duration: 1.4 }, '-=1.15');
  }, []);

  const handleMouseEnter = () => {
    document.body.classList.add('hide-nucleus');
  };

  const handleMouseLeave = () => {
    document.body.classList.remove('hide-nucleus');
  };

  const handleClick = () => {
    const el = document.getElementById('cta-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="landing"
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center select-none overflow-hidden text-white"
    >
      {/* Background Backdrop */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Fallback Image */}
        <picture className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${videoReady ? 'opacity-0' : 'opacity-100'}`}>
          <source type="image/avif" media="(min-width: 769px)" srcSet="/images/landing-desktop.avif" />
          <source type="image/webp" media="(min-width: 769px)" srcSet="/images/landing-desktop.webp" />
          <source type="image/avif" media="(max-width: 768px)" srcSet="/images/landing-mobile.avif" />
          <source type="image/webp" media="(max-width: 768px)" srcSet="/images/landing-mobile.webp" />
          <img
            src="/images/landing.webp"
            alt="Landing Fallback"
            fetchPriority="high"
            decoding="sync"
            className="w-full h-full object-cover"
          />
        </picture>
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          onPlay={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <source src="/videos/landing.webm" type="video/webm" />
          <source src="/videos/landing.mp4" type="video/mp4" />
        </video>

      </div>

      {/* ─── TECHNICAL DECORATIONS ─── */}
      {/* Dirtyline Style Logo */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[50] flex flex-col items-center pointer-events-auto">
        <picture>
          <source type="image/avif" srcSet="/images/kalash2.avif" />
          <img
            src="/images/kalash2.webp"
            alt="KALASH"
            className="h-8 w-auto object-contain transition-transform duration-500 hover:scale-105"
            style={{ filter: 'brightness(1.2)' }}
          />
        </picture>
      </div>

      {/* Bottom Corner Labels */}
      <div className="absolute bottom-10 left-10 z-[40] flex items-center gap-6 opacity-70 group cursor-crosshair text-white max-md:hidden">
        <div className="w-16 h-px bg-white origin-left transition-transform group-hover:scale-x-150" />
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase">Engineering</span>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="w-full max-w-[92%] mx-auto px-6 z-10 relative pointer-events-none">
        <h1
          className="relative z-20 flex flex-col w-full"
          aria-label="Kalash Maheshwari — I think, craft, and design elite digital experiences"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontWeight: 400,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            fontSize: 'clamp(3.5rem, 10vw, 9rem)',
            lineHeight: 0.9,
          }}
        >
          <div className="overflow-hidden text-left w-full">
            <span ref={line1Ref} className="block" style={{ transform: 'translateY(100%)', willChange: 'transform' }}>
              i think
            </span>
          </div>
          <div className="overflow-hidden text-left w-full">
            <span ref={line2Ref} className="block" style={{ transform: 'translateY(100%)', willChange: 'transform' }}>
              <span style={{ color: 'transparent', WebkitTextStroke: '2px #FF6B00' }}>craft</span>
              <br />
              and
            </span>
          </div>
          <div className="overflow-hidden text-left w-full">
            <span ref={line3Ref} className="block" style={{ transform: 'translateY(100%)', willChange: 'transform' }}>
              design
            </span>
          </div>
        </h1>
      </div>

      {/* CTA Section */}
      <div className="absolute bottom-16 left-0 w-full flex justify-center z-20 pointer-events-auto max-md:bottom-24 translate-x-6">
        <div className="relative group" style={{ width: '240px', height: '64px' }}>

          {/* 1. Liquid Glass CTA */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <LiquidGlass
              className="w-[230px] h-[64px] rounded-full !px-5 !py-0"
            >
              <div className="flex items-center justify-center gap-5 w-full h-full">
                {/* Text Block */}
                <div className="flex flex-col items-start justify-center text-left leading-none select-none">
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/50 transition-colors duration-500 group-hover:text-white/70">
                    proceed
                  </span>
                  <span
                    className="text-[13px] font-bold tracking-[0.2em] uppercase text-white mt-1.5 transition-all duration-500 group-hover:text-[#FF6B00] group-hover:tracking-[0.23em]"
                    style={{ fontFamily: "'Neue Montreal', 'Outfit', sans-serif" }}
                  >
                    explore
                  </span>
                </div>
                
                {/* Arrow Circle */}
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white overflow-hidden transition-all duration-500 group-hover:scale-110 shadow-[0_2px_8px_rgba(255,255,255,0.25)]">
                  {/* Liquid Orange Fill */}
                  <div className="absolute inset-0 bg-[#FF6B00] translate-y-full rounded-t-[50%] transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 z-10" />
                  
                  {/* Arrow SVG */}
                  <svg
                    className="relative z-20 w-3.5 h-3.5 text-black transition-all duration-500 ease-out group-hover:rotate-45"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
                  </svg>
                </div>
              </div>
            </LiquidGlass>
          </div>

          {/* 2. GHOST CLICK AREA */}
          <div
            className="absolute inset-0 pointer-events-auto cursor-pointer"
            role="button"
            aria-label="Explore my work"
            style={{ borderRadius: '999px', zIndex: 50 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          />
        </div>
      </div>

    </section>
  );
}
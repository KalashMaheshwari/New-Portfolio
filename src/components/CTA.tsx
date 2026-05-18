import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

/** Splits a string into individually-animated characters.
 *  Each char sits inside an overflow-hidden wrapper so it can
 *  float in from below its own baseline. Spaces get a fixed width. */
function splitChars(text: string) {
  return text.split('').map((char, i) => (
    <span
      key={i}
      style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}
    >
      <span
        className="cta-char"
        style={{
          display: 'inline-block',
          willChange: 'transform',
          // Spaces need explicit width otherwise inline-block collapses them
          ...(char === ' ' ? { width: '0.3em' } : {}),
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    </span>
  ));
}

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const title1Ref = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const buttonWrapRef = useRef<HTMLAnchorElement>(null);

  // Magnetic button state
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [isHoveringBtn, setIsHoveringBtn] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (buttonWrapRef.current) {
      const { clientX, clientY } = e;
      const { width, height, left, top } = buttonWrapRef.current.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * 0.4;
      const y = (clientY - (top + height / 2)) * 0.4;
      setBtnPos({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setBtnPos({ x: 0, y: 0 });
    setIsHoveringBtn(false);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Character-by-character float-in: each char rises from below its line
      const line1Chars = section.querySelectorAll('.cta-line1 .cta-char');
      const line2Chars = section.querySelectorAll('.cta-line2 .cta-char');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
        }
      });

      // Line 1: characters float in left-to-right
      tl.fromTo(
        line1Chars,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.0, stagger: 0.03, ease: 'power4.out' }
      );

      // Line 2: characters float in left-to-right (starts during line 1)
      const line2Start = 0.25;
      tl.fromTo(
        line2Chars,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.0, stagger: 0.03, ease: 'power4.out' },
        line2Start
      );

      // Letter spacing cinematic pull
      tl.fromTo(
        h2Ref.current,
        { letterSpacing: '0.4em' },
        { letterSpacing: '0.2em', duration: 2, ease: 'power3.out' },
        0
      );

      // Connect button rises TOGETHER with line 2
      tl.fromTo(
        buttonWrapRef.current,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.4, ease: 'power4.out' },
        line2Start
      );

      // Section parallax
      gsap.to('.cta-bg-video', {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative w-full flex flex-col items-center justify-center overflow-hidden py-40 px-4 max-md:!py-20"
      style={{
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        contain: 'paint'
      }}
    >
      {/* Top edge blend */}
      <div
        className="absolute top-0 left-0 right-0 h-[20rem] pointer-events-none z-20"
        style={{ background: 'linear-gradient(to bottom, #1a1a1a, rgba(26,26,26,0))' }}
      />
      {/* Bottom edge blend */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[20rem] pointer-events-none z-20"
        style={{ background: 'linear-gradient(to top, #0a0a0a, rgba(10,10,10,0))' }}
      />
      {/* 
        ========================================================
        FULL-BLEED CINEMATIC BACKGROUND
        ========================================================
        Provides life and movement without cluttered decorations.
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <video
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting) el.play().catch(() => { });
                  else el.pause();
                },
                { threshold: 0 }
              );
              observer.observe(el);
            }
          }}
          loop
          muted
          playsInline
          preload="none"
          className="cta-bg-video absolute top-[-10%] left-0 w-full h-[120%] object-cover opacity-60"
          style={{ filter: 'brightness(0.7) contrast(1.6) saturate(1.5)' }}
        >
          <source src="/videos/CTA-720.webm" type="video/webm" />
          <source src="/videos/CTA-720.mp4" type="video/mp4" />
        </video>
        {/* Soft vignette to blend edges */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, #000 100%)',
          }}
        />


      </div>

      {/* Extreme Noise Texture Overlay for Editorial Grain */}
      <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: 'url(/noise.webp)', backgroundSize: '150px' }} />


      {/* 
        ========================================================
        FOREGROUND CONTENT
        ========================================================
      */}
      <div className="relative z-10 flex flex-col items-center justify-between text-center w-full max-w-7xl h-full mt-10">

        {/* Massive Centered Typography */}
        <h2
          ref={h2Ref}
          className="flex flex-col items-center justify-center w-full"
          style={{ fontFamily: "'Anton', sans-serif", lineHeight: 1.0, letterSpacing: '0.02em', fontWeight: 400, textTransform: 'uppercase' }}
        >
          <div className="overflow-hidden pb-2 px-6">
            <div ref={title1Ref} className="cta-line1" style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', color: '#fff', transformOrigin: 'top center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {splitChars('Have a vision?')}
            </div>
          </div>
          <div className="overflow-hidden pb-6 px-6">
            <div ref={title2Ref} className="cta-line2" style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', color: 'rgba(255,255,255,0.4)', transformOrigin: 'top center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {splitChars("Let's build it.")}
            </div>
          </div>
        </h2>

        {/* 
          Ultra-Minimal, True Premium Button 
          No cheap glows, no complex videos inside it. Just pure geometry and perfect interactions.
        */}
        <div className="mt-32 sm:mt-44 w-full flex justify-center relative translate-y-16">
          <a
            href="mailto:maheshwarikalash@outlook.com"
            ref={buttonWrapRef}
            className="group relative flex items-center justify-center p-16 cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHoveringBtn(true)}
            onMouseLeave={handleMouseLeave}
            onFocus={() => setIsHoveringBtn(true)}
            onBlur={handleMouseLeave}
            style={{ touchAction: 'none' }}
            aria-label="Connect and collaborate"
          >
            {/* 
              LIQUID GLASS BUTTON FOUNDATION
              Uses deep backdrop blur and layered animated blobs for a premium "living" feel.
            */}
            <motion.div
              animate={{
                x: btnPos.x,
                y: btnPos.y,
                scale: isHoveringBtn ? 1.05 : 1,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.1 }}
              className="relative overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer border border-white/10"
              style={{
                width: 'clamp(220px, 25vw, 320px)',
                height: 'clamp(70px, 8vw, 90px)',
                background: isHoveringBtn ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                backdropFilter: isHoveringBtn ? 'blur(40px) saturate(180%)' : 'blur(24px) saturate(120%)',
                WebkitBackdropFilter: isHoveringBtn ? 'blur(40px) saturate(180%)' : 'blur(24px) saturate(120%)',
                transition: 'background 0.5s ease, backdrop-filter 0.5s ease, border 0.5s ease',
                isolation: 'isolate',
              }}
            >
              {/* Inner Glow/Rim Light */}
              <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-20" style={{ boxShadow: 'inset 0 0 25px rgba(255,255,255,0.05), inset 0 0 2px rgba(255,255,255,0.2)' }} />

              {/* Liquid Blobs - Animated for organic movement */}
              <motion.div
                className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] rounded-full opacity-30 blur-[40px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
                animate={{
                  x: [0, 40, -20, 0],
                  y: [0, 20, 30, 0],
                  scale: [1, 1.2, 0.9, 1],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-[-40%] right-[-10%] w-[80%] h-[80%] rounded-full opacity-20 blur-[50px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #FF6B00 0%, transparent 70%)' }}
                animate={{
                  x: [0, -30, 20, 0],
                  y: [0, -40, -10, 0],
                  scale: [1, 1.3, 1.1, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div
                className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[30px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Bold White Text Overlay — premium typography lockup */}
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <div className="flex items-center">
                  <span
                    className="font-bold text-xl md:text-2xl tracking-[0.15em] uppercase"
                    style={{
                      fontFamily: "'Vogjer', sans-serif",
                      color: isHoveringBtn ? '#ffffff' : 'rgba(255,255,255,0.85)',
                      textShadow: isHoveringBtn
                        ? '0 0 20px rgba(255,255,255,0.3), 0 4px 15px rgba(0,0,0,0.5)'
                        : '0 4px 15px rgba(0,0,0,0.4)',
                      transition: 'color 0.4s ease, text-shadow 0.4s ease, letter-spacing 0.4s ease',
                      letterSpacing: isHoveringBtn ? '0.2em' : '0.15em'
                    }}
                  >
                    Connect
                  </span>
                  
                  {/* Premium Diagonal Arrow */}
                  <motion.svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-4"
                    animate={{ 
                      x: isHoveringBtn ? 4 : 0,
                      y: isHoveringBtn ? -4 : 0,
                      opacity: isHoveringBtn ? 1 : 0.7
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <path
                      d="M7 17L17 7M17 7H8M17 7V16"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: isHoveringBtn ? '#FF6B00' : 'rgba(255,255,255,0.85)' }}
                    />
                  </motion.svg>
                </div>
              </div>
            </motion.div>
          </a>
        </div>

      </div>
    </section>
  );
}
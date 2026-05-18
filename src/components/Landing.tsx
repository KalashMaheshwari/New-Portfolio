import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import FaultyTerminal from './ui/FaultyTerminal';
import { LiquidGlass } from './ui/LiquidGlass';

export default function Landing() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const magneticRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const isInsideRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const line3 = line3Ref.current;

    if (!section || !line1 || !line2 || !line3) return;

    // Text & Sparkle Reveal
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to(line1, { y: '0%', duration: 1.4, delay: 0.5 })
      .to(line2, { y: '0%', duration: 1.4 }, '-=1.15')
      .to(line3, { y: '0%', duration: 1.4 }, '-=1.15');

    // ─── Stable Magnetic Logic ───
    const handleMagneticMove = (e: MouseEvent) => {
      const btn = magneticRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        if (!isInsideRef.current) {
          isInsideRef.current = true;
          // Enter: Orange fill, White arrow, and Shadow
          if (fillRef.current) gsap.to(fillRef.current, { yPercent: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
          if (arrowRef.current) gsap.to(arrowRef.current, { color: '#ffffff', duration: 0.4, overwrite: 'auto' });
          if (circleRef.current) gsap.to(circleRef.current, { boxShadow: '0 0 25px rgba(255,107,0,0.5)', duration: 0.4 });
        }

        gsap.to(btn, {
          x: dx * 0.25,
          y: dy * 0.25,
          rotateX: -dy * 0.12,
          rotateY: dx * 0.12,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        if (isInsideRef.current) {
          isInsideRef.current = false;
          // Leave: Reset all
          if (fillRef.current) gsap.to(fillRef.current, { yPercent: 100, duration: 0.6, ease: 'power2.in', overwrite: 'auto' });
          if (arrowRef.current) gsap.to(arrowRef.current, { color: '#000000', duration: 0.4, overwrite: 'auto' });
          if (circleRef.current) gsap.to(circleRef.current, { boxShadow: '0 0 0px rgba(255,107,0,0)', duration: 0.4 });
        }

        gsap.to(btn, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)',
          overwrite: 'auto'
        });
      }
    };

    const handleMagneticDown = () => {
      const btn = magneticRef.current;
      if (!btn) return;
      gsap.to(btn, {
        scale: 0.93,
        duration: 0.1,
        ease: 'power2.in',
        overwrite: 'auto'
      });
    };

    const handleMagneticUp = () => {
      const btn = magneticRef.current;
      if (!btn) return;
      gsap.to(btn, {
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto'
      });
    };

    window.addEventListener('mousemove', handleMagneticMove);

    const btnElement = magneticRef.current;
    if (btnElement) {
      btnElement.addEventListener('mousedown', handleMagneticDown);
      btnElement.addEventListener('mouseup', handleMagneticUp);
      btnElement.addEventListener('mouseleave', handleMagneticUp);
    }

    // Set initial state for liquid fill
    if (fillRef.current) gsap.set(fillRef.current, { yPercent: 100 });

    return () => {
      window.removeEventListener('mousemove', handleMagneticMove);

      if (btnElement) {
        btnElement.removeEventListener('mousedown', handleMagneticDown);
        btnElement.removeEventListener('mouseup', handleMagneticUp);
        btnElement.removeEventListener('mouseleave', handleMagneticUp);
      }
    };
  }, []);

  return (
    <section
      id="landing"
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center select-none overflow-hidden text-white"
    >
      {/* Background Backdrop */}
      <div className="absolute inset-0 z-0">
        <FaultyTerminal />
      </div>

      {/* ─── TECHNICAL DECORATIONS ─── */}
      {/* Dirtyline Style Logo */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[50] flex flex-col items-center">
        <img
          src="/images/kalash2.webp"
          alt="KALASH"
          className="h-8 w-auto object-contain transition-transform duration-500 hover:scale-105"
          style={{ filter: 'brightness(1.2)' }}
        />
      </div>

      {/* Bottom Corner Labels */}
      <div className="absolute bottom-10 left-10 z-[40] flex items-center gap-6 opacity-70 group cursor-crosshair text-white max-md:hidden">
        <div className="w-16 h-px bg-white origin-left transition-transform group-hover:scale-x-150" />
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase">Engineering</span>
      </div>
      <div className="absolute bottom-10 right-10 z-[40] flex items-center gap-6 opacity-70 group cursor-crosshair text-white max-md:hidden">
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase">Visual Art</span>
        <div className="w-16 h-px bg-white origin-right transition-transform group-hover:scale-x-150" />
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="text-center px-6 z-10 relative">
        <h1
          className="relative z-20"
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
          <div className="overflow-hidden">
            <span ref={line1Ref} className="block" style={{ transform: 'translateY(100%)', willChange: 'transform' }}>
              i think
            </span>
          </div>
          <div className="overflow-hidden">
            <span ref={line2Ref} className="block" style={{ transform: 'translateY(100%)', willChange: 'transform' }}>
              <span style={{ color: 'transparent', WebkitTextStroke: '2px #FF6B00' }}>craft</span> and
            </span>
          </div>
          <div className="overflow-hidden">
            <span ref={line3Ref} className="block" style={{ transform: 'translateY(100%)', willChange: 'transform' }}>
              design
            </span>
          </div>
        </h1>
      </div>

      {/* CTA Section */}
      <div className="absolute bottom-16 left-0 w-full flex justify-center z-20 pointer-events-none max-md:bottom-8">
        <div ref={magneticRef} className="relative group" style={{ width: '240px', height: '64px' }}>

          {/* 1. Liquid Glass CTA */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <LiquidGlass
              className="w-[210px] h-[64px] rounded-full"
            >
              <div className="flex items-center justify-center gap-4 px-2 w-full h-full">
                <div className="flex flex-col items-start">
                  <span className="font-mono text-[6px] tracking-[0.5em] uppercase opacity-40">Proceed</span>
                  <span className="font-display text-lg tracking-[0.1em] uppercase">Explore</span>
                </div>
                <div
                  ref={circleRef}
                  className="relative w-8 h-8 flex items-center justify-center rounded-full overflow-hidden bg-white transition-shadow duration-500"
                >
                  {/* Liquid Fill Container */}
                  <div
                    ref={fillRef}
                    className="absolute inset-0 bg-[#FF6B00]"
                    style={{ willChange: 'transform' }}
                  />
                  <svg
                    ref={arrowRef}
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className="relative z-10 text-black transition-colors duration-500"
                  >
                    <path d="M5 12h14m-7-7l7 7-7 7" />
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
            onMouseEnter={() => {
              document.body.classList.add('hide-nucleus');
            }}
            onMouseLeave={() => {
              document.body.classList.remove('hide-nucleus');
            }}
            onClick={() => {
              const el = document.getElementById('manifesto');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </div>
    </section>
  );
}
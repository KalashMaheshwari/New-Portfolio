import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero Video Reveal — Ultra-Premium Cinematic Version
 *
 * Scroll flow:
 *   Landing (fixed) → user scrolls → video rises from below with 3D tilt →
 *   landing blurs & dims → video expands to fullscreen with letterbox bars →
 *   white bloom flash at fullscreen → Ken Burns settles → scroll to Manifesto
 *
 * Cinematic touches:
 *   • Shadow parallax (moves at 70% of video speed for depth illusion)
 *   • Letterbox bars slide in during window phase, dissolve at fullscreen
 *   • Subtle white bloom flash when video locks fullscreen
 *   • Inner scale creates Ken Burns drift effect
 *   • Vignette intensifies then fades during expansion
 */
export default function HeroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const barTopRef = useRef<HTMLDivElement>(null);
  const barBotRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    const shadow = shadowRef.current;
    const barTop = barTopRef.current;
    const barBot = barBotRef.current;
    const bloom = bloomRef.current;
    const vignette = vignetteRef.current;
    if (!section || !wrapper || !inner || !shadow || !barTop || !barBot || !bloom || !vignette) return;

    const landing = document.getElementById('landing');

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      /* ── Initial states ─────────────────────────────────────────── */
      gsap.set(wrapper, {
        clipPath: isMobile ? 'inset(40vh 0vw round 0px)' : 'inset(24vh 28vw round 18px)',
        yPercent: 100,
        scale: 0.82,
        rotateX: 10,
        rotateY: -2,
        opacity: 0,
        transformPerspective: 1400,
        transformOrigin: 'center bottom',
        force3D: true,
      });

      gsap.set(inner, { scale: 1.18, force3D: true });
      gsap.set(shadow, { opacity: 0, yPercent: 100 });
      gsap.set(bloom, { opacity: 0 });

      // Letterbox bars — start visible (cinematic framing)
      gsap.set(barTop, { scaleX: 1 });
      gsap.set(barBot, { scaleX: 1 });

      // Vignette — starts soft
      gsap.set(vignette, { opacity: 0.3 });

      /* ── Stage 1: Entrance (From bottom of screen to top of screen) ── */
      const tlEntrance = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      });

      // Video rises from below, un-tilts, materializes
      tlEntrance.to(wrapper, {
        yPercent: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
        ease: 'none',
      }, 0);

      // Shadow rises at 70% speed → parallax depth illusion
      tlEntrance.to(shadow, {
        opacity: 0.8,
        yPercent: 0,
        ease: 'none',
      }, 0);

      // Landing blurs & dims behind
      if (landing) {
        tlEntrance.fromTo(landing,
          { filter: 'blur(0px) brightness(1)', scale: 1 },
          {
            filter: 'blur(30px) brightness(0.3)',
            scale: 1.08,
            ease: 'none',
          },
          0,
        );
      }

      // Letterbox bars appear (cinematic framing of the window)
      tlEntrance.fromTo(barTop,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none' },
        0,
      );
      tlEntrance.fromTo(barBot,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none' },
        0,
      );

      // Vignette intensifies during floating window
      tlEntrance.to(vignette, {
        opacity: 0.7,
        ease: 'none',
      }, 0);


      /* ── Stage 2: Pinning & Expansion (At the top of screen) ── */
      const tlExpansion = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: true,
        },
      });

      // Clip-path opens from window to fullscreen
      tlExpansion.to(wrapper, {
        clipPath: 'inset(0vh 0vw round 0px)',
        duration: 0.6,
        ease: 'power2.inOut',
      }, 0);

      // Ken Burns zoom-pull settles
      tlExpansion.to(inner, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        force3D: true,
      }, 0);

      // Shadow grows larger and dissolves
      tlExpansion.to(shadow, {
        opacity: 0,
        scale: 1.5,
        duration: 0.40,
        ease: 'power2.in',
      }, 0.15);

      // Letterbox bars slide away as video goes fullscreen
      tlExpansion.to(barTop, {
        scaleX: 0,
        duration: 0.30,
        ease: 'power3.in',
      }, 0.3);
      tlExpansion.to(barBot, {
        scaleX: 0,
        duration: 0.30,
        ease: 'power3.in',
      }, 0.3);

      // Vignette fades as it goes fullscreen
      tlExpansion.to(vignette, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
      }, 0.3);

      // White bloom flash — subtle "camera lock" moment
      tlExpansion.to(bloom, {
        opacity: 0.15,
        duration: 0.1,
        ease: 'power4.in',
      }, 0.5);
      tlExpansion.to(bloom, {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.out',
      }, 0.6);

    }, section);

    return () => {
      ctx.revert();
      if (landing) {
        landing.style.filter = '';
        landing.style.transform = '';
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen flex items-center justify-center"
      style={{ background: 'transparent', position: 'relative' }}
    >
      {/* ── Floating Shadow ── */}
      <div
        ref={shadowRef}
        className="absolute pointer-events-none"
        style={{
          width: '40vw',
          height: '48vh',
          borderRadius: '24px',
          background: 'transparent',
          boxShadow:
            '0 60px 160px rgba(0,0,0,0.8), 0 30px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)',
          opacity: 0,
          zIndex: 1,
          willChange: 'transform, opacity',
        }}
      />

      {/* ── Video Wrapper ── */}
      <div
        ref={wrapperRef}
        className="overflow-hidden relative"
        style={{
          width: '100vw',
          height: '100vh',
          willChange: 'clip-path, transform, opacity',
          transform: 'translateZ(0)',
          zIndex: 2,
        }}
      >
        {/* Ken Burns inner container */}
        <div
          ref={innerRef}
          className="w-full h-full"
          style={{ willChange: 'transform' }}
        >
          {/* Desktop Video */}
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
            className="w-full h-full object-cover max-md:hidden"
          >
            <source src="/videos/eye.webm" type="video/webm" />
            <source src="/videos/eye.mp4" type="video/mp4" />
          </video>

          {/* Mobile Video */}
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
            className="w-full h-full object-cover hidden max-md:block"
          >
            <source src="/videos/mobile%20landing.webm" type="video/webm" />
            <source src="/videos/mobile%20landing.mp4" type="video/mp4" />
          </video>
        </div>

        {/* ── Cinematic Letterbox Bars ── */}
        <div
          ref={barTopRef}
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '8%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.95), transparent)',
            transformOrigin: 'left center',
            zIndex: 5,
          }}
        />
        <div
          ref={barBotRef}
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '8%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
            transformOrigin: 'right center',
            zIndex: 5,
          }}
        />

        {/* ── Dynamic Vignette ── */}
        <div
          ref={vignetteRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.6)',
            zIndex: 4,
          }}
        />

        {/* Cinematic gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.45) 100%)',
            zIndex: 3,
          }}
        />

        {/* ── White Bloom Flash ── */}
        <div
          ref={bloomRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9), rgba(255,255,255,0.3) 50%, transparent 80%)',
            opacity: 0,
            zIndex: 6,
          }}
        />
      </div>
    </section>
  );
}

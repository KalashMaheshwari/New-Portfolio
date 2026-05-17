import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import Landing from './components/Landing';
import HeroVideo from './components/HeroVideo';
import Manifesto from './components/Manifesto';
import TechStack from './components/TechStack';
import Playground from './components/Playground';
import Skills from './components/Skills';
import SkillsTape from './components/SkillsTape';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import CursorNucleus from './components/ui/CursorNucleus';
import Journey from './components/Journey';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const { scrollYProgress } = useScroll();


  // ── Lenis smooth scroll (only after preloader) ────────────────
  useEffect(() => {
    if (!preloaderDone) return;

    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // ── Pause when tab is hidden ──────────────────────────────────
    const handleVisibility = () => {
      if (document.hidden) {
        lenis.stop();
        gsap.ticker.sleep();
      } else {
        lenis.start();
        gsap.ticker.wake();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [preloaderDone]);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'white',
          transformOrigin: '0%',
          scaleX: scrollYProgress,
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: preloaderDone ? 0.8 : 0,
        }}
      />

      {/* Preloader — blocks everything */}
      {!preloaderDone && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Landing: fixed behind everything, never scrolls.
          MUST be outside <main> because main has contain:paint
          which turns position:fixed into position:absolute. */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 1,
          opacity: preloaderDone ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: preloaderDone ? 'auto' : 'none',
        }}
      >
        <Landing />
      </div>

      {/* Main site content — renders ABOVE the fixed landing (z-index 2 > 1).
          NO contain:paint here — it breaks ScrollTrigger pinning (converts
          position:fixed to position:absolute). Individual sections handle
          their own containment. */}
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100000] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md"
      >
        Skip to content
      </a>

      {/* SEO-Only Semantic Content (Visually Hidden) */}
      <div className="sr-only" aria-hidden="true">
        <h1>Kalash Maheshwari — Creative Developer & Full Stack Engineer</h1>
        <p>Expert in React, TypeScript, GSAP, and high-performance web development. Based in New Delhi, India.</p>
        <section>
          <h2>Core Expertise</h2>
          <ul>
            <li>Full Stack Engineering</li>
            <li>Creative Development</li>
            <li>3D Web Graphics (Three.js/WebGL)</li>
            <li>Motion Design & GSAP Animations</li>
            <li>Performance Optimization</li>
          </ul>
        </section>
        <section>
          <h2>Featured Projects</h2>
          <article>
            <h3>BM Advertisers</h3>
            <p>Elite Digital Experience & Interactive Publishing Engine. Built with React, TypeScript, and Framer Motion.</p>
          </article>
          <article>
            <h3>Kleem Group</h3>
            <p>Premium Digital Ecosystem for enterprise verticals. Features glassmorphism and kinetic gallery engine.</p>
          </article>
          <article>
            <h3>The Birthday Universe</h3>
            <p>High-fidelity interactive web experience with physics-based UI.</p>
          </article>
          <article>
            <h3>Kinetic</h3>
            <p>Luxury athletic facility interface with GPU-layered parallax triggers.</p>
          </article>
          <article>
            <h3>Localis</h3>
            <p>Cinematic hospitality ecosystem with adaptive screen throttling.</p>
          </article>
        </section>
      </div>

      <main
        id="main-content"
        className="overflow-x-hidden"
        style={{
          position: 'relative',
          zIndex: 2,
          color: 'var(--text)',
          fontFamily: 'var(--font-body)',
          opacity: preloaderDone ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        {/* Transparent spacer — lets the fixed Landing show through */}
        <div style={{ height: '100vh', background: 'transparent' }} />

        {/* HeroVideo: pinned overlay with scroll-driven animation */}
        <section className="relative" style={{ zIndex: 10 }}>
          <HeroVideo />
        </section>

        {/* Everything else paints over Landing & video */}
        <div className="relative z-[40]" style={{ background: 'var(--bg)' }}>
          <section id="manifesto-section">
            <Manifesto />
          </section>

          <section id="tech-stack-section">
            <TechStack />
          </section>
          
          <section id="projects-section">
            <Playground />
          </section>

          <section id="skills-section">
            <Skills />
            <SkillsTape />
          </section>

          <section id="journey-section">
            <Journey />
          </section>

          <section id="cta-section">
            <CTA />
          </section>

          <Footer />
        </div>
      </main>

      <Navigation />

      <CursorNucleus />
    </>
  );
}
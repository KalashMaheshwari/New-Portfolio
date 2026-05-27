import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import { nucleusController } from './ui/CursorNucleus';

gsap.registerPlugin(ScrollTrigger);

const STACK_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614946003881-9c0fb2e33f63?w=400&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=400&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=500&fit=crop&q=80',
];

interface StackedImage {
  id: number;
  url: string;
  rotation: number;
  x: number;
  y: number;
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [stackedImages, setStackedImages] = useState<StackedImage[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const cursorRef = useRef({ x: 0, y: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idCounter = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('.manifesto-line');
      gsap.fromTo(
        lines,
        { y: '50%', opacity: 0, filter: 'blur(8px)' },
        {
          y: '0%',
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
          },
        }
      );

      gsap.to('.rotating-star', {
        rotateZ: 360,
        duration: 20,
        repeat: -1,
        ease: 'linear',
      });

      gsap.to('.rotating-badge', {
        rotateZ: 360,
        duration: 10,
        repeat: -1,
        ease: 'linear',
        transformOrigin: '50% 50%',
      });

      gsap.to(containerRef.current, {
        filter: 'blur(25px)',
        opacity: 0,
        y: -150,
        scale: 0.95,
        scrollTrigger: {
          trigger: section,
          start: 'center top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const pushImage = useCallback((_mouseX: number, _mouseY: number) => {
    const sequenceIndex = idCounter.current % STACK_IMAGES.length;
    const url = STACK_IMAGES[sequenceIndex];
    idCounter.current++;

    const rotation = (Math.random() - 0.5) * 10;
    // Minimal random jitter to keep them slightly organic but still 'on the cursor'
    const offsetX = (Math.random() - 0.5) * 15;
    const offsetY = (Math.random() - 0.5) * 15;

    const newImage: StackedImage = {
      id: Date.now() + Math.random(),
      url,
      rotation,
      x: offsetX,
      y: offsetY,
    };

    setStackedImages((prev) => [...prev, newImage]);
  }, []);

  const handleWordEnter = useCallback(
    (_word: string) => {
      return (e: React.MouseEvent) => {
        cursorRef.current = { x: e.clientX, y: e.clientY };
        setCursorPos({ x: e.clientX, y: e.clientY });

        if (intervalRef.current) clearInterval(intervalRef.current);

        // Shrink the nucleus ball away
        nucleusController.shrink();

        // Push the first image immediately
        pushImage(e.clientX, e.clientY);

        // Keep pushing as the cursor moves - faster interval for smoother stacking
        intervalRef.current = setInterval(() => {
          pushImage(cursorRef.current.x, cursorRef.current.y);
        }, 250);
      };
    },
    [pushImage]
  );

  const handleWordLeave = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Staggered removal — pop from the end every 50ms
    const clearNext = () => {
      setStackedImages((prev) => {
        if (prev.length === 0) {
          nucleusController.restore();
          return [];
        }
        const next = prev.slice(0, -1);
        if (next.length > 0) {
          setTimeout(clearNext, 50);
        } else {
          // Last image removed
          nucleusController.restore();
        }
        return next;
      });
    };
    clearNext();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    cursorRef.current = { x: e.clientX, y: e.clientY };
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const headingFont = '"Bebas Neue", "Impact", sans-serif';
  const italicSerifFont =
    '"Playfair Display", "Cormorant Garamond", "Times New Roman", ui-serif, serif';

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full flex items-center justify-center py-32 md:py-48 overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ background: 'var(--bg)', minHeight: '130vh' }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 70% 30%, rgba(var(--accent-rgb), 0.04) 0%, transparent 50%)`,
        }}
      />

      <div className="absolute top-16 right-12 flex flex-col items-end gap-2 text-[var(--text-muted)] hidden lg:flex pointer-events-none opacity-60">
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.4em' }}>
          [ VOL — 03 ]
        </p>
        <div className="w-8 h-[1px] bg-[var(--text)] opacity-30" />
      </div>

      <div className="absolute bottom-16 right-[5vw] opacity-30 mix-blend-difference pointer-events-none hidden md:flex items-center justify-center">
        <svg className="rotating-badge w-32 h-32" viewBox="0 0 100 100">
          <path
            id="textPath"
            d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
            fill="transparent"
          />
          <text
            fontSize="8.5"
            fill="var(--text)"
            letterSpacing="0.25em"
            style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}
          >
            <textPath href="#textPath" startOffset="0%">
              • Creative Obsession • Digital Perfection
            </textPath>
          </text>
        </svg>
        <div className="absolute w-1 h-1 bg-[var(--text)] rounded-full" />
      </div>

      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-center items-start px-6 max-md:!px-10 max-md:box-border"
      >
        <div className="flex items-center gap-6 mb-16 overflow-hidden w-full">
          <div className="w-12 h-[1px] bg-[var(--text)] opacity-30" />
          <h2
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            Manifesto
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-transparent" />
          <span className="rotating-star text-[var(--accent)] text-xs opacity-50 ml-4 hidden sm:block">
            ✦
          </span>
        </div>

        <div
          className="flex flex-col gap-y-3 w-full relative max-md:!text-[2.5rem] max-md:ml-2 max-md:!leading-[1.1]"
          style={{
            fontFamily: headingFont,
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: '0.02em',
            color: 'var(--text)',
            textTransform: 'uppercase',
          }}
        >
          <div className="absolute -left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.06)] to-transparent hidden lg:block" />

          {/* Row 1 */}
          <div className="overflow-hidden pb-4 flex flex-wrap items-center gap-x-4">
            <span className="manifesto-line inline-block origin-bottom-left">It's never</span>
            <span className="manifesto-line inline-block origin-bottom-left text-[rgba(232,230,227,0.3)]">
              just a website.
            </span>
          </div>

          {/* Row 2 */}
          <div className="pb-4 flex flex-wrap items-end gap-x-4">
            <span className="manifesto-line inline-block origin-bottom-left">Every</span>

            <div className="manifesto-line inline-block origin-bottom-left">
              <div
                className="relative group cursor-pointer px-4"
                role="button"
                aria-label="Reveal detail highlights"
                onMouseEnter={handleWordEnter('details')}
                onMouseLeave={handleWordLeave}
              >
                <span
                  className="inline-block relative z-10 transition-colors duration-500"
                  style={{
                    fontFamily: italicSerifFont,
                    fontStyle: 'italic',
                    textTransform: 'lowercase',
                    color: 'transparent',
                    WebkitTextStroke: '1px var(--text)',
                    fontSize: '1.2em',
                    lineHeight: 1.1,
                  }}
                >
                  <span className="absolute inset-0 bg-clip-text text-transparent bg-[var(--text)] transform scale-y-0 translate-y-full transition-transform duration-[600ms] ease-out group-hover:scale-y-100 group-hover:translate-y-0" />
                  detail
                </span>

                <span className="absolute -top-4 -right-2 text-[var(--accent)] text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rotating-star">
                  ✴
                </span>
                <div className="absolute bottom-0 left-0 w-full h-px bg-[var(--accent)] transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </div>
            </div>

            <span className="manifesto-line inline-block origin-bottom-left">matters.</span>
          </div>

          {/* Row 3 */}
          <div className="overflow-hidden pb-4 flex flex-wrap gap-x-4">
            <span className="manifesto-line inline-block origin-bottom-left text-[rgba(232,230,227,0.3)]">
              We craft
            </span>
            <span className="manifesto-line inline-block origin-bottom-left relative">
              digital experiences.
              <div className="absolute -bottom-2 left-0 w-full h-px bg-[rgba(255,255,255,0.05)]" />
            </span>
          </div>

          {/* Row 4 */}
          <div className="overflow-hidden pb-4 flex flex-wrap gap-x-4">
            <span className="manifesto-line inline-block origin-bottom-left">Your design.</span>
            <span className="manifesto-line inline-block origin-bottom-left text-[rgba(232,230,227,0.3)]">
              Our obsession.
            </span>
          </div>

          {/* Row 5 */}
          <div className="pb-8 flex flex-wrap items-end gap-x-4 w-full relative">
            <span className="manifesto-line inline-block origin-bottom-left">Your brand.</span>
            <span className="manifesto-line inline-block origin-bottom-left text-[rgba(232,230,227,0.3)]">
              Our
            </span>
            <div className="manifesto-line inline-block origin-bottom-left">
              <div
                className="relative group cursor-crosshair px-2 sm:px-4"
                role="button"
                aria-label="Explore playground experience"
                onMouseEnter={handleWordEnter('playground')}
                onMouseLeave={handleWordLeave}
              >
                <div className="absolute inset-[-40px] bg-[var(--text)] blur-[40px] opacity-0 group-hover:opacity-[0.15] transition-opacity duration-700 pointer-events-none" />

                <span
                  className="inline-block relative z-10 transition-colors duration-500 ease-out"
                  style={{
                    fontFamily: italicSerifFont,
                    fontStyle: 'italic',
                    textTransform: 'lowercase',
                    color: 'var(--text)',
                    fontSize: '1.2em',
                    lineHeight: 1.1,
                    paddingLeft: '0.1em',
                  }}
                >
                  playground
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent)] transform scale-x-0 origin-right transition-transform duration-[600ms] ease-out group-hover:scale-x-100" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Single overlay for ALL images ── */}
      <div
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        style={{ perspective: '2000px' }}
      >
        <AnimatePresence>
          {stackedImages.map((img) => (
            <motion.div
              key={img.id}
              initial={{ scale: 0, opacity: 0, rotateZ: img.rotation - 15 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotateZ: img.rotation,
                transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
              }}
              exit={{
                scale: 0,
                opacity: 0,
                rotateZ: img.rotation + 15,
                transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
              }}
              className="absolute"
              style={{
                left: cursorPos.x + img.x,
                top: cursorPos.y + img.y,
                width: 'clamp(90px, 10vw, 150px)',
                height: 'clamp(130px, 14vw, 210px)',
                transformOrigin: '50% 50%',
                transform: 'translate(-50%, -50%)',
                willChange: 'transform',
              }}
            >
              <div
                className="w-full h-full rounded-md overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative bg-[#222]"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <img
                  src={img.url}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.95) contrast(1.1) grayscale(0.1)' }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
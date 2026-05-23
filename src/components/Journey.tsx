import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const JOURNEY_DATA = [
  {
    year: "2018 — 2019",
    category: "LOGIC / INCEPTION",
    title: "THE START",
    metadata: "ISO:100 // PHASE:01",
    description: "Discovering the core architecture of logic through Scratch. Stripping away complexity to focus on pure algorithmic patterns.",
    image: "/images/journey/inception.png",
    specs: { latency: "0.2ms", commit: "INIT_01", load: "98%" }
  },
  {
    year: "2021 — 2022",
    category: "STRUCTURE / CORE",
    title: "FOUNDATION",
    metadata: "ISO:200 // PHASE:02",
    description: "Mastering HTML & Python fundamentals. Building the structural integrity required for complex system engineering.",
    image: "/images/journey/foundation.png",
    specs: { latency: "1.4ms", commit: "CORE_X", load: "94%" }
  },
  {
    year: "2023 — 2024",
    yearShort: "2023",
    category: "EXPANSION / SCALE",
    title: "EVOLUTION",
    metadata: "ISO:400 // PHASE:03",
    description: "Scaling the technical stack with SQL, C++, and advanced web architecture. Transitioning from scripts to scalable ecosystems.",
    image: "/images/journey/evolution.png",
    specs: { latency: "2.8ms", commit: "SCALE_V2", load: "89%" }
  },
  {
    year: "2024 — 2025",
    category: "THEORY / DEPTH",
    title: "STRATEGIC",
    metadata: "ISO:800 // PHASE:04",
    description: "A period of intensive theoretical study and disciplined practice. Optimizing the mind for high-level problem solving.",
    image: "/images/journey/strategic_break.png",
    specs: { latency: "0.8ms", commit: "OPT_MAX", load: "100%" }
  },
  {
    year: "2025 — 2026",
    category: "DEPLOY / FLOW",
    title: "PROFESSIONAL",
    metadata: "ISO:1600 // PHASE:05",
    description: "Bridging the gap between raw code and professional deployment. Exploring the intersection of AI, ML, and Data Science.",
    image: "/images/journey/professional.png",
    specs: { latency: "4.2ms", commit: "DEPLOY_S", load: "92%" }
  },
  {
    year: "mid 2026",
    category: "ADVANCED / R&D",
    title: "NEURAL",
    metadata: "ISO:3200 // PHASE:06",
    description: "Deep diving into neural networks and distributed systems. Pursuing the pinnacle of computer science and data engineering.",
    image: "/images/journey/research.png",
    specs: { latency: "8.5ms", commit: "NEURAL_F", load: "85%" }
  }
];

// ── SUB-COMPONENT: JOURNEY MILESTONE ──
const JourneyMilestone = ({ item, i, activeIndices }: { item: any, i: number, activeIndices: number[] }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isActive = activeIndices.includes(i);

  useEffect(() => {
    if (!cardRef.current || !pinRef.current || !contentRef.current) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      if (isActive) {
        // Entrance Animation
        gsap.to(cardRef.current, { rotateX: 45, translateZ: 20, duration: 1.4, ease: "power3.out" });
        gsap.to(pinRef.current, { height: 160, translateZ: 2, opacity: 1, duration: 1.4, ease: "power3.out" });
        gsap.to(contentRef.current, { opacity: 1, y: 0, z: 40, duration: 1.2, delay: 0.1, ease: "power2.out" });
      } else {
        // Exit Animation
        gsap.to(cardRef.current, { rotateX: 0, translateZ: 0, duration: 1, ease: "power2.inOut" });
        gsap.to(pinRef.current, { height: 0, translateZ: -100, opacity: 0, duration: 0.8, ease: "power2.in" });
        gsap.to(contentRef.current, { opacity: 0, y: 40, duration: 0.6, ease: "power2.in" });
      }
    });

    return () => mm.revert();
  }, [isActive]);

  return (
    <div
      className="editorial-spread flex-shrink-0 w-[500px] lg:w-[600px] h-full relative flex items-center justify-center max-md:!w-full max-md:!h-[60vh] max-md:!mx-0"
      style={{ marginLeft: '12vw', marginRight: '12vw' }}
    >
      {/* ── DESKTOP ONLY: 3D CARD ── */}
      <div className="relative w-full aspect-[16/9] z-10 max-md:hidden" style={{ perspective: '3000px' }}>

        {/* The Tilting Card Container */}
        <div
          ref={cardRef}
          className="w-full h-full relative"
          style={{
            transformOrigin: 'bottom center',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Image Layer */}
          <div className="relative w-full h-full overflow-hidden border border-white/10 bg-[#111] shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <img
              src={item.image}
              alt={item.title}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${isActive ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale'}`}
            />
          </div>

          {/* COLORED PRECISION PIN (Anchored to Middle) */}
          <div
            className="absolute inset-0 flex justify-center pointer-events-none z-10"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* The Zero-Size Anchor Point at the middle of the image (Adjusted for perspective) */}
            <div className="relative w-0 h-0 top-[60%]" style={{ transformStyle: 'preserve-3d' }}>
              <div
                ref={pinRef}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3px] origin-bottom opacity-0"
                style={{
                  background: 'linear-gradient(to top, #FF6B00, rgba(255,107,0,0.3), transparent)',
                  transform: 'rotateX(-45deg) translateZ(-150px)',
                  boxShadow: '0 0 20px rgba(255,107,0,0.3)',
                }}
              >
                {/* Glowing Focal Bead */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FF6B00] rounded-full shadow-[0_0_12px_#FF6B00]" />

                {/* Content Node at the top of the line */}
                <div ref={contentRef} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-[600px] max-md:w-[85vw] opacity-0">
                  <div className="flex flex-col items-center space-y-6 relative py-8">

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 text-[10px] text-white/20 font-light">+</div>
                    <div className="absolute top-0 right-0 text-[10px] text-white/20 font-light">+</div>
                    <div className="absolute bottom-0 left-0 text-[10px] text-white/20 font-light">+</div>
                    <div className="absolute bottom-0 right-0 text-[10px] text-white/20 font-light">+</div>

                    {/* Section Label */}
                    <div className="absolute -left-12 top-1/2 -rotate-90 origin-center">
                      <span className="text-[9px] font-mono tracking-[0.5em] text-white/10 uppercase whitespace-nowrap">
                        EXP_DATA // {item.year.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                      <div className="h-px w-12 bg-white/10" />
                      <span
                        className="text-white/40 text-lg italic"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {item.year}
                      </span>
                      <div className="h-px w-12 bg-white/10" />
                    </div>

                    <h3
                      className="text-7xl lg:text-8xl max-md:text-5xl font-normal text-white tracking-tighter uppercase leading-none text-center py-2"
                      style={{ fontFamily: 'Anton, sans-serif', padding: '0.5rem 0' }}
                    >
                      {item.title}
                    </h3>

                    <div className="relative pt-2">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <p className="text-[13px] font-normal text-white/50 leading-relaxed tracking-[0.05em] uppercase text-center max-w-md pt-6">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Minimal Base Anchor */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-white/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Deep Ground Shadow */}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-black/80 blur-3xl transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: 'translateY(20px) translateZ(-100px)' }}
        />
      </div>

      {/* ── MOBILE ONLY: FLAT LIST ITEM ── */}
      <div className="hidden max-md:flex w-full h-full flex-col items-center justify-center relative overflow-hidden px-6 py-16">
        
        {/* Dimmed Background Photo */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.35]">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale" />
        </div>

        {/* 100% Opaque Gradient Overlays for Seamless Merging */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#1a1a1a] via-transparent to-[#1a1a1a]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#FF6B00]" />
            <span
              className="text-white/70 text-xl italic leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {item.year}
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#FF6B00]" />
          </div>

          <div style={{ height: '24px', width: '100%' }} />

          <h3
            className="text-[3rem] font-normal tracking-tighter uppercase leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/30 drop-shadow-2xl"
            style={{ fontFamily: 'Anton, sans-serif' }}
          >
            {item.title}
          </h3>

          <div style={{ height: '24px', width: '100%' }} />

          <p 
            className="text-[15px] font-medium text-white/60 leading-[1.35] max-w-[320px] uppercase tracking-widest"
            style={{ fontFamily: "'Saira Extra Condensed', sans-serif" }}
          >
            {item.description}
          </p>
        </div>
      </div>

      {/* Parallax Background Year */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-normal text-white/[0.012] pointer-events-none select-none uppercase z-[-1] max-md:hidden"
        style={{ fontFamily: 'Anton, sans-serif' }}
      >
        {item.yearShort || item.year.split(' ')[0]}
      </div>
    </div>
  );
};

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const activeIndicesRef = useRef<number[]>([]);

  useEffect(() => {
    let mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 768px)", () => {
        const horizontal = horizontalRef.current;
        const section = sectionRef.current;
        const progressLine = progressLineRef.current;
        if (!horizontal || !section) return;

        const totalWidth = horizontal.scrollWidth;
        const windowWidth = window.innerWidth;
        const amountToScroll = totalWidth - windowWidth;

        ScrollTrigger.create({
          trigger: section,
          pin: true,
          start: "top top",
          end: () => `+=${totalWidth}`,
          scrub: 1.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(horizontal, { x: -progress * amountToScroll });
            if (progressLine) {
              gsap.set(progressLine, { scaleX: progress });
            }

            const newActive: number[] = [];
            const leftBoundary = windowWidth * 0.42; // Left panel covers 42vw
            const rightBoundary = windowWidth;

            if (horizontal.children) {
              Array.from(horizontal.children).forEach((child, i) => {
                 const rect = child.getBoundingClientRect();
                 // Element is visible if its left edge entered the screen and right edge hasn't passed the left panel
                 if (rect.left < rightBoundary && rect.right > leftBoundary) {
                    newActive.push(i);
                 }
              });
            }

            if (JSON.stringify(newActive) !== JSON.stringify(activeIndicesRef.current)) {
               activeIndicesRef.current = newActive;
               setActiveIndices(newActive);
            }
          }
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative w-full h-screen bg-[#111] overflow-hidden select-none max-md:!h-auto max-md:!overflow-visible max-md:!bg-[#1a1a1a]"
    >
      <div className="flex h-full w-full relative z-10 max-md:flex-col">

        {/* ══ LEFT: EDITORIAL COVER ══ */}
        <div
          className="w-[42%] h-full flex flex-col justify-center relative bg-[#111] z-20 shadow-[80px_0_150px_rgba(0,0,0,0.9)] max-md:w-full max-md:h-[50vh] max-md:min-h-[400px] max-md:!bg-[#1a1a1a]"
          style={{ paddingLeft: '5vw', paddingRight: '7vw' }}
        >


          <div className="relative z-10">
            <div className="flex flex-col mb-20">
              <div className="flex flex-col items-start">
                <span
                  className="text-[6vw] font-light leading-none tracking-tight text-white italic -mb-6 max-md:text-4xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  The
                </span>
                <h2
                  className="text-[9vw] font-normal leading-[0.8] tracking-tighter text-white uppercase max-md:text-6xl"
                  style={{ fontFamily: 'Anton, sans-serif' }}
                >
                  JOURNEY
                </h2>
              </div>
            </div>

            <div className="flex gap-12 items-start mt-[100px] relative top-8">
              <div className="w-px h-24 bg-white/10 pt-4 ml-6" />
              <p
                className="text-[18px] text-white/40 leading-relaxed max-w-[280px] italic"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                “Mapping the evolution of logic, from the first line of code to the complex neural architectures of tomorrow.”
              </p>
            </div>
          </div>

          {/* Editorial Folio: Bottom Section */}
          <div className="absolute bottom-16 left-0 w-full px-[8vw] flex flex-col gap-16">
            <div className="w-full h-px bg-white/5" />
            <div className="flex justify-between items-end relative">

              <div className="absolute right-[1vw] bottom-0 translate-y-12">
                <span className="text-8xl font-normal text-white/[0.03] leading-none select-none" style={{ fontFamily: 'Anton, sans-serif' }}>
                  {String((activeIndices[0] || 0) + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Background Atmospheric Glow */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1/2 bg-white/[0.01] blur-[120px] pointer-events-none" />
        </div>

        {/* ══ RIGHT: HORIZONTAL TIMELINE STREAM (STACKED ON MOBILE) ══ */}
        <div className="w-[58%] h-full overflow-hidden relative bg-[#1a1a1a] max-md:!w-full max-md:!h-auto max-md:!overflow-visible">

          {/* Static High-Performance Dot Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 107, 0, 0.2) 2px, transparent 2px)',
              backgroundSize: '16px 16px'
            }}
          />

          {/* Main Timeline Axis: The "Data Bus" */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 z-0 overflow-hidden max-md:hidden">
            {/* Base Pulse */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF6B00]/10 to-transparent w-1/3 animate-data-pulse" />

            {/* Scroll Progress Indicator */}
            <div
              ref={progressLineRef}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent to-[#FF6B00] origin-left shadow-[0_0_15px_#FF6B00]"
              style={{ width: '100%', transform: 'scaleX(0)' }}
            >
              {/* Glowing Tip */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FF6B00] rounded-full blur-[2px] shadow-[0_0_20px_#FF6B00]" />
            </div>
          </div>

          <div
            ref={horizontalRef}
            className="flex h-full items-center px-[10vw] relative z-10 max-md:flex-col max-md:!w-full max-md:!px-0 max-md:!h-auto"
            style={{ width: 'max-content' }}
          >
            {JOURNEY_DATA.map((item, i) => (
              <JourneyMilestone key={i} item={item} i={i} activeIndices={activeIndices} />
            ))}

          </div>
        </div>
      </div>

      {/* Global Physics Keyframes */}
      <style>{`
        @keyframes data-pulse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-data-pulse {
          animation: data-pulse 8s linear infinite;
        }
      `}</style>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5 z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5 z-20" />
    </section>
  );
}

import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
import { DATA, CATEGORIES, CATEGORY_DESCRIPTIONS } from './TechStackData';

const TechStackScene = React.lazy(() => import('./TechStackScene'));

const DelayedTechStackScene = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);
  
  const Skeleton = (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-[300px] h-[300px] rounded-full border border-white/5 animate-ping opacity-20" />
    </div>
  );

  if (!mounted) return Skeleton;
  
  return (
    <Suspense fallback={Skeleton}>
      <TechStackScene />
    </Suspense>
  );
};

/* ═══════════════════════════════════════════
   TECH CARD COMPONENT
   ═══════════════════════════════════════════ */
const TechCard = ({ tech, index }: { tech: (typeof DATA)[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex items-center gap-4 cursor-default overflow-hidden"
      style={{
        padding: '12px 28px 12px 16px',
        borderRadius: '16px',
        background: isHovered
          ? `linear-gradient(135deg, ${tech.color}08, ${tech.color}03)`
          : 'rgba(255,255,255,0.02)',
        border: isHovered ? `1px solid ${tech.color}30` : '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 50%, ${tech.color}10, transparent 70%)` }}
      />
      <div
        className="relative flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-500"
        style={{
          background: isHovered ? `${tech.color}12` : 'rgba(255,255,255,0.03)',
          border: isHovered ? `1px solid ${tech.color}25` : '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <img
          src={tech.icon}
          alt={tech.name}
          className="w-5 h-5 object-contain transition-all duration-500"
          style={{
            opacity: isHovered ? 1 : 0.55,
            filter: isHovered ? `drop-shadow(0 0 8px ${tech.color}40)` : 'none',
          }}
        />
      </div>
      <span
        className="relative text-[13.5px] font-mono tracking-wide whitespace-nowrap transition-colors duration-500"
        style={{ color: isHovered ? '#ffffff' : '#737373' }}
      >
        {tech.name}
      </span>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState('Frontend');

  const filteredData = useMemo(() => DATA.filter((tech) => tech.category === activeCategory), [activeCategory]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      tl.fromTo('.tech-reveal', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
      tl.fromTo('.tech-line', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, '-=0.4');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div aria-hidden="true" className="w-full h-24 md:h-32 lg:h-40" />

      <section
        ref={sectionRef}
        id="tech-stack"
        className="relative w-full bg-[#1a1a1a] flex flex-col overflow-hidden py-[160px] md:py-[200px] max-md:py-[80px]"
      >
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FF6B00]/[0.02] rounded-full blur-[150px] pointer-events-none max-md:hidden" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.015] rounded-full blur-[120px] pointer-events-none max-md:hidden" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[#FF6B00]/[0.015] rounded-full blur-[180px] pointer-events-none translate-x-1/3 -translate-y-1/2 max-md:hidden" />

        {/* 3D Canvas */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 max-md:hidden">
          <DelayedTechStackScene />
        </div>

        {/* Sphere edge glow */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-[1] max-md:hidden"
          style={{
            right: '-60px',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, rgba(255,69,0,0.02) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full flex px-6 md:px-12 lg:px-0 max-md:!px-10 max-md:box-border">
          <div className="hidden lg:block" style={{ width: '140px', minWidth: '140px' }} />

          <div className="flex-1 max-w-3xl">
            <div className="tech-reveal flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-20">
              <div className="flex flex-col gap-5 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-[1.5px] bg-[#FF6B00]" />
                  <span className="text-[11px] font-mono tracking-[0.5em] uppercase text-neutral-500">Expertise</span>
                </div>
                <h2
                  className="text-6xl md:text-8xl lg:text-[7vw] text-white font-normal tracking-tight leading-[0.85]"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  TECH{' '}
                  <span className="opacity-20 italic font-light" style={{ fontFamily: 'Vogjer, serif' }}>
                    Stack
                  </span>
                </h2>
              </div>

              <div className="lg:pt-12 lg:max-w-[280px] flex-shrink-0">
                <p className="text-neutral-500 font-mono text-[12px] leading-[1.8] tracking-wide">
                  A curated selection of technologies utilized to architect modern digital experiences — from interactive frontends to resilient backend systems.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[32px] font-light text-[#FF6B00]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {DATA.length}+
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-600">Technologies</span>
                </div>
              </div>
            </div>

            <div className="h-16" />
            <div className="tech-line w-full h-[1px] bg-gradient-to-r from-[#FF6B00]/40 via-white/10 to-transparent origin-left" />
            <div className="h-12" />

            <div className="tech-reveal">
              <div className="flex flex-wrap items-center gap-6 md:gap-10">
                {CATEGORIES.map((cat, idx) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className="group relative flex items-center gap-3 py-3 cursor-pointer">
                    <span
                      className={`text-[9px] font-mono transition-all duration-500 ${activeCategory === cat ? 'text-[#FF6B00] scale-110' : 'text-neutral-700 group-hover:text-neutral-500'}`}
                      style={{ fontFamily: 'Vogjer, serif' }}
                    >
                      0{idx + 1}
                    </span>
                    <span
                      className={`text-[11px] font-mono uppercase tracking-[0.3em] transition-all duration-500 ${activeCategory === cat ? 'text-white' : 'text-neutral-600 group-hover:text-neutral-300'}`}
                    >
                      {cat}
                    </span>
                    {activeCategory === cat && (
                      <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-[9px] font-mono text-[#FF6B00]/60 bg-[#FF6B00]/[0.08] px-2 py-0.5 rounded-full">
                        {filteredData.length}
                      </motion.span>
                    )}
                    {activeCategory === cat && (
                      <motion.div
                        layoutId="techActiveUnderline"
                        className="absolute -bottom-1 left-0 w-full h-[2px] rounded-full"
                        style={{ background: 'linear-gradient(90deg, #FF6B00, #FF6B00 50%, transparent)', boxShadow: '0 0 20px rgba(255,107,0,0.4)' }}
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="h-5" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeCategory}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-neutral-600 font-mono text-[11px] tracking-wide"
                >
                  {CATEGORY_DESCRIPTIONS[activeCategory]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="h-12" />

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredData.map((tech, i) => (
                    <TechCard key={tech.name} tech={tech} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="h-16" />

            <div className="tech-reveal">
              <div className="w-full h-[1px] bg-white/[0.04]" />
              <div className="h-8" />
              <div className="flex flex-wrap items-center gap-10 md:gap-16">
                {CATEGORIES.map((cat) => {
                  const count = DATA.filter((d) => d.category === cat).length;
                  const isActive = activeCategory === cat;
                  return (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className="group flex flex-col gap-1.5 cursor-pointer">
                      <span
                        className="text-[28px] font-light transition-colors duration-500"
                        style={{ fontFamily: 'Bebas Neue, sans-serif', color: isActive ? '#FF6B00' : '#333' }}
                      >
                        {count}
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase tracking-[0.3em] transition-colors duration-500 ${isActive ? 'text-neutral-400' : 'text-neutral-700 group-hover:text-neutral-500'}`}
                      >
                        {cat}
                      </span>
                    </button>
                  );
                })}
                <div className="hidden md:block w-[1px] h-10 bg-white/[0.06]" />
                <div className="flex flex-col gap-1.5 max-md:hidden">
                  <span className="text-[28px] font-light text-white/20" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {DATA.length}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-neutral-700">Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="w-full h-24 md:h-32 lg:h-40" />
    </>
  );
}
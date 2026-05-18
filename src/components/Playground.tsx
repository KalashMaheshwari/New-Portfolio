import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { WobbleCard } from './ui/wobble-card';
import { nucleusController } from './ui/CursorNucleus';
import ProjectDetail from './ProjectDetail';
import LightRays from './ui/LightRays';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  year: string;
  role: string;
  tags: string[];
  link: string;
  github: string;
  image: string;
  gallery: string[];
  highlights: string[];
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'BM Advertisers',
    subtitle: 'Elite Digital Experience & Interactive Publishing Engine',
    description: 'A masterfully engineered digital storefront built for elite media presence, high-tier PR networking, and immersive brand storytelling. Implements strict performance architectures, high-fidelity dynamic asset pipelines, and an immersive 3D magazine flipbook.',
    category: 'Web Application',
    year: '2024',
    role: 'Full Stack Engineer',
    tags: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Framer Motion'],
    link: 'https://bmadvertisers.com',
    github: 'https://github.com/KalashMaheshwari/Bm-Advertisers.git',
    image: '/images/BM/hero.webp',
    gallery: ['/images/BM/1.webp', '/images/BM/2.webp', '/images/BM/3.webp'],
    highlights: [
      "Engineered an interactive 3D Magazine Flipbook using React-Pageflip frameworks.",
      "Handled extreme asset density pipelines across dynamic grid configurations safely.",
      "Implemented low-latency communication states reducing frontend bottlenecks."
    ]
  },
  {
    id: 2,
    title: 'Kleem Group',
    subtitle: 'Premium Digital Ecosystem',
    description: 'A centralized hub for multiple enterprise verticals: Real Estate, Infrastructure Development, Pharmaceuticals, and Sports Management. Features ultra-premium Glassmorphism interfaces, a physical kinetic gallery engine, and bespoke page transitions.',
    category: 'Corporate Ecosystem',
    year: '2024',
    role: 'Lead Frontend Architect',
    tags: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'GSAP', 'Framer Motion'],
    link: 'https://Kleemgroup.com',
    github: 'https://github.com/KalashMaheshwari/kleem-group.git',
    image: '/images/KLEEM/hero.webp',
    gallery: ['/images/KLEEM/1.webp', '/images/KLEEM/2.webp', '/images/KLEEM/3.webp'],
    highlights: [
      "Crafted dynamic Glassmorphic parameters scaling seamlessly.",
      "Mapped vector momentum vectors governing smooth inertial scrolls.",
      "Structured persistent operational flows boosting navigation fluidity."
    ]
  },
  {
    id: 5,
    title: 'Localis',
    subtitle: 'Cinematic Hospitality Experience',
    description: 'A premium digital ecosystem converting static offline interactions into motion-heavy workflows securely. Solves UX complexities using adaptive screen throttling and intelligent caching metrics reliably.',
    category: 'Hospitality Web App',
    year: '2024',
    role: 'Lead Motion Designer & Engineer',
    tags: ['React', 'Next.js', 'TailwindCSS', 'Framer Motion', 'Markdown'],
    link: 'https://localissacramento.netlify.app/',
    github: '#',
    image: '/images/localis/hero.webp',
    gallery: ['/images/localis/1.webp', '/images/localis/2.webp', '/images/localis/3.webp'],
    highlights: [
      "Architected automated caching logic providing safe fallback offline support.",
      "Prevented structural resource leaks limiting excess memory usage.",
      "Constructed adaptable media payloads confidently."
    ]
  },
  {
    id: 4,
    title: 'Kinetic',
    subtitle: 'The Anti-Gym Web Interface',
    description: 'A brutalist, high-performance web interface designed for a luxury athletic facility. Integrates normalized GPU-layered parallax triggers, magnetic boundaries, and optimized multi-threaded navigation controllers smoothly.',
    category: 'Web Application',
    year: '2024',
    role: 'Lead Developer',
    tags: ['Next.js', 'TypeScript', 'TailwindCSS', 'GSAP', 'Framer Motion', 'Lenis'],
    link: 'https://kinetic-gym.netlify.app',
    github: 'https://github.com/KalashMaheshwari/kinetic-gym.git',
    image: '/images/kinetic/hero.webp',
    gallery: ['/images/kinetic/1.webp', '/images/kinetic/2.webp', '/images/kinetic/3.webp'],
    highlights: [
      "Integrated custom Lenis frameworks enabling normalized kinetic interaction.",
      "Optimized frame thresholds achieving constant GPU rendering integrity.",
      "Built intuitive structural layout conditions securely."
    ]
  },
  {
    id: 3,
    title: 'The Birthday Universe',
    subtitle: 'Premium Interactive Web Experience',
    description: 'An incredibly polished, high-fidelity frontend platform demonstrating continuous UI physics, real-time state management, and modern storytelling mechanics. Harnesses asynchronous low-latency rendering vectors tied dynamically to HTML5 canvas environments.',
    category: 'Interactive Experience',
    year: '2024',
    role: 'Creative Developer',
    tags: ['React', 'TypeScript', 'Vite', 'Framer Motion', 'TailwindCSS'],
    link: 'https://bdayuniverse.netlify.app',
    github: 'https://github.com/KalashMaheshwari/B-Day-Universe.git',
    image: '/images/bday universe/hero.webp',
    gallery: ['/images/bday universe/1.webp', '/images/bday universe/2.webp', '/images/bday universe/3.webp'],
    highlights: [
      "Generated discrete coordinate manipulation sequences natively.",
      "Coupled lightweight visual triggers avoiding processing lag.",
      "Sustained sub-pixel responsiveness flawlessly."
    ]
  },
];

/* ═══════════════════════════════════════════
   SVG Decorative Assets
   ═══════════════════════════════════════════ */
const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 0v24M0 12h24M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
  </svg>
);

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M6 0v12M0 6h12" />
  </svg>
);

const CircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1">
    <circle cx="7" cy="7" r="6" />
  </svg>
);

const DiamondIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
    <path d="M4 0L8 4L4 8L0 4Z" />
  </svg>
);

const CrossIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M0 0l12 12M12 0L0 12" />
  </svg>
);

const HashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M3 0v12M9 0v12M0 3h12M0 9h12" />
  </svg>
);

/* ═══════════════════════════════════════════
   MAIN PLAYGROUND — Premium 2-Col Gallery
   ═══════════════════════════════════════════ */
export default function Playground() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = PROJECTS.find((p) => p.id === selectedId) ?? null;
  const isOpen = selected !== null;

  /* Scroll reveals — Physical fly-in from sides with depth */
  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    if (!section || !header || !grid) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(header, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: header, start: 'top 82%', toggleActions: 'play none none reverse' },
      });

      const cards = grid.children;
      gsap.fromTo(cards, 
        { 
          x: (i) => (i % 2 === 0 ? "-110vw" : "110vw"),
          rotate: (i) => (i % 2 === 0 ? -3 : 3),
          scale: 0.92,
        }, 
        {
          x: 0, 
          rotate: 0,
          scale: 1,
          duration: 1.8, 
          stagger: 0.12, 
          ease: 'expo.out',
          scrollTrigger: { trigger: grid, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  /* Cursor tag follow */
  const showCursorTag = useCallback((_e: React.MouseEvent, title: string, type?: 'default' | 'invert') => {
    nucleusController.showTag(title, type);
  }, []);

  const hideCursorTag = useCallback(() => {
    nucleusController.hideTag();
  }, []);

  const open = useCallback((id: number) => {
    setSelectedId(id);
    hideCursorTag();
    document.body.style.overflow = 'hidden';
  }, [hideCursorTag]);

  const close = useCallback(() => {
    setSelectedId(null);
    document.body.style.overflow = '';
  }, []);

  return (
    <section
    id="playground"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: 'var(--bg)', paddingTop: '8rem', paddingBottom: '10rem' }}
    >
      {/* Background Decor Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(var(--text) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Global Geometric Background Decor */}
        <div className="absolute inset-0 opacity-[0.03] text-white">
          <svg width="100%" height="100%" viewBox="0 0 100 1000" preserveAspectRatio="none">
            {/* Scrutinized geometric scatters across the long section */}
            <circle cx="10" cy="50" r="150" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="10 10" />
            <circle cx="90" cy="200" r="120" fill="none" stroke="var(--accent)" strokeWidth="0.05" opacity="0.3" />
            <circle cx="50" cy="500" r="200" fill="none" stroke="currentColor" strokeWidth="0.05" />
            <circle cx="0" cy="850" r="180" fill="none" stroke="var(--accent)" strokeWidth="0.05" opacity="0.3" />
            <circle cx="100" cy="950" r="150" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="5 5" />
            
            {/* Technical Grid/Ruler Lines */}
            <line x1="5" y1="0" x2="5" y2="1000" stroke="currentColor" strokeWidth="0.01" />
            <line x1="95" y1="0" x2="95" y2="1000" stroke="currentColor" strokeWidth="0.01" />
          </svg>
        </div>
      </div>

      {/* Ambient dual-tone background glows */}
      <div 
        className="absolute top-1/4 -left-40 pointer-events-none"
        style={{ width: '600px', height: '600px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.03, filter: 'blur(150px)' }}
      />
      <div 
        className="absolute bottom-1/4 -right-40 pointer-events-none"
        style={{ width: '600px', height: '600px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.03, filter: 'blur(150px)' }}
      />

      <div 
        className="relative w-full flex flex-col items-center" 
        style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}
      >
        {/* Ultra-Premium Editorial Header */}
        <div ref={headerRef} className="w-full flex flex-col items-center text-center relative max-md:px-4" style={{ marginBottom: '4rem' }}>
          <span
            aria-hidden="true"
            className="max-md:!text-[6rem]"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(8rem, 18vw, 16rem)',
              fontWeight: 'var(--heading-weight)' as any,
              letterSpacing: '-0.06em',
              lineHeight: 1,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(var(--text-rgb), 0.03)',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -65%)',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            04
          </span>
          
          <div className="flex items-center gap-5 relative z-10" style={{ marginBottom: '1.5rem' }}>
            <div className="flex items-center gap-2">
              <div style={{ width: '8px', height: '1px', background: 'var(--accent)' }} />
              <div style={{ width: '2rem', height: '1px', background: 'rgba(var(--text-rgb), 0.15)' }} />
            </div>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 400,
              letterSpacing: '0.5em', textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}>
              SELECTED WORK
            </p>
            <div className="flex items-center gap-2">
              <div style={{ width: '2rem', height: '1px', background: 'rgba(var(--text-rgb), 0.15)' }} />
              <div style={{ width: '8px', height: '1px', background: 'var(--accent)' }} />
            </div>
          </div>
          
          <h2 
            className="max-md:!text-5xl"
            style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
            fontWeight: 'var(--heading-weight)' as any,
            letterSpacing: 'var(--heading-tracking)',
            textTransform: 'var(--heading-transform)' as any,
            color: 'var(--text)',
            lineHeight: 0.95,
            position: 'relative',
            zIndex: 1,
          }}>
            The Playground
          </h2>
          
          <div className="flex items-center gap-3 mt-6 relative z-10">
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)' }} />
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 400,
              letterSpacing: '0.3em', color: 'var(--text-dim)',
            }}>
              WHERE VISION MEETS EXECUTION
            </p>
            {/* Rotating Sparkle Asset */}
            <div className="text-[var(--accent)] opacity-60" style={{ animation: 'spin 12s linear infinite' }}>
              <SparkleIcon />
            </div>
            <div className="hidden lg:block ml-4">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(var(--text-rgb), 0.15)', letterSpacing: '0.1em' }}>
                ARCHIVE_ID: 592B9CD4
              </span>
            </div>
          </div>
        </div>

        <div className="relative w-full">
          {/* Top-Left Corner Mark & Label */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-[rgba(var(--accent-rgb),0.25)] pointer-events-none hidden md:block" />
          <div className="absolute -top-12 -left-4 hidden lg:block pointer-events-none">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '0.2em' }}>
              [ ARCHIVE_COLLECTION_V4 ]
            </span>
          </div>

          {/* Top-Right Corner Mark */}
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t border-r border-[rgba(var(--accent-rgb),0.25)] pointer-events-none hidden md:block" />
          
          {/* Bottom-Left Corner Mark */}
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b border-l border-[rgba(var(--accent-rgb),0.25)] pointer-events-none hidden md:block" />
          
          {/* Bottom-Right Corner Mark & Metadata */}
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-[rgba(var(--accent-rgb),0.25)] pointer-events-none hidden md:block" />
          <div className="absolute -bottom-10 -right-4 hidden lg:block pointer-events-none">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '0.2em' }}>
              VISUAL_CATALOG_SYNCHRONIZED
            </span>
          </div>

          {/* Architectural Vertical Framing Lines */}
          <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[rgba(var(--text-rgb),0.05)] to-transparent hidden xl:block" />
          <div className="absolute -right-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[rgba(var(--text-rgb),0.05)] to-transparent hidden xl:block" />

          {/* Glassy Floating Accents */}
          <div className="absolute top-[15%] -left-20 w-40 h-60 bg-white/[0.02] border border-white/5 backdrop-blur-3xl pointer-events-none hidden 2xl:block" />
          <div className="absolute bottom-[15%] -right-20 w-40 h-60 bg-white/[0.02] border border-white/5 backdrop-blur-3xl pointer-events-none hidden 2xl:block" />

          {/* Floating Gutter Assets with Scatters */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[rgba(var(--text-rgb),0.08)] pointer-events-none hidden lg:block">
            <HashIcon />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[rgba(var(--text-rgb),0.08)] pointer-events-none hidden lg:block" style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}>
            <PlusIcon />
          </div>
          <div className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[rgba(var(--text-rgb),0.08)] pointer-events-none hidden lg:block">
            <CircleIcon />
          </div>
          <div className="absolute top-[10%] left-[5%] text-[rgba(var(--text-rgb),0.05)] pointer-events-none hidden xl:block">
            <CrossIcon />
          </div>
          <div className="absolute top-[85%] right-[5%] text-[rgba(var(--text-rgb),0.05)] pointer-events-none hidden xl:block">
            <HashIcon />
          </div>

          {/* Floating Image Fragments (Parallax) */}
          <div className="absolute top-[20%] left-[2%] w-24 h-32 overflow-hidden border border-white/10 hidden 2xl:block pointer-events-none opacity-20" style={{ transform: 'rotate(-5deg)' }}>
            <img src={PROJECTS[0].image} alt="" className="w-full h-full object-cover grayscale brightness-50" />
          </div>
          <div className="absolute top-[60%] right-[2%] w-32 h-24 overflow-hidden border border-white/10 hidden 2xl:block pointer-events-none opacity-20" style={{ transform: 'rotate(8deg)' }}>
            <img src={PROJECTS[1].image} alt="" className="w-full h-full object-cover grayscale brightness-50" />
          </div>
          <div className="absolute top-[40%] left-[48%] w-16 h-16 overflow-hidden border border-white/10 hidden xl:block pointer-events-none opacity-10" style={{ transform: 'rotate(45deg)' }}>
            <img src={PROJECTS[2].image} alt="" className="w-full h-full object-cover grayscale brightness-50" />
          </div>

          {/* The 2-Column Grid */}
          <div
            ref={gridRef}
            className="w-full grid grid-cols-1 md:grid-cols-2"
            style={{ gap: '2.5rem' }}
          >
            {PROJECTS.map((project, i) => {
              return (
                <div 
                  key={project.id} 
                  className="group relative"
                >
                  {/* Sizing Wrapper - Ensures shadow and card share the same bounds */}
                  <div className="relative w-full">
                    {/* Static "Comicy" Shadow Layer - Behind the card */}
                    <div 
                      className="absolute inset-0 bg-[#666] translate-x-3 translate-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                      aria-hidden="true"
                    />
                    
                    <WobbleCard
                      containerClassName={`
                        relative z-10 w-full
                        bg-[var(--bg-elevated)] 
                        cursor-pointer 
                        rounded-none 
                        border border-[rgba(var(--text-rgb),0.06)] 
                        overflow-hidden 
                        shadow-xl shadow-black/5 
                        transition-all duration-500 ease-out
                        hover:shadow-none hover:border-[rgba(var(--accent-rgb),0.3)] hover:-translate-y-1
                      `}
                      className="relative w-full"
                      onMouseEnter={(e) => showCursorTag(e, project.title)}
                      onMouseLeave={hideCursorTag}
                      onClick={() => open(project.id)}
                    >
                      {/* Raw Image - Full Bleed, No Padding, No Rounded Corners */}
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        loading={i < 2 ? 'eager' : 'lazy'} 
                        className="w-full h-auto block transition-all duration-700 ease-out grayscale-[0.7] brightness-90 group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-105 rounded-none" 
                      />
                    </WobbleCard>
                  </div>
                </div>
              );
            })}

            {/* The 6th CTA Card: Research & Development */}
            <div className="group relative">
              {/* Static Shadow Layer */}
              <div 
                className="absolute inset-0 bg-[#666] translate-x-3 translate-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                aria-hidden="true"
              />
              
              <a 
                href="https://github.com/KalashMaheshwari" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block no-underline"
              >
                <WobbleCard
                  containerClassName={`
                    relative z-10 w-full aspect-video
                    bg-[#050505] 
                    cursor-pointer 
                    rounded-none 
                    border border-[rgba(var(--text-rgb),0.1)] 
                    overflow-hidden 
                    shadow-xl shadow-black/5 
                    transition-all duration-500 ease-out
                    hover:shadow-none hover:border-[rgba(var(--accent-rgb),0.5)] hover:-translate-y-1
                  `}
                  className="relative w-full h-full flex flex-col justify-center items-center text-center overflow-hidden"
                  onMouseEnter={(e) => showCursorTag(e, "COMING SOON", "invert")}
                  onMouseLeave={hideCursorTag}
                >
                  {/* LightRays Background Layer */}
                  <div className="absolute inset-0 z-0">
                    <LightRays 
                      raysOrigin="top-center"
                      raysColor="rgba(255,255,255,0.15)"
                      raysSpeed={0.4}
                      lightSpread={1.2}
                      rayLength={1.5}
                      className="w-full h-full"
                    />
                  </div>

                  {/* COMING SOON Watermark */}
                  <div className="absolute inset-0 z-1 flex items-center justify-center pointer-events-none overflow-hidden">
                    <span 
                      style={{ 
                        fontFamily: 'var(--font-heading)', fontSize: '12vw', fontWeight: 900, 
                        color: '#fff', opacity: 0.04, transform: 'rotate(-15deg)', whiteSpace: 'nowrap',
                        letterSpacing: '-0.02em', position: 'relative', zIndex: 2
                      }}
                    >
                      COMING SOON
                    </span>
                  </div>

                  {/* Kinetic Grid Background */}
                  <div 
                    className="absolute inset-0 z-2 opacity-[0.08] pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
                      backgroundSize: '24px 24px',
                    }}
                  />
                  
                  {/* Ambient Pulsing Glow */}
                  <div 
                    className="absolute inset-0 z-3 bg-radial-gradient from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)'
                    }}
                  />

                  {/* Glass Content Layer */}
                  <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-8 bg-black/20 backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all duration-700">
                    <div className="flex flex-col items-center gap-3">
                      <span style={{ 
                        fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)', 
                        letterSpacing: '0.4em', textTransform: 'uppercase' 
                      }}>
                        [ ARCHIVE_06 ]
                      </span>
                      <h3 style={{ 
                        fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', 
                        fontWeight: 600, color: '#fff', textTransform: 'uppercase', lineHeight: 1.1,
                        maxWidth: '320px', textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                      }}>
                        Research & Development
                      </h3>
                      <p style={{ 
                        fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.6)',
                        maxWidth: '280px', marginTop: '0.2rem', textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                      }}>
                        Experimental prototypes and active R&D.
                      </p>
                      <div className="mt-4 flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#fff', fontWeight: 600 }}>EXPLORE ARCHIVE</span>
                        <div className="text-white group-hover:text-[#FF6B00] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </WobbleCard>
              </a>
            </div>
          </div>
        </div>
        
      </div>

      <ProjectDetail
        isOpen={isOpen}
        onClose={close}
        selectedId={selectedId}
        projects={PROJECTS}
        setSelectedId={setSelectedId}
      />

      {/* Global CSS for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
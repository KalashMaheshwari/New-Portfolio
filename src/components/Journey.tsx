import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const JOURNEY_DATA = [
  {
    epoch: "ANNO COGNITIONIS",
    era: "THE GENESIS OF REASON // EPOCH I",
    title: "THE FIRST SPARK",
    decree: "DECREE OF THE FOUNDATION",
    description: "BEFORE THE ARCHITECTURE COULD RISE, THE MIND SOUGHT THE PURITY OF ABSOLUTE GEOMETRY. DISCOVERING THE FIRST PRISTINE PATTERNS OF REASON—STRIPPING AWAY METRIC ORNAMENTATION TO UNDERSTAND THE RECTILINEAR LOGIC THAT GOVERNS ALL CREATIVE THOUGHT.",
    image: "/images/journey/inception.png",
    decor: "/images/journey/bust1.avif",
    monument: "THE ACADEMY CORE",
    coordinates: "ATHENS CORE // ANCHOR .01"
  },
  {
    epoch: "ANNO ARCHITECTURA",
    era: "ORDER AND SYMMETRY // EPOCH II",
    title: "FOUNDING PILLARS",
    decree: "DECREE OF THE DORIC AXIS",
    description: "MASTERING THE STRUCTURAL SPECTRUM AND COMPOSITIONAL INTEGRITY NECESSARY TO SUSPEND MASSIVE CANVASES IN SPACE. RECONSTRUCTING CODE AS CHISELED MARBLE—ESTABLISHING SYSTEM ARCHITECTURES RIGID ENOUGH TO DEFY TIME AND SUPPORT EXPANSE.",
    image: "/images/journey/foundation.png",
    decor: "/images/journey/bust2.avif",
    monument: "PROPYLAEA GATEWAYS",
    coordinates: "THE IONIC VAULT // SCALE .02"
  },
  {
    epoch: "ANNO EVOLUTIO",
    era: "THE CORINTHIAN EXPANSE // EPOCH III",
    title: "GRAND ASCENSION",
    decree: "DECREE OF THE VAST HORIZON",
    description: "SCALING THE FRONTIERS OF CREATIVE EXPRESSION WITH COMPLEX STRUCTURAL GRIDS AND DEEP ARCHITECTURAL ALGORITHMS. THE METAMORPHOSIS FROM SINGLE ARCHITECTURAL ELEMENTS INTO SCALEABLE, SEAMLESSLY INTERCONNECTED LANDSCAPES OF HUMAN EXPERIENCE.",
    image: "/images/journey/evolution.png",
    decor: "/images/journey/bust3.avif",
    monument: "THE OLYMPIEION SPAN",
    coordinates: "CHRONOS METRIC // GRID .03"
  },
  {
    epoch: "ANNO PHILOSOPHIA",
    era: "THE GREAT CONTEMPLATION // EPOCH IV",
    title: "STRATEGIC BREAK",
    decree: "DECREE OF THE INTERNAL SACRED",
    description: "A DELIBERATE RETREAT INTO ABSOLUTE THEORETICAL ISOLATION AND INTENSE DISCIPLINE. MEDITATING ON INTERACTION COMPOSITIONS AND CRAFTING DESIGN METHODOLOGIES THAT ELEVATE ORDINARY INTERFACES INTO IMMORTAL PIECES OF DIGITAL ART.",
    image: "/images/journey/strategic_break.png",
    decor: "/images/journey/bust4.avif",
    monument: "TEMPLE OF ATHENA",
    coordinates: "INNER SANCTUM // VOID .04"
  },
  {
    epoch: "ANNO PROFESSIO",
    era: "THE TRIUMPHANT RETURN // EPOCH V",
    title: "MASTER MANIFESTO",
    decree: "DECREE OF THE LIVING METROPOLIS",
    description: "BRIDGING THE SEAMLESS CHASM BETWEEN CONCEPTUAL PHILOSOPHY AND EXQUISITE REAL-WORLD DEPLOYMENT. TRANSLATING COMPLEX SYSTEMS, INTELLIGENT ALGORITHMS, AND DATA ARCHITECTURE INTO HIGH-END EMOTIONAL DIGITAL NARRATIVES FOR THE MODERN CONNOISSEUR.",
    image: "/images/journey/professional.png",
    decor: "/images/journey/bust5.avif",
    monument: "THE PARTHENON APEX",
    coordinates: "REALM OF THE SEERS // PLOT .05"
  },
  {
    epoch: "ANNO INTELLECTUS",
    era: "THE TRANSCENDENTAL HEIGHTS // EPOCH VI",
    title: "NEURAL CITADEL",
    decree: "DECREE OF THE SOVEREIGN INTELLIGENCE",
    description: "DEEP DIVING INTO INDEPENDENT NEURAL NETWORKS AND DISTRIBUTED SYSTEM DESIGN. PURSUING THE ABSOLUTE PINNACLE OF SACRED GEOMETRIC ENGINEERING AND DISTRIBUTED MACHINE REASONING—WHERE THE DIGITAL EMULATES THE COGNITIVE ORDER OF THE GODS.",
    image: "/images/journey/research.png",
    decor: "/images/journey/bust6.avif",
    monument: "THE DELPHIC ORACLE",
    coordinates: "KINETIC CANVAS // APEX .06"
  }
];

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const section = sectionRef.current;
      const header = headerRef.current;
      const canvas = canvasRef.current;
      const map = mapRef.current;
      if (!section || !header || !canvas || !map) return;

      const stepX = window.innerWidth * 1.3; 
      const stepY = window.innerHeight * 0.95; 
      
      const totalTravelX = (JOURNEY_DATA.length - 1) * stepX;
      const totalTravelY = (JOURNEY_DATA.length - 1) * stepY;

      Array.from(map.children).forEach((child, i) => {
        gsap.set(child, { 
          x: i * stepX, 
          y: i * stepY 
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${window.innerHeight * (JOURNEY_DATA.length * 1.75)}`,
          invalidateOnRefresh: true,
        }
      });

      tl.to(header, {
        xPercent: -100,
        duration: 1.0,
        ease: "none"
      }, 0);

      tl.fromTo(map, 
        { x: window.innerWidth * 0.8 }, 
        {
          x: 0,
          y: 0,
          duration: 1.0,
          ease: "none"
        }, 
        0
      );

      tl.to(map, {
        x: -totalTravelX,
        y: -totalTravelY,
        duration: 6.5,
        ease: "none"
      }, 1.0);

    });

    return () => mm.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="journey" 
      className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden select-none max-md:hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        
        .gpu-layer {
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        .greek-axis-line {
          background: linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.2) 20%, rgba(255, 107, 0, 0.2) 80%, transparent);
        }
        
        /* Premium Ambient Animations */
        @keyframes slow-breathe {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes slow-breathe-reverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(15px); }
        }
        .animate-breathe { animation: slow-breathe 10s ease-in-out infinite; }
        .animate-breathe-reverse { animation: slow-breathe-reverse 12s ease-in-out infinite; }
        
        /* High-End Film Grain */
        .film-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
          z-index: 50;
        }
      `}</style>

      {/* ══ LAYER 1: TITLE BLOCK WITH AMBIENT ANIMATIONS ══ */}
      <div 
        ref={headerRef} 
        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a0a] gpu-layer overflow-hidden"
      >
        <div className="absolute inset-0 film-grain" />

        {/* Left Bust Anchor */}
        <div className="absolute top-[8%] left-[4%] w-[45vh] h-[65vh] pointer-events-none opacity-[0.18] mix-blend-lighten grayscale z-0 animate-breathe">
          <img src="/images/journey/Hbust1.avif" alt="Classical Decor" className="w-full h-full object-contain object-left" />
        </div>
        
        {/* Right Bust Anchor */}
        <div className="absolute top-[38%] right-[4%] w-[45vh] h-[65vh] pointer-events-none opacity-[0.18] mix-blend-lighten grayscale z-0 animate-breathe-reverse">
          <img src="/images/journey/Hbust2.avif" alt="Classical Decor" className="w-full h-full object-contain object-right" />
        </div>

        {/* Fine Architectural Crosshairs */}
        <div className="absolute top-[28%] left-[28%] w-3 h-3 border-t border-l border-[#FF6B00]/40 z-10" />
        <div className="absolute bottom-[28%] right-[28%] w-3 h-3 border-b border-r border-[#FF6B00]/40 z-10" />

        {/* Top Alignment Line */}
        <div className="flex items-center justify-center mb-8 gap-6 z-10">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#FF6B00]/40" />
          <div className="text-[9px] text-[#FF6B00]/90 tracking-[0.5em] font-serif uppercase">Index // 00</div>
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#FF6B00]/40" />
        </div>

        {/* Refined Title Lockup */}
        <div className="relative flex items-center gap-6 z-10">
          <span className="text-[9vw] font-light text-white/10 leading-none pb-2 font-serif" style={{ fontFamily: "'Cinzel', serif" }}>[</span>
          <div className="flex flex-col items-center pt-2">
            <h2 className="text-[3vw] font-light tracking-[0.5em] text-white/50 uppercase leading-none mb-3" style={{ fontFamily: "'Cinzel', serif" }}>THE</h2>
            <h2 className="text-[7.5vw] font-bold tracking-[0.2em] text-[#FF6B00] uppercase leading-none drop-shadow-[0_0_35px_rgba(255,107,0,0.3)]" style={{ fontFamily: "'Cinzel', serif" }}>JOURNEY</h2>
          </div>
          <span className="text-[9vw] font-light text-white/10 leading-none pb-2 font-serif" style={{ fontFamily: "'Cinzel', serif" }}>]</span>
        </div>

        {/* Bottom Alignment Line */}
        <div className="flex items-center justify-center mt-12 gap-8 z-10">
          <div className="h-[1px] w-32 bg-white/10" />
          <div className="text-[8px] tracking-[0.7em] text-white/40 uppercase font-serif" style={{ fontFamily: "'Cinzel', serif" }}>CHRONICLES</div>
          <div className="h-[1px] w-32 bg-white/10" />
        </div>
      </div>

      {/* ══ LAYER 2: ASYMMETRICAL MULTI-COLUMN TIMELINE ══ */}
      <div ref={canvasRef} className="absolute inset-0 z-10 overflow-hidden">
        {/* Softer blueprint layout overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(rgba(255,107,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.3) 1px, transparent 1px)', backgroundSize: '120px 120px' }} />

        <div 
          ref={mapRef} 
          className="absolute top-[12%] left-[10%] w-max h-max gpu-layer"
        >
          {JOURNEY_DATA.map((item, i) => (
            <div 
              key={i} 
              className="absolute top-0 left-0 flex items-center gap-28 w-[90vw] max-w-[1300px]"
            >
              {/* Premium Floating Portrait Imagery Display */}
              <div className="relative w-[32vw] max-w-[440px] aspect-[4/5] shrink-0 z-20">
                <div className="absolute inset-0 border border-white/5 translate-x-3 translate-y-3 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-full border border-white/5 pointer-events-none" />
                
                <div className="w-full h-full overflow-hidden bg-[#111] relative group">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-700"
                  />
                  {/* Subtle, refined inner corner brackets */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/20" />
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/20" />
                </div>

                {/* Subtitle number index bracket */}
                <span className="absolute -left-10 bottom-0 text-[9px] font-medium tracking-widest text-[#FF6B00]/50 font-serif rotate-180" style={{ fontFamily: "'Cinzel', serif", writingMode: 'vertical-rl' }}>
                  PHASE .0{i + 1}
                </span>
              </div>

              {/* Sophisticated Editorial Content Layout */}
              <div className="relative flex flex-col w-[520px] shrink-0 h-[65vh] justify-center gap-12 select-none">
                
                {/* ── TRUE WATERMARK ── */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none opacity-[0.15] mix-blend-luminosity grayscale z-0">
                  <img src={item.decor} alt="Timeline Decor" className="w-full h-full object-contain" />
                </div>
                
                {/* ── TOP SECTION ── */}
                <div className="w-full flex flex-col relative z-20">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[9px] tracking-[0.4em] text-[#FF6B00]/80 font-semibold uppercase font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
                      [ {item.epoch} ]
                    </span>
                    <div className="w-[3px] h-[3px] rotate-45 bg-white/20" />
                    <span className="text-[9px] tracking-[0.25em] text-white/30 font-medium font-serif" style={{ fontFamily: "'Cinzel', serif" }}>
                      {item.era}
                    </span>
                  </div>

                  <h3 className="text-4xl lg:text-[2.75rem] font-medium text-white tracking-[0.2em] uppercase leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                    {item.title}
                  </h3>
                  
                  <div className="w-full h-[1px] greek-axis-line mt-5 opacity-60" />
                </div>

                {/* ── MIDDLE SECTION ── */}
                <div className="w-full flex flex-col relative z-20 max-w-[460px]">
                  <span className="text-[10px] font-semibold tracking-[0.3em] text-[#FF6B00]/70 uppercase mb-4 block" style={{ fontFamily: "'Cinzel', serif" }}>
                    + {item.decree}
                  </span>
                  <p 
                    className="text-[12px] text-white/55 leading-[2.4] tracking-[0.15em] text-left font-light" 
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.description.charAt(0) + item.description.slice(1).toLowerCase()}
                  </p>
                </div>

                {/* ── BOTTOM SECTION ── */}
                <div className="w-full flex flex-col relative z-20 pt-2">
                  <div className="w-full h-[1px] bg-white/5 mb-5" />
                  
                  <div className="w-full flex gap-20 font-serif text-[8.5px]" style={{ fontFamily: "'Cinzel', serif" }}>
                    <div className="flex flex-col gap-2">
                      <span className="text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/10" /> ARCHITECTURE SITE
                      </span>
                      <span className="text-white/60 tracking-[0.2em]">{item.monument}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#FF6B00]/30" /> LOCUS SPECIFICATION
                      </span>
                      <span className="text-[#FF6B00]/80 tracking-[0.2em]">{item.coordinates}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ MOBILE FALLBACK ══ */}
      <div className="hidden max-md:flex flex-col w-full bg-[#0a0a0a] py-20 px-6 space-y-16">
        <div className="text-center mb-6 relative">
          <h2 className="text-4xl font-bold tracking-[0.2em] text-[#FF6B00] uppercase" style={{ fontFamily: "'Cinzel', serif" }}>The Journey</h2>
          <div className="w-16 h-[1px] bg-[#FF6B00]/30 mx-auto mt-4" />
        </div>
        {JOURNEY_DATA.map((item, i) => (
          <div key={i} className="w-full flex flex-col gap-4 border-b border-white/5 pb-10 relative">
            <img src={item.image} alt={item.title} className="w-full h-[35vh] object-cover grayscale opacity-70 border border-white/5 p-1" />
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[9px] tracking-[0.2em] text-[#FF6B00]/80 uppercase">[ {item.epoch} ]</span>
              <h3 className="text-3xl text-white uppercase tracking-wider mt-1" style={{ fontFamily: "'Cinzel', serif" }}>{item.title}</h3>
              <span className="text-[10px] tracking-[0.2em] text-[#FF6B00]/60 uppercase font-serif my-2">+ {item.decree}</span>
              <p className="text-xs text-white/50 tracking-wide leading-relaxed mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
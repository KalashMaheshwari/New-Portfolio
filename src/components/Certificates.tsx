import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  link: string;
  image: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: 'I',
    title: 'BI Internship',
    issuer: 'Brainy Insights',
    date: 'MMXXIV',
    link: '#',
    image: '/images/Certificates/BI_Internship.webp',
  },
  {
    id: 'II',
    title: 'Letter of Recommendation',
    issuer: 'Houston International Foods',
    date: 'MMXXIV',
    link: '#',
    image: '/images/Certificates/HIF_LOR.webp',
  },
  {
    id: 'III',
    title: 'HackwithMAIT 6.0',
    issuer: 'MAIT',
    date: 'MMXXIV',
    link: '#',
    image: '/images/Certificates/HackwithMAIT6.0.webp',
  },
];

const ArrowIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
);

export default function Certificates() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 80%' },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    if (selectedCert) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [selectedCert]);

  return (
    <section
      id="certificates"
      ref={sectionRef}
      className="relative w-full overflow-hidden contain-paint-transform"
      style={{
        background: 'linear-gradient(to bottom, #0a0a0a 0%, var(--bg) 300px)',
        marginBottom: '150px',
        paddingTop: '250px',
        paddingBottom: '200px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* ════════════════════ F1 DECORATIVE BACKGROUND ════════════════════ */}

      {/* Line Art - Near Heading (DO NOT TOUCH) */}
      <div className="absolute top-[5%] right-[-10%] w-[80vh] h-[80vh] pointer-events-none opacity-[0.18] mix-blend-lighten z-0">
        <picture className="contents">
          <source srcSet="/images/line art.avif" type="image/avif" />
          <img src="/images/line art.png" alt="Decor" className="w-full h-full object-contain" />
        </picture>
      </div>

      {/* MV1 Monaco Helmet - Left side, certificates region */}
      <div
        className="absolute pointer-events-none opacity-[0.1] mix-blend-lighten z-0"
        style={{
          top: '50%',
          left: '-4%',
          width: '38vh',
          height: '38vh',
          transform: 'rotate(-15deg)',
        }}
      >
        <picture className="contents">
          <source srcSet="/images/helmet.avif" type="image/avif" />
          <img src="/images/helmet.png" alt="MV1 Monaco 2025 Helmet" className="w-full h-full object-contain" />
        </picture>
      </div>

      {/* RB21 Car - Right side, lower certificates region */}
      <div
        className="absolute pointer-events-none opacity-[0.08] mix-blend-lighten z-0"
        style={{
          top: '75%',
          right: '-5%',
          width: '48vh',
          height: '48vh',
          transform: 'rotate(8deg)',
        }}
      >
        <picture className="contents">
          <source srcSet="/images/rb21.avif" type="image/avif" />
          <img src="/images/rb21.png" alt="RB21 Car" className="w-full h-full object-contain" />
        </picture>
      </div>

      {/* Hamilton Helmet - Right side, certificates region */}
      <div
        className="absolute pointer-events-none opacity-[0.1] mix-blend-lighten z-0"
        style={{
          top: '60%',
          right: '-2%',
          width: '35vh',
          height: '35vh',
          transform: 'rotate(25deg)',
        }}
      >
        <picture className="contents">
          <source srcSet="/images/ham helmet.avif" type="image/avif" />
          <img src="/images/ham helmet.jpg" alt="Hamilton Helmet" className="w-full h-full object-contain" />
        </picture>
      </div>

      {/* Verstappen Silhouette - Left side, lower certificates region (smaller, not cut off) */}
      <div
        className="absolute pointer-events-none opacity-[0.08] mix-blend-lighten z-0"
        style={{
          top: '85%',
          left: '-2%',
          width: '25vh',
          height: '25vh',
          transform: 'rotate(-5deg)',
        }}
      >
        <picture className="contents">
          <source srcSet="/images/ver.avif" type="image/avif" />
          <img src="/images/ver.png" alt="Verstappen" className="w-full h-full object-contain" />
        </picture>
      </div>

      {/* Hamilton Silhouette - Left side, certificates region (smaller, not cut off) */}
      <div
        className="absolute pointer-events-none opacity-[0.08] mix-blend-lighten z-0"
        style={{
          top: '65%',
          left: '-4%',
          width: '25vh',
          height: '25vh',
          transform: 'rotate(-12deg)',
        }}
      >
        <picture className="contents">
          <source srcSet="/images/ham.avif" type="image/avif" />
          <img src="/images/ham.png" alt="Hamilton" className="w-full h-full object-contain" />
        </picture>
      </div>

      {/* Content container */}
      <div
        className="relative z-10 w-full max-w-[1900px] mx-auto"
        style={{ paddingLeft: '12vw', paddingRight: '12vw' }}
      >
        {/* ════════════════════ HEADER (DO NOT TOUCH) ════════════════════ */}
        <div ref={headerRef} style={{ marginBottom: '120px' }}>
          <div className="flex items-center" style={{ gap: '24px', marginBottom: '80px' }}>
            <div style={{ width: '48px', height: '1px', backgroundColor: 'var(--accent)' }} />
            <span
              className="font-mono uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--accent)' }}
            >
              Credentials & Expertise
            </span>
          </div>

          <div style={{ marginBottom: '80px' }} className="flex items-baseline">
            <h2
              className="uppercase"
              style={{
                fontFamily: 'var(--font-neue)',
                fontSize: 'clamp(4rem, 11vw, 10rem)',
                lineHeight: 0.85,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                backgroundImage: 'image-set(url("/images/textfill2.avif") type("image/avif"), url("/images/textfill2.jpg") type("image/jpeg"))',
                backgroundSize: '150% auto',
                backgroundPosition: 'center',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))',
              }}
            >
              Certi
            </h2>
            <h2
              style={{
                fontFamily: '"Playfair Display", "Cormorant Garamond", "Times New Roman", ui-serif, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(4rem, 11vw, 10rem)',
                lineHeight: 0.85,
                fontWeight: 400,
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255, 255, 255, 0.5)',
                marginLeft: '0.05em',
                textTransform: 'lowercase',
              }}
            >
              fications
            </h2>
            <div className="hidden md:flex ml-8 items-center justify-center opacity-80" style={{ color: 'var(--accent)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end" style={{ gap: '80px' }}>
            <p
              className="font-mono max-w-lg"
              style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.9' }}
            >
              Validated mastery. Industry-recognized proof of deep technical capability and
              architectural expertise across cloud, front-end, and systems design.
            </p>
          </div>
        </div>
      </div>

      {/* ════════════════════ MARQUEE STRIP ════════════════════ */}
      <div className="w-full relative z-10" style={{ marginBottom: '100px' }}>
        <div
          className="overflow-hidden"
          style={{
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '14px 0',
          }}
        >
          <div className="marquee-track flex whitespace-nowrap">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.1)',
                  paddingRight: '60px',
                }}
              >
                AWS &nbsp;✦&nbsp; META &nbsp;✦&nbsp; AWWWARDS &nbsp;✦&nbsp; FRONTEND
                MASTERS &nbsp;✦&nbsp; GOOGLE CLOUD &nbsp;✦&nbsp; PLURALSIGHT &nbsp;✦&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content container for Grid */}
      <div
        className="relative z-10 w-full max-w-[1900px] mx-auto"
        style={{ paddingLeft: '12vw', paddingRight: '12vw' }}
      >
        {/* ════════════════════ CERTIFICATE GRID (2 COLUMNS) ════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          
          {/* Left Column: 2 Certificates */}
          <div className="flex flex-col gap-6">
            {CERTIFICATES.filter(c => c.id !== 'II').map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className="cert-card group relative overflow-hidden cursor-pointer"
              >
                {/* Image Container - Size Free, No Info Overlays */}
                <picture className="contents">
                  {!cert.image.endsWith('.webp') && (
                    <source srcSet={cert.image.replace(/\.(jpg|png|webp)$/, '.avif')} type="image/avif" />
                  )}
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="cert-card-img w-full h-auto block"
                    loading="lazy"
                  />
                </picture>

                {/* Minimal Roman Numeral */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-white/30 group-hover:text-white/80 transition-colors duration-500">
                    {cert.id}
                  </span>
                </div>

                {/* Corner brackets */}
                <div className="bracket-tl" />
                <div className="bracket-br" />

                {/* Subtle visual hover glow */}
                <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/5 transition-colors duration-500 pointer-events-none mix-blend-overlay" />
              </div>
            ))}
          </div>

          {/* Right Column: 1 Letter of Recommendation */}
          <div className="flex flex-col gap-6">
            {CERTIFICATES.filter(c => c.id === 'II').map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className="cert-card group relative overflow-hidden cursor-pointer"
              >
                {/* Image Container - Size Free, No Info Overlays */}
                <picture className="contents">
                  {!cert.image.endsWith('.webp') && (
                    <source srcSet={cert.image.replace(/\.(jpg|png|webp)$/, '.avif')} type="image/avif" />
                  )}
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="cert-card-img w-full h-auto block"
                    loading="lazy"
                  />
                </picture>

                {/* Minimal Roman Numeral */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-white/30 group-hover:text-white/80 transition-colors duration-500">
                    {cert.id}
                  </span>
                </div>

                {/* Corner brackets */}
                <div className="bracket-tl" />
                <div className="bracket-br" />

                {/* Subtle visual hover glow */}
                <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/5 transition-colors duration-500 pointer-events-none mix-blend-overlay" />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ════════════════════ CERTIFICATE MODAL ════════════════════ */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 lg:p-12 perspective-1000">
          {/* Backdrop with heavy blur and noise */}
          <div
            className="modal-backdrop absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={() => setSelectedCert(null)}
            style={{ cursor: 'pointer' }}
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
          </div>

          {/* Luxury Modal Content Box */}
          <div className="modal-content relative z-10 flex flex-col lg:flex-row overflow-hidden max-w-[1200px] w-full max-h-[85vh] shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            
            {/* ── Image Presentation Side ── */}
            <div className="modal-img-side w-full lg:w-[55%] relative flex items-center justify-center p-6 md:p-12 min-h-[300px] lg:min-h-[600px]">
              
              {/* Giant elegant watermark background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
                <span
                  style={{
                    fontFamily: 'var(--font-neue)',
                    fontSize: 'clamp(8rem, 25vw, 20rem)',
                    fontWeight: 800,
                    lineHeight: 1,
                    color: 'rgba(255,255,255,0.015)',
                    letterSpacing: '-0.05em',
                  }}
                >
                  {selectedCert.id}
                </span>
              </div>

              {/* Minimal floating labels */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
                <span className="font-mono text-[9px] tracking-[0.4em] text-[var(--accent)]/50 uppercase">
                  Exhibit {selectedCert.id}
                </span>
              </div>

              {/* Actual Image */}
              <div className="relative z-10 max-h-[65vh] w-full flex justify-center items-center">
                <picture className="contents">
                  {!selectedCert.image.endsWith('.webp') && (
                    <source srcSet={selectedCert.image.replace(/\.(jpg|png|webp)$/, '.avif')} type="image/avif" />
                  )}
                  <img
                    src={selectedCert.image}
                    alt={selectedCert.title}
                    className="modal-cert-image object-contain max-h-[65vh] w-auto shadow-2xl"
                  />
                </picture>
                
                {/* Floating corner brackets anchoring the image */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20 -translate-x-4 -translate-y-4" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20 translate-x-4 translate-y-4" />
              </div>
            </div>

            {/* ── Information / Placard Side ── */}
            <div className="modal-content-side w-full lg:w-[45%] relative flex flex-col justify-center p-8 md:p-12 lg:p-16 overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-6 right-6 md:top-8 md:right-8 z-20 w-12 h-12 flex items-center justify-center border border-white/10 hover:border-white/30 bg-black/20 hover:bg-white/5 backdrop-blur-sm rounded-full transition-all duration-300 group/close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50 group-hover/close:text-white group-hover/close:rotate-90 transition-all duration-300">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="modal-stagger w-full max-w-md mx-auto">
                {/* Accent Line */}
                <div className="w-12 h-[1px] mb-8 bg-[var(--accent)]" />

                {/* Issuer */}
                <div className="font-mono uppercase mb-4" style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--accent)' }}>
                  {selectedCert.issuer}
                </div>

                {/* Title */}
                <h3 className="mb-10 text-white leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--font-neue)', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', fontWeight: 500 }}>
                  {selectedCert.title}
                </h3>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-12">
                  <div>
                    <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] mb-3">
                      Date of Issue
                    </div>
                    <div className="text-lg text-white/90 font-medium" style={{ fontFamily: 'var(--font-neue)' }}>
                      {selectedCert.date}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] mb-3">
                      Credential ID
                    </div>
                    <div className="text-lg text-white/90 font-medium" style={{ fontFamily: 'var(--font-neue)' }}>
                      #{selectedCert.id}-CERT
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] mb-3">
                      Validation
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center">
                        <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
                        <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      </div>
                      <span className="text-lg text-white/90 font-medium" style={{ fontFamily: 'var(--font-neue)' }}>
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/5 mb-10" />

                {/* Verify Button */}
                <a
                  href={selectedCert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative overflow-hidden inline-flex items-center justify-center gap-4 px-10 py-5 w-full bg-white text-black transition-all duration-500"
                >
                  <span className="relative z-10 text-[11px] font-mono uppercase tracking-[0.2em] font-semibold">
                    Inspect Credential
                  </span>
                  <svg className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                  <div className="absolute inset-0 bg-[var(--accent)] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════ SCOPED STYLES ════════════════════ */}
      <style>{`
        /* ── Card ── */
        .cert-card {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          background: rgba(255,255,255,0.01);
          transition: border-color 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cert-card:hover {
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.02);
        }

        /* ── Card Image ── */
        .cert-card-img {
          filter: grayscale(0.15) contrast(1.05) brightness(0.95);
          border-radius: 19px; /* Slightly less than container to fit perfectly inside */
          border: 1px solid rgba(255,255,255,0.15);
          transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cert-card:hover .cert-card-img {
          transform: scale(1.03);
          filter: grayscale(0) contrast(1.05) brightness(1.05);
        }

        /* ── Card Info Strip ── */
        .cert-card-info {
          display: none;
        }

        /* ── Corner Brackets ── */
        .bracket-tl,
        .bracket-br {
          position: absolute;
          width: 14px;
          height: 14px;
          z-index: 10;
          opacity: 0.15;
          transition: border-color 0.5s ease, opacity 0.5s ease, width 0.5s ease, height 0.5s ease;
        }
        .bracket-tl {
          top: 12px;
          left: 12px;
          border-top: 1px solid #fff;
          border-left: 1px solid #fff;
          transform: translate(-1px, -1px);
        }
        .bracket-br {
          bottom: 12px;
          right: 12px;
          border-bottom: 1px solid #fff;
          border-right: 1px solid #fff;
          transform: translate(1px, 1px);
        }
        .cert-card:hover .bracket-tl,
        .cert-card:hover .bracket-br {
          border-color: var(--accent);
          opacity: 0.8;
          width: 18px;
          height: 18px;
        }

        /* ── Marquee ── */
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 28s linear infinite;
        }

        /* ════════════════════ MODAL STYLES ════════════════════ */

        /* Backdrop entrance */
        @keyframes modal-backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-backdrop {
          animation: modal-backdrop-in 0.4s ease forwards;
        }

        /* Content entrance */
        @keyframes modal-content-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97) rotateX(2deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0);
          }
        }
        .modal-content {
          animation: modal-content-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          background: #080808;
          border: 1px solid rgba(255,255,255,0.08);
          transform-style: preserve-3d;
        }

        /* Image side */
        .modal-img-side {
          background: linear-gradient(135deg, #050505 0%, #0a0a0a 100%);
          border-right: 1px solid rgba(255,255,255,0.03);
        }
        .modal-cert-image {
          animation: modal-img-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }
        @keyframes modal-img-in {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Content side */
        .modal-content-side {
          background: #080808;
        }

        /* Staggered content animation */
        .modal-stagger > * {
          opacity: 0;
          animation: modal-item-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .modal-stagger > *:nth-child(1) { animation-delay: 0.15s; }
        .modal-stagger > *:nth-child(2) { animation-delay: 0.2s; }
        .modal-stagger > *:nth-child(3) { animation-delay: 0.25s; }
        .modal-stagger > *:nth-child(4) { animation-delay: 0.3s; }
        .modal-stagger > *:nth-child(5) { animation-delay: 0.35s; }
        .modal-stagger > *:nth-child(6) { animation-delay: 0.4s; }
        .modal-stagger > *:nth-child(7) { animation-delay: 0.45s; }
        @keyframes modal-item-in {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Modal corner brackets */
        .modal-bracket-tl,
        .modal-bracket-br {
          position: absolute;
          width: 20px;
          height: 20px;
          z-index: 10;
          opacity: 0.25;
        }
        .modal-bracket-tl {
          top: 16px;
          left: 16px;
          border-top: 1px solid var(--accent, #d2b478);
          border-left: 1px solid var(--accent, #d2b478);
        }
        .modal-bracket-br {
          bottom: 16px;
          right: 16px;
          border-bottom: 1px solid var(--accent, #d2b478);
          border-right: 1px solid var(--accent, #d2b478);
        }
      `}</style>
    </section>
  );
}
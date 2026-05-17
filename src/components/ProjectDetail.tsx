import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

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

interface ProjectDetailProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: number | null;
  projects: Project[];
  setSelectedId: (id: number) => void;
}

export default function ProjectDetail({
  isOpen,
  onClose,
  selectedId,
  projects,
  setSelectedId,
}: ProjectDetailProps) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const hasAnimatedOpen = useRef(false);
  const selected = projects.find((p) => p.id === selectedId) ?? null;

  // GSAP Trigger Close (Overlay + Float Out)
  const triggerClose = useCallback(() => {
    if (modalRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          hasAnimatedOpen.current = false;
          // Force a small delay to ensure React state update doesn't race with GSAP cleanup
          setTimeout(onClose, 10);
        }
      });

      // Float items out upwards/downwards smoothly
      tl.to('.gsap-float-item', {
        y: -40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power3.in',
      }, 0);

      // Overlay wipe
      tl.to(modalRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'expo.inOut',
      }, 0.2);
    } else {
      onClose();
    }
  }, [onClose]);

  // Open Animation (Overlay + Staggered Float In)
  useEffect(() => {
    if (isOpen && selected && modalRef.current && !hasAnimatedOpen.current) {
      hasAnimatedOpen.current = true;

      // Reset states for floating items
      gsap.set('.gsap-float-item', { y: 60, opacity: 0 });

      const tl = gsap.timeline();

      // Overlay wipe in
      tl.fromTo(
        modalRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 1.0, ease: 'expo.out' }
      );

      // Cascade items
      tl.to('.gsap-float-item', {
        y: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.08,
        ease: 'power4.out',
      }, 0.2);
    }
  }, [isOpen, selected]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxUrl) {
          setLightboxUrl(null);
        } else {
          triggerClose();
        }
      }
      if (!lightboxUrl && selectedId) {
        const currentIndex = projects.findIndex(p => p.id === selectedId);
        if (e.key === 'ArrowRight' && currentIndex < projects.length - 1) {
          setSelectedId(projects[currentIndex + 1].id);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
          setSelectedId(projects[currentIndex - 1].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxUrl, selectedId, projects, triggerClose, setSelectedId]);

  if (!isOpen || !selected) return null;

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100000] flex h-full w-full text-white"
      style={{ willChange: 'transform' }}
    >
      {/* Glassmorphic Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={triggerClose}
        style={{
          background: 'rgba(10, 10, 10, 0.45)',
          backdropFilter: 'blur(40px) saturate(150%)',
          WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        }}
      />

      {/* Close Button - Fixed Top Right */}
      <button
        onClick={triggerClose}
        className="fixed top-6 right-6 z-[10000] flex items-center justify-center cursor-pointer group"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '0',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'rotate(90deg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.transform = 'rotate(0deg)';
        }}
        aria-label="Close Project details"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* INNER CONTAINER */}
      <div className="relative z-10 flex flex-col md:flex-row h-full w-full overflow-hidden">
        {/* SIDEBAR / TOPBAR */}
        <div
          className="gsap-float-item flex-shrink-0 flex flex-col md:h-full z-20 border-b md:border-b-0 md:border-r border-white/10"
          style={{
            width: 'auto',
            maxWidth: '100%',
            background: 'rgba(10, 10, 10, 0.65)',
            backdropFilter: 'blur(50px) saturate(180%)',
          }}
        >
          <div className="hidden md:block" style={{ padding: '2rem 1.5rem 1.8rem 1.5rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8px',
                fontWeight: 400,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.2)',
                marginBottom: '0.4rem',
              }}
            >
              {'// archive'}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem',
                fontWeight: 'var(--heading-weight)' as any,
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '-0.01em',
              }}
            >
              Projects
            </p>
          </div>
          
          {/* Projects List (Dynamic Template Mapping) */}
          <div className="flex flex-row md:flex-col gap-2 md:gap-0.5 md:flex-1 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-[clamp(240px,18vw,300px)] py-3 md:py-0 px-4 md:px-3">
            {projects.map((p) => {
              const active = selectedId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className="flex items-center gap-3 text-left w-[200px] md:w-full flex-shrink-0 md:flex-shrink cursor-pointer"
                  style={{
                    padding: '0.65rem 0.75rem',
                    borderRadius: '0',
                    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: 'none',
                    transition: 'background 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div
                    className="flex-shrink-0 overflow-hidden"
                    style={{ width: '44px', height: '32px', borderRadius: '0' }}
                  >
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                      style={{ filter: active ? 'brightness(0.8)' : 'brightness(0.4)' }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        fontWeight: active ? 600 : 400,
                        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {p.title}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '8px',
                        color: 'rgba(255,255,255,0.15)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {p.category}
                    </p>
                  </div>
                  {active && (
                    <div
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '0',
                        background: 'var(--accent)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT DETAIL - Scrollable Content */}
        <div
          data-lenis-prevent
          className="flex-1 h-full overflow-y-auto"
          style={{
            background: 'rgba(18, 18, 18, 0.6)',
            backdropFilter: 'blur(50px) saturate(180%)',
          }}
        >
          <div
            style={{
              padding: 'clamp(2.5rem, 5vw, 5rem) clamp(2rem, 5vw, 4rem)',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {/* Main Banner */}
            <div
              className="gsap-float-item relative w-full overflow-hidden"
              style={{
                marginBottom: '3rem',
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={selected.image}
                alt={selected.title}
                loading="lazy"
                className="w-full h-auto block transition-all duration-500 filter grayscale-[25%] hover:grayscale-0 hover:brightness-110 hover:contrast-115 hover:saturate-125"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)',
                }}
              />
              <div className="absolute top-5 left-5">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    padding: '5px 14px',
                    borderRadius: '0',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {selected.category}
                </span>
              </div>
            </div>

            {/* Title & Actions */}
            <div className="gsap-float-item flex flex-col md:flex-row md:items-start md:justify-between gap-6" style={{ marginBottom: '2.5rem' }}>
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                    fontWeight: 'var(--heading-weight)' as any,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    color: '#fff',
                    textTransform: 'var(--heading-transform)' as any,
                  }}
                >
                  {selected.title}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.45)',
                    marginTop: '0.5rem',
                    lineHeight: 1.6,
                  }}
                >
                  {selected.subtitle}
                </p>
              </div>
              
              <div className="flex items-center gap-3 flex-shrink-0">
                {selected.github && selected.github !== '#' && (
                  <a
                    href={selected.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '0',
                      background: 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.5)',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                    }}
                    aria-label="GitHub"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4" />
                    </svg>
                  </a>
                )}
                
                {selected.link && selected.link !== '#' && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                    style={{
                      height: '44px',
                      padding: '0 22px',
                      borderRadius: '0',
                      background: '#fff',
                      color: '#000',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.04)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,255,255,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Live Site
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Details Row */}
            <div
              className="gsap-float-item grid grid-cols-3 gap-6"
              style={{
                marginBottom: '2.5rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {[
                { label: 'Role', value: selected.role },
                { label: 'Year', value: selected.year },
                { label: 'Stack', value: selected.tags.join(' · ') },
              ].map((m) => (
                <div key={m.label}>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '8px',
                      fontWeight: 500,
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.25)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {m.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.55)',
                      lineHeight: 1.5,
                    }}
                  >
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            <p
              className="gsap-float-item"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.95rem, 1.2vw, 1.08rem)',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.85,
                maxWidth: '740px',
                marginBottom: '3.5rem',
              }}
            >
              {selected.description}
            </p>

            {selected.highlights && selected.highlights.length > 0 && (
              <div
                className="gsap-float-item flex flex-col gap-6"
                style={{ marginBottom: '4rem', maxWidth: '740px' }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div style={{ width: '6px', height: '6px', background: 'var(--accent)' }} />
                  Key technical milestones
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {selected.highlights.map((highlight, i) => (
                    <div 
                      key={i} 
                      className="p-5 border border-[var(--border)] flex items-start gap-4"
                      style={{
                        background: 'rgba(255,255,255,0.01)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <span className="text-[var(--accent)] text-base font-semibold leading-none">⚡</span>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.95rem',
                          color: 'rgba(255,255,255,0.8)',
                          lineHeight: 1.6,
                        }}
                      >
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3-Photo Asymmetric Gallery */}
            {selected.gallery && selected.gallery.length >= 3 && (
              <div
                className="gsap-float-item grid grid-cols-1 md:grid-cols-3 gap-4"
                style={{ marginBottom: '4rem' }}
              >
                {/* Large Feature Image */}
                <div
                  className="md:col-span-2 md:row-span-2 relative overflow-hidden cursor-pointer group"
                  style={{
                    aspectRatio: '16 / 10.3',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  }}
                  onClick={() => setLightboxUrl(selected.gallery[0])}
                >
                  <img
                    src={selected.gallery[0]}
                    alt={`${selected.title} Feature`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    style={{ filter: 'brightness(0.85)' }}
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                </div>

                {/* Supporting Image 1 */}
                <div
                  className="md:col-span-1 relative overflow-hidden cursor-pointer group"
                  style={{
                    aspectRatio: '16 / 10',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  }}
                  onClick={() => setLightboxUrl(selected.gallery[1])}
                >
                  <img
                    src={selected.gallery[1]}
                    alt={`${selected.title} Detail 1`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    style={{ filter: 'brightness(0.85)' }}
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                </div>

                {/* Supporting Image 2 */}
                <div
                  className="md:col-span-1 relative overflow-hidden cursor-pointer group"
                  style={{
                    aspectRatio: '16 / 10',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  }}
                  onClick={() => setLightboxUrl(selected.gallery[2])}
                >
                  <img
                    src={selected.gallery[2]}
                    alt={`${selected.title} Detail 2`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    style={{ filter: 'brightness(0.85)' }}
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                </div>
              </div>
            )}
            
            <div style={{ height: '2rem' }} />
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 cursor-pointer"
          style={{
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] overflow-hidden rounded-none shadow-2xl">
            <img
              src={lightboxUrl}
              alt="Enlarged preview"
              className="w-full h-full object-contain max-h-[90vh]"
            />
            
            {/* Close Lightbox Button */}
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 flex items-center justify-center cursor-pointer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
              }}
              aria-label="Close Preview"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}

import { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SkillItem {
  name: string;
  video: string;
  tag: string;
}

const SKILLS: SkillItem[] = [
  { name: 'Creative Development', video: '/videos/Creative Development', tag: 'GSAP · THREE.JS · WebGL' },
  { name: 'UI/UX Design', video: '/videos/UI UX Design', tag: 'UI / UX · WIREFRAMES' },
  { name: 'Brand Identity', video: '/videos/Brand Identity', tag: 'BRANDING · SYSTEMS' },
  { name: 'Motion & Animation', video: '/videos/Motion & Animation', tag: 'KINETIC · EDITORIAL' },
  { name: 'Full-Stack Architecture', video: '/videos/Full Stack', tag: 'REACT · NEXT.JS · NODE' },
  { name: 'SEO & Strategy', video: '/videos/SEO', tag: 'SEO · ANALYTICS' },
  { name: 'Problem Solving', video: '/videos/Problem Solving', tag: 'DSA · ALGORITHMS' },
  { name: 'Systems Programming', video: '/videos/System Programming', tag: 'C · C++ · PYTHON' },
];
export default function Skills() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleEnter = useCallback((index: number) => {
    setHoveredIndex(index);

    // Reset video to start and play
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }

    const row = rowRefs.current[index];
    const container = videoContainerRef.current;

    if (row && container) {
      const sectionRect = sectionRef.current?.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      if (!sectionRect) return;

      const rowCenterY = rowRect.top - sectionRect.top + rowRect.height / 2;
      const containerH = 170;

      gsap.set(container, { top: rowCenterY - containerH / 2 });
      gsap.to(container, {
        scaleY: 1,
        opacity: 1,
        visibility: 'visible',
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
        force3D: true,
      });
    }
  }, []);

  const handleLeave = useCallback(() => {
    // Safely pause all videos to avoid stale closure state issues
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    setHoveredIndex(null);
    const container = videoContainerRef.current;

    if (container) {
      gsap.killTweensOf(container);
      gsap.set(container, { scaleY: 0, opacity: 0, visibility: 'hidden' });
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section || !header) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(header, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        force3D: true,
        scrollTrigger: { trigger: header, start: 'top 80%', toggleActions: 'play none none reverse' },
      });

      const rows = section.querySelectorAll('.skill-row');
      gsap.fromTo(rows, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
        force3D: true,
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full flex flex-col items-start overflow-hidden skills-light-section pt-40 pb-40 max-md:!py-20"
      style={{ contain: 'paint' }}
    >
      <div className="w-full flex flex-col items-start relative z-10" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(1.5rem, 8vw, 10rem)' }}>
        {/* Header */}
        <div ref={headerRef} className="w-full flex flex-col items-start text-left relative" style={{ marginBottom: '5rem' }}>
          <span
            aria-hidden="true"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(5rem, 12vw, 10rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(0, 0, 0, 0.05)',
              position: 'absolute',
              top: '50%',
              left: '0',
              transform: 'translate(0, -55%)',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            SKILLS
          </span>
          <img src="/3d.gif" alt="3D Hologram" className="absolute right-0 top-[-20px] w-36 h-36 opacity-100 pointer-events-none object-contain" style={{ filter: 'invert(1)' }} />
          <p
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 400,
              letterSpacing: '0.45em', textTransform: 'uppercase',
              color: 'rgba(0, 0, 0, 0.3)', marginBottom: '20px',
              position: 'relative', zIndex: 1,
            }}
          >
            {'|| what i do'}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#1a1a1a',
              lineHeight: 1.05,
              position: 'relative',
              zIndex: 1,
            }}
          >
            Skills & Expertise
          </h2>
          <div 
            className="mt-6 opacity-30 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.4em] relative z-10"
            style={{ maxWidth: '400px', lineHeight: 1.6 }}
          >
            {'|| what i bring'}
          </div>
        </div>

        {/* Skills stack */}
        <div className="flex flex-col items-start w-full">
          {SKILLS.map((skill, index) => {
            const isActive = hoveredIndex === index;
            const anyHovered = hoveredIndex !== null;
            const dimmed = anyHovered && !isActive;

            return (
              <div
                key={skill.name}
                ref={(el) => { rowRefs.current[index] = el; }}
                className="skill-row cursor-default w-full flex items-center justify-start text-left"
                role="text"
                aria-label={`Skill: ${skill.name} - ${skill.tag}`}
                onMouseEnter={() => handleEnter(index)}
                onMouseLeave={handleLeave}
                style={{ padding: 'clamp(0.15rem, 0.5vw, 0.3rem) 0' }}
              >
                <div className="flex items-center justify-start gap-8 max-md:flex-col max-md:items-start max-md:gap-1 max-md:py-2">
                  <h3
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 'clamp(2rem, 5vw, 3.8rem)',
                      fontWeight: 400,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      lineHeight: 1.1,
                      color: dimmed
                        ? 'rgba(0, 0, 0, 0.07)'
                        : isActive
                          ? '#000'
                          : 'rgba(0, 0, 0, 0.6)',
                      filter: dimmed ? 'blur(2px)' : 'none',
                      transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {skill.name}
                  </h3>

                  <span
                    className="max-md:!opacity-100 max-md:!translate-x-0"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '7px',
                      fontWeight: 500,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'rgba(0,0,0,0.4)',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateX(0)' : 'translateX(-8px)',
                      transition: 'all 0.4s ease',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {skill.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video container — Pool of pre-loaded videos */}
      <div
        ref={videoContainerRef}
        className="absolute z-20 pointer-events-none block max-md:hidden"
        style={{
          right: 'clamp(1rem, 5vw, 4rem)',
          width: 'clamp(120px, 25vw, 260px)',
          height: 'clamp(120px, 20vw, 170px)',
          borderRadius: '10px',
          overflow: 'hidden',
          transformOrigin: 'center center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          opacity: 0,
          visibility: 'hidden'
        }}
      >
        {SKILLS.map((skill, i) => (
          <video
            key={skill.name}
            ref={(el) => { videoRefs.current[i] = el; }}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ 
              opacity: hoveredIndex === i ? 1 : 0,
              filter: 'contrast(1.1) brightness(0.85)' 
            }}
          >
            <source src={`${skill.video}.webm`} type="video/webm" />
            <source src={`${skill.video}.mp4`} type="video/mp4" />
          </video>
        ))}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)' }}
        />
      </div>
    </section>
  );
}
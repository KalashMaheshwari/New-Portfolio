import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextPressure from './ui/TextPressure';

gsap.registerPlugin(ScrollTrigger);

// 6 videos to match the strict grid layout of the reference image
const STATIC_VIDEOS = [
  '/videos/animated ui',
  '/videos/coder aesthetic',
  '/videos/Creative Development',
  '/videos/System Programming',
  '/videos/Blackhole',
  '/videos/eye'
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const signatureTextRef = useRef<HTMLDivElement>(null);
  const letsWorkRef = useRef<HTMLHeadingElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const togetherRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Live IST Clock State
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Lazy-play videos only when they are visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    // Setup primary footer block reveals
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top 75%',
        }
      });

      tl.fromTo(letsWorkRef.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.6, ease: 'power2.out' }
      )
        .fromTo(togetherRef.current,
          { y: '100%', opacity: 0, x: '-1.16em' },
          { y: '0%', opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .to(togetherRef.current,
          { x: '0em', duration: 0.4, ease: 'power2.inOut' },
          '-=0.2'
        )
        .fromTo(imageWrapRef.current,
          { scaleX: 0, opacity: 0, transformOrigin: 'left center' },
          { scaleX: 1, opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.4'
        );

      gsap.fromTo('.footer-video-block',
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: footer, start: 'top 50%' }
        }
      );

      gsap.fromTo('.footer-menu-item',
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power2.out',
          scrollTrigger: { trigger: footer, start: 'top 15%' }
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  // ── KALASH SIGNATURE VERTICAL STRETCH ──
  useEffect(() => {
    const signature = signatureRef.current;
    const text = signatureTextRef.current;
    if (!signature || !text) return;

    const ctx = gsap.context(() => {
      // Set to mathematically stretch from top boundary to precisely track the bottom of the screen during scroll
      gsap.fromTo(text,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: signature,
            start: 'top 95%', // Starts slightly before the bottom
            end: 'bottom 95%', // Completes before the absolute bottom to ensure visibility
            scrub: true,
          },
        }
      );
    }, signature);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full pt-20 md:pt-32 overflow-hidden flex flex-col items-center"
      style={{ background: '#0a0a0a', contain: 'paint' }}
    >
      <div className="w-[85vw] mx-auto">

        {/* ROW 1: HEADER BLOCK (Precisely aligned to 12-column Grid) */}
        <div className="grid grid-cols-12 gap-6 w-full">

          {/* LEFT 50%: Bebas Neue Typography */}
          <div className="col-span-12 lg:col-span-6 flex flex-col uppercase shrink-0">
            <div className="overflow-hidden">
              <h2 ref={letsWorkRef} className="footer-headline-row whitespace-nowrap"
                style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontSize: 'clamp(60px, 8vw, 100px)', lineHeight: 0.9, fontWeight: 800, color: '#ffffff' }}>
                LET'S WORK
              </h2>
            </div>

            <div className="overflow-hidden">
              <div className="footer-headline-row flex items-center gap-x-[0.1em] whitespace-nowrap mt-1 md:mt-2"
                style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontSize: 'clamp(60px, 8vw, 100px)', lineHeight: 0.9, fontWeight: 800, color: '#ffffff' }}>

                <div ref={imageWrapRef} className="relative aspect-[4/3] h-[0.8em] rounded-md md:rounded-lg overflow-hidden shrink-0 bg-white/5">
                  <img
                    src="/images/meet.webp"
                    alt="Team desk workspace"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                <div ref={togetherRef} className="inline-block">
                  TOGETHER
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 50%: Pitch Text positioned starting at Column 8 implicitly simulating the right offset */}
          <div className="col-span-12 lg:col-start-8 lg:col-span-5 footer-headline-row hidden lg:flex flex-col justify-start pt-2 h-full text-left">
            <p className="text-white text-[16px] xl:text-[18px] leading-[1.6]" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
              Work with me if average isn't your thing.<br />
              Drop it, I'll build it!
            </p>
            <a
              href="mailto:maheshwarikalash@outlook.com"
              className="mt-10 group inline-flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase font-bold text-white/50 hover:text-white transition-colors duration-300"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              SAY HELLO
              <span className="transform transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#FF6B00]">&rarr;</span>
            </a>
          </div>
        </div>

        {/* ROW 2: STATIC VIDEO GRID (Full width 6-item track) */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-6 w-full mt-36 mb-16 max-md:!mt-24 max-md:!mb-24">
          {STATIC_VIDEOS.map((basePath, idx) => (
            <div
              key={idx}
              className="footer-video-block relative w-full aspect-[4/3] md:aspect-video rounded-md md:rounded-lg overflow-hidden bg-white/5 transition-transform duration-500 hover:-translate-y-2 cursor-pointer"
            >
              <video
                ref={(el) => { videoRefs.current[idx] = el; }}
                loop muted playsInline preload="none"
                className="absolute inset-0 w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              >
                <source src={`${basePath}.webm`} type="video/webm" />
                <source src={`${basePath}.mp4`} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>

        {/* ROW 3: FOOTER MENUS (12-Column grid targeting Col 1 and Col 7 splits exactly as in photograph) */}
        <div className="grid grid-cols-12 gap-y-16 gap-x-6 w-full mb-32 md:mb-48 text-[#d4d4d4]">

          {/* LEFT COLUMN: Vertical Link Sub-Blocks */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-y-[28px]">
            <ul className="flex flex-col gap-y-[0px]">
              {[
                { label: 'HOME', href: '#landing' },
                { label: 'WORK', href: '#playground' },
                { label: 'SKILLS', href: '#skills' },
                { label: 'PLANS', href: '#plans' },
                { label: 'APPROACH', href: '#manifesto' }
              ].map(({ label, href }) => (
                <li key={label} className="footer-menu-item shrink-0 leading-[1.1]">
                  <a href={href}
                    className="text-[10.5px] xl:text-[11px] uppercase tracking-widest hover:text-white transition-colors duration-300"
                    style={{ fontFamily: '"GT Pressura Mono", monospace' }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-y-[0px]">
              {[
                { label: 'GITHUB', href: 'https://github.com/KalashMaheshwari' },
                { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/kalash-maheshwari-7143b0372/' },
                { label: 'INSTAGRAM', href: 'https://www.instagram.com/klshmatlab/' },
                { label: 'LEGAL', href: '#legal' }
              ].map(({ label, href }) => (
                <li key={label} className="footer-menu-item shrink-0 leading-[1.1]">
                  <a href={href}
                    target="_blank" rel="noopener noreferrer"
                    aria-label={`Visit my ${label} page`}
                    className="text-[10.5px] xl:text-[11px] uppercase tracking-widest hover:text-white transition-colors duration-300"
                    style={{ fontFamily: '"GT Pressura Mono", monospace' }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT COLUMN: Manifesto Text rigidly mapped to col-start-8 to shift it slightly more to the right */}
          <div className="col-span-12 lg:col-start-8 lg:col-span-5 flex flex-col text-[10.5px] xl:text-[11px] uppercase tracking-widest text-[#d4d4d4] text-left gap-y-[32px]" style={{ fontFamily: '"GT Pressura Mono", monospace' }}>
            <p className="footer-menu-item leading-[1.4]">
              I AM A CREATIVE DEVELOPER BASED IN NEW DELHI.
            </p>

            <p className="footer-menu-item leading-[1.4]">
              BIG PROJECT? CRAZY THOUGHT? OR JUST FEEL LIKE CHATTING?
            </p>

            <p className="footer-menu-item text-white cursor-pointer hover:text-white/50 transition-colors leading-[1.4]">
              LET'S TALK!
            </p>

            <a href="mailto:maheshwarikalash@outlook.com" className="footer-menu-item block hover:text-white transition-colors duration-300 leading-[1.4]">
              MAHESHWARIKALASH@OUTLOOK.COM
            </a>

            <div className="flex flex-col gap-y-[2px] pt-4">
              <p className="footer-menu-item leading-[1.4]">COPYRIGHT {new Date().getFullYear()}</p>
              <p className="footer-menu-item leading-[1.4]">KALASH MAHESHWARI</p>
            </div>
          </div>

        </div>

      </div>

      {/* ROW 4: ═══ KALASH SIGNATURE — MATHEMATICAL VIEWPORT CLAMP ═══ */}
      <div
        ref={signatureRef}
        className="relative flex flex-col w-[85vw] mx-auto"
      >
        <div
          className="relative flex items-center justify-center w-full overflow-hidden min-h-[200px] md:min-h-[400px] h-[45vh]"
        >
          <div
            ref={signatureTextRef}
            className="w-full h-full pointer-events-auto max-md:hidden"
            style={{ transformOrigin: 'top center', willChange: 'transform' }}
          >
            <TextPressure
              text="KALASH!"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={false}
              textColor="#FFFFFF"
              scale={true}
            />
          </div>
          <div className="hidden max-md:flex w-full h-full items-center justify-center pointer-events-auto">
            <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '20vw', color: 'white', lineHeight: 1 }}>KALASH!</span>
          </div>
        </div>

        {/* ═══ BOTTOM THIN STRIP ═══ */}
        <div className="w-full pt-1 pb-4 flex flex-col md:flex-row justify-between items-center text-white uppercase text-[8px] md:text-[10px] tracking-[0.1em] font-mono opacity-50 space-y-2 md:space-y-0">
          <div className="md:pl-10">I CRAFT BOLD DESIGN & HIGH PERFORMANCE.</div>
          <div className="md:pr-10">NEW DELHI, IN &nbsp; {time}</div>
        </div>
      </div>

    </footer>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimate } from 'motion/react';

/**
 * Premium Navigation Menu — Swiss Style, Neue Montreal
 * Fixed Top-Right. Icon snaps to white, expands L-Shape, then content reveals.
 */

const NAV_LINKS = [
  { name: 'Home', href: '#landing', sectionId: 'landing' },
  { name: 'Works', href: '#playground', sectionId: 'playground' },
  { name: 'Skills', href: '#skills', sectionId: 'skills' },
  { name: 'Approach', href: '#manifesto', sectionId: 'manifesto' },
  { name: 'Book a call', href: '#cta', sectionId: 'cta' }
];

const SOCIAL_LINKS = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/kalash-maheshwari-7143b0372/' },
  { name: 'WhatsApp', href: 'https://wa.me/919818874886' },
  { name: 'GitHub', href: 'https://github.com/KalashMaheshwari' }
];

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.03
    }
  },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: PREMIUM_EASE }
  },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};

export default function Navigation() {
  const [scope, animate] = useAnimate();
  const iconRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeout = useRef<NodeJS.Timeout | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [dotPhase, setDotPhase] = useState<'idle' | 'dimming' | 'plus' | 'cross' | 'reset'>('idle');

  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  // --- Active Section Observer ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );

    NAV_LINKS.forEach((link) => {
      const el = document.getElementById(link.sectionId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // --- Dot Animation Logic ---
  const getDotProps = (i: number) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const delay = (row + col) * 0.04; // Diagonal TL->BR wave

    const baseTransition = { type: 'tween' as const, duration: 0.2, ease: PREMIUM_EASE, delay };

    switch (dotPhase) {
      case 'idle':
        return { opacity: 1, transition: { ...baseTransition, delay: 0 } };
      case 'dimming':
        return { opacity: 0.2, transition: baseTransition };
      case 'plus':
        return { opacity: [1, 3, 4, 5, 7].includes(i) ? 1 : 0.2, transition: baseTransition };
      case 'cross':
        return { opacity: [0, 2, 4, 6, 8].includes(i) ? 1 : 0.2, transition: baseTransition };
      case 'reset':
        return { opacity: 1, transition: baseTransition };
      default:
        return { opacity: 1, transition: { duration: 0.2 } };
    }
  };

  // --- Animation Handlers ---
  const openMenu = useCallback(async () => {
    if (isOpen) return;
    setDotPhase('cross');
    setIsOpen(true);
    await new Promise(r => setTimeout(r, 50));

    const targetWidth = Math.min(335, window.innerWidth - 32);
    await animate(scope.current, { width: targetWidth, height: 56 }, { duration: 0.3, ease: PREMIUM_EASE });
    await animate(scope.current, { height: 422 }, { duration: 0.3, ease: PREMIUM_EASE });

    setShowContent(true);
  }, [isOpen, animate, scope]);

  const closeMenu = useCallback(async () => {
    if (!isOpen) return;
    setShowContent(false);
    setDotPhase('reset');
    await new Promise(r => setTimeout(r, 100));

    await animate(scope.current, { height: 56 }, { duration: 0.25, ease: PREMIUM_EASE });

    // Continuous width collapse (zero jitter)
    const widthAnim = animate(scope.current, { width: 56 }, { duration: 0.25, ease: PREMIUM_EASE });

    // Halfway through: smoothly swap colors via DOM to bypass React reconciliation lag
    await new Promise(r => setTimeout(r, 125));
    if (iconRef.current) {
      iconRef.current.classList.remove('bg-white');
      iconRef.current.classList.add('bg-zinc-900');
    }
    if (dotsRef.current) {
      dotsRef.current.querySelectorAll('.dot').forEach((dot) => {
        dot.classList.remove('bg-zinc-900');
        dot.classList.add('bg-white');
      });
    }

    await widthAnim;
    setIsOpen(false);
    phaseTimeout.current = setTimeout(() => setDotPhase('idle'), 300);
  }, [isOpen, animate, scope]);

  const handleToggle = () => isOpen ? closeMenu() : openMenu();

  const handleMouseEnter = () => {
    if (isOpen) return;
    setDotPhase('dimming');
    hoverTimeout.current = setTimeout(() => setDotPhase('plus'), 250);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (!isOpen) {
      setDotPhase('reset');
      phaseTimeout.current = setTimeout(() => setDotPhase('idle'), 300);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={scope}
        className={`fixed top-6 right-6 z-50 rounded-[20px] overflow-hidden ${isOpen ? 'bg-white' : ''} max-md:top-4 max-md:right-4`}
        style={{ width: 56, height: 56 }}
      >
        <button
          ref={iconRef as any}
          className={`absolute top-0 right-0 w-14 h-14 rounded-[20px] z-10 flex items-center justify-center cursor-pointer transition-colors duration-200 border-none outline-none ${isOpen ? 'bg-white' : 'bg-zinc-900'}`}
          onClick={handleToggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <div ref={dotsRef} className="grid grid-cols-3 gap-1 pointer-events-none" style={{ width: '26px' }}>
            {Array.from({ length: 9 }).map((_, i) => {
              const dotAnim = getDotProps(i);
              return (
                <motion.div
                  key={i}
                  className={`dot w-1.5 h-1.5 rounded-full transition-colors duration-200 ${isOpen ? 'bg-zinc-900' : 'bg-white'}`}
                  animate={{ opacity: dotAnim.opacity }}
                  transition={dotAnim.transition}
                />
              );
            })}
          </div>
        </button>

        <AnimatePresence>
          {showContent && (
            <motion.div
              className="absolute inset-0 flex flex-col bg-white"
              style={{
                fontFamily: "var(--font-neue)",
                padding: "42px 20px 32px 20px",
                width: '100%',
                height: 422
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex flex-col h-full">
                <nav className="flex flex-col gap-y-0">
                  {NAV_LINKS.map((link) => {
                    const isCurrent = activeSection === link.sectionId;
                    const isDimmed = hoveredLink !== null && hoveredLink !== link.name;

                    return (
                      <motion.a
                        key={link.name}
                        href={isCurrent ? undefined : link.href}
                        onMouseEnter={() => setHoveredLink(link.name)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className={`block w-fit text-[22px] font-medium tracking-[-0.02em] leading-[1.3] transition-colors duration-100 ${isCurrent ? 'text-black/20 cursor-default' : isDimmed ? 'text-black/25' : 'text-black'}`}
                        variants={itemVariants}
                        onClick={isCurrent ? undefined : closeMenu}
                      >
                        {link.name}
                      </motion.a>
                    );
                  })}
                </nav>

                {/* STRICT MARGIN: 32px above and below separator */}
                <motion.div
                  className="w-full h-[1px] bg-black/5"
                  style={{ marginTop: 32, marginBottom: 32 }}
                  variants={itemVariants}
                />

                <div className="mt-auto">
                  <motion.p
                    className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/25 mb-4"
                    variants={itemVariants}
                  >
                    Resources
                  </motion.p>

                  <div className="flex flex-col gap-y-1">
                    {SOCIAL_LINKS.map((link) => {
                      const isDimmed = hoveredSocial !== null && hoveredSocial !== link.name;

                      return (
                        <motion.a
                          key={link.name}
                          href={link.href}
                          target="_blank" rel="noopener noreferrer"
                          onMouseEnter={() => setHoveredSocial(link.name)}
                          onMouseLeave={() => setHoveredSocial(null)}
                          className={`block w-fit text-[15px] font-medium text-black tracking-[-0.01em] transition-colors duration-100 ${isDimmed ? 'text-black/25' : 'text-black'}`}
                          variants={itemVariants}
                          onClick={closeMenu}
                          aria-label={`Visit my ${link.name}`}
                        >
                          {link.name}
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
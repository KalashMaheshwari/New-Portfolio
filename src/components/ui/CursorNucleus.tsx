import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const nucleusController = {
  showTag: (_text: string, _type?: 'default' | 'invert') => {},
  hideTag: (_force?: boolean) => {},
  shrink: () => {},
  restore: () => {},
  // Keep these for any other component that might use them
  showImage: (_url: string) => {},
  hideImage: () => {},
};

export { nucleusController };

export default function CursorNucleus() {
  const ballRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const subTextRef = useRef<HTMLSpanElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const isSkillsSection = useRef(false);

  useEffect(() => {
    const ball = ballRef.current;
    if (!ball) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const updatePosition = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.2;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.2;

      gsap.set(ball, {
        x: pos.current.x + 10,
        y: pos.current.y + 10,
        force3D: true,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    gsap.ticker.add(updatePosition);

    // ── Skills Section Detection ──
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isSkillsSection.current = entry.isIntersecting;
          if (ball && !tagHoverCount && !isShrunk) {
            gsap.to(ball, {
              backgroundColor: entry.isIntersecting ? '#000' : '#fff',
              duration: 0.4,
              ease: 'power2.out',
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    const skillsSection = document.getElementById('skills');
    if (skillsSection) skillsObserver.observe(skillsSection);

    let tagHoverCount = 0;
    let isShrunk = false;

    /* ── Morph INTO tag ── */
    nucleusController.showTag = (text: string, type: 'default' | 'invert' = 'default') => {
      tagHoverCount++;
      if (!textRef.current || !ball || !subTextRef.current) return;

      gsap.killTweensOf(ball);
      gsap.killTweensOf([textRef.current, subTextRef.current]);

      textRef.current.textContent = text;
      
      // Dynamic colors
      const bgColor = type === 'invert' ? '#000' : '#fff';
      const textColor = type === 'invert' ? '#fff' : '#000';
      const subTextColor = type === 'invert' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

      const currentW = ball.offsetWidth;
      const currentH = ball.offsetHeight;

      gsap.set(ball, {
        visibility: 'hidden',
        width: 'auto',
        height: 'auto',
        padding: '12px 24px',
        borderRadius: '24px 8px 24px 8px',
        border: 'none',
        background: bgColor,
      });
      const targetW = ball.offsetWidth;
      const targetH = ball.offsetHeight;
      gsap.set(ball, {
        visibility: 'visible',
        width: currentW,
        height: currentH,
      });

      gsap.to(ball, {
        width: targetW,
        height: targetH,
        padding: '12px 24px',
        borderRadius: '24px 8px 24px 8px',
        background: bgColor,
        boxShadow: type === 'invert' ? '0 20px 60px rgba(255,255,255,0.1)' : '0 20px 60px rgba(0,0,0,0.4)',
        border: 'none',
        duration: 0.5,
        ease: 'back.out(1.2)',
      });

      gsap.to(textRef.current, {
        opacity: 1,
        color: textColor,
        duration: 0.3,
        delay: 0.15,
      });
      gsap.to(subTextRef.current, {
        opacity: 1,
        color: subTextColor,
        duration: 0.3,
        delay: 0.2,
      });
    };

    /* ── Morph BACK to dot from tag ── */
    nucleusController.hideTag = (force = false) => {
      if (force) {
        tagHoverCount = 0;
      } else {
        tagHoverCount = Math.max(0, tagHoverCount - 1);
      }
      
      if (tagHoverCount > 0 || !ball || !textRef.current || !subTextRef.current) return;

      gsap.killTweensOf(ball);
      gsap.killTweensOf([textRef.current, subTextRef.current]);

      gsap.to([textRef.current, subTextRef.current], { opacity: 0, duration: 0.1 });

      gsap.to(ball, {
        width: 10,
        height: 10,
        padding: 0,
        borderRadius: '50%',
        background: isSkillsSection.current ? '#000' : '#fff',
        boxShadow: 'none',
        border: 'none',
        duration: 0.3,
        ease: 'power2.inOut',
        delay: 0,
      });
    };

    /* ── Shrink ball away (manifesto hover enter) ── */
    nucleusController.shrink = () => {
      if (!ball || isShrunk) return;
      isShrunk = true;

      gsap.killTweensOf(ball);
      gsap.to(ball, {
        width: 0,
        height: 0,
        padding: 0,
        borderRadius: '50%',
        boxShadow: 'none',
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
      });
    };

    /* ── Restore ball back (manifesto hover leave) ── */
    nucleusController.restore = () => {
      if (!ball) return;
      isShrunk = false;

      gsap.killTweensOf(ball);
      gsap.to(ball, {
        width: 10,
        height: 10,
        padding: 0,
        borderRadius: '50%',
        background: isSkillsSection.current ? '#000' : '#fff',
        boxShadow: 'none',
        border: 'none',
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.5)',
        delay: 0,
      });
    };

    /* ── Legacy no-ops (other components may call these) ── */
    nucleusController.showImage = () => {};
    nucleusController.hideImage = () => {};

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(updatePosition);
      skillsObserver.disconnect();
      nucleusController.showTag = () => {};
      nucleusController.hideTag = () => {};
      nucleusController.shrink = () => {};
      nucleusController.restore = () => {};
      nucleusController.showImage = () => {};
      nucleusController.hideImage = () => {};
    };
  }, []);

  return (
    <div
      ref={ballRef}
      className="fixed top-0 left-0 pointer-events-none z-[10000]"
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: 'none',
        willChange: 'transform',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        justifyContent: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <span
        ref={textRef}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.9rem',
          fontWeight: 'var(--heading-weight)' as any,
          letterSpacing: '-0.01em',
          color: '#000',
          whiteSpace: 'nowrap',
          opacity: 0,
        }}
      />
      <span
        ref={subTextRef}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '7px',
          fontWeight: 400,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.6)',
          whiteSpace: 'nowrap',
          opacity: 0,
        }}
      >
        View Project →
      </span>
    </div>
  );
}
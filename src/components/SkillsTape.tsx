import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Capabilities Data ─── */
const CAPS = [
  { name: 'STRATEGY' },
  { name: 'IDENTITY' },
  { name: 'DIGITAL' },
  { name: 'MOTION' },
  { name: 'CODE' },
  { name: 'EXPERIENCE' },
];

const COPIES = 8;

/* ─── Track Component ─── */
function RibbonTrack({
  caps,
  trackRef,
  wrapperRef,
  type,
}: {
  caps: typeof CAPS;
  trackRef: React.RefObject<HTMLDivElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  type: 'dark' | 'light';
}) {
  const items = Array(COPIES).fill(caps).flat();

  const styles = type === 'dark' 
    ? {
        bg: '#1A1A1A',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        borderBottom: '2px solid rgba(0, 0, 0, 0.9)',
        shadow: '0 25px 35px rgba(0, 0, 0, 0.35), 0 4px 10px rgba(0,0,0,0.4)',
        text: 'rgba(255, 255, 255, 0.18)',
        sep: 'rgba(255, 255, 255, 0.06)',
      }
    : {
        bg: '#EFECE7',
        borderTop: '1px solid rgba(255, 255, 255, 1)',
        borderBottom: '2px solid rgba(0, 0, 0, 0.15)',
        shadow: '0 -25px 35px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.08)',
        text: 'rgba(0, 0, 0, 0.10)',
        sep: 'rgba(0, 0, 0, 0.05)',
      };

  return (
    <div
      ref={wrapperRef}
      className="ribbon-wrapper"
      style={{
        position: 'relative',
        width: '200vw',
        marginLeft: '-50vw',
        cursor: 'default',
        background: styles.bg,
        padding: '1.2rem 0',
        boxShadow: styles.shadow,
        borderTop: styles.borderTop,
        borderBottom: styles.borderBottom,
        zIndex: type === 'dark' ? 2 : 1,
      }}
    >
      <div
        ref={trackRef}
        className="ribbon-track"
        style={{
          display: 'flex',
          width: 'max-content',
          willChange: 'transform',
        }}
      >
        {items.map((cap, i) => (
          <div
            key={`${cap.name}-${i}`}
            className="cap-item"
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              className="cap-name"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 2vw, 5.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: styles.text,
                textTransform: 'uppercase',
              }}
            >
              {cap.name}
            </span>
            <span
              className="cap-sep"
              style={{
                display: 'inline-block',
                width: '2px',
                height: '1.2em',
                background: styles.sep,
                margin: '0 clamp(1.5rem, 3.5vw, 3rem)',
                verticalAlign: 'middle',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Section ─── */
export default function CapabilitiesRibbon() {
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const wrapper1Ref = useRef<HTMLDivElement>(null);
  const wrapper2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track1 = track1Ref.current;
    const track2 = track2Ref.current;
    if (!track1 || !track2) return;

    // --- TUNING PARAMS ---
    const baseSpeed1 = 1.2;     // Constant crawl speed (positive)
    const baseSpeed2 = -1.0;    // Constant crawl speed (negative)
    const inertiaPower = 0.002; // Lowered significantly (from 0.008) to prevent "flying"
    const inertiaDecay = 0.92;  // How fast it returns to base (lower = faster return)

    let x1 = 0;
    let x2 = 0;
    let scrollInertia = 0;
    let wrapWidth1 = 0;
    let wrapWidth2 = 0;

    const calculateWidths = () => {
      if (track1 && track2) {
        wrapWidth1 = track1.scrollWidth / COPIES;
        wrapWidth2 = track2.scrollWidth / COPIES;
      }
    };

    const ro = new ResizeObserver(calculateWidths);
    ro.observe(track1);
    ro.observe(track2);
    calculateWidths();

    const stProxy = ScrollTrigger.create({
      onUpdate: (self) => {
        // Accumulate a small portion of the vertical velocity
        scrollInertia += self.getVelocity() * inertiaPower;
      }
    });

    const update = () => {
      // Return to 0 inertia over time
      scrollInertia *= inertiaDecay;

      if (wrapWidth1 > 0) {
        x1 += baseSpeed1 + scrollInertia;
        x1 = ((x1 % wrapWidth1) + wrapWidth1) % wrapWidth1;
        gsap.set(track1, { x: -x1, force3D: true });
      }

      if (wrapWidth2 > 0) {
        // Ribbon 2 moves opposite and responds slightly differently
        x2 += baseSpeed2 + (scrollInertia * 0.8);
        x2 = ((x2 % wrapWidth2) + wrapWidth2) % wrapWidth2;
        gsap.set(track2, { x: -x2, force3D: true });
      }
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      stProxy.kill();
      ro.disconnect();
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'transparent',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        zIndex: 50,
      }}
    >
      <div className="flex flex-col gap-8 relative z-10">
        <div style={{ transform: 'rotate(-2.5deg)' }}>
          <RibbonTrack
            caps={CAPS}
            trackRef={track1Ref}
            wrapperRef={wrapper1Ref}
            type="dark"
          />
        </div>

        <div style={{ transform: 'rotate(1.8deg)' }}>
          <RibbonTrack
            caps={CAPS}
            trackRef={track2Ref}
            wrapperRef={wrapper2Ref}
            type="light"
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ribbon-wrapper { padding: 0.8rem 0 !important; }
        }
      `}</style>
    </section>
  );
}
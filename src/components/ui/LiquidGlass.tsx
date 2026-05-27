import React, { type ReactNode } from 'react';

interface LiquidGlassProps {
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
    containerClassName?: string;
}

/**
 * LiquidGlass — Premium Whitish Glassmorphism
 * A clean, high-performance glass component with an iOS-style whitish translucent finish.
 */
export const LiquidGlass: React.FC<LiquidGlassProps> = ({
    children,
    onClick,
    className = '',
    containerClassName = '',
}) => {
    return (
        <div className={`relative inline-block ${containerClassName}`}>
            {/* 1. Luminous Ambient Shadow */}
            <div className="absolute inset-0 bg-white/[0.05] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            {/* 2. Main Button Body */}
            <button
                onClick={onClick}
                className={`
                    relative flex items-center justify-center gap-4 
                    px-10 py-5
                    bg-black/[0.45] 
                    backdrop-blur-[10px] backdrop-saturate-[120%] backdrop-brightness-[0.8]
                    border border-white/10 rounded-full
                    text-white font-medium
                    transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    hover:bg-black/[0.65] hover:border-white/20
                    hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)]
                    active:scale-[0.97]
                    overflow-hidden
                    ${className}
                `}
            >
                {/* 3. Surface Light Catchers (Gradients) */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-50 pointer-events-none" />

                {/* 4. Top Rim Highlight */}
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70" />

                {/* 5. The "Light Sweep" Animation */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent -translate-x-full group-hover:animate-[sweep_3s_ease-in-out_infinite]" />
                </div>

                {/* 6. Subtle Frosted Grain */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
                />

                {/* 7. Content Container */}
                <div className="relative z-10 w-full h-full flex items-center justify-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                    {children}
                </div>
            </button>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes sweep {
                    0% { transform: translateX(-100%) rotate(30deg); }
                    100% { transform: translateX(200%) rotate(30deg); }
                }
            `}} />
        </div>
    );
};

export default LiquidGlass;
import React from 'react';

export interface LogoProps {
    className?: string;
    textClassName?: string;
    showWordmark?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const LogoMark: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
    size = 'md',
    className = '',
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8 rounded-lg',
        md: 'w-10 h-10 rounded-xl',
        lg: 'w-12 h-12 rounded-2xl',
    };

    return (
        <div
            className={`relative shrink-0 flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700/60 shadow-sm transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-md group-hover:shadow-blue-500/15 group-hover:border-slate-600 ${sizeClasses[size]} ${className}`}
        >
            <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full p-1.5 transition-transform duration-300"
            >
                {/* Hairline geometric background frame */}
                <rect
                    x="2"
                    y="2"
                    width="60"
                    height="60"
                    rx="14"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                />

                {/* Monogram PR Geometry */}
                <g
                    stroke="#ffffff"
                    strokeWidth="5.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-colors duration-300"
                >
                    {/* Letter P */}
                    <path d="M 17 17.5 L 17 46.5" />
                    <path d="M 17 17.5 L 24.5 17.5 C 29.5 17.5 32.5 20.5 32.5 25 C 32.5 29.5 29.5 32.5 24.5 32.5 L 17 32.5" />

                    {/* Letter R */}
                    <path d="M 35 17.5 L 35 46.5" />
                    <path d="M 35 17.5 L 42.5 17.5 C 47 17.5 50 20.5 50 25 C 50 29.5 47 32.5 42.5 32.5 L 35 32.5" />
                    <path d="M 41.5 32.5 L 50 46.5" />
                </g>

                {/* Royal Cobalt Status Node */}
                <circle
                    cx="50"
                    cy="17.5"
                    r="3.2"
                    fill="#2563eb"
                    className="transition-transform duration-300 group-hover:scale-125 origin-[50px_17.5px]"
                />
                <circle
                    cx="50"
                    cy="17.5"
                    r="1.4"
                    fill="#ffffff"
                    opacity="0.9"
                />
            </svg>
        </div>
    );
};

const Logo: React.FC<LogoProps> = ({
    className = '',
    textClassName = '',
    showWordmark = true,
    size = 'md',
}) => {
    return (
        <div className={`flex items-center gap-3 cursor-pointer group select-none ${className}`}>
            {/* Architectural Vector Emblem */}
            <LogoMark size={size} />

            {/* Editorial Wordmark */}
            {showWordmark && (
                <div className={`flex flex-col text-left ${textClassName}`}>
                    <div className="flex items-center gap-1.5">
                        <span className="font-sans font-bold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                            Purushothaman
                        </span>
                        <span className="font-sans font-bold text-sm sm:text-base text-slate-400 group-hover:text-slate-600 transition-colors duration-200">
                            R
                        </span>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                    </div>
                    <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-medium -mt-0.5">
                        Full Stack Developer
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;

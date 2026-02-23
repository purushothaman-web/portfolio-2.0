import React from 'react';

interface LogoProps {
    className?: string;
    textClassName?: string;
    text?: string;
}

const Logo: React.FC<LogoProps> = ({ className, textClassName, text = "Purushothaman R" }) => {
    return (
        <div className={`flex items-center gap-3 cursor-pointer group ${className || ''}`}>
            {/* Editorial Monogram */}
            <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-[#1d3557] rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#e63946] transition-colors duration-300">
                    <span
                        className="text-white font-sans font-bold text-sm tracking-wide select-none"
                        style={{ letterSpacing: '0.05em' }}
                    >
                        PR
                    </span>
                </div>
            </div>

            {/* Optional Text Label */}
            {textClassName && (
                <span className={`font-sans font-semibold tracking-tight ${textClassName}`}>
                    {text}
                </span>
            )}
        </div>
    );
};

export default Logo;

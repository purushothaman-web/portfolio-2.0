import React from 'react';

interface LogoProps {
    className?: string;
    textClassName?: string;
    text?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8", textClassName, text = "Purushothaman R" }) => {
    return (
        <div className="flex items-center gap-2 group cursor-pointer">
            {/* Geometric SVG Icon */}
            <svg
                viewBox="0 0 100 100"
                className={`${className} fill-current text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M50 5 L95 27.5 L95 72.5 L50 95 L5 72.5 L5 27.5 Z" stroke="currentColor" strokeWidth="8" fill="none" />
                <text
                    x="50"
                    y="62"
                    fontFamily="monospace"
                    fontSize="40"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="currentColor"
                    className="select-none"
                >
                    PR
                </text>
            </svg>

            {/* Optional Text Label */}
            {textClassName && (
                <span className={`font-bold tracking-tight ${textClassName}`}>
                    {text}
                </span>
            )}
        </div>
    );
};

export default Logo;

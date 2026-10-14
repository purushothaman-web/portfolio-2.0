import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { scrollToSection } from '../../utils/scrollToSection';

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 280) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        try {
            scrollToSection('hero');
        } catch {
            // fallback handled
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5"
                >
                    {/* Tooltip on hover */}
                    <span className="pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 px-3 py-1.5 text-[11px] font-sans font-semibold tracking-wide text-slate-700 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-lg shadow-md">
                        Back to top
                    </span>

                    {/* Circular Action Button with SVG Progress Ring (Stationary - No Lift) */}
                    <motion.button
                        onClick={scrollToTop}
                        whileTap={{ y: 0.5 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                        className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.08)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.2)] hover:border-blue-500/50 text-slate-700 hover:text-blue-600 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        aria-label="Back to top"
                    >
                        {/* Radiant pulse halo on hover */}
                        <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-300" />

                        {/* SVG Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 48 48">
                            {/* Track */}
                            <circle
                                cx="24"
                                cy="24"
                                r="20"
                                className="stroke-slate-200/80"
                                strokeWidth="2.5"
                                fill="none"
                            />
                            {/* Progress indicator */}
                            <motion.circle
                                cx="24"
                                cy="24"
                                r="20"
                                className="stroke-blue-600 transition-colors"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                fill="none"
                                style={{ pathLength: smoothProgress }}
                            />
                        </svg>

                        {/* Kinetic Warp / Elevator Arrow Loop (Stationary Button, Infinite-like elevator icon pass) */}
                        <div className="relative w-5 h-5 overflow-hidden flex items-center justify-center pointer-events-none">
                            {/* Primary arrow: slides up and out */}
                            <ArrowUp
                                size={18}
                                strokeWidth={2.3}
                                className="absolute transition-transform duration-300 ease-out group-hover:-translate-y-6"
                            />
                            {/* Secondary arrow: slides in from bottom into place */}
                            <ArrowUp
                                size={18}
                                strokeWidth={2.3}
                                className="absolute translate-y-6 transition-transform duration-300 ease-out group-hover:translate-y-0 text-blue-600"
                            />
                        </div>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

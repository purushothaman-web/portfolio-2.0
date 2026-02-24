import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            setIsLoading(false);
        };

        if (document.readyState === 'complete') {
            setTimeout(() => setIsLoading(false), 0);
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => window.removeEventListener('load', handleLoad);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fff9ed]"
                >
                    <div className="flex flex-col items-center gap-6">
                        {/* Top elegant line */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 100 }}
                            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                            className="h-[1px] bg-[#1d3557] opacity-60"
                        />
                        
                        {/* Wide-tracked typographic text */}
                        <motion.span 
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-xs font-sans tracking-[0.4em] text-[#1d3557] uppercase ml-1"
                        >
                            Loading
                        </motion.span>
                        
                        {/* Bottom elegant line with slight delay for wave effect */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 100 }}
                            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                            className="h-[1px] bg-[#1d3557] opacity-60"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

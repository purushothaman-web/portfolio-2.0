import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Hide loading screen when page is fully loaded
        const handleLoad = () => {
            setIsLoading(false);
        };

        // If already loaded, hide immediately
        if (document.readyState === 'complete') {
            setIsLoading(false);
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
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
                >
                    <div className="flex items-center gap-3 font-mono text-green-400">
                        {/* Blinking cursor */}
                        <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="text-green-500 text-xl"
                        >
                            ▸
                        </motion.span>
                        
                        {/* Loading text */}
                        <span className="text-sm md:text-base">
                            Loading...
                        </span>
                        
                        {/* Blinking cursor */}
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="inline-block w-2 h-4 bg-green-400"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

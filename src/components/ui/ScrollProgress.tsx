import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2.5px] bg-linear-to-r from-blue-600 via-indigo-600 to-emerald-500 z-70 origin-left shadow-[0_1px_8px_rgba(37,99,235,0.35)]"
            style={{ scaleX }}
            aria-hidden="true"
        />
    );
}

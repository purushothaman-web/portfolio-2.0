import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
    const [dimension, setDimension] = useState({ width: 0, height: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    // Track window dimensions for SVG curve calculation
    useEffect(() => {
        const updateDimension = () => {
            setDimension({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        updateDimension();
        window.addEventListener('resize', updateDimension);
        return () => window.removeEventListener('resize', updateDimension);
    }, []);

    // Prevent background scrolling while loading
    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isLoading]);

    // Hold the cube motion for ~1.5s then trigger the 3D expansion and liquid arch exit
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null;

    // SVG Liquid Curve coordinates
    const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
    const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

    const easeCurve: [number, number, number, number] = [0.76, 0, 0.24, 1];

    const curveVariants = {
        initial: {
            d: initialPath,
            transition: { duration: 0.8, ease: easeCurve }
        },
        exit: {
            d: targetPath,
            transition: { duration: 0.8, ease: easeCurve, delay: 0.22 }
        }
    };

    const slideUpVariants = {
        initial: {
            top: 0
        },
        exit: {
            top: '-100vh',
            transition: { duration: 0.9, ease: easeCurve, delay: 0.18 }
        }
    };

    // 6 Faces of outer cube (100px wide, 50px radius)
    const cubeFaces = [
        { transform: 'translateZ(50px)', border: 'border-blue-500/70', bg: 'bg-blue-500/[0.04]' },
        { transform: 'rotateY(180deg) translateZ(50px)', border: 'border-blue-500/50', bg: 'bg-blue-500/[0.03]' },
        { transform: 'rotateY(90deg) translateZ(50px)', border: 'border-indigo-500/70', bg: 'bg-indigo-500/[0.04]' },
        { transform: 'rotateY(-90deg) translateZ(50px)', border: 'border-indigo-500/50', bg: 'bg-indigo-500/[0.03]' },
        { transform: 'rotateX(90deg) translateZ(50px)', border: 'border-cyan-400/80', bg: 'bg-cyan-500/[0.06]' },
        { transform: 'rotateX(-90deg) translateZ(50px)', border: 'border-blue-600/40', bg: 'bg-blue-600/[0.02]' },
    ];

    // 6 Faces of nested inner core (44px wide, 22px radius)
    const innerFaces = [
        { transform: 'translateZ(22px)' },
        { transform: 'rotateY(180deg) translateZ(22px)' },
        { transform: 'rotateY(90deg) translateZ(22px)' },
        { transform: 'rotateY(-90deg) translateZ(22px)' },
        { transform: 'rotateX(90deg) translateZ(22px)' },
        { transform: 'rotateX(-90deg) translateZ(22px)' },
    ];

    return (
        <motion.div
            variants={slideUpVariants}
            initial="initial"
            animate={isExiting ? 'exit' : 'initial'}
            onAnimationComplete={() => {
                if (isExiting) {
                    setIsLoading(false);
                }
            }}
            className="fixed inset-0 z-99999 h-screen w-screen flex items-center justify-center bg-[#0d111c] select-none pointer-events-none"
        >
            {/* Ambient Radial Spotlight */}
            <div className="absolute w-125 h-125 rounded-full bg-blue-600/10 blur-[110px] pointer-events-none" />

            {/* Central Isometric 3D Viewport */}
            <AnimatePresence>
                {!isExiting && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                            opacity: 0,
                            scale: 1.6,
                            transition: { duration: 0.35, ease: 'easeOut' }
                        }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 flex flex-col items-center justify-center perspective-[1000px]"
                    >
                        {/* Outer 3D Rotating Isometric Wireframe Cube */}
                        <motion.div
                            animate={{
                                rotateX: [25, 60, 25],
                                rotateY: [45, 225, 405],
                                rotateZ: [0, 180, 360],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                            className="relative w-25 h-25 transform-3d"
                        >
                            {/* Outer Faces with Hairline Borders & Glowing Corner Nodes */}
                            {cubeFaces.map((face, i) => (
                                <div
                                    key={`outer-${i}`}
                                    style={{ transform: face.transform }}
                                    className={`absolute inset-0 border ${face.border} ${face.bg} backdrop-blur-[1px] flex items-center justify-center backface-visible`}
                                >
                                    {/* Glowing corner vertices */}
                                    <span className="absolute -top-1 -left-1 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
                                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
                                    <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
                                    <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />

                                    {/* Subtle internal crosshair */}
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400/40" />
                                </div>
                            ))}

                            {/* Inner Counter-Rotating Core Cube */}
                            <motion.div
                                animate={{
                                    rotateX: [0, -180, -360],
                                    rotateY: [0, -180, -360],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'linear'
                                }}
                                className="absolute top-7 left-7 w-11 h-11 transform-3d"
                            >
                                {innerFaces.map((face, i) => (
                                    <div
                                        key={`inner-${i}`}
                                        style={{ transform: face.transform }}
                                        className="absolute inset-0 border border-emerald-400/80 bg-emerald-400/10 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                                    />
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Floating Perspective Shadow Disk Underneath */}
                        <motion.div
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.35, 0.6, 0.35]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                            className="w-20 h-4 mt-12 rounded-full bg-blue-500/20 blur-md"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Liquid SVG Curve (The Dennis Snellenberg Signature Scoop) */}
            {dimension.width > 0 && (
                <svg className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none fill-[#0d111c]">
                    <motion.path
                        variants={curveVariants}
                        initial="initial"
                        animate={isExiting ? 'exit' : 'initial'}
                    />
                </svg>
            )}
        </motion.div>
    );
}

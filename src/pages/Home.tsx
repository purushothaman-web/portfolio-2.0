import { motion } from 'framer-motion';
import { ArrowRight, Github, Mail } from 'lucide-react';
import { scrollToSection } from '../utils/scrollToSection';

// Career start date: Feb 12, 2025. Increments every Feb 12.
const getYearsOfExperience = (): number => {
    const now = new Date();
    const startYear = 2025;
    const anniversaryThisYear = new Date(now.getFullYear(), 1, 12); // Feb 12 of current year
    const yearsPassed = now.getFullYear() - startYear;
    // If we haven't yet reached Feb 12 of the current year, subtract 1
    return now >= anniversaryThisYear ? yearsPassed : yearsPassed - 1;
};

export default function Home() {
    return (
        <div id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-transparent pt-32 pb-20">

            <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">

                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-10 text-center lg:text-left">
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full border border-black/10 bg-white shadow-sm text-xs font-sans tracking-widest uppercase font-semibold text-gray-600"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#e63946] animate-pulse"></span>
                        <span>Purushothaman R &mdash; Full Stack Developer</span>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight text-[#1d3557] font-sans leading-[1.1]"
                        >
                            Developing the <span className="text-[#e63946] italic pr-2">hidden logic</span> <br className="hidden md:block" />
                            that powers seamless experiences.
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-2xl mx-auto lg:mx-0 space-y-4 text-lg text-gray-600 leading-relaxed font-sans"
                    >
                        <p>
                            I began my career crafting pixel-perfect interfaces as a frontend developer. However, the deeper I dug into how web applications functioned, the more fascinated I became by the architecture beneath the surface.
                        </p>
                        <p>
                            Today, I specialize in designing scalable backend infrastructures, reliable databases, and robust APIs—bridging the gap between strict server logic and premium client interfaces.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
                    >
                        <button
                            onClick={() => scrollToSection('projects')}
                            className="group px-8 py-3.5 bg-[#1d3557] text-white rounded-xl font-sans font-semibold tracking-wide transition-all hover:bg-[#112240] hover:shadow-lg flex items-center space-x-3"
                        >
                            <span>Read Case Studies</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => scrollToSection('contact')}
                            className="px-8 py-3.5 bg-white text-[#1d3557] rounded-xl font-sans font-medium transition-all editorial-border flex items-center space-x-3 hover:bg-gray-50 hover:shadow-sm"
                        >
                            <Mail size={18} />
                            <span>Get in Touch</span>
                        </button>
                    </motion.div>

                </div>

                {/* Right Column: Highlight Card */}
                <div className="hidden lg:flex lg:col-span-4 flex-col justify-center relative w-full h-full min-h-[400px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="relative w-full bg-white editorial-card rounded-2xl overflow-hidden flex flex-col z-10"
                    >
                        {/* Card Top Stripe */}
                        <div className="h-1 w-full bg-gradient-to-r from-[#1d3557] to-[#e63946]"></div>

                        <div className="p-8 flex flex-col gap-8">
                            {/* Stat Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-[#fff9ed] rounded-xl">
                                    <div className="text-2xl font-bold text-[#1d3557]">3+</div>
                                    <div className="text-xs text-gray-500 font-sans mt-1 leading-tight">Full-stack Projects Shipped</div>
                                </div>
                                <div className="p-4 bg-[#fff9ed] rounded-xl">
                                    <div className="text-2xl font-bold text-[#1d3557]">{getYearsOfExperience()}+</div>
                                    <div className="text-xs text-gray-500 font-sans mt-1 leading-tight">Years Dev Experience</div>
                                </div>
                            </div>

                            {/* Stack Highlights */}
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Core Stack</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Node.js', 'Express', 'PostgreSQL', 'React', 'Prisma'].map(tag => (
                                        <span key={tag} className="text-xs font-sans font-medium text-[#1d3557] bg-[#fff9ed] px-3 py-1 rounded-full border border-[#1d3557]/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Quote */}
                            <p className="text-sm text-gray-500 font-sans italic leading-relaxed border-l-2 border-[#e63946] pl-4">
                                "Building systems that are resilient by design and elegant by intention."
                            </p>
                        </div>
                    </motion.div>
                    
                    {/* Decorative Background Element */}
                    <div className="absolute top-12 -right-12 w-full aspect-[3/4] border border-[#1d3557]/10 rounded-2xl -z-10"></div>
                </div>

            </div>

            {/* Sub-footer Links */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-6 flex items-center justify-between text-gray-400 font-sans text-sm"
            >
                <div className="flex items-center gap-6">
                    <a href="https://github.com/purushothaman-web" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d3557] transition-colors flex items-center gap-2">
                        <Github size={18} />
                        <span className="hidden sm:inline">GitHub Profile</span>
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <span className="tracking-widest uppercase text-xs font-semibold">Scroll to explore</span>
                    <div className="w-8 h-[1px] bg-gray-300"></div>
                </div>
            </motion.div>
        </div>
    );
}

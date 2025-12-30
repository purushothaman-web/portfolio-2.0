import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Mail, Terminal, GitBranch, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const GridBackground = () => (
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-400 opacity-20 blur-[100px] dark:bg-cyan-500/20"></div>
    </div>
);

const roles = ["Web Developer", "React Developer", "UI/UX Enthusiast"];

export default function Home() {
    const [displayText, setDisplayText] = useState("");
    const [roleIndex, setRoleIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentRole = roles[roleIndex];
        const typeSpeed = isDeleting ? 50 : 100;
        const pauseTime = 2000;

        const timer = setTimeout(() => {
            if (!isDeleting && displayText === currentRole) {
                // Finished typing, wait before deleting
                setTimeout(() => setIsDeleting(true), pauseTime);
            } else if (isDeleting && displayText === "") {
                // Finished deleting, move to next role
                setIsDeleting(false);
                setRoleIndex((prev) => (prev + 1) % roles.length);
            } else {
                // Typing or deleting
                const nextText = isDeleting
                    ? currentRole.substring(0, displayText.length - 1)
                    : currentRole.substring(0, displayText.length + 1);
                setDisplayText(nextText);
            }
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, roleIndex]);

    return (
        <div className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white dark:bg-gray-950 pt-20">
            <GridBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

                {/* Left Column: Typography & Content */}
                <div className="space-y-8 text-center lg:text-left">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-800"
                    >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Available for new projects</span>
                    </motion.div>

                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white"
                        >
                            Building digital <br />
                            <span className="text-gray-400 dark:text-gray-600">experiences.</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-400 flex items-center justify-center lg:justify-start gap-2 h-8"
                        >
                            <Terminal size={24} className="text-cyan-600 dark:text-cyan-400" />
                            <span>I am a</span>
                            <span className="text-cyan-600 dark:text-cyan-400 font-bold min-w-[10px]">
                                {displayText}
                                <span className="animate-pulse ml-1 inline-block bg-cyan-600 dark:bg-cyan-400 w-2 h-6 align-middle"></span>
                            </span>
                        </motion.div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="max-w-xl mx-auto lg:mx-0 text-lg text-gray-500 dark:text-gray-400 leading-relaxed"
                    >
                        Hi, I'm <span className="text-gray-900 dark:text-white font-semibold">Purushothaman R</span>.
                        A Web Developer based in <span className="text-gray-900 dark:text-white font-medium">India</span>.
                        I specialize in crafting high-performance applications with React, Node.js, and modern UI capabilities.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
                    >
                        <Link
                            to="/projects"
                            className="group px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-bold transition-all hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center space-x-2"
                        >
                            <span>View Projects</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            to="/contact"
                            className="px-8 py-3 bg-transparent border border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white text-gray-900 dark:text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                            <Mail size={18} />
                            <span>Contact Me</span>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-gray-400 dark:text-gray-500"
                    >
                        <a href="https://github.com/purushothaman-web" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                            <Github size={24} />
                        </a>
                        <a href="mailto:rpurushothaman500@gmail.com" className="hover:text-black dark:hover:text-white transition-colors">
                            <Mail size={24} />
                        </a>
                        {/* Added a subtle line */}
                        <div className="h-px w-12 bg-gray-200 dark:bg-gray-800"></div>
                        <span className="text-sm">Based in India</span>
                    </motion.div>

                </div>

                {/* Right Column: VS Code Style Editor */}
                <div className="hidden lg:flex items-center justify-center relative w-full perspective-1000">
                    <motion.div
                        initial={{ opacity: 0, rotateY: -10, rotateX: 5 }}
                        animate={{ opacity: 1, rotateY: 0, rotateX: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full max-w-lg bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-200 dark:border-[#333] overflow-hidden font-mono text-sm leading-6 transition-colors duration-300"
                    >
                        {/* Window Header */}
                        <div className="bg-gray-100 dark:bg-[#252526] px-4 py-3 flex items-center gap-2 border-b border-gray-200 dark:border-[#1e1e1e] transition-colors duration-300">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                            <div className="ml-4 text-gray-500 dark:text-gray-400 text-xs text-center flex-1 font-sans">developer.config.js</div>
                        </div>

                        {/* Code Content */}
                        <div className="p-6 text-gray-800 dark:text-gray-300 transition-colors duration-300">
                            <div className="flex">
                                <span className="text-gray-400 dark:text-gray-600 select-none w-8 text-right mr-4">1</span>
                                <div>
                                    <span className="text-[#0000ff] dark:text-[#569cd6]">const</span> <span className="text-[#001080] dark:text-[#4fc1ff]">developer</span> <span className="text-gray-600 dark:text-[#d4d4d4]">=</span> <span className="text-[#a80000] dark:text-[#ffd700]">{`{`}</span>
                                </div>
                            </div>
                            <div className="flex">
                                <span className="text-gray-400 dark:text-gray-600 select-none w-8 text-right mr-4">2</span>
                                <div className="pl-4">
                                    <span className="text-[#001080] dark:text-[#9cdcfe]">name</span><span className="text-[#001080] dark:text-[#9cdcfe]">:</span> <span className="text-[#a31515] dark:text-[#ce9178]">'Purushothaman R'</span><span className="text-gray-600 dark:text-[#d4d4d4]">,</span>
                                </div>
                            </div>
                            <div className="flex">
                                <span className="text-gray-400 dark:text-gray-600 select-none w-8 text-right mr-4">3</span>
                                <div className="pl-4">
                                    <span className="text-[#001080] dark:text-[#9cdcfe]">role</span><span className="text-[#001080] dark:text-[#9cdcfe]">:</span> <span className="text-[#a31515] dark:text-[#ce9178]">'Full Stack Developer'</span><span className="text-gray-600 dark:text-[#d4d4d4]">,</span>
                                </div>
                            </div>
                            <div className="flex">
                                <span className="text-gray-400 dark:text-gray-600 select-none w-8 text-right mr-4">4</span>
                                <div className="pl-4">
                                    <span className="text-[#001080] dark:text-[#9cdcfe]">skills</span><span className="text-[#001080] dark:text-[#9cdcfe]">:</span> <span className="text-[#a80000] dark:text-[#ffd700]">[</span>
                                </div>
                            </div>
                            <div className="flex">
                                <span className="text-gray-400 dark:text-gray-600 select-none w-8 text-right mr-4">5</span>
                                <div className="pl-8">
                                    <span className="text-[#a31515] dark:text-[#ce9178]">'React'</span><span className="text-gray-600 dark:text-[#d4d4d4]">,</span> <span className="text-[#a31515] dark:text-[#ce9178]">'Node.js'</span><span className="text-gray-600 dark:text-[#d4d4d4]">,</span> <span className="text-[#a31515] dark:text-[#ce9178]">'PostgreSQL'</span>
                                </div>
                            </div>
                            <div className="flex">
                                <span className="text-gray-400 dark:text-gray-600 select-none w-8 text-right mr-4">6</span>
                                <div className="pl-4">
                                    <span className="text-[#a80000] dark:text-[#ffd700]">]</span><span className="text-gray-600 dark:text-[#d4d4d4]">,</span>
                                </div>
                            </div>
                            <div className="flex">
                                <span className="text-gray-400 dark:text-gray-600 select-none w-8 text-right mr-4">7</span>
                                <div className="pl-4">
                                    <span className="text-[#001080] dark:text-[#9cdcfe]">hireable</span><span className="text-[#001080] dark:text-[#9cdcfe]">:</span> <span className="text-[#0000ff] dark:text-[#569cd6]">true</span>
                                </div>
                            </div>
                            <div className="flex">
                                <span className="text-gray-400 dark:text-gray-600 select-none w-8 text-right mr-4">8</span>
                                <div>
                                    <span className="text-[#a80000] dark:text-[#ffd700]">{`}`}</span><span className="text-gray-600 dark:text-[#d4d4d4]">;</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#007acc] text-white text-[10px] px-2 py-1 flex items-center justify-between font-sans select-none">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <GitBranch size={10} />
                                    <span>main*</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <XCircle size={10} />
                                    <span>0</span>
                                    <AlertCircle size={10} />
                                    <span>0</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span>Ln 7, Col 16</span>
                                <span>Spaces: 2</span>
                                <span>UTF-8</span>
                                <span>JavaScript</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}

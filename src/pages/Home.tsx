import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Linkedin, Github, Check, Copy, ExternalLink, Zap, Shield, Sparkles } from 'lucide-react';
import { scrollToSection } from '../utils/scrollToSection';
import InteractiveDualConsole from '../components/ui/InteractiveDualConsole';

export default function Home() {
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('rpurushothaman500@gmail.com');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    return (
        <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-white/60 pt-12 pb-12">
            {/* Subtle Architectural Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">

                    {/* Left Column: Human Story, Typography & Social Dock (7 cols) */}
                    <div className="lg:col-span-7 space-y-8 text-left">

                        {/* Top Availability Status Pill */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/70 text-[12px] font-sans font-medium text-emerald-800 shadow-2xs"
                        >
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span>Available for freelance contracts &amp; full-time roles</span>
                            <span className="text-emerald-300">·</span>
                            <span className="text-emerald-700/80 font-normal">South India (Bangalore / Chennai) &amp; Remote</span>
                        </motion.div>

                        {/* Main High-Impact Display Headline */}
                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-4xl sm:text-6xl lg:text-[4.1rem] font-bold tracking-tight text-slate-900 font-sans leading-[1.1]"
                            >
                                I build modern websites and web apps that{' '}
                                <span className="text-blue-600 underline decoration-blue-200 decoration-wavy decoration-2 underline-offset-8">
                                    look great
                                </span>{' '}
                                and{' '}
                                <span className="text-slate-900">
                                    run fast.
                                </span>
                            </motion.h1>

                            {/* Plain-Language Subtitle (Easy for anyone to understand) */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-2xl"
                            >
                                Hi, I&apos;m <strong>Purushothaman</strong> — a Full Stack Developer &amp; Freelance Software Engineer based in South India. I bridge design and engineering: creating smooth, responsive interfaces on the outside, and building secure, scalable systems on the inside.
                            </motion.p>
                        </div>

                        {/* Primary CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap items-center gap-4 pt-1"
                        >
                            <motion.button
                                id="hero-view-projects-btn"
                                onClick={() => scrollToSection('projects')}
                                whileHover={{ y: -1.5 }}
                                whileTap={{ y: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                                className="relative overflow-hidden px-6 py-3.5 bg-slate-900 text-white rounded-xl font-sans font-semibold text-sm tracking-wide transition-all shadow-[0_4px_14px_rgba(15,23,42,0.18)] hover:shadow-[0_8px_22px_rgba(15,23,42,0.28)] flex items-center space-x-2.5 cursor-pointer group before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700 before:ease-out"
                            >
                                <span>Explore Projects</span>
                                <ArrowRight size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
                            </motion.button>

                            <motion.button
                                id="hero-contact-me-btn"
                                onClick={() => scrollToSection('contact')}
                                whileHover={{ y: -1.5 }}
                                whileTap={{ y: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                                className="relative overflow-hidden px-6 py-3.5 bg-white text-slate-800 rounded-xl font-sans font-semibold text-sm transition-all border border-slate-200/90 shadow-xs hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)] flex items-center space-x-2.5 cursor-pointer group before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-linear-to-r before:from-transparent before:via-blue-500/10 before:to-transparent before:transition-transform before:duration-700 before:ease-out"
                            >
                                <Mail size={16} className="text-blue-600 transition-transform duration-200 group-hover:-rotate-12 group-hover:translate-x-0.5" />
                                <span>Get in Touch</span>
                            </motion.button>
                        </motion.div>

                        {/* Direct Social & Contact Dock (GitHub, LinkedIn, Gmail) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="pt-4 pb-2 border-t border-slate-200/80"
                        >
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 font-sans">
                                Direct Contact & Profiles
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {/* GitHub Link */}
                                <a
                                    id="hero-github-link"
                                    href="https://github.com/purushothaman-web"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/60 text-xs font-medium transition-all group"
                                >
                                    <Github size={15} className="text-slate-900" />
                                    <span>GitHub</span>
                                    <ExternalLink size={12} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                                </a>

                                {/* LinkedIn Link */}
                                <a
                                    id="hero-linkedin-link"
                                    href="https://linkedin.com/in/purushothaman-web/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50/80 hover:bg-blue-100 text-blue-900 border border-blue-200/60 text-xs font-medium transition-all group"
                                >
                                    <Linkedin size={15} className="text-blue-600" />
                                    <span>LinkedIn</span>
                                    <ExternalLink size={12} className="text-blue-400 group-hover:text-blue-700 transition-colors" />
                                </a>

                                {/* Gmail Quick Copy / Direct Mail */}
                                <div className="inline-flex items-center rounded-xl bg-slate-100 border border-slate-200/60 p-0.5 text-xs">
                                    <a
                                        id="hero-gmail-link"
                                        href="mailto:rpurushothaman500@gmail.com"
                                        className="px-3 py-1.5 text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors"
                                    >
                                        <Mail size={14} className="text-rose-500" />
                                        <span>rpurushothaman500@gmail.com</span>
                                    </a>
                                    <button
                                        id="hero-copy-email-btn"
                                        onClick={handleCopyEmail}
                                        title="Copy email to clipboard"
                                        className="px-2 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all border border-slate-200 shadow-2xs flex items-center gap-1 cursor-pointer"
                                    >
                                        {copiedEmail ? (
                                            <>
                                                <Check size={12} className="text-emerald-600" />
                                                <span className="text-[11px] font-semibold text-emerald-600">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={12} />
                                                <span className="text-[11px]">Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Plain English Value Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-sans"
                        >
                            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
                                <Zap size={13} className="text-amber-500" />
                                <strong>Fast & Responsive</strong>
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
                                <Shield size={13} className="text-emerald-500" />
                                <strong>Secure Backends</strong>
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
                                <Sparkles size={13} className="text-blue-500" />
                                <strong>Clean UI Craft</strong>
                            </span>
                        </motion.div>

                    </div>

                    {/* Right Column: The "Two Sides of an App" Interactive Dual-Console (5 cols) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="lg:col-span-5 w-full flex justify-center"
                    >
                        <InteractiveDualConsole />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

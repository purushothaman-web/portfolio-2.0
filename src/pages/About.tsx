import { motion } from 'framer-motion';
import { Briefcase, MapPin, GraduationCap, Sparkles, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

const getExperienceDuration = (): string => {
    // Current role start: Feb 2025
    const start = new Date(2025, 1, 1);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) { years--; months += 12; }
    if (years === 0) return `${months} mo`;
    if (months === 0) return `${years} yr`;
    return `${years} yr ${months} mo`;
};

export const About = () => {
    return (
        <section id="about" className="py-14 sm:py-16 px-6 max-w-7xl mx-auto bg-transparent">
            
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8 sm:mb-10 space-y-3 text-left"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-sans font-semibold text-blue-700">
                    <Sparkles size={12} className="text-blue-600" />
                    <span>02 // ABOUT ME</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-sans">
                    A quick look at who I am &amp; what I do.
                </h2>
                <p className="text-slate-600 font-sans text-base max-w-2xl">
                    Simple, practical web development focused on clear design, fast load times, and solid engineering.
                </p>
            </motion.div>

            {/* Main Layout Assembly */}
            <div className="space-y-6">

                {/* 1. Integrated Profile & Story Card (Hero Bento Banner) */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xs text-left space-y-6"
                >
                    {/* Author & Avatar Lockup */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-2 ring-slate-100 shrink-0 bg-slate-100">
                                <img
                                    src="/photo.webp"
                                    alt="Purushothaman R"
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-sans flex items-center gap-2">
                                    <span>Purushothaman R</span>
                                </h3>
                                <p className="text-xs sm:text-sm font-medium text-slate-600 font-sans mt-0.5">
                                    Full Stack Developer &middot; React, Node.js &amp; TypeScript
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                    <MapPin size={13} className="text-blue-600 shrink-0" />
                                    <span>Bangalore, India &middot; Open to Remote &amp; Hybrid</span>
                                </div>
                            </div>
                        </div>

                        {/* Availability Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span>Available for new opportunities</span>
                        </div>
                    </div>

                    {/* Story Paragraphs */}
                    <div className="space-y-3">
                        <h4 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans tracking-tight">
                            I like building software that actually helps people get things done.
                        </h4>
                        <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
                            I got into web development because I love the craft of building things from scratch. I started on the frontend, designing clean layouts and interactive elements so that using an app feels effortless.
                        </p>
                        <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
                            Over time, I expanded naturally into backend development — creating the APIs, databases, and authentication systems that keep everything running smoothly behind the scenes.
                        </p>
                    </div>

                    {/* Quick Highlight Metrics Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-left">
                            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">2+ Yrs</div>
                            <div className="text-xs font-medium text-slate-500 mt-0.5">Hands-on Experience</div>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/60 text-left">
                            <div className="text-xl sm:text-2xl font-bold text-blue-700 font-sans">Full Stack</div>
                            <div className="text-xs font-medium text-blue-600 mt-0.5">React &middot; Node.js &middot; TS</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-left">
                            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">Enterprise</div>
                            <div className="text-xs font-medium text-slate-500 mt-0.5">Instigar ERP Modules</div>
                        </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        {['React 19', 'Next.js', 'Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'].map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-700"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* 2. Secondary Bento Row (Work Experience & What I Value) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Work Experience Card (md:col-span-6) */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="md:col-span-6 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between text-left"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">
                                    <Briefcase size={15} className="text-blue-600" />
                                    <span>Current Experience</span>
                                </div>
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                                    {getExperienceDuration()}
                                </span>
                            </div>

                            <h4 className="text-lg font-bold text-slate-900 font-sans">
                                Web Developer
                            </h4>
                            <div className="text-sm font-medium text-slate-700 mb-2">
                                Rapsol Technologies Pvt Ltd &middot; Bangalore
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-sans">
                                Developing core business modules for <strong>Instigar ERP</strong>, including student admissions, CRM lead workflows, and timetable scheduling. Building practical tools used in day-to-day operations.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 font-mono flex items-center justify-between">
                            <span>Feb 2025 &mdash; Present</span>
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active Role
                            </span>
                        </div>
                    </motion.div>

                    {/* What I Value Card (md:col-span-6) */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="md:col-span-6 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4 text-left"
                    >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">
                            <Sparkles size={15} className="text-amber-500" />
                            <span>What I Value</span>
                        </div>

                        <div className="space-y-3.5 font-sans">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                                    <Zap size={15} />
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-slate-900">Speed &amp; Usability</h5>
                                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                                        Interfaces that load fast and work seamlessly without confusing users.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
                                    <ShieldCheck size={15} />
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-slate-900">Clean &amp; Reliable Code</h5>
                                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                                        Writing code that is well-structured, easy to test, and built to last.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 mt-0.5">
                                    <CheckCircle2 size={15} />
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-slate-900">Direct Problem Solving</h5>
                                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                                        Focusing on what actually delivers value instead of unnecessary complexity.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* 3. Education Card (md:col-span-12) */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs text-left"
                >
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans mb-4">
                        <GraduationCap size={16} className="text-blue-600" />
                        <span>Education</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-start justify-between gap-4">
                            <div>
                                <h5 className="text-sm font-bold text-slate-900">Bachelor of Computer Applications (BCA)</h5>
                                <p className="text-xs text-slate-600 mt-0.5">Dr. MGR Chockalingam Arts and Science College</p>
                                <span className="text-[11px] text-slate-400 mt-1 inline-block font-mono">
                                    Computer Science &middot; Web Technologies &middot; Databases
                                </span>
                            </div>
                            <span className="text-xs font-bold font-mono text-slate-500 whitespace-nowrap bg-white px-2.5 py-1 rounded-md border border-slate-200/60">
                                2017 &ndash; 2020
                            </span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-start justify-between gap-4">
                            <div>
                                <h5 className="text-sm font-bold text-slate-900">Higher Secondary Certificate (HSC)</h5>
                                <p className="text-xs text-slate-600 mt-0.5">Government Hr. Sec. School</p>
                                <span className="text-[11px] text-slate-400 mt-1 inline-block font-mono">
                                    Computer Science &amp; Mathematics
                                </span>
                            </div>
                            <span className="text-xs font-bold font-mono text-slate-500 whitespace-nowrap bg-white px-2.5 py-1 rounded-md border border-slate-200/60">
                                2017
                            </span>
                        </div>
                    </div>
                </motion.div>

            </div>

        </section>
    );
};

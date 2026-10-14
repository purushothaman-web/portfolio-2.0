import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Award, ShieldCheck, Sparkles } from 'lucide-react';

interface Certificate {
    title: string;
    issuer: string;
    id: string;
    takeaway: string;
    skills: string[];
    link: string;
}

const certificates: Certificate[] = [
    {
        title: "Node.js, Express, MongoDB & More: Complete Bootcamp",
        issuer: "Udemy",
        id: "UC-d3be7243-0f59-4de5-853c-8eec9a1d3fa0",
        takeaway: "Deep dive into production server architecture, RESTful API design, middleware patterns, security, and asynchronous programming.",
        skills: ["Node.js", "Express.js", "REST APIs", "Backend Architecture"],
        link: "https://www.udemy.com/certificate/UC-d3be7243-0f59-4de5-853c-8eec9a1d3fa0/"
    },
    {
        title: "TailwindCSS from A to Z: Master TailwindCSS Quickly",
        issuer: "Udemy",
        id: "UC-f187ef90-a032-4010-8ae6-704fc6871b06",
        takeaway: "Mastery of responsive layouts, design token customization, utility-first CSS architecture, and cross-browser styling.",
        skills: ["Tailwind CSS", "Responsive Layouts", "Modern CSS", "UI Design"],
        link: "https://www.udemy.com/certificate/UC-f187ef90-a032-4010-8ae6-704fc6871b06/"
    },
    {
        title: "MongoDB: The Complete MongoDB Developer Course",
        issuer: "Udemy",
        id: "UC-0793ecce-73e7-411a-8781-839a02245ea8",
        takeaway: "Hands-on data modeling, aggregation pipelines, schema indexing, CRUD performance optimization, and NoSQL architecture.",
        skills: ["MongoDB", "NoSQL", "Data Modeling", "Database Indexing"],
        link: "https://www.udemy.com/certificate/UC-0793ecce-73e7-411a-8781-839a02245ea8/"
    }
];

export const Achievements = () => {
    return (
        <section id="achievements" className="py-14 sm:py-16 px-6 max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8 sm:mb-10 space-y-4 max-w-3xl"
            >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-semibold text-blue-700 tracking-wide uppercase">
                    <Award size={13} className="text-blue-600" />
                    <span>Learning & Certifications</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-sans">
                    Verified Coursework & Certifications
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-sans">
                    Structured, comprehensive bootcamps completed to build strong foundational knowledge in server runtimes, data modeling, and modern web interfaces.
                </p>
            </motion.div>

            {/* Two-column layout: sticky summary + certificate list */}
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                {/* Left: Summary & Quality Commitments (4 cols) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-4 lg:sticky lg:top-28 space-y-6"
                >
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
                        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block">
                                    Accreditation
                                </span>
                                <span className="font-bold text-slate-900 text-sm font-sans">
                                    Udemy Verified Credentials
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-xs font-sans font-medium text-slate-500 uppercase tracking-wider">
                                Completed Bootcamps
                            </span>
                            <span className="text-xl font-bold text-slate-900 font-sans">
                                0{certificates.length}
                            </span>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        <div className="space-y-2">
                            <span className="text-xs font-sans font-medium text-slate-500 uppercase tracking-wider block">
                                Core Competencies
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {['Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'REST APIs'].map((topic) => (
                                    <span
                                        key={topic}
                                        className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md"
                                    >
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3">
                                <Sparkles size={15} className="text-emerald-600 shrink-0" />
                                <span>All certificates are publicly verifiable online via official credential IDs.</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Certificate List (8 cols) */}
                <div className="lg:col-span-8 space-y-5">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="space-y-1.5 max-w-xl">
                                    <div className="flex items-center gap-2 text-[11px] font-sans font-semibold text-blue-600 uppercase tracking-wider">
                                        <span>Certification 0{index + 1}</span>
                                        <span className="text-slate-300">&bull;</span>
                                        <span className="text-slate-500">{cert.issuer} Verified</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-sans leading-snug group-hover:text-blue-600 transition-colors">
                                        {cert.title}
                                    </h3>
                                </div>

                                <a
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all self-start sm:self-auto bg-slate-50/50 shadow-2xs group/btn"
                                >
                                    <span>Verify Certificate</span>
                                    <ArrowUpRight size={13} className="text-slate-400 group-hover/btn:text-white transition-colors" />
                                </a>
                            </div>

                            {/* Human takeaway summary */}
                            <p className="text-slate-600 text-sm font-sans leading-relaxed pt-2">
                                {cert.takeaway}
                            </p>

                            {/* Skills Tags */}
                            <div className="flex flex-wrap gap-1.5 pt-2">
                                {cert.skills.map(skill => (
                                    <span
                                        key={skill}
                                        className="text-xs font-sans font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/70"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Credential ID and Status */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-sans">
                                <span className="font-mono text-[11px] text-slate-500 truncate">ID: {cert.id}</span>
                                <span className="flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 text-[11px]">
                                    <CheckCircle2 size={12} className="text-emerald-600" />
                                    <span>Issued & Verified</span>
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};


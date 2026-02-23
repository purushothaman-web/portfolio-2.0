import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface Certificate {
    title: string;
    issuer: string;
    year: string;
    id: string;
    skills: string[];
    link: string;
}

const certificates: Certificate[] = [
    {
        title: "PostgreSQL Bootcamp: Complete Beginner to Advanced",
        issuer: "Udemy",
        year: "2024",
        id: "UC-54f0ab24-93af-4701-ae48-39867cb49fe5",
        skills: ["PostgreSQL", "SQL", "Database Design", "Performance Tuning"],
        link: "https://www.udemy.com/certificate/UC-54f0ab24-93af-4701-ae48-39867cb49fe5/"
    },
    {
        title: "GIT, GitLab, GitHub Fundamentals for Developers",
        issuer: "Udemy",
        year: "2024",
        id: "UC-1c951159-be53-489b-af95-4f1a6a2f418b",
        skills: ["Git", "GitHub", "GitLab", "Version Control", "CI/CD"],
        link: "https://www.udemy.com/certificate/UC-1c951159-be53-489b-af95-4f1a6a2f418b/"
    },
    {
        title: "Node.js: All You Need to Know with Practical Project",
        issuer: "Udemy",
        year: "2024",
        id: "UC-d3be7243-0f59-4de5-853c-8eec9a1d3fa0",
        skills: ["Node.js", "Express.js", "REST APIs", "Backend Development"],
        link: "https://www.udemy.com/certificate/UC-d3be7243-0f59-4de5-853c-8eec9a1d3fa0/"
    },
    {
        title: "TailwindCSS from A to Z: Master TailwindCSS Quickly",
        issuer: "Udemy",
        year: "2024",
        id: "UC-f187ef90-a032-4010-8ae6-704fc6871b06",
        skills: ["Tailwind CSS", "Responsive Design", "Utility-First CSS"],
        link: "https://www.udemy.com/certificate/UC-f187ef90-a032-4010-8ae6-704fc6871b06/"
    },
    {
        title: "MongoDB: The Complete MongoDB Developers Course",
        issuer: "Udemy",
        year: "2024",
        id: "UC-0793ecce-73e7-411a-8781-839a02245ea8",
        skills: ["MongoDB", "NoSQL", "Data Modeling", "Database Architecture"],
        link: "https://www.udemy.com/certificate/UC-0793ecce-73e7-411a-8781-839a02245ea8/"
    }
];

export const Achievements = () => {
    return (
        <div id="achievements" className="min-h-screen py-32 px-6 bg-transparent">
            <div className="max-w-7xl mx-auto">

                {/* Two-column layout: sticky header + scrollable list */}
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* Left: Section Header (sticky) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8"
                    >
                        <div className="space-y-5">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d3557] font-sans leading-tight">
                                Continuing Education.
                            </h2>
                            <div className="w-12 h-1 bg-[#e63946] rounded-full" />
                            <p className="text-gray-500 font-sans leading-relaxed">
                                A commitment to continuous learning is at the core of how I grow. These credentials represent structured deep-dives into the tools and systems I rely on.
                            </p>
                        </div>

                        {/* Summary box */}
                        <div className="bg-white editorial-card rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</span>
                                <span className="text-2xl font-bold text-[#1d3557]">{certificates.length}</span>
                            </div>
                            <div className="h-px bg-gray-100 w-full" />
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform</span>
                                <span className="text-sm font-semibold text-gray-700">Udemy</span>
                            </div>
                            <div className="h-px bg-gray-100 w-full" />
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Year</span>
                                <span className="text-sm font-semibold text-gray-700">2024</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Certificate List */}
                    <div className="lg:col-span-8 space-y-0 divide-y divide-gray-100">
                        {certificates.map((cert, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className="group py-8 first:pt-0"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                                    {/* Index number */}
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#fff9ed] flex items-center justify-center">
                                        <span className="text-sm font-bold text-[#e63946] font-sans">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-[#1d3557] font-sans leading-snug group-hover:text-[#e63946] transition-colors">
                                                    {cert.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <CheckCircle2 size={13} className="text-green-500" />
                                                    <span className="text-xs font-sans text-gray-500">
                                                        Accredited by <span className="font-semibold text-gray-700">{cert.issuer}</span> &middot; {cert.year}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Verify link */}
                                            <a
                                                href={cert.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d3557] border border-[#1d3557]/20 rounded-lg px-3 py-1.5 hover:bg-[#1d3557] hover:text-white transition-all self-start"
                                            >
                                                Verify
                                                <ArrowUpRight size={12} />
                                            </a>
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-2">
                                            {cert.skills.map(skill => (
                                                <span
                                                    key={skill}
                                                    className="text-xs font-sans font-medium text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Credential ID */}
                                        <p className="text-xs text-gray-400 font-mono truncate">
                                            ID: {cert.id}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

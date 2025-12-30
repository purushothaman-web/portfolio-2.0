import { motion } from 'framer-motion';
import { ShieldCheck, Award, Lock, Fingerprint, ExternalLink } from 'lucide-react';

interface CertificateCardProps {
    title: string;
    issuer: string;
    date: string;
    id: string;
    skills: string[];
    verified: boolean;
    link: string;
    index: number;
}

const CertificateCard = ({ title, issuer, id, skills, verified, link, index }: CertificateCardProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative group w-full bg-[#1e1e1e] rounded-xl border border-[#333] p-6 hover:border-cyan-500/50 transition-colors overflow-hidden"
    >
        {/* Watermark/Background Decoration */}
        <div className="absolute -right-4 -top-4 text-[#252526] transform rotate-12 opacity-50 pointer-events-none select-none">
            <Award size={120} strokeWidth={0.5} />
        </div>

        <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-900/20 text-cyan-400 rounded-lg border border-cyan-500/20">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-200 text-lg leading-tight line-clamp-2">{title}</h3>
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">{issuer}</span>
                    </div>
                </div>
                {verified && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-900/20 border border-green-500/30 rounded text-green-400 text-[10px] font-mono uppercase tracking-widest font-bold shrink-0">
                        <Lock size={10} />
                        Verified
                    </div>
                )}
            </div>

            {/* Certificate ID/Fingerprint */}
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mb-6 font-mono text-xs text-gray-500 bg-[#252526] p-2 rounded border border-[#333] hover:border-cyan-500/50 hover:text-cyan-400 transition-colors group/link"
            >
                <Fingerprint size={12} className="text-gray-400 group-hover/link:text-cyan-400" />
                <span className="truncate">ID: {id}</span>
                <ExternalLink size={10} className="ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>

            {/* Skills Tag Cloud */}
            <div className="mt-auto">
                <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">Validated Skills_</h4>
                <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                        <span key={skill} className="px-2 py-1 text-[10px] sm:text-xs font-mono bg-[#252526] text-gray-300 border border-[#333] rounded hover:border-cyan-500/30 hover:text-cyan-400 transition-colors cursor-default">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);

export const Achievements = () => {
    const certificates = [
        {
            title: "PostgreSQL Bootcamp : Complete Beginner to Advanced Course",
            issuer: "Udemy",
            date: "2024",
            id: "UC-54f0ab24-93af-4701-ae48-39867cb49fe5",
            skills: ["PostgreSQL", "SQL", "Database Design", "Performance Tuning"],
            verified: true,
            link: "https://www.udemy.com/certificate/UC-54f0ab24-93af-4701-ae48-39867cb49fe5/"
        },
        {
            title: "GIT, GitLab, GitHub Fundamentals for Software Developers",
            issuer: "Udemy",
            date: "2024",
            id: "UC-1c951159-be53-489b-af95-4f1a6a2f418b",
            skills: ["Git", "GitHub", "GitLab", "Version Control", "CI/CD"],
            verified: true,
            link: "https://www.udemy.com/certificate/UC-1c951159-be53-489b-af95-4f1a6a2f418b/"
        },
        {
            title: "Nodejs: All You Need to Know with Practical Project",
            issuer: "Udemy",
            date: "2024",
            id: "UC-d3be7243-0f59-4de5-853c-8eec9a1d3fa0",
            skills: ["Node.js", "Express.js", "Backend Development", "REST APIs"],
            verified: true,
            link: "https://www.udemy.com/certificate/UC-d3be7243-0f59-4de5-853c-8eec9a1d3fa0/"
        },
        {
            title: "TailwindCSS from A to Z: Master TailwindCSS Quickly",
            issuer: "Udemy",
            date: "2024",
            id: "UC-f187ef90-a032-4010-8ae6-704fc6871b06",
            skills: ["Tailwind CSS", "Responsive Design", "Utility-First CSS"],
            verified: true,
            link: "https://www.udemy.com/certificate/UC-f187ef90-a032-4010-8ae6-704fc6871b06/"
        },
        {
            title: "MongoDB - The Complete MongoDB Developers Course",
            issuer: "Udemy",
            date: "2024",
            id: "UC-0793ecce-73e7-411a-8781-839a02245ea8",
            skills: ["MongoDB", "NoSQL", "Database Architecture", "Data Modeling"],
            verified: true,
            link: "https://www.udemy.com/certificate/UC-0793ecce-73e7-411a-8781-839a02245ea8/"
        }
    ];

    return (
        <div className="min-h-screen py-24 px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
            >
                {/* Header */}
                <div className="space-y-4">
                    <div className="inline-flex items-center space-x-2 text-sm font-mono text-cyan-600 dark:text-cyan-400">
                        <Award size={16} />
                        <span>./view_credentials.sh</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Licenses & Certifications</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                        Verified technical credentials and validated skillsets.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert, index) => (
                        <CertificateCard key={index} {...cert} index={index} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, LayoutTemplate, Database, Wrench, Sparkles, Zap, BookOpen } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { SkillRoadmapDrawer } from '../components/ui/SkillRoadmapDrawer';

interface SkillDomainProps {
    title: string;
    category: string;
    description: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    skills: string[];
    delay: number;
    onSelectRoadmap: (roadmapId: string) => void;
}

function getRoadmapIdForSkill(skillName: string): string | null {
    const lower = skillName.toLowerCase();
    if (lower.includes('react') || lower.includes('next')) return 'react';
    if (lower.includes('typescript')) return 'typescript';
    if (lower.includes('node') || lower.includes('express')) return 'nodejs';
    if (lower.includes('postgres') || lower.includes('prisma') || lower.includes('indexing')) return 'postgresql';
    return null;
}

const SkillDomain = ({ 
    title, 
    category, 
    description, 
    icon: Icon, 
    iconBg, 
    iconColor, 
    skills, 
    delay,
    onSelectRoadmap
}: SkillDomainProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between space-y-6 text-left group"
    >
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-2xs ${iconBg} ${iconColor}`}>
                    <Icon size={22} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
                    {category}
                </span>
            </div>

            <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 font-sans group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed mt-1.5">
                    {description}
                </p>
            </div>
        </div>

        {/* Skill Pills */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
            {skills.map((skill) => {
                const roadmapId = getRoadmapIdForSkill(skill);
                if (roadmapId) {
                    return (
                        <button
                            key={skill}
                            onClick={() => onSelectRoadmap(roadmapId)}
                            title="Click to view 5-Minute Micro-Roadmap, code traps & canonical docs"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs font-medium text-blue-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer group/pill shadow-2xs"
                        >
                            <span>{skill}</span>
                            <span className="text-[10px] px-1 py-0.5 rounded bg-white/90 text-blue-700 group-hover/pill:bg-blue-700 group-hover/pill:text-white font-mono font-bold transition-colors">
                                5m Drill ↗
                            </span>
                        </button>
                    );
                }
                return (
                    <span
                        key={skill}
                        className="px-3 py-1 rounded-lg bg-slate-50/80 border border-slate-200/60 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-all cursor-default"
                    >
                        {skill}
                    </span>
                );
            })}
        </div>
    </motion.div>
);

const CORE_STACK = [
    { name: 'React 19 & Next.js', role: 'Component Systems & Fast UI', roadmapId: 'react' },
    { name: 'Node.js & Express', role: 'REST APIs & Server Logic', roadmapId: 'nodejs' },
    { name: 'TypeScript', role: 'Type-Safe Code & Better DX', roadmapId: 'typescript' },
    { name: 'PostgreSQL & Prisma', role: 'Relational Schemas & Migrations', roadmapId: 'postgresql' },
    { name: 'Tailwind CSS v4', role: 'Responsive Layouts & Styling', roadmapId: null },
    { name: 'Git & GitHub', role: 'Version Control & Workflow', roadmapId: null }
];

export const Skills = () => {
    const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);

    return (
        <section id="skills" className="py-14 sm:py-16 px-6 max-w-7xl mx-auto bg-transparent">
            
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8 sm:mb-10 space-y-3 text-left"
            >
                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-sans font-semibold text-blue-700">
                        <Sparkles size={12} className="text-blue-600" />
                        <span>04 // TOOLBOX &amp; STACK</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-sans font-medium text-emerald-800">
                        <BookOpen size={12} className="text-emerald-600" />
                        <span>Interactive 5-Min Micro-Roadmaps Available</span>
                    </div>
                </div>

                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-sans">
                    Technologies &amp; Everyday Tools
                </h2>
                <p className="text-slate-600 font-sans text-base max-w-2xl mt-2">
                    A clear overview of the languages, frameworks, and databases I rely on to turn ideas into fast, production-ready web applications. 
                    <span className="text-blue-600 font-medium"> Click on any stack pill</span> to inspect its 5-minute practical checkpoints, senior vs junior code traps, and canonical official docs.
                </p>
            </motion.div>

            {/* Everyday Core Stack Strip */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs mb-8 text-left"
            >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                        <Zap size={15} className="text-amber-500" />
                        <span>The Everyday Core Stack</span>
                    </div>
                    <span className="text-xs text-slate-500 font-sans hidden sm:inline">
                        Click any technology to open its interactive roadmap
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {CORE_STACK.map((item, i) => {
                        const hasRoadmap = Boolean(item.roadmapId);
                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    if (item.roadmapId) setSelectedRoadmapId(item.roadmapId);
                                }}
                                disabled={!hasRoadmap}
                                className={`p-3.5 rounded-xl border text-left transition-all ${
                                    hasRoadmap
                                        ? 'bg-slate-50/80 border-slate-200/70 hover:bg-white hover:border-blue-400 hover:shadow-xs cursor-pointer group'
                                        : 'bg-slate-50/40 border-slate-100 cursor-default opacity-85'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-slate-900 text-xs sm:text-sm font-sans truncate group-hover:text-blue-600 transition-colors">
                                        {item.name}
                                    </div>
                                    {hasRoadmap && (
                                        <span className="text-[10px] text-blue-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                            ↗
                                        </span>
                                    )}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                    {item.role}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* 4-Domain Bento Grid */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                
                {/* 1. Frontend & Client Interfaces */}
                <SkillDomain
                    category="CLIENT-SIDE"
                    title="Frontend & User Interfaces"
                    description="Building responsive, accessible web pages that look great, load fast, and provide smooth micro-interactions across mobile and desktop."
                    icon={LayoutTemplate}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                    onSelectRoadmap={(id) => setSelectedRoadmapId(id)}
                    skills={[
                        'React 19',
                        'TypeScript',
                        'JavaScript (ESNext)',
                        'Next.js (App Router)',
                        'Tailwind CSS v4',
                        'Framer Motion',
                        'HTML5 Semantic Web',
                        'Responsive Layouts',
                        'State Management',
                        'Fetch / Axios API'
                    ]}
                    delay={0.15}
                />

                {/* 2. Backend & Server Architecture */}
                <SkillDomain
                    category="SERVER-SIDE"
                    title="Backend & Server Architecture"
                    description="Engineering secure API endpoints, user authentication, role-based permissions, and organized server-side business logic."
                    icon={Server}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                    onSelectRoadmap={(id) => setSelectedRoadmapId(id)}
                    skills={[
                        'Node.js',
                        'Express.js',
                        'REST API Architecture',
                        'JWT Authentication',
                        'Role-Based Access (RBAC)',
                        'Zod Request Validation',
                        'Middleware & Error Handling',
                        'Nodemailer (Email)',
                        'Socket.IO (WebSockets)',
                        'Cron Jobs & Sweepers'
                    ]}
                    delay={0.2}
                />

                {/* 3. Databases & Data Modeling */}
                <SkillDomain
                    category="DATA STORAGE"
                    title="Databases & Schema Design"
                    description="Structuring clean relational tables and document stores designed for data integrity, fast queries, and reliable multi-tenancy."
                    icon={Database}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                    onSelectRoadmap={(id) => setSelectedRoadmapId(id)}
                    skills={[
                        'PostgreSQL',
                        'Prisma ORM',
                        'MongoDB (Mongoose)',
                        'NeonDB (Serverless)',
                        'Relational Data Modeling',
                        'Multi-Tenant Scoping',
                        'Database Migrations',
                        'Schema Indexing'
                    ]}
                    delay={0.25}
                />

                {/* 4. Tooling & Workflow */}
                <SkillDomain
                    category="DEVELOPER TOOLS"
                    title="Workflow & Cloud Tooling"
                    description="The daily tools and environments I use to test endpoints, automate builds, collaborate with git, and deploy web applications."
                    icon={Wrench}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                    onSelectRoadmap={(id) => setSelectedRoadmapId(id)}
                    skills={[
                        'Git & GitHub',
                        'Postman (API Testing)',
                        'Vite Bundler',
                        'Vercel Deployment',
                        'npm & Node Ecosystem',
                        'Linux Shell / Bash',
                        'Cloudinary Storage',
                        'Environment Secrets (.env)'
                    ]}
                    delay={0.3}
                />

            </div>

            {/* Interactive Skill Roadmap Drawer */}
            <SkillRoadmapDrawer
                skillId={selectedRoadmapId}
                onClose={() => setSelectedRoadmapId(null)}
            />

        </section>
    );
};

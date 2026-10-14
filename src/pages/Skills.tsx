import { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, LayoutTemplate, Database, Wrench, Sparkles, Zap } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { SkillRoadmapDrawer } from '../components/ui/SkillRoadmapDrawer';
import { SkillIcon } from '../components/ui/SkillIcon';

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
    if (lower.includes('javascript') || lower.includes('esnext')) return 'javascript';
    if (lower.includes('next')) return 'nextjs';
    if (lower.includes('react')) return 'react';
    if (lower.includes('typescript')) return 'typescript';
    if (lower.includes('tailwind')) return 'tailwind';
    if (lower.includes('framer') || lower.includes('motion')) return 'framer-motion';
    if (lower.includes('node') || lower.includes('express') || lower.includes('rest api')) return 'nodejs';
    if (lower.includes('postgres') || lower.includes('indexing')) return 'postgresql';
    if (lower.includes('prisma')) return 'prisma';
    if (lower.includes('mongo')) return 'mongodb';
    if (lower.includes('git')) return 'git';
    if (lower.includes('architecture') || lower.includes('system design')) return 'system-design';
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

        {/* Skill Pills (Clean, elegant look with official brand SVG logos) */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
            {skills.map((skill) => {
                const roadmapId = getRoadmapIdForSkill(skill);
                return (
                    <button
                        key={skill}
                        onClick={() => {
                            if (roadmapId) onSelectRoadmap(roadmapId);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50/80 border border-slate-200/70 text-xs font-medium text-slate-700 hover:bg-white hover:text-slate-900 hover:border-slate-300 hover:shadow-2xs transition-all cursor-pointer group/pill"
                    >
                        <SkillIcon name={skill} size={15} />
                        <span>{skill}</span>
                    </button>
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
    { name: 'Tailwind CSS v4', role: 'Responsive Layouts & Styling', roadmapId: 'tailwind' },
    { name: 'Git & GitHub', role: 'Version Control & Workflow', roadmapId: 'git' }
];

export const Skills = () => {
    const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);

    return (
        <section id="skills" className="py-14 sm:py-16 px-6 max-w-7xl mx-auto bg-transparent">
            
            {/* Section Header (Completely clean and natural without spoiled hints) */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8 sm:mb-10 space-y-3 text-left"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-sans font-semibold text-blue-700">
                    <Sparkles size={12} className="text-blue-600" />
                    <span>04 // TOOLBOX &amp; STACK</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-sans">
                    Technologies &amp; Everyday Tools
                </h2>
                <p className="text-slate-600 font-sans text-base max-w-2xl mt-2">
                    A clear overview of the languages, frameworks, and databases I rely on to turn ideas into fast, production-ready web applications.
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
                        Technologies I write daily in production
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {CORE_STACK.map((item, i) => {
                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    if (item.roadmapId) setSelectedRoadmapId(item.roadmapId);
                                }}
                                className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all text-left cursor-pointer group"
                            >
                                <div className="flex items-center gap-2">
                                    <SkillIcon name={item.name} size={18} />
                                    <div className="font-bold text-slate-900 text-xs sm:text-sm font-sans truncate group-hover:text-blue-600 transition-colors">
                                        {item.name}
                                    </div>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
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

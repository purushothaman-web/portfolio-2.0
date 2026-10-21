import { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, LayoutTemplate, Database, Wrench, Sparkles, Zap } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { SkillRoadmapDrawer } from '../components/ui/SkillRoadmapDrawer';
import { SkillIcon } from '../components/ui/SkillIcon';

export interface SkillTarget {
    skillId: string;
    focusedCheckpointId?: string;
    topicTitle?: string;
}

interface SkillDomainProps {
    title: string;
    category: string;
    description: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    skills: string[];
    delay: number;
    onSelectTarget: (target: SkillTarget) => void;
}

function getRoadmapTargetForSkill(skillName: string): SkillTarget | null {
    const lower = skillName.toLowerCase();

    // 1. JWT Authentication (Dedicated Pure JWT Content - NOT full Node/Express)
    if (lower.includes('jwt')) {
        return { skillId: 'jwt' };
    }

    // 2. System Design & Architecture
    if (lower.includes('system design') || lower.includes('system architecture') || lower.includes('architecture')) {
        return { skillId: 'system-design' };
    }

    // 3. React 19 & Client Sub-skills
    if (lower.includes('state management')) {
        return { skillId: 'react', focusedCheckpointId: 'react-3', topicTitle: 'Scalable State Management Patterns' };
    }
    if (lower.includes('react')) return { skillId: 'react' };

    // 4. Next.js
    if (lower.includes('next')) return { skillId: 'nextjs' };

    // 5. TypeScript
    if (lower.includes('typescript')) return { skillId: 'typescript' };

    // 6. JavaScript
    if (lower.includes('javascript') || lower.includes('esnext')) return { skillId: 'javascript' };

    // 7. Tailwind CSS
    if (lower.includes('tailwind')) return { skillId: 'tailwind' };

    // 8. Framer Motion
    if (lower.includes('framer') || lower.includes('motion')) return { skillId: 'framer-motion' };

    // 9. Express & Sub-skills (Focused checkpoints)
    if (lower.includes('role-based') || lower.includes('rbac')) {
        return { skillId: 'express', focusedCheckpointId: 'express-5', topicTitle: 'Role-Based Access Control (RBAC)' };
    }
    if (lower.includes('zod')) {
        return { skillId: 'express', focusedCheckpointId: 'express-3', topicTitle: 'Request Validation with Zod' };
    }
    if (lower.includes('middleware')) {
        return { skillId: 'express', focusedCheckpointId: 'express-1', topicTitle: 'Middleware Pipeline Architecture' };
    }
    if (lower.includes('rest api')) {
        return { skillId: 'express', focusedCheckpointId: 'express-7', topicTitle: 'RESTful API Architecture & Status Codes' };
    }
    if (lower.includes('express')) return { skillId: 'express' };

    // 10. Node.js Runtime & Sub-skills (Focused checkpoints)
    if (lower.includes('nodemailer') || lower.includes('email')) {
        return { skillId: 'nodejs', focusedCheckpointId: 'nodejs-8', topicTitle: 'Transactional Emails with Nodemailer' };
    }
    if (lower.includes('socket')) {
        return { skillId: 'nodejs', focusedCheckpointId: 'nodejs-7', topicTitle: 'Real-Time WebSockets with Socket.IO' };
    }
    if (lower.includes('cron')) {
        return { skillId: 'nodejs', focusedCheckpointId: 'nodejs-9', topicTitle: 'Scheduled Cron Jobs & Sweepers' };
    }
    if (lower.includes('secrets') || lower.includes('.env')) {
        return { skillId: 'nodejs', focusedCheckpointId: 'nodejs-11', topicTitle: 'Environment Secrets & Process Hardening' };
    }
    if (lower.includes('node')) return { skillId: 'nodejs' };

    // 11. Databases: PostgreSQL, NeonDB, Supabase
    if (lower.includes('indexing')) {
        return { skillId: 'postgresql', focusedCheckpointId: 'postgresql-1', topicTitle: 'B-Tree Schema Indexing & EXPLAIN' };
    }
    if (lower.includes('relational data modeling') || lower.includes('relational')) {
        return { skillId: 'postgresql', focusedCheckpointId: 'postgresql-2', topicTitle: 'Relational Data Modeling & Normalization' };
    }
    if (lower.includes('neon')) return { skillId: 'neondb' };
    if (lower.includes('supabase')) return { skillId: 'supabase' };
    if (lower.includes('postgres')) return { skillId: 'postgresql' };

    // 12. Prisma ORM & Sub-skills (Focused checkpoints)
    if (lower.includes('migration')) {
        return { skillId: 'prisma', focusedCheckpointId: 'prisma-3', topicTitle: 'Database Migrations & Schema Drift' };
    }
    if (lower.includes('multi-tenant')) {
        return { skillId: 'prisma', focusedCheckpointId: 'prisma-7', topicTitle: 'Multi-Tenant Data Isolation' };
    }
    if (lower.includes('prisma')) return { skillId: 'prisma' };

    // 13. MongoDB
    if (lower.includes('mongo')) return { skillId: 'mongodb' };

    // 14. Git & Workflow Sub-skills
    if (lower.includes('git')) return { skillId: 'git' };
    if (lower.includes('linux') || lower.includes('shell') || lower.includes('bash')) {
        return { skillId: 'git', focusedCheckpointId: 'git-10', topicTitle: 'Linux Shell & CLI Automation' };
    }

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
    onSelectTarget
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
                const target = getRoadmapTargetForSkill(skill);
                const isInteractive = target !== null;
                return (
                    <button
                        key={skill}
                        onClick={() => {
                            if (target) onSelectTarget(target);
                        }}
                        disabled={!isInteractive}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isInteractive
                                ? 'bg-slate-50/80 border border-slate-200/70 text-slate-700 hover:bg-white hover:text-slate-900 hover:border-slate-300 hover:shadow-2xs cursor-pointer group/pill'
                                : 'bg-slate-50/40 border border-slate-200/50 text-slate-500 cursor-default opacity-85'
                        }`}
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
    const [selectedTarget, setSelectedTarget] = useState<SkillTarget | null>(null);

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
                                    if (item.roadmapId) setSelectedTarget({ skillId: item.roadmapId });
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
                    onSelectTarget={(target) => setSelectedTarget(target)}
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
                    onSelectTarget={(target) => setSelectedTarget(target)}
                    skills={[
                        'System Design & Architecture',
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
                    onSelectTarget={(target) => setSelectedTarget(target)}
                    skills={[
                        'PostgreSQL',
                        'Prisma ORM',
                        'Supabase',
                        'NeonDB (Serverless)',
                        'MongoDB (Mongoose)',
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
                    onSelectTarget={(target) => setSelectedTarget(target)}
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
                skillId={selectedTarget?.skillId || null}
                focusedCheckpointId={selectedTarget?.focusedCheckpointId}
                topicTitle={selectedTarget?.topicTitle}
                onClose={() => setSelectedTarget(null)}
            />

        </section>
    );
};

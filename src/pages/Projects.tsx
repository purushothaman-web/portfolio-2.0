import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ArrowUpRight } from 'lucide-react';

interface Project {
    title: string;
    type: string;
    problem: string;
    architecture: string;
    impact: string;
    tags: string[];
    links: { github: string; live?: string };
    detailedCaseStudy: {
        story: string;
        capabilities: { title: string; desc: string }[];
        stack: string[];
    };
}

interface ProjectCardProps extends Project {
    index: number;
    onClick: () => void;
}

const ProjectCard = ({ title, type, problem, architecture, impact, tags, index, onClick }: ProjectCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        onClick={onClick}
        className="group bg-white editorial-card rounded-3xl overflow-hidden flex flex-col lg:flex-row min-h-[400px] cursor-pointer hover:shadow-2xl transition-all duration-500 border border-black/5"
    >
        {/* Left Side: Context & Links */}
        <div className="lg:w-2/5 bg-[#fff9ed] p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/10">
            <div>
                <span className="text-xs font-sans font-bold text-[#e63946] uppercase tracking-widest block mb-4">Case Study {String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1d3557] font-sans mb-4 group-hover:text-[#e63946] transition-colors">{title}</h3>
                <p className="text-sm font-sans text-gray-400 uppercase tracking-wider mb-8 font-semibold">{type}</p>
                
                <div className="flex flex-wrap gap-2 mb-10">
                    {tags.slice(0, 4).map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-600 rounded-full text-[10px] font-sans font-bold border border-black/5 shadow-sm uppercase tracking-tighter">
                            {tag}
                        </span>
                    ))}
                    {tags.length > 4 && (
                        <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-400 rounded-full text-[10px] font-sans font-bold border border-black/5">
                            +{tags.length - 4}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#1d3557] text-white px-5 py-2.5 rounded-full font-sans font-bold transition-all group-hover:bg-[#e63946] text-xs uppercase tracking-wider">
                    <span>View Case Study</span>
                    <ArrowUpRight size={14} />
                </div>
            </div>
        </div>

        {/* Right Side: Narrative */}
        <div className="lg:w-3/5 p-10 lg:p-12 font-sans flex flex-col justify-center space-y-8 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e63946]/5 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="space-y-3 relative z-10">
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">The Problem</h4>
                <p className="text-gray-600 leading-relaxed text-sm font-medium">{problem}</p>
            </div>
            
            <div className="space-y-3 relative z-10">
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Architecture Scope</h4>
                <p className="text-gray-600 leading-relaxed border-l-2 border-[#e63946]/20 pl-4 text-sm font-medium">{architecture}</p>
            </div>

            <div className="space-y-3 relative z-10">
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Business Impact</h4>
                <p className="text-gray-600 leading-relaxed text-sm font-medium">{impact}</p>
            </div>
        </div>
    </motion.div>
);

const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center py-12 md:py-20 px-4 overflow-y-auto bg-[#1d3557]/20 backdrop-blur-xl"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden relative"
            onClick={e => e.stopPropagation()}
        >
            {/* Modal Header */}
            <div className="bg-[#fff9ed] px-8 py-10 md:px-16 md:py-16 border-b border-black/5 relative group">
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 rounded-full bg-white border border-black/5 text-gray-400 hover:text-[#e63946] hover:rotate-90 transition-all duration-300 z-10"
                >
                    <ArrowUpRight className="rotate-45" size={24} />
                </button>

                <div className="max-w-3xl">
                    <span className="text-xs font-bold text-[#e63946] uppercase tracking-[0.3em] block mb-4">Detailed Case Study</span>
                    <h2 className="text-4xl md:text-6xl font-black text-[#1d3557] mb-6 tracking-tight leading-none">{project.title}</h2>
                    <p className="text-md md:text-lg text-gray-500 font-medium uppercase tracking-widest">{project.type}</p>
                </div>
            </div>

            <div className="p-8 md:p-16 grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="space-y-6">
                        <h3 className="text-2xl font-bold text-[#1d3557] flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-[#e63946]/10 text-[#e63946] flex items-center justify-center text-sm">01</span>
                            Development Story
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed font-sans">{project.detailedCaseStudy.story}</p>
                    </section>

                    <section className="space-y-8">
                        <h3 className="text-2xl font-bold text-[#1d3557] flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-[#e63946]/10 text-[#e63946] flex items-center justify-center text-sm">02</span>
                            Core Capabilities
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {project.detailedCaseStudy.capabilities.map((cap, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-black/5 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                                    <h4 className="font-bold text-[#1d3557] mb-2 group-hover:text-[#e63946] transition-colors">{cap.title}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed font-sans">{cap.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-10">
                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Technology Stack</h4>
                        <div className="flex flex-wrap gap-2">
                            {project.detailedCaseStudy.stack.map(tech => (
                                <span key={tech} className="px-4 py-2 bg-[#1d3557]/5 text-[#1d3557] rounded-xl text-xs font-bold font-sans">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">External Links</h4>
                        <div className="flex flex-col gap-3">
                            {project.links.live && (
                                <a
                                    href={project.links.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between w-full bg-[#1d3557] text-white px-6 py-4 rounded-2xl font-bold transition-all hover:bg-[#112240] group shadow-lg shadow-[#1d3557]/20"
                                >
                                    <span>Live Preview</span>
                                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </a>
                            )}
                            <a
                                href={project.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between w-full bg-white border-2 border-[#1d3557]/10 text-[#1d3557] px-6 py-4 rounded-2xl font-bold transition-all hover:border-[#1d3557] group"
                            >
                                <div className="flex items-center gap-3">
                                    <Github size={20} />
                                    <span>Repository</span>
                                </div>
                                <ArrowUpRight size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    </section>

                    <div className="p-8 rounded-3xl bg-[#e63946]/5 border border-[#e63946]/10">
                        <p className="text-xs text-[#e63946] font-bold uppercase tracking-widest mb-2">Pro Tip</p>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-sans font-medium uppercase tracking-tighter">Clicking outside this modal or hitting the close button will return you to the main project grid.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    </motion.div>
);

export const Projects = () => {
    const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);

    const projects: Project[] = [
        {
            title: 'DevDesk',
            type: 'Multi-Tenant SaaS Helpdesk',
            problem: 'Organizations struggle to manage B2B support tickets effectively while maintaining strict data isolation between clients and varied permission levels.',
            architecture: 'Developed a scalable Node.js backend with Prisma and PostgreSQL. Implemented secure RBAC across multiple tiers and automated workflows to isolate data robustly.',
            impact: 'Delivered a high-performance support platform that securely segregates multi-tenant data, streamlining complex B2B ticket resolutions and providing analytical oversight.',
            tags: ['React', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'RBAC', 'Cloudinary'],
            links: {
                github: 'https://github.com/purushothaman-web/DevDesk',
                live: 'https://devdesk-ui.vercel.app/'
            },
            detailedCaseStudy: {
                story: "DevDesk evolved from a single-tenant support system into a robust Multi-Tenant SaaS Architecture. The primary challenge was ensuring that organizations could operate independently within a shared database environment while guaranteeing that no data leaks occurred between clients. We solved this by implementing organization-scoped queries and a global Super Admin layer for platform oversight. A key advanced feature is the automated SLA engine that runs periodic 'sweeps' to detect and escalate breaching tickets via secure SMTP relays.",
                capabilities: [
                    { title: "True Multitenancy", desc: "Enterprise-grade isolation where users, tickets, and metrics are strictly bound to their parent Organization via scoped controller filters." },
                    { title: "Automated SLA Engine", desc: "A background service that monitors resolution targets in real-time, triggering automated escalations and audit logs upon breach." },
                    { title: "Dynamic SLA Matrix", desc: "Allows Organizations to define custom resolution windows (Low, Medium, High) in hours, directly influencing the automated sweep service." },
                    { title: "Immutable Audit Logs", desc: "Every system interaction—from status shifts to agent assignments—is captured in an unchangeable activity feed for compliance." }
                ],
                stack: ["React", "Express", "Prisma", "PostgreSQL", "Tailwind CSS", "Zod", "JWT", "Cloudinary", "Nodemailer"]
            }
        },
        {
            title: 'JobTrackr',
            type: 'Career Management System (PERN Stack)',
            problem: 'Job seekers often lose track of application deadlines, follow-ups, and interview stages across dozens of platforms, leading to missed opportunities.',
            architecture: 'Built a specialized CRM for applicants utilizing secure JWT authentication, structured relational tables for progress tracking, and scheduled cron jobs for email reminders.',
            impact: 'Created a centralized dashboard that automates organization, drastically reducing missed opportunities via smart alerts and providing CSV exports for portability.',
            tags: ['React', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Cron', 'Nodemailer'],
            links: {
                github: 'https://github.com/purushothaman-web/JobTrackr',
                live: 'https://jobtrackr-silk.vercel.app/'
            },
            detailedCaseStudy: {
                story: "JobTrackr was born out of the frustration of managing high-volume job applications. The goal was to build a tool that feels as fast as a spreadsheet but as structured as a CRM. Using a pure PERN stack (PostgreSQL, Express, React, Node), we focused on data integrity and automated user notifications. A standout architectural feature is the relational company-to-job mapping, which allows users to manage multiple applications for the same organization while maintaining a unified profile.",
                capabilities: [
                    { title: "Relational CRM", desc: "Complex PostgreSQL schema that links applications to specific Company profiles, enabling aggregated insights and data consistency." },
                    { title: "Visual Heatmap", desc: "A GitHub-style contribution graph powered by a dedicated activity logging table that tracks every status shift and application event." },
                    { title: "Automated Data Portability", desc: "Includes a built-in CSV export service, allowing users to move their application history offline for deeper analysis or backups." },
                    { title: "Smart Scheduling", desc: "Utilizes Node-based cron jobs to monitor upcoming interview deadlines and dispatch automated email reminders via SMTP." }
                ],
                stack: ["React", "Node.js", "Express", "Prisma", "PostgreSQL", "Nodemailer", "Cron", "JWT"]
            }
        },
        {
            title: 'ThiraiView',
            type: 'Dynamic Media Discovery',
            problem: 'Users suffer from choice paralysis when browsing standard movie catalogs that lack personalized, mood-based filtering or deep metadata exploration.',
            architecture: 'Integrated complex external data fetching from TMDB APIs with custom backend caching strategies and analytical aggregation to power features like Movie DNA analysis.',
            impact: 'Broke standard catalog limitations by offering hyper-personalized recommendations, driving engagement through unique cast-mixing queries and mood analysis.',
            tags: ['React', 'Node.js', 'Express', 'TMDB API', 'Framer Motion', 'REST API'],
            links: {
                github: 'https://github.com/purushothaman-web/ThiraiView',
                live: 'https://thiraiview.vercel.app/'
            },
            detailedCaseStudy: {
                story: "ThiraiView is a cinematic movie discovery platform that prioritizes 'Discovery Experience' over simple searching. Drawing from the TMDB API, we built a custom scoring engine that analyzes movie metadata to create a 'Cinematic DNA' radar chart. This allows users to find content based on emotional resonance rather than just genre labels. The platform leverages advanced API aggregation, fetching cast, similar movies, and trailers in optimized, single round-trip calls.",
                capabilities: [
                    { title: "Mood Scoring Algorithm", desc: "A weighted mapping system that translates subjective moods into specific TMDB genre and popularity filters for high-precision discovery." },
                    { title: "Time Slot Engine", desc: "Calculates a dynamic 'fitScore' based on the delta between user availability and movie runtime, automatically prioritizing the films that best fit the schedule." },
                    { title: "Cinematic DNA Vector", desc: "A 5-axis metadata model (Action, Emotion, Tension, Thought, Lightheartedness) computed dynamically from genre weights and audience ratings." },
                    { title: "Cast & Genre Mixer", desc: "Implemented complex boolean logic for intersectional searches, allowing users to find crossover films where specific actors and genres overlap." }
                ],
                stack: ["React", "Express", "TMDB API", "Framer Motion", "Tailwind CSS", "Axios", "Lucide React"]
            }
        }
    ];

    return (
        <div id="projects" className="min-h-screen py-32 px-6 max-w-7xl mx-auto bg-transparent">
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl space-y-6 mb-20"
            >
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-[#e63946] uppercase tracking-[0.4em]">Portfolio</span>
                    <div className="flex-1 h-[1px] bg-black/5"></div>
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-[#1d3557] font-sans leading-none">
                    Architecture <br />Case Studies
                </h2>
                <p className="text-xl text-gray-500 font-sans leading-relaxed max-w-2xl font-medium">
                    A curated selection of engineering work. Beyond the interface, these studies detail the problems faced, the architectural decisions made, and the resulting business impact.
                </p>
            </motion.div>

            <div className="space-y-16">
                {projects.map((project, index) => (
                    <ProjectCard 
                        key={index} 
                        {...project} 
                        index={index} 
                        onClick={() => setSelectedProject(project)}
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal 
                        project={selectedProject} 
                        onClose={() => setSelectedProject(null)} 
                    />
                )}
            </AnimatePresence>
            
        </div>
    );
};

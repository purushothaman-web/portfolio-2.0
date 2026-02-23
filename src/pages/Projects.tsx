import { motion } from 'framer-motion';
import { Github, ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
    title: string;
    type: string;
    problem: string;
    architecture: string;
    impact: string;
    tags: string[];
    links: { github: string; live?: string };
    index: number;
}

const ProjectCard = ({ title, type, problem, architecture, impact, tags, links, index }: ProjectCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="group bg-white editorial-card rounded-3xl overflow-hidden flex flex-col lg:flex-row min-h-[400px]"
    >
        {/* Left Side: Context & Links */}
        <div className="lg:w-2/5 bg-[#fff9ed] p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/5">
            <div>
                <span className="text-xs font-sans font-bold text-[#e63946] uppercase tracking-widest block mb-4">Case Study {String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1d3557] font-sans mb-4">{title}</h3>
                <p className="text-sm font-sans text-gray-500 uppercase tracking-wider mb-8">{type}</p>
                
                <div className="flex flex-wrap gap-2 mb-10">
                    {tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white text-gray-600 rounded-full text-xs font-sans font-medium border border-gray-100 shadow-sm">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {links.live && (
                    <a
                        href={links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#1d3557] text-white px-6 py-3 rounded-xl font-sans font-semibold transition-all hover:bg-[#112240] hover:shadow-lg text-sm"
                    >
                        <span>Live Deployment</span>
                        <ArrowUpRight size={16} />
                    </a>
                )}
                {links.github && (
                    <a
                        href={links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 rounded-xl bg-white text-gray-600 hover:text-[#1d3557] border border-gray-200 transition-colors shadow-sm"
                        aria-label="GitHub Repository"
                    >
                        <Github size={20} />
                    </a>
                )}
            </div>
        </div>

        {/* Right Side: Narrative */}
        <div className="lg:w-3/5 p-10 lg:p-12 font-sans flex flex-col justify-center space-y-8">
            <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">The Problem</h4>
                <p className="text-gray-700 leading-relaxed">{problem}</p>
            </div>
            
            <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Architecture & Solution</h4>
                <p className="text-gray-700 leading-relaxed border-l-2 border-[#1d3557]/20 pl-4">{architecture}</p>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Impact</h4>
                <p className="text-gray-700 leading-relaxed">{impact}</p>
            </div>
        </div>
    </motion.div>
);

export const Projects = () => {
    const projects = [
        {
            title: 'DevDesk',
            type: 'Multi-Tenant SaaS Helpdesk',
            problem: 'Organizations struggle to manage B2B support tickets effectively while maintaining strict data isolation between different clients and enforcing varied permission levels for agents.',
            architecture: 'Engineered a scalable Node.js/Express backend with Prisma and PostgreSQL. Implemented secure Role-Based Access Control (RBAC) across multiple tiers and automated workflow states to isolate organizational data robustly.',
            impact: 'Delivered a high-performance support platform that securely segregates multi-tenant data, streamlining complex B2B ticket resolutions and providing global analytical oversight for administrators.',
            tags: ['React', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'RBAC'],
            links: {
                github: 'https://github.com/purushothaman-web/DevDesk',
                live: 'https://devdesk-ui.vercel.app/'
            }
        },
        {
            title: 'JobTrackr',
            type: 'Career Management System',
            problem: 'Job seekers often lose track of their applications, follow-up deadlines, and interview stages across dozens of varying platforms, leading to missed opportunities.',
            architecture: 'Built a specialized CRM for applicants utilizing secure JWT authentication, structured PostgreSQL relational tables for progress tracking, and scheduled cron jobs for automated email reminders.',
            impact: 'Created a centralized dashboard that automates organization, drastically reducing missed opportunities via smart alerts and providing CSV exports for offline data portability.',
            tags: ['React', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Cron'],
            links: {
                github: 'https://github.com/purushothaman-web/JobTrackr',
                live: 'https://jobtrackr-silk.vercel.app/'
            }
        },
        {
            title: 'ThiraiView',
            type: 'Dynamic Media Discovery',
            problem: 'Users suffer from choice paralysis when browsing standard movie catalogs that lack personalized, mood-based filtering or deep metadata exploration.',
            architecture: 'Integrated complex external data fetching from TMDB APIs with custom backend caching strategies and analytical aggregation to power features like the Mood Explorer and Movie DNA analysis.',
            impact: 'Broke standard catalog limitations by offering hyper-personalized recommendations, driving community engagement through verified reviews and unique cast-mixing queries.',
            tags: ['React', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'REST API'],
            links: {
                github: 'https://github.com/purushothaman-web/ThiraiView',
                live: 'https://thiraiview.vercel.app/'
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
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d3557] font-sans">
                    Architecture Case Studies
                </h2>
                <div className="w-16 h-1 bg-[#e63946] rounded-full"></div>
                <p className="text-lg text-gray-600 font-sans leading-relaxed">
                    A curated selection of engineering work. Rather than just showing the interface, these case studies detail the problems faced, the architectural decisions made, and the resulting impact.
                </p>
            </motion.div>

            <div className="space-y-12">
                {projects.map((project, index) => (
                    <ProjectCard key={index} {...project} index={index} />
                ))}
            </div>
            
        </div>
    );
};

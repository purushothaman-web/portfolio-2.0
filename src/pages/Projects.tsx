import { motion } from 'framer-motion';
import { Github, Terminal, Folder, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
    title: string;
    description: string;
    tags: string[];
    links: { github: string; live?: string };
    type: string;
}

const ProjectCard = ({ title, description, tags, links }: ProjectCardProps) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="w-full bg-[#1e1e1e] rounded-lg shadow-xl overflow-hidden border border-[#333] flex flex-col h-full"
    >
        {/* Terminal Header */}
        <div className="bg-[#252526] px-4 py-2 flex items-center gap-2 border-b border-[#333]">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="ml-4 text-gray-400 text-xs font-mono flex items-center gap-2">
                <Folder size={12} className="text-blue-400" />
                <span>~/projects/{title.toLowerCase().replace(/\s+/g, '-')}</span>
            </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-sm flex-1 flex flex-col">
            <div className="mb-4">
                <span className="text-green-400">➜</span> <span className="text-cyan-400">~</span> <span className="text-gray-300">cat description.txt</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 flex-1">
                {description}
            </p>

            {/* Tags usually displayed as 'ls' command or similar, but here as colored tags */}
            <div className="mb-6">
                <div className="mb-2">
                    <span className="text-green-400">➜</span> <span className="text-cyan-400">~</span> <span className="text-gray-300">echo $STACK</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-[#2d2d2d] text-cyan-300 rounded text-xs border border-[#444]">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Footer Links - styled as buttons */}
            <div className="pt-4 border-t border-[#333] flex items-center gap-4 mt-auto">
                {links.github && (
                    <a
                        href={links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs uppercase tracking-wider font-bold"
                    >
                        <Github size={14} />
                        Source Code
                    </a>
                )}
                {links.live && (
                    <a
                        href={links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-xs uppercase tracking-wider font-bold"
                    >
                        <ExternalLink size={14} />
                        Live Demo
                    </a>
                )}
            </div>
        </div>
    </motion.div>
);

export const Projects = () => {
    const projects = [
        {
            title: 'DevDesk',
            type: 'Backend-Focused Support Ticket System',
            description: 'DevDesk is a robust backend-focused support ticket system designed for efficient issue resolution. It features secure Role-Based Access Control (RBAC) via JWT, automated ticket workflows, and intelligent assignment management. Built on Node.js and PostgreSQL, it delivers a scalable architecture for handling complex support operations.',
            tags: ['Node.js', 'Express.js', 'Prisma', 'PostgreSQL', 'JWT', 'Zod', 'REST API'],
            links: {
                github: 'https://github.com/purushothaman-web/DevDesk'
            }
        },
        {
            title: 'JobTrackr',
            type: 'Full Stack Application',
            description: 'JobTrackr streamlines every step of your career journey with a powerful, automated application management system. Featuring Google Authentication, progress tracking, and smart email reminders, it helps users stay organized. With built-in CSV exports and robust validation, JobTrackr ensures you never miss an opportunity.',
            tags: ['React JS', 'Tailwind CSS', 'Node.js', 'Express JS', 'Prisma', 'PostgreSQL'],
            links: {
                github: 'https://github.com/purushothaman-web/JobTrackr',
                live: 'https://jobtrackr-silk.vercel.app/'
            }
        },
        {
            title: 'ThiraiView',
            type: 'Full Stack Application',
            description: 'ThiraiView revolutionizes movie discovery by matching films to your exact mood and preference. Powered by TMDB, it offers advanced tools like the Mood Explorer and Cast Mixer for deep-dive recommendations. Engage with a vibrant community through verified reviews and Movie DNA analysis for a truly personalized cinematic experience.',
            tags: ['React JS', 'TailwindCSS', 'Node.js', 'Express JS', 'Prisma', 'PostgreSQL'],
            links: {
                github: 'https://github.com/purushothaman-web/ThiraiView',
                live: 'https://thiraiview.vercel.app/'
            }
        }
    ];

    return (
        <div id="projects" className="min-h-screen py-24 px-6 bg-gray-50 dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
            >
                <div className="space-y-4">
                    <div className="inline-flex items-center space-x-2 text-sm font-mono text-cyan-600 dark:text-cyan-400">
                        <Terminal size={16} />
                        <span>ls ./projects</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Featured Work</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                        A collection of full-stack web applications and experiments.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} {...project} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

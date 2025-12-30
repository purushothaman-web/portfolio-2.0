import { motion } from 'framer-motion';
import { Layout, Command, Server, Activity, Terminal } from 'lucide-react';

import { LucideIcon } from 'lucide-react';

interface Skill {
    name: string;
    level: number;
}

interface SkillGroupProps {
    title: string;
    icon: LucideIcon;
    skills: Skill[];
    delay: number;
}

const SkillGroup = ({ title, icon: Icon, skills, delay }: SkillGroupProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-[#1e1e1e] rounded-lg border border-[#333] overflow-hidden"
    >
        {/* Header */}
        <div className="bg-[#252526] px-4 py-3 border-b border-[#333] flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Icon size={16} className="text-cyan-400" />
                <span className="font-mono text-sm font-bold text-gray-200 uppercase tracking-wider">{title}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-mono text-green-500">RUNNING</span>
            </div>
        </div>

        {/* Content */}
        <div className="p-4">
            <div className="grid grid-cols-1 gap-2">
                {skills.map((skill, index) => (
                    <div key={skill.name} className="flex items-center justify-between p-2 rounded hover:bg-[#2d2d2d] group transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-gray-500 w-6 text-right">0{index + 1}</span>
                            <span className="text-gray-300 font-mono text-sm group-hover:text-cyan-400 transition-colors">{skill.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block w-24 h-1.5 bg-[#333] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, delay: delay + 0.5 + (index * 0.1) }}
                                    className="h-full bg-cyan-600 dark:bg-cyan-500"
                                />
                            </div>
                            <span className="font-mono text-xs text-gray-500">{skill.level}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
);

export const Skills = () => {
    const frontendSkills = [
        { name: 'React.js', level: 95 },
        { name: 'Tailwind CSS', level: 90 },
        { name: 'JavaScript (ES6+)', level: 90 },
        { name: 'HTML5/CSS3', level: 95 }
    ];

    const backendSkills = [
        { name: 'Node.js', level: 88 },
        { name: 'Express.js', level: 90 },
        { name: 'MongoDB', level: 85 },
        { name: 'Mongoose', level: 85 },
        { name: 'PostgreSQL', level: 80 },
        { name: 'Prisma ORM', level: 85 }
    ];

    const toolsSkills = [
        { name: 'Git & GitHub', level: 90 },
        { name: 'VS Code', level: 95 },
        { name: 'Postman', level: 85 },
        { name: 'Vite', level: 90 },
        { name: 'NPM', level: 88 }
    ];

    return (
        <div className="min-h-screen py-24 px-6 max-w-5xl mx-auto">
            <div className="space-y-8">

                {/* Dashboard Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6"
                >
                    <div className="space-y-2">
                        <div className="inline-flex items-center space-x-2 text-sm font-mono text-cyan-600 dark:text-cyan-400">
                            <Activity size={16} />
                            <span>SYSTEM_DIAGNOSTICS</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">System Status</h1>
                    </div>
                    <div className="flex gap-6 font-mono text-sm text-gray-500">
                        <div>
                            <span className="block text-xs uppercase tracking-wider text-gray-400">Uptime</span>
                            <span className="text-gray-900 dark:text-white">99.9%</span>
                        </div>
                        <div>
                            <span className="block text-xs uppercase tracking-wider text-gray-400">Memory</span>
                            <span className="text-green-500">Normal</span>
                        </div>
                        <div>
                            <span className="block text-xs uppercase tracking-wider text-gray-400">Location</span>
                            <span className="text-gray-900 dark:text-white">India</span>
                        </div>
                    </div>
                </motion.div>

                {/* Skills Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SkillGroup
                        title="Frontend_Svc"
                        icon={Layout}
                        skills={frontendSkills}
                        delay={0.1}
                    />
                    <SkillGroup
                        title="Backend_Proc"
                        icon={Server}
                        skills={backendSkills}
                        delay={0.2}
                    />
                    <SkillGroup
                        title="Tools_Utils"
                        icon={Command}
                        skills={toolsSkills}
                        delay={0.3}
                    />
                </div>

                {/* System Logs / Extra Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-[#1e1e1e] rounded-lg border border-[#333] p-4 font-mono text-xs sm:text-sm text-gray-400"
                >
                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                        <Terminal size={14} />
                        <span>Logs</span>
                    </div>
                    <div className="space-y-1">
                        <p><span className="text-green-500">✓</span> Initializing skill stack...</p>
                        <p><span className="text-green-500">✓</span> Loaded React ecosystem modules.</p>
                        <p><span className="text-green-500">✓</span> Database connections established (Mongo/Postgres).</p>
                        <p className="animate-pulse"><span className="text-cyan-500">ℹ</span> Ready for new challenges...</p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

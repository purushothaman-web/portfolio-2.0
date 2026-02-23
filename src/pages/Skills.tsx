import { motion } from 'framer-motion';
import { Database, Server, LayoutTemplate, Layers } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Skill {
    name: string;
    description?: string;
}

interface SkillGroupProps {
    title: string;
    description: string;
    icon: LucideIcon;
    skills: Skill[];
    delay: number;
}

const SkillGroup = ({ title, description, icon: Icon, skills, delay }: SkillGroupProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="bg-white editorial-card rounded-2xl flex flex-col h-full overflow-hidden"
    >
        {/* Header */}
        <div className="bg-[#fff9ed] px-8 py-6 border-b border-black/5 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1d3557] mb-2">
                <Icon size={24} />
            </div>
            <h3 className="font-sans text-xl font-bold text-[#1d3557] tracking-tight">{title}</h3>
            <p className="text-gray-500 text-sm font-sans leading-relaxed">{description}</p>
        </div>

        {/* Content */}
        <div className="p-8 flex-grow bg-white">
            <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                    <div 
                        key={skill.name} 
                        className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-sans font-medium text-gray-700 hover:border-[#1d3557] hover:text-[#1d3557] transition-colors"
                    >
                        {skill.name}
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
);

export const Skills = () => {
    const dataSkills = [
        { name: 'PostgreSQL' },
        { name: 'MongoDB' },
        { name: 'Prisma ORM' },
        { name: 'Mongoose' },
        { name: 'Redis' },
        { name: 'Docker' }
    ];

    const logicSkills = [
        { name: 'Node.js' },
        { name: 'Express.js' },
        { name: 'RESTful APIs' },
        { name: 'Authentication (JWT)' },
        { name: 'System Architecture' },
        { name: 'Git & GitHub' }
    ];

    const clientSkills = [
        { name: 'React.js' },
        { name: 'Tailwind CSS' },
        { name: 'JavaScript (ES6+)' },
        { name: 'TypeScript' },
        { name: 'Framer Motion' },
        { name: 'Responsive Design' }
    ];

    return (
        <div id="skills" className="min-h-screen py-32 px-6 max-w-7xl mx-auto bg-transparent relative">
            <div className="absolute right-12 top-40 text-gray-100 select-none z-[-1] opacity-50">
                <Layers size={400} strokeWidth={0.5} />
            </div>

            <div className="space-y-16 relative z-10">

                {/* Editorial Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl space-y-6"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d3557] font-sans">
                        Technical Arsenal
                    </h2>
                    <div className="w-16 h-1 bg-[#e63946] rounded-full"></div>
                    <p className="text-lg text-gray-600 font-sans leading-relaxed">
                        My expertise is organized around the core pillars of modern web architecture. I build systems from the ground up—starting with solid data foundations, implementing robust business logic, and finishing with seamless client interfaces.
                    </p>
                </motion.div>

                {/* Skills Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SkillGroup
                        title="Data & Infrastructure"
                        description="Designing resilient schemas, managing state, and ensuring data integrity across relational and NoSQL databases."
                        icon={Database}
                        skills={dataSkills}
                        delay={0.1}
                    />
                    <SkillGroup
                        title="Business Logic"
                        description="Building the hidden connective tissue. Secure APIs, efficient routing, and scalable server-side processing."
                        icon={Server}
                        skills={logicSkills}
                        delay={0.2}
                    />
                    <SkillGroup
                        title="Client Interface"
                        description="Translating complex server interactions into intuitive, responsive, and pixel-perfect user experiences."
                        icon={LayoutTemplate}
                        skills={clientSkills}
                        delay={0.3}
                    />
                </div>

            </div>
        </div>
    );
};

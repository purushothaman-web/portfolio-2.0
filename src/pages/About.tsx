import { motion } from 'framer-motion';
import { Terminal, Briefcase } from 'lucide-react';

interface TimelineItemProps {
    year: string;
    title: string;
    subtitle: string;
    description?: string;
    type?: 'work' | 'education';
}

const TimelineItem = ({ year, title, subtitle, description, type }: TimelineItemProps) => (
    <div className="group relative border-l-2 border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 pl-8 pb-12 last:pb-0 transition-colors duration-300">
        {/* Dot */}
        <div className={`absolute -left-[6px] top-2 h-2.5 w-2.5 rounded-full transition-colors duration-300 ${type === 'work' ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-700 group-hover:bg-gray-500 dark:group-hover:bg-gray-500'
            }`} />

        {/* Content */}
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">{year}</span>

            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {title}
                </h3>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{subtitle}</span>
            </div>

            {description && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500 leading-relaxed max-w-xl">
                    {description}
                </p>
            )}
        </div>
    </div>
);

export const About = () => {
    return (
        <div id="about" className="min-h-screen py-24 px-6 max-w-5xl mx-auto bg-white dark:bg-gray-950">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24"
            >
                {/* Left Column: Fixed Bio */}
                <div className="lg:sticky lg:top-32 h-fit space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center space-x-2 text-sm font-mono text-cyan-600 dark:text-cyan-400">
                            <Terminal size={16} />
                            <span>README.md</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">About Me</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            Web Developer with hands-on experience in building full-stack web applications.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Briefcase size={16} />
                            Currently
                        </h3>
                        <div className="space-y-1">
                            <div className="font-semibold text-gray-900 dark:text-white">Web Developer</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Rapsol Technologies Pvt Ltd</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                Active
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Minimal Timeline */}
                <div className="pt-2">
                    <div className="space-y-2">
                        <TimelineItem
                            year="Feb 2025 - Present"
                            title="Web Developer"
                            subtitle="Rapsol Technologies Pvt Ltd"
                            description="Building scalable frontend architectures and integrating RESTful APIs for client-facing applications."
                            type="work"
                        />
                        <TimelineItem
                            year="2017 - 2020"
                            title="Bachelor of Computer Applications"
                            subtitle="Dr. MGR Chockalingam Arts and Science College"
                            description="Graduated with 70.29%. Specialized in Web Technologies and Database Management."
                        />
                        <TimelineItem
                            year="2017"
                            title="Higher Secondary Certificate"
                            subtitle="Government Hr. Sec. School"
                            description="Focused on Science and Mathematics."
                        />
                        <TimelineItem
                            year="2015"
                            title="SSLC"
                            subtitle="Government High School"
                            description="Completed secondary education with 73%."
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

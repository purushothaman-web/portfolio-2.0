import { motion } from 'framer-motion';
import { Briefcase, MapPin, GraduationCap } from 'lucide-react';

export const About = () => {
    return (
        <div id="about" className="min-h-screen py-32 px-6 max-w-6xl mx-auto bg-transparent">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-12 gap-16 lg:gap-24"
            >
                {/* Left Column: Fixed Bio Overview */}
                <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32 h-fit">
                    {/* Profile Photo */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative w-full rounded-2xl overflow-hidden editorial-card"
                    >
                        <img
                            src="/photo.webp"
                            alt="Purushothaman R"
                            className="w-full object-cover object-top aspect-[4/5]"
                        />
                        {/* Brand accent stripe */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1d3557] to-[#e63946]" />
                    </motion.div>

                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight text-[#1d3557] font-sans">
                            The Architect Behind the Interface.
                        </h2>
                        <div className="w-12 h-1 bg-[#e63946] rounded-full"></div>
                        <p className="text-gray-600 leading-relaxed font-sans text-lg">
                            I am a highly motivated engineer who blends a passion for problem-solving with rigorous, clean architecture.
                        </p>
                    </div>

                    <div className="p-8 bg-white editorial-card rounded-2xl flex flex-col gap-6">
                        <div>
                            <span className="text-xs font-sans font-bold text-gray-400 uppercase tracking-wider block mb-2">Current Role</span>
                            <div className="flex items-start gap-3">
                                <Briefcase className="text-[#1d3557] mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h3 className="font-bold text-[#1d3557] text-lg font-sans">Web Developer</h3>
                                    <p className="text-gray-600 text-sm">Rapsol Technologies Pvt Ltd</p>
                                    <p className="text-gray-400 text-xs mt-1">Feb 2025 &mdash; Present</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 w-full" />

                        <div>
                            <span className="text-xs font-sans font-bold text-gray-400 uppercase tracking-wider block mb-2">Base of Operations</span>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-[#1d3557] flex-shrink-0" size={20} />
                                <div>
                                    <span className="text-gray-600 font-sans font-medium block">Bangalore, KA</span>
                                    <span className="text-gray-400 font-sans text-sm">Originally from Vellore, TN</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: The Engineering Journey */}
                <div className="lg:col-span-8 flex flex-col justify-center space-y-16">
                    
                    {/* Story Section */}
                    <div className="space-y-8 text-lg text-gray-700 font-sans leading-relaxed">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            My engineering journey began on the surface: crafting pixel-perfect, responsive interfaces as a frontend developer at my current company. I loved the immediate visual feedback of translating designs into interactive web components, ensuring users had a smooth, intuitive experience.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            However, as the applications I built grew in complexity, I found myself increasingly drawn to what was happening <span className="font-semibold italic text-[#1d3557]">behind the scenes</span>. I wanted to understand how data was structured, how requests were routed, and how systems could be optimized to serve thousands of users without buckling under pressure.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="p-8 my-10 border-l-4 border-[#e63946] bg-white editorial-card rounded-r-2xl"
                        >
                            <p className="text-xl font-medium text-[#1d3557] italic leading-relaxed">
                                "The shift to backend architecture wasn't just a change in tech stack; it was a shift in mindset. I transitioned from asking 'How should this look?' to 'How can this scale, remain secure, and execute flawlessly?'"
                            </p>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            That curiosity triggered my deep dive into the backend. I immersed myself in Node.js, Express, and rigorous database design with PostgreSQL and MongoDB. Today, my dual perspective allows me to architect robust, secure server infrastructures while perfectly anticipating the needs of the client-side interface that will consume them.
                        </motion.p>
                    </div>

                    {/* Education Timeline */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="pt-12 border-t border-gray-200"
                    >
                        <h3 className="text-xs font-sans font-bold text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                            <GraduationCap size={16} className="text-[#e63946]" />
                            Academic Foundation
                        </h3>

                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                            {/* Education Item 1 */}
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-[#e63946] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] bg-white editorial-card p-6 rounded-2xl">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-[#1d3557]">Bachelor of Computer Applications</div>
                                        <time className="font-mono text-xs font-medium text-[#e63946]">2017 - 2020</time>
                                    </div>
                                    <div className="text-gray-500 text-sm mb-2">Dr. MGR Chockalingam Arts and Science College</div>
                                    <div className="text-gray-600 text-sm">Graduated with 70.29%. Specialized in Web Technologies, Software Engineering, and Database Management Systems.</div>
                                </div>
                            </div>

                            {/* Education Item 2 */}
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-gray-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:bg-[#1d3557] transition-colors"></div>
                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] bg-white editorial-card p-6 rounded-2xl">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-[#1d3557]">Higher Secondary Certificate</div>
                                        <time className="font-mono text-xs font-medium text-gray-500">2017</time>
                                    </div>
                                    <div className="text-gray-500 text-sm mb-2">Government Hr. Sec. School</div>
                                    <div className="text-gray-600 text-sm">Focused on Science and Mathematics. Developed core analytical logic.</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
};

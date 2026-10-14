import { Github, Mail, MapPin, ArrowUpRight, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';
import { scrollToSection } from '../../utils/scrollToSection';

const Footer = () => {
    const navLinks = [
        { name: 'About', anchor: 'about' },
        { name: 'Projects', anchor: 'projects' },
        { name: 'Skills', anchor: 'skills' },
        { name: 'GitHub Activity', anchor: 'github' },
        { name: 'Certifications', anchor: 'achievements' },
        { name: 'Contact', anchor: 'contact' },
    ];

    return (
        <footer className="w-full bg-white border-t border-slate-200/80 relative text-slate-800">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-12">
                    {/* Brand Column (5 cols) */}
                    <div className="md:col-span-5 space-y-5">
                        <Logo />
                        <p className="text-slate-600 font-sans text-sm leading-relaxed max-w-sm">
                            Full-Stack Web Developer building high-performance web applications, reliable backend APIs, and intuitive digital experiences.
                        </p>
                        <div className="flex items-center gap-2.5 pt-1">
                            <a
                                href="https://github.com/purushothaman-web"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 hover:text-white hover:bg-slate-900 transition-all border border-slate-200 flex items-center justify-center shadow-2xs"
                                aria-label="GitHub"
                            >
                                <Github size={17} />
                            </a>
                            <a
                                href="https://linkedin.com/in/purushothaman-web/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all border border-slate-200 flex items-center justify-center shadow-2xs"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={17} />
                            </a>
                            <a
                                href="mailto:rpurushothaman500@gmail.com"
                                className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all border border-slate-200 flex items-center justify-center shadow-2xs"
                                aria-label="Email"
                            >
                                <Mail size={17} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Navigation Links (3 cols) */}
                    <div className="md:col-span-3 space-y-4">
                        <h4 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider">Navigation</h4>
                        <ul className="space-y-2.5">
                            {navLinks.map(link => (
                                <li key={link.anchor}>
                                    <button
                                        onClick={() => scrollToSection(link.anchor)}
                                        className="text-sm font-sans text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1 group cursor-pointer"
                                    >
                                        <span>{link.name}</span>
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Availability Column (4 cols) */}
                    <div className="md:col-span-4 space-y-4">
                        <h4 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider">Get in Touch</h4>
                        <div className="space-y-3 text-sm">
                            <a
                                href="mailto:rpurushothaman500@gmail.com"
                                className="flex items-center gap-2.5 text-slate-700 hover:text-blue-600 transition-colors group"
                            >
                                <Mail size={15} className="text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                                <span className="break-all font-sans text-xs sm:text-sm font-medium">rpurushothaman500@gmail.com</span>
                            </a>
                            <div className="flex items-center gap-2.5 text-slate-700">
                                <MapPin size={15} className="text-slate-400 shrink-0" />
                                <span className="font-sans text-xs sm:text-sm">Bangalore, India &middot; Open to remote & onsite</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <motion.a
                                href="https://drive.google.com/file/d/1aeViz7uwM3vV70w7euYgX8wvTPPV0H5Z/view?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -1 }}
                                whileTap={{ y: 0.5 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                                className="relative overflow-hidden inline-flex items-center gap-2 text-xs font-sans font-semibold text-slate-800 border border-slate-200/90 rounded-xl px-4 py-2.5 transition-all bg-white shadow-2xs hover:shadow-xs group cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-linear-to-r before:from-transparent before:via-blue-500/10 before:to-transparent before:transition-transform before:duration-700 before:ease-out"
                            >
                                <span>View Resume</span>
                                <ArrowUpRight size={13} className="text-slate-500 group-hover:text-blue-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </motion.a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-sans">
                    <p>
                        &copy; {new Date().getFullYear()} Purushothaman R. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-slate-400">
                        <span>Built with React & Tailwind CSS</span>
                        <span>&middot;</span>
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            Available for hire
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


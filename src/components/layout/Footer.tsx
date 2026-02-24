import { Github, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import Logo from '../ui/Logo';
import { scrollToSection } from '../../utils/scrollToSection';

const Footer = () => {
    const navLinks = [
        { name: 'About', anchor: 'about' },
        { name: 'Projects', anchor: 'projects' },
        { name: 'Skills', anchor: 'skills' },
        { name: 'Achievements', anchor: 'achievements' },
        { name: 'Contact', anchor: 'contact' },
    ];

    return (
        <footer className="w-full bg-white border-t border-black/5 relative text-gray-800">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="md:col-span-5 space-y-6">
                        <Logo />
                        <p className="text-gray-500 font-sans text-sm leading-relaxed max-w-xs">
                            Full-stack developer specializing in scalable backend systems and clean API architecture. Building systems that are resilient by design.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://github.com/purushothaman-web"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-[#1d3557] hover:bg-[#fff9ed] transition-all border border-gray-100"
                                aria-label="GitHub"
                            >
                                <Github size={18} />
                            </a>
                            <a
                                href="mailto:rpurushothaman500@gmail.com"
                                className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-[#e63946] hover:bg-[#fff9ed] transition-all border border-gray-100"
                                aria-label="Email"
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 space-y-5">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Navigation</h4>
                        <ul className="space-y-3">
                            {navLinks.map(link => (
                                <li key={link.anchor}>
                                    <button
                                        onClick={() => scrollToSection(link.anchor)}
                                        className="text-sm font-sans text-gray-600 hover:text-[#e63946] transition-colors flex items-center gap-1 group"
                                    >
                                        {link.name}
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="md:col-span-4 space-y-5">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Get in Touch</h4>
                        <div className="space-y-4">
                            <a href="mailto:rpurushothaman500@gmail.com" className="flex items-start gap-3 text-sm text-gray-600 hover:text-[#e63946] transition-colors group">
                                <Mail size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="break-all">rpurushothaman500@gmail.com</span>
                            </a>
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="block font-medium text-gray-700">Bangalore, KA</span>
                                    <span className="text-xs text-gray-400">Originally from Vellore, TN</span>
                                </div>
                            </div>
                        </div>
                        <a
                            href="https://drive.google.com/file/d/1aeViz7uwM3vV70w7euYgX8wvTPPV0H5Z/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1d3557] border border-[#1d3557]/20 rounded-lg px-4 py-2.5 hover:bg-[#1d3557] hover:text-white transition-all"
                        >
                            View Resume
                            <ArrowUpRight size={14} />
                        </a>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400 font-sans">
                        &copy; {new Date().getFullYear()} Purushothaman R. All Rights Reserved.
                    </p>
                    <p className="text-xs text-gray-300 font-sans italic">
                        Designed & built with care in India.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

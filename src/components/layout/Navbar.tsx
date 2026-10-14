import { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';
import { scrollToSection, useActiveSection, useHashNavigation, useKeyboardNavigation } from '../../utils/scrollToSection';

const navLinks = [
    { name: 'Home',         anchor: 'hero' },
    { name: 'About',        anchor: 'about' },
    { name: 'Projects',     anchor: 'projects' },
    { name: 'Skills',       anchor: 'skills' },
    { name: 'GitHub',       anchor: 'github' },
    { name: 'Achievements', anchor: 'achievements' },
    { name: 'Contact',      anchor: 'contact' },
];

const sectionIds = navLinks.map(link => link.anchor);

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const activeSection = useActiveSection(sectionIds);

    useHashNavigation(sectionIds);
    useKeyboardNavigation(sectionIds, activeSection);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (anchor: string) => {
        setIsOpen(false);
        setTimeout(() => {
            scrollToSection(anchor);
        }, 100);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3.5'
                    : 'bg-transparent py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo & Brand Link */}
                <div className="flex items-center space-x-4">
                    <button onClick={() => scrollToSection('hero')} aria-label="Home" className="focus:outline-none cursor-pointer">
                        <Logo />
                    </button>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center space-x-8">
                    <ul className="flex space-x-7">
                        {navLinks.map((link) => (
                            <li key={link.anchor}>
                                <button
                                    onClick={() => handleNavClick(link.anchor)}
                                    className={`text-sm font-sans tracking-wide transition-all duration-200 relative py-1 cursor-pointer ${
                                        activeSection === link.anchor
                                            ? 'text-slate-900 font-bold'
                                            : 'text-slate-600 hover:text-blue-600 font-medium'
                                    }`}
                                >
                                    {link.name}
                                    {activeSection === link.anchor && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                                        />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Resume CTA */}
                    <div className="flex items-center pl-7 border-l border-slate-200">
                        <motion.a
                            href="https://drive.google.com/file/d/1aeViz7uwM3vV70w7euYgX8wvTPPV0H5Z/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 0.5 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                            className="relative overflow-hidden flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-sans font-semibold tracking-wide shadow-[0_2px_8px_rgba(15,23,42,0.12)] hover:shadow-[0_6px_16px_rgba(15,23,42,0.22)] transition-all cursor-pointer group before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700 before:ease-out"
                        >
                            <FileText size={13} className="transition-transform duration-200 group-hover:-rotate-12" />
                            <span>Resume</span>
                        </motion.a>
                    </div>
                </div>

                {/* Mobile Menu Trigger */}
                <div className="lg:hidden flex items-center space-x-4">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Navigation Menu"
                        className="p-2 border border-slate-200 rounded-xl bg-white text-slate-800 hover:bg-slate-50 focus:outline-none cursor-pointer shadow-2xs"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 overflow-hidden shadow-xl absolute w-full"
                    >
                        <div className="px-6 py-7 space-y-5 flex flex-col font-sans">
                            {navLinks.map((link) => (
                                <button
                                    key={link.anchor}
                                    onClick={() => handleNavClick(link.anchor)}
                                    className={`text-xl font-normal tracking-wide transition-colors text-left flex items-center ${
                                        activeSection === link.anchor
                                            ? 'text-blue-600 font-bold'
                                            : 'text-slate-800 hover:text-blue-600'
                                    }`}
                                >
                                    {link.name}
                                </button>
                            ))}
                            <div className="pt-6 mt-2 border-t border-slate-100">
                                <motion.a
                                    href="https://drive.google.com/file/d/1aeViz7uwM3vV70w7euYgX8wvTPPV0H5Z/view?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileTap={{ y: 0.5 }}
                                    className="relative overflow-hidden flex items-center justify-center space-x-2 px-4 py-3.5 bg-slate-900 rounded-xl text-white shadow-md text-sm font-semibold tracking-wide w-full cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700 before:ease-out"
                                >
                                    <FileText size={16} />
                                    <span>Download Resume</span>
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
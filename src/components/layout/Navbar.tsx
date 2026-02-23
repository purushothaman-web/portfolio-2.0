import { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';
import { scrollToSection, useActiveSection, useHashNavigation, useKeyboardNavigation } from '../../utils/scrollToSection';

const navLinks = [
    { name: 'Home', anchor: 'hero' },
    { name: 'About', anchor: 'about' },
    { name: 'Projects', anchor: 'projects' },
    { name: 'Skills', anchor: 'skills' },
    { name: 'Achievements', anchor: 'achievements' },
    { name: 'Contact', anchor: 'contact' },
];

const sectionIds = navLinks.map(link => link.anchor);

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const activeSection = useActiveSection(sectionIds);
    
    useHashNavigation(sectionIds);
    useKeyboardNavigation(sectionIds, activeSection);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (anchor: string) => {
        scrollToSection(anchor);
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-[#fff9ed]/90 backdrop-blur-md border-b border-black/5 py-4'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo */}
                <button onClick={() => scrollToSection('hero')} aria-label="Home" className="focus:outline-none">
                    <Logo />
                </button>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-8">
                    <ul className="flex space-x-8">
                        {navLinks.map((link) => (
                            <li key={link.anchor}>
                                <button
                                    onClick={() => handleNavClick(link.anchor)}
                                    className={`text-sm font-sans tracking-wide transition-all duration-300 relative py-1 ${activeSection === link.anchor
                                        ? 'text-[#1d3557] font-semibold'
                                        : 'text-gray-500 hover:text-black'
                                        }`}
                                >
                                    {link.name}
                                    {activeSection === link.anchor && (
                                        <motion.div 
                                            layoutId="nav-indicator"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#e63946]" 
                                        />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center pl-8 border-l border-gray-200">
                        <a
                            href="https://drive.google.com/file/d/1aeViz7uwM3vV70w7euYgX8wvTPPV0H5Z/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-5 py-2.5 bg-white text-black editorial-card rounded-full text-xs font-sans font-semibold uppercase tracking-wider hover:text-[#e63946]"
                        >
                            <FileText size={14} />
                            <span>Resume</span>
                        </a>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center space-x-4">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 border border-black/10 rounded-full bg-white text-black focus:outline-none"
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
                        className="lg:hidden bg-[#fff9ed] border-b border-black/10 overflow-hidden shadow-2xl absolute w-full"
                    >
                        <div className="px-6 py-8 space-y-6 flex flex-col font-sans">
                            {navLinks.map((link) => (
                                <button
                                    key={link.anchor}
                                    onClick={() => handleNavClick(link.anchor)}
                                    className={`text-2xl font-light tracking-wide transition-colors text-left flex items-center ${activeSection === link.anchor
                                        ? 'text-[#e63946] font-medium'
                                        : 'text-gray-800'
                                        }`}
                                >
                                    {link.name}
                                </button>
                            ))}
                            <div className="pt-8 mt-4 border-t border-black/10">
                                <a
                                    href="https://drive.google.com/file/d/1aeViz7uwM3vV70w7euYgX8wvTPPV0H5Z/view?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center space-x-2 px-4 py-4 bg-[#1d3557] rounded-xl text-white shadow-xl text-sm font-semibold uppercase tracking-wider w-full"
                                >
                                    <FileText size={18} />
                                    <span>Download Resume</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

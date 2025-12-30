import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ui/ThemeToggle';
import Logo from '../ui/Logo';

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsOpen(false);
    }, [location]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo - Minimal & Clean */}
                <Link to="/" aria-label="Home">
                    <Logo className="w-10 h-10" />
                </Link>

                {/* Desktop Navigation - The "Ghost" Links */}
                <div className="hidden lg:flex items-center space-x-8">
                    <ul className="flex space-x-8">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors duration-200 ${location.pathname === link.path
                                        ? 'text-black dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-800">
                        <ThemeToggle />
                        <a
                            href="/Purushothaman_R_Web_Developer.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                        >
                            <FileText size={16} />
                            <span>Resume</span>
                        </a>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center space-x-4">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-900 dark:text-gray-100 focus:outline-none"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
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
                        className="lg:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="px-6 py-6 space-y-4 flex flex-col">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-lg font-medium transition-colors ${location.pathname === link.path
                                        ? 'text-black dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <a
                                    href="/Purushothaman_R_Web_Developer.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium w-full"
                                >
                                    <FileText size={18} />
                                    <span>View Resume</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

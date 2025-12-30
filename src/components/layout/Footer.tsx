import { Github, Mail } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer = () => {
    return (
        <footer className="w-full bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Left Side: Brand & Tagline */}
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                    <Logo className="w-10 h-10" />
                    <span className="hidden md:block h-4 w-px bg-gray-300 dark:bg-gray-700"></span>
                    <p className="text-gray-500 dark:text-gray-400 font-light text-sm max-w-md">
                        Building elegant digital solutions with a focus on user experience.
                    </p>
                </div>

                {/* Right Side: Icons & Copyright */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Icons */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/purushothaman-web"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors"
                            aria-label="GitHub"
                        >
                            <Github size={18} />
                        </a>
                        <a
                            href="mailto:rpurushothaman500@gmail.com"
                            className="text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors"
                            aria-label="Email"
                        >
                            <Mail size={18} />
                        </a>
                    </div>

                    {/* Copyright (Hidden on small mobile if needed, or stacked) */}
                    <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">
                        &copy; 2025 | Built with React & Tailwind
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;

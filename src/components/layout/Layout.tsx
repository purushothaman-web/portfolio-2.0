import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import TerminalModal from '../features/TerminalModal';
import BackToTop from '../ui/BackToTop';
import ScrollProgress from '../ui/ScrollProgress';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <ScrollProgress />
            <Navbar />
            <TerminalModal />
            <main className="flex-grow pt-16">
                {children}
            </main>
            <Footer />
            <BackToTop />
        </div>
    );
}

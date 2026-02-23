import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from '../ui/BackToTop';
import ScrollProgress from '../ui/ScrollProgress';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-transparent text-[#111]">
            <ScrollProgress />
            <Navbar />
            <main className="flex-grow pt-16">
                {children}
            </main>
            <Footer />
            <BackToTop />
        </div>
    );
}

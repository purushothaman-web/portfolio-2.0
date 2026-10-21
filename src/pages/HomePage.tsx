import Home from './Home';
import { About } from './About';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { GitHubActivity } from '../components/sections/GitHubActivity';
import { Achievements } from './Achievements';
import { Contact } from './Contact';

export default function HomePage() {
    return (
        <div className="flex flex-col w-full">
            {/* 1. Hero (Odd - Pure White) */}
            <div className="w-full bg-white">
                <Home />
            </div>

            {/* 2. About & Experience (Even - Soft Slate) */}
            <div className="w-full bg-slate-50/80 border-y border-slate-200/60">
                <About />
            </div>

            {/* 3. Featured Projects (Odd - Pure White) */}
            <div className="w-full bg-white">
                <Projects />
            </div>

            {/* 4. Skills & Toolbox (Even - Soft Slate) */}
            <div className="w-full bg-slate-50/80 border-y border-slate-200/60">
                <Skills />
            </div>

            {/* 5. GitHub Activity (Odd - Pure White) */}
            <div className="w-full bg-white">
                <GitHubActivity />
            </div>

            {/* 6. Achievements & Certifications (Even - Soft Slate) */}
            <div className="w-full bg-slate-50/80 border-y border-slate-200/60">
                <Achievements />
            </div>

            {/* 7. Contact (Odd - Pure White) */}
            <div className="w-full bg-white">
                <Contact />
            </div>
        </div>
    );
}
import { motion } from 'framer-motion';
import { Github, ExternalLink, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Project {
    id: string;
    num: string;
    title: string;
    subtitle: string;
    category: 'live' | 'repo' | 'enterprise';
    badge: string;
    badgeStyle: string;
    description: string[];
    highlights: { title: string; desc: string }[];
    metricBadge: { label: string; value: string };
    tags: string[];
    links: { github?: string; live?: string };
}

const PROJECTS: Project[] = [
    {
        id: 'instigar-erp',
        num: '01',
        title: 'Instigar ERP',
        subtitle: 'Core Enterprise Management Platform',
        category: 'enterprise',
        badge: 'Enterprise Production Core',
        badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        description: [
            'Instigar is a comprehensive enterprise management platform designed to run entire educational institutions. Before this system, colleges and academies were managing thousands of student inquiries, admissions, and course schedules using fragmented manual spreadsheets, resulting in lost student leads, untracked fees, and frequent scheduling clashes.',
            'I engineered three foundational modules for the platform: an end-to-end Student Admission engine that automates document queues and fee installments, a Counselor Lead CRM that automatically routes incoming student inquiries to prevent drop-offs, and an Academic Core that generates conflict-free class timetables across multiple faculty departments.'
        ],
        highlights: [
            { title: 'Student Admission Engine', desc: 'Step-by-step registration, automated fee installment schedules, and document verification queues.' },
            { title: 'Counselor Lead CRM', desc: 'Centralized inquiry tracking with automated assignment algorithms to prevent lost student leads.' },
            { title: 'Timetable & Scheduling Core', desc: 'Conflict-free classroom batching, faculty mapping, and weekly lecture schedules.' }
        ],
        metricBadge: { label: 'Operational Impact', value: '100% Automated Student Pipelines' },
        tags: ['Modular Monolith', 'Node.js', 'Express', 'PostgreSQL', 'Prisma ORM', 'Multi-Tenancy', 'RBAC'],
        links: {}
    },
    {
        id: 'devdesk',
        num: '02',
        title: 'DevDesk',
        subtitle: 'Multi-Tenant Support & Help Desk Platform',
        category: 'live',
        badge: 'Deployed · Live SaaS',
        badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200/80',
        description: [
            'DevDesk is a full-featured customer support platform built to solve multi-organization ticket management. Many support teams struggle with data leaks between different client accounts and miss critical resolution deadlines because they lack automated tracking.',
            'I built DevDesk with true multi-tenancy, ensuring each company\'s tickets and user data are strictly isolated in their own private workspace. It includes an automated background worker that continuously monitors response times against SLA deadlines and alerts managers before a ticket breaches its resolution target.'
        ],
        highlights: [
            { title: 'Isolated Company Workspaces', desc: 'Strict security boundaries ensuring customer tickets and data are never mixed across organizations.' },
            { title: 'Automated Response Timers', desc: 'Background monitor that automatically flags tickets taking too long and notifies managers.' },
            { title: 'Full Activity History', desc: 'Step-by-step audit logs of who opened, replied to, and resolved every customer ticket.' }
        ],
        metricBadge: { label: 'Security Architecture', value: 'Guaranteed Tenant Data Isolation' },
        tags: ['React 19', 'Node.js', 'Express', 'Prisma ORM', 'PostgreSQL', 'JWT Auth', 'Zod', 'Tailwind CSS'],
        links: {
            live: 'https://devdesk-ui.vercel.app/',
            github: 'https://github.com/purushothaman-web/DevDesk'
        }
    },
    {
        id: 'jobtrackr',
        num: '03',
        title: 'JobTrackr',
        subtitle: 'Career Management & Application Tracker',
        category: 'live',
        badge: 'Deployed · Live App',
        badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        description: [
            'JobTrackr is a personal career CRM built to take the chaos out of modern job hunting. When applying to dozens of companies across multiple platforms, it is easy to lose track of application dates, recruiter follow-ups, and interview rounds.',
            'I developed JobTrackr using Next.js 16 to give job seekers an interactive pipeline to track jobs from Applied to Offer. It features a GitHub-style daily activity heatmap to keep momentum high, along with automated weekly email digests that summarize upcoming interviews and progress.'
        ],
        highlights: [
            { title: 'Visual Stage Pipeline', desc: 'Easily drag and track applications across stages with recruiter notes, salary ranges, and contacts.' },
            { title: 'Daily Momentum Heatmap', desc: 'A GitHub-style contribution graph that visually tracks your daily job search activity.' },
            { title: 'Automated Weekly Digests', desc: 'Sends weekly progress recaps directly to your inbox so you never miss an interview follow-up.' }
        ],
        metricBadge: { label: 'Core Architecture', value: 'Next.js 16 App Router & HTTP-Only Auth' },
        tags: ['Next.js 16', 'React 19', 'Prisma ORM', 'PostgreSQL', 'Secure Cookie Auth', 'Nodemailer'],
        links: {
            live: 'https://jobtrackr-silk.vercel.app/',
            github: 'https://github.com/purushothaman-web/JobTrackr'
        }
    },
    {
        id: 'thiraiview',
        num: '04',
        title: 'ThiraiView',
        subtitle: 'Personalized Movie & Cinema Discovery',
        category: 'live',
        badge: 'Deployed · Live App',
        badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200/80',
        description: [
            'ThiraiView is a movie discovery web application designed to solve the endless scrolling fatigue on streaming platforms. Most recommendation carousels repeat the same popular movies and completely ignore how much time you actually have to watch.',
            'I built ThiraiView to recommend films tailored to your specific situation—whether you only have 80 minutes to unwind or want a specific mood combination like "dark sci-fi thriller". It connects directly to live TMDB APIs to deliver instant trailers, plot details, and audience ratings with fluid animations.'
        ],
        highlights: [
            { title: 'Runtime Matcher', desc: 'Filters movies specifically to match how much free time you have (e.g. under 90 mins).' },
            { title: 'Mood & Vibe Matching', desc: 'Combines cross-genre filters and audience ratings for tailored recommendations.' },
            { title: 'Streaming & Trailers', desc: 'Instant access to HD trailers, plot summaries, and casting info powered by live TMDB APIs.' }
        ],
        metricBadge: { label: 'Algorithm', value: 'Mood & Runtime Delta Matcher' },
        tags: ['React 19', 'Node.js', 'Express', 'TMDB API', 'Framer Motion', 'Tailwind CSS'],
        links: {
            live: 'https://thiraiview.vercel.app/',
            github: 'https://github.com/purushothaman-web/ThiraiView'
        }
    },
    {
        id: 'spend-log',
        num: '05',
        title: 'Spend Log',
        subtitle: 'Personal Expense & Budget Manager',
        category: 'repo',
        badge: 'Open Source · Repository',
        badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200/80',
        description: [
            'Spend Log is a personal finance and expense tracking web app focused on simplicity and financial clarity. Many budgeting tools are either overly complex with unnecessary banking integrations or too tedious for daily tracking.',
            'Spend Log provides a clean, fast interface to log daily expenses across categories like food, rent, and travel in seconds. It calculates interactive monthly breakdowns with visual charts, giving you an immediate, transparent picture of where your money goes without storing any sensitive banking credentials.'
        ],
        highlights: [
            { title: 'Categorized Logging', desc: 'Quick entry with custom categories for food, rent, travel, and personal investments.' },
            { title: 'Monthly Breakdown Charts', desc: 'Visual percentage breakdowns showing where your budget goes each month.' },
            { title: 'Private User Accounts', desc: 'Secure JWT authentication with dedicated database collections per user account.' }
        ],
        metricBadge: { label: 'Database', value: 'MongoDB Collections + Aggregation Pipelines' },
        tags: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT Auth', 'Chart.js', 'Tailwind CSS'],
        links: {
            github: 'https://github.com/purushothaman-web/spend-log'
        }
    },
    {
        id: 'waoli',
        num: '06',
        title: 'Waoli',
        subtitle: 'Real-Time Weather & Air Quality Dashboard',
        category: 'repo',
        badge: 'Open Source · Repository',
        badgeStyle: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
        description: [
            'Waoli is a modern, responsive weather and air quality dashboard built to deliver accurate atmospheric data without cluttered advertisements or slow loading times.',
            'It fetches live meteorological data from OpenWeather APIs, providing instant temperature, humidity, wind speeds, and 7-day precipitation forecasts for any city in the world. It also includes a dedicated Air Quality Index (AQI) tracker with health recommendations and particulate matter counts, giving commuters and outdoor enthusiasts practical insights at a glance.'
        ],
        highlights: [
            { title: 'Live City Search', desc: 'Instant lookup across global cities with current temperature, humidity, and wind speed.' },
            { title: 'Hourly Forecast Trends', desc: 'Visual trend cards displaying upcoming rain probability and temperature fluctuations.' },
            { title: 'Air Quality Index (AQI)', desc: 'Highlights pollution levels with health recommendation badges and particulate counts.' }
        ],
        metricBadge: { label: 'Live Data', value: 'OpenWeather Geocoding & AQI APIs' },
        tags: ['React', 'JavaScript', 'OpenWeather API', 'Weather Icons', 'Tailwind CSS'],
        links: {
            github: 'https://github.com/purushothaman-web/waoli'
        }
    }
];

export const Projects = () => {
    return (
        <section id="projects" className="pt-14 sm:pt-16 pb-10 sm:pb-12 px-6 max-w-7xl mx-auto bg-transparent">

            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8 sm:mb-10 space-y-3 text-left"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-sans font-semibold text-blue-700">
                    <Sparkles size={12} className="text-blue-600" />
                    <span>03 // FEATURED WORK</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-sans">
                            Selected Projects &amp; Systems
                        </h2>
                        <p className="text-slate-600 font-sans text-base max-w-2xl mt-2">
                            Scroll down to unfold all 6 projects — from enterprise production software at my day job to live deployed full-stack web applications.
                        </p>
                    </div>
                    <div className="text-xs font-mono font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60 self-start md:self-auto shrink-0">
                        DECK OF 06 CARDS &middot; SCROLL TO UNBOX
                    </div>
                </div>
            </motion.div>

            {/* Sticky Stacking Deck Container */}
            <div className="relative space-y-8 pb-6">
                {PROJECTS.map((project, idx) => {
                    // Stagger sticky top positions so previous card headers stay subtly visible like a stacked deck
                    const topOffset = `calc(6.5rem + ${idx * 14}px)`;

                    return (
                        <div
                            key={project.id}
                            style={{
                                top: topOffset,
                                zIndex: idx + 10,
                            }}
                            className="sticky w-full transition-all duration-300"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-900/6 hover:shadow-2xl hover:border-slate-300 transition-all p-7 sm:p-10 text-left relative overflow-hidden group"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                                    
                                    {/* Left Core Summary & Story (7 cols) */}
                                    <div className="lg:col-span-7 space-y-5">
                                        {/* Header Row: Index & Category Badge */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-xs sm:text-sm font-bold text-slate-400">
                                                    {project.num} // 06
                                                </span>
                                                <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${project.badgeStyle}`}>
                                                    {project.category === 'live' && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    )}
                                                    {project.badge}
                                                </span>
                                            </div>

                                            {project.metricBadge && (
                                                <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60 hidden sm:inline-block">
                                                    {project.metricBadge.value}
                                                </span>
                                            )}
                                        </div>

                                        {/* Title & Subtitle */}
                                        <div>
                                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans tracking-tight group-hover:text-blue-600 transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-wider font-semibold mt-1">
                                                {project.subtitle}
                                            </p>
                                        </div>

                                        {/* Plain-English Expanded Story (2 Paragraphs) */}
                                        <div className="space-y-2.5 text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
                                            {project.description.map((paragraph, pIdx) => (
                                                <p key={pIdx}>
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>

                                        {/* Action Buttons Row */}
                                        <div className="flex flex-wrap items-center gap-3 pt-3">
                                            {project.links.live && (
                                                <motion.a
                                                    href={project.links.live}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ y: -1.5 }}
                                                    whileTap={{ y: 1 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                                                    className="relative overflow-hidden px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-2 shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition-all cursor-pointer group before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 before:ease-out"
                                                >
                                                    <span>Open Live Demo</span>
                                                    <ExternalLink size={14} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                </motion.a>
                                            )}

                                            {project.links.github && (
                                                <motion.a
                                                    href={project.links.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ y: -1.5 }}
                                                    whileTap={{ y: 1 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                                                    className="relative overflow-hidden px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium flex items-center gap-2 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer group before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700 before:ease-out"
                                                >
                                                    <Github size={14} className="transition-transform duration-200 ease-out group-hover:-rotate-12" />
                                                    <span>View Source Code</span>
                                                </motion.a>
                                            )}

                                            {project.category === 'enterprise' && (
                                                <span className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/60">
                                                    <ShieldCheck size={15} />
                                                    <span>Company Production Platform</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Specs & Highlight Box (5 cols) */}
                                    <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-6 sm:p-7 border border-slate-200/70 space-y-5">
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans mb-3.5">
                                                Key Capabilities
                                            </h4>
                                            <div className="space-y-3">
                                                {project.highlights.map((h, i) => (
                                                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                                                        <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                                                        <div>
                                                            <strong className="text-slate-800 font-semibold">{h.title}:</strong> {h.desc}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tech Stack Chips */}
                                        <div className="pt-4 border-t border-slate-200/70">
                                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans mb-2.5">
                                                Built With
                                            </h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-medium text-slate-700 shadow-2xs"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>

        </section>
    );
};

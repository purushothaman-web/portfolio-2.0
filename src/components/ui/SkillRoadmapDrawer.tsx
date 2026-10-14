import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    Maximize2, 
    Minimize2, 
    BookOpen, 
    ExternalLink, 
    CheckCircle2, 
    Circle, 
    AlertTriangle, 
    Lightbulb, 
    Code2, 
    Check, 
    Copy, 
    ChevronRight, 
    Cloud, 
    CloudOff, 
    RefreshCw,
    Sparkles
} from 'lucide-react';
import { SkillRoadmap, Checkpoint, SKILL_ROADMAPS } from '../../data/skillRoadmaps';
import { useRoadmapProgress } from '../../utils/useRoadmapProgress';

interface SkillRoadmapDrawerProps {
    skillId: string | null;
    onClose: () => void;
}

export const SkillRoadmapDrawer: React.FC<SkillRoadmapDrawerProps> = ({
    skillId,
    onClose
}) => {
    const roadmap: SkillRoadmap | undefined = skillId ? SKILL_ROADMAPS[skillId] : undefined;
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeCheckpointIndex, setActiveCheckpointIndex] = useState(0);
    const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);
    const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

    const {
        isCompleted,
        toggleCheckpoint,
        getSkillProgress,
        syncStatus,
        isCloudConfigured
    } = useRoadmapProgress();

    // Reset checkpoint selection when skill changes
    useEffect(() => {
        setActiveCheckpointIndex(0);
        setIsSolutionRevealed(false);
    }, [skillId]);

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!roadmap) return null;

    const checkpoints = roadmap.checkpoints;
    const activeCheckpoint: Checkpoint | undefined = checkpoints[activeCheckpointIndex];
    const checkpointIds = checkpoints.map(c => c.id);
    const progressPct = getSkillProgress(checkpointIds);
    const isCurrentCompleted = activeCheckpoint ? isCompleted(activeCheckpoint.id) : false;

    const handleCopyCode = (id: string, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedSnippetId(id);
        setTimeout(() => setCopiedSnippetId(null), 2000);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-9999 flex justify-end">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity"
                />

                {/* Drawer Panel */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className={`relative z-10 flex flex-col bg-white text-slate-900 shadow-2xl border-l border-slate-200 transition-all duration-300 ${
                        isFullscreen ? 'w-full h-full max-w-none' : 'w-full md:w-180 lg:w-210 h-full'
                    }`}
                >
                    {/* Top Header */}
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-20 backdrop-blur-md">
                        <div className="flex items-center space-x-3.5">
                            <div 
                                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-xs"
                                style={{ backgroundColor: roadmap.accentColor }}
                            >
                                <Code2 size={18} />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-sans">
                                        {roadmap.skillName}
                                    </h2>
                                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                                        5-Min Micro-Roadmap
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 font-sans mt-0.5 hidden sm:block">
                                    {roadmap.tagline}
                                </p>
                            </div>
                        </div>

                        {/* Top Right Controls & Sync Pill */}
                        <div className="flex items-center space-x-2">
                            {/* Cloud Sync Status */}
                            <div 
                                title={
                                    isCloudConfigured 
                                        ? `Upstash Cloud Status: ${syncStatus}` 
                                        : 'Saved in LocalStorage. Add Upstash keys in .env for cross-device sync.'
                                }
                                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-medium bg-slate-100 border border-slate-200 text-slate-600"
                            >
                                {syncStatus === 'syncing' ? (
                                    <>
                                        <RefreshCw size={12} className="animate-spin text-blue-600" />
                                        <span>Syncing...</span>
                                    </>
                                ) : isCloudConfigured ? (
                                    <>
                                        <Cloud size={12} className="text-emerald-600" />
                                        <span>Cloud Synced</span>
                                    </>
                                ) : (
                                    <>
                                        <CloudOff size={12} className="text-slate-400" />
                                        <span>Local / Device</span>
                                    </>
                                )}
                            </div>

                            {/* Fullscreen Toggle */}
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                title={isFullscreen ? "Shrink to Drawer" : "Expand to Full Hub"}
                                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
                            >
                                {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
                            </button>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                title="Close (Esc)"
                                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
                            >
                                <X size={19} />
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar Strip */}
                    <div className="bg-slate-50 border-b border-slate-100 px-6 py-2.5 flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold text-slate-700">Mastery Progress:</span>
                            <span className="font-mono font-bold text-blue-600">{progressPct}%</span>
                            <span className="text-slate-400">({checkpoints.filter(c => isCompleted(c.id)).length} of {checkpoints.length} mastered)</span>
                        </div>
                        <div className="w-32 sm:w-48 h-2 rounded-full bg-slate-200/80 overflow-hidden">
                            <motion.div 
                                initial={false}
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 0.4 }}
                                className="h-full bg-linear-to-r from-blue-600 to-emerald-500 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Curated External Official Documentation Bar */}
                    <div className="px-6 py-3 border-b border-slate-100 bg-white">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5 font-sans">
                            <BookOpen size={13} className="text-blue-600" />
                            <span>Curated Canonical Documentation (No Bookmark Hoarding)</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {roadmap.officialDocs.map((doc, idx) => (
                                <a
                                    key={idx}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={doc.description}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-all group"
                                >
                                    <span>{doc.title}</span>
                                    {doc.badge && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 group-hover:text-blue-600 border border-slate-200/80">
                                            {doc.badge}
                                        </span>
                                    )}
                                    <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Main Body (Horizontal layout if fullscreen, vertical if drawer) */}
                    <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
                        
                        {/* Left Checkpoint Stepper Navigation */}
                        <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50 p-4 space-y-2 shrink-0">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 font-sans">
                                5-Minute Checkpoints
                            </div>
                            <div className="space-y-1.5">
                                {checkpoints.map((cp, idx) => {
                                    const completed = isCompleted(cp.id);
                                    const isActive = idx === activeCheckpointIndex;
                                    return (
                                        <button
                                            key={cp.id}
                                            onClick={() => {
                                                setActiveCheckpointIndex(idx);
                                                setIsSolutionRevealed(false);
                                            }}
                                            className={`w-full text-left p-3 rounded-xl text-xs font-sans transition-all flex items-start gap-2.5 cursor-pointer ${
                                                isActive 
                                                    ? 'bg-white shadow-xs border border-blue-200/90 text-blue-900 font-semibold' 
                                                    : 'text-slate-600 hover:bg-slate-100/80 border border-transparent'
                                            }`}
                                        >
                                            <div 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleCheckpoint(cp.id);
                                                }}
                                                className="mt-0.5 shrink-0"
                                                title={completed ? "Mark incomplete" : "Mark completed"}
                                            >
                                                {completed ? (
                                                    <CheckCircle2 size={16} className="text-emerald-600 fill-emerald-50" />
                                                ) : (
                                                    <Circle size={16} className="text-slate-300 hover:text-slate-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="truncate">
                                                    {idx + 1}. {cp.title}
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">
                                                    ~{cp.estMinutes} mins practical
                                                </div>
                                            </div>
                                            {isActive && (
                                                <ChevronRight size={14} className="text-blue-600 shrink-0 mt-0.5" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Content Workspace */}
                        {activeCheckpoint && (
                            <div className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
                                
                                {/* Checkpoint Header */}
                                <div className="space-y-1 text-left">
                                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                                        <Sparkles size={13} />
                                        <span>Checkpoint {activeCheckpointIndex + 1} of {checkpoints.length}</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
                                        {activeCheckpoint.title}
                                    </h3>
                                </div>

                                {/* Part 1: 60-Second Core Concept (Feynman Style) */}
                                <div className="rounded-2xl bg-blue-50/50 border border-blue-100 p-5 space-y-3 text-left">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800 font-sans">
                                        <Lightbulb size={16} className="text-blue-600" />
                                        <span>Part 1: The 60-Second Concept</span>
                                    </div>
                                    <p className="text-sm text-slate-800 leading-relaxed font-sans">
                                        {activeCheckpoint.concept.summary}
                                    </p>
                                    
                                    {/* Analogy Callout */}
                                    <div className="p-3.5 rounded-xl bg-white/90 border border-blue-200/60 text-xs text-slate-700 leading-relaxed">
                                        <strong className="text-blue-900">Simple Analogy: </strong>
                                        {activeCheckpoint.concept.analogy}
                                    </div>

                                    {/* Senior Insight */}
                                    <div className="text-xs text-slate-600 border-l-2 border-blue-500 pl-3 italic">
                                        <strong>Senior Insight: </strong>
                                        {activeCheckpoint.concept.seniorInsight}
                                    </div>
                                </div>

                                {/* Part 2: Senior vs Junior Code Trap */}
                                <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 text-left shadow-2xs">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 font-sans">
                                            <AlertTriangle size={15} className="text-amber-500" />
                                            <span>Part 2: The Junior vs. Senior Trap</span>
                                        </div>
                                        <span className="text-[11px] text-slate-400 font-sans">
                                            {activeCheckpoint.trap.title}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* Junior Antipattern */}
                                        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5 space-y-2">
                                            <div className="flex items-center justify-between text-[11px] font-bold text-rose-700">
                                                <span>❌ Junior Antipattern</span>
                                                <button
                                                    onClick={() => handleCopyCode('junior', activeCheckpoint.trap.juniorCode)}
                                                    className="p-1 rounded text-rose-500 hover:text-rose-900 cursor-pointer"
                                                    title="Copy junior snippet"
                                                >
                                                    {copiedSnippetId === 'junior' ? <Check size={13} /> : <Copy size={13} />}
                                                </button>
                                            </div>
                                            <pre className="text-[11px] font-mono text-slate-800 bg-white/80 p-3 rounded-lg overflow-x-auto border border-rose-100 leading-relaxed">
                                                {activeCheckpoint.trap.juniorCode}
                                            </pre>
                                        </div>

                                        {/* Senior Production Solution */}
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 space-y-2">
                                            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800">
                                                <span>✅ Senior Production Code</span>
                                                <button
                                                    onClick={() => handleCopyCode('senior', activeCheckpoint.trap.seniorCode)}
                                                    className="p-1 rounded text-emerald-600 hover:text-emerald-900 cursor-pointer"
                                                    title="Copy senior snippet"
                                                >
                                                    {copiedSnippetId === 'senior' ? <Check size={13} /> : <Copy size={13} />}
                                                </button>
                                            </div>
                                            <pre className="text-[11px] font-mono text-slate-800 bg-white/80 p-3 rounded-lg overflow-x-auto border border-emerald-100 leading-relaxed">
                                                {activeCheckpoint.trap.seniorCode}
                                            </pre>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-600 font-sans leading-relaxed pt-1">
                                        <strong>Why this matters: </strong>
                                        {activeCheckpoint.trap.explanation}
                                    </p>
                                </div>

                                {/* Part 3: Interactive 3-Minute Micro-Drill */}
                                <div className="rounded-2xl bg-slate-900 text-white p-5 sm:p-6 space-y-4 text-left shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 font-sans">
                                            <Code2 size={16} />
                                            <span>Part 3: 3-Minute Micro-Drill</span>
                                        </div>
                                        <span className="text-[11px] text-slate-400 font-mono">
                                            Active Recall
                                        </span>
                                    </div>

                                    <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
                                        {activeCheckpoint.drill.question}
                                    </p>

                                    {activeCheckpoint.drill.starterCode && (
                                        <pre className="text-xs font-mono text-emerald-300 bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto">
                                            {activeCheckpoint.drill.starterCode}
                                        </pre>
                                    )}

                                    {activeCheckpoint.drill.hint && (
                                        <div className="text-xs text-slate-400 italic">
                                            💡 Hint: {activeCheckpoint.drill.hint}
                                        </div>
                                    )}

                                    {/* Reveal Solution Button */}
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setIsSolutionRevealed(!isSolutionRevealed)}
                                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold font-sans transition-all cursor-pointer flex items-center gap-2"
                                        >
                                            <span>{isSolutionRevealed ? 'Hide Solution' : 'Reveal Solution & Explanation'}</span>
                                        </button>
                                    </div>

                                    {/* Solution Drawer Animation */}
                                    <AnimatePresence>
                                        {isSolutionRevealed && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden space-y-3 pt-3 border-t border-slate-800"
                                            >
                                                <div className="flex items-center justify-between text-xs text-slate-400">
                                                    <span className="font-semibold text-emerald-400">Verified Answer:</span>
                                                    <button
                                                        onClick={() => handleCopyCode('drill-solution', activeCheckpoint.drill.solution)}
                                                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                                                    >
                                                        {copiedSnippetId === 'drill-solution' ? <Check size={12} /> : <Copy size={12} />}
                                                        <span>Copy</span>
                                                    </button>
                                                </div>
                                                <pre className="text-xs font-mono text-slate-100 bg-slate-950 p-3.5 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
                                                    {activeCheckpoint.drill.solution}
                                                </pre>
                                                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                                                    {activeCheckpoint.drill.explanation}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Part 4: Official Deep Dive Link */}
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-left">
                                    <div className="space-y-0.5">
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Authoritative Deep Dive
                                        </div>
                                        <div className="text-xs font-semibold text-slate-800">
                                            {activeCheckpoint.docLink.title}
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                            {activeCheckpoint.docLink.description}
                                        </div>
                                    </div>
                                    <a
                                        href={activeCheckpoint.docLink.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 ml-4 px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all"
                                    >
                                        <span>Read Official Docs</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>

                            </div>
                        )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between sticky bottom-0 z-20">
                        <button
                            onClick={() => {
                                if (activeCheckpoint) {
                                    toggleCheckpoint(activeCheckpoint.id);
                                }
                            }}
                            className={`relative overflow-hidden px-5 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                                isCurrentCompleted 
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                        >
                            {isCurrentCompleted ? (
                                <>
                                    <Check size={14} />
                                    <span>Mastered ✓</span>
                                </>
                            ) : (
                                <>
                                    <Circle size={14} />
                                    <span>Mark Checkpoint as Mastered</span>
                                </>
                            )}
                        </button>

                        <div className="flex items-center space-x-2">
                            {activeCheckpointIndex > 0 && (
                                <button
                                    onClick={() => {
                                        setActiveCheckpointIndex(prev => prev - 1);
                                        setIsSolutionRevealed(false);
                                    }}
                                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer transition-colors"
                                >
                                    Previous
                                </button>
                            )}

                            {activeCheckpointIndex < checkpoints.length - 1 && (
                                <button
                                    onClick={() => {
                                        setActiveCheckpointIndex(prev => prev + 1);
                                        setIsSolutionRevealed(false);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                                >
                                    <span>Next Checkpoint</span>
                                    <ChevronRight size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, 
    Palette, 
    RotateCw, 
    Terminal, 
    Sparkles, 
    CheckCircle2, 
    Layers, 
    Database, 
    ShieldCheck, 
    Zap,
    Send
} from 'lucide-react';

type Mode = 'frontend' | 'backend';
type AccentColor = 'cobalt' | 'rose' | 'emerald';

interface ServerLog {
    id: string;
    action: string;
    status: string;
    time: string;
    latency: number;
}

export default function InteractiveDualConsole() {
    const [mode, setMode] = useState<Mode>('frontend');
    const [likes, setLikes] = useState(142);
    const [hasLiked, setHasLiked] = useState(false);
    const [accent, setAccent] = useState<AccentColor>('cobalt');
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationStep, setSimulationStep] = useState(0);
    const [particles, setParticles] = useState<{ id: number; x: number }[]>([]);
    const [logs, setLogs] = useState<ServerLog[]>([
        { id: '1', action: 'GET /api/v1/app/state', status: '200 OK', time: 'Just now', latency: 8 },
        { id: '2', action: 'POST /api/v1/auth/verify', status: '200 OK', time: '1s ago', latency: 14 },
    ]);

    // 3D tilt tracking
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        // Limit tilt to gentle ±7 degrees
        const tiltX = -((y - centerY) / centerY) * 7;
        const tiltY = ((x - centerX) / centerX) * 7;
        setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    // Color tokens
    const accentStyles = {
        cobalt: {
            bg: 'bg-blue-600',
            text: 'text-blue-600',
            border: 'border-blue-500',
            lightBg: 'bg-blue-50',
            ring: 'ring-blue-500/20',
            label: 'Royal Cobalt',
        },
        rose: {
            bg: 'bg-rose-600',
            text: 'text-rose-600',
            border: 'border-rose-500',
            lightBg: 'bg-rose-50',
            ring: 'ring-rose-500/20',
            label: 'Vibrant Rose',
        },
        emerald: {
            bg: 'bg-emerald-600',
            text: 'text-emerald-600',
            border: 'border-emerald-500',
            lightBg: 'bg-emerald-50',
            ring: 'ring-emerald-500/20',
            label: 'Emerald Tech',
        },
    };

    const currentAccent = accentStyles[accent];

    const cycleAccent = () => {
        const next: Record<AccentColor, AccentColor> = {
            cobalt: 'rose',
            rose: 'emerald',
            emerald: 'cobalt',
        };
        const nextAccent = next[accent];
        setAccent(nextAccent);

        // Add log entry to backend
        const newLog: ServerLog = {
            id: String(Date.now()),
            action: `PATCH /api/preferences?theme=${nextAccent}`,
            status: '200 OK',
            time: 'Just now',
            latency: Math.floor(Math.random() * 10) + 6,
        };
        setLogs((prev) => [newLog, ...prev.slice(0, 4)]);
    };

    const handleLike = () => {
        setLikes((l) => l + 1);
        setHasLiked(true);

        // Spawn particle
        const newParticle = { id: Date.now(), x: Math.random() * 60 - 30 };
        setParticles((prev) => [...prev, newParticle]);
        setTimeout(() => {
            setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
        }, 1200);

        // Add to backend log
        const newLog: ServerLog = {
            id: String(Date.now()),
            action: `POST /api/v1/reactions/heart`,
            status: '201 Created',
            time: 'Just now',
            latency: Math.floor(Math.random() * 12) + 8,
        };
        setLogs((prev) => [newLog, ...prev.slice(0, 4)]);
    };

    const triggerSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setSimulationStep(1);

        setTimeout(() => setSimulationStep(2), 600);
        setTimeout(() => setSimulationStep(3), 1300);
        setTimeout(() => {
            setSimulationStep(4);
            const simLog: ServerLog = {
                id: String(Date.now()),
                action: 'POST /api/v1/orders/dispatch',
                status: '200 OK',
                time: 'Just now',
                latency: 18,
            };
            setLogs((prev) => [simLog, ...prev.slice(0, 4)]);
            setTimeout(() => {
                setIsSimulating(false);
                setSimulationStep(0);
            }, 1200);
        }, 2000);
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Perspective Canvas */}
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full max-w-lg min-h-110 perspective-distant select-none"
            >
                {/* 3D Rotating Assembly */}
                <div
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (mode === 'backend' ? 180 : 0)}deg)`,
                        transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                    className="relative w-full h-full min-h-110"
                >
                    {/* ========================================================= */}
                    {/* FACE 1: FRONTEND (What Users See)                         */}
                    {/* ========================================================= */}
                    <div
                        style={{ backfaceVisibility: 'hidden' }}
                        className="absolute inset-0 w-full h-full rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 p-6 flex flex-col justify-between overflow-hidden"
                    >
                        {/* Top Hardware Chrome */}
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-2.5 w-2.5 relative">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentAccent.bg}`} />
                                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${currentAccent.bg}`} />
                                    </span>
                                    <span className="text-xs font-bold text-slate-900 tracking-wide font-sans">
                                        SIDE A // FRONTEND SURFACE
                                    </span>
                                </div>

                                {/* Mode Toggles */}
                                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
                                    <button
                                        onClick={() => setMode('frontend')}
                                        className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-white text-slate-900 shadow-xs cursor-pointer"
                                    >
                                        UI Surface
                                    </button>
                                    <button
                                        onClick={() => setMode('backend')}
                                        className="px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Engine</span>
                                        <RotateCw size={11} className="text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Human Explanation Banner */}
                            <div className="mt-3.5 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-100 text-[12px] text-slate-600 flex items-center justify-between">
                                <span className="flex items-center gap-2 font-medium">
                                    <Sparkles size={14} className={currentAccent.text} />
                                    What users touch, click, and feel in real time.
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">60 FPS</span>
                            </div>
                        </div>

                        {/* Interactive UI Sandbox Controls */}
                        <div className="space-y-4 py-4">
                            {/* Interactive Component Card */}
                            <div className={`p-4 rounded-xl border border-slate-200 bg-linear-to-b from-white to-slate-50/60 shadow-xs transition-colors duration-300`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded-lg ${currentAccent.bg} text-white flex items-center justify-center shadow-xs`}>
                                            <Layers size={14} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-900">Live Component State</div>
                                            <div className="text-[11px] text-slate-500 font-mono">React 19 · Smooth micro-motion</div>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentAccent.lightBg} ${currentAccent.text}`}>
                                        Interactive
                                    </span>
                                </div>

                                {/* Tactile Actions Row */}
                                <div className="flex items-center gap-3 relative pt-1">
                                    {/* Like Button with Particles */}
                                    <div className="relative">
                                        <button
                                            id="interactive-like-btn"
                                            onClick={handleLike}
                                            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 shadow-2xs hover:shadow-xs ${
                                                hasLiked 
                                                    ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-500/10' 
                                                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                                            }`}
                                        >
                                            <Heart size={14} className={hasLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
                                            <span>Send Like</span>
                                            <span className="font-mono text-[11px] text-slate-500">({likes})</span>
                                        </button>

                                        {/* Floating Heart Particles */}
                                        <AnimatePresence>
                                            {particles.map((p) => (
                                                <motion.div
                                                    key={p.id}
                                                    initial={{ opacity: 1, y: 0, scale: 0.8, x: p.x }}
                                                    animate={{ opacity: 0, y: -45, scale: 1.3 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.9, ease: 'easeOut' }}
                                                    className="absolute -top-3 left-1/2 text-rose-500 pointer-events-none"
                                                >
                                                    ❤️
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {/* Color Theme Switcher Button */}
                                    <button
                                        id="interactive-theme-btn"
                                        onClick={cycleAccent}
                                        className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-2 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 shadow-2xs hover:shadow-xs"
                                    >
                                        <Palette size={13} className={currentAccent.text} />
                                        <span>Accent: <strong className={currentAccent.text}>{currentAccent.label}</strong></span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Flip Trigger Strip */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1.5 text-slate-500 font-sans text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Click buttons to dispatch live events
                            </span>
                            <button
                                id="flip-to-backend-btn"
                                onClick={() => setMode('backend')}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                                <span>See how backend handles this</span>
                                <span className="font-bold text-sm">→</span>
                            </button>
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* FACE 2: BACKEND (How It Works)                            */}
                    {/* ========================================================= */}
                    <div
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                        }}
                        className="absolute inset-0 w-full h-full rounded-2xl bg-slate-900 border border-slate-800 text-white p-6 flex flex-col justify-between shadow-2xl overflow-hidden"
                    >
                        {/* Top Hardware Chrome */}
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-2 font-mono">
                                    <Terminal size={14} className="text-emerald-400" />
                                    <span className="text-xs font-bold text-white tracking-wider">
                                        SIDE B // SERVER PIPELINE
                                    </span>
                                </div>

                                {/* Mode Toggles */}
                                <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                                    <button
                                        onClick={() => setMode('frontend')}
                                        className="px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        <RotateCw size={11} className="text-slate-400" />
                                        <span>UI Surface</span>
                                    </button>
                                    <button
                                        onClick={() => setMode('backend')}
                                        className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-700 text-white shadow-xs cursor-pointer"
                                    >
                                        Engine
                                    </button>
                                </div>
                            </div>

                            {/* Human Explanation Banner */}
                            <div className="mt-3.5 px-3.5 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[12px] text-slate-300 flex items-center justify-between font-mono">
                                <span className="flex items-center gap-2">
                                    <Zap size={14} className="text-emerald-400" />
                                    How data and APIs process your clicks.
                                </span>
                                <span className="text-emerald-400 text-[11px] font-bold">100% HEALTHY</span>
                            </div>
                        </div>

                        {/* Live Activity Stream */}
                        <div className="space-y-2 py-3 font-mono">
                            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                                <span>LIVE SERVER LOG (MATCHES UI CLICKS)</span>
                                <span className="text-[10px] text-slate-500">Node.js · Express</span>
                            </div>

                            {/* Stream Rows */}
                            <div className="space-y-1.5">
                                {logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs transition-all hover:bg-slate-800"
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <span className="text-emerald-400 text-[10px]">●</span>
                                            <span className="text-slate-200 truncate">{log.action}</span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 text-[11px]">
                                            <span className="text-emerald-300 font-semibold">{log.status}</span>
                                            <span className="text-slate-500 text-[10px]">{log.latency}ms</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Interactive Simulation Button */}
                            <div className="pt-2">
                                <button
                                    id="test-server-req-btn"
                                    onClick={triggerSimulation}
                                    disabled={isSimulating}
                                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    <Send size={13} className={isSimulating ? 'animate-bounce' : ''} />
                                    <span>{isSimulating ? 'Processing Server Pipeline...' : 'Simulate API Request'}</span>
                                </button>

                                {/* Multi-step Pipeline Progress */}
                                {isSimulating && (
                                    <div className="mt-2.5 p-2 rounded-lg bg-slate-800/90 border border-slate-700 text-[11px] space-y-1 text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={12} className={simulationStep >= 1 ? 'text-emerald-400' : 'text-slate-600'} />
                                            <span>1. Routing request via Express router</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={12} className={simulationStep >= 2 ? 'text-emerald-400' : 'text-slate-600'} />
                                            <span>2. Validating authentication token</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={12} className={simulationStep >= 3 ? 'text-emerald-400' : 'text-slate-600'} />
                                            <span>3. Executing Prisma query on PostgreSQL</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Metric Strip */}
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <Database size={12} className="text-blue-400" />
                                PostgreSQL + Prisma
                            </span>
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck size={12} className="text-emerald-400" />
                                JWT Protected
                            </span>
                            <button
                                id="flip-to-frontend-btn"
                                onClick={() => setMode('frontend')}
                                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                                <span>Back to UI</span>
                                <span>←</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

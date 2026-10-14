import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Monitor, Github, Send, Info, Cpu, Globe, Zap } from 'lucide-react';

interface Node {
    id: string;
    label: string;
    type: 'frontend' | 'backend' | 'external';
    tech: string;
    desc: string;
}

interface Edge {
    from: string;
    to: string;
    label: string;
}

interface SystemData {
    status: {
        isLive: boolean;
        verifiedAt: string;
        services: {
            github: boolean;
            mail: boolean;
        };
    };
    nodes: Node[];
    edges: Edge[];
}

export const SystemArchitecture = () => {
    const [data, setData] = useState<SystemData | null>(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/system/map')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <section id="architecture" className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
            {loading || !data ? (
                <div className="h-[600px] flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#1d3557]/10 border-t-[#e63946] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-16">
                    {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl space-y-6"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#1d3557] flex items-center justify-center">
                                <Cpu size={20} className="text-white" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d3557] font-sans">
                                System Blueprint
                            </h2>
                        </div>
                        <div className="w-16 h-1 bg-[#e63946] rounded-full ml-[52px]"></div>
                        <p className="text-lg text-gray-500 font-sans leading-relaxed ml-[52px]">
                            A living visualization of the portfolio's orchestration. Every interaction flows through these interconnected modules.
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-4 ml-[52px] lg:ml-0">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live System
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* SVG Map Container */}
                    <div className="lg:col-span-8 bg-white editorial-card rounded-[2rem] p-4 sm:p-8 relative min-h-[500px] overflow-hidden">
                        {/* Technical Background Grid */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                             style={{backgroundImage: 'radial-gradient(#1d3557 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
                        </div>

                        <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[500px]">
                            <svg 
                                viewBox="0 0 800 600" 
                                className="w-full h-full drop-shadow-2xl" 
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <defs>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#1d3557" />
                                        <stop offset="100%" stopColor="#457b9d" />
                                    </linearGradient>
                                </defs>

                                {/* Connection Paths */}
                                <g className="opacity-20">
                                    {/* Client to Server */}
                                    <PathWithPackets d="M 150 300 C 250 300, 300 300, 400 300" delay={0} />
                                    {/* Server to External */}
                                    <PathWithPackets d="M 400 300 C 500 300, 550 150, 650 150" delay={0.5} />
                                    <PathWithPackets d="M 400 300 C 500 300, 550 450, 650 450" delay={1.5} />
                                </g>

                                {/* Nodes (Drawn as SVG groups for precise placement) */}
                                <NodeGroup 
                                    x={150} y={300} icon="monitor" label="Client App" 
                                    isSelected={selectedNode?.id === 'client'}
                                    onClick={() => setSelectedNode(data.nodes.find(n => n.id === 'client')!)}
                                />
                                <NodeGroup 
                                    x={400} y={300} icon="server" label="API Core" 
                                    isSelected={selectedNode?.id === 'server'}
                                    onClick={() => setSelectedNode(data.nodes.find(n => n.id === 'server')!)}
                                    large
                                />
                                <NodeGroup 
                                    x={650} y={150} icon="github" label="GitHub" 
                                    isSelected={selectedNode?.id === 'github'}
                                    onClick={() => setSelectedNode(data.nodes.find(n => n.id === 'github')!)}
                                />
                                <NodeGroup 
                                    x={650} y={450} icon="send" label="Mailing" 
                                    isSelected={selectedNode?.id === 'mail'}
                                    onClick={() => setSelectedNode(data.nodes.find(n => n.id === 'mail')!)}
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Details Panel */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <AnimatePresence mode="wait">
                            {selectedNode ? (
                                <motion.div
                                    key={selectedNode.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-[#1d3557] text-white rounded-[2rem] p-8 space-y-8 h-full shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Zap size={120} />
                                    </div>

                                    <div className="space-y-4 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                                            {getNodeIconComponent(selectedNode.id)}
                                        </div>
                                        <div>
                                            <h4 className="text-3xl font-bold font-sans tracking-tight">{selectedNode.label}</h4>
                                            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#e63946]">{selectedNode.tech}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        <p className="text-white/70 font-sans leading-relaxed text-lg">
                                            {selectedNode.desc}
                                        </p>
                                        <div className="pt-6 border-t border-white/10">
                                            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#a8dadc]">
                                                {data?.status?.isLive ? (
                                                    <>
                                                        <Globe size={14} className="text-green-400" />
                                                        Real-time Verified at {data?.status?.verifiedAt ? new Date(data.status.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap size={14} className="text-[#e63946]" />
                                                        System Pulse: Partial Mode
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col justify-center items-center text-center p-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-300">
                                        <Info size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-bold text-[#1d3557] font-sans">Module Explorer</h4>
                                        <p className="text-gray-400 font-sans text-sm max-w-[200px]">
                                            Select a module on the map to analyze its technical architecture.
                                        </p>
                                    </div>
                                </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        );
};

// ─── SVG Components ──────────────────────────────────────────────────────────

const PathWithPackets = ({ d, delay }: { d: string; delay: number }) => (
    <g>
        <path d={d} fill="none" stroke="#1d3557" strokeWidth="2" strokeLinecap="round" />
        <motion.circle r="3" fill="#e63946">
            <animateMotion 
                path={d} 
                dur="3s" 
                repeatCount="indefinite" 
                begin={`${delay}s`}
            />
        </motion.circle>
    </g>
);

const NodeGroup = ({ x, y, icon, label, isSelected, onClick, large }: any) => {
    const size = large ? 100 : 70;
    const innerSize = large ? 60 : 40;
    
    return (
        <g 
            className="cursor-pointer group" 
            onClick={onClick}
        >
            {/* Base Shadow */}
            <circle cx={x} cy={y} r={size/2} fill="white" className="drop-shadow-lg" />
            
            {/* Selection Ring */}
            {isSelected && (
                <motion.circle 
                    layoutId="outline"
                    cx={x} cy={y} r={(size/2) + 6}
                    fill="none" stroke="#e63946" strokeWidth="2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}

            {/* Main Circle */}
            <motion.circle 
                cx={x} cy={y} r={size/2} 
                fill={isSelected ? '#1d3557' : 'white'}
                stroke={isSelected ? '#1d3557' : '#f1f5f9'}
                strokeWidth="1"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Icon */}
            <foreignObject x={x - (innerSize/2)} y={y - (innerSize/2)} width={innerSize} height={innerSize}>
                <div className={`w-full h-full flex items-center justify-center ${isSelected ? 'text-white' : 'text-[#1d3557]'}`}>
                    {getSVGIcon(icon, innerSize * 0.5)}
                </div>
            </foreignObject>

            {/* Label */}
            <text 
                x={x} y={y + (size/2) + 20} 
                textAnchor="middle" 
                className={`text-[11px] font-bold font-sans uppercase tracking-widest ${isSelected ? 'fill-[#1d3557]' : 'fill-gray-400'}`}
            >
                {label}
            </text>
        </g>
    );
};

const getSVGIcon = (type: string, size: number) => {
    switch (type) {
        case 'monitor': return <Monitor size={size} />;
        case 'server': return <Server size={size} />;
        case 'github': return <Github size={size} />;
        case 'send': return <Send size={size} />;
        default: return <Info size={size} />;
    }
};

const getNodeIconComponent = (id: string) => {
    switch (id) {
        case 'client': return <Monitor size={32} />;
        case 'server': return <Server size={32} />;
        case 'github': return <Github size={32} />;
        case 'mail': return <Send size={32} />;
        default: return <Info size={32} />;
    }
};

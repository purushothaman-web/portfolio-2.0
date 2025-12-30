import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, Terminal } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            {/* Background Glitch Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                {/* Terminal Window */}
                <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-red-500/30 overflow-hidden font-mono transition-colors duration-300">

                    {/* Header */}
                    <div className="bg-gray-200 dark:bg-[#252526] px-4 py-3 border-b border-gray-300 dark:border-[#333] flex items-center justify-between transition-colors duration-300">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="text-red-500 dark:text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle size={12} />
                            SIGNAL_LOST
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500 tracking-tighter">
                                404
                            </h1>
                            <div className="space-y-2">
                                <p className="text-red-600 dark:text-red-400 font-bold text-lg">&gt; FATAL_ERROR: ROUTE_NOT_FOUND</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    The requested module could not be located in the system memory.
                                    The link may be broken or the resource has been purged.
                                </p>
                            </div>
                        </div>

                        {/* Diagnostics Box */}
                        <div className="bg-gray-100 dark:bg-black/30 p-4 rounded border border-gray-200 dark:border-red-500/20 text-xs text-gray-500 space-y-1 transition-colors duration-300">
                            <p>Error Code: <span className="text-gray-800 dark:text-gray-300">0x00000404</span></p>
                            <p>Status: <span className="text-red-600 dark:text-red-500">DISCONNECTED</span></p>
                            <p>Path: <span className="text-gray-800 dark:text-gray-300">window.location.pathname</span></p>
                        </div>

                        <Link
                            to="/"
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 w-full justify-center group"
                        >
                            <Terminal size={18} />
                            <span>EXECUTE_SYSTEM_REBOOT</span>
                            <Home size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;

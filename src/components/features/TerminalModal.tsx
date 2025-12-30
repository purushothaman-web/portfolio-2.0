import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HistoryItem {
    type: 'system' | 'user' | 'success' | 'error';
    content: string;
}

const TerminalModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const [history, setHistory] = useState<HistoryItem[]>([
        { type: 'system', content: 'Welcome to DevMode Terminal v2.0.0' },
        { type: 'system', content: 'Type "help" to see available commands.' }
    ]);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Toggle with keyboard shortcut (Ctrl+K or ~)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey && e.key === 'k') || e.key === '`') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd: string) => {
        const trimmedCmd = cmd.trim();
        const newHistory: HistoryItem[] = [...history, { type: 'user', content: cmd }];

        if (!trimmedCmd) {
            setHistory(newHistory);
            setInput('');
            return;
        }

        const parts = trimmedCmd.toLowerCase().split(/\s+/);
        const baseCommand = parts[0];
        const args = parts.slice(1);

        switch (baseCommand) {
            case 'help':
                newHistory.push({
                    type: 'system',
                    content: 'Available commands:\n  help      - Show this help message\n  clear     - Clear terminal history\n  home      - Go to Home page\n  about     - Go to About page\n  projects  - Go to Projects page\n  contact   - Go to Contact page\n  skills    - Go to Skills page\n  ls        - List directory contents (simulated)\n  whoami    - Display user info\n  repo      - Open GitHub repository\n  theme <mode> - Set theme (light/dark)'
                });
                break;
            case 'clear':
                setHistory([{ type: 'system', content: 'Terminal cleared.' }]);
                setInput('');
                return;
            case 'home':
                newHistory.push({ type: 'success', content: 'Navigating to Home...' });
                navigate('/');
                setIsOpen(false);
                break;
            case 'about':
                newHistory.push({ type: 'success', content: 'Navigating to About...' });
                navigate('/about');
                setIsOpen(false);
                break;
            case 'projects':
                newHistory.push({ type: 'success', content: 'Navigating to Projects...' });
                navigate('/projects');
                setIsOpen(false);
                break;
            case 'contact':
                newHistory.push({ type: 'success', content: 'Navigating to Contact...' });
                navigate('/contact');
                setIsOpen(false);
                break;
            case 'skills':
                newHistory.push({ type: 'success', content: 'Navigating to Skills...' });
                navigate('/skills');
                setIsOpen(false);
                break;
            case 'ls':
                newHistory.push({ type: 'system', content: 'drwxr-xr-x  src/\ndrwxr-xr-x  public/\n-rw-r--r--  package.json\n-rw-r--r--  README.md\n-rw-r--r--  vite.config.js' });
                break;
            case 'whoami':
                newHistory.push({ type: 'system', content: 'visitor@portfolio-v2:~/guest-session' });
                break;
            case 'repo':
                newHistory.push({ type: 'success', content: 'Opening GitHub repository...' });
                window.open('https://github.com/purushothaman-web', '_blank');
                break;
            case 'theme':
                if (args.length === 0) {
                    newHistory.push({ type: 'error', content: 'Usage: theme <light|dark>' });
                } else {
                    const theme = args[0];
                    if (theme === 'light' || theme === 'dark') {
                        if (theme === 'dark') {
                            document.documentElement.classList.add('dark');
                        } else {
                            document.documentElement.classList.remove('dark');
                        }
                        newHistory.push({ type: 'success', content: `Theme set to ${theme} mode.` });
                        localStorage.setItem('theme', theme);
                    } else {
                        newHistory.push({ type: 'error', content: 'Invalid theme. Use "light" or "dark".' });
                    }
                }
                break;
            case 'sudo':
                newHistory.push({ type: 'error', content: 'Permission denied: You are not in the sudoers file. This incident will be reported.' });
                break;
            default:
                newHistory.push({ type: 'error', content: `Command not found: ${trimmedCmd}. Type "help" for a list of commands.` });
        }

        setHistory(newHistory);
        setInput('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCommand(input);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-2xl bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden border border-[#333] font-mono text-sm"
                    >
                        {/* Header */}
                        <div className="bg-[#252526] px-4 py-2 border-b border-[#333] flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Terminal size={14} />
                                <span>developer-console</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Terminal Body */}
                        <div className="p-4 h-[400px] overflow-y-auto custom-scrollbar bg-[#1e1e1e]" onClick={() => inputRef.current?.focus()}>
                            <div className="space-y-2">
                                {history.map((msg, idx) => (
                                    <div key={idx} className={`${msg.type === 'error' ? 'text-red-400' :
                                        msg.type === 'success' ? 'text-green-400' :
                                            msg.type === 'user' ? 'text-cyan-400' :
                                                'text-gray-300'
                                        } whitespace-pre-wrap`}>
                                        {msg.type === 'user' ? (
                                            <span className="flex gap-2">
                                                <span className="text-green-400">➜</span>
                                                <span className="text-cyan-400">~</span>
                                                {msg.content}
                                            </span>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="bg-[#252526] p-2 flex items-center gap-2 border-t border-[#333]">
                            <span className="text-green-400 pl-2">➜</span>
                            <span className="text-cyan-400">~</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-600 font-mono"
                                placeholder="Enter command..."
                                autoFocus
                            />
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TerminalModal;

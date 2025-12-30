import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Terminal, AlertCircle, CheckCircle2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

export const Contact = () => {
    const form = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // EmailJS Configuration
        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (form.current) {
            emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
                .then(() => {
                    setStatus('success');
                    setFormData({ name: '', email: '', message: '' });
                    setTimeout(() => setStatus('idle'), 5000);
                }, (error) => {
                    console.error(error.text);
                    setStatus('error');
                    setTimeout(() => setStatus('idle'), 5000);
                });
        }
    };

    return (
        <div className="min-h-screen py-24 px-6 max-w-5xl mx-auto flex flex-col justify-center">
            <div className="grid lg:grid-cols-2 gap-12 items-start">

                {/* Left Column: Server Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <div className="inline-flex items-center space-x-2 text-sm font-mono text-cyan-600 dark:text-cyan-400">
                            <Terminal size={16} />
                            <span>sudo ./initiate-connection.sh</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Let's Connect</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            Initiate a secure transmission. I'm available for freelance projects, collaborations, or just a tech chat.
                        </p>
                    </div>

                    <div className="bg-[#1e1e1e] rounded-lg border border-[#333] overflow-hidden font-mono text-sm shadow-xl">
                        <div className="bg-[#252526] px-4 py-2 border-b border-[#333] flex items-center justify-between">
                            <span className="text-gray-400">contact_endpoints.json</span>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4 text-gray-300">
                            <div>
                                <span className="text-pink-400">"email"</span>: <span className="text-green-400">"rpurushothaman500@gmail.com"</span>,
                            </div>
                            <div>
                                <span className="text-pink-400">"phone"</span>: <span className="text-green-400">"+91 9688805006"</span>,
                            </div>
                            <div>
                                <span className="text-pink-400">"location"</span>: <span className="text-green-400">"India"</span>,
                            </div>
                            <div>
                                <span className="text-pink-400">"status"</span>: <span className="text-cyan-400">"Open for opportunities"</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Transmission Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                >
                    {/* Terminal-like Form Container */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                            <span className="ml-2 text-xs font-mono text-gray-400">New Message Transmission</span>
                        </div>

                        <form ref={form} onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Identifier (Name)</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="w-full bg-gray-50 dark:bg-gray-950 border-b-2 border-gray-200 dark:border-gray-800 focus:border-cyan-500 px-0 py-2 outline-none transition-colors font-mono text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Return Address (Email)</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="w-full bg-gray-50 dark:bg-gray-950 border-b-2 border-gray-200 dark:border-gray-800 focus:border-cyan-500 px-0 py-2 outline-none transition-colors font-mono text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Payload (Message)</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Type your message..."
                                        className="w-full bg-gray-50 dark:bg-gray-950 border-b-2 border-gray-200 dark:border-gray-800 focus:border-cyan-500 px-0 py-2 outline-none transition-colors font-mono text-sm resize-none"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending' || status === 'success'}
                                className={`w-full py-4 rounded-lg font-mono text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${status === 'success'
                                    ? 'bg-green-500 text-white'
                                    : status === 'error'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                                    }`}
                            >
                                {status === 'idle' && (
                                    <>
                                        <span>Execute Transmission</span>
                                        <Send size={16} />
                                    </>
                                )}
                                {status === 'sending' && (
                                    <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-black"></span>
                                        <span>Transmitting...</span>
                                    </>
                                )}
                                {status === 'success' && (
                                    <>
                                        <CheckCircle2 size={16} />
                                        <span>Transmission Complete</span>
                                    </>
                                )}
                                {status === 'error' && (
                                    <>
                                        <AlertCircle size={16} />
                                        <span>Transmission Failed</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

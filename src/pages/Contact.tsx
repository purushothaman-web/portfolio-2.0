import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, CheckCircle2, AlertCircle, Loader2, Linkedin, Github, Copy, Check, Clock, ArrowUpRight } from 'lucide-react';

export const Contact = () => {
    const form = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [copied, setCopied] = useState(false);

    const emailAddress = 'rpurushothaman500@gmail.com';

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(emailAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Something went wrong.');
            }

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            form.current?.reset();
            setTimeout(() => setStatus('idle'), 6000);
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Message could not be sent. Please use direct email.');
            setStatus('error');
            setTimeout(() => setStatus('idle'), 7000);
        }
    };

    return (
        <section id="contact" className="py-14 sm:py-16 px-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8 sm:mb-10 space-y-4 max-w-3xl"
            >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-semibold text-blue-700 tracking-wide uppercase">
                    <Mail size={13} className="text-blue-600" />
                    <span>Get in Touch</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-sans">
                    Let's Build Something Great Together
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-sans">
                    Have an open full-time position, freelance project, or just want to talk tech? Drop a note below or reach out directly — I typically reply within 24 hours.
                </p>
            </motion.div>

            {/* Two-Column Grid: Equal Height & Aligned Baselines */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                {/* Left Column: Direct Contact Info (5 cols) */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-5 flex flex-col justify-between h-full gap-5"
                >
                    {/* Fast Copy Email Card */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                        <div>
                            <span className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Direct Email
                            </span>
                            <a
                                href={`mailto:${emailAddress}`}
                                className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors break-all font-sans"
                            >
                                {emailAddress}
                            </a>
                        </div>

                        <motion.button
                            type="button"
                            onClick={handleCopyEmail}
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                            className="relative overflow-hidden w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_2px_8px_rgba(15,23,42,0.12)] hover:shadow-[0_6px_16px_rgba(15,23,42,0.2)] group/copy before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700 before:ease-out"
                        >
                            {copied ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 3 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-1.5"
                                >
                                    <Check size={14} className="text-emerald-400" />
                                    <span>Email Copied to Clipboard</span>
                                </motion.div>
                            ) : (
                                <>
                                    <Copy size={14} className="text-slate-300 group-hover/copy:text-white group-hover/copy:-rotate-12 transition-all duration-200" />
                                    <span>Copy Email Address</span>
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* Social & Location Pill Card */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex-1 flex flex-col justify-between text-sm space-y-3">
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <div className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">Location</div>
                                <div className="font-semibold text-slate-800 font-sans">Bangalore, India &middot; Open to Remote</div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <Clock size={18} />
                            </div>
                            <div>
                                <div className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">Availability</div>
                                <div className="font-semibold text-slate-800 font-sans">Immediate &middot; Full-Time / Contract</div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                <Linkedin size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">LinkedIn</div>
                                <a
                                    href="https://linkedin.com/in/purushothaman-web/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-slate-700 hover:text-blue-600 transition-colors truncate flex items-center gap-1 text-xs group/link"
                                >
                                    <span>in/purushothaman-web</span>
                                    <ArrowUpRight size={12} className="text-slate-400 group-hover/link:text-blue-600 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                                </a>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                <Github size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">GitHub</div>
                                <a
                                    href="https://github.com/purushothaman-web"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-slate-700 hover:text-blue-600 transition-colors truncate flex items-center gap-1 text-xs group/link"
                                >
                                    <span>@purushothaman-web</span>
                                    <ArrowUpRight size={12} className="text-slate-400 group-hover/link:text-blue-600 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Contact Message Form (7 cols) */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col h-full"
                >
                    <form ref={form} onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-4 flex-1 flex flex-col">
                            <div className="space-y-1.5">
                                <label htmlFor="name" className="text-xs font-semibold text-slate-700 block font-sans">
                                    Your Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="What's your name?"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200/80 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all font-sans text-sm text-slate-900 placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-xs font-semibold text-slate-700 block font-sans">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@company.com"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200/80 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all font-sans text-sm text-slate-900 placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-1.5 flex-1 flex flex-col">
                                <label htmlFor="message" className="text-xs font-semibold text-slate-700 block font-sans">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell me about the project, role, or questions you have..."
                                    className="w-full flex-1 min-h-30 px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200/80 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all font-sans text-sm text-slate-900 placeholder:text-slate-400 resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-1">
                            <motion.button
                                type="submit"
                                disabled={status === 'sending'}
                                whileHover={{ y: -1.5 }}
                                whileTap={{ y: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                                className="relative overflow-hidden w-full py-3.5 px-6 rounded-xl bg-slate-900 text-white font-sans font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-[0_4px_14px_rgba(15,23,42,0.18)] hover:shadow-[0_8px_22px_rgba(15,23,42,0.28)] group/send before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700 before:ease-out"
                            >
                                {status === 'sending' ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Sending Message...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <Send size={15} className="transition-transform duration-200 ease-out group-hover/send:translate-x-1 group-hover/send:-translate-y-1" />
                                    </>
                                )}
                            </motion.button>

                            {/* Status Messages */}
                            {status === 'success' && (
                                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                                    <span>Thank you! Your message was sent successfully. I'll get back to you shortly.</span>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-sans flex items-center gap-2.5">
                                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};
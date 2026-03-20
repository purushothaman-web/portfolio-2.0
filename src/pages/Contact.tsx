import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, CheckCircle2, AlertCircle, Loader2, Linkedin } from 'lucide-react';

export const Contact = () => {
    const form = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

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
            setErrorMsg(err instanceof Error ? err.message : 'Failed to send. Try emailing directly.');
            setStatus('error');
            setTimeout(() => setStatus('idle'), 7000);
        }
    };

    return (
        <div id="contact" className="min-h-screen py-32 px-6 max-w-7xl mx-auto flex flex-col justify-center bg-transparent relative">

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start relative z-10 w-full">

                {/* Left Column */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="space-y-12"
                >
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d3557] font-sans">
                            Let's Build Something Together.
                        </h2>
                        <div className="w-16 h-1 bg-[#e63946] rounded-full" />
                        <p className="text-lg text-gray-600 leading-relaxed font-sans">
                            Whether you need a robust backend architecture, a full-stack web application, or just want to discuss development challenges—I'm always open to new opportunities.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1d3557]">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email</h4>
                                <a
                                    href="mailto:rpurushothaman500@gmail.com"
                                    className="text-[#1d3557] font-semibold hover:text-[#e63946] transition-colors text-lg"
                                >
                                    rpurushothaman500@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1d3557]">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Location</h4>
                                <span className="text-gray-700 font-medium text-lg">Bangalore, India</span>
                                <span className="text-gray-400 font-sans text-sm block">Originally from Vellore, TN</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1d3557]">
                                <Linkedin size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">LinkedIn</h4>
                                <a
                                    href="https://www.linkedin.com/in/purushothaman-web/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#1d3557] font-semibold hover:text-[#0077b5] transition-colors text-lg"
                                >
                                    purushothaman-web
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white editorial-card rounded-3xl p-8 lg:p-12 relative overflow-hidden"
                >
                    <h3 className="text-2xl font-bold text-[#1d3557] mb-8 font-sans">Send a Message</h3>

                    <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-[#1d3557] mb-2 font-sans">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1d3557] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d3557]/10 px-4 py-3 transition-all font-sans text-gray-800 placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#1d3557] mb-2 font-sans">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="jane@example.com"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1d3557] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d3557]/10 px-4 py-3 transition-all font-sans text-gray-800 placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#1d3557] mb-2 font-sans">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                placeholder="How can we collaborate?"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1d3557] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d3557]/10 px-4 py-3 transition-all font-sans text-gray-800 placeholder-gray-400 resize-none"
                            />
                        </div>

                        {/* Error message */}
                        {status === 'error' && errorMsg && (
                            <p className="text-sm text-red-600 font-sans">{errorMsg}</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'sending' || status === 'success'}
                            className={`w-full py-4 rounded-xl font-sans font-semibold transition-all flex items-center justify-center gap-2.5 ${
                                status === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                                    : status === 'error'
                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                        : 'bg-[#1d3557] text-white hover:bg-[#112240] hover:shadow-lg disabled:opacity-60'
                            }`}
                        >
                            {status === 'idle'    && <><span>Send Message</span><Send size={17} /></>}
                            {status === 'sending' && <><Loader2 size={17} className="animate-spin" /><span>Sending…</span></>}
                            {status === 'success' && <><CheckCircle2 size={17} /><span>Message Sent!</span></>}
                            {status === 'error'   && <><AlertCircle size={17} /><span>Try again</span></>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};
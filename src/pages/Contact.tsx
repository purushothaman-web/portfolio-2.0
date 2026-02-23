import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
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
        <div id="contact" className="min-h-screen py-32 px-6 max-w-7xl mx-auto flex flex-col justify-center bg-transparent relative">
            
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start relative z-10 w-full">
                
                {/* Left Column: Context & Info */}
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
                        <div className="w-16 h-1 bg-[#e63946] rounded-full"></div>
                        <p className="text-lg text-gray-600 leading-relaxed font-sans">
                            Whether you need a robust backend architecture, a full-stack web application, or just want to discuss engineering challenges—I'm always open to new opportunities.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1d3557]">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email</h4>
                                <a href="mailto:rpurushothaman500@gmail.com" className="text-[#1d3557] font-semibold hover:text-[#e63946] transition-colors text-lg">rpurushothaman500@gmail.com</a>
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

                    <form ref={form} onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#1d3557] mb-2 font-sans">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Jane Doe"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1d3557] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d3557]/10 px-4 py-3 transition-all font-sans text-gray-800 placeholder-gray-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1d3557] mb-2 font-sans">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="jane@example.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1d3557] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d3557]/10 px-4 py-3 transition-all font-sans text-gray-800 placeholder-gray-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1d3557] mb-2 font-sans">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="How can we collaborate?"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1d3557] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d3557]/10 px-4 py-3 transition-all font-sans text-gray-800 placeholder-gray-400 resize-none"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'sending' || status === 'success'}
                            className={`w-full py-4 rounded-xl font-sans font-semibold transition-all flex items-center justify-center gap-2 ${
                                status === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : status === 'error'
                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                        : 'bg-[#1d3557] text-white hover:bg-[#112240] hover:shadow-lg disabled:opacity-70'
                            }`}
                        >
                            {status === 'idle' && (
                                <>
                                    <span>Send Message</span>
                                    <Send size={18} />
                                </>
                            )}
                            {status === 'sending' && (
                                <>
                                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-[#1d3557]/30 border-t-white"></span>
                                    <span>Sending...</span>
                                </>
                            )}
                            {status === 'success' && (
                                <>
                                    <CheckCircle2 size={18} />
                                    <span>Message Sent</span>
                                </>
                            )}
                            {status === 'error' && (
                                <>
                                    <AlertCircle size={18} />
                                    <span>Failed to send</span>
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
                
            </div>
        </div>
    );
};

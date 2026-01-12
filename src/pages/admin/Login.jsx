import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error("Login failed", err);
            setError('فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-zinc-900/60 backdrop-blur-2xl p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-white/10 relative z-10"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent mb-3">
                        مكانك الجامعي
                    </h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-4" />
                    <p className="text-zinc-400 font-bold tracking-widest uppercase text-xs">Admin Portal</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm text-right font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-zinc-400 text-xs font-bold mb-2 text-right uppercase tracking-wider">البريد الإلكتروني</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-right dir-rtl font-medium"
                            placeholder="admin@makanak.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-xs font-bold mb-2 text-right uppercase tracking-wider">كلمة المرور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-right dir-rtl"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-black py-4 rounded-xl shadow-xl shadow-red-900/20 hover:shadow-red-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                    >
                        {loading ? 'جاري التحقق...' : 'دخول المسؤول'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;

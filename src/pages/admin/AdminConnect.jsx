import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';

const AdminConnect = () => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateToken = async () => {
        setLoading(true);
        try {
            // Generate a random 6-digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // Save to Firestore (valid for 5 mins)
            await addDoc(collection(db, 'guest_tokens'), {
                token: code,
                createdAt: serverTimestamp(),
                expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                status: 'active'
            });

            setToken(code);
        } catch (error) {
            console.error("Error generating token:", error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-600/10 rounded-full blur-[80px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl border border-zinc-800 max-w-sm w-full text-center relative z-10"
            >
                <h2 className="text-2xl font-bold text-white mb-2">ربط الهاتف</h2>
                <p className="text-zinc-400 mb-8 text-sm">استخدم هذا الرمز للدخول المؤقت كزائر</p>

                {token ? (
                    <div className="mb-8">
                        <div className="text-5xl font-mono font-bold tracking-wider text-green-400 mb-4">
                            {token}
                        </div>
                        <p className="text-xs text-zinc-500">صالح لمدة 5 دقائق</p>
                    </div>
                ) : (
                    <div className="h-32 flex items-center justify-center text-zinc-600 text-sm italic mb-4">
                        جاهز لتوليد الرمز
                    </div>
                )}

                <button
                    onClick={generateToken}
                    disabled={loading}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg transition-colors border border-zinc-700"
                >
                    {loading ? 'جاري التوليد...' : token ? 'توليد رمز جديد' : 'توليد رمز الدخول'}
                </button>
            </motion.div>
        </div>
    );
};

export default AdminConnect;

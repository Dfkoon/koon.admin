import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function AdminConnect() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                return;
            }

            try {
                // Check token in Firestore
                const q = query(collection(db, 'guest_tokens'), where('token', '==', token));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setStatus('error');
                    return;
                }

                // Check expiry
                let valid = false;
                let docId = null;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.expires > Date.now()) {
                        valid = true;
                        docId = doc.id;
                    }
                });

                if (valid) {
                    // Authorize Data
                    localStorage.setItem('KOON_ADMIN_DEVICE_KEY', 'MAC_BOOK_PRO_SECURE_ID_9928374');
                    setStatus('success');

                    // Consume token (delete it) - optional, but good for security (One-time use)
                    if (docId) {
                        try {
                            await deleteDoc(doc(db, 'guest_tokens', docId));
                        } catch (e) { console.error("Error deleting token", e); }
                    }

                    // Redirect after delay
                    setTimeout(() => {
                        navigate('/admin/dashboard');
                    }, 2000);
                } else {
                    setStatus('error');
                }

            } catch (error) {
                console.error("Verification failed", error);
                setStatus('error');
            }
        };

        verifyToken();
    }, [token, navigate]);

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#f5f5f5',
            p: 3
        }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4, maxWidth: 400, width: '100%' }}>
                {status === 'verifying' && (
                    <>
                        <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
                        <Typography variant="h6">جاري التحقق من الجهاز...</Typography>
                        <Typography variant="body2" color="text.secondary">Verifying Security Token...</Typography>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>تم بنجاح!</Typography>
                        <Typography variant="body1">تم توثيق هذا الجهاز بنجاح.</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>جاري تفعيل "الرادار" والدخول...</Typography>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <Error sx={{ fontSize: 80, color: '#f44336', mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>فشل التحقق</Typography>
                        <Typography variant="body1">الرابط غير صالح أو منتهي الصلاحية.</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>يرجى طلب كود جديد من الجهاز الرئيسي.</Typography>
                    </>
                )}
            </Paper>
        </Box>
    );
}

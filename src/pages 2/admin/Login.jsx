import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert, Paper, Link } from '@mui/material';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);

            await login(email, password);
            // The AuthContext will now have the user set.
            // We just need to wait a tiny bit or trust the role check.
            // Actually, we can check the email directly for admin navigation:
            if (email.toLowerCase() === 'admin' || email.toLowerCase() === import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase()) {
                navigate('/admin/dashboard');
            } else {
                navigate('/profile');
            }
        } catch {
            setError('فشل تسجيل الدخول. تحقق من بيانات الاعتماد.');
        }

        setLoading(false);
    }

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    تسجيل دخول المشرف
                </Typography>

                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="اسم المستخدم"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="كلمة المرور"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                    </Button>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link component={RouterLink} to="/signup" variant="body2">
                            ليس لديك حساب؟ إنشاء حساب جديد
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

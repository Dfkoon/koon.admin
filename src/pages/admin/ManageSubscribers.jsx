import React, { useEffect, useState } from 'react';
import {
    Box, Typography, IconButton,
    Grid, Avatar, Tooltip, useTheme, Button,
    TextField, InputAdornment
} from '@mui/material';
import {
    Delete, Email as EmailIcon, Person,
    Search, ContentCopy, MarkEmailRead,
    Unsubscribe
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribersService } from '../../services/subscribersService';
import ShinyHeader from '../../components/ShinyHeader';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

export default function ManageSubscribers() {
    const { language } = useLanguage();
    const theme = useTheme();
    const isAr = language === 'ar';
    const [subscribers, setSubscribers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadData = async () => {
        setIsLoading(true);
        const data = await subscribersService.getSubscribers();
        setSubscribers(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا المشترك؟' : 'Are you sure you want to remove this subscriber?')) {
            const result = await subscribersService.unsubscribe(id);
            if (result.success) {
                toast.success(isAr ? 'تم الحذف' : 'Subscriber removed');
                loadData();
            }
        }
    };

    const copyEmail = (email) => {
        navigator.clipboard.writeText(email);
        toast.success(isAr ? 'تم نسخ البريد' : 'Email copied');
    };

    const filtered = subscribers.filter(s =>
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <ShinyHeader text={isAr ? 'قائمة المشتركين' : 'Subscriber List'} variant="h3" gutterBottom={false} />
                    <Typography variant="body2" sx={{ color: 'text.muted', mt: 1, fontWeight: 700 }}>
                        {isAr ? 'إدارة القائمة البريدية لزوار الموقع' : 'Manage the mailing list for website visitors'}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, maxWidth: { md: '400px' } }}>
                    <TextField
                        fullWidth
                        placeholder={isAr ? 'بحث عن بريد...' : 'Search email...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="filled"
                        size="small"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                            sx: { borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.03)' }
                        }}
                    />
                </Box>
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                    <Typography variant="h5" color="text.muted" className="animate-pulse">
                        {isAr ? 'جاري التحميل...' : 'Fetching subscribers...'}
                    </Typography>
                </Box>
            ) : filtered.length === 0 ? (
                <Box className="glass-card" sx={{ p: 10, textAlign: 'center', borderRadius: '40px' }}>
                    <MarkEmailRead sx={{ fontSize: '5rem', opacity: 0.1, mb: 2 }} />
                    <Typography variant="h6" color="text.muted">{isAr ? 'لا يوجد مشتركون حالياً' : 'No subscribers found'}</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    <AnimatePresence>
                        {filtered.map((s, index) => (
                            <Grid item xs={12} sm={6} lg={4} key={s.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Box className="glass-card" sx={{
                                        p: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        borderRadius: '25px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'var(--bg-card)',
                                        transition: '0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            borderColor: 'var(--primary)',
                                            background: 'rgba(211, 47, 47, 0.05)'
                                        }
                                    }}>
                                        <Avatar sx={{
                                            width: 50,
                                            height: 50,
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--glass-border)'
                                        }}>
                                            <Person sx={{ color: 'var(--primary)' }} />
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                                            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 900, color: '#FFF' }}>
                                                {s.email}
     
import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button,
    Grid, Chip, IconButton, Divider,
    Dialog, DialogTitle, DialogContent, Avatar, useTheme
} from '@mui/material';
import {
    Delete, Visibility, HelpOutline,
    Person, ErrorOutline,
    ContentCopy, Close, WarningAmber
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { qnaService } from '../../services/qnaService';
import ShinyHeader from '../../components/ShinyHeader';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

export default function AdminReports() {
    const { language } = useLanguage();
    const theme = useTheme();
    const isAr = language === 'ar';
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    const loadReports = async () => {
        setIsLoading(true);
        const data = await qnaService.getAllReports();
        setReports(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا البلاغ؟' : 'Are you sure you want to delete this report?')) {
            const result = await qnaService.deleteReport(id);
            if (result.success) {
                toast.success(isAr ? 'تم حذف البلاغ' : 'Report deleted');
                loadReports();
            } else {
                toast.error(isAr ? 'فشل الحذف' : 'Deletion failed');
            }
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success(isAr ? 'تم النسخ' : 'Copied');
    };

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            <Box sx={{ mb: 6 }}>
                <ShinyHeader text={isAr ? 'بلاغات الأسئلة' : 'Question Reports'} variant="h3" gutterBottom />
                <Typography variant="body2" sx={{ color: 'text.muted', mt: 1, fontWeight: 700 }}>
                    {isAr ? 'مراجعة البلاغات المقدمة من الطلاب حول الأسئلة' : 'Review reports submitted by students about questions'}
                </Typography>
            </Box>

            {isLoading ? (
                <Box sx={{ textAlign: 'center', p: 10 }}>
                    <Typography variant="h5" className="animate-pulse">{isAr ? 'جاري التحميل...' : 'Syncing reports...'}</Typography>
                </Box>
            ) : reports.length === 0 ? (
                <Box className="glass-card" sx={{ p: 10, textAlign: 'center', borderRadius: '40px' }}>
                    <WarningAmber sx={{ fontSize: '5rem', opacity: 0.1, mb: 2 }} />
                    <Typography variant="h6" color="text.muted">{isAr ? 'لا توجد بلاغات حالياً' : 'No active reports'}</Typography>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    <AnimatePresence>
                        {reports.map((report, index) => (
                            <Grid item xs={12} key={report.id}>
                                <motion.div
                                    initial={{ opacity: 0, x: isAr ? 50 : -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Box className="glass-card" sx={{
                                        p: 0,
                                        display: 'flex',
                                        flexDirection: { xs: 'column', md: 'row' },
                                        borderRadius: '30px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(211, 47, 47, 0.05)',
                                        transition: 'var(--transition-smooth)',
                                        '&:hover': {
                                            borderColor: 'var(--primary)',
                                            boxShadow: '0 0 30px rgba(211, 47, 47, 0.1)'
                                        }
                                    }}>
                                        {/* Error Indicator Side */}
                                        <Box sx={{
                                            width: { xs: '100%', md: '12px' },
                                            height: { xs: '6px', md: 'auto' },
                                            bgcolor: 'var(--primary)',
                                            boxShadow: '0 0 15px var(--primary)'
                                        }} />

                                        {/* Sender Profile Section */}
                                        <Box sx={{
                                            p: 4,
                                            minWidth: '220px',
                                            bgcolor: 'rgba(0,0,0,0.2)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 2,
                                            borderRight: isAr ? 'none' : '1px solid var(--glass-border)',
                                            borderLeft: isAr ? '1px solid var(--glass-border)' : 'none'
                                        }}>
                                            <Avatar sx={{
                                                width: 70,
                                                height: 70,
                                                bgcolor: 'var(--bg-dark)',
                                                border: '2px solid var(--primary)',
                                                boxShadow: '0 0 20px rgba(211, 47, 47, 0.2)'
                                            }}>
                                                <Person sx={{ fontSize: '2.5rem', color: 'var(--primary)' }} />
                                            </Avatar>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#FFF' }}>
                                                    {report.senderName}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.muted', fontWeight: 700 }}>
                                                    {new Date(report.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={isAr ? `خدمة كـُـن` : `KOON Q&A`}
                                                size="small"
                                                sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.05)', fontWeight: 900 }}
                                            />
                                        </Box>

                                        {/* Report Body */}
                                        <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                                    <HelpOutline sx={{ color: 'var(--primary)', fontSize: '1.2rem' }} />
                                                    <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6 }}>
                                                        {isAr ? 'السؤال محل البلاغ' : 'Reported Question'}
                                                    </Typography>
                                                    <Tooltip title={isAr ? 'نسخ نص السؤال' : 'Copy Question'}>
                                                        <IconButton size="small" onClick={() => copyToClipboard(report.questionText)} sx={{ ml: 'auto' }}>
                                                            <ContentCopy fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                                <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: '15px', border: '1px solid var(--glass-border)', mb: 3 }}>
                                                    <Typography variant="body2" sx={{ color: '#CCC', fontStyle: 'italic', lineHeight: 1.6 }}>
                                                        "{report.questionText}"
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                                    <ErrorOutline sx={{ color: 'var(--primary)', fontSize: '1.2rem' }} />
                                                    <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6 }}>
                                                        {isAr ? 'وصف المشكلة' : 'Issue Description'}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body1" sx={{ color: '#FFF', fontWeight: 700, lineHeight: 1.6 }}>
                                                    {report.errorDescription}
                                                </Typography>
                                            </Box>

                                            {/* Proof Image */}
                                            {report.image && (
                                                <Box sx={{ width: { xs: '100%', md: '180px' }, height: '180px', flexShrink: 0 }}>
                                                    <Box
                                                        onClick={() => setSelectedImage(report.image)}
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '20px',
                                                            overflow: 'hidden',
                                                            cursor: 'zoom-in',
                                                            border: '2px solid var(--glass-border)',
                                                            position: 'relative',
                                                            '&:hover .overlay': { opacity: 1 }
                                                        }}
                                                    >
                                                        <img src={report.image} alt="Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <Box className="overlay" sx={{
                                                            position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.6)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            opacity: 0, transition: '0.3s'
                                                        }}>
                                                            <Visibility sx={{ color: '#FFF' }} />
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Action Bar */}
                                        <Box sx={{
                                            p: 3,
                                            bgcolor: 'rgba(0,0,0,0.1)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            gap: 2,
                                            minWidth: '120px'
                                        }}>
                                            <Tooltip title={isAr ? 'تم الحل / حذف البلاغ' : 'Resolved / Delete'}>
                                                <IconButton
                                                    onClick={() => handleDelete(report.id)}
                                                    sx={{
                                                        bgcolor: 'rgba(211, 47, 47, 0.1)',
                                                        color: 'var(--primary)',
                                                        width: 50, height: 50,
                                                        borderRadius: '15px'
                                                    }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            )}

            <Dialog
                open={Boolean(selectedImage)}
                onClose={() => setSelectedImage(null)}
                maxWidth="lg"
                PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}
            >
                <Box sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={() => setSelectedImage(null)}
                        sx={{ position: 'absolute', top: -40, right: 0, color: '#FFF' }}
                    >
                        <Close />
                    </IconButton>
                    <img src={selectedImage} alt="Full Proof" style={{ width: '100%', maxWidth: '90vw', maxHeight: '80vh', borderRadius: '30px', border: '5px solid var(--glass-border)' }} />
                </Box>
            </Dialog>
        </Box>
    );
}


import React, { useEffect, useState } from 'react';
import {
    Box, IconButton, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField,
    Select, MenuItem, FormControl, InputLabel, Chip,
    Typography, Grid, Divider, useTheme
} from '@mui/material';
import {
    Delete, Edit, Add, Campaign as CampaignIcon,
    Link as LinkIcon, AccessTime, Close, Send,
    AutoGraph
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { updatesService } from '../../services/updatesService';
import ShinyHeader from '../../components/ShinyHeader';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

export default function ManageUpdates() {
    const { language } = useLanguage();
    const theme = useTheme();
    const isAr = language === 'ar';
    const [updates, setUpdates] = useState([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        titleAr: '', titleEn: '',
        textAr: '', textEn: '',
        category: 'news',
        link: '',
        isUrgent: false
    });

    const loadUpdates = async () => {
        setIsLoading(true);
        const data = await updatesService.getAllUpdates();
        setUpdates(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadUpdates();
    }, []);

    const handleOpen = (update = null) => {
        if (update) {
            setFormData(update);
            setEditingId(update.id);
        } else {
            setFormData({
                titleAr: '', titleEn: '',
                textAr: '', textEn: '',
                category: 'news',
                link: '',
                isUrgent: false
            });
            setEditingId(null);
        }
        setOpen(true);
    };

    const handleSubmit = async () => {
        let result;
        if (editingId) {
            result = await updatesService.updateUpdate(editingId, formData);
        } else {
            result = await updatesService.createUpdate(formData);
        }

        if (result.success) {
            toast.success(isAr ? 'تم حفظ التحديث بنجاح' : 'Update saved successfully');
            setOpen(false);
            loadUpdates();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا التحديث؟' : 'Are you sure you want to delete this update?')) {
            const result = await updatesService.deleteUpdate(id);
            if (result.success) {
                toast.success(isAr ? 'تم الحذف' : 'Deleted');
                loadUpdates();
            }
        }
    };

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <ShinyHeader text={isAr ? 'إدارة المستجدات والتحديثات' : 'Manage News & Updates'} variant="h3" gutterBottom={false} />
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                    sx={{ borderRadius: '15px', px: 4, fontWeight: 900 }}
                >
                    {isAr ? 'إضافة تحديث جديد' : 'Publish New Update'}
                </Button>
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                    <Typography variant="h5" color="text.muted" className="animate-pulse">
                        {isAr ? 'جاري التحميل...' : 'Syncing updates...'}
                    </Typography>
                </Box>
            ) : updates.length === 0 ? (
                <Box className="glass-card" sx={{ p: 10, textAlign: 'center', borderRadius: '40px' }}>
                    <CampaignIcon sx={{ fontSize: '5rem', opacity: 0.1, mb: 2 }} />
                    <Typography variant="h5" color="text.muted">{isAr ? 'لا توجد تحديثات حالياً' : 'No recent updates'}</Typography>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    <AnimatePresence mode="popLayout">
                        {updates.map((update, index) => (
                            <Grid item xs={12} key={update.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Box className="glass-card" sx={{
                                        p: 4,
                                        display: 'flex',
                                        flexDirection: { xs: 'column', md: 'row' },
                                        gap: 3,
                                        borderRadius: '30px',
                                        border: '1px solid var(--glass-border)',
                                        background: update.isUrgent ? 'linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(0,0,0,0) 100%)' : 'var(--bg-card)',
                                        position: 'relative',
                                        transition: 'var(--transition-smooth)',
                                        '&:hover': {
                                            transform: 'translateX(10px)',
                                            borderColor: update.isUrgent ? 'var(--primary)' : 'var(--glass-border-heavy)'
                                        }
                                    }}>
                                        {/* Date/Status Info */}
                                        <Box sx={{
                                            minWidth: '150px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: { xs: 'flex-start', md: 'center' },
                                            borderRight: isAr ? 'none' : '1px solid var(--glass-border)',
                                            borderLeft: isAr ? '1px solid var(--glass-border)' : 'none',
                                            pr: isAr ? 0 : 3,
                                            pl: isAr ? 3 : 0
                                        }}>
                                            <Typography variant="h4" sx={{ fontWeight: 900, color: 'var(--primary)' }}>
                                                {new Date(update.createdAt).getDate()}
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.6, textTransform: 'uppercase' }}>
                                                {new Date(update.createdAt).toLocaleString(isAr ? 'ar-EG' : 'en-US', { month: 'short', year: 'numeric' })}
                                            </Typography>
                                            <Chip
                                                label={update.category}
                                                size="small"
                                                variant="outlined"
                                                sx={{ mt: 2, textTransform: 'uppercase', fontSize: '0.6rem', fontWeight: 900 }}
                                            />
                                        </Box>

                                        {/* Content */}
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                {update.isUrgent && (
                                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                                                        <CampaignIcon color="error" />
                                                    </motion.div>
                                                )}
                                                <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFF' }}>
                                                    {isAr ? update.titleAr : update.titleEn}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: 'var(--text-main)', opacity: 0.8, lineHeight: 1.8, mb: 2 }}>
                                                {isAr ? update.textAr : update.textEn}
                                            </Typography>
                                            {update.link && (
                                                <Button
                                                    size="small"
                                                    startIcon={<LinkIcon />}
                                                    href={update.link}
                                                    target="_blank"
                                                    sx={{ color: 'var(--primary)', fontWeight: 900 }}
                                                >
                                                    {isAr ? 'رابط المرفق' : 'Attachment Link'}
                                                </Button>
                                            )}
                                        </Box>

                                        {/* Actions */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <IconButton color="primary" onClick={() => handleOpen(update)} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}><Edit /></IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(update.id)} sx={{ bgcolor: 'rgba(211, 47, 47, 0.1)' }}><Delete /></IconButton>
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            )}

            {/* Premium Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: '30px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
                    }
                }}
            >
                <DialogTitle sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                        {editingId ? (isAr ? 'تحديث البيانات' : 'Edit Update') : (isAr ? 'نشر إشعار جديد' : 'New Announcement')}
                    </Typography>
                    <IconButton onClick={() => setOpen(false)}><Close /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ px: 4, pb: 2 }}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label={isAr ? 'العنوان بالعربية' : 'Arabic Title'}
                                value={formData.titleAr}
                                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                                variant="filled"
                                sx={{ '& .MuiFilledInput-root': { borderRadius: '15px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="English Title"
                                value={formData.titleEn}
                                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                variant="filled"
                                sx={{ '& .MuiFilledInput-root': { borderRadius: '15px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label={isAr ? 'التفاصيل بالعربية' : 'Arabic Details'}
                                value={formData.textAr}
                                onChange={(e) => setFormData({ ...formData, textAr: e.target.value })}
                                variant="filled"
                                sx={{ '& .MuiFilledInput-root': { borderRadius: '15px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="English Details"
                                value={formData.textEn}
                                onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
                                variant="filled"
                                sx={{ '& .MuiFilledInput-root': { borderRadius: '15px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    sx={{ borderRadius: '15px' }}
                                >
                                    <MenuItem value="academic">{isAr ? 'أكاديمي' : 'Academic'}</MenuItem>
                                    <MenuItem value="event">{isAr ? 'فعالية' : 'Event'}</MenuItem>
                                    <MenuItem value="news">{isAr ? 'أخبار' : 'News'}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                label="Link (URL)"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, color: 'primary.main' }} /> }}
                                variant="filled"
                                sx={{ '& .MuiFilledInput-root': { borderRadius: '15px' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box
                                onClick={() => setFormData({ ...formData, isUrgent: !formData.isUrgent })}
                                sx={{
                                    p: 2,
                                    borderRadius: '15px',
                                    border: '1px solid',
                                    borderColor: formData.isUrgent ? 'var(--primary)' : 'var(--glass-border)',
                                    bgcolor: formData.isUrgent ? 'rgba(211, 47, 47, 0.1)' : 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    transition: '0.3s'
                                }}
                            >
                                <CampaignIcon color={formData.isUrgent ? "error" : "disabled"} />
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>{isAr ? 'تحديث عاجل' : 'Urgent Update'}</Typography>
                                    <Typography variant="caption">{isAr ? 'سيظهر بشكل مميز في الموقع' : 'Will be highlighted on the website'}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 4 }}>
                    <Button onClick={() => setOpen(false)} sx={{ fontWeight: 900 }}>{isAr ? 'إلغاء' : 'Cancel'}</Button>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Send />}
                        onClick={handleSubmit}
                        sx={{ borderRadius: '15px', px: 4, fontWeight: 900 }}
                    >
                        {isAr ? 'نشر الآن' : 'Publish Now'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}


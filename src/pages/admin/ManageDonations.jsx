import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import {
    Box, Typography, Grid, IconButton, Button,
    Chip, Avatar, Divider, Tooltip, useTheme
} from '@mui/material';
import {
    Delete, CheckCircle, Cancel, Person,
    Inventory, CalendarMonth, LocalPhone,
    Print, History, Search, FilterList
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ShinyHeader from '../../components/ShinyHeader';
import { useLanguage } from '../../context/LanguageContext';

const ManageDonations = () => {
    const { language } = useLanguage();
    const theme = useTheme();
    const isAr = language === 'ar';
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'materialDonations'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const donationsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDonations(donationsData);
        } catch (error) {
            console.error('Error fetching donations:', error);
            toast.error(isAr ? 'حدث خطأ في تحميل البيانات' : 'Error loading data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await updateDoc(doc(db, 'materialDonations', id), {
                status: 'approved'
            });
            toast.success(isAr ? 'تمت الموافقة بنجاح ✅' : 'Approved successfully');
            fetchDonations();
        } catch (error) {
            console.error('Error approving:', error);
            toast.error(isAr ? 'حدث خطأ في الموافقة' : 'Error approving');
        }
    };

    const handleReject = async (id) => {
        if (window.confirm(isAr ? 'هل تريد رفض هذا التبرع؟' : 'Reject this donation?')) {
            try {
                await deleteDoc(doc(db, 'materialDonations', id));
                toast.success(isAr ? 'تم الرفض والحذف' : 'Rejected and deleted');
                fetchDonations();
            } catch (error) {
                console.error('Error rejecting:', error);
                toast.error(isAr ? 'حدث خطأ في الرفض' : 'Error rejecting');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(isAr ? 'هل تريد حذف هذا التبرع؟' : 'Delete this donation?')) {
            try {
                await deleteDoc(doc(db, 'materialDonations', id));
                toast.success(isAr ? 'تم الحذف بنجاح' : 'Deleted successfully');
                fetchDonations();
            } catch (error) {
                console.error('Error deleting:', error);
                toast.error(isAr ? 'حدث خطأ في الحذف' : 'Error deleting');
            }
        }
    };

    const filteredDonations = donations.filter(donation => {
        const searchLower = searchQuery.toLowerCase();
        const materialsString = Array.isArray(donation.materials)
            ? donation.materials.join(' ')
            : donation.materials || '';

        const matchesSearch = (
            donation.studentName?.toLowerCase().includes(searchLower) ||
            donation.phoneNumber?.includes(searchQuery) ||
            materialsString.toLowerCase().includes(searchLower)
        );

        const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const pendingCount = donations.filter(d => d.status === 'pending').length;
    const approvedCount = donations.filter(d => d.status === 'approved').length;

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            {/* Header Area */}
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <ShinyHeader text={isAr ? 'إدارة تبرعات المواد' : 'Manage Material Donations'} variant="h3" gutterBottom={false} />
                    <Typography variant="body2" sx={{ color: 'text.muted', mt: 1, fontWeight: 700 }}>
                        {isAr ? 'مراجعة طلبات التبرع بالكتب والمواد الدراسية' : 'Manage books and study material donations'}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<Print />}
                    onClick={() => window.print()}
                    sx={{ borderRadius: '12px', borderColor: 'var(--glass-border)', color: '#FFF' }}
                >
                    {isAr ? 'طباعة التقرير' : 'Print Report'}
                </Button>
            </Box>

            {/* Quick Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {[
                    { label: isAr ? 'قيد المراجعة' : 'Pending', value: pendingCount, color: 'var(--warning)', icon: <History /> },
                    { label: isAr ? 'تمت الموافقة' : 'Approved', value: approvedCount, color: 'var(--success)', icon: <CheckCircle /> },
                    { label: isAr ? 'إجمالي الطلبات' : 'Total', value: donations.length, color: 'var(--primary)', icon: <Inventory /> }
                ].map((stat, i) => (
                    <Grid item xs={12} sm={4} key={i}>
                        <Box className="glass-card" sx={{
                            p: 3,
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            border: '1px solid var(--glass-border)',
                            background: 'var(--bg-card)'
                        }}>
                            <Avatar sx={{ bgcolor: `${stat.color}11`, color: stat.color, width: 56, height: 56 }}>
                                {stat.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFF' }}>{stat.value}</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 900, opacity: 0.6, textTransform: 'uppercase' }}>{stat.label}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Filters Area */}
            <Box className="glass-card no-print" sx={{
                p: 2,
                mb: 4,
                borderRadius: '20px',
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.02)'
            }}>
                <Box sx={{ flexGrow: 1, position: 'relative' }}>
                    <Search sx={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                    <TextField
                        fullWidth
                        placeholder={isAr ? 'بحث بالاسم، الرقم، أو المادة...' : 'Search by name, phone, or material...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: { pl: 6, pr: 2, py: 1, borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.2)', color: '#FFF' }
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {['all', 'pending', 'approved'].map((f) => (
                        <Chip
                            key={f}
                            label={isAr ? (f === 'all' ? 'الكل' : (f === 'pending' ? 'المعلق' : 'المقبول')) : f.toUpperCase()}
                            onClick={() => setStatusFilter(f)}
                            color={statusFilter === f ? 'primary' : 'default'}
                            variant={statusFilter === f ? 'filled' : 'outlined'}
                            sx={{ fontWeight: 900, borderRadius: '10px' }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Content Display */}
            {loading ? (
                <Box sx={{ textAlign: 'center', p: 10 }}>
                    <Typography variant="h5" className="animate-pulse">{isAr ? 'جاري التحميل...' : 'Syncing data...'}</Typography>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    <AnimatePresence>
                        {filteredDonations.map((donation, index) => (
                            <Grid item xs={12} lg={6} key={donation.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Box className="glass-card" sx={{
                                        p: 4,
                                        borderRadius: '30px',
                                        border: '1px solid var(--glass-border)',
                                        background: donation.status === 'pending' ? 'linear-gradient(135deg, rgba(211, 47, 47, 0.05) 0%, rgba(0,0,0,0) 100%)' : 'rgba(255,255,255,0.01)',
                                        position: 'relative',
                                        transition: '0.3s',
                                        '&:hover': { transform: 'translateY(-5px)', borderColor: donation.status === 'pending' ? 'var(--primary)' : 'var(--success)' }
                                    }}>
                                        {/* Header: Student Info */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ width: 64, height: 64, bgcolor: 'var(--bg-dark)', border: '2px solid var(--primary)' }}>
                                                    <Person sx={{ fontSize: '2.5rem', opacity: 0.5 }} />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#FFF' }}>{donation.studentName}</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                        <LocalPhone sx={{ fontSize: '1rem', color: 'var(--primary)' }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.7 }}>
                                                            {donation.phoneNumber}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Chip
                                                label={isAr ? (donation.status === 'pending' ? 'قيد المراجعة' : 'موافقة نهائية') : donation.status}
                                                color={donation.status === 'pending' ? 'warning' : 'success'}
                                                sx={{ fontWeight: 900, borderRadius: '12px' }}
                                            />
                                        </Box>

                                        <Divider sx={{ mb: 3, opacity: 0.05 }} />

                                        {/* Materials List */}
                                        <Box sx={{ mb: 4 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Inventory sx={{ fontSize: '1.2rem', color: 'var(--primary)' }} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                    {isAr ? 'المواد المتبرع بها:' : 'Donated Materials:'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '15px' }}>
                                                <Typography variant="body1" sx={{ color: '#DDD', lineHeight: 1.6 }}>
                                                    {Array.isArray(donation.materials) ? donation.materials.join(' \u2022 ') : donation.materials}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Footer: Date & Actions */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.5 }}>
                                                <CalendarMonth sx={{ fontSize: '1rem' }} />
                                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                    {donation.createdAt?.toDate().toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {donation.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            startIcon={<CheckCircle />}
                                                            onClick={() => handleApprove(donation.id)}
                                                            sx={{ borderRadius: '12px', fontWeight: 900 }}
                                                        >
                                                            {isAr ? 'موافقة' : 'Approve'}
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            startIcon={<Cancel />}
                                                            onClick={() => handleReject(donation.id)}
                                                            sx={{ borderRadius: '12px', fontWeight: 900 }}
                                                        >
                                                            {isAr ? 'رفض' : 'Reject'}
                                                        </Button>
                                                    </>
                                                )}
                                                <IconButton
                                                    onClick={() => handleDelete(donation.id)}
                                                    sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--error)' }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            )}
        </Box>
    );
};

export default ManageDonations;


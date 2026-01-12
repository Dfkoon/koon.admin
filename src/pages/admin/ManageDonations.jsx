import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import GlassCard from '../../components/GlassCard';
import './ManageDonations.css';

const ManageDonations = () => {
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
            toast.error('حدث خطأ في تحميل البيانات');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await updateDoc(doc(db, 'materialDonations', id), {
                status: 'approved'
            });
            toast.success('تمت الموافقة بنجاح ✅');
            fetchDonations();
        } catch (error) {
            console.error('Error approving:', error);
            toast.error('حدث خطأ في الموافقة');
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('هل تريد رفض هذا التبرع؟')) {
            try {
                await deleteDoc(doc(db, 'materialDonations', id));
                toast.success('تم الرفض والحذف');
                fetchDonations();
            } catch (error) {
                console.error('Error rejecting:', error);
                toast.error('حدث خطأ في الرفض');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل تريد حذف هذا التبرع؟')) {
            try {
                await deleteDoc(doc(db, 'materialDonations', id));
                toast.success('تم الحذف بنجاح');
                fetchDonations();
            } catch (error) {
                console.error('Error deleting:', error);
                toast.error('حدث خطأ في الحذف');
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
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
        <div className="manage-donations-page">
            {/* Hero Section */}
            <div className="page-header">
                <h1 className="page-title">
                    <span className="title-icon">📦</span>
                    إدارة تبرعات المواد
                </h1>
                <p className="page-subtitle">
                    إدارة ومراجعة طلبات التبرع بالمواد الدراسية
                </p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <GlassCard className="stat-card">
                    <div className="stat-icon pending">⏳</div>
                    <div className="stat-content">
                        <div className="stat-value">{pendingCount}</div>
                        <div className="stat-label">قيد المراجعة</div>
                    </div>
                </GlassCard>

                <GlassCard className="stat-card">
                    <div className="stat-icon approved">✅</div>
                    <div className="stat-content">
                        <div className="stat-value">{approvedCount}</div>
                        <div className="stat-label">موافق عليها</div>
                    </div>
                </GlassCard>

                <GlassCard className="stat-card">
                    <div className="stat-icon total">📊</div>
                    <div className="stat-content">
                        <div className="stat-value">{donations.length}</div>
                        <div className="stat-label">إجمالي التبرعات</div>
                    </div>
                </GlassCard>
            </div>

            {/* Controls */}
            <GlassCard className="controls-card">
                <div className="controls-content">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="بحث بالاسم، الرقم، أو المادة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field search-input"
                        />
                    </div>

                    <button onClick={handlePrint} className="btn-secondary no-print">
                        <span>🖨️</span>
                        <span>طباعة</span>
                    </button>
                </div>
            </GlassCard>

            {/* Status Tabs */}
            <div className="status-tabs no-print">
                <button
                    className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                >
                    الكل ({donations.length})
                </button>
                <button
                    className={`status-tab pending ${statusFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('pending')}
                >
                    قيد المراجعة ({pendingCount})
                </button>
                <button
                    className={`status-tab approved ${statusFilter === 'approved' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('approved')}
                >
                    الموافق عليها ({approvedCount})
                </button>
            </div>

            {/* Table */}
            <GlassCard className="table-card">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner">⏳</div>
                        <p>جاري التحميل...</p>
                    </div>
                ) : filteredDonations.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        <h3>لا توجد نتائج</h3>
                        <p>جرب تغيير كلمة البحث أو الفلتر</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="donations-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>الحالة</th>
                                    <th>اسم الطالب</th>
                                    <th>رقم الهاتف</th>
                                    <th>المواد المتبرع بها</th>
                                    <th>التاريخ</th>
                                    <th>الوقت</th>
                                    <th className="no-print">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDonations.map((donation, index) => (
                                    <tr key={donation.id} className={donation.status === 'pending' ? 'pending-row' : ''}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <span className={`badge badge-${donation.status}`}>
                                                {donation.status === 'pending' ? 'قيد المراجعة' : 'موافق عليه'}
                                            </span>
                                        </td>
                                        <td className="name-cell">{donation.studentName}</td>
                                        <td className="phone-cell">
                                            <a href={`tel:${donation.phoneNumber}`}>{donation.phoneNumber}</a>
                                        </td>
                                        <td className="materials-cell">
                                            {Array.isArray(donation.materials)
                                                ? donation.materials.join('، ')
                                                : donation.materials}
                                        </td>
                                        <td>{formatDate(donation.createdAt)}</td>
                                        <td>{formatTime(donation.createdAt)}</td>
                                        <td className="actions-cell no-print">
                                            <div className="action-buttons">
                                                {donation.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(donation.id)}
                                                            className="btn-approve"
                                                            title="موافقة"
                                                        >
                                                            ✅
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(donation.id)}
                                                            className="btn-reject"
                                                            title="رفض"
                                                        >
                                                            ❌
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(donation.id)}
                                                    className="btn-delete"
                                                    title="حذف"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

export default ManageDonations;

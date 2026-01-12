import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import StatsCard from '../../components/StatsCard';
import './Dashboard.css';

export default function Dashboard() {
    const [stats, setStats] = useState({
        subscribers: 0,
        questions: 0,
        pendingQuestions: 0,
        donations: 0,
        pendingDonations: 0,
        testimonials: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Subscribers
                const subscribersSnap = await getDocs(collection(db, "subscribers"));

                // 2. Q&A
                const qnaSnap = await getDocs(collection(db, "qna"));
                const pendingQna = qnaSnap.docs.filter(doc => !doc.data().answer).length;

                // 3. Donations (Material Exchange)
                const donationsSnap = await getDocs(collection(db, "materialDonations"));
                const pendingDonations = donationsSnap.docs.filter(doc => doc.data().status === 'pending').length;

                // 4. Testimonials
                const testimonialsSnap = await getDocs(collection(db, "testimonials"));

                setStats({
                    subscribers: subscribersSnap.size,
                    questions: qnaSnap.size,
                    pendingQuestions: pendingQna,
                    donations: donationsSnap.size,
                    pendingDonations: pendingDonations,
                    testimonials: testimonialsSnap.size
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            title: 'إجمالي المشتركين',
            value: stats.subscribers,
            icon: '👥',
            color: 'primary',
            change: '+12% هذا الشهر',
            changeType: 'positive'
        },
        {
            title: 'تبرعات المواد',
            value: stats.donations,
            icon: '📦',
            color: 'success',
            change: `${stats.pendingDonations} قيد المراجعة`,
            changeType: stats.pendingDonations > 0 ? 'warning' : 'neutral'
        },
        {
            title: 'أسئلة واستفسارات',
            value: stats.questions,
            icon: '💬',
            color: 'warning',
            change: `${stats.pendingQuestions} بانتظار الرد`,
            changeType: stats.pendingQuestions > 0 ? 'negative' : 'positive'
        },
        {
            title: 'آراء الزوار',
            value: stats.testimonials,
            icon: '⭐',
            color: 'info',
            change: 'تم التحقق',
            changeType: 'neutral'
        }
    ];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner">⏳</div>
                <p>جاري تحديث البيانات...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header animate-fade-in">
                <h1>مكانك الجامعي - لوحة القيادة 📊</h1>
                <p>مرحباً بك مجدداً، إليك ملخص لأهم النشاطات اليوم</p>
            </div>

            <div className="stats-grid">
                {cards.map((card, index) => (
                    <StatsCard
                        key={index}
                        {...card}
                    />
                ))}
            </div>

            <div className="dashboard-content">
                <div className="welcome-card glass-card animate-slide-up">
                    <div className="welcome-text">
                        <h2>بوابة إدارة مكانك الجامعي 👋</h2>
                        <p>
                            نظام متطور لإدارة التفاعلات، الشكاوى، وتبرعات المواد.
                            استخدم الأدوات الجانبية لمتابعة الإحصائيات والرد على استفسارات المستخدمين بشكل فوري.
                        </p>
                        <div className="welcome-stats">
                            <div className="mini-stat"><span>🔒</span> نظام محمي بالكامل</div>
                            <div className="mini-stat"><span>⚡</span> استجابة فورية</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

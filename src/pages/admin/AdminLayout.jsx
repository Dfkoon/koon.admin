import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

// Icons (Using emoji for now to avoid dependency issues, replace with MUI icons later if desired)
const MENU_ITEMS = [
    { text: 'لوحة القيادة', icon: '📊', path: '/admin/dashboard' },
    { text: 'إدارة التبرعات', icon: '📦', path: '/admin/donations' },
    { text: 'الاقتراحات والشكاوى', icon: '💬', path: '/admin/qna' },
    { text: 'بلاغات الأسئلة', icon: '🚩', path: '/admin/reports' },
    { text: 'الإحصائيات', icon: '📈', path: '/admin/analytics' },
    { text: 'آراء الزائرين', icon: '📝', path: '/admin/testimonials' },
    { text: 'طلبات الخدمات', icon: '📋', path: '/admin/requests' },
    { text: 'المشتركين', icon: '👥', path: '/admin/subscribers' },
];

export default function AdminLayout() {
    const { currentUser, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    if (!currentUser) return <Navigate to="/login" />;

    return (
        <div className="admin-layout" dir="rtl">
            {/* Mobile Header */}
            <header className="mobile-header">
                <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    ☰
                </button>
                <div className="brand-logo">KOON ADMIN</div>
                <div className="user-avatar">{currentUser.email[0].toUpperCase()}</div>
            </header>

            {/* Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="brand-logo">لوحة تحكم كـُن</div>
                </div>

                <nav className="sidebar-nav">
                    {MENU_ITEMS.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.text}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">{currentUser.email[0].toUpperCase()}</div>
                        <div className="user-details">
                            <h4>المسؤول</h4>
                            <span>{currentUser.email}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn-secondary w-full" style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '0.5rem', color: 'var(--error)', borderColor: 'var(--error)' }}>
                        <span>🚪</span>
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}

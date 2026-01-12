import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminSuggestions from './pages/admin/AdminSuggestions';
import AdminReports from './pages/admin/AdminReports';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageRequests from './pages/admin/ManageRequests';
import ManageSubscribers from './pages/admin/ManageSubscribers';
import ManageDonations from './pages/admin/ManageDonations';
import Login from './pages/admin/Login';
import AdminConnect from './pages/admin/AdminConnect';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import GlobalAnimatedBackground from './components/GlobalAnimatedBackground';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <GlobalAnimatedBackground />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin-connect" element={<AdminConnect />} />

                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="qna" element={<AdminSuggestions />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                        <Route path="testimonials" element={<ManageTestimonials />} />
                        <Route path="requests" element={<ManageRequests />} />
                        <Route path="subscribers" element={<ManageSubscribers />} />
                        <Route path="donations" element={<ManageDonations />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;

'use client';

import { AdminSidebar } from '@/components/ui/nav/AdminSidebar';
import { MainLayout } from '@/components/ui/layout/MainLayout';
import AdminRoute from '@/components/auth/protected/AdminRoute';

export default function AdminLayout({ children }) {
    return (
        <AdminRoute>
            <MainLayout sidebar={<AdminSidebar />}>
                {children}
            </MainLayout>
        </AdminRoute>
    );
}
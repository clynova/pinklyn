'use client';

import { AdminSidebar } from '@/components/ui/nav/AdminSidebar';
import { MainLayout } from '@/components/ui/layout/MainLayout';

export default function AdminLayout({ children }) {
    return (
        <MainLayout sidebar={<AdminSidebar />}>
            {children}
        </MainLayout>
    );
}
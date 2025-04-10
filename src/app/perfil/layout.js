'use client';

import ProfileSidebar from '@/components/perfil/ProfileSidebar';
import { MainLayout } from '@/components/ui/layout/MainLayout';
import ProtectedRoute from '@/components/auth/protected/ProtectedRoute';

export default function ProfileLayout({ children }) {
  return (
    <ProtectedRoute>
      <MainLayout sidebar={<ProfileSidebar />}>
        {children}
      </MainLayout>
    </ProtectedRoute>
  );
}
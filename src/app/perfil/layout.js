'use client';

import ProfileSidebar from '@/components/perfil/ProfileSidebar';
import { MainLayout } from '@/components/ui/layout/MainLayout';

export default function ProfileLayout({ children }) {
  return (
    <MainLayout sidebar={<ProfileSidebar />}>
      {children}
    </MainLayout>
  );
}
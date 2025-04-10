'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useGlobal } from '@/context/GlobalContext';
import FullscreenLoader from '@/components/ui/FullscreenLoader';

/**
 * Componente para proteger rutas que requieren rol de administrador
 * Redirecciona a la página principal si el usuario no es administrador
 */
export default function AdminRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { showLoading, hideLoading } = useGlobal();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (authLoading) {
      showLoading('Verificando permisos...');
      return;
    }

    if (!user) {
      // Usuario no autenticado, ocultar loader y redirigir a login
      hideLoading();
      setIsVerifying(false);
      router.push('/auth/login');
      return;
    }

    // Verificar si el usuario tiene rol de administrador
    const isAdmin = user.roles && user.roles.includes('admin');
    if (!isAdmin) {
      // No es admin, ocultar loader y redirigir a página principal
      hideLoading();
      setIsVerifying(false);
      router.push('/');
      return;
    }

    // Usuario autenticado y es admin, mostrar contenido
    hideLoading();
    setIsVerifying(false);
  }, [user, authLoading, router, showLoading, hideLoading]);

  // Mostrar loader mientras se verifica
  if (isVerifying || authLoading) {
    return <FullscreenLoader message="Verificando permisos de administrador..." />;
  }

  // Si llegamos aquí, el usuario es administrador
  return <>{children}</>;
}
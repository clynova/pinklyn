'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useGlobal } from '@/context/GlobalContext';
import FullscreenLoader from '@/components/ui/FullscreenLoader';

/**
 * Componente para proteger rutas que requieren autenticación
 * Redirecciona a login si el usuario no está autenticado
 */
export default function ProtectedRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { showLoading, hideLoading } = useGlobal();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (authLoading) {
      showLoading('Verificando acceso...');
      return;
    }

    if (!user) {
      // Usuario no autenticado, ocultar loader y redirigir a login
      hideLoading();
      setIsVerifying(false);
      router.push('/auth/login');
      return;
    }

    // Usuario autenticado, mostrar contenido
    hideLoading();
    setIsVerifying(false);
  }, [user, authLoading, router, showLoading, hideLoading]);

  // Mostrar loader mientras se verifica
  if (isVerifying || authLoading) {
    return <FullscreenLoader message="Verificando acceso..." />;
  }

  // Si llegamos aquí, el usuario está autenticado
  return <>{children}</>;
}
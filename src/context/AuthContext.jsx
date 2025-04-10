'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Crear el contexto
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Verificar token al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Intentar obtener token de cookie primero y luego de localStorage para compatibilidad
        const tokenFromCookie = Cookies.get('token');
        const tokenFromStorage = localStorage.getItem('token');
        const token = tokenFromCookie || tokenFromStorage;
        
        if (token) {
          // Si tenemos token pero está solo en localStorage, guardarlo también como cookie
          if (tokenFromStorage && !tokenFromCookie) {
            Cookies.set('token', tokenFromStorage, { expires: 7, path: '/' });
          }
          
          // Obtener datos del usuario
          const userFromCookie = Cookies.get('user');
          const userFromStorage = localStorage.getItem('user');
          const userData = userFromCookie || userFromStorage;
          
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              
              // Si tenemos usuario pero está solo en localStorage, guardarlo también como cookie
              if (userFromStorage && !userFromCookie) {
                Cookies.set('user', userFromStorage, { expires: 7, path: '/' });
              }
            } catch (e) {
              console.error('Error parsing user data:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        let errorMessage = 'Error al iniciar sesión';
        
        if (response.status === 400) {
          errorMessage = data.msg || 'Credenciales incorrectas';
        } else if (response.status === 403) {
          errorMessage = 'Usuario desactivado';
        }
        
        throw new Error(errorMessage);
      }

      // Guardar tanto en cookies como en localStorage
      Cookies.set('token', data.token, { expires: 7, path: '/' });
      Cookies.set('user', JSON.stringify(data.user), { expires: 7, path: '/' });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Actualizar estado
      setUser(data.user);
      
      // Verificar si hay una ruta de redirección en la URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('from');
      if (redirectPath) {
        router.push(redirectPath);
      }
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para registro
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Error al registrarse');
      }

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    // Eliminar cookies
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user', { path: '/' });
    // Eliminar localStorage por compatibilidad
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Actualizar estado
    setUser(null);
    // Redirigir a login
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      login, 
      register, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
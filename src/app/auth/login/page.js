'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import LoginForm from '@/components/auth/LoginForm';
import AuthIllustration from '@/components/auth/AuthIllustration';
import { useAuth } from '@/context/AuthContext';
import { useGlobal } from '@/context/GlobalContext';

export default function LoginPage() {
  const { setPageTitle } = useGlobal();
  const { login, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  // Estados para validaciones
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });
  
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      router.push('/');
    }
    
    // Inicializar email recordado
    if (typeof window !== 'undefined') {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      if (rememberedEmail) {
        setFormData(prev => ({
          ...prev,
          email: rememberedEmail,
          rememberMe: true
        }));
      }
    }
    
    // Establecer título de la página
    setPageTitle('Iniciar Sesión | Pinklyn');
  }, [user, router, setPageTitle]);

  // Funciones de validación
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email) return 'El correo es requerido';
    if (!emailRegex.test(email)) return 'Correo electrónico inválido';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  };

  // Validar campo específico
  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') error = validateEmail(value);
    if (name === 'password') error = validatePassword(value);
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  // Marcar campo como tocado cuando pierde el foco
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  // Manejar cambios en los campos
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  // Manejar envío del formulario
  const handleLogin = async (e) => {
    e.preventDefault();
    
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    
    setTouched({
      email: true,
      password: true,
    });

    if (!emailValid || !passwordValid) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));
    
    try {
      await login({
        email: formData.email,
        password: formData.password
      });

      // Manejar "Recordarme"
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      toast.success('¡Bienvenido de vuelta!');
      router.push('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      // Determinar mensaje de error según el estado de la respuesta
      const errorMessage = error.message || 'Error al iniciar sesión. Por favor, intenta nuevamente.';
      
      toast.error(errorMessage);
      setErrors(prev => ({
        ...prev,
        general: errorMessage
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar login social
  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica de autenticación social
      toast.error(`Inicio de sesión con ${provider} no está implementado aún`);
    } catch (error) {
      console.error(`Error al iniciar sesión con ${provider}:`, error);
      toast.error(`Error al iniciar sesión con ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginForm
        onSubmit={handleLogin}
        formData={formData}
        handleInputChange={handleInputChange}
        handleBlur={handleBlur}
        errors={errors}
        touched={touched}
        isLoading={isLoading}
        onSocialLogin={handleSocialLogin}
      />
      <AuthIllustration illustration="/images/login-illustration.svg" />
    </div>
  );
}
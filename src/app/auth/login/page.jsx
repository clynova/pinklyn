'use client';

import { useGlobal } from '@/context/GlobalContext';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import AuthIllustration from '@/components/auth/AuthIllustration';
import { toast } from 'react-hot-toast';

const illustrationPath = "/images/login-illustration.svg";

export default function LoginPage() {
  const { setPageTitle } = useGlobal();
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, []);

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

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') error = validateEmail(value);
    if (name === 'password') error = validatePassword(value);
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    setTouched({ email: true, password: true });
    
    if (!emailValid || !passwordValid) return;
    
    setIsLoading(true);
    try {
      await login({
        email: formData.email,
        password: formData.password
      });

      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      toast.success('¡Bienvenido de vuelta!');
      router.push('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      const errorMessage = 
        error.response?.status === 401 ? 'Credenciales incorrectas' :
        error.response?.status === 403 ? 'Tu cuenta no está verificada. Por favor, verifica tu correo electrónico.' :
        error.response?.status === 423 ? 'Tu cuenta ha sido suspendida por romper con las políticas de la tienda. Si crees que es un error, ponte en contacto con nosotros.' :
        'Error al iniciar sesión. Por favor, intenta nuevamente.';
      
      toast.error(errorMessage);
      setErrors(prev => ({
        ...prev,
        general: errorMessage
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      toast.error(`Inicio de sesión con ${provider} no está implementado aún`);
    } catch (error) {
      console.error(`Error al iniciar sesión con ${provider}:`, error);
      toast.error(`Error al iniciar sesión con ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPageTitle('Ingresar | Cohesa');
  }, [setPageTitle]);

  return (
    <>
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
      <AuthIllustration illustration={illustrationPath} />
    </>
  );
}

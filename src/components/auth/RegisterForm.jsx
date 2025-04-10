'use client';

import { useState } from 'react';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import InputField from './InputField';
import SocialAuth from './SocialAuth';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const RegisterForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordHelp, setShowPasswordHelp] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        // Validar nombre
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es obligatorio';
        }
        
        // Validar apellido
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido es obligatorio';
        }
        
        // Validar email
        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
            newErrors.email = 'Formato de email inválido';
        }
        
        // Validar contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        // Validar confirmación de contraseña
        if (formData.password !== formData.repPassword) {
            newErrors.repPassword = 'Las contraseñas no coinciden';
        }
        
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Validación en tiempo real
        if (touched[name]) {
            const newErrors = { ...errors };
            
            // Validaciones específicas por campo
            if (name === 'email' && value.trim() !== '') {
                if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
                    newErrors.email = 'Formato de email inválido';
                } else {
                    delete newErrors.email;
                }
            } else if (name === 'password' && value !== '') {
                if (value.length < 6) {
                    newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
                } else {
                    delete newErrors.password;
                }
                
                // Validar también que las contraseñas coincidan
                if (value !== formData.repPassword && formData.repPassword) {
                    newErrors.repPassword = 'Las contraseñas no coinciden';
                } else if (value === formData.repPassword) {
                    delete newErrors.repPassword;
                }
            } else if (name === 'repPassword') {
                if (value !== formData.password) {
                    newErrors.repPassword = 'Las contraseñas no coinciden';
                } else {
                    delete newErrors.repPassword;
                }
            } else if (value.trim() === '') {
                newErrors[name] = `El ${name === 'firstName' ? 'nombre' : name === 'lastName' ? 'apellido' : name} es obligatorio`;
            } else {
                delete newErrors[name];
            }
            
            setErrors(newErrors);
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        
        // Validar al perder el foco
        const newErrors = { ...errors };
        const value = formData[field];
        
        if (!value.trim()) {
            newErrors[field] = `El ${field === 'firstName' ? 'nombre' : field === 'lastName' ? 'apellido' : field === 'email' ? 'email' : 'campo'} es obligatorio`;
        } else if (field === 'email' && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
            newErrors.email = 'Formato de email inválido';
        } else if (field === 'password' && value.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        } else if (field === 'repPassword' && value !== formData.password) {
            newErrors.repPassword = 'Las contraseñas no coinciden';
        } else {
            delete newErrors[field];
        }
        
        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar todos los campos
        const formErrors = validateForm();
        setErrors(formErrors);
        
        // Marcar todos los campos como tocados
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            repPassword: true
        });
        
        // Si hay errores, no enviar el formulario
        if (Object.keys(formErrors).length > 0) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Registro exitoso, redirigir a la página de verificación
                router.push(`/auth/verificacion?email=${encodeURIComponent(formData.email)}`);
            } else {
                // Error en el registro
                toast.error(data.msg || 'Error al registrar el usuario');
                if (data.errors) {
                    const serverErrors = {};
                    data.errors.forEach(error => {
                        serverErrors[error.campo] = error.mensaje;
                    });
                    setErrors(serverErrors);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Ocurrió un error durante el registro');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        toast(`Inicio de sesión con ${provider} no implementado`);
        // En un caso real, aquí iría la lógica para autenticación con proveedores sociales
    };

    return (
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
            <div className="w-full max-w-md space-y-8">
                <header className="text-center space-y-4">
                    <Image 
                        src="/images/logo.svg" 
                        alt="Logo" 
                        className="h-16 mx-auto mb-6 animate-pulse" 
                        width={64} 
                        height={64} 
                    />
                    <h1 className="text-4xl font-bold bg-gradient-to-r text-gray-800 dark:text-white bg-clip-text font-display">
                        Crea tu cuenta
                    </h1>
                    <p className="text-gray-400">
                        Únete a nuestra comunidad en menos de un minuto
                    </p>
                </header>

                <SocialAuth onSocialLogin={handleSocialLogin} isLoading={isLoading} />

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <InputField
                                id="firstName"
                                name="firstName"
                                label="Nombre"
                                placeholder="Nombre"
                                icon={FiUser}
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={() => handleBlur('firstName')}
                                required
                            />
                            {errors.firstName && touched.firstName && (
                                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <InputField
                                id="lastName"
                                name="lastName"
                                label="Apellido"
                                placeholder="Apellido"
                                icon={FiUser}
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={() => handleBlur('lastName')}
                                required
                            />
                            {errors.lastName && touched.lastName && (
                                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <InputField
                            id="email"
                            name="email"
                            label="Correo electrónico"
                            placeholder="Correo electrónico"
                            type="email"
                            icon={FiMail}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                            required
                        />
                        {errors.email && touched.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <InputField
                            id="password"
                            name="password"
                            label="Contraseña"
                            placeholder="Contraseña"
                            type="password"
                            icon={FiLock}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={() => handleBlur('password')}
                            onHelpClick={() => setShowPasswordHelp(!showPasswordHelp)}
                            showHelp={showPasswordHelp}
                            helpText="La contraseña debe tener al menos 6 caracteres."
                            required
                        />
                        {errors.password && touched.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                        <PasswordStrengthMeter password={formData.password} />
                    </div>
                    <div>
                        <InputField
                            id="repPassword"
                            name="repPassword"
                            label="Repetir Contraseña"
                            placeholder="Contraseña"
                            type="password"
                            icon={FiLock}
                            value={formData.repPassword}
                            onChange={handleChange}
                            onBlur={() => handleBlur('repPassword')}
                            required
                        />
                        {errors.repPassword && touched.repPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.repPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                                   text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center
                                   ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Creando cuenta...
                            </>
                        ) : (
                            'Crear cuenta'
                        )}
                    </button>
                </form>

                <footer className="text-center text-sm text-gray-400">
                    <p>
                        ¿Ya tienes cuenta?{" "}
                        <Link
                            href="/auth/login"
                            className="text-green-400 hover:text-green-300 font-medium transition-colors"
                        >
                            Iniciar sesión
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default RegisterForm;
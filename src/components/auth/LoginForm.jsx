'use client';

import { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import InputField from './InputField';
import SocialAuth from './SocialAuth';
import { ButtonLoader } from '../ui/loading';

const LoginForm = ({ 
  onSubmit, 
  formData, 
  handleInputChange, 
  handleBlur, 
  errors, 
  touched, 
  isLoading,
  onSocialLogin 
}) => {
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
            Iniciar sesión
          </h1>
          <p className="text-gray-400">
            Accede a tu cuenta para continuar
          </p>
        </header>

        <SocialAuth onSocialLogin={onSocialLogin} isLoading={isLoading} />

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {errors.general && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <InputField
              id="email"
              name="email"
              label="Correo electrónico"
              placeholder="Correo electrónico"
              type="email"
              icon={FiMail}
              value={formData.email}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              onBlur={() => handleBlur('password')}
              required
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-600 dark:text-gray-300">
                Recordarme
              </label>
            </div>
            <div className="text-sm">
              <Link href="/auth/forgot-password" className="text-pink-600 hover:text-pink-500 font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 
                       text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center
                       ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <ButtonLoader size="md" color="white" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        <footer className="text-center text-sm text-gray-400">
          <p>
            ¿Aún no tienes cuenta?{" "}
            <Link
              href="/auth/register"
              className="text-pink-500 hover:text-pink-400 font-medium transition-colors"
            >
              Registrarse
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginForm;
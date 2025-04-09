import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Registro | Pinklyn',
  description: 'Crea una nueva cuenta en Pinklyn',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900">
      {/* Mitad izquierda - Imagen/Banner */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-pink-400 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/80 to-purple-600/80"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white max-w-md">
            <h2 className="text-4xl font-bold mb-6">Bienvenido a Pinklyn</h2>
            <p className="text-xl mb-8">La plataforma que transforma la manera de comprar y vender.</p>
            <ul className="space-y-4">
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Proceso de registro rápido y sencillo
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Marketplace exclusivo con productos seleccionados
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Experiencia de usuario intuitiva y personalizada
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mitad derecha - Formulario */}
      <RegisterForm />
    </div>
  );
}
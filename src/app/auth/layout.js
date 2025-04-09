export const metadata = {
  title: 'Autenticación | Pinklyn',
  description: 'Inicia sesión o crea una cuenta en Pinklyn',
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Este layout específico será usado por todas las rutas bajo /auth/ */}
      {children}
    </div>
  );
}
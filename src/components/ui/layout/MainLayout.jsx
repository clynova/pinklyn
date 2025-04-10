'use client';

import { Navbar } from '@/components/ui/nav';

/**
 * Layout principal reutilizable para páginas que requieren una estructura similar
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.sidebar - Componente de barra lateral a mostrar
 * @param {React.ReactNode} props.children - Contenido principal
 * @param {string} props.containerClassName - Clases adicionales para el contenedor principal
 */
export function MainLayout({ sidebar, children, containerClassName = '' }) {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col dark:bg-gray-900">
            <Navbar />

            <main className="flex-grow w-full">
                <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {sidebar}
                        <div className="md:col-span-3">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
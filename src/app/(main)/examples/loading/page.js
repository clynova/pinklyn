'use client';

import React from 'react';
import { useGlobal } from '@/context/GlobalContext';
import useLoading from '@/hooks/useLoading';
import {
    LoadingSpinner,
    ButtonLoader,
    SkeletonLoader
} from '@/components/ui/loading';
import ProductExample from '@/components/examples/ProductExample';

export default function LoadingExamplePage() {
    const { showLoading, hideLoading } = useGlobal();
    const { isLoading, startLoading, stopLoading } = useLoading();

    // Función para mostrar el loader global por 3 segundos
    const handleShowGlobalLoader = () => {
        showLoading('Procesando información, por favor espera...');
        setTimeout(() => {
            hideLoading();
        }, 3000);
    };

    // Función para mostrar un loader local por 2 segundos
    const handleShowLocalLoader = () => {
        startLoading();
        setTimeout(() => {
            stopLoading();
        }, 2000);
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
                Sistema de Carga de Pinklyn
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-pink-600 dark:text-pink-400">
                        Componentes de Carga Individuales
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium mb-3">Spinner básico</h3>
                            <div className="flex flex-wrap gap-6 items-center">
                                <LoadingSpinner variant="small" color="primary" />
                                <LoadingSpinner variant="medium" color="primary" />
                                <LoadingSpinner variant="medium" color="secondary" />
                                <LoadingSpinner variant="large" color="neutral" />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium mb-3">Spinner con etiqueta</h3>
                            <div className="flex flex-wrap gap-6 items-start">
                                <LoadingSpinner variant="medium" color="primary" label="Cargando..." />
                                <LoadingSpinner variant="medium" color="secondary" label="Procesando" />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium mb-3">Loader para botones</h3>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-4 py-2 bg-pink-500 text-white rounded-lg flex items-center">
                                    <ButtonLoader size="md" color="white" /> Procesando...
                                </button>
                                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center">
                                    <ButtonLoader size="sm" color="primary" /> Cargando
                                </button>
                                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center">
                                    <ButtonLoader size="lg" color="white" /> Enviando
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-pink-600 dark:text-pink-400">
                        Skeletons y Loaders Interactivos
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium mb-3">Skeleton loaders</h3>
                            <div className="space-y-4">
                                <SkeletonLoader variant="text" count={2} />
                                <div className="grid grid-cols-2 gap-4">
                                    <SkeletonLoader variant="card" />
                                    <SkeletonLoader variant="profile" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="font-medium mb-3">Probar loaders globales/locales</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleShowGlobalLoader}
                                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg"
                                >
                                    Mostrar Loader Global (3s)
                                </button>

                                <button
                                    onClick={handleShowLocalLoader}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <>
                                            <ButtonLoader size="sm" color="white" />
                                            Cargando...
                                        </>
                                    ) : (
                                        'Mostrar Loader Local (2s)'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-6 text-pink-600 dark:text-pink-400">
                    Ejemplo Práctico: Catálogo de Productos
                </h2>
                <ProductExample />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4">¿Cómo utilizar el sistema de carga?</h2>
                <div className="prose dark:prose-invert max-w-none">
                    <p>El sistema de carga permite gestionar diferentes estados de carga en la aplicación. Puedes usar el hook <code>useLoading</code> para gestionar estos estados:</p>

                    <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        {`// Loader local para un componente
const { isLoading, startLoading, stopLoading, wrapPromise } = useLoading();

// Loader global (pantalla completa)
const globalLoader = useLoading({ useGlobal: true });

// Simplificar manejo de promesas con estado de carga
const fetchData = async () => {
  const result = await wrapPromise(
    apiCall(), 
    'Mensaje personalizado'
  );
  // Automáticamente maneja el inicio y fin de carga
};`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
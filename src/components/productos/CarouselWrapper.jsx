"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Cargar el componente dinámicamente para evitar problemas de SSR con react-slick
const BestSellersCarousel = dynamic(
  () => import('../../components/productos/BestSellersCarousel'),
  { ssr: false, loading: () => (
    <div className="h-48 md:h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
  )}
);

// Componente wrapper de cliente para el carrusel
export default function CarouselWrapper() {
  return (
    <Suspense fallback={<div className="h-48 md:h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>}>
      <BestSellersCarousel />
    </Suspense>
  );
}

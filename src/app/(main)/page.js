import Image from "next/image";
import Link from "next/link";
import CarouselWrapper from "../../components/productos/CarouselWrapper";
import BestSellersCarousel from "../../components/productos/BestSellersCarousel";
import PanelCards from "@/components/productos/PanelCards";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-x-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Tu tienda online</span>
                <span className="block text-pink-600">favorita</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500 dark:text-gray-300">
                Descubre los mejores productos con la mejor calidad y los mejores precios. En Pinklyn encontrarás todo lo que necesitas.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/examples/loading"
                  className="rounded-md bg-pink-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                  Ver ejemplos de carga
                </Link>
                <Link
                  href="/auth/register"
                  className="text-base font-medium text-pink-600 hover:text-pink-500"
                >
                  Registrarse <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:w-1/2">
              <div className="relative mx-auto w-full max-w-lg">
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-pink-100 dark:bg-pink-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-100 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute inset-0 rounded-lg overflow-hidden border-2 border-pink-500/20 shadow-xl">
                  <Image
                    src="/images/logo.svg"
                    alt="Pinklyn"
                    fill
                    className="object-contain p-8"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              ¿Por qué elegir Pinklyn?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
              Descubre las ventajas de comprar en nuestra plataforma
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow">
              <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-3 mb-4">
                <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Entrega rápida</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300 text-center">
                Recibe tus productos en tiempo récord gracias a nuestra red de distribución.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow">
              <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-3 mb-4">
                <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Compra segura</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300 text-center">
                Todas nuestras transacciones están protegidas por los más altos estándares de seguridad.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow">
              <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-3 mb-4">
                <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Devoluciones gratis</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300 text-center">
                Si no estás satisfecho con tu compra, puedes devolverla sin costo adicional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-800/50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Productos Destacados
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                Explora nuestra selección premium de cortes argentinos, pollo fresco y aceite de la mejor calidad
              </p>
            </div>
            <a href="/productos" className="mt-4 md:mt-0 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              Ver todo el catálogo →
            </a>
          </div>

          {/* Carrusel de productos destacados */}
          <BestSellersCarousel />
        </div>
      </section>

      {/* Gift Gallery Vista Section */}
      <main className="flex-1">
        <section className="bg-accent py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Gift Gallery Vista</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra selección de regalos únicos y especiales para cada ocasión.
              Encuentra el detalle perfecto para sorprender a esa persona especial.
            </p>
          </div>
        </section>

        <section className="mx-auto px-4 py-12 md:py-16">
          <PanelCards limit={16} />
        </section>
      </main>

    </div>
  );
}
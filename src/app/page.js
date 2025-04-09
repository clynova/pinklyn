import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <main className="flex flex-col items-center max-w-4xl mx-auto text-center">
        <Image
          src="/images/logo.svg"
          alt="Pinklyn Logo"
          width={128}
          height={128}
          className="mb-8"
          priority
        />
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
          Bienvenido a Pinklyn
        </h1>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
          Tu plataforma completa para compra y venta de productos exclusivos
        </p>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Link
            href="/auth/register"
            className="rounded-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 transition-colors"
          >
            Crear cuenta
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-pink-500 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 font-medium py-3 px-6 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </main>

      <footer className="mt-16 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Pinklyn. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

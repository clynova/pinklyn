import { NextResponse } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/perfil', '/perfil/pedidos', '/perfil/direcciones', '/perfil/metodos-pago'];
// Rutas que requieren rol de administrador
const adminRoutes = ['/admin', '/admin/productos', '/admin/pedidos', '/admin/usuarios'];
// Rutas públicas (no requieren autenticación)
const publicRoutes = ['/auth/login', '/auth/register', '/auth/verificacion'];

export function middleware(request) {
  // Crear respuesta base
  const response = NextResponse.next();
  
  // Añadir encabezados de seguridad
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content-Security-Policy para prevenir XSS
  response.headers.set(
    'Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );
  
  // Solo establecer HSTS en producción
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Obtener el token del navegador a través de cookies
  const token = request.cookies.get('token')?.value;
  const user = request.cookies.get('user')?.value;
  
  const { pathname } = request.nextUrl;
  
  // Verificar si es una ruta de administrador
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    // Si no hay token, redirigir al login
    if (!token || !user) {
      return redirectToLogin(request);
    }

    // Verificar si el usuario es administrador
    try {
      const userData = JSON.parse(user);
      const isAdmin = userData.roles?.includes('admin');
      
      if (!isAdmin) {
        // Si no es admin, redirigir a la página principal
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
      // Si hay un error al parsear el user, redirigir al login
      return redirectToLogin(request);
    }
  }
  
  // Verificar si es una ruta protegida
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Si no hay token, redirigir al login
    if (!token) {
      return redirectToLogin(request);
    }
  }
  
  // Si no es una ruta protegida o el usuario está autenticado, continuar con los headers de seguridad
  return response;
}

function redirectToLogin(request) {
  const loginUrl = new URL('/auth/login', request.url);
  // Guardar la URL a la que intentaba acceder para redireccionar después del login
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

// Configuración de rutas para las que se debe ejecutar el middleware
export const config = {
  matcher: [
    // Rutas protegidas
    '/perfil/:path*',
    '/perfil/pedidos/:path*',
    '/perfil/direcciones/:path*',
    '/perfil/metodos-pago/:path*',
    // Rutas admin
    '/admin/:path*',
    '/admin/productos/:path*',
    '/admin/pedidos/:path*',
    '/admin/usuarios/:path*'
  ]
};
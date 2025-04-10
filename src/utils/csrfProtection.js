import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

/**
 * Genera un token CSRF y lo almacena en una cookie
 * @returns {string} El token CSRF generado
 */
export function generateCsrfToken() {
  // Generar token único
  const csrfToken = uuidv4();
  
  // Almacenar token en cookie segura
  const cookieStore = cookies();
  cookieStore.set('csrfToken', csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  
  return csrfToken;
}

/**
 * Valida que el token CSRF enviado coincida con el almacenado
 * @param {string} token - El token CSRF a validar
 * @returns {boolean} - Verdadero si el token es válido
 */
export function validateCsrfToken(token) {
  const cookieStore = cookies();
  const storedToken = cookieStore.get('csrfToken')?.value;
  
  if (!storedToken || !token || token !== storedToken) {
    return false;
  }
  
  return true;
}

/**
 * Middleware para validar tokens CSRF en rutas API
 * @param {Function} handler - El manejador de la ruta API
 * @returns {Function} - Middleware que valida el token CSRF
 */
export function withCsrfProtection(handler) {
  return async (request, context) => {
    // Solo proteger métodos no seguros (POST, PUT, DELETE)
    const method = request.method.toUpperCase();
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return handler(request, context);
    }
    
    // Obtener token CSRF del encabezado
    const csrfToken = request.headers.get('x-csrf-token');
    
    // Validar token
    if (!validateCsrfToken(csrfToken)) {
      return Response.json({
        success: false,
        msg: 'Solicitud inválida: Token CSRF no válido'
      }, { status: 403 });
    }
    
    // Si el token es válido, continuar con el handler
    return handler(request, context);
  };
}
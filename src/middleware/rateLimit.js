import { NextResponse } from 'next/server';

// Almacén simple en memoria para IPs y sus intentos
// En producción, considera usar Redis u otra solución distribuida
const ipRequests = new Map();

/**
 * Middleware para limitar la tasa de peticiones por IP
 * @param {Object} options - Opciones de configuración
 * @param {number} options.maxRequests - Número máximo de solicitudes permitidas
 * @param {number} options.windowMs - Ventana de tiempo en milisegundos
 * @returns {Function} - Función middleware que limita peticiones
 */
export function rateLimit(options = {}) {
  const { maxRequests = 100, windowMs = 60 * 1000 } = options; // 100 peticiones por minuto por defecto
  
  return function rateLimitMiddleware(request, context) {
    // Obtener la IP del cliente
    const ip = request.headers.get('x-forwarded-for') || 
               request.ip || 
               'unknown';
    
    const now = Date.now();
    const ipData = ipRequests.get(ip) || { count: 0, resetTime: now + windowMs };
    
    // Resetear contador si ya pasó el tiempo de la ventana
    if (now > ipData.resetTime) {
      ipData.count = 1;
      ipData.resetTime = now + windowMs;
    } else {
      // Incrementar contador
      ipData.count += 1;
    }
    
    // Guardar datos actualizados
    ipRequests.set(ip, ipData);
    
    // Verificar si excede el límite
    if (ipData.count > maxRequests) {
      // Calcular tiempo de espera en segundos
      const waitTime = Math.ceil((ipData.resetTime - now) / 1000);
      
      return NextResponse.json({
        success: false,
        msg: `Demasiadas solicitudes. Intente nuevamente en ${waitTime} segundos.`
      }, { 
        status: 429,
        headers: {
          'Retry-After': waitTime.toString(),
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(ipData.resetTime / 1000).toString()
        }
      });
    }
    
    // Continuar con la solicitud
    const response = NextResponse.next();
    
    // Añadir headers informativos
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (maxRequests - ipData.count).toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(ipData.resetTime / 1000).toString());
    
    return response;
  };
}

/**
 * Middleware específico para proteger rutas de autenticación contra ataques de fuerza bruta
 * Más restrictivo que el rate limit general
 */
export function authRateLimit() {
  return rateLimit({ maxRequests: 5, windowMs: 60 * 1000 }); // 5 intentos por minuto
}
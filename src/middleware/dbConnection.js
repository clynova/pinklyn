import connectDB from '@/lib/mongodb';

/**
 * Middleware que gestiona la conexión a la base de datos MongoDB
 * Asegura que haya una única conexión establecida antes de ejecutar los handlers
 * 
 * @param {Function} handler - La función manejadora a ejecutar después de conectar a la BD
 * @returns {Function} - Función middleware que conecta a la BD y luego ejecuta el handler
 */
export function withDatabase(handler) {
  return async (req, params) => {
    try {
      // Conectar a MongoDB antes de ejecutar el handler
      await connectDB();
      
      // Ejecutar el handler original (controlador o ruta)
      return await handler(req, params);
    } catch (error) {
      console.error('Error de conexión a la base de datos:', error);
      
      // Si hay un error de conexión, devolver un error 500
      const { NextResponse } = await import('next/server');
      return NextResponse.json(
        { success: false, error: 'Error de conexión a la base de datos' },
        { status: 500 }
      );
    }
  };
}
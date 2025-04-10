/**
 * Genera un código aleatorio para verificación de email
 * @returns {string} Código aleatorio de 6 dígitos
 */
export const generarCodigo = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

/**
 * Envía un email de confirmación al usuario
 * @param {Object} datos - Datos del usuario para el email
 * @param {string} datos.firstName - Nombre del usuario
 * @param {string} datos.email - Email del usuario
 * @param {string} datos.token - Token de verificación
 * @returns {Promise<Object>} Resultado del envío
 */
export async function enviarEmailConfirmacion({ firstName, email, token }) {
  try {
    // Aquí implementarías la lógica real de envío de email
    // utilizando nodemailer u otro servicio
    
    console.log(`[Email simulado] Enviando confirmación a ${email}`);
    console.log(`Asunto: Confirma tu cuenta en Pinklyn`);
    console.log(`Contenido: Hola ${firstName}, utiliza este código para confirmar tu cuenta: ${token}`);
    
    // Para una implementación real, aquí iría la configuración y envío del email
    
    return { 
      success: true 
    };
  } catch (error) {
    console.error("Error al enviar email:", error);
    return { 
      success: false,
      error: error.message 
    };
  }
}

import jwt from 'jsonwebtoken';

/**
 * Genera un JWT para la autenticación del usuario
 * @param {string} userId - ID del usuario
 * @param {string} email - Email del usuario
 * @returns {string} JWT generado
 */
export function generarJWT(userId, email) {
  const payload = {
    userId,
    email
  };

  // Por defecto el token expira en 24 horas
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET || 'jwt_secret_key_development', 
    { expiresIn: '24h' }
  );
}

/**
 * Verifica un JWT
 * @param {string} token - Token a verificar
 * @returns {Object|null} Payload decodificado o null si es inválido
 */
export function verificarJWT(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret_key_development');
  } catch (error) {
    console.error('Error al verificar JWT:', error);
    return null;
  }
}
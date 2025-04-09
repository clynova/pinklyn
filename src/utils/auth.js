/**
 * Genera un código aleatorio para verificación de email
 * @returns {string} Código aleatorio de 6 dígitos
 */
export function generarCodigo() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

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
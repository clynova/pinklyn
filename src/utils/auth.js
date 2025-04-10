/**
 * Funciones de utilidad para autenticación
 */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Genera un código aleatorio para verificación de email
 * @returns {string} Código aleatorio de 6 dígitos
 */
export const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Alias para compatibilidad con código existente
export const generarCodigo = generateVerificationToken;

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

/**
 * Genera un JWT para la autenticación del usuario
 * @param {Object} user - Usuario para el que se genera el token
 * @returns {string} JWT generado
 */
export function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    roles: user.roles || ['user']
  };

  // Token de acceso - expira en 24 horas
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET || 'jwt_secret_key_development', 
    { expiresIn: '24h' }
  );
}

// Alias para compatibilidad con código existente
export function generarJWT(userId, email) {
  const payload = {
    userId,
    email
  };

  return jwt.sign(
    payload, 
    process.env.JWT_SECRET || 'jwt_secret_key_development', 
    { expiresIn: '24h' }
  );
}

/**
 * Genera un token de refresco para extender la sesión del usuario
 * @param {Object} user - Usuario para el que se genera el token
 * @returns {string} Token de refresco
 */
export function generateRefreshToken(user) {
  const payload = {
    id: user._id,
    type: 'refresh'
  };

  // Token de refresco - expira en 7 días
  return jwt.sign(
    payload, 
    process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key_development', 
    { expiresIn: '7d' }
  );
}

/**
 * Verifica un token de refresco
 * @param {string} token - Token a verificar
 * @returns {Object} Payload decodificado
 * @throws {Error} Si el token es inválido o ha expirado
 */
export function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key_development'
    );
    
    if (decoded.type !== 'refresh') {
      throw new Error('Token inválido');
    }
    
    return decoded;
  } catch (error) {
    throw error; // Re-lanzamos el error para manejarlo en el controlador
  }
}

/**
 * Verifica un JWT de acceso
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

/**
 * Genera un hash seguro para la contraseña del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Contraseña hasheada
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Compara una contraseña en texto plano con una hasheada
 * @param {string} password - Contraseña en texto plano
 * @param {string} hashedPassword - Contraseña hasheada
 * @returns {Promise<boolean>} true si coinciden, false si no
 */
export async function comparePasswords(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
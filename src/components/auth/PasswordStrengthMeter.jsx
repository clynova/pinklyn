'use client';

const PasswordStrengthMeter = ({ password }) => {
  // Función para evaluar la fortaleza de la contraseña
  const calculateStrength = (password) => {
    if (!password) return 0;
    
    let score = 0;
    
    // Criterios de evaluación
    if (password.length > 5) score += 1;
    if (password.length > 8) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    
    return score;
  };

  // Obtener la puntuación de la contraseña actual
  const strength = calculateStrength(password);
  
  // Definir el texto y color según la puntuación
  let strengthText = '';
  let strengthColor = '';
  let barWidth = '0%';
  
  switch (strength) {
    case 0:
      strengthText = password ? 'Muy débil' : '';
      strengthColor = 'bg-red-500';
      barWidth = '20%';
      break;
    case 1:
      strengthText = 'Débil';
      strengthColor = 'bg-red-500';
      barWidth = '20%';
      break;
    case 2:
      strengthText = 'Aceptable';
      strengthColor = 'bg-yellow-500';
      barWidth = '40%';
      break;
    case 3:
      strengthText = 'Buena';
      strengthColor = 'bg-yellow-300';
      barWidth = '60%';
      break;
    case 4:
      strengthText = 'Fuerte';
      strengthColor = 'bg-green-500';
      barWidth = '80%';
      break;
    case 5:
      strengthText = 'Muy fuerte';
      strengthColor = 'bg-green-400';
      barWidth = '100%';
      break;
    default:
      break;
  }

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
          <div 
            className={`h-full ${strengthColor} rounded-full transition-all duration-300 ease-in-out`} 
            style={{ width: barWidth }}
          ></div>
        </div>
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 min-w-[70px] text-right">
          {strengthText}
        </span>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
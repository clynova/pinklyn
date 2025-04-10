'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * Componente para ingresar un código de verificación con campos individuales
 * @param {Object} props
 * @param {number} props.length - Cantidad de dígitos del código (default: 6)
 * @param {Function} props.onChange - Función que recibe el valor completo del código
 * @param {string} props.initialValue - Valor inicial del código (opcional)
 */
const TokenInput = ({ length = 6, onChange, initialValue = '' }) => {
    const [code, setCode] = useState(Array(length).fill(''));
    const inputRefs = useRef([]);

    // Inicializar referencias para cada input
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    // Manejar valor inicial si existe
    useEffect(() => {
        if (initialValue && initialValue.length > 0) {
            const initialArray = initialValue.split('').slice(0, length);
            const filledArray = [...initialArray, ...Array(length - initialArray.length).fill('')];
            setCode(filledArray);
        }
    }, [initialValue, length]);

    // Notificar cambios al componente padre
    useEffect(() => {
        if (onChange) {
            onChange(code.join(''));
        }
    }, [code, onChange]);

    const handleChange = (e, index) => {
        const { value } = e.target;
        
        // Ignorar caracteres no numéricos
        if (value && !/^[0-9]$/.test(value.slice(-1))) {
            return;
        }
        
        // Actualizar el código
        const newCode = [...code];
        newCode[index] = value.slice(-1); // Tomar solo el último carácter
        setCode(newCode);
        
        // Si hay un valor y no es el último campo, moverse al siguiente
        if (value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Si es Backspace y está vacío, moverse al campo anterior
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        } 
        // Si es flecha izquierda, moverse al campo anterior
        else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        } 
        // Si es flecha derecha, moverse al campo siguiente
        else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
        
        if (pastedData) {
            const newCode = [...Array(length).fill('')];
            
            for (let i = 0; i < pastedData.length; i++) {
                newCode[i] = pastedData[i];
            }
            
            setCode(newCode);
            
            // Enfocar el siguiente campo vacío o el último si todos están llenos
            const nextEmptyIndex = newCode.findIndex(digit => !digit);
            if (nextEmptyIndex >= 0) {
                inputRefs.current[nextEmptyIndex].focus();
            } else if (inputRefs.current[length - 1]) {
                inputRefs.current[length - 1].focus();
            }
        }
    };

    return (
        <div className="flex justify-between gap-2 sm:gap-3">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-xl sm:text-2xl font-bold text-center rounded-lg 
                               border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 
                               focus:outline-none dark:bg-gray-800 bg-white transition-colors"
                    value={code[index] || ''}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined} // Solo permitir pegar en el primer campo
                    aria-label={`Código dígito ${index + 1}`}
                />
            ))}
        </div>
    );
};

export default TokenInput;
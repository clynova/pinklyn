/**
 * Middleware para validar los datos de productos antes de procesarlos
 */

// Función para validar la creación de productos
export async function validateProductCreate(request) {
  try {
    // Obtenemos el body de la request
    const body = await request.json().catch(() => ({}));
    
    // Lista para almacenar errores de validación
    const errors = {};
    
    // Validar campos obligatorios
    if (!body.nombre || body.nombre.trim() === '') {
      errors.nombre = 'El nombre del producto es obligatorio';
    } else if (body.nombre.length > 100) {
      errors.nombre = 'El nombre del producto no puede exceder los 100 caracteres';
    }
    
    if (!body.sku || body.sku.trim() === '') {
      errors.sku = 'El SKU del producto es obligatorio';
    } else if (!/^[A-Za-z0-9-_]+$/.test(body.sku)) {
      errors.sku = 'El SKU solo puede contener letras, números, guiones y guiones bajos';
    }
    
    if (!body.slug || body.slug.trim() === '') {
      errors.slug = 'El slug del producto es obligatorio';
    } else if (!/^[a-z0-9-]+$/.test(body.slug)) {
      errors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
    }
    
    if (!body.categoria) {
      errors.categoria = 'La categoría del producto es obligatoria';
    }
    
    // Validar variantes
    if (body.variantes && Array.isArray(body.variantes)) {
      const variantesErrors = [];
      
      body.variantes.forEach((variante, index) => {
        const varianteErrors = {};
        
        if (!variante.nombre || variante.nombre.trim() === '') {
          varianteErrors.nombre = 'El nombre de la variante es obligatorio';
        }
        
        if (variante.precio === undefined || variante.precio === null || isNaN(variante.precio)) {
          varianteErrors.precio = 'El precio de la variante es obligatorio y debe ser un número';
        } else if (variante.precio < 0) {
          varianteErrors.precio = 'El precio no puede ser negativo';
        }
        
        if (variante.descuento !== undefined && variante.descuento !== null) {
          if (isNaN(variante.descuento)) {
            varianteErrors.descuento = 'El descuento debe ser un número';
          } else if (variante.descuento < 0 || variante.descuento > 100) {
            varianteErrors.descuento = 'El descuento debe estar entre 0 y 100';
          }
        }
        
        if (variante.stockDisponible !== undefined && variante.stockDisponible !== null) {
          if (isNaN(variante.stockDisponible)) {
            varianteErrors.stockDisponible = 'El stock disponible debe ser un número';
          } else if (variante.stockDisponible < 0) {
            varianteErrors.stockDisponible = 'El stock disponible no puede ser negativo';
          }
        }
        
        // Agregar errores de esta variante si hay alguno
        if (Object.keys(varianteErrors).length > 0) {
          variantesErrors[index] = varianteErrors;
        }
      });
      
      // Agregar errores de variantes si hay alguno
      if (Object.keys(variantesErrors).length > 0) {
        errors.variantes = variantesErrors;
      }
      
      // Verificar que no haya más de una variante predeterminada
      const variantesPredeterminadas = body.variantes.filter(v => v.esPredeterminada).length;
      if (variantesPredeterminadas > 1) {
        if (!errors.variantes) errors.variantes = {};
        errors.variantes.general = 'Solo puede haber una variante predeterminada';
      }
    } else if (body.variantes !== undefined) {
      errors.variantes = 'Las variantes deben ser un array';
    }
    
    // Validar imágenes
    if (body.multimedia && body.multimedia.imagenes && Array.isArray(body.multimedia.imagenes)) {
      const imagenesErrors = [];
      
      body.multimedia.imagenes.forEach((imagen, index) => {
        const imagenErrors = {};
        
        if (!imagen.url || imagen.url.trim() === '') {
          imagenErrors.url = 'La URL de la imagen es obligatoria';
        } else if (!isValidURL(imagen.url)) {
          imagenErrors.url = 'La URL de la imagen no es válida';
        }
        
        // Agregar errores de esta imagen si hay alguno
        if (Object.keys(imagenErrors).length > 0) {
          imagenesErrors[index] = imagenErrors;
        }
      });
      
      // Agregar errores de imágenes si hay alguno
      if (Object.keys(imagenesErrors).length > 0) {
        if (!errors.multimedia) errors.multimedia = {};
        errors.multimedia.imagenes = imagenesErrors;
      }
      
      // Verificar que no haya más de una imagen principal
      if (body.multimedia.imagenes.filter(img => img.esPrincipal).length > 1) {
        if (!errors.multimedia) errors.multimedia = {};
        if (!errors.multimedia.imagenes) errors.multimedia.imagenes = {};
        errors.multimedia.imagenes.general = 'Solo puede haber una imagen principal';
      }
    }
    
    // Si hay errores, devolver error 400 con la lista de errores
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        errors,
        status: 400
      };
    }
    
    // Si no hay errores, devolver éxito y el body validado
    return {
      success: true,
      body
    };
  } catch (error) {
    console.error('Error validando producto:', error);
    return {
      success: false,
      errors: { general: 'Error al procesar la solicitud' },
      status: 500
    };
  }
}

// Función para validar la actualización de productos
export async function validateProductUpdate(request) {
  try {
    // Obtenemos el body de la request
    const body = await request.json().catch(() => ({}));
    
    // Lista para almacenar errores de validación
    const errors = {};
    
    // En actualizaciones los campos son opcionales, pero validamos si existen
    if (body.nombre !== undefined) {
      if (body.nombre.trim() === '') {
        errors.nombre = 'El nombre del producto no puede estar vacío';
      } else if (body.nombre.length > 100) {
        errors.nombre = 'El nombre del producto no puede exceder los 100 caracteres';
      }
    }
    
    if (body.sku !== undefined) {
      if (body.sku.trim() === '') {
        errors.sku = 'El SKU del producto no puede estar vacío';
      } else if (!/^[A-Za-z0-9-_]+$/.test(body.sku)) {
        errors.sku = 'El SKU solo puede contener letras, números, guiones y guiones bajos';
      }
    }
    
    if (body.slug !== undefined) {
      if (body.slug.trim() === '') {
        errors.slug = 'El slug del producto no puede estar vacío';
      } else if (!/^[a-z0-9-]+$/.test(body.slug)) {
        errors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
      }
    }
    
    // Validar variantes si están presentes
    if (body.variantes !== undefined) {
      if (!Array.isArray(body.variantes)) {
        errors.variantes = 'Las variantes deben ser un array';
      } else {
        // Misma lógica de validación que en create
        const variantesErrors = [];
        
        body.variantes.forEach((variante, index) => {
          const varianteErrors = {};
          
          if (variante.nombre !== undefined && variante.nombre.trim() === '') {
            varianteErrors.nombre = 'El nombre de la variante no puede estar vacío';
          }
          
          if (variante.precio !== undefined) {
            if (isNaN(variante.precio)) {
              varianteErrors.precio = 'El precio de la variante debe ser un número';
            } else if (variante.precio < 0) {
              varianteErrors.precio = 'El precio no puede ser negativo';
            }
          }
          
          if (variante.descuento !== undefined) {
            if (isNaN(variante.descuento)) {
              varianteErrors.descuento = 'El descuento debe ser un número';
            } else if (variante.descuento < 0 || variante.descuento > 100) {
              varianteErrors.descuento = 'El descuento debe estar entre 0 y 100';
            }
          }
          
          if (variante.stockDisponible !== undefined) {
            if (isNaN(variante.stockDisponible)) {
              varianteErrors.stockDisponible = 'El stock disponible debe ser un número';
            } else if (variante.stockDisponible < 0) {
              varianteErrors.stockDisponible = 'El stock disponible no puede ser negativo';
            }
          }
          
          // Agregar errores de esta variante si hay alguno
          if (Object.keys(varianteErrors).length > 0) {
            variantesErrors[index] = varianteErrors;
          }
        });
        
        // Agregar errores de variantes si hay alguno
        if (Object.keys(variantesErrors).length > 0) {
          errors.variantes = variantesErrors;
        }
        
        // Verificar que no haya más de una variante predeterminada
        const variantesPredeterminadas = body.variantes.filter(v => v.esPredeterminada).length;
        if (variantesPredeterminadas > 1) {
          if (!errors.variantes) errors.variantes = {};
          errors.variantes.general = 'Solo puede haber una variante predeterminada';
        }
      }
    }
    
    // Validar imágenes si están presentes
    if (body.multimedia && body.multimedia.imagenes !== undefined) {
      if (!Array.isArray(body.multimedia.imagenes)) {
        if (!errors.multimedia) errors.multimedia = {};
        errors.multimedia.imagenes = 'Las imágenes deben ser un array';
      } else {
        // Misma lógica de validación que en create
        const imagenesErrors = [];
        
        body.multimedia.imagenes.forEach((imagen, index) => {
          const imagenErrors = {};
          
          if (imagen.url !== undefined && (imagen.url.trim() === '' || !isValidURL(imagen.url))) {
            imagenErrors.url = imagen.url.trim() === '' ? 
              'La URL de la imagen no puede estar vacía' : 
              'La URL de la imagen no es válida';
          }
          
          // Agregar errores de esta imagen si hay alguno
          if (Object.keys(imagenErrors).length > 0) {
            imagenesErrors[index] = imagenErrors;
          }
        });
        
        // Agregar errores de imágenes si hay alguno
        if (Object.keys(imagenesErrors).length > 0) {
          if (!errors.multimedia) errors.multimedia = {};
          errors.multimedia.imagenes = imagenesErrors;
        }
        
        // Verificar que no haya más de una imagen principal
        if (body.multimedia.imagenes.filter(img => img.esPrincipal).length > 1) {
          if (!errors.multimedia) errors.multimedia = {};
          if (!errors.multimedia.imagenes) errors.multimedia.imagenes = {};
          errors.multimedia.imagenes.general = 'Solo puede haber una imagen principal';
        }
      }
    }
    
    // Si hay errores, devolver error 400 con la lista de errores
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        errors,
        status: 400
      };
    }
    
    // Si no hay errores, devolver éxito y el body validado
    return {
      success: true,
      body
    };
  } catch (error) {
    console.error('Error validando actualización de producto:', error);
    return {
      success: false,
      errors: { general: 'Error al procesar la solicitud' },
      status: 500
    };
  }
}

// Función auxiliar para validar URLs
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const CategoriaProducto = ['ARTE', 'JOYERIA', 'DECORACION', 'TEXTILES', 'ACCESORIOS', 'OTRO'];
const TipoPersonalizacion = ['NOMBRE', 'MENSAJE', 'DISENO', 'NINGUNO'];

export default function FormularioProducto({ producto, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    nombre: '',
    sku: '',
    slug: '',
    categoria: 'OTRO',
    estado: true,
    descripcion: {
      corta: '',
      completa: '',
      caracteristicasDestacadas: ['']
    },
    multimedia: {
      imagenes: [{ url: '', textoAlternativo: '', esPrincipal: true, orden: 0 }],
      video: ''
    },
    personalizacion: {
      tipo: 'NINGUNO',
      detalles: ''
    },
    variantes: [
      {
        nombre: 'Estándar',
        precio: 0,
        descuento: 0,
        stockDisponible: 0,
        umbralStockBajo: 5,
        sku: '',
        esPredeterminada: true
      }
    ],
    tags: [''],
    usosRecomendados: [''],
    infoAdicional: {
      origen: '',
      artesano: '',
      certificaciones: ['']
    },
    conservacion: {
      instrucciones: ''
    },
    seo: {
      metaTitulo: '',
      metaDescripcion: '',
      palabrasClave: [''],
      pageTitle: ''
    }
  });

  // Cargamos los datos del producto para edición
  useEffect(() => {
    if (producto) {
      // Aseguramos que todos los arrays existan para evitar errores
      const productoConDefaultsArrays = {
        ...producto,
        descripcion: {
          ...producto.descripcion,
          caracteristicasDestacadas: producto.descripcion?.caracteristicasDestacadas || ['']
        },
        multimedia: {
          ...producto.multimedia,
          imagenes: producto.multimedia?.imagenes?.length ? producto.multimedia.imagenes : [{ url: '', textoAlternativo: '', esPrincipal: true, orden: 0 }]
        },
        variantes: producto.variantes?.length ? producto.variantes : [
          { nombre: 'Estándar', precio: 0, descuento: 0, stockDisponible: 0, umbralStockBajo: 5, sku: '', esPredeterminada: true }
        ],
        tags: producto.tags?.length ? producto.tags : [''],
        usosRecomendados: producto.usosRecomendados?.length ? producto.usosRecomendados : [''],
        infoAdicional: {
          ...producto.infoAdicional,
          certificaciones: producto.infoAdicional?.certificaciones || ['']
        },
        seo: {
          ...producto.seo,
          palabrasClave: producto.seo?.palabrasClave || ['']
        }
      };

      setFormData(productoConDefaultsArrays);
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setFormData({
        ...formData,
        [parentKey]: {
          ...formData[parentKey],
          [childKey]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleArrayChange = (e, index, arrayName) => {
    const { value } = e.target;
    const nameParts = arrayName.split('.');
    
    if (nameParts.length === 1) {
      // Array simple
      const newArray = [...formData[arrayName]];
      newArray[index] = value;
      setFormData({ ...formData, [arrayName]: newArray });
    } else if (nameParts.length === 2) {
      // Array anidado dentro de un objeto
      const [parent, child] = nameParts;
      const newArray = [...formData[parent][child]];
      newArray[index] = value;
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: newArray
        }
      });
    }
  };

  const agregarElementoArray = (arrayName) => {
    const nameParts = arrayName.split('.');
    
    if (nameParts.length === 1) {
      // Array simple
      setFormData({
        ...formData,
        [arrayName]: [...formData[arrayName], '']
      });
    } else if (nameParts.length === 2) {
      // Array anidado dentro de un objeto
      const [parent, child] = nameParts;
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: [...formData[parent][child], '']
        }
      });
    }
  };

  const eliminarElementoArray = (index, arrayName) => {
    const nameParts = arrayName.split('.');
    
    if (nameParts.length === 1) {
      // Array simple
      if (formData[arrayName].length > 1) {
        const newArray = formData[arrayName].filter((_, i) => i !== index);
        setFormData({ ...formData, [arrayName]: newArray });
      }
    } else if (nameParts.length === 2) {
      // Array anidado dentro de un objeto
      const [parent, child] = nameParts;
      if (formData[parent][child].length > 1) {
        const newArray = formData[parent][child].filter((_, i) => i !== index);
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: newArray
          }
        });
      }
    }
  };

  // Manejo de variantes
  const handleVarianteChange = (index, field, value) => {
    const newVariantes = [...formData.variantes];
    newVariantes[index] = {
      ...newVariantes[index],
      [field]: field === 'esPredeterminada' ? value : 
               (field === 'precio' || field === 'descuento' || field === 'stockDisponible' || field === 'umbralStockBajo') ? 
               Number(value) : value
    };
    
    // Si estamos marcando esta variante como predeterminada, desmarcamos las demás
    if (field === 'esPredeterminada' && value === true) {
      newVariantes.forEach((v, i) => {
        if (i !== index) {
          newVariantes[i] = { ...newVariantes[i], esPredeterminada: false };
        }
      });
    }
    
    setFormData({
      ...formData,
      variantes: newVariantes
    });
  };

  const agregarVariante = () => {
    const newVariante = {
      nombre: '',
      precio: 0,
      descuento: 0,
      stockDisponible: 0,
      umbralStockBajo: 5,
      sku: '',
      esPredeterminada: false
    };
    
    setFormData({
      ...formData,
      variantes: [...formData.variantes, newVariante]
    });
  };

  const eliminarVariante = (index) => {
    if (formData.variantes.length > 1) {
      let newVariantes = formData.variantes.filter((_, i) => i !== index);
      
      // Si eliminamos la variante predeterminada, marcamos la primera como predeterminada
      if (formData.variantes[index].esPredeterminada && newVariantes.length > 0) {
        newVariantes[0] = { ...newVariantes[0], esPredeterminada: true };
      }
      
      setFormData({
        ...formData,
        variantes: newVariantes
      });
    }
  };

  // Manejo de imágenes
  const handleImagenChange = (index, field, value) => {
    const newImagenes = [...formData.multimedia.imagenes];
    newImagenes[index] = {
      ...newImagenes[index],
      [field]: field === 'esPrincipal' ? value : field === 'orden' ? Number(value) : value
    };
    
    // Si estamos marcando esta imagen como principal, desmarcamos las demás
    if (field === 'esPrincipal' && value === true) {
      newImagenes.forEach((img, i) => {
        if (i !== index) {
          newImagenes[i] = { ...newImagenes[i], esPrincipal: false };
        }
      });
    }
    
    setFormData({
      ...formData,
      multimedia: {
        ...formData.multimedia,
        imagenes: newImagenes
      }
    });
  };

  const agregarImagen = () => {
    const newImagen = {
      url: '',
      textoAlternativo: '',
      esPrincipal: false,
      orden: formData.multimedia.imagenes.length
    };
    
    setFormData({
      ...formData,
      multimedia: {
        ...formData.multimedia,
        imagenes: [...formData.multimedia.imagenes, newImagen]
      }
    });
  };

  const eliminarImagen = (index) => {
    if (formData.multimedia.imagenes.length > 1) {
      let newImagenes = formData.multimedia.imagenes.filter((_, i) => i !== index);
      
      // Si eliminamos la imagen principal, marcamos la primera como principal
      if (formData.multimedia.imagenes[index].esPrincipal && newImagenes.length > 0) {
        newImagenes[0] = { ...newImagenes[0], esPrincipal: true };
      }
      
      // Reordenar los índices
      newImagenes = newImagenes.map((img, i) => ({
        ...img,
        orden: i
      }));
      
      setFormData({
        ...formData,
        multimedia: {
          ...formData.multimedia,
          imagenes: newImagenes
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Eliminar cualquier campo vacío en los arrays antes de enviar
    const limpiarArrays = (obj) => {
      const newObj = { ...obj };
      
      Object.keys(newObj).forEach(key => {
        // Si es un array
        if (Array.isArray(newObj[key])) {
          // Si los elementos son strings, filtramos los vacíos
          if (typeof newObj[key][0] === 'string') {
            newObj[key] = newObj[key].filter(item => item.trim() !== '');
            // Si quedó vacío, ponerle al menos un elemento
            if (newObj[key].length === 0) newObj[key] = [''];
          }
        } 
        // Si es un objeto, procesarlo recursivamente
        else if (typeof newObj[key] === 'object' && newObj[key] !== null) {
          newObj[key] = limpiarArrays(newObj[key]);
        }
      });
      
      return newObj;
    };
    
    const datosLimpios = limpiarArrays(formData);
    onSubmit(datosLimpios);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        {/* Sección Información Básica */}
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Información Básica</h3>
          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                SKU <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="sku"
                  id="sku"
                  required
                  value={formData.sku}
                  onChange={handleChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-2 text-sm text-gray-500">URL amigable para el producto. Ej: pulsera-artesanal-plata</p>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Categoría <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <select
                  id="categoria"
                  name="categoria"
                  required
                  value={formData.categoria}
                  onChange={handleChange}
                  className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                >
                  {CategoriaProducto.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Estado
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <input
                    id="estado"
                    name="estado"
                    type="checkbox"
                    checked={formData.estado}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="estado" className="ml-2 block text-sm text-gray-900">
                    Producto activo
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Descripción */}
        <div className="pt-8 sm:pt-10">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Descripción</h3>
          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="descripcion.corta" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Descripción corta
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="descripcion.corta"
                  name="descripcion.corta"
                  rows={3}
                  value={formData.descripcion.corta}
                  onChange={handleChange}
                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                />
                <p className="mt-2 text-sm text-gray-500">Máximo 160 caracteres.</p>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="descripcion.completa" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Descripción completa
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="descripcion.completa"
                  name="descripcion.completa"
                  rows={5}
                  value={formData.descripcion.completa}
                  onChange={handleChange}
                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Características destacadas
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                {formData.descripcion.caracteristicasDestacadas.map((caract, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={caract}
                      onChange={(e) => handleArrayChange(e, index, 'descripcion.caracteristicasDestacadas')}
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarElementoArray(index, 'descripcion.caracteristicasDestacadas')}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => agregarElementoArray('descripcion.caracteristicasDestacadas')}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaPlus className="mr-2" /> Añadir característica
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Variantes */}
        <div className="pt-8 sm:pt-10">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Variantes del Producto</h3>
          <div className="mt-6 sm:mt-5">
            {formData.variantes.map((variante, index) => (
              <div key={index} className="border border-gray-300 p-4 mb-4 rounded-md">
                <h4 className="text-md font-medium mb-2">Variante {index + 1}</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`variante-nombre-${index}`} className="block text-sm font-medium text-gray-700">
                      Nombre de la variante
                    </label>
                    <input
                      type="text"
                      id={`variante-nombre-${index}`}
                      value={variante.nombre}
                      onChange={(e) => handleVarianteChange(index, 'nombre', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`variante-sku-${index}`} className="block text-sm font-medium text-gray-700">
                      SKU de la variante
                    </label>
                    <input
                      type="text"
                      id={`variante-sku-${index}`}
                      value={variante.sku}
                      onChange={(e) => handleVarianteChange(index, 'sku', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`variante-precio-${index}`} className="block text-sm font-medium text-gray-700">
                      Precio
                    </label>
                    <input
                      type="number"
                      id={`variante-precio-${index}`}
                      min="0"
                      step="0.01"
                      value={variante.precio}
                      onChange={(e) => handleVarianteChange(index, 'precio', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`variante-descuento-${index}`} className="block text-sm font-medium text-gray-700">
                      Descuento (%)
                    </label>
                    <input
                      type="number"
                      id={`variante-descuento-${index}`}
                      min="0"
                      max="100"
                      value={variante.descuento}
                      onChange={(e) => handleVarianteChange(index, 'descuento', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`variante-stock-${index}`} className="block text-sm font-medium text-gray-700">
                      Stock disponible
                    </label>
                    <input
                      type="number"
                      id={`variante-stock-${index}`}
                      min="0"
                      value={variante.stockDisponible}
                      onChange={(e) => handleVarianteChange(index, 'stockDisponible', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`variante-umbral-${index}`} className="block text-sm font-medium text-gray-700">
                      Umbral de stock bajo
                    </label>
                    <input
                      type="number"
                      id={`variante-umbral-${index}`}
                      min="0"
                      value={variante.umbralStockBajo}
                      onChange={(e) => handleVarianteChange(index, 'umbralStockBajo', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center">
                    <input
                      id={`variante-predeterminada-${index}`}
                      type="checkbox"
                      checked={variante.esPredeterminada}
                      onChange={(e) => handleVarianteChange(index, 'esPredeterminada', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`variante-predeterminada-${index}`} className="ml-2 block text-sm text-gray-900">
                      Establecer como variante predeterminada
                    </label>
                  </div>
                </div>
                
                {formData.variantes.length > 1 && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => eliminarVariante(index)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaTrash className="mr-2" /> Eliminar variante
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={agregarVariante}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPlus className="mr-2" /> Añadir nueva variante
            </button>
          </div>
        </div>

        {/* Sección Multimedia */}
        <div className="pt-8 sm:pt-10">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Imágenes y Multimedia</h3>
          <div className="mt-6 sm:mt-5">
            {formData.multimedia.imagenes.map((imagen, index) => (
              <div key={index} className="border border-gray-300 p-4 mb-4 rounded-md">
                <h4 className="text-md font-medium mb-2">Imagen {index + 1}</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`imagen-url-${index}`} className="block text-sm font-medium text-gray-700">
                      URL de la imagen
                    </label>
                    <input
                      type="text"
                      id={`imagen-url-${index}`}
                      value={imagen.url}
                      onChange={(e) => handleImagenChange(index, 'url', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`imagen-alt-${index}`} className="block text-sm font-medium text-gray-700">
                      Texto alternativo
                    </label>
                    <input
                      type="text"
                      id={`imagen-alt-${index}`}
                      value={imagen.textoAlternativo}
                      onChange={(e) => handleImagenChange(index, 'textoAlternativo', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`imagen-orden-${index}`} className="block text-sm font-medium text-gray-700">
                      Orden de visualización
                    </label>
                    <input
                      type="number"
                      id={`imagen-orden-${index}`}
                      min="0"
                      value={imagen.orden}
                      onChange={(e) => handleImagenChange(index, 'orden', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center">
                    <input
                      id={`imagen-principal-${index}`}
                      type="checkbox"
                      checked={imagen.esPrincipal}
                      onChange={(e) => handleImagenChange(index, 'esPrincipal', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`imagen-principal-${index}`} className="ml-2 block text-sm text-gray-900">
                      Establecer como imagen principal
                    </label>
                  </div>
                </div>
                
                {formData.multimedia.imagenes.length > 1 && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => eliminarImagen(index)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaTrash className="mr-2" /> Eliminar imagen
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={agregarImagen}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPlus className="mr-2" /> Añadir nueva imagen
            </button>
            
            <div className="mt-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="multimedia.video" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                URL de video
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="multimedia.video"
                  id="multimedia.video"
                  value={formData.multimedia.video}
                  onChange={handleChange}
                  className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección Etiquetas y SEO */}
        <div className="pt-8 sm:pt-10">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Etiquetas y SEO</h3>
          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Etiquetas (tags)
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange(e, index, 'tags')}
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarElementoArray(index, 'tags')}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => agregarElementoArray('tags')}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaPlus className="mr-2" /> Añadir etiqueta
                </button>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="seo.metaTitulo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Meta título
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="seo.metaTitulo"
                  id="seo.metaTitulo"
                  value={formData.seo.metaTitulo}
                  onChange={handleChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="seo.metaDescripcion" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Meta descripción
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="seo.metaDescripcion"
                  name="seo.metaDescripcion"
                  rows={3}
                  value={formData.seo.metaDescripcion}
                  onChange={handleChange}
                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                />
                <p className="mt-2 text-sm text-gray-500">Máximo 160 caracteres.</p>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Palabras clave
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                {formData.seo.palabrasClave.map((palabra, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={palabra}
                      onChange={(e) => handleArrayChange(e, index, 'seo.palabrasClave')}
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarElementoArray(index, 'seo.palabrasClave')}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => agregarElementoArray('seo.palabrasClave')}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaPlus className="mr-2" /> Añadir palabra clave
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Guardando...' : producto ? 'Actualizar producto' : 'Crear producto'}
          </button>
        </div>
      </div>
    </form>
  );
}
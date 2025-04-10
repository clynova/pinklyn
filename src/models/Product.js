import mongoose from 'mongoose';
const { Schema } = mongoose;

const CategoriaProducto = ['ARTE', 'JOYERIA', 'DECORACION', 'TEXTILES', 'ACCESORIOS', 'OTRO'];
const TipoPersonalizacion = ['NOMBRE', 'MENSAJE', 'DISENO', 'NINGUNO'];
const TipoProducto = ['ARTESANAL', 'GENERICO'];

// Base Product Schema
const EsquemaProductoBase = new Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    categoria: {
        type: String,
        enum: CategoriaProducto,
        required: true
    },
    estado: {
        type: Boolean,
        default: true // Cambiado a true para que los productos estén disponibles por defecto
    },
    descripcion: {
        corta: {
            type: String,
            maxlength: 160
        },
        completa: {
            type: String
        },
        caracteristicasDestacadas: [String] // Nueva propiedad para destacar características únicas
    },
    multimedia: {
        imagenes: [{
            url: {
                type: String,
                required: true
            },
            textoAlternativo: String,
            esPrincipal: {
                type: Boolean,
                default: false
            },
            orden: {
                type: Number,
                default: 0 // Nuevo campo para ordenar las imágenes
            }
        }],
        video: String
    },
    seo: {
        metaTitulo: String,
        metaDescripcion: {
            type: String,
            maxlength: 160
        },
        palabrasClave: [String],
        pageTitle: String // Nuevo campo para el título de la página
    },
    infoAdicional: {
        origen: String,
        artesano: String, // Nuevo campo para destacar al creador/artesano
        marca: String,    // Para productos genéricos
        proveedor: String, // Para productos genéricos
        certificaciones: [String]
    },
    conservacion: {
        instrucciones: String // Simplificado para productos no perecederos
    },
    personalizacion: {
        tipo: {
            type: String,
            enum: TipoPersonalizacion,
            default: 'NINGUNO'
        },
        detalles: String // Detalles sobre cómo se puede personalizar el producto
    },
    variantes: [{
        nombre: String, // Por ejemplo, "Tamaño Grande", "Color Azul"
        precio: Number,
        descuento: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        stockDisponible: {
            type: Number,
            min: 0,
            default: 0
        },
        umbralStockBajo: {
            type: Number,
            default: 5
        },
        sku: String,
        ultimaActualizacion: {
            type: Date,
            default: Date.now
        },
        estado: {
            type: Boolean,
            default: true
        },
        esPredeterminada: {
            type: Boolean,
            default: false
        }
    }],
    tipoProducto: {
        type: String,
        enum: TipoProducto,
        default: 'ARTESANAL'
    },
    tags: [{ type: String, trim: true }],
    usosRecomendados: [String],
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' },
    discriminatorKey: 'tipoProducto',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false
});

// Virtual para seleccionar automáticamente una variante predeterminada
EsquemaProductoBase.virtual('variantePredeterminada').get(function() {
    // Primero buscamos una variante marcada explícitamente como predeterminada
    let predeterminada = this.variantes.find(variante => variante.esPredeterminada);
    
    // Si no hay ninguna marcada como predeterminada, tomamos la primera disponible con stock
    if (!predeterminada) {
        predeterminada = this.variantes.find(variante => variante.stockDisponible > 0);
    }
    
    // Si tampoco hay con stock, simplemente tomamos la primera
    if (!predeterminada && this.variantes.length > 0) {
        predeterminada = this.variantes[0];
    }
    
    return predeterminada || null;
});

// Virtual que calcula el precio con descuento para cada variante
EsquemaProductoBase.virtual('variantesConPrecioFinal').get(function() {
    return this.variantes.map(variante => {
        const precioConDescuento = variante.descuento > 0 
            ? variante.precio - (variante.precio * variante.descuento / 100)
            : variante.precio;
            
        return {
            ...variante.toObject(),
            precioFinal: parseFloat(precioConDescuento.toFixed(2)),
            tieneDescuento: variante.descuento > 0
        };
    });
});

// Método para obtener el precio final de una variante específica por su ID
EsquemaProductoBase.methods.calcularPrecioFinal = function(varianteId) {
    const variante = this.variantes.id(varianteId);
    if (!variante) return null;
    
    const precioConDescuento = variante.descuento > 0 
        ? variante.precio - (variante.precio * variante.descuento / 100)
        : variante.precio;
        
    return parseFloat(precioConDescuento.toFixed(2));
};

// Pre-save hook para garantizar que solo una variante sea la predeterminada
EsquemaProductoBase.pre('save', function(next) {
    // Si hay al menos una variante marcada como predeterminada, nos aseguramos que sea solo una
    const predeterminadas = this.variantes.filter(v => v.esPredeterminada);
    
    if (predeterminadas.length > 1) {
        // Si hay más de una, dejamos solo la primera como predeterminada
        for (let i = 1; i < predeterminadas.length; i++) {
            predeterminadas[i].esPredeterminada = false;
        }
    } else if (this.variantes.length > 0 && predeterminadas.length === 0) {
        // Si no hay ninguna predeterminada pero hay variantes, establecemos la primera como predeterminada
        this.variantes[0].esPredeterminada = true;
    }
    
    next();
});

const Product = mongoose.models.Product || mongoose.model('Product', EsquemaProductoBase);

export default Product;
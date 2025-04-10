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
        default: true
    },
    descripcion: {
        corta: {
            type: String,
            maxlength: 160
        },
        completa: {
            type: String
        },
        caracteristicasDestacadas: [String]
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
                default: 0
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
        pageTitle: String
    },
    infoAdicional: {
        origen: String,
        artesano: String,
        marca: String,
        proveedor: String,
        certificaciones: [String]
    },
    conservacion: {
        instrucciones: String
    },
    personalizacion: {
        tipo: {
            type: String,
            enum: TipoPersonalizacion,
            default: 'NINGUNO'
        },
        detalles: String
    },
    variantes: [{
        nombre: String,
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
    discriminatorKey: 'tipoProducto'
});

const Product = mongoose.models.Product || mongoose.model('Product', EsquemaProductoBase);

export default Product;
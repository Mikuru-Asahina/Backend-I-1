const mongoose = require("mongoose")
const paginate = require("mongoose-paginate-v2")

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "El título es obligatorio"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "La descripción es obligatoria"]
        },
        price: {
            type: Number,
            required: [true, "El precio es obligatorio"],
            min: [1, "El precio no puede ser negativo ni mucho menos nulo"]
        },
        code: {
            type: String,
            required: [true, "El código es obligatorio"],
            unique: true,
            trim: true
        },
        stock: {
            type: Number,
            required: [true, "El stock es obligatorio"],
            min: [1, "El stock no puede ser negativo y ni nulo"],
            default: 1
        },
        category: {
            type: String,
            required: [true, "La categoría es obligatoria"]
        },
        status: {
            type: Boolean,
            default: true
        },
        thumbnails: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
)

productSchema.plugin(paginate)

const productsModel = mongoose.model("products", productSchema)

module.exports = { productsModel }
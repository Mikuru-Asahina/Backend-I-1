const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId, // referencia a productos
                    ref: "products", // nombre de la colección relacionada
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "La cantidad mínima es 1"],
                    default: 1
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

const cartsModel = mongoose.model("carts", cartSchema)

module.exports = { cartsModel }

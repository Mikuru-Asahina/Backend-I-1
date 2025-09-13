const fs = require("fs");
const path = require("path");

//const rutaDatos = path.join(__dirname, "../data/carts.json);

//const cartsModel = require("../dao/models/cartsModel")

class CartManager {
    // Obtener todos los carritos
    static async getCarts() {
        return await CartManager.find();
    }

    // Crear carrito
    static async createCart() {
        return await CartManager.create({ products: [] });
    }

    // Buscar carrito por ID
    static async getCartById(id) {
        return await CartManager.findById(id);
    }

    // Agregar producto al carrito
    static async addProductToCart(cid, product) {
        return await CartManager.findByIdAndUpdate(
            cid,
            { $push: { products: product } },
            { new: true }
        );
    }
}

module.exports = { CartManager }
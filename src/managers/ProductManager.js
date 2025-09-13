const fs = require("fs")
const path = require("path")

const rutaDatos = path.join(__dirname, "../data/products.json");

//const productsModel = require("../dao/models/productsModel");

class ProductManager {
    //Obtener todos los productos
    static async getProducts() {
        return await ProductManager.find()
    }
    //Buscar un producto por filtro (ejemplo: { code: "ABC123" })
    static async getProductBy(filtro = {}) {
        return await ProductManager.findOne(filtro)  
    }
    //Crear un nuevo producto
    static async createProduct(product) {
        return await ProductManager.create(product)
    }
    //Actualizar un producto (devuelve el producto actualizado o null si no existe)
    static async updateProduct(id, updates) {
        return await ProductManager.findByIdAndUpdate(id, updates, { new: true })
    }
    //Eliminar un producto (devuelve el producto eliminado o null si no existe)
    static async deleteProduct(id) {
        return await ProductManager.findByIdAndDelete(id)
    }
}

module.exports = { ProductManager }

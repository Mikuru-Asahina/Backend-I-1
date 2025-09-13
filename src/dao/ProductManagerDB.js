const { productsModel } = require("./models/productsModel.js")

class ProductManager {
    // Obtener todos los productos
    static async getProducts(limit=5, page=1) {
        //return await productsModel.find().lean()
        return await productsModel.paginate({}, {limit, page, lean:true})
    }
    // Obtener producto por un filtro ( { code: "ABC" })
    static async getProductBy(filtro = {}) {
        return await productsModel.findOne(filtro).lean()
    }
    // Crear un producto nuevo
    static async createProduct(product) {
        return await productsModel.create(product)
    }
    // Actualizar un producto por ID
    static async updateProduct(id, product) {
        return await productsModel.findByIdAndUpdate(id, product, {
            new: true,            // devuelve el documento actualizado
            runValidators: true   // valida los datos según el esquema
        })
    }
    // Eliminar un producto por ID
    static async deleteProduct(id) {
        return await productsModel.findByIdAndDelete(id)
    }
}

module.exports = { ProductManager }
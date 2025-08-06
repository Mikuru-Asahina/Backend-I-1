const fs = require("fs")
const path = require("path")

const rutaDatos = path.join(__dirname, "../data/products.json");

class ProductManager {
    static rutaDatos = rutaDatos
    
    static async getProducts() {
        if (fs.existsSync(this.rutaDatos)) {
            return JSON.parse(await fs.promises.readFile(this.rutaDatos, "utf-8"))
        } else {
            return []
        }
    }

    static async getProductById(id) {
        const products = await this.getProducts()
        return products.find(p => p.id === id) || `No se encontró el producto con id ${id}`
    }

    static async addProduct({ title, description, price, code, stock, category, thumbnails = [], status = true }) {
        const products = await this.getProducts();

        if (typeof title !== "string" || !title.trim()) {
            throw new Error("El campo 'title' es obligatorio y debe ser una cadena de texto.")
        }
        if (typeof description !== "string" || !description.trim()) {
            throw new Error("El campo 'description' es obligatorio y debe ser una cadena de texto.")
        }
        if (typeof code !== "string" || !code.trim()) {
            throw new Error("El campo 'code' es obligatorio y debe ser una cadena de texto.")
        }
        if (typeof price !== "number" || isNaN(price)) {
            throw new Error("El campo 'price' es obligatorio y debe ser un número.")
        }
        if (typeof stock !== "number" || isNaN(stock)) {
            throw new Error("El campo 'stock' es obligatorio y debe ser un número.")
        }
        if (typeof category !== "string" || !category.trim()) {
            throw new Error("El campo 'category' es obligatorio y debe ser una cadena de texto.")
        }
        if (!Array.isArray(thumbnails)) {
            throw new Error("El campo 'thumbnails' debe ser un arreglo de cadenas.")
        }
        if (!thumbnails.every(item => typeof item === "string" && item.trim() !== "")) {
            throw new Error("Todos los elementos en 'thumbnails' deben ser cadenas de texto no vacías.")
        }
        if (typeof status !== "boolean") {
            throw new Error("El campo 'status' debe ser un valor booleano.");
        }

        const exists = products.find(p => p.code === code)
        if (exists) {
            throw new Error(`El código "${code}" ya está registrado.`)
        }

        let id = 1
        if (products.length > 0) {
            id = Math.max(...products.map(p => p.id)) + 1
        }

        const newProduct = {
            id,
            title,
            description,
            price,
            code,
            stock,
            category,
            thumbnails,
            status
        };

        products.push(newProduct);
        await fs.promises.writeFile(this.rutaDatos, JSON.stringify(products, null, 2))
        return newProduct;
    }

    static async deleteProduct(id) {
        const products = await this.getProducts()
        const updated = products.filter(p => p.id !== id)
        if (products.length === updated.length) return false

        await fs.promises.writeFile(this.rutaDatos, JSON.stringify(updated, null, 2))
        return true
    }

    static async updateProduct(id, updates) {
        const products = await this.getProducts()
        const index = products.findIndex(p => p.id === id)
        if (index === -1) return null

        const updatedProduct = { ...products[index], ...updates, id: products[index].id }
        products[index] = updatedProduct

        await fs.promises.writeFile(this.rutaDatos, JSON.stringify(products, null, 2))
        return updatedProduct
    }
}

module.exports = { ProductManager }
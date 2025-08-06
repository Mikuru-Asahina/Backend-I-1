const fs = require('fs')
const path = require('path')

class CartManager {
    constructor(cartPath) {
        this.cartPath = cartPath
    }

    async #readCarts() {
        try {
            if (fs.existsSync(this.cartPath)) {
                return JSON.parse(await fs.promises.readFile(this.cartPath, 'utf-8'))
            } else {
                return []
            }
        } catch (error) {
            throw new Error('Error al leer el archivo de carritos: ' + error.message)
        }
    }

    async #writeCarts(data) {
        try {
            await fs.promises.writeFile(this.cartPath, JSON.stringify(data, null, 2))
        } catch (error) {
            throw new Error('Error al escribir el archivo de carritos: ' + error.message)
        }
    }

    async createCart() {
        const carts = await this.#readCarts()
        const newCart = {
            id: carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1,
            products: []
        }
        carts.push(newCart)
        await this.#writeCarts(carts)
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.#readCarts()
        return carts.find(c => c.id === id)
    }

    async addProductToCart(cid, pid) {
        const carts = await this.#readCarts()
        const cart = carts.find(c => c.id === cid)
        if (!cart) return null;

        const existingProduct  = cart.products.findIndex(p => p.product === pid)

        if (existingProduct  !== -1) {
            cart.products[existingProduct].quantity += 1
        } else {
            cart.products.push({ product: pid, quantity: 1 })
        }

        await this.#writeCarts(carts)
        return cart
    }
}

module.exports = {CartManager}
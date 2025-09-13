/* */
const { cartsModel } = require("./models/cartsModel")

class CartManager {
    // Crear un carrito vacío
    static async createCart() {
        return await cartsModel.create({ products: [] })
    }
    // Obtener un carrito por ID, con populate (productos completos)
    static async getCartById(id) {
        return await cartsModel.findById(id).populate("products.product").lean()
    }
    // Agregar un producto a un carrito
    static async addProductToCart(cid, pid) {
        const cart = await cartsModel.findById(cid)
        if (!cart) return null

        const existingProduct = cart.products.find(p => p.product.toString() === pid)
        if (existingProduct) {
            existingProduct.quantity += 1
        } else {
            cart.products.push({ product: pid, quantity: 1 })
        }
        return await cart.save()
    }

    // Eliminar un producto específico del carrito
    static async removeProductFromCart(cid, pid) {
        const cart = await cartsModel.findById(cid)
        if (!cart) return null   // si no existe el carrito
        // Buscar si el producto está en el carrito
        const productInCart = cart.products.find(p => p.product.toString() === pid)
        if (!productInCart) {
            return "PRODUCT_NOT_FOUND" // retornamos un valor especial para indicar que el producto no existe
        }
        // Eliminar el producto del carrito
        cart.products = cart.products.filter(p => p.product.toString() !== pid)
        return await cart.save()
    }
    // Actualizar todos los productos del carrito
    static async updateCartProducts(cid, products) {
        const cart = await cartsModel.findById(cid)
        if (!cart) return null

        cart.products = products
        return await cart.save()
    }

    // Actualizar cantidad de un producto específico en el carrito
    static async updateProductQuantity(cid, pid, quantity) {
        const cart = await cartsModel.findById(cid)
        if (!cart) return null

        const productInCart = cart.products.find(p => p.product.toString() === pid)
        if (!productInCart) return null

        productInCart.quantity = quantity
        return await cart.save()
    }

    // Eliminar todos los productos del carrito
    static async clearCart(cid) {
        const cart = await cartsModel.findById(cid)
        if (!cart) return null // carrito no existe

        if (cart.products.length === 0) {
            // el carrito existe, pero ya estaba vacío
            return "CART_ALREADY_EMPTY"
        }
        
        cart.products = [] // vaciar productos
        return await cart.save()
    }
}

module.exports = { CartManager }

/*La razón de porque tiene un poco de lógica la class CartManager es debido:
1. Si TODA la lógica se encuentra en cartsRoutes; la ruta tendría lógica del negocio mezclada con Express.
2. Esto representa un inconveniente ya que si realizamos un Testing se vuelve más difícil porque la lógica está mezclada con Express.
3. Por otro lado, la ruta tendria lógica repetida (find, cart.save()) si se encuentra encapsulado TODA la lógica en cartsRoutes.
4. Finalmente, si mañana decido cambiar de MongoDB → MySQL, tendria que reescribir todas las rutas que se encuentran en cartsRoutes.
*/
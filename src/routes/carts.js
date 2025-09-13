const {Router} = require('express')
const router = Router()
//const { CartManager } = require("../managers/CartManager")

const { CartManager } = require("../dao/CartManagerDB")

// Crear carrito
router.post("/", async (req, res) => {
    try {
        const newCart = await CartManager.createCart()
        res.status(201).json({ message: "Carrito creado", cart: newCart })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})
// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartManager.getCartById(cid)

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" })
        }

        res.status(200).json({ products: cart.products })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})
// Agregar producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params
        // Validar si el carrito existe
        const cart = await CartManager.getCartById(cid)
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" })
        }

        const updatedCart = await CartManager.addProductToCart(cid, pid)
        res.status(200).json({ message: `Producto ${pid} agregado al carrito ${cid}`, cart: updatedCart })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})
// Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params

        const result = await CartManager.removeProductFromCart(cid, pid)
        if (!result) {
            return res.status(404).json({ message: `Carrito con ID: ${cid} no encontrado` })
        }
        if (result === "PRODUCT_NOT_FOUND") {
            return res.status(404).json({ 
                message: `Producto con ID: ${pid} no existe porque no se encuentra en el carrito con ID: ${cid}` 
            })
        }
        res.status(200).json({ message: `Producto ${pid} eliminado del carrito ${cid}`, cart: result })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})
// Actualizar todos los productos del carrito
router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const { products } = req.body // Debe ser un array de productos

        if (!Array.isArray(products)) {
            return res.status(400).json({ message: "El cuerpo debe contener un arreglo de productos" })
        }

        const cart = await CartManager.updateCartProducts(cid, products)
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" })
        }
        res.status(201).json({ message: `Carrito ${cid} actualizado`, cart })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})
// Actualizar la cantidad de un producto específico en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        if (typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({ message: "La cantidad debe ser un número positivo" })
        }

        const cart = await CartManager.updateProductQuantity(cid, pid, quantity)
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" })
        }
        res.status(201).json({ message: `Cantidad de producto ${pid} actualizada en el carrito ${cid}`, cart })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})
// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const result = await CartManager.clearCart(cid)

        if (!result) {
            return res.status(404).json({ message: `Carrito con ID: ${cid} no existe` })
        }
        if (result === "CART_ALREADY_EMPTY") {
            return res.status(400).json({ message: `El carrito con ID: ${cid} ya se encuentra vacío` })
        }
        res.status(200).json({ message: `Todos los productos eliminados del carrito ${cid}`, cart: result })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})

module.exports = router

/*
routes/carts.js = cartsRoutes.js = archivo de definición de rutas HTTP.
👉 cartsRoutes → define endpoints HTTP.
👉 CartManager → encapsula toda la lógica con Mongoose.
*/
const {Router} = require('express')
const router = Router()
const { ProductManager } = require('../managers/ProductManager')

//los métodos estáticos se llaman directamente sobre la clase, no sobre una instancia.
//const productManager = new ProductManager() XXX MALO porque sale error

router.get('/', async (req, res) => {
    try {
        const products = await ProductManager.getProducts()
        res.json({ products })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid)
        const product = await ProductManager.getProductById(id)
        if (!product || typeof product === 'string') {
            return res.status(404).json({ message: product })
        }
        res.json({ product })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { title, description, price, code, stock, category, thumbnails, status } = req.body
        const newProduct = await ProductManager.addProduct({ title, description, price, code, stock, category, thumbnails, status })

        const products = await ProductManager.getProducts();

        req.socket.emit("updateProducts", products)
        req.socket.emit("productAdded", newProduct);

        res.status(201).json({  product: newProduct, message: `Producto nuevo añadido` })
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid)
        const updated = await ProductManager.updateProduct(id, req.body)
        if (!updated) return res.status(404).json({ message: "Producto no encontrado" })

        res.json({ product: updated , message: `Producto modificado`})
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid)
        const result = await ProductManager.deleteProduct(id)
        if (!result) return res.status(404).json({ message: "Producto no encontrado" })

        const products = await ProductManager.getProducts()

        req.socket.emit("updateProducts", products)
        req.socket.emit("productDeleted", id)

        res.json({ message: `Producto con id ${id} eliminado` })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})

module.exports = router
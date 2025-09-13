const {Router} = require('express')
const router = Router()
//const { ProductManager } = require('../managers/ProductManager')

const { ProductManager } = require("../dao/ProductManagerDB")

//all products
router.get("/", async (req, res) => {
    let {limit, page}=req.query
    try {
        let products = await ProductManager.getProducts(limit, page)
        res.status(200).json({ products })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})

//product by id
router.get("/:pid", async (req, res) => {
    try {
        const id = req.params.pid 
        const product = await ProductManager.getProductBy({ _id: id })

        if (!product) {
            return res.status(404).json({ message: `No se encontró el producto con id ${id}` })
        }

        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//create products
router.post('/', async (req, res) => {
    try {
        const { title, description, price, code, stock, category, thumbnails = [], status = true } = req.body
        //Validaciones aquí:
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ error: "El campo 'title' es obligatorio y debe ser una cadena." })
        }
        if (typeof description !== "string" || !description.trim()) {
            return res.status(400).json({ error: "El campo 'description' es obligatorio y debe ser una cadena." })
        }
        if (typeof code !== "string" || !code.trim()) {
            return res.status(400).json({ error: "El campo 'code' es obligatorio y debe ser una cadena." })
        }
        if (typeof price !== "number" || isNaN(price)) {
            return res.status(400).json({ error: "El campo 'price' es obligatorio y debe ser un número." })
        }
        if (typeof stock !== "number" || isNaN(stock)) {
            return res.status(400).json({ error: "El campo 'stock' es obligatorio y debe ser un número." })
        }
        if (typeof category !== "string" || !category.trim()) {
            return res.status(400).json({ error: "El campo 'category' es obligatorio y debe ser una cadena." })
        }
        if (!Array.isArray(thumbnails) || !thumbnails.every(item => typeof item === "string" && item.trim() !== "")) {
            return res.status(400).json({ error: "El campo 'thumbnails' debe ser un arreglo de cadenas no vacías." })
        }
        if (typeof status !== "boolean") {
            return res.status(400).json({ error: "El campo 'status' debe ser booleano." })
        }
        //Verificar código único
        const exists = await ProductManager.getProductBy({ code })
        if (exists) {
            return res.status(400).json({ error: `El código "${code}" ya está registrado.` })
        }
        //Crear producto
        const newProduct = await ProductManager.createProduct({
            title, description, price, code, stock, category, thumbnails, status
        })

        const products = await ProductManager.getProducts()

        req.socket.emit("updateProducts", products)
        req.socket.emit("productAdded", newProduct)

        res.status(201).json({ product: newProduct, message: "Producto nuevo añadido" })

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})

//update product
router.put("/:pid", async (req, res) => {
    try {
        const id = req.params.pid 

        const updated = await ProductManager.updateProduct(id, req.body)
        if (!updated) {
            return res.status(404).json({ message: `Producto no encontrado con id: ${id}` })
        }

        res.status(201).json({ product: updated, message: `Producto modificado con id: ${id}` })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})

//delete product
router.delete("/:pid", async (req, res) => {
    try {
        const id = req.params.pid 

        const result = await ProductManager.deleteProduct(id)
        if (!result) {
            return res.status(404).json({ message: `Producto no encontrado con id: ${id}` })
        }

        const products = await ProductManager.getProducts()

        req.socket.emit("updateProducts", products)
        req.socket.emit("productDeleted", id)

        res.status(200).json({ message: `Producto con id ${id} eliminado` })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
})

module.exports = router

const express = require('express')
const router = express.Router()
//const { ProductManager } = require('../managers/ProductManager')

//Vistas para la 2da entrega
/*
router.get('/products', async (req, res) => {
    try {
        const products = await ProductManager.getProducts()
        res.render('products', { products })
    } catch (error) {
        res.status(500).render('products', { products: [], error: 'Error al cargar los productos' })
    }
})

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await ProductManager.getProducts()
        res.render('realTimeProducts', { products })
    } catch (error) {
        res.status(500).send("Error al cargar productos")
    }
})
*/

//Vistas para la entrega FINAL
const {productsModel} = require("../dao/models/productsModel")
const {cartsModel} = require("../dao/models/cartsModel")

// Ruta para mostrar productos
router.get("/products", async (req, res) => {
    try {
        let { page = 1, limit = 5, sort, query } = req.query
    // filtro opcional (por categoría u otro campo)
        let filter = {}
        if (query) {
            filter = { category: query }
            }
    // opciones de paginate
    const options = {
        page: parseInt(page, 5) || 1,
        limit: parseInt(limit, 5) || 5,
        sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
        lean: true // convierte documentos a objetos planos. IMPORTANTE ya que si no Handlebras se queja y no se visualiza la informacion solicitada
        }

    const result = await productsModel.paginate(filter, options)
    const {
        docs: products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage} = result

    res.render("products", {
        products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage,
        page: result.page,  // página actual
        prevLink: hasPrevPage ? `/views/products?page=${prevPage}&limit=${limit}` : null,
        nextLink: hasNextPage ? `/views/products?page=${nextPage}&limit=${limit}` : null
        })
    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        return res.status(500).json({ error: "Internal server error" })
    }
})
// Ruta para mostrar un carrito específico
router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartsModel.findById(cid).populate("products.product").lean()

        if (!cart) {
            return res.status(404).send("Carrito no encontrado")
        }
        res.render("carts", { cart }) 
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router

const express = require('express')
const router = express.Router()
const { ProductManager } = require('../managers/ProductManager')

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

module.exports = router